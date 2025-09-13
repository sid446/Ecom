import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Product } from '@/models/Product';
import Order from '@/models/Order';
import { User } from '@/models/User';
import mongoose from 'mongoose';

/**
 * POST /api/products/[id]/reviews
 * Creates a new review for a product, verifying the user has purchased it.
 */
export async function POST(
  request: NextRequest,
  context: { params: { id: string } } // UPDATED: Correct way to access params
) {
  try {
    await connectToDatabase();
    
    // UPDATED: Get productId from context.params
    const productId = context.params.id;
    const body = await request.json();

    const { rating, comment, email } = body;

    // --- 1. Validate all inputs ---
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json({ message: 'Invalid Product ID format' }, { status: 400 });
    }
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ message: 'A valid email is required' }, { status: 400 });
    }
    if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json({ message: 'Rating is required and must be a number between 1 and 5' }, { status: 400 });
    }
    if (!comment || typeof comment !== 'string' || comment.trim() === '') {
      return NextResponse.json({ message: 'Comment is required' }, { status: 400 });
    }

    // --- 2. Find the user by their email ---
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // If no user is found with that email, they couldn't have placed an order.
      return NextResponse.json({ message: 'No user found with this email address.' }, { status: 404 });
    }

    // --- 3. Verify the purchase using the found user's ID ---
    const purchaseOrder = await Order.findOne({
      user: user._id,
      'orderItems.product': productId,
      status: 'delivered', // Crucial check: only allow reviews for delivered orders
    });

    if (!purchaseOrder) {
      return NextResponse.json(
        { message: 'You can only review products you have purchased and received.' },
        { status: 403 } // 403 Forbidden
      );
    }

    // --- 4. Find the Product ---
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    // --- 5. Check if User has already submitted a review ---
    const isAlreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === user._id.toString()
    );

    if (isAlreadyReviewed) {
      return NextResponse.json({ message: 'You have already reviewed this product' }, { status: 400 });
    }

    // --- 6. Create and add the new review ---
    const review = {
      user: user._id,
      name: user.name || 'Verified Purchaser', // Use the name from the DB
      rating: Number(rating),
      comment: comment.trim(),
      createdAt: new Date(),
    };

    product.reviews.push(review);

    // --- 7. Update the product's overall rating ---
    product.numOfReviews = product.reviews.length;
    
    // Safely calculate the average rating to avoid division by zero
    product.rating = product.reviews.length > 0
      ? product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length
      : 0;

    await product.save();

    return NextResponse.json({ message: 'Review added successfully!', review }, { status: 201 });

  } catch (error) {
    console.error(`Failed to add review for product ${context.params.id}:`, error);
    return NextResponse.json({ message: 'Failed to add review' }, { status: 500 });
  }
}