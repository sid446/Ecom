'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { Order } from '@/types'
import {
  CheckCircle,
  Package,
  Truck,
  Calendar,
  MapPin,
  Mail,
  Phone,
  User,
  CreditCard,
  Clock,
  ArrowRight,
  Copy,
  Download,
  Star,
  ShoppingBag,
  AlertTriangle,
  Loader2
} from 'lucide-react'

export default function OrderConfirmation() {
  const params = useParams()
  const id = params.id as string
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [showAnimation, setShowAnimation] = useState(false)

  useEffect(() => {
    if (id) {
      fetchOrder()
    }
  }, [id])

  useEffect(() => {
    if (order) {
      // Trigger animation after order loads
      const timer = setTimeout(() => setShowAnimation(true), 100)
      return () => clearTimeout(timer)
    }
  }, [order])

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

  const copyOrderId = async () => {
    if (order?._id) {
      try {
        await navigator.clipboard.writeText(order._id)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error('Failed to copy order ID')
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'shipped':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getEstimatedDelivery = () => {
    const orderDate = new Date(order?.createdAt || new Date())
    const deliveryDate = new Date(orderDate.getTime() + 7 * 24 * 60 * 60 * 1000) // Add 7 days
    return deliveryDate.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Order Details</h2>
              <p className="text-gray-600">Please wait while we fetch your order information...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
              <p className="text-gray-600 mb-8">
                We couldn't find the order you're looking for. Please check your order ID and try again.
              </p>
              <Link
                href="/"
                className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Continue Shopping
              </Link>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Success Header with Animation */}
          <div className={`text-center mb-12 transform transition-all duration-1000 ${
            showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <div className="relative inline-block mb-6">
              <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              {/* Success Animation Rings */}
              <div className="absolute inset-0 rounded-full border-4 border-green-300 animate-ping opacity-20"></div>
              <div className="absolute inset-2 rounded-full border-2 border-green-400 animate-pulse opacity-30"></div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🎉 Order Confirmed!
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Thank you for your order! We've received your purchase and will send you a confirmation email shortly.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Order Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Order Summary Card */}
              <div className={`bg-white rounded-2xl shadow-sm overflow-hidden transform transition-all duration-700 delay-200 ${
                showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}>
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4">
                        <Package className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">Order Summary</h2>
                        <p className="opacity-90">Your order has been successfully placed</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Order ID */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                        <Package className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Order ID</p>
                        <p className="font-mono text-sm text-gray-900">{order._id}</p>
                      </div>
                    </div>
                    <button
                      onClick={copyOrderId}
                      className="flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-200"
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>

                  {/* Order Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <Calendar className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">Order Date</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-4 bg-green-50 rounded-lg">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <Clock className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-green-600 uppercase tracking-wide">Status</p>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor('Processing')}`}>
                          Processing
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-4 bg-purple-50 rounded-lg">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                        <CreditCard className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-purple-600 uppercase tracking-wide">Payment</p>
                        <p className="text-sm font-semibold text-gray-900 capitalize">{order.paymentMethod}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className={`bg-white rounded-2xl shadow-sm p-6 transform transition-all duration-700 delay-300 ${
                showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}>
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <User className="w-5 h-5 mr-2 text-gray-600" />
                  Customer Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-3 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">Full Name</p>
                        <p className="text-gray-900">{typeof order.user === 'object' ? order.user.name : 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-3 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">Email</p>
                        <p className="text-gray-900">{typeof order.user === 'object' ? order.user.email : 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-3 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">Phone</p>
                        <p className="text-gray-900">{typeof order.user === 'object' ? order.user.phone : 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className={`bg-white rounded-2xl shadow-sm p-6 transform transition-all duration-700 delay-400 ${
                showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}>
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-gray-600" />
                  Shipping Address
                </h3>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-1">
                      <Truck className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{order.shippingAddress.address}</p>
                      <p className="text-gray-700">{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                      <p className="text-gray-700 font-medium">{order.shippingAddress.country}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className={`bg-white rounded-2xl shadow-sm overflow-hidden transform transition-all duration-700 delay-500 ${
                showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}>
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center">
                    <ShoppingBag className="w-5 h-5 mr-2 text-gray-600" />
                    Order Items ({order.orderItems.length} item{order.orderItems.length !== 1 ? 's' : ''})
                  </h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {order.orderItems.map((item, index) => (
                    <div key={index} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200">
                      <div className="flex items-center space-x-4">
                        <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                            {item.quantity}
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          <p className="text-sm text-gray-600">Unit Price: ${item.price.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Total Section */}
                <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-6 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-900">Order Total:</span>
                    <span className="text-2xl font-bold text-blue-600">${order.totalPrice.toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Payment Method: {order.paymentMethod.toUpperCase()}</p>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Delivery Timeline */}
              <div className={`bg-white rounded-2xl shadow-sm p-6 transform transition-all duration-700 delay-600 ${
                showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}>
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                  <Truck className="w-5 h-5 mr-2 text-gray-600" />
                  Delivery Timeline
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Order Confirmed</p>
                      <p className="text-sm text-gray-600">Today</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                      <Package className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Processing</p>
                      <p className="text-sm text-gray-600">1-2 business days</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                      <Truck className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-600">Estimated Delivery</p>
                      <p className="text-sm text-gray-600">{getEstimatedDelivery()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className={`bg-white rounded-2xl shadow-sm p-6 transform transition-all duration-700 delay-700 ${
                showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors duration-200">
                    <span className="flex items-center">
                      <Download className="w-4 h-4 mr-2" />
                      Download Receipt
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button className="w-full flex items-center justify-between p-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                    <span className="flex items-center">
                      <Package className="w-4 h-4 mr-2" />
                      Track Order
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Customer Support */}
              <div className={`bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl shadow-sm p-6 border border-purple-200 transform transition-all duration-700 delay-800 ${
                showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Star className="w-5 h-5 mr-2 text-purple-600" />
                  Need Help?
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Have questions about your order? Our customer support team is here to help!
                </p>
                <button className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200 font-medium">
                  Contact Support
                </button>
              </div>
            </div>
          </div>

          {/* Continue Shopping */}
          <div className={`mt-12 text-center transform transition-all duration-700 delay-900 ${
            showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <Link
              href="/"
              className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              Continue Shopping
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}