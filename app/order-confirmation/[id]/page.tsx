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
        return 'bg-blue-900/30 text-blue-400 border-blue-800'
      case 'shipped':
        return 'bg-green-900/30 text-green-400 border-green-800'
      case 'delivered':
        return 'bg-emerald-900/30 text-emerald-400 border-emerald-800'
      default:
        return 'bg-zinc-800 text-zinc-400 border-zinc-700'
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
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-lg p-12 text-center">
              <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Loading Order Details</h2>
              <p className="text-zinc-400">Please wait while we fetch your order information...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-lg p-12 text-center">
              <div className="w-16 h-16 bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-4">Order Not Found</h1>
              <p className="text-zinc-400 mb-8">
                We couldn't find the order you're looking for. Please check your order ID and try again.
              </p>
              <Link
                href="/"
                className="inline-flex items-center bg-white text-black px-6 py-3 rounded-lg hover:bg-zinc-200 transition-colors duration-200 font-medium"
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
    <div className="min-h-screen pt-10 bg-gradient-to-b from-black via-zinc-900 to-black text-white">
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
            <h1 className="text-4xl font-bold text-white mb-4">
              Order Confirmed!
            </h1>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Thank you for your order! We've received your purchase and will send you a confirmation email shortly.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Order Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Order Summary Card */}
              <div className={`bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl shadow-lg overflow-hidden transform transition-all duration-700 delay-200 ${
                showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}>
                <div className="bg-zinc-800/50 p-6 text-white border-b border-zinc-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-zinc-700 rounded-full flex items-center justify-center mr-4">
                        <Package className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">Order Summary</h2>
                        <p className="text-zinc-400">Your order has been successfully placed</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Order ID */}
                  <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-zinc-700 rounded-full flex items-center justify-center mr-3">
                        <Package className="w-5 h-5 text-zinc-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-zinc-400">Order ID</p>
                        <p className="font-mono text-sm text-white">{order._id}</p>
                      </div>
                    </div>
                    <button
                      onClick={copyOrderId}
                      className="flex items-center text-white hover:text-zinc-300 transition-colors duration-200"
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>

                  {/* Order Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center p-4 bg-blue-900/20 border border-blue-800 rounded-lg">
                      <div className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center mr-3">
                        <Calendar className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-blue-400 uppercase tracking-wide">Order Date</p>
                        <p className="text-sm font-semibold text-white">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-4 bg-green-900/20 border border-green-800 rounded-lg">
                      <div className="w-10 h-10 bg-green-800 rounded-full flex items-center justify-center mr-3">
                        <Clock className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-green-400 uppercase tracking-wide">Status</p>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor('Processing')}`}>
                          Processing
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-4 bg-purple-900/20 border border-purple-800 rounded-lg">
                      <div className="w-10 h-10 bg-purple-800 rounded-full flex items-center justify-center mr-3">
                        <CreditCard className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-purple-400 uppercase tracking-wide">Payment</p>
                        <p className="text-sm font-semibold text-white capitalize">{order.paymentMethod}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className={`bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl shadow-lg p-6 transform transition-all duration-700 delay-300 ${
                showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}>
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                  <User className="w-5 h-5 mr-2 text-zinc-400" />
                  Customer Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-3 text-zinc-500" />
                      <div>
                        <p className="text-sm font-medium text-zinc-400">Full Name</p>
                        <p className="text-white">{typeof order.user === 'object' ? order.user.name : 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-3 text-zinc-500" />
                      <div>
                        <p className="text-sm font-medium text-zinc-400">Email</p>
                        <p className="text-white">{typeof order.user === 'object' ? order.user.email : 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-3 text-zinc-500" />
                      <div>
                        <p className="text-sm font-medium text-zinc-400">Phone</p>
                        <p className="text-white">{typeof order.user === 'object' ? order.user.phone : 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className={`bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl shadow-lg p-6 transform transition-all duration-700 delay-400 ${
                showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}>
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-zinc-400" />
                  Shipping Address
                </h3>
                <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-800">
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center mr-4 mt-1">
                      <Truck className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{order.shippingAddress.address}</p>
                      <p className="text-zinc-300">{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                      <p className="text-zinc-300 font-medium">{order.shippingAddress.country}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className={`bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl shadow-lg overflow-hidden transform transition-all duration-700 delay-500 ${
                showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}>
                <div className="p-6 border-b border-zinc-700">
                  <h3 className="text-xl font-bold text-white flex items-center">
                    <ShoppingBag className="w-5 h-5 mr-2 text-zinc-400" />
                    Order Items ({order.orderItems.length} item{order.orderItems.length !== 1 ? 's' : ''})
                  </h3>
                </div>
                <div className="divide-y divide-zinc-700">
                  {order.orderItems.map((item, index) => (
                    <div key={index} className="p-6 flex items-center justify-between hover:bg-zinc-800/30 transition-colors duration-200">
                      <div className="flex items-center space-x-4">
                        <div className="relative w-16 h-16 bg-zinc-800 rounded-lg overflow-hidden">
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
                              <Package className="w-6 h-6 text-zinc-400" />
                            </div>
                          )}
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-white text-black rounded-full flex items-center justify-center text-xs font-bold">
                            {item.quantity}
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold text-white">{item.name}</p>
                          <p className="text-sm text-zinc-400">Quantity: {item.quantity}</p>
                          <p className="text-sm text-zinc-400">Unit Price: ${item.price.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-white">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Total Section */}
                <div className="bg-zinc-800/50 p-6 border-t border-zinc-700">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-white">Order Total:</span>
                    <span className="text-2xl font-bold text-white">${order.totalPrice.toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-zinc-400 mt-1">Payment Method: {order.paymentMethod.toUpperCase()}</p>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Delivery Timeline */}
              <div className={`bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl shadow-lg p-6 transform transition-all duration-700 delay-600 ${
                showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}>
                <h3 className="text-lg font-bold text-white mb-6 flex items-center">
                  <Truck className="w-5 h-5 mr-2 text-zinc-400" />
                  Delivery Timeline
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-white">Order Confirmed</p>
                      <p className="text-sm text-zinc-400">Today</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-3">
                      <Package className="w-4 h-4 text-black" />
                    </div>
                    <div>
                      <p className="font-medium text-white">Processing</p>
                      <p className="text-sm text-zinc-400">1-2 business days</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-zinc-700 rounded-full flex items-center justify-center mr-3">
                      <Truck className="w-4 h-4 text-zinc-400" />
                    </div>
                    <div>
                      <p className="font-medium text-zinc-400">Estimated Delivery</p>
                      <p className="text-sm text-zinc-400">{getEstimatedDelivery()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className={`bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl shadow-lg p-6 transform transition-all duration-700 delay-700 ${
                showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}>
                <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between p-3 bg-blue-900/30 text-blue-400 rounded-lg hover:bg-blue-900/40 transition-colors duration-200 border border-blue-800">
                    <span className="flex items-center">
                      <Download className="w-4 h-4 mr-2" />
                      Download Receipt
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button className="w-full flex items-center justify-between p-3 bg-zinc-800/50 text-zinc-300 rounded-lg hover:bg-zinc-800 transition-colors duration-200 border border-zinc-700">
                    <span className="flex items-center">
                      <Package className="w-4 h-4 mr-2" />
                      Track Order
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Customer Support */}
              <div className={`bg-purple-900/20 rounded-2xl shadow-lg p-6 border border-purple-800 transform transition-all duration-700 delay-800 ${
                showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <Star className="w-5 h-5 mr-2 text-purple-400" />
                  Need Help?
                </h3>
                <p className="text-sm text-zinc-400 mb-4">
                  Have questions about your order? Our customer support team is here to help!
                </p>
                <button className="w-full bg-white text-black px-4 py-2 rounded-lg hover:bg-zinc-200 transition-colors duration-200 font-medium">
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
              className="inline-flex items-center bg-white text-black px-8 py-4 rounded-xl hover:bg-zinc-200 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
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