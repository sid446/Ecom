// File: app/api/admin/returns/route.ts
import { NextRequest, NextResponse } from 'next/server'
import Return from '@/models/Return'
import { connectToDatabase } from '@/lib/mongodb'

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()

    // Get all returns for admin dashboard
    const returns = await Return.find({})
      .populate({
        path: 'order',
        select: 'orderId orderItems totalPrice createdAt shippingAddress'
      })
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })

    return NextResponse.json(returns)

  } catch (error) {
    console.error('Error fetching admin returns:', error)
    return NextResponse.json({ error: 'Failed to fetch returns' }, { status: 500 })
  }
}