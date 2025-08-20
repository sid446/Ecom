'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { Order } from '@/types'

export default function OrderConfirmation() {
  const params = useParams()
  const id = params.id as string
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      fetchOrder()
    }
  }, [id])

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${id}`)
      if (response.ok) {
        const orderData = await response.json()
        setOrder(orderData)
      }
    } catch (error) {
      console.error('Error fetching order:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div>
        <Navbar />
        <main className="container mx-auto px-4 py-8 text-center">
          <p>Loading order details...</p>
        </main>
      </div>
    )
  }

  if (!order) {
    return (
      <div>
        <Navbar />
        <main className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-3xl font-bold mb-8">Order Not Found</h1>
          <Link
            href="/"
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
          >
            Continue Shopping
          </Link>
        </main>
      </div>
    )
  }

  return (
    <div>
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              <h1 className="text-2xl font-bold">Order Confirmed!</h1>
              <p>Thank you for your order. We'll send you a confirmation email shortly.</p>
            </div>
          </div>
          
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Order Details</h2>
            
            <div className="mb-4">
              <p><strong>Order ID:</strong> {order._id}</p>
              <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
              <p><strong>Status:</strong> Processing</p>
            </div>
            
            <div className="mb-6">
              <h3 className="font-bold mb-2">Customer Information</h3>
              <p><strong>Name:</strong> {typeof order.user === 'object' ? order.user.name : 'N/A'}</p>
              <p><strong>Email:</strong> {typeof order.user === 'object' ? order.user.email : 'N/A'}</p>
              <p><strong>Phone:</strong> {typeof order.user === 'object' ? order.user.phone : 'N/A'}</p>
            </div>
            
            <div className="mb-6">
              <h3 className="font-bold mb-2">Shipping Address</h3>
              <p>{order.shippingAddress.address}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
              <p>{order.shippingAddress.country}</p>
            </div>
            
            <div className="mb-6">
              <h3 className="font-bold mb-2">Order Items</h3>
              {order.orderItems.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center font-bold text-lg">
                <span>Total:</span>
                <span>${order.totalPrice.toFixed(2)}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">Payment Method: {order.paymentMethod}</p>
            </div>
            
            <div className="mt-6 text-center">
              <Link
                href="/"
                className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 inline-block"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}