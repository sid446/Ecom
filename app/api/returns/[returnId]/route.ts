// File: /api/returns/[returnId]/route.ts

import { NextRequest, NextResponse } from 'next/server'
import Return from '@/models/Return'
import Order from '@/models/Order'
import { connectToDatabase } from '@/lib/mongodb'

export async function GET(
  request: NextRequest,
  context: any
) {
  try {
    await connectToDatabase()
    
    const returnRequest = await Return.findOne({ returnId: context.params.returnId })
      .populate('order', 'orderId orderItems totalPrice createdAt shippingAddress')
      .populate('user', 'name email phone')

    if (!returnRequest) {
      return NextResponse.json({ error: 'Return request not found' }, { status: 404 })
    }

    return NextResponse.json(returnRequest)
  } catch (error) {
    console.error('Error fetching return:', error)
    return NextResponse.json({ error: 'Failed to fetch return request' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  context: any
) {
  try {
    await connectToDatabase()

    const body = await request.json()
    const { status, adminNotes, refundAmount } = body

    const returnRequest = await Return.findOne({ returnId: context.params.returnId })
    if (!returnRequest) {
      return NextResponse.json({ error: 'Return request not found' }, { status: 404 })
    }

    // Update return status
    const previousStatus = returnRequest.status
    returnRequest.status = status
    
    if (adminNotes) {
      returnRequest.adminNotes = adminNotes
    }

    if (refundAmount !== undefined) {
      returnRequest.refundAmount = refundAmount
    }

    // Set appropriate timestamps
    const now = new Date()
    switch (status) {
      case 'approved':
        returnRequest.approvedAt = now
        break
      case 'pickup_scheduled':
        returnRequest.pickupScheduledAt = now
        break
      case 'items_received':
        returnRequest.itemsReceivedAt = now
        break
      case 'refund_processed':
        returnRequest.refundProcessedAt = now
        break
      case 'completed':
        returnRequest.completedAt = now
        break
    }

    // Add timeline entry
    const statusMessages: Record<string, string> = {
      'approved': 'Return request approved',
      'rejected': 'Return request rejected',
      'pickup_scheduled': 'Pickup scheduled',
      'items_received': 'Items received at warehouse',
      'items_inspected': 'Items inspected and approved',
      'refund_processed': 'Refund processed',
      'completed': 'Return completed successfully',
      'cancelled': 'Return cancelled'
    }

    returnRequest.timeline.push({
      status,
      message: adminNotes || statusMessages[status] || `Status updated to ${status}`,
      timestamp: now
    })

    await returnRequest.save()

    // Update order status if return is completed
    if (status === 'completed' || status === 'refund_processed') {
      const order = await Order.findById(returnRequest.order)
      if (order) {
        // Update individual item return status
        for (const returnItem of returnRequest.returnItems) {
          const orderItem = order.orderItems.find(
            (oi: any) => oi._id.toString() === returnItem.orderItemId
          )
          if (orderItem) {
            orderItem.returnStatus = 'returned'
          }
        }
        
        order.totalReturnAmount += returnRequest.refundAmount || returnRequest.returnAmount
        await order.updateReturnStatus()
      }
    }

    return NextResponse.json({
      message: 'Return status updated successfully',
      return: returnRequest
    })

  } catch (error) {
    console.error('Error updating return:', error)
    return NextResponse.json({ error: 'Failed to update return status' }, { status: 500 })
  }
}