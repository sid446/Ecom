'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { useCart } from '@/context/CartContext'
import ShippingForm from '@/components/checkout/ShippingForm'
import OrderReview from '@/components/checkout/OrderReview'
import OrderSummary from '@/components/checkout/OrderSummary'
import { CustomerInfo } from '@/types'
import { 
  ShoppingBag, 
  ArrowLeft, 
  Loader2
} from 'lucide-react'

interface FormErrors {
  [key: string]: string
}

export default function Checkout() {
  const router = useRouter()
  const { cart, getCartTotal, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [sendingOtp, setSendingOtp] = useState(false)
  const [verifyingOtp, setVerifyingOtp] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [errors, setErrors] = useState<FormErrors>({})
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
    country: 'INDIA',
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

  const sendOtp = async () => {
    try {
      setSendingOtp(true)
      setOtpError('')

      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
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
    } finally {
      setSendingOtp(false)
    }
  }

  const verifyOtp = async () => {
    try {
      setVerifyingOtp(true)
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
    } finally {
      setVerifyingOtp(false)
    }
  }

  const handleShippingSubmit = async () => {
    // If OTP not sent yet, send it
    if (!otpSent) {
      await sendOtp()
      return
    }

    // If OTP sent but not verified, verify it
    if (!otpVerified) {
      await verifyOtp()
      return
    }

    // If OTP is verified, proceed to review step
    setCurrentStep(2)
  }

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setLoading(true)

    try {
      const orderData = {
        customerInfo: formData,
        orderItems: cart.map(item => ({
          product: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.imagefront,
          // Add the selectedSize here
          size: item.selectedSize, 
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
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <main className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-lg p-8">
              <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-10 h-10 text-zinc-500" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Your cart is empty</h1>
              <p className="text-zinc-400 mb-8">Add some items to your cart before checking out.</p>
              <Link
                href="/"
                className="inline-flex items-center bg-white text-black px-6 py-3 rounded-md hover:bg-zinc-200 transition-colors duration-200 font-semibold"
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
    <div className="min-h-screen pt-10 bg-gradient-to-b from-black via-zinc-900 to-black text-white">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link
            href="/cart"
            className="inline-flex items-center text-zinc-400 hover:text-white transition-colors duration-200 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cart
          </Link>
          <h1 className="text-3xl lg:text-4xl font-bold text-white">Checkout</h1>
          
          {/* Enhanced Progress Steps */}
          <div className="flex items-center mt-6 space-x-4">
            <div className={`flex items-center ${currentStep >= 1 ? 'text-white' : 'text-zinc-500'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all duration-200
                ${currentStep >= 1 ? 'bg-white text-black border-white' : 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>
                {sendingOtp || verifyingOtp ? <Loader2 className="w-4 h-4 animate-spin" /> : '1'}
              </div>
              <span className="ml-3 font-medium">Shipping & Verification</span>
            </div>
            <div className={`flex-1 h-0.5 transition-colors duration-200 ${currentStep >= 2 ? 'bg-white' : 'bg-zinc-700'}`} />
            <div className={`flex items-center ${currentStep >= 2 ? 'text-white' : 'text-zinc-500'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all duration-200
                ${currentStep >= 2 ? 'bg-white text-black border-white' : 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>
                {loading && currentStep === 2 ? <Loader2 className="w-4 h-4 animate-spin" /> : '2'}
              </div>
              <span className="ml-3 font-medium">Review & Payment</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2">
            {currentStep === 1 ? (
              <ShippingForm
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleShippingSubmit}
                sendingOtp={sendingOtp}
                verifyingOtp={verifyingOtp}
                otp={otp}
                setOtp={setOtp}
                otpSent={otpSent}
                otpVerified={otpVerified}
                otpCountdown={otpCountdown}
                otpError={otpError}
                onVerifyOtp={verifyOtp}
                onSendOtp={sendOtp}
              />
            ) : (
              <OrderReview
                formData={formData}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                loading={loading}
                errors={errors}
                onEditDetails={() => setCurrentStep(1)}
                onSubmit={handleOrderSubmit}
              />
            )}
          </div>
          
          {/* Enhanced Order Summary Sidebar */}
          <div className="xl:col-span-1">
            <OrderSummary
              cart={cart}
              subtotal={subtotal}
              shipping={shipping}
              tax={tax}
              total={total}
              loading={loading}
              sendingOtp={sendingOtp}
              verifyingOtp={verifyingOtp}
            />
          </div>
        </div>
      </main>
    </div>
  )
}