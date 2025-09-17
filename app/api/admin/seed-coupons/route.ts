// app/api/admin/seed-coupons/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Coupon from '@/models/Coupon';

const testCoupons = [
  
  {
    code: 'SAVE10',
    type: 'minimum_amount',
    discountType: 'percentage',
    discountValue: 10,
    minimumAmount: 2000,
    maxDiscount: 1000,
    expiryDate: new Date('2026-06-30'),
    usageLimit: 500,
    description: '10% off on orders above ₹2000',
    isActive: true
  },
  
  
];

export async function POST(request: NextRequest) {
  try {
    // Optional: Add basic authentication for production
    const authHeader = request.headers.get('authorization');
    if (process.env.NODE_ENV === 'production' && authHeader !== `Bearer ${process.env.ADMIN_SECRET_KEY}`) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    // Clear existing test coupons
    const testCodes = testCoupons.map(c => c.code);
    const deleteResult = await Coupon.deleteMany({ code: { $in: testCodes } });

    // Insert new test coupons
    const insertResult = await Coupon.insertMany(testCoupons);

    return NextResponse.json({
      success: true,
      message: 'Test coupons seeded successfully',
      data: {
        deleted: deleteResult.deletedCount,
        created: insertResult.length,
        coupons: insertResult.map(c => ({
          code: c.code,
          type: c.type,
          discountType: c.discountType,
          discountValue: c.discountValue,
          description: c.description,
          isActive: c.isActive,
          expiryDate: c.expiryDate
        }))
      }
    });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Failed to seed coupons', error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: false,
    message: 'Use POST method to seed coupons'
  }, { status: 405 });
}