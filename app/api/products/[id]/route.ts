import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Product } from '@/models/Product';
import mongoose from 'mongoose';

/**
 * GET /api/products/[id]
 * Fetches a single product by its ID.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    
    // Check for valid ObjectId format before querying
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
        return NextResponse.json({ message: 'Invalid product ID format' }, { status: 400 });
    }

    const product = await Product.findById(params.id);

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error(`Failed to fetch product ${params.id}:`, error);
    return NextResponse.json({ message: 'Failed to fetch product' }, { status: 500 });
  }
}

/**
 * PUT /api/products/[id]
 * Updates a product by its ID.
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
        return NextResponse.json({ message: 'Invalid product ID format' }, { status: 400 });
    }

    const body = await request.json();

    // --- SECURITY IMPROVEMENT: DESTRUCTURING ---
    // Explicitly pull out only the fields that are safe to update.
    // This prevents a user from maliciously updating protected fields like reviews or ratings.
    const {
      name,
      description,
      price,
      imagefront,
      imageback,
      allimages,
      stock,
      category,
    } = body;

    const updateData = {
      name,
      description,
      price,
      imagefront,
      imageback,
      allimages,
      stock,
      category,
    };

    const product = await Product.findByIdAndUpdate(
      params.id,
      updateData,
      {
        new: true, // Return the updated document
        runValidators: true, // Ensure schema validation is run on update
      }
    );

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error(`Failed to update product ${params.id}:`, error);
    if (error instanceof mongoose.Error.ValidationError) {
        const errors = Object.values(error.errors).map(e => e.message);
        return NextResponse.json({ message: 'Validation failed', errors }, { status: 400 });
    }
    return NextResponse.json({ message: 'Failed to update product' }, { status: 500 });
  }
}

/**
 * DELETE /api/products/[id]
 * Deletes a product by its ID.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
        return NextResponse.json({ message: 'Invalid product ID format' }, { status: 400 });
    }

    const product = await Product.findByIdAndDelete(params.id);

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(`Failed to delete product ${params.id}:`, error);
    return NextResponse.json({ message: 'Failed to delete product' }, { status: 500 });
  }
}
