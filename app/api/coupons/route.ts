//api/coupons/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { CouponService } from '@/lib/coupon-service';
import { IApiResponse, ICoupon, ICouponCreateData } from '@/types/coupon';

export async function POST(request: NextRequest): Promise<NextResponse<IApiResponse<ICoupon>>> {
  try {
    const body: ICouponCreateData = await request.json();
    const {
      code,
      type,
      discountType,
      discountValue,
      minimumAmount,
      maxDiscount,
      expiryDate,
      usageLimit,
      description
    } = body;

    // Validation
    if (!code || !type || !discountType || discountValue === undefined) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields: code, type, discountType, discountValue'
      }, { status: 400 });
    }

    if (!['first_order', 'minimum_amount'].includes(type)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid coupon type. Must be first_order or minimum_amount'
      }, { status: 400 });
    }

    if (type === 'minimum_amount' && !minimumAmount) {
      return NextResponse.json({
        success: false,
        message: 'minimumAmount is required for minimum_amount type coupons'
      }, { status: 400 });
    }

    if (!['percentage', 'fixed'].includes(discountType)) {
      return NextResponse.json({
        success: false,
        message: 'discountType must be either percentage or fixed'
      }, { status: 400 });
    }

    const couponData: ICouponCreateData = {
      code,
      type,
      discountType,
      discountValue,
      minimumAmount: minimumAmount || 0,
      maxDiscount,
      expiryDate: expiryDate ? new Date(expiryDate) : undefined,
      usageLimit,
      description: description || ''
    };

    const result = await CouponService.createCoupon(couponData);

    if (!result.success) {
      return NextResponse.json({
        success: false,
        message: result.message
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      data: result.data
    }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: error.message
    }, { status: 500 });
  }
}

export async function GET(): Promise<NextResponse<IApiResponse<ICoupon[]>>> {
  try {
    const result = await CouponService.getCoupons();
    
    if (!result.success) {
      return NextResponse.json({
        success: false,
        message: result.message
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      data: result.data,
      count: result.data?.length || 0
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: error.message
    }, { status: 500 });
  }
}
