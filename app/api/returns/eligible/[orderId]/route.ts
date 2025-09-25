// api/returns/eligible/[orderId]/route.ts

import { NextRequest, NextResponse } from 'next/server'
import Order from '@/models/Order'
import { connectToDatabase } from '@/lib/mongodb'

export async function GET(
  request: NextRequest,
  context: any
) {
  try {
    await connectToDatabase()

    const order = await Order.findById(context.params.orderId)
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Check if order is within return window
    let withinReturnWindow = false
    let returnWindowExpiresAt = null

    // Enhanced delivery check - either isDelivered or status is 'delivered'
    const orderDelivered = order.isDelivered || order.status === 'delivered'
    
    if (orderDelivered && order.isReturnEligible) {
      // Use deliveredAt if available, otherwise use createdAt as fallback
      const referenceDate = order.deliveredAt ? new Date(order.deliveredAt) : new Date(order.createdAt)
      const returnWindowEnd = new Date(referenceDate)
      returnWindowEnd.setDate(referenceDate.getDate() + 30) // 30-day return window
      
      withinReturnWindow = new Date() <= returnWindowEnd
      returnWindowExpiresAt = returnWindowEnd
    }

    // Get returnable items
    const returnableItems = order.orderItems.filter((item: any) =>
      (!item.returnStatus || item.returnStatus === 'none') &&
      (!item.returnQuantity || item.quantity > item.returnQuantity)
    ).map((item: any) => ({
      _id: item._id,
      name: item.name,
      size: item.size,
      image: item.image,
      price: item.price,
      quantity: item.quantity,
      returnQuantity: item.returnQuantity || 0,
      availableForReturn: item.quantity - (item.returnQuantity || 0)
    }))

    const isEligible = withinReturnWindow &&
                       returnableItems.length > 0 &&
                       orderDelivered &&
                       order.status !== 'fully_returned'

    return NextResponse.json({
      isEligible,
      withinReturnWindow,
      returnableItems,
      returnWindowExpiresAt,
      deliveredAt: order.deliveredAt,
      orderStatus: order.status,
      orderDelivered,
      reasons: withinReturnWindow ? [] : [
        !orderDelivered ? 'Order not yet delivered' : null,
        !withinReturnWindow ? 'Return window expired' : null,
        returnableItems.length === 0 ? 'No items available for return' : null,
        order.status === 'fully_returned' ? 'Order already fully returned' : null
      ].filter(Boolean)
    })

  } catch (error) {
    console.error('Error checking return eligibility:', error)
    return NextResponse.json({ error: 'Failed to check return eligibility' }, { status: 500 })
  }
}

