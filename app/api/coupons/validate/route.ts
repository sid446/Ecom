import { NextRequest, NextResponse } from 'next/server';
import { CouponService } from '@/lib/coupon-service';
import { IApiResponse } from '@/types/coupon';

interface ValidateRequest {
  code: string;
  orderAmount: number;
  email: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<IApiResponse>> {
  try {
    const body: ValidateRequest = await request.json();
    const { code, orderAmount, email } = body;

    if (!code || orderAmount === undefined || !email) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields: code, orderAmount, email'
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

    const result = await CouponService.validateCoupon(code, orderAmount, email);

    if (!result.isValid) {
      return NextResponse.json({
        success: false,
        message: result.message || 'Coupon validation failed'
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: result.message || 'Coupon validated successfully',
      data: {
        coupon: result.coupon,
        discount: result.discount,
        order: result.order
      }
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: error.message
    }, { status: 500 });
  }
}
