import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { connectToDatabase as dbConnect } from '@/lib/mongodb'
import { User } from '@/models/User'

export async function POST(request: NextRequest) {
  console.log('🚀 Send OTP API called')
  
  try {
    await dbConnect()
    console.log('✅ Database connected')

    const body = await request.json()
    const { email, name, phone, address, city, postalCode, country } = body
    console.log('📧 Request for email:', email)

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      )
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const otpExpires = new Date(Date.now() + 2 * 60 * 1000)
    console.log('🔢 Generated OTP:', otp)

    // Check environment variables
    const hasEmailUser = !!process.env.EMAIL_USER
    const hasEmailPass = !!process.env.EMAIL_PASS
    const nodeEnv = process.env.NODE_ENV
    
    console.log('⚙️ Environment check:', {
      hasEmailUser,
      hasEmailPass,
      nodeEnv,
      emailUser: process.env.EMAIL_USER // Safe to log email address
    })

    try {
      // Save to database
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
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
          runValidators: false
        }
      )
      console.log('✅ OTP saved to database for user:', user._id)

      // Development mode - return OTP in response
      if (nodeEnv !== 'production' && (!hasEmailUser || !hasEmailPass)) {
        console.log('🔧 Development mode - OTP:', otp)
        return NextResponse.json({ 
          message: 'OTP generated successfully (development mode)',
          otp: otp,
          debug: {
            saved: true,
            environment: nodeEnv,
            emailConfigured: hasEmailUser && hasEmailPass
          }
        })
      }

      // Production mode - send email
      if (!hasEmailUser || !hasEmailPass) {
        console.error('❌ Email credentials missing')
        return NextResponse.json(
          { message: 'Email service not configured' },
          { status: 500 }
        )
      }

      try {
        console.log('📤 Attempting to send email...')
        
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
          debug: true, // Enable debug logs
          logger: true // Enable logger
        })

        // Verify transporter
        console.log('🔍 Verifying email transporter...')
        await transporter.verify()
        console.log('✅ Email transporter verified')

        const mailOptions = {
          from: {
            name: 'Your Store',
            address: process.env.EMAIL_USER!
          },
          to: email,
          subject: 'Your OTP for Order Verification - Test',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #2563eb;">Order Verification</h2>
              <p>Your OTP code is:</p>
              <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0;">
                <h1 style="font-size: 32px; letter-spacing: 8px; color: #2563eb; margin: 0;">${otp}</h1>
              </div>
              <p>This code expires in 2 minutes.</p>
              <p><small>Debug info: Sent at ${new Date().toLocaleString()}</small></p>
            </div>
          `,
          text: `Your OTP code is: ${otp}. This code expires in 2 minutes.`
        }

        console.log('📧 Sending email to:', email)
        const info = await transporter.sendMail(mailOptions)
        
        console.log('✅ Email sent successfully:', {
          messageId: info.messageId,
          response: info.response,
          accepted: info.accepted,
          rejected: info.rejected
        })

        return NextResponse.json({ 
          message: 'OTP sent successfully',
          debug: {
            messageId: info.messageId,
            accepted: info.accepted,
            rejected: info.rejected,
            timestamp: new Date().toISOString()
          }
        })

      } catch (emailError) {
        console.error('❌ Email sending failed:', {
          message: emailError instanceof Error ? emailError.message : 'Unknown error',
          code: (emailError as any)?.code,
          command: (emailError as any)?.command,
          response: (emailError as any)?.response
        })

        // Return OTP in response for debugging (remove in production)
        return NextResponse.json({ 
          message: 'Email failed - check logs',
          error: emailError instanceof Error ? emailError.message : 'Unknown error',
          otp: nodeEnv === 'development' ? otp : undefined, // Only in dev
          debug: {
            emailError: true,
            errorCode: (emailError as any)?.code
          }
        }, { status: 500 })
      }

    } catch (dbError) {
      console.error('❌ Database error:', dbError)
      
      // Try with temporary password if needed
      if (dbError instanceof Error && dbError.message.includes('password')) {
        console.log('🔧 Trying with temporary password...')
        
        const userWithPassword = await User.findOneAndUpdate(
          { email: email.toLowerCase() },
          {
            $set: {
              otp,
              otpExpires,
              password: `temp-${Date.now()}`,
              ...(name && { name }),
              ...(phone && { phone }),
              ...(address && { address }),
              ...(city && { city }),
              ...(postalCode && { postalCode }),
              ...(country && { country }),
            }
          },
          {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
          }
        )
        
        console.log('✅ User created with temp password:', userWithPassword._id)
        
        return NextResponse.json({ 
          message: 'OTP generated with temp password',
          otp: nodeEnv === 'development' ? otp : undefined,
          debug: {
            tempPasswordUsed: true,
            userId: userWithPassword._id
          }
        })
      }
      
      throw dbError
    }

  } catch (error) {
    console.error('❌ API Error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    
    return NextResponse.json(
      { 
        message: 'Internal server error',
        debug: {
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      },
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