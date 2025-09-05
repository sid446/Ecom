import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import Product from '@/models/Product'
import { ImageOff } from 'lucide-react'

const sampleProducts = [
  {
    name: 'Agenlic Bratz Knit Vest',
    description: 'Agenlic Bratz Knit Vest',
    price: 1599,
    imagefront: 'https://res.cloudinary.com/db2qa9dzs/image/upload/v1757071804/Gemini_Generated_Image_fehd9efehd9efehd_dmcvqi.png',
    imageback: 'https://res.cloudinary.com/db2qa9dzs/image/upload/v1757091314/Gemini_Generated_Image_ffd1x4ffd1x4ffd1_zcyymg.png',
    allimages: [
      'https://res.cloudinary.com/db2qa9dzs/image/upload/v1757071804/Gemini_Generated_Image_fehd9efehd9efehd_dmcvqi.png',
      'https://res.cloudinary.com/db2qa9dzs/image/upload/v1757091314/Gemini_Generated_Image_ffd1x4ffd1x4ffd1_zcyymg.png'
    ],
    stock: 15,
    category: 'TShirts'
  },
  {
    name: 'Agenlic Bratz Knit Vest',
    description: 'Agenlic Bratz Knit Vest',
    price: 2199,
    imagefront: 'https://res.cloudinary.com/db2qa9dzs/image/upload/v1757071806/Gemini_Generated_Image_2oqttp2oqttp2oqt_lhl4av.png',
    imageback: 'https://res.cloudinary.com/db2qa9dzs/image/upload/v1757091512/Gemini_Generated_Image_s7q6p8s7q6p8s7q6_wubkio.png',
    allimages: [
      'https://res.cloudinary.com/db2qa9dzs/image/upload/v1757071806/Gemini_Generated_Image_2oqttp2oqttp2oqt_lhl4av.png',
      'https://res.cloudinary.com/db2qa9dzs/image/upload/v1757091512/Gemini_Generated_Image_s7q6p8s7q6p8s7q6_wubkio.png'
    ],
    stock: 8,
    category: 'TShirts'
  },
  {
    name: 'Agenlic Bratz Knit Vest',
    description: 'Agenlic Bratz Knit Vest',
    price: 2999,
    imagefront: 'https://res.cloudinary.com/db2qa9dzs/image/upload/v1757091878/Gemini_Generated_Image_nb3frdnb3frdnb3f_sazjpy.png',
    imageback: 'https://res.cloudinary.com/db2qa9dzs/image/upload/v1757092045/Gemini_Generated_Image_wx6ownwx6ownwx6o_n2zvtv.png',
    allimages: [
      'https://res.cloudinary.com/db2qa9dzs/image/upload/v1757091878/Gemini_Generated_Image_nb3frdnb3frdnb3f_sazjpy.png',
      'https://res.cloudinary.com/db2qa9dzs/image/upload/v1757092045/Gemini_Generated_Image_wx6ownwx6ownwx6o_n2zvtv.png'
    ],
    stock: 5,
    category: 'SweatShirts'
  },
  {
    name: 'Agenlic Bratz Knit Vest',
    description: 'Agenlic Bratz Knit Vest',
    price: 2999,
    imagefront: 'https://res.cloudinary.com/db2qa9dzs/image/upload/v1757072077/na3_tij9c8.png',
    imageback: 'https://res.cloudinary.com/db2qa9dzs/image/upload/v1757092198/Gemini_Generated_Image_1i45jv1i45jv1i45_jibo1h.png',
    allimages: ['https://res.cloudinary.com/db2qa9dzs/image/upload/v1757072077/na3_tij9c8.png',
      "https://res.cloudinary.com/db2qa9dzs/image/upload/v1757092198/Gemini_Generated_Image_1i45jv1i45jv1i45_jibo1h.png"],
    stock: 25,
    category: 'Hoodies'
  },
  {
    name: 'Agenlic Bratz Knit Vest',
    description: 'Agenlic Bratz Knit Vest',
    price: 1599,
    imagefront: 'https://res.cloudinary.com/db2qa9dzs/image/upload/v1757072143/na1_v7zgis.png',
    imageback: 'https://res.cloudinary.com/db2qa9dzs/image/upload/v1757092530/Gemini_Generated_Image_d6ijpbd6ijpbd6ij_d1ayit.png',
    allimages: ['https://res.cloudinary.com/db2qa9dzs/image/upload/v1757072143/na1_v7zgis.png',
      'https://res.cloudinary.com/db2qa9dzs/image/upload/v1757092530/Gemini_Generated_Image_d6ijpbd6ijpbd6ij_d1ayit.png'],
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