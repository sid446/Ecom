import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import Product from '@/models/Product'

// ✅ Correct typing for params
type Params = { params: { id: string } }

export async function GET(
  request: NextRequest,
  { params }: Params
) {
  try {
    await connectToDatabase()
    const product = await Product.findById(params.id)

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: Params
) {
  try {
    await connectToDatabase()
    const body = await request.json()

    const product = await Product.findByIdAndUpdate(params.id, body, { new: true })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update product', details: error.message }, { status: 400 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: Params
) {
  try {
    await connectToDatabase()
    const product = await Product.findByIdAndDelete(params.id)

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Product deleted successfully' })
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to delete product', details: error.message }, { status: 500 })
  }
}
