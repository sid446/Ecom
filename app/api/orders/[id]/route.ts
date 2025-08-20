import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import Order from '@/models/Order'

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    await connectToDatabase()
    const order = await Order.findById(params.id).populate('user', 'name email phone')
    
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }
    
    return NextResponse.json(order)
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    await connectToDatabase()
    const body = await request.json()
    
    const order = await Order.findByIdAndUpdate(
      params.id, 
      body, 
      { new: true, runValidators: true }
    ).populate('user', 'name email phone')
    
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }
    
    return NextResponse.json(order)
  } catch (error: any) {
    console.error('Error updating order:', error)
    return NextResponse.json({ 
      error: 'Failed to update order', 
      details: error.message 
    }, { status: 400 })
  }
}

// Optional: DELETE method
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    await connectToDatabase()
    
    const order = await Order.findByIdAndDelete(params.id)
    
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }
    
    return NextResponse.json({ message: 'Order deleted successfully' })
  } catch (error: any) {
    console.error('Error deleting order:', error)
    return NextResponse.json({ 
      error: 'Failed to delete order', 
      details: error.message 
    }, { status: 500 })
  }
}