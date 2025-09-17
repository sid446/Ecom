import { Document, Types } from 'mongoose';

export interface ICoupon extends Document {
  _id: Types.ObjectId;
  code: string;
  type: 'first_order' | 'minimum_amount';
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minimumAmount: number;
  maxDiscount?: number;
  expiryDate?: Date;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Virtual properties
  isExpired: boolean;
  isUsageLimitReached: boolean;
  
  // Methods
  isAvailable(): boolean;
  calculateDiscount(orderAmount: number): {
    discountAmount: number;
    finalAmount: number;
  };
}

export interface IValidationResult {
  isValid: boolean;
  message?: string;
  coupon?: {
    id: string;
    code: string;
    type: string;
    description: string;
  };
  discount?: {
    type: string;
    value: number;
    amount: number;
    maxDiscount?: number;
  };
  order?: {
    originalAmount: number;
    discountAmount: number;
    finalAmount: number;
  };
  error?: string;
}

export interface IApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  count?: number;
}

export interface ICouponCreateData {
  code: string;
  type: 'first_order' | 'minimum_amount';
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minimumAmount?: number;
  maxDiscount?: number;
  expiryDate?: Date | string;
  usageLimit?: number;
  description?: string;
}

export interface IOrderSummary {
  orderId: string;
  totalPrice: number;
  status: string;
  createdAt: Date;
}