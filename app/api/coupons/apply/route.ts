import { NextRequest, NextResponse } from 'next/server';
import { CouponService } from '@/lib/coupon-service';
import { IApiResponse } from '@/types/coupon';
//api/coupons/apply/route.ts
interface ApplyRequest {
  code: string;
  orderAmount: number;
  orderId: string;
  email: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<IApiResponse>> {
  try {
    const body: ApplyRequest = await request.json();
    const { code, orderAmount, orderId, email } = body;

    if (!code || orderAmount === undefined || !orderId || !email) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields: code, orderAmount, orderId, email'
      }, { status: 400 });
    }

    if (typeof orderAmount !== 'number' || orderAmount <= 0) {
      return NextResponse.json({
        success: false,
        message: 'orderAmount must be a positive number'
      }, { status: 400 });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({
        success: false,
        message: 'Please provide a valid email address'
      }, { status: 400 });
    }

    const result = await CouponService.applyCoupon(code, orderAmount, orderId, email);

    if (!result.success) {
      return NextResponse.json({
        success: false,
        message: result.message
      }, { status: 400 });
    }

    return NextResponse.json(result);

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: error.message
    }, { status: 500 });
  }
}