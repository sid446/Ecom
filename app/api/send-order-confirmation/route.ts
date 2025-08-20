import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  console.log('🚀 Send Order Confirmation API called')
  
  try {
    const body = await request.json()
    const { 
      customerEmail, 
      customerName, 
      orderId, 
      orderDate, 
      orderItems, 
      totalAmount, 
      shippingAddress 
    } = body

    console.log('📧 Sending order confirmation to:', customerEmail)

    if (!customerEmail) {
      return NextResponse.json(
        { message: 'Customer email is required' },
        { status: 400 }
      )
    }

    // Check environment variables
    const hasEmailUser = !!process.env.EMAIL_USER
    const hasEmailPass = !!process.env.EMAIL_PASS
    const nodeEnv = process.env.NODE_ENV
    
    console.log('⚙️ Environment check:', {
      hasEmailUser,
      hasEmailPass,
      nodeEnv
    })

    // Development mode - skip actual email sending
    if (nodeEnv !== 'production' && (!hasEmailUser || !hasEmailPass)) {
      console.log('🔧 Development mode - Order confirmation would be sent to:', customerEmail)
      return NextResponse.json({ 
        message: 'Order confirmation email prepared (development mode)',
        debug: {
          customerEmail,
          orderId,
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
      console.log('📤 Attempting to send order confirmation email...')
      
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
        debug: true,
        logger: true
      })

      // Verify transporter
      console.log('🔍 Verifying email transporter...')
      await transporter.verify()
      console.log('✅ Email transporter verified')

      // Format order items for email
      const itemsHtml = orderItems.map((item: any) => `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">
            <img src="${item.image}" alt="${item.name}" width="60" style="border-radius: 4px;" />
          </td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
      `).join('')

      const mailOptions = {
        from: {
          name: 'Your Store',
          address: process.env.EMAIL_USER!
        },
        to: customerEmail,
        subject: `Order Confirmation #${orderId}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
            <div style="background-color: white; border-radius: 8px; padding: 24px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
              <div style="text-align: center; margin-bottom: 24px;">
                <h1 style="color: #2563eb; margin: 0 0 8px 0;">Order Confirmed!</h1>
                <p style="color: #6b7280; margin: 0;">Thank you for your purchase, ${customerName}!</p>
              </div>
              
              <div style="background-color: #f3f4f6; padding: 16px; border-radius: 6px; margin-bottom: 24px;">
                <p style="margin: 0; color: #374151; font-weight: 500;">
                  Order #: ${orderId}<br>
                  Order Date: ${new Date(orderDate).toLocaleDateString()}
                </p>
              </div>
              
              <h2 style="color: #374151; margin-bottom: 16px;">Order Details</h2>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                <thead>
                  <tr style="background-color: #f9fafb;">
                    <th style="padding: 8px; text-align: left; border-bottom: 2px solid #eee;">Product</th>
                    <th style="padding: 8px; text-align: left; border-bottom: 2px solid #eee;">Name</th>
                    <th style="padding: 8px; text-align: center; border-bottom: 2px solid #eee;">Qty</th>
                    <th style="padding: 8px; text-align: right; border-bottom: 2px solid #eee;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="3" style="padding: 12px; text-align: right; font-weight: bold; border-top: 2px solid #eee;">Total:</td>
                    <td style="padding: 12px; text-align: right; font-weight: bold; border-top: 2px solid: #eee;">$${totalAmount.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
              
              <h2 style="color: #374151; margin-bottom: 16px;">Shipping Address</h2>
              <div style="background-color: #f3f4f6; padding: 16px; border-radius: 6px; margin-bottom: 24px;">
                <p style="margin: 0; color: #374151;">
                  ${shippingAddress.address}<br>
                  ${shippingAddress.city}, ${shippingAddress.postalCode}<br>
                  ${shippingAddress.country}
                </p>
              </div>
              
              <div style="text-align: center; color: #6b7280; font-size: 14px; padding-top: 16px; border-top: 1px solid #eee;">
                <p style="margin: 0;">If you have any questions, please contact our support team.</p>
                <p style="margin: 8px 0 0 0;">Thank you for shopping with us!</p>
              </div>
            </div>
          </div>
        `,
        text: `
Order Confirmation #${orderId}

Thank you for your purchase, ${customerName}!

Order Details:
${orderItems.map((item: any) => `- ${item.name} (Qty: ${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`).join('\n')}

Total: $${totalAmount.toFixed(2)}

Shipping Address:
${shippingAddress.address}
${shippingAddress.city}, ${shippingAddress.postalCode}
${shippingAddress.country}

If you have any questions, please contact our support team.

Thank you for shopping with us!
        `
      }

      console.log('📧 Sending order confirmation email to:', customerEmail)
      const info = await transporter.sendMail(mailOptions)
      
      console.log('✅ Order confirmation email sent successfully:', {
        messageId: info.messageId,
        accepted: info.accepted,
        rejected: info.rejected
      })

      return NextResponse.json({ 
        message: 'Order confirmation email sent successfully',
        debug: {
          messageId: info.messageId,
          accepted: info.accepted,
          rejected: info.rejected,
          timestamp: new Date().toISOString()
        }
      })

    } catch (emailError) {
      console.error('❌ Order confirmation email sending failed:', {
        message: emailError instanceof Error ? emailError.message : 'Unknown error',
        code: (emailError as any)?.code,
        command: (emailError as any)?.command,
        response: (emailError as any)?.response
      })

      return NextResponse.json({ 
        message: 'Order confirmation email failed - check logs',
        error: emailError instanceof Error ? emailError.message : 'Unknown error',
        debug: {
          emailError: true,
          errorCode: (emailError as any)?.code
        }
      }, { status: 500 })
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