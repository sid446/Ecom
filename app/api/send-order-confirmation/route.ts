import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// Define a type for the order items for better type safety
interface OrderItem {
  name: string;
  quantity: number;
  size: string;
  price: number;
  image: string;
}

export async function POST(request: NextRequest) {
  console.log('🚀 Send Order Confirmation API called');
  
  try {
    const body = await request.json();
    const { 
      customerEmail, 
      customerName, 
      orderId, 
      orderDate, 
      orderItems, 
      totalAmount = 0,
      subtotal = 0,
      shipping = 0,
      tax = 0,
      shippingAddress,
      paymentMethod
    } = body;

    console.log('📧 Preparing to send order confirmation to:', customerEmail);

    if (!customerEmail) {
      return NextResponse.json(
        { message: 'Customer email is required' },
        { status: 400 }
      );
    }
    
    // Validate orderItems array to prevent map() errors if it's missing
    if (!Array.isArray(orderItems)) {
        console.error('❌ orderItems is missing or not an array.');
        return NextResponse.json(
            { message: 'Invalid order data: orderItems missing.' },
            { status: 400 }
        );
    }

    const hasEmailUser = !!process.env.EMAIL_USER;
    const hasEmailPass = !!process.env.EMAIL_PASS;

    // In development, if email credentials are not set, we can skip sending the actual email.
    if (process.env.NODE_ENV !== 'production' && (!hasEmailUser || !hasEmailPass)) {
      console.log('🔧 Development mode: Skipping actual email dispatch. Order confirmation would be sent to:', customerEmail);
      return NextResponse.json({ 
        message: 'Order confirmation email prepared (development mode - not sent)',
      });
    }

    // In production, email credentials are required.
    if (!hasEmailUser || !hasEmailPass) {
      console.error('❌ Email service credentials are not configured on the server.');
      return NextResponse.json(
        { message: 'Email service is not configured.' },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Verify connection configuration
    await transporter.verify();
    console.log('✅ Email transporter verified and ready to send.');

    // Format order items for the HTML email
    const itemsHtml = orderItems.map((item: OrderItem) => `
      <tr>
        <td style="padding: 16px 12px; border-bottom: 1px solid #2d3748;">
          <img src="${item.image}" alt="${item.name}" width="80" height="80" style="border-radius: 12px; display: block; object-fit: cover; box-shadow: 0 2px 8px rgba(0,0,0,0.3);" />
        </td>
        <td style="padding: 16px 12px; border-bottom: 1px solid #2d3748;">
          <div style="color: #f7fafc; font-size: 16px; font-weight: 600; margin-bottom: 6px;">${item.name}</div>
          <div style="color: #a0aec0; font-size: 14px;">Size: ${item.size}</div>
        </td>
        <td style="padding: 16px 12px; border-bottom: 1px solid #2d3748; text-align: center; color: #e2e8f0; font-size: 15px; font-weight: 500;">×${item.quantity}</td>
        <td style="padding: 16px 12px; border-bottom: 1px solid #2d3748; text-align: right; color: #f7fafc; font-size: 16px; font-weight: 600;">₹${(item.price * item.quantity).toLocaleString()}</td>
      </tr>
    `).join('');

    const mailOptions = {
      from: {
        name: 'KASHÉ',
        address: process.env.EMAIL_USER!
      },
      to: customerEmail,
      subject: `Order Confirmed: #${orderId} | KASHÉ`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Confirmation</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); min-height: 100vh;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 40px 20px;">
            <tr>
              <td align="center">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="max-width: 650px; width: 100%; background: linear-gradient(to bottom, #1a202c, #2d3748); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.5);">
                  
                  <!-- Header Section -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                      <div style="background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); border-radius: 12px; padding: 24px; display: inline-block;">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-bottom: 12px;">
                          <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">Order Confirmed!</h1>
                        <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 16px;">Thank you for shopping with KASHÉ</p>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Greeting Section -->
                  <tr>
                    <td style="padding: 32px 30px 24px;">
                      <p style="color: #e2e8f0; margin: 0; font-size: 18px; line-height: 1.6;">
                        Hi <strong style="color: #ffffff;">${customerName}</strong>,
                      </p>
                      <p style="color: #cbd5e0; margin: 12px 0 0 0; font-size: 15px; line-height: 1.6;">
                        Your order has been confirmed and will be shipped shortly. We'll send you a tracking number once your items are on their way.
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Order Details Card -->
                  <tr>
                    <td style="padding: 0 30px 24px;">
                      <div style="background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1)); border: 1px solid rgba(102, 126, 234, 0.3); border-radius: 12px; padding: 20px; backdrop-filter: blur(10px);">
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                          <tr>
                            <td style="padding: 0 0 12px 0;">
                              <div style="color: #a0aec0; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">Order Number</div>
                              <div style="color: #ffffff; font-size: 20px; font-weight: 700; font-family: 'Courier New', monospace;">#${orderId}</div>
                            </td>
                            <td style="padding: 0 0 12px 0; text-align: right;">
                              <div style="color: #a0aec0; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">Order Date</div>
                              <div style="color: #e2e8f0; font-size: 15px; font-weight: 500;">${new Date(orderDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                            </td>
                          </tr>
                        </table>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Order Summary Section -->
                  <tr>
                    <td style="padding: 0 30px 24px;">
                      <h2 style="color: #ffffff; margin: 0 0 16px 0; font-size: 22px; font-weight: 700;">Order Summary</h2>
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: #2d3748; border-radius: 12px; overflow: hidden;">
                        <thead>
                          <tr style="background: linear-gradient(to right, #374151, #4b5563);">
                            <th colspan="2" style="padding: 16px 12px; text-align: left; color: #f7fafc; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Product</th>
                            <th style="padding: 16px 12px; text-align: center; color: #f7fafc; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Qty</th>
                            <th style="padding: 16px 12px; text-align: right; color: #f7fafc; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          ${itemsHtml}
                        </tbody>
                      </table>
                    </td>
                  </tr>

                  <!-- Price Breakdown -->
                  <tr>
                    <td style="padding: 0 30px 24px;">
                      <div style="background: #2d3748; border-radius: 12px; padding: 20px;">
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                          <tr>
                            <td style="padding: 8px 0; color: #cbd5e0; font-size: 15px;">Subtotal</td>
                            <td style="padding: 8px 0; text-align: right; color: #e2e8f0; font-size: 15px; font-weight: 500;">₹${Number(subtotal).toLocaleString()}</td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; color: #cbd5e0; font-size: 15px;">Shipping</td>
                            <td style="padding: 8px 0; text-align: right; color: #e2e8f0; font-size: 15px; font-weight: 500;">${shipping === 0 ? '<span style="color: #48bb78; font-weight: 600;">Free</span>' : `₹${Number(shipping).toLocaleString()}`}</td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0 16px 0; color: #cbd5e0; font-size: 15px; border-bottom: 2px solid #4a5568;">Tax (GST)</td>
                            <td style="padding: 8px 0 16px 0; text-align: right; color: #e2e8f0; font-size: 15px; font-weight: 500; border-bottom: 2px solid #4a5568;">₹${Number(tax).toFixed(2)}</td>
                          </tr>
                          <tr>
                            <td style="padding: 16px 0 0 0; color: #ffffff; font-size: 20px; font-weight: 700;">Total</td>
                            <td style="padding: 16px 0 0 0; text-align: right; color: #ffffff; font-size: 24px; font-weight: 700;">₹${Number(totalAmount).toFixed(2)}</td>
                          </tr>
                        </table>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Shipping Address -->
                  <tr>
                    <td style="padding: 0 30px 24px;">
                      <h2 style="color: #ffffff; margin: 0 0 12px 0; font-size: 18px; font-weight: 700;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align: middle; margin-right: 8px;">
                          <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="#667eea" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Shipping Address
                      </h2>
                      <div style="background: #2d3748; border-left: 4px solid #667eea; border-radius: 8px; padding: 16px 20px;">
                        <p style="color: #e2e8f0; margin: 0; font-size: 15px; line-height: 1.8;">
                          ${shippingAddress?.address ?? ''}<br>
                          ${shippingAddress?.city ?? ''}, ${shippingAddress?.postalCode ?? ''}<br>
                          ${shippingAddress?.country ?? ''}
                        </p>
                      </div>
                    </td>
                  </tr>

                  <!-- Footer Section -->
                  <tr>
                    <td style="background: linear-gradient(to bottom, transparent, rgba(0,0,0,0.2)); padding: 32px 30px; text-align: center; border-top: 1px solid rgba(255,255,255,0.1);">
                      <p style="color: #cbd5e0; margin: 0 0 12px 0; font-size: 14px; line-height: 1.6;">
                        Need help with your order? We're here for you.
                      </p>
                      <a href="mailto:support@kashe.com" style="display: inline-block; background: linear-gradient(135deg, #667eea, #764ba2); color: #ffffff; text-decoration: none; padding: 12px 32px; border-radius: 8px; font-weight: 600; font-size: 15px; margin-bottom: 16px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);">
                        Contact Support
                      </a>
                      <p style="color: #a0aec0; margin: 16px 0 0 0; font-size: 13px;">
                        Thank you for choosing KASHÉ
                      </p>
                      <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.1);">
                        <p style="color: #718096; margin: 0; font-size: 12px;">
                          © 2025 KASHÉ. All rights reserved.
                        </p>
                      </div>
                    </td>
                  </tr>
                  
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Order confirmation email sent successfully. Message ID:', info.messageId);

    return NextResponse.json({ 
      message: 'Order confirmation email sent successfully',
      messageId: info.messageId
    });

  } catch (error) {
    console.error('❌ API Error in send-order-confirmation:', error);
    
    return NextResponse.json(
      { 
        message: 'Internal server error while sending email.',
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      },
      { status: 500 }
    );
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
  });
}