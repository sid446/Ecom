import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import Product from '@/models/Product'

const sampleProducts = [
  {
    name: 'Agenlic Bratz Knit Vest',
    description: 'Agenlic Bratz Knit Vest',
    price: 1599,
    image: 'https://res.cloudinary.com/db2qa9dzs/image/upload/v1757071804/Gemini_Generated_Image_fehd9efehd9efehd_dmcvqi.png',
    stock: 15,
    category: 'TShirts'
  },
  {
    name: 'Agenlic Bratz Knit Vest',
    description: 'Agenlic Bratz Knit Vest',
    price: 2199,
    image: 'https://res.cloudinary.com/db2qa9dzs/image/upload/v1757071806/Gemini_Generated_Image_2oqttp2oqttp2oqt_lhl4av.png',
    stock: 8,
    category: 'TShirts'
  },
  {
    name: 'Agenlic Bratz Knit Vest',
    description: 'Agenlic Bratz Knit Vest',
    price: 2999,
    image: 'https://res.cloudinary.com/db2qa9dzs/image/upload/v1757071806/IMG_3179_rmwclt.jpg',
    stock: 5,
    category: 'SweatShirts'
  },
  {
    name: 'Agenlic Bratz Knit Vest',
    description: 'Agenlic Bratz Knit Vest',
    price: 2999,
    image: 'https://res.cloudinary.com/db2qa9dzs/image/upload/v1757072077/na3_tij9c8.png',
    stock: 25,
    category: 'Hoodies'
  },
  {
    name: 'Agenlic Bratz Knit Vest',
    description: 'Agenlic Bratz Knit Vest',
    price: 1599,
    image: 'https://res.cloudinary.com/db2qa9dzs/image/upload/v1757072143/na1_v7zgis.png',
    stock: 12,
    category: 'TShirts'
  },
  
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