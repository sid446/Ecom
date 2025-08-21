import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import Product from '@/models/Product'

// ⛔ Do NOT type `params` – Next.js handles it internally
export async function GET(
  request: NextRequest,
  context: any
) {
  try {
    await connectToDatabase()
    const product = await Product.findById(context.params.id)

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
  context: any
) {
  try {
    await connectToDatabase()
    const body = await request.json()

    const product = await Product.findByIdAndUpdate(context.params.id, body, { new: true })

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
  context: any
) {
  try {
    await connectToDatabase()
    const product = await Product.findByIdAndDelete(context.params.id)

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Product deleted successfully' })
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to delete product', details: error.message }, { status: 500 })
  }
}
