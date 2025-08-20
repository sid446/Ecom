import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase as dbConnect } from '@/lib/mongodb'
import { User } from '@/models/User'

// In-memory rate limiting (for production use Redis/DB)
const verificationAttempts = new Map<string, { count: number; lastAttempt: number }>()

// Cleanup expired attempts hourly
setInterval(() => {
  const oneHourAgo = Date.now() - 60 * 60 * 1000
  for (const [email, data] of verificationAttempts.entries()) {
    if (data.lastAttempt < oneHourAgo) verificationAttempts.delete(email)
  }
}, 60 * 60 * 1000)

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const body = await request.json()
    const { email, otp } = body

    if (!email || !otp) {
      return NextResponse.json(
        { message: 'Email and OTP are required', error: 'MISSING_FIELDS' },
        { status: 400 }
      )
    }

    // Validate inputs
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: 'Invalid email format', error: 'INVALID_EMAIL' }, { status: 400 })
    }

    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json({ message: 'OTP must be 6 digits', error: 'INVALID_OTP_FORMAT' }, { status: 400 })
    }

    const normalizedEmail = email.toLowerCase().trim()
    const now = Date.now()
    const attemptKey = normalizedEmail
    const attempts = verificationAttempts.get(attemptKey)

    // Rate limit: max 5 attempts/hour
    if (attempts) {
      if (attempts.lastAttempt < now - 60 * 60 * 1000) {
        attempts.count = 0
      }
      if (attempts.count >= 5) {
        const timeLeft = Math.ceil((attempts.lastAttempt + 60 * 60 * 1000 - now) / 60000)
        return NextResponse.json(
          { message: `Too many attempts. Try again in ${timeLeft} minutes.`, error: 'RATE_LIMITED', retryAfter: timeLeft * 60 },
          { status: 429 }
        )
      }
    }

    const user = await User.findOne({ email: normalizedEmail }).lean()
    if (!user) {
      const userAttempts = attempts || { count: 0, lastAttempt: 0 }
      userAttempts.count++
      userAttempts.lastAttempt = now
      verificationAttempts.set(attemptKey, userAttempts)
      return NextResponse.json({ message: 'Invalid email or OTP', error: 'INVALID_CREDENTIALS' }, { status: 400 })
    }

    if (!user.otp || !user.otpExpires) {
      return NextResponse.json({ message: 'No OTP found. Request a new one.', error: 'NO_OTP_FOUND' }, { status: 400 })
    }

    if (new Date() > new Date(user.otpExpires)) {
      await User.findByIdAndUpdate(user._id, { $unset: { otp: 1, otpExpires: 1 } })
      return NextResponse.json({ message: 'OTP expired. Request a new one.', error: 'OTP_EXPIRED' }, { status: 400 })
    }

    // Increment attempt count
    const userAttempts = attempts || { count: 0, lastAttempt: 0 }
    userAttempts.count++
    userAttempts.lastAttempt = now
    verificationAttempts.set(attemptKey, userAttempts)

    if (user.otp !== otp.toString()) {
      return NextResponse.json(
        { message: 'Invalid OTP.', error: 'INVALID_OTP', attemptsLeft: Math.max(0, 5 - userAttempts.count) },
        { status: 400 }
      )
    }

    // OTP valid → mark verified
    await User.findByIdAndUpdate(user._id, {
      $unset: { otp: 1, otpExpires: 1 },
      $set: { isEmailVerified: true, lastVerified: new Date() }
    })

    verificationAttempts.delete(attemptKey)

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
  } catch (error) {
    return NextResponse.json(
      { message: 'Something went wrong. Please try again.', error: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}

// CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGINS || '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  })
}
