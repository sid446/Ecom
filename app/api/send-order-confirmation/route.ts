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
      // FIX: Add nullish coalescing (?? 0) for numerical fields that use .toFixed()
      totalAmount = 0,
      subtotal = 0, // Added safety for subtotal and shipping too
      shipping = 0,
      tax = 0, // <--- MOST LIKELY CAUSE
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

    // ... (Email credentials check logic remains the same)

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
        <td style="padding: 12px; border-bottom: 1px solid #374151;">
          <img src="${item.image}" alt="${item.name}" width="60" style="border-radius: 8px;" />
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #374151; color: #d1d5db;">
          ${item.name}
          <br>
          <small style="color: #9ca3af;">Size: ${item.size}</small>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #374151; text-align: center; color: #d1d5db;">${item.quantity}</td>
        <td style="padding: 12px; border-bottom: 1px solid #374151; text-align: right; color: #d1d5db;">₹${(item.price * item.quantity).toLocaleString()}</td>
      </tr>
    `).join('');

    const mailOptions = {
      from: {
        name: 'KASHÉ',
        address: process.env.EMAIL_USER!
      },
      to: customerEmail,
      subject: `Your KASHÉ Order is Confirmed (#${orderId})`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #000000; color: #d1d5db; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #111827; border-radius: 8px; padding: 24px; border: 1px solid #374151;">
            <div style="text-align: center; margin-bottom: 24px;">
              <h1 style="color: #ffffff; margin: 0 0 8px 0; font-size: 28px; font-weight: bold;">Order Confirmed</h1>
              <p style="color: #9ca3af; margin: 0;">Hi ${customerName}, thank you for your purchase!</p>
            </div>
            
            <div style="background-color: #1f2937; padding: 16px; border-radius: 6px; margin-bottom: 24px; text-align: center;">
              <p style="margin: 0; color: #d1d5db; font-weight: 500;">
                Order ID: <span style="color: #ffffff;">${orderId}</span>
              </p>
              <p style="margin: 4px 0 0 0; color: #9ca3af; font-size: 14px;">
                Order Date: ${new Date(orderDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
            
            <h2 style="color: #ffffff; margin-bottom: 16px; font-size: 20px;">Order Summary</h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              <thead>
                <tr style="background-color: #1f2937;">
                  <th colspan="2" style="padding: 12px; text-align: left; border-bottom: 2px solid #374151; color: #9ca3af; font-weight: normal;">Product</th>
                  <th style="padding: 12px; text-align: center; border-bottom: 2px solid #374151; color: #9ca3af; font-weight: normal;">Qty</th>
                  <th style="padding: 12px; text-align: right; border-bottom: 2px solid #374151; color: #9ca3af; font-weight: normal;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <div style="padding-top: 16px; border-top: 1px solid #374151;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <span style="color: #9ca3af;">Subtotal:</span>
                  <span style="color: #d1d5db;">₹${Number(subtotal).toLocaleString()}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <span style="color: #9ca3af;">Shipping:</span>
                  <span style="color: #d1d5db;">${shipping === 0 ? 'Free' : `₹${Number(shipping).toLocaleString()}`}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 16px;">
                  <span style="color: #9ca3af;">Tax (GST):</span>
                  <span style="color: #d1d5db;">₹${Number(tax).toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding-top: 16px; border-top: 2px solid #374151;">
                  <span style="color: #ffffff; font-weight: bold; font-size: 18px;">Total:</span>
                  <span style="color: #ffffff; font-weight: bold; font-size: 18px;">₹${Number(totalAmount).toFixed(2)}</span>
              </div>
            </div>
            
            <h2 style="color: #ffffff; margin-top: 24px; margin-bottom: 16px; font-size: 20px;">Shipping To</h2>
            <div style="background-color: #1f2937; padding: 16px; border-radius: 6px; margin-bottom: 24px; color: #d1d5db;">
              <p style="margin: 0;">
                ${shippingAddress?.address ?? ''}<br>
                ${shippingAddress?.city ?? ''}, ${shippingAddress?.postalCode ?? ''}<br>
                ${shippingAddress?.country ?? ''}
              </p>
            </div>
            
            <div style="text-align: center; color: #9ca3af; font-size: 14px; padding-top: 16px; border-top: 1px solid #374151;">
              <p style="margin: 0;">Questions about your order? Email our support team at <a href="mailto:support@kashe.com" style="color: #ffffff; text-decoration: none;">support@kashe.com</a>.</p>
              <p style="margin: 8px 0 0 0;">Thank you for shopping with KASHÉ!</p>
            </div>
          </div>
        </div>
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


