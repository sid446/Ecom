import { NextRequest, NextResponse } from 'next/server'
import Return from '@/models/Return'
import Order from '@/models/Order'
import { connectToDatabase } from '@/lib/mongodb'
// api/returns/route.ts
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()

    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const returns = await Return.find({ user: userId })
      .populate('order', 'orderId orderItems totalPrice createdAt')
      .sort({ createdAt: -1 })

    return NextResponse.json(returns)
  } catch (error) {
    console.error('Error fetching returns:', error)
    return NextResponse.json({ error: 'Failed to fetch returns' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()

    const body = await request.json()
    const {
      orderId,
      userId,
      returnItems,
      returnReason,
      returnDescription,
      returnMethod,
      pickupAddress
    } = body

    // Validate required fields
    if (!orderId || !userId || !returnItems || !returnReason) {
      return NextResponse.json({ 
        error: 'Missing required fields: orderId, userId, returnItems, returnReason' 
      }, { status: 400 })
    }

    // Find the order
    const order = await Order.findById(orderId)
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Check if user owns the order
    if (order.user.toString() !== userId) {
      return NextResponse.json({ error: 'Unauthorized access to order' }, { status: 403 })
    }

    // Check if order is delivered and within return window
    if (!order.isDelivered && order.status !== 'delivered') {
      return NextResponse.json({ error: 'Order must be delivered before initiating return' }, { status: 400 })
    }

    // Calculate return amount
    let returnAmount = 0
    const processedReturnItems = returnItems.map((item: any) => {
      const orderItem = order.orderItems.find(
        (oi: any) => oi._id.toString() === item.orderItemId
      )
      if (!orderItem) {
        throw new Error(`Order item ${item.orderItemId} not found`)
      }

      // Check available quantity for return
      const availableQuantity = orderItem.quantity - (orderItem.returnQuantity || 0)
      if (item.quantity > availableQuantity) {
        throw new Error(`Cannot return ${item.quantity} of ${orderItem.name}. Only ${availableQuantity} available for return.`)
      }

      returnAmount += orderItem.price * item.quantity
      return {
        ...item,
        name: orderItem.name,
        size: orderItem.size,
        image: orderItem.image,
        price: orderItem.price
      }
    })

    // Create return request
    const returnRequest = new Return({
      order: orderId,
      user: userId,
      returnItems: processedReturnItems,
      returnReason,
      returnDescription,
      returnMethod: returnMethod || 'pickup',
      returnAmount,
      pickupAddress: returnMethod === 'pickup' ? pickupAddress : undefined
    })

    // Add initial timeline entry
    returnRequest.timeline.push({
      status: 'requested',
      message: 'Return request submitted',
      timestamp: new Date()
    })

    await returnRequest.save()

    // Update order items return status
    for (const returnItem of returnItems) {
      const orderItem = order.orderItems.find(
        (oi: any) => oi._id.toString() === returnItem.orderItemId
      )
      if (orderItem) {
        orderItem.returnStatus = 'requested'
        orderItem.returnQuantity = (orderItem.returnQuantity || 0) + returnItem.quantity
      }
    }

    await order.updateReturnStatus()

    return NextResponse.json({ 
      message: 'Return request created successfully',
      returnId: returnRequest.returnId,
      return: returnRequest
    }, { status: 201 })

  } catch (error: any) {
    console.error('Error creating return:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to create return request' 
    }, { status: 500 })
  }
}