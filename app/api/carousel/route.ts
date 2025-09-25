
import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import Corrousel from '@/models/Corrousel'

// Database connection utility
const connectDB = async () => {
  if (mongoose.connections[0].readyState) {
    return
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI as string)
  } catch (error) {
    console.error('Database connection error:', error)
    throw new Error('Database connection failed')
  }
}

// GET - Fetch all carousels
export async function GET() {
  try {
    await connectDB()
    const carousels = await Corrousel.find({}).sort({ createdAt: -1 })
    
    return NextResponse.json({
      success: true,
      data: carousels,
      count: carousels.length
    }, { status: 200 })
    
  } catch (error) {
    console.error('Error fetching carousels:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch carousels',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// POST - Create new carousel
export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const body = await request.json()
    
    const { mobileimages, desktopimages, Text } = body
    
    // Validation
    if (!mobileimages || !Array.isArray(mobileimages) || mobileimages.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Mobile images are required and must be a non-empty array'
      }, { status: 400 })
    }
    
    if (!desktopimages || !Array.isArray(desktopimages) || desktopimages.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Desktop images are required and must be a non-empty array'
      }, { status: 400 })
    }
    
    if (!Text || typeof Text !== 'string' || Text.trim().length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Text is required and must be a non-empty string'
      }, { status: 400 })
    }
    
    const newCarousel = new Corrousel({
      mobileimages,
      desktopimages,
      Text: Text.trim()
    })
    
    const savedCarousel = await newCarousel.save()
    
    return NextResponse.json({
      success: true,
      message: 'Carousel created successfully',
      data: savedCarousel
    }, { status: 201 })
    
  } catch (error) {
    console.error('Error creating carousel:', error)
    
    if (error instanceof mongoose.Error.ValidationError) {
      const validationErrors = Object.values(error.errors).map(err => err.message)
      return NextResponse.json({
        success: false,
        message: 'Validation error',
        errors: validationErrors
      }, { status: 400 })
    }
    
    return NextResponse.json({
      success: false,
      message: 'Failed to create carousel',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// File: app/api/carousel/[id]/route.ts
