// File: /api/coupons/[code]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { CouponService } from '@/lib/coupon-service';
import { IApiResponse, ICoupon, ICouponCreateData } from '@/types/coupon';

export async function GET(
  request: NextRequest,
  context: any
): Promise<NextResponse<IApiResponse<ICoupon>>> {
  try {
    const result = await CouponService.getCouponByCode(context.params.code);
   
    if (!result.success) {
      return NextResponse.json({
        success: false,
        message: result.message
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      message: result.message,
      data: result.data
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: error.message
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  context: any
): Promise<NextResponse<IApiResponse<ICoupon>>> {
  try {
    const body: ICouponCreateData = await request.json();
    const code = context.params.code;
    
    // Validate required fields
    if (!body.type || !body.discountType || body.discountValue === undefined) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields: type, discountType, discountValue'
      }, { status: 400 });
    }

    // Validate discount value
    if (body.discountType === 'percentage' && (body.discountValue < 0 || body.discountValue > 100)) {
      return NextResponse.json({
        success: false,
        message: 'Percentage discount must be between 0 and 100'
      }, { status: 400 });
    }

    if (body.discountType === 'fixed' && body.discountValue < 0) {
      return NextResponse.json({
        success: false,
        message: 'Fixed discount amount must be positive'
      }, { status: 400 });
    }

    // Validate minimum amount for minimum_amount type coupons
    if (body.type === 'minimum_amount' && (!body.minimumAmount || body.minimumAmount <= 0)) {
      return NextResponse.json({
        success: false,
        message: 'Minimum amount is required and must be positive for minimum_amount type coupons'
      }, { status: 400 });
    }

    // Validate expiry date if provided
    if (body.expiryDate && new Date(body.expiryDate) <= new Date()) {
      return NextResponse.json({
        success: false,
        message: 'Expiry date must be in the future'
      }, { status: 400 });
    }

    // Validate usage limit if provided
    if (body.usageLimit && body.usageLimit < 1) {
      return NextResponse.json({
        success: false,
        message: 'Usage limit must be at least 1'
      }, { status: 400 });
    }

    const result = await CouponService.updateCoupon(code, body);
   
    if (!result.success) {
      const statusCode = result.message === 'Coupon not found' ? 404 : 400;
      return NextResponse.json({
        success: false,
        message: result.message
      }, { status: statusCode });
    }
    
    return NextResponse.json({
      success: true,
      message: result.message,
      data: result.data
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: error.message
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: any
): Promise<NextResponse<IApiResponse>> {
  try {
    const result = await CouponService.deleteCoupon(context.params.code);
   
    if (!result.success) {
      const statusCode = result.message === 'Coupon not found' ? 404 : 400;
      return NextResponse.json({
        success: false,
        message: result.message
      }, { status: statusCode });
    }
    
    return NextResponse.json({
      success: true,
      message: result.message
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: error.message
    }, { status: 500 });
  }
}

// Optional: Add PATCH for toggling status
export async function PATCH(
  request: NextRequest,
  context: any
): Promise<NextResponse<IApiResponse<ICoupon>>> {
  try {
    const body = await request.json();
    const code = context.params.code;
    
    // If the request is to toggle status
    if (body.action === 'toggle-status') {
      const result = await CouponService.toggleCouponStatus(code);
      
      if (!result.success) {
        const statusCode = result.message === 'Coupon not found' ? 404 : 400;
        return NextResponse.json({
          success: false,
          message: result.message
        }, { status: statusCode });
      }
      
      return NextResponse.json({
        success: true,
        message: result.message,
        data: result.data
      });
    }
    
    return NextResponse.json({
      success: false,
      message: 'Invalid action'
    }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: error.message
    }, { status: 500 });
  }
}