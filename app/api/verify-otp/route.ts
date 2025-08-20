import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase as dbConnect } from '@/lib/mongodb'
import { User } from '@/models/User'

// Rate limiting store (in production, use Redis or database)
const verificationAttempts = new Map<string, { count: number; lastAttempt: number }>()

// Clean up old attempts every hour
setInterval(() => {
  const oneHourAgo = Date.now() - 60 * 60 * 1000
  for (const [email, data] of verificationAttempts.entries()) {
    if (data.lastAttempt < oneHourAgo) {
      verificationAttempts.delete(email)
    }
  }
}, 60 * 60 * 1000)

export async function POST(request: NextRequest) {
  console.log('🔐 OTP Verification API called')
  
  try {
    await dbConnect()
    console.log('✅ Database connected')

    const body = await request.json()
    const { email, otp } = body

    console.log('📧 Verification request for:', email)
    console.log('🔢 OTP provided:', otp?.substring(0, 2) + '****') // Log partial OTP for debugging

    // Input validation
    if (!email || !otp) {
      console.log('❌ Missing required fields')
      return NextResponse.json(
        { 
          message: 'Email and OTP are required',
          error: 'MISSING_FIELDS'
        },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.log('❌ Invalid email format:', email)
      return NextResponse.json(
        { 
          message: 'Invalid email format',
          error: 'INVALID_EMAIL'
        },
        { status: 400 }
      )
    }

    // Validate OTP format (6 digits)
    if (!/^\d{6}$/.test(otp)) {
      console.log('❌ Invalid OTP format:', otp)
      return NextResponse.json(
        { 
          message: 'OTP must be 6 digits',
          error: 'INVALID_OTP_FORMAT'
        },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Rate limiting - max 5 attempts per email per hour
    const attemptKey = normalizedEmail
    const now = Date.now()
    const attempts = verificationAttempts.get(attemptKey)
    
    if (attempts) {
      const oneHourAgo = now - 60 * 60 * 1000
      
      // Reset count if last attempt was more than an hour ago
      if (attempts.lastAttempt < oneHourAgo) {
        attempts.count = 0
      }
      
      // Check if too many attempts
      if (attempts.count >= 5) {
        const timeLeft = Math.ceil((attempts.lastAttempt + 60 * 60 * 1000 - now) / 1000 / 60)
        console.log('❌ Rate limit exceeded for:', email)
        return NextResponse.json(
          { 
            message: `Too many verification attempts. Please try again in ${timeLeft} minutes.`,
            error: 'RATE_LIMITED',
            retryAfter: timeLeft * 60 // seconds
          },
          { status: 429 }
        )
      }
    }

    try {
      // Find user by email with better error handling
      const user = await User.findOne({ email: normalizedEmail }).lean()
      console.log('👤 User found:', !!user)

      if (!user) {
        // Increment attempt count even for non-existent users (security)
        const userAttempts = verificationAttempts.get(attemptKey) || { count: 0, lastAttempt: 0 }
        userAttempts.count++
        userAttempts.lastAttempt = now
        verificationAttempts.set(attemptKey, userAttempts)

        console.log('❌ No user found for email:', email)
        return NextResponse.json(
          { 
            message: 'Invalid email or OTP. Please check your details.',
            error: 'INVALID_CREDENTIALS'
          },
          { status: 400 }
        )
      }

      // Check if OTP exists and is not expired
      if (!user.otp || !user.otpExpires) {
        console.log('❌ No OTP found for user')
        return NextResponse.json(
          { 
            message: 'No active OTP found. Please request a new verification code.',
            error: 'NO_OTP_FOUND'
          },
          { status: 400 }
        )
      }

      const currentTime = new Date()
      const otpExpiryTime = new Date(user.otpExpires)
      
      console.log('⏰ Current time:', currentTime.toISOString())
      console.log('⏰ OTP expires at:', otpExpiryTime.toISOString())
      console.log('⏰ Is expired?', currentTime > otpExpiryTime)

      if (currentTime > otpExpiryTime) {
        // Clear expired OTP
        await User.findByIdAndUpdate(user._id, {
          $unset: { 
            otp: 1, 
            otpExpires: 1 
          }
        })

        console.log('❌ OTP expired for user')
        return NextResponse.json(
          { 
            message: 'OTP has expired. Please request a new verification code.',
            error: 'OTP_EXPIRED'
          },
          { status: 400 }
        )
      }

      // Increment attempt count before checking OTP
      const userAttempts = verificationAttempts.get(attemptKey) || { count: 0, lastAttempt: 0 }
      userAttempts.count++
      userAttempts.lastAttempt = now
      verificationAttempts.set(attemptKey, userAttempts)

      // Check OTP match
      console.log('🔍 Checking OTP match...')
      console.log('📝 Stored OTP:', user.otp)
      console.log('📝 Provided OTP:', otp)
      
      if (user.otp !== otp.toString()) {
        console.log('❌ OTP mismatch')
        return NextResponse.json(
          { 
            message: 'Invalid OTP. Please check the code and try again.',
            error: 'INVALID_OTP',
            attemptsLeft: Math.max(0, 5 - userAttempts.count)
          },
          { status: 400 }
        )
      }

      // OTP is valid! Clear it from the database and reset attempts
      await User.findByIdAndUpdate(user._id, {
        $unset: { 
          otp: 1, 
          otpExpires: 1 
        },
        $set: {
          isEmailVerified: true,
          lastVerified: new Date()
        }
      })

      // Clear rate limiting for this email on successful verification
      verificationAttempts.delete(attemptKey)

      console.log('✅ OTP verified successfully for:', email)

      // Return success with user data
      return NextResponse.json({
        message: 'Email verified successfully!',
        success: true,
        user: {
          id: user._id,
          email: user.email,
          name: user.name || null,
          phone: user.phone || null,
          address: user.address || null,
          city: user.city || null,
          postalCode: user.postalCode || null,
          country: user.country || null,
          isEmailVerified: true,
          verifiedAt: new Date().toISOString()
        }
      })

    } catch (dbError) {
      console.error('❌ Database error during verification:', dbError)
      
      // Handle specific database errors
      if (dbError instanceof Error) {
        if (dbError.message.includes('Cast to ObjectId failed')) {
          return NextResponse.json(
            { 
              message: 'Invalid user data format',
              error: 'INVALID_DATA_FORMAT'
            },
            { status: 400 }
          )
        }
      }
      
      throw dbError // Re-throw to be caught by outer catch block
    }

  } catch (error) {
    console.error('❌ Error in verify-otp API:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    })
    
    return NextResponse.json(
      { 
        message: 'Something went wrong. Please try again.',
        error: 'INTERNAL_ERROR'
      },
      { status: 500 }
    )
  }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGINS || '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400', // 24 hours
    },
  })
}