'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import { useCart } from '@/context/CartContext'
import { CustomerInfo } from '@/types'
import { 
  ShoppingBag, 
  ArrowLeft, 
  Lock, 
  CreditCard, 
  Truck, 
  CheckCircle,
  AlertCircle,
  MapPin,
  Mail,
  Phone,
  User,
  Clock
} from 'lucide-react'

interface FormErrors {
  [key: string]: string
}

const COUNTRIES = [
  'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 
  'France', 'Italy', 'Spain', 'Netherlands', 'Sweden', 'Norway', 'Denmark'
]

export default function Checkout() {
  const router = useRouter()
  const { cart, getCartTotal, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<{[key: string]: boolean}>({})
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)
  const [otpCountdown, setOtpCountdown] = useState(0)
  const [otpError, setOtpError] = useState('')
  
  const [formData, setFormData] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'United States',
  })

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card'>('cod')

  // Calculate totals
  const subtotal = getCartTotal()
  const shipping = subtotal > 100 ? 0 : 10
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  // OTP countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpCountdown > 0) {
      interval = setInterval(() => {
        setOtpCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpCountdown]);

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Full name is required'
        if (value.trim().length < 2) return 'Name must be at least 2 characters'
        return ''
      case 'email':
        if (!value.trim()) return 'Email is required'
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) return 'Please enter a valid email address'
        return ''
      case 'phone':
        if (!value.trim()) return 'Phone number is required'
        const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/
        if (!phoneRegex.test(value)) return 'Please enter a valid phone number'
        return ''
      case 'address':
        if (!value.trim()) return 'Address is required'
        if (value.trim().length < 5) return 'Please enter a complete address'
        return ''
      case 'city':
        if (!value.trim()) return 'City is required'
        return ''
      case 'postalCode':
        if (!value.trim()) return 'Postal code is required'
        return ''
      case 'country':
        if (!value.trim()) return 'Country is required'
        return ''
      default:
        return ''
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    
    const error = validateField(name, value)
    setErrors(prev => ({ ...prev, [name]: error }))
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    let isValid = true

    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof CustomerInfo])
      if (error) {
        newErrors[key] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}))
    return isValid
  }

  const sendOtp = async () => {
  try {
    setOtpError('')
    
    // Validate form first
    if (!validateForm()) {
      return
    }

    const response = await fetch('/api/send-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: formData.email,
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country,
      }),
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to send OTP')
    }

    setOtpSent(true)
    setOtpCountdown(120) // 2 minutes countdown
    
    // For development - show OTP in console if returned
    if (data.otp && process.env.NODE_ENV === 'development') {
      console.log('Development OTP:', data.otp)
      setOtp(data.otp) // Auto-fill for testing
    }
  } catch (error) {
    console.error('Error sending OTP:', error)
    setOtpError(error instanceof Error ? error.message : 'Failed to send OTP. Please try again.')
  }
}

const verifyOtp = async () => {
  try {
    setOtpError('')
    
    if (otp.length !== 6) {
      throw new Error('Please enter a 6-digit code')
    }

    const response = await fetch('/api/verify-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email: formData.email, 
        otp 
      }),
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'Invalid OTP')
    }

    setOtpVerified(true)
    setCurrentStep(2)
  } catch (error) {
    console.error('Error verifying OTP:', error)
    setOtpError(error instanceof Error ? error.message : 'Invalid OTP. Please try again.')
  }
}

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  
  if (!validateForm()) {
    setCurrentStep(1)
    return
  }

  // If OTP not sent yet, send it with all user data
  if (!otpSent) {
    await sendOtp()
    return
  }

  // If OTP sent but not verified, verify it
  if (!otpVerified) {
    await verifyOtp()
    return
  }

  // If OTP is verified, proceed to place order
  setLoading(true)

  try {
    const orderData = {
      customerInfo: formData,
      orderItems: cart.map(item => ({
        product: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
      })),
      totalPrice: total,
      subtotal,
      shipping,
      tax,
      paymentMethod,
      shippingAddress: {
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country,
      },
    }

    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    })

    if (response.ok) {
      const order = await response.json()
      clearCart()
      router.push(`/order-confirmation/${order._id}`)
    } else {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to place order')
    }
  } catch (error) {
    console.error('Error placing order:', error)
    setErrors({ submit: error instanceof Error ? error.message : 'Failed to place order. Please try again.' })
  } finally {
    setLoading(false)
  }
}

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-10 h-10 text-gray-400" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
              <p className="text-gray-600 mb-8">Add some items to your cart before checking out.</p>
              <Link
                href="/"
                className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continue Shopping
              </Link>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link
            href="/cart"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-200 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cart
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          
          {/* Progress Steps */}
          <div className="flex items-center mt-6 space-x-4">
            <div className={`flex items-center ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                1
              </div>
              <span className="ml-2 font-medium">Shipping</span>
            </div>
            <div className={`w-8 h-0.5 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
            <div className={`flex items-center ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                2
              </div>
              <span className="ml-2 font-medium">Review</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2">
            {currentStep === 1 ? (
              <div className="bg-white rounded-xl shadow-sm p-8">
                <div className="flex items-center mb-6">
                  <Truck className="w-6 h-6 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Shipping Information</h2>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <User className="w-4 h-4 inline mr-2" />
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={`w-full border rounded-lg px-4 py-3 transition-colors duration-200 
                          ${errors.name && touched.name ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400 focus:border-blue-500'} 
                          focus:outline-none focus:ring-2 focus:ring-blue-200`}
                        placeholder="Enter your full name"
                      />
                      {errors.name && touched.name && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.name}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Mail className="w-4 h-4 inline mr-2" />
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={`w-full border rounded-lg px-4 py-3 transition-colors duration-200 
                          ${errors.email && touched.email ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400 focus:border-blue-500'} 
                          focus:outline-none focus:ring-2 focus:ring-blue-200`}
                        placeholder="Enter your email address"
                      />
                      {errors.email && touched.email && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Phone className="w-4 h-4 inline mr-2" />
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`w-full border rounded-lg px-4 py-3 transition-colors duration-200 
                        ${errors.phone && touched.phone ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400 focus:border-blue-500'} 
                        focus:outline-none focus:ring-2 focus:ring-blue-200`}
                      placeholder="Enter your phone number"
                    />
                    {errors.phone && touched.phone && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.phone}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <MapPin className="w-4 h-4 inline mr-2" />
                      Street Address *
                    </label>
                    <textarea
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      rows={3}
                      className={`w-full border rounded-lg px-4 py-3 transition-colors duration-200 resize-none
                        ${errors.address && touched.address ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400 focus:border-blue-500'} 
                        focus:outline-none focus:ring-2 focus:ring-blue-200`}
                      placeholder="Enter your complete address"
                    />
                    {errors.address && touched.address && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.address}
                      </p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">City *</label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={`w-full border rounded-lg px-4 py-3 transition-colors duration-200 
                          ${errors.city && touched.city ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400 focus:border-blue-500'} 
                          focus:outline-none focus:ring-2 focus:ring-blue-200`}
                        placeholder="City"
                      />
                      {errors.city && touched.city && (
                        <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Postal Code *</label>
                      <input
                        type="text"
                        name="postalCode"
                        required
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={`w-full border rounded-lg px-4 py-3 transition-colors duration-200 
                          ${errors.postalCode && touched.postalCode ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400 focus:border-blue-500'} 
                          focus:outline-none focus:ring-2 focus:ring-blue-200`}
                        placeholder="Postal Code"
                      />
                      {errors.postalCode && touched.postalCode && (
                        <p className="mt-1 text-sm text-red-600">{errors.postalCode}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Country *</label>
                      <select
                        name="country"
                        required
                        value={formData.country}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-colors duration-200"
                      >
                        {COUNTRIES.map(country => (
                          <option key={country} value={country}>{country}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* OTP Verification Section */}
                  {otpSent && !otpVerified && (
                    <div className="pt-6 border-t border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Verification</h3>
                      <p className="text-gray-600 mb-4">
                        We've sent a 6-digit verification code to <span className="font-medium">{formData.email}</span>. 
                        Please check your inbox and enter the code below.
                      </p>
                      
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Verification Code
                          </label>
                          <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                            placeholder="Enter 6-digit code"
                            maxLength={6}
                          />
                        </div>
                        <div className="mt-8">
                          <button
                            type="button"
                            onClick={verifyOtp}
                            disabled={otp.length !== 6 || otpCountdown === 0}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
                          >
                            Verify
                          </button>
                        </div>
                      </div>
                      
                      {otpCountdown > 0 && (
                        <p className="mt-2 text-sm text-gray-600 flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          Code expires in {Math.floor(otpCountdown / 60)}:{(otpCountdown % 60).toString().padStart(2, '0')}
                        </p>
                      )}
                      
                      {otpCountdown === 0 && (
                        <button
                          type="button"
                          onClick={sendOtp}
                          className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          Resend verification code
                        </button>
                      )}
                      
                      {otpError && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {otpError}
                        </p>
                      )}
                    </div>
                  )}
                  
                  <div className="flex justify-end pt-6">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold"
                    >
                      {otpSent && !otpVerified ? 'Verify and Continue' : 'Continue to Review'}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Review Your Order</h2>
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Edit Details
                  </button>
                </div>
                
                {/* Shipping Address Summary */}
                <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Shipping Address</h3>
                  <p className="text-gray-700">{formData.name}</p>
                  <p className="text-gray-700">{formData.address}</p>
                  <p className="text-gray-700">{formData.city}, {formData.postalCode}</p>
                  <p className="text-gray-700">{formData.country}</p>
                  <p className="text-gray-700">{formData.email} • {formData.phone}</p>
                </div>
                
                {/* Payment Method */}
                <div className="mb-8">
                  <h3 className="font-semibold text-gray-900 mb-4">Payment Method</h3>
                  <div className="space-y-3">
                    <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="mr-3"
                      />
                      <div className="flex items-center">
                        <Truck className="w-5 h-5 text-green-600 mr-2" />
                        <div>
                          <p className="font-medium">Cash on Delivery</p>
                          <p className="text-sm text-gray-600">Pay when you receive your order</p>
                        </div>
                      </div>
                    </label>
                    
                    <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="payment"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                        className="mr-3"
                      />
                      <div className="flex items-center">
                        <CreditCard className="w-5 h-5 text-blue-600 mr-2" />
                        <div>
                          <p className="font-medium">Credit/Debit Card</p>
                          <p className="text-sm text-gray-600">Secure online payment (Coming Soon)</p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
                
                {errors.submit && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                      <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                      <p className="text-red-800">{errors.submit}</p>
                    </div>
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <button
                    type="submit"
                    disabled={loading || paymentMethod === 'card'}
                    className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 font-semibold text-lg flex items-center justify-center"
                  >
                    <Lock className="w-5 h-5 mr-2" />
                    {loading ? 'Placing Order...' : paymentMethod === 'card' ? 'Coming Soon' : 'Place Order Securely'}
                  </button>
                </form>
              </div>
            )}
          </div>
          
          {/* Order Summary Sidebar */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item._id} className="flex items-center space-x-3">
                    <div className="relative w-12 h-12 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover rounded-lg"
                        sizes="48px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax:</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-900">Total:</span>
                    <span className="text-xl font-bold text-gray-900">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center text-sm text-gray-500">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  <span>SSL Secured Checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}