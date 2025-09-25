// File: /api/coupons/[code]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { CouponService } from '@/lib/coupon-service';
import { IApiResponse, ICoupon } from '@/types/coupon';

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

export async function DELETE(
  request: NextRequest,
  context: any
): Promise<NextResponse<IApiResponse>> {
  try {
    const result = await CouponService.deleteCoupon(context.params.code);
    
    if (!result.success) {
      return NextResponse.json({
        success: false,
        message: result.message
      }, { status: 404 });
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