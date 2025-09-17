import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, currency = 'INR' } = body

    // Validate amount
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      )
    }

    // Create Razorpay order
    const orderOptions = {
      amount: Math.round(amount), // Amount in paise (smallest currency unit)
      currency: currency,
      receipt: 'receipt_' + Math.random().toString(36).substring(7),
      payment_capture: 1, // Auto capture payment
    }

    const order: any = await razorpay.orders.create(orderOptions)

    console.log('Razorpay order created:', order)

    return NextResponse.json(
      { 
        orderId: order.id,
        amount: orderOptions.amount,
        currency: orderOptions.currency,
        receipt: order.receipt || orderOptions.receipt
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error creating Razorpay order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}