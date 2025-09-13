import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import {User} from '@/models/User'



export async function GET() {
  try {
    await connectToDatabase()
    
    // Fetch users but exclude sensitive information like passwords
    const users = await User.find({})
      .select('-password') // Exclude password field
      .sort({ createdAt: -1 }) // Sort by newest first
    
    return NextResponse.json(users)
  } catch (error: any) {
    console.error('Failed to fetch users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users', details: error.message }, 
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()
    const { name, email, address, phone } = await request.json()

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists with this email' }, { status: 400 })
    }

    const user = new User({
      name,
      email,
      
      address,
      phone,
    })

    await user.save();

    // Don't send password in response
    const { ...userResponse } = user.toObject()
    
    return NextResponse.json(userResponse, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to create user', details: error.message }, { status: 400 })
  }
}