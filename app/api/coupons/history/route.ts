import { NextRequest, NextResponse } from 'next/server';
import { CouponService } from '@/lib/coupon-service';
import { IApiResponse } from '@/types/coupon';

export async function GET(request: NextRequest): Promise<NextResponse<IApiResponse>> {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({
        success: false,
        message: 'Email parameter is required'
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

    const result = await CouponService.getUserCouponHistory(email);

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