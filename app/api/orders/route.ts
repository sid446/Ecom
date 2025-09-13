import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import Order from '@/models/Order'
import { User } from '@/models/User'

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()
    const { customerInfo, orderItems, totalPrice, shippingAddress, subtotal, shipping, tax, paymentMethod } = await request.json()

    // --- Create or find user ---
    let user = await User.findOne({ email: customerInfo.email })
    
    if (!user) {
      // Create new user if they don't exist
      user = new User({
        name: customerInfo.name,
        email: customerInfo.email,
        phone: customerInfo.phone,
        password: 'temp_password_' + Date.now(), // Create a temporary placeholder password
        address: {
          street: shippingAddress.address,
          city: shippingAddress.city,
          zipCode: shippingAddress.postalCode,
          country: shippingAddress.country,
        },
      })
      await user.save()
    }

    // --- Create the order ---
    // The `orderItems` array from the request should now include the `size` property.
    // Mongoose will automatically map it based on the updated schema.
    const order = new Order({
      user: user._id,
      orderItems,
      shippingAddress,
      totalPrice,
      paymentMethod: paymentMethod || 'Cash on Delivery',
      subtotal,
      shipping,
      tax,
    })

    await order.save()
    
    // Populate user info in the response
    await order.populate('user', 'name email phone')
    
    // --- Send order confirmation email ---
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

      const emailResponse = await fetch(`${baseUrl}/api/send-order-confirmation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerEmail: customerInfo.email,
          customerName: customerInfo.name,
          orderId: order.orderId, // Using the custom orderId for the email
          orderDate: order.createdAt,
          orderItems: orderItems.map((item: any) => ({
            name: item.name,
            quantity: item.quantity,
            size: item.size, // <-- Updated this line to include size in the email
            price: item.price,
            image: item.image,
          })),
          totalAmount: totalPrice,
          subtotal: subtotal,
          shipping: shipping,
          tax: tax,
          shippingAddress: {
            address: shippingAddress.address,
            city: shippingAddress.city,
            postalCode: shippingAddress.postalCode,
            country: shippingAddress.country,
          },
          paymentMethod: paymentMethod || 'Cash on Delivery',
        }),
      })

      if (!emailResponse.ok) {
        const errorData = await emailResponse.json()
        console.error('Failed to send confirmation email:', errorData)
      } else {
        console.log('✅ Order confirmation email sent successfully')
      }
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError)
      // We don't want to fail the entire order creation if the email fails to send
    }
    // --- End of email confirmation code ---

    return NextResponse.json(order, { status: 201 })
  } catch (error: any) {
    console.error('Order creation error:', error)
    return NextResponse.json({ error: 'Failed to create order', details: error.message }, { status: 400 })
  }
}

export async function GET() {
  try {
    await connectToDatabase()
    const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 })
    return NextResponse.json(orders)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}
