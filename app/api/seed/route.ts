import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import Product from '@/models/Product'

const sampleProducts = [
  {
    name: 'Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    price: 99.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
    stock: 15,
    category: 'Electronics'
  },
  {
    name: 'Smartphone',
    description: 'Latest model smartphone with advanced features',
    price: 699.99,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80',
    stock: 8,
    category: 'Electronics'
  },
  {
    name: 'Laptop',
    description: 'Powerful laptop for work and entertainment',
    price: 999.99,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80',
    stock: 5,
    category: 'Electronics'
  },
  {
    name: 'Coffee Mug',
    description: 'Ceramic coffee mug with beautiful design',
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=500&q=80',
    stock: 25,
    category: 'Home & Kitchen'
  },
  {
    name: 'Running Shoes',
    description: 'Comfortable running shoes for all terrains',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80',
    stock: 12,
    category: 'Sports'
  },
  {
    name: 'Backpack',
    description: 'Durable backpack perfect for travel and daily use',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80',
    stock: 20,
    category: 'Fashion'
  }
]

export async function POST() {
  try {
    await connectToDatabase()
    
    // Clear existing products
    await Product.deleteMany({})
    
    // Insert sample products
    await Product.insertMany(sampleProducts)
    
    return NextResponse.json({ 
      message: 'Database seeded successfully', 
      count: sampleProducts.length 
    })
  } catch (error: any) {
    return NextResponse.json({ 
      error: 'Failed to seed database', 
      details: error.message 
    }, { status: 500 })
  }
}