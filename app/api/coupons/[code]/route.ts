import { NextRequest, NextResponse } from 'next/server';
import { CouponService } from '@/lib/coupon-service';
import { IApiResponse, ICoupon } from '@/types/coupon';

interface RouteParams {
  params: {
    code: string;
  };
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<IApiResponse<ICoupon>>> {
  try {
    const result = await CouponService.getCouponByCode(params.code);
    
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
  { params }: RouteParams
): Promise<NextResponse<IApiResponse>> {
  try {
    const result = await CouponService.deleteCoupon(params.code);
    
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