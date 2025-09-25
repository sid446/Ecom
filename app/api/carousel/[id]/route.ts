// File: /api/orders/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import Corrousel from '@/models/Corrousel'

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

// GET - Fetch single carousel by ID
export async function GET(
  request: NextRequest,
  context: any
) {
  try {
    await connectDB()
    
    if (!mongoose.Types.ObjectId.isValid(context.params.id)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid carousel ID'
      }, { status: 400 })
    }
    
    const carousel = await Corrousel.findById(context.params.id)
    
    if (!carousel) {
      return NextResponse.json({
        success: false,
        message: 'Carousel not found'
      }, { status: 404 })
    }
    
    return NextResponse.json({
      success: true,
      data: carousel
    }, { status: 200 })
    
  } catch (error) {
    console.error('Error fetching carousel:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch carousel',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// PUT - Update carousel by ID
export async function PUT(
  request: NextRequest,
  context: any
) {
  try {
    await connectDB()
    
    if (!mongoose.Types.ObjectId.isValid(context.params.id)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid carousel ID'
      }, { status: 400 })
    }
    
    const body = await request.json()
    const { mobileimages, desktopimages, Text } = body
    
    // Validation
    if (mobileimages !== undefined && (!Array.isArray(mobileimages) || mobileimages.length === 0)) {
      return NextResponse.json({
        success: false,
        message: 'Mobile images must be a non-empty array'
      }, { status: 400 })
    }
    
    if (desktopimages !== undefined && (!Array.isArray(desktopimages) || desktopimages.length === 0)) {
      return NextResponse.json({
        success: false,
        message: 'Desktop images must be a non-empty array'
      }, { status: 400 })
    }
    
    if (Text !== undefined && (typeof Text !== 'string' || Text.trim().length === 0)) {
      return NextResponse.json({
        success: false,
        message: 'Text must be a non-empty string'
      }, { status: 400 })
    }
    
    const updateData: any = {}
    if (mobileimages) updateData.mobileimages = mobileimages
    if (desktopimages) updateData.desktopimages = desktopimages
    if (Text) updateData.Text = Text.trim()
    
    const updatedCarousel = await Corrousel.findByIdAndUpdate(
      context.params.id,
      updateData,
      { new: true, runValidators: true }
    )
    
    if (!updatedCarousel) {
      return NextResponse.json({
        success: false,
        message: 'Carousel not found'
      }, { status: 404 })
    }
    
    return NextResponse.json({
      success: true,
      message: 'Carousel updated successfully',
      data: updatedCarousel
    }, { status: 200 })
    
  } catch (error) {
    console.error('Error updating carousel:', error)
    
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
      message: 'Failed to update carousel',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// DELETE - Delete carousel by ID
export async function DELETE(
  request: NextRequest,
  context: any
) {
  try {
    await connectDB()
    
    if (!mongoose.Types.ObjectId.isValid(context.params.id)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid carousel ID'
      }, { status: 400 })
    }
    
    const deletedCarousel = await Corrousel.findByIdAndDelete(context.params.id)
    
    if (!deletedCarousel) {
      return NextResponse.json({
        success: false,
        message: 'Carousel not found'
      }, { status: 404 })
    }
    
    return NextResponse.json({
      success: true,
      message: 'Carousel deleted successfully',
      data: deletedCarousel
    }, { status: 200 })
    
  } catch (error) {
    console.error('Error deleting carousel:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to delete carousel',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}