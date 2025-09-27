import Coupon from '@/models/Coupon';
import { User, IUser } from '@/models/User';
import Order from '@/models/Order';
import { connectToDatabase } from './mongodb';
import { 
  ICoupon, 
  IValidationResult, 
  ICouponCreateData, 
  IOrderSummary,
  IApiResponse 
} from '@/types/coupon';
import { Types } from 'mongoose';

export class CouponService {
  
  static async updateCoupon(code: string, updateData: ICouponCreateData): Promise<IApiResponse<ICoupon>> {
    await connectToDatabase();
    
    try {
      const coupon = await Coupon.findOne({ code: code.toUpperCase() });
      if (!coupon) {
        return { success: false, message: 'Coupon not found' };
      }

      // Update coupon fields
      Object.keys(updateData).forEach(key => {
        if (updateData[key as keyof ICouponCreateData] !== undefined) {
          (coupon as any)[key] = updateData[key as keyof ICouponCreateData];
        }
      });

      coupon.updatedAt = new Date();
      await coupon.save();

      return { 
        success: true, 
        message: 'Coupon updated successfully', 
        data: coupon 
      };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }

  static async validateCoupon(
    code: string, 
    orderAmount: number,
    email: string
  ): Promise<IValidationResult> {
    await connectToDatabase();

    try {
      // Find coupon and user
      const [coupon, user] = await Promise.all([
        Coupon.findOne({ code: code.toUpperCase() }),
        User.findOne({ email: email.toLowerCase() })
      ]);

      if (!coupon) {
        return { isValid: false, message: 'Coupon not found' };
      }

      // Check coupon availability with proper virtual property access
      if (!coupon.isAvailable()) {
        let message = 'Coupon is not available';
        
        // Check expiry date directly
        const isExpired = coupon.expiryDate ? coupon.expiryDate < new Date() : false;
        // Check usage limit directly  
        const isUsageLimitReached = coupon.usageLimit ? coupon.usedCount >= coupon.usageLimit : false;
        
        if (isExpired) {
          message = 'Coupon has expired';
        } else if (isUsageLimitReached) {
          message = 'Coupon usage limit exceeded';
        } else if (!coupon.isActive) {
          message = 'Coupon is inactive';
        }
        return { isValid: false, message };
      }

      // Check if this email has already used this specific coupon
      if (user) {
        const existingOrder = await Order.findOne({
          user: user._id,
          couponCode: coupon.code
        });

        if (existingOrder) {
          return { 
            isValid: false, 
            message: 'You have already used this coupon' 
          };
        }

        // Check for first order coupon validation
        if (coupon.type === 'first_order') {
          const userOrderCount = await Order.countDocuments({ user: user._id });
          if (userOrderCount > 0) {
            return { 
              isValid: false, 
              message: 'This coupon is only valid for first-time customers' 
            };
          }
        }
      } else {
        // New user - first order coupons are always valid for new users
        // minimum_amount coupons are also valid if they meet the criteria
      }

      // Check minimum amount requirement
      if (coupon.type === 'minimum_amount' && orderAmount < coupon.minimumAmount) {
        return { 
          isValid: false, 
          message: `Order amount must be at least ₹${coupon.minimumAmount} to use this coupon` 
        };
      }

      // Calculate discount
      const { discountAmount, finalAmount } = coupon.calculateDiscount(orderAmount);

      return {
        isValid: true,
        message: 'Coupon is valid',
        coupon: {
          id: coupon._id.toString(),
          code: coupon.code,
          type: coupon.type,
          description: coupon.description
        },
        discount: {
          type: coupon.discountType,
          value: coupon.discountValue,
          amount: discountAmount,
          maxDiscount: coupon.maxDiscount || undefined
        },
        order: {
          originalAmount: orderAmount,
          discountAmount: discountAmount,
          finalAmount: finalAmount
        }
      };

    } catch (error: any) {
      return { 
        isValid: false, 
        message: 'Error validating coupon', 
        error: error.message 
      };
    }
  }

  static async applyCoupon(
    code: string,  
    orderAmount: number, 
    orderId: string,
    email: string
  ): Promise<IApiResponse> {
    await connectToDatabase();
    
    try {
      // First validate the coupon with email
      const validation = await this.validateCoupon(code, orderAmount, email);
      
      if (!validation.isValid) {
        return {
          success: false,
          message: validation.message || 'Coupon validation failed'
        };
      }

      // Find or create user
      let user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        user = new User({ email: email.toLowerCase() });
        await user.save();
      }

      // Update coupon usage count
      const coupon = await Coupon.findOne({ code: code.toUpperCase() });
      if (!coupon) {
        return { success: false, message: 'Coupon not found' };
      }

      // Update the order with coupon information
      const order = await Order.findOne({ orderId });
      if (order) {
        order.couponCode = coupon.code;
        order.couponDiscount = validation.order?.discountAmount || 0;
        order.originalAmount = validation.order?.originalAmount || orderAmount;
        order.totalPrice = validation.order?.finalAmount || orderAmount;
        await order.save();
      }

      coupon.usedCount += 1;
      await coupon.save();

      return {
        success: true,
        message: 'Coupon applied successfully',
        data: {
          orderId,
          couponCode: coupon.code,
          originalAmount: validation.order?.originalAmount,
          discountAmount: validation.order?.discountAmount,
          finalAmount: validation.order?.finalAmount,
          appliedAt: new Date()
        }
      };

    } catch (error: any) {
      return { 
        success: false, 
        message: 'Error applying coupon', 
        error: error.message 
      };
    }
  }

  // Check if email has used any coupon before (for analytics)
  static async getUserCouponHistory(email: string): Promise<IApiResponse> {
    await connectToDatabase();
    
    try {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return { 
          success: true, 
          message: 'No coupon history found',
          data: { orders: [], totalSaved: 0, couponsUsed: 0 }
        };
      }

      const orders = await Order.find({ 
        user: user._id,
        couponCode: { $exists: true, $ne: null }
      }).select('orderId couponCode couponDiscount originalAmount totalPrice createdAt');

      const totalSaved = orders.reduce((sum, order) => sum + (order.couponDiscount || 0), 0);

      return {
        success: true,
        message: 'Coupon history retrieved successfully',
        data: {
          orders,
          totalSaved,
          couponsUsed: orders.length
        }
      };

    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }

  static async createCoupon(couponData: ICouponCreateData): Promise<IApiResponse<ICoupon>> {
    await connectToDatabase();
    
    try {
      // Check if coupon code already exists
      const existingCoupon = await Coupon.findOne({ code: couponData.code.toUpperCase() });
      if (existingCoupon) {
        return { success: false, message: 'Coupon code already exists' };
      }

      // Create new coupon with uppercase code
      const couponToCreate = {
        ...couponData,
        code: couponData.code.toUpperCase()
      };

      const coupon = new Coupon(couponToCreate);
      await coupon.save();
      return { success: true, message: 'Coupon created successfully', data: coupon };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }

  static async getCoupons(): Promise<IApiResponse<ICoupon[]>> {
    await connectToDatabase();
    
    try {
      const coupons = await Coupon.find({}).sort({ createdAt: -1 });
      return { success: true, message: 'Coupons retrieved successfully', data: coupons };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }

  static async getCouponByCode(code: string): Promise<IApiResponse<ICoupon>> {
    await connectToDatabase();
    
    try {
      const coupon = await Coupon.findOne({ code: code.toUpperCase() });
      if (!coupon) {
        return { success: false, message: 'Coupon not found' };
      }
      return { success: true, message: 'Coupon retrieved successfully', data: coupon };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }

  static async deleteCoupon(code: string): Promise<IApiResponse> {
    await connectToDatabase();
    
    try {
      const coupon = await Coupon.findOne({ code: code.toUpperCase() });
      if (!coupon) {
        return { success: false, message: 'Coupon not found' };
      }

      // Check if coupon has been used
      if (coupon.usedCount > 0) {
        return { 
          success: false, 
          message: 'Cannot delete a coupon that has been used. Deactivate it instead.' 
        };
      }

      await Coupon.findOneAndDelete({ code: code.toUpperCase() });
      return { success: true, message: 'Coupon deleted successfully' };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }

  static async toggleCouponStatus(code: string): Promise<IApiResponse<ICoupon>> {
    await connectToDatabase();
    
    try {
      const coupon = await Coupon.findOne({ code: code.toUpperCase() });
      if (!coupon) {
        return { success: false, message: 'Coupon not found' };
      }

      coupon.isActive = !coupon.isActive;
      coupon.updatedAt = new Date();
      await coupon.save();

      return { 
        success: true, 
        message: `Coupon ${coupon.isActive ? 'activated' : 'deactivated'} successfully`, 
        data: coupon 
      };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }

  static async getCouponAnalytics(couponCode?: string) {
    await connectToDatabase();
    
    try {
      const matchStage: any = {};
      if (couponCode) {
        matchStage.code = couponCode.toUpperCase();
      }

      const analytics = await Coupon.aggregate([
        { $match: matchStage },
        {
          $project: {
            code: 1,
            type: 1,
            discountType: 1,
            discountValue: 1,
            usedCount: 1,
            usageLimit: 1,
            isActive: 1,
            createdAt: 1,
            usagePercentage: {
              $cond: {
                if: { $gt: ['$usageLimit', 0] },
                then: { $multiply: [{ $divide: ['$usedCount', '$usageLimit'] }, 100] },
                else: null
              }
            }
          }
        },
        { $sort: { createdAt: -1 } }
      ]);

      return {
        success: true,
        message: 'Analytics retrieved successfully',
        data: analytics
      };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }
}