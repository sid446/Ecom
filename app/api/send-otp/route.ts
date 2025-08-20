import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { connectToDatabase as dbConnect } from '@/lib/mongodb'
import { User } from '@/models/User'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const body = await request.json()
    const { email, name, phone, address, city, postalCode, country } = body

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 })
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const otpExpires = new Date(Date.now() + 2 * 60 * 1000)

    // Save OTP in database
    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      {
        $set: {
          otp,
          otpExpires,
          ...(name && { name }),
          ...(phone && { phone }),
          ...(address && { address }),
          ...(city && { city }),
          ...(postalCode && { postalCode }),
          ...(country && { country }),
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )

    const hasEmailUser = !!process.env.EMAIL_USER
    const hasEmailPass = !!process.env.EMAIL_PASS
    const nodeEnv = process.env.NODE_ENV

    // Development mode - return OTP in response
    if (nodeEnv !== 'production' && (!hasEmailUser || !hasEmailPass)) {
      return NextResponse.json({
        message: 'OTP generated successfully (development mode)',
        otp,
      })
    }

    if (!hasEmailUser || !hasEmailPass) {
      return NextResponse.json(
        { message: 'Email service not configured' },
        { status: 500 }
      )
    }

    // Send OTP email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    })

    const mailOptions = {
      from: { name: 'Your Store', address: process.env.EMAIL_USER! },
      to: email,
      subject: 'Your OTP for Order Verification',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #2563eb;">Order Verification</h2>
          <p>Your OTP code is:</p>
          <div style="background:#f3f4f6;padding:20px;text-align:center;margin:20px 0;">
            <h1 style="font-size:32px;letter-spacing:8px;color:#2563eb;">${otp}</h1>
          </div>
          <p>This code expires in 2 minutes.</p>
        </div>
      `,
      text: `Your OTP code is: ${otp}. This code expires in 2 minutes.`,
    }

    await transporter.sendMail(mailOptions)

    return NextResponse.json({ message: 'OTP sent successfully' })
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
