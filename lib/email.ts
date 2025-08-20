// lib/email.ts
import nodemailer from 'nodemailer'
import crypto from 'crypto'

interface EmailVerificationResult {
  valid: boolean
  message: string
}

interface EmailSendResult {
  success: boolean
  messageId?: string
  error?: string
}

interface OrderItem {
  name: string
  quantity: number
  price: number
  image: string
}

interface CustomerInfo {
  name: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
  country: string
}

interface OrderData {
  _id: string
  customerInfo: CustomerInfo
  orderItems: OrderItem[]
  totalPrice: number
  subtotal: number
  shipping: number
  tax: number
}

// OTP storage (in production, use Redis or database)
const otpStorage = new Map<string, { otp: string, expiresAt: number }>()

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail', // or your email service
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  })
}

// Generate OTP - EXPORTED
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString() // 6-digit OTP
}

// Verify email address exists
export const verifyEmailAddress = async (email: string): Promise<EmailVerificationResult> => {
  try {
    const transporter = createTransporter()
    
    // Verify transporter configuration
    await transporter.verify()
    
    // Basic email format validation (already done in frontend, but double-check)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format')
    }
    
    return { valid: true, message: 'Email is valid' }
  } catch (error) {
    console.error('Email verification failed:', error)
    return { valid: false, message: 'Email verification failed' }
  }
}

// Send OTP email
export const sendOTPEmail = async (email: string, otp: string): Promise<EmailSendResult> => {
  try {
    const transporter = createTransporter()
    
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
        .content { background-color: #f9f9f9; padding: 20px; }
        .otp-code { 
          font-size: 32px; 
          font-weight: bold; 
          color: #2563eb; 
          text-align: center; 
          margin: 30px 0; 
          letter-spacing: 5px;
        }
        .footer { text-align: center; padding: 20px; font-size: 14px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Email Verification</h1>
          <p>Your One-Time Password</p>
        </div>
        
        <div class="content">
          <p>Hello,</p>
          <p>Your verification code for completing your order is:</p>
          
          <div class="otp-code">${otp}</div>
          
          <p>This code will expire in 10 minutes. Please do not share this code with anyone.</p>
          <p>If you didn't request this code, please ignore this email.</p>
        </div>
        
        <div class="footer">
          <p>&copy; 2025 Your Store Name. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
    `
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Your Verification Code - ${otp}`,
      html: htmlContent
    }
    
    const result = await transporter.sendMail(mailOptions)
    console.log('OTP email sent successfully:', result.messageId)
    
    // Store OTP with expiration (10 minutes)
    otpStorage.set(email, {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
    })
    
    return { success: true, messageId: result.messageId }
    
  } catch (error: any) {
    console.error('Failed to send OTP email:', error)
    return { success: false, error: error.message }
  }
}

// Verify OTP
export const verifyOTP = (email: string, otp: string): boolean => {
  const storedData = otpStorage.get(email)
  
  if (!storedData) {
    return false // No OTP found for this email
  }
  
  if (Date.now() > storedData.expiresAt) {
    otpStorage.delete(email) // Clean up expired OTP
    return false // OTP expired
  }
  
  if (storedData.otp === otp) {
    otpStorage.delete(email) // Clean up used OTP
    return true // OTP is valid
  }
  
  return false // OTP doesn't match
}

// Clean up expired OTPs periodically
setInterval(() => {
  const now = Date.now()
  for (const [email, data] of otpStorage.entries()) {
    if (now > data.expiresAt) {
      otpStorage.delete(email)
    }
  }
}, 60 * 1000) // Clean up every minute

// Send order confirmation email
export const sendOrderConfirmationEmail = async (orderData: OrderData): Promise<EmailSendResult> => {
  try {
    const transporter = createTransporter()
    
    const { customerInfo, orderItems, totalPrice, subtotal, shipping, tax, _id } = orderData
    
    const itemsList = orderItems.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;">
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${item.price.toFixed(2)}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('')
    
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
        .content { background-color: #f9f9f9; padding: 20px; }
        .order-details { background-color: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
        .table { width: 100%; border-collapse: collapse; }
        .table th { background-color: #f3f4f6; padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb; }
        .table td { padding: 10px; border-bottom: 1px solid #eee; }
        .total-row { font-weight: bold; background-color: #f9f9f9; }
        .footer { text-align: center; padding: 20px; font-size: 14px; color: #666; }
        .button { display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Confirmation</h1>
          <p>Thank you for your order!</p>
        </div>
        
        <div class="content">
          <div class="order-details">
            <h2>Order Details</h2>
            <p><strong>Order ID:</strong> ${_id}</p>
            <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
            
            <h3>Shipping Address:</h3>
            <p>
              ${customerInfo.name}<br>
              ${customerInfo.address}<br>
              ${customerInfo.city}, ${customerInfo.postalCode}<br>
              ${customerInfo.country}<br>
              Email: ${customerInfo.email}<br>
              Phone: ${customerInfo.phone}
            </p>
            
            <h3>Order Items:</h3>
            <table class="table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsList}
                <tr>
                  <td colspan="4" style="text-align: right; padding: 10px;"><strong>Subtotal:</strong></td>
                  <td style="text-align: right; padding: 10px;"><strong>$${subtotal.toFixed(2)}</strong></td>
                </tr>
                <tr>
                  <td colspan="4" style="text-align: right; padding: 10px;"><strong>Shipping:</strong></td>
                  <td style="text-align: right; padding: 10px;"><strong>${shipping === 0 ? 'Free' : '$' + shipping.toFixed(2)}</strong></td>
                </tr>
                <tr>
                  <td colspan="4" style="text-align: right; padding: 10px;"><strong>Tax:</strong></td>
                  <td style="text-align: right; padding: 10px;"><strong>$${tax.toFixed(2)}</strong></td>
                </tr>
                <tr class="total-row">
                  <td colspan="4" style="text-align: right; padding: 15px; font-size: 18px;"><strong>Total:</strong></td>
                  <td style="text-align: right; padding: 15px; font-size: 18px;"><strong>$${totalPrice.toFixed(2)}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/order-confirmation/${_id}" class="button">
              View Order Details
            </a>
          </div>
          
          <div class="order-details">
            <h3>What's Next?</h3>
            <ul>
              <li>We'll process your order within 1-2 business days</li>
              <li>You'll receive a shipping confirmation email once your order is dispatched</li>
              <li>Expected delivery: 3-7 business days</li>
              <li>For any questions, contact us at support@yourstore.com</li>
            </ul>
          </div>
        </div>
        
        <div class="footer">
          <p>Thank you for shopping with us!</p>
          <p>If you have any questions, please contact our customer support.</p>
          <p>&copy; 2025 Your Store Name. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
    `
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: customerInfo.email,
      subject: `Order Confirmation - Order #${_id}`,
      html: htmlContent
    }
    
    const result = await transporter.sendMail(mailOptions)
    console.log('Email sent successfully:', result.messageId)
    return { success: true, messageId: result.messageId }
    
  } catch (error: any) {
    console.error('Failed to send confirmation email:', error)
    return { success: false, error: error.message }
  }
}