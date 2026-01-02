'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { useCart } from '@/context/CartContext'
import { useUser } from '@/context/UserContext' // --- NEW: Import the User context hook ---
import ShippingForm from '@/components/checkout/ShippingForm'
import OrderReview from '@/components/checkout/OrderReview'
import OrderSummary from '@/components/checkout/OrderSummary'
import { CustomerInfo } from '@/types'
import { 
  ShoppingBag, 
  ArrowLeft, 
  Loader2
} from 'lucide-react'

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface FormErrors {
  [key: string]: string
}

export default function Checkout() {
  const router = useRouter()
  const { cart, clearCart, appliedCoupon, getCartCalculations } = useCart()
  const { isAuthenticated, userInfo } = useUser() // --- NEW: Get user auth state and info ---

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
    name: '', email: '', phone: '', address: '', city: '', postalCode: '', country: 'INDIA',
  })

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card'>('cod')

  const { subtotal, couponDiscount, total } = getCartCalculations();

  // --- NEW: useEffect to pre-fill form and skip OTP for logged-in users ---
  useEffect(() => {
    // If user is logged in, pre-fill their data
    if (isAuthenticated && userInfo) {
      setFormData({
        name: userInfo.name || '',
        email: userInfo.email || '',
        phone: userInfo.phone || '',
        address: userInfo.address || '',
        city: userInfo.city || '',
        postalCode: userInfo.postalCode || '',
        country: userInfo.country || 'INDIA',
      });
      // A logged-in user is already verified, so we can skip the OTP step
      setOtpVerified(true);
    }
  }, [isAuthenticated, userInfo]); // Rerun this effect if auth state changes

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  // OTP countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpCountdown > 0) {
      interval = setInterval(() => setOtpCountdown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [otpCountdown]);

  const sendOtp = async () => {
    // This function is now only for guest users
    setSendingOtp(true); setOtpError('');
    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to send OTP');
      setOtpSent(true); setOtpCountdown(120);
      if (data.otp && process.env.NODE_ENV === 'development') setOtp(data.otp);
    } catch (error) {
      setOtpError(error instanceof Error ? error.message : 'Failed to send OTP.');
    } finally {
      setSendingOtp(false);
    }
  }

  const verifyOtp = async () => {
    // This function is now only for guest users
    setVerifyingOtp(true); setOtpError('');
    try {
      if (otp.length !== 6) throw new Error('Please enter a 6-digit code');
      const response = await fetch('/api/verify-otp', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: formData.email, otp }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Invalid OTP');
      setOtpVerified(true); setCurrentStep(2);
    } catch (error) {
      setOtpError(error instanceof Error ? error.message : 'Invalid OTP.');
    } finally {
      setVerifyingOtp(false);
    }
  }

  const handleShippingSubmit = async () => {
    // --- MODIFIED: Logic now handles both logged-in users and guests ---
    if (isAuthenticated) {
      // If logged in, otpVerified is already true, so just proceed
      setCurrentStep(2);
      return;
    }

    // For guests, the original OTP logic applies
    if (!otpSent) { await sendOtp(); return; }
    if (!otpVerified) { await verifyOtp(); return; }
    setCurrentStep(2);
  }

  const createRazorpayOrder = async () => {
    // ... (This function remains unchanged)
    const response = await fetch('/api/create-order', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ amount: total * 100, currency: 'INR' }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to create payment order');
    return data.orderId;
  }

  const handleRazorpayPayment = async () => {
    // ... (This function remains unchanged)
    try {
        if (!window.Razorpay) {
            alert("Razorpay SDK failed to load. Please check your internet connection.");
            setLoading(false);
            return;
        }
        const orderId = await createRazorpayOrder();
        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, 
            amount: total * 100, 
            currency: 'INR', 
            name: 'Your Store Name',
            description: 'Purchase from Your Store', 
            order_id: orderId, 
            handler: (response: any) => handleOrderSubmitAfterPayment(response),
            prefill: { name: formData.name, email: formData.email, contact: formData.phone },
            notes: { address: formData.address }, 
            theme: { color: '#000000' }, 
            modal: { ondismiss: () => setLoading(false) },
        };
        const razorpay = new window.Razorpay(options);
        razorpay.open();
    } catch (error) {
        console.error("Payment Error:", error);
        setErrors({ submit: 'Failed to initialize payment. Please try again.' });
        setLoading(false);
    }
  }

  const handleOrderSubmitAfterPayment = async (paymentResponse?: any) => {
    // ... (This function remains unchanged, but now sends the logged-in user's ID)
    try {
        const orderData = {
            // --- NEW: Associate order with the logged-in user if they exist ---
            userId: userInfo?._id,
            customerInfo: formData,
            orderItems: cart.map(item => ({
                product: item._id, name: item.name, quantity: item.quantity, price: item.price,
                image: item.imagefront, size: item.selectedSize,
            })),
            totalPrice: total,
            subtotal,
            shipping: 0,
            couponDiscount,
            couponCode: appliedCoupon?.code || '',
            paymentMethod,
            shippingAddress: {
                address: formData.address, city: formData.city, postalCode: formData.postalCode, country: formData.country,
            },
            ...(paymentMethod === 'card' && paymentResponse && {
                paymentDetails: {
                    razorpay_order_id: paymentResponse.razorpay_order_id,
                    razorpay_payment_id: paymentResponse.razorpay_payment_id,
                    razorpay_signature: paymentResponse.razorpay_signature,
                }
            })
        };

        const response = await fetch('/api/orders', {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(orderData),
        });

        if (response.ok) {
            const order = await response.json();
            clearCart();
            router.push(`/order-confirmation/${order._id}`);
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to place order');
        }
    } catch (error) {
        setErrors({ submit: error instanceof Error ? error.message : 'Failed to place order.' });
    } finally {
        setLoading(false);
    }
  }

  const handleOrderSubmit = async (e: React.FormEvent) => {
    // ... (This function remains unchanged)
    e.preventDefault();
    setLoading(true); setErrors({});
    try {
        if (paymentMethod === 'card') {
            await handleRazorpayPayment();
        } else {
            await handleOrderSubmitAfterPayment();
        }
    } catch (error) {
        setErrors({ submit: error instanceof Error ? error.message : 'Failed to process order.' });
        setLoading(false);
    }
  }
  
  // ... (The empty cart return block remains unchanged)
  if (cart.length === 0 && !loading) {
    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />
            <main className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-80px)]">
                <div className="max-w-md mx-auto text-center">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-lg p-8">
                        <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6"><ShoppingBag className="w-10 h-10 text-zinc-500" /></div>
                        <h1 className="text-2xl font-bold text-white mb-2">Your cart is empty</h1>
                        <p className="text-zinc-400 mb-8">Add items to your cart before checking out.</p>
                        <Link href="/" className="inline-flex items-center bg-white text-black px-6 py-3 rounded-md hover:bg-zinc-200 transition-colors duration-200 font-semibold"><ArrowLeft className="w-4 h-4 mr-2" />Continue Shopping</Link>
                    </div>
                </div>
            </main>
        </div>
    );
  }

  return (
    <div className="min-h-screen pt-10 bg-gradient-to-b from-black via-zinc-900 to-black text-white">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {/* ... (Header and steps UI remains unchanged) ... */}
        <div className="mb-8">
          <Link href="/cart" className="inline-flex items-center text-zinc-400 hover:text-white transition-colors duration-200 mb-4"><ArrowLeft className="w-4 h-4 mr-2" />Back to Cart</Link>
          <h1 className="text-3xl lg:text-4xl font-bold text-white">Checkout</h1>
          <div className="flex items-center mt-6 space-x-4">
            <div className={`flex items-center ${currentStep >= 1 ? 'text-white' : 'text-zinc-500'}`}><div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all duration-200 ${currentStep >= 1 ? 'bg-white text-black border-white' : 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>{sendingOtp || verifyingOtp ? <Loader2 className="w-4 h-4 animate-spin" /> : '1'}</div><span className="ml-3 font-medium">Shipping & Verification</span></div>
            <div className={`flex-1 h-0.5 transition-colors duration-200 ${currentStep >= 2 ? 'bg-white' : 'bg-zinc-700'}`} />
            <div className={`flex items-center ${currentStep >= 2 ? 'text-white' : 'text-zinc-500'}`}><div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all duration-200 ${currentStep >= 2 ? 'bg-white text-black border-white' : 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>{loading && currentStep === 2 ? <Loader2 className="w-4 h-4 animate-spin" /> : '2'}</div><span className="ml-3 font-medium">Review & Payment</span></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2">
            {currentStep === 1 ? (
              <ShippingForm 
                formData={formData} 
                setFormData={setFormData} 
                onSubmit={handleShippingSubmit} 
                // --- MODIFIED: Pass isAuthenticated to the form ---
                isAuthenticated={isAuthenticated} 
                // Conditionally hide OTP fields for logged-in users
                sendingOtp={isAuthenticated ? false : sendingOtp} 
                verifyingOtp={isAuthenticated ? false : verifyingOtp} 
                otp={otp} 
                setOtp={setOtp} 
                otpSent={isAuthenticated ? true : otpSent}
                otpVerified={otpVerified}
                otpCountdown={otpCountdown} 
                otpError={otpError} 
                onVerifyOtp={verifyOtp} 
                onSendOtp={sendOtp}
              />
            ) : (
              <OrderReview formData={formData} paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} loading={loading} errors={errors} onEditDetails={() => setCurrentStep(1)} onSubmit={handleOrderSubmit}/>
            )}
          </div>
          
          <div className="xl:col-span-1">
            <OrderSummary
              cart={cart}
              subtotal={subtotal}
              shipping={0}
              total={total}
              coupon={appliedCoupon}
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