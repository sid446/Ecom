
// models/Coupon.ts - Coupon Model with TypeScript
import mongoose, { Schema, Model } from 'mongoose';
import { ICoupon } from '@/types/coupon';

const couponSchema = new Schema<ICoupon>({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
    index: true
  },
  type: {
    type: String,
    required: true,
    enum: ['first_order', 'minimum_amount'],
    index: true
  },
  discountType: {
    type: String,
    required: true,
    enum: ['percentage', 'fixed']
  },
  discountValue: {
    type: Number,
    required: true,
    min: 0
  },
  minimumAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  maxDiscount: {
    type: Number,
    min: 0,
    default: null
  },
  expiryDate: {
    type: Date,
    default: null,
    index: true
  },
  usageLimit: {
    type: Number,
    min: 0,
    default: null
  },
  usedCount: {
    type: Number,
    default: 0,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  }
}, {
  timestamps: true,
  collection: 'coupons'
});

// Indexes for performance
couponSchema.index({ code: 1, isActive: 1 });
couponSchema.index({ type: 1, isActive: 1 });
couponSchema.index({ expiryDate: 1, isActive: 1 });
couponSchema.index({ createdAt: -1 });

// Virtual for checking if coupon is expired
couponSchema.virtual('isExpired').get(function(this: ICoupon) {
  return this.expiryDate ? this.expiryDate < new Date() : false;
});

// Virtual for checking if usage limit reached
couponSchema.virtual('isUsageLimitReached').get(function(this: ICoupon) {
  return this.usageLimit ? this.usedCount >= this.usageLimit : false;
});

// Method to validate coupon availability
couponSchema.methods.isAvailable = function(this: ICoupon): boolean {
  return this.isActive && !this.isExpired && !this.isUsageLimitReached;
};

// Method to calculate discount
couponSchema.methods.calculateDiscount = function(this: ICoupon, orderAmount: number) {
  let discountAmount = 0;
  
  if (this.discountType === 'percentage') {
    discountAmount = (orderAmount * this.discountValue) / 100;
    if (this.maxDiscount && discountAmount > this.maxDiscount) {
      discountAmount = this.maxDiscount;
    }
  } else {
    discountAmount = Math.min(this.discountValue, orderAmount);
  }
  
  return {
    discountAmount,
    finalAmount: Math.max(0, orderAmount - discountAmount)
  };
};

// Pre-save middleware
couponSchema.pre<ICoupon>('save', function(next) {
  if (this.isNew) {
    this.code = this.code.toUpperCase();
  }
  next();
});

const Coupon: Model<ICoupon> = mongoose.models.Coupon || mongoose.model<ICoupon>('Coupon', couponSchema);

export default Coupon;
