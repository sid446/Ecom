"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import Navbar from "@/components/Navbar"
import { useCart } from "@/context/CartContext"
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Package, Lock, Tag, CheckCircle, X, Mail } from "lucide-react"

// Coupon Hook
interface IValidationResult {
  isValid: boolean;
  message?: string;
  coupon?: {
    id: string;
    code: string;
    type: string;
    description: string;
  };
  discount?: {
    type: string;
    value: number;
    amount: number;
    maxDiscount?: number;
  };
  order?: {
    originalAmount: number;
    discountAmount: number;
    finalAmount: number;
  };
  error?: string;
}

interface UseCouponReturn {
  isValidating: boolean;
  validationResult: IValidationResult | null;
  validateCoupon: (code: string, orderAmount: number, email: string) => Promise<void>;
  clearValidation: () => void;
}

const useCoupon = (): UseCouponReturn => {
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<IValidationResult | null>(null);

  const validateCoupon = async (code: string, orderAmount: number, email: string) => {
    setIsValidating(true);
    try {
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, orderAmount, email }),
      });
      const result = await response.json();
      if (response.ok) {
        setValidationResult({
          isValid: true,
          message: result.message,
          coupon: result.data.coupon,
          discount: result.data.discount,
          order: result.data.order
        });
      } else {
        setValidationResult({
          isValid: false,
          message: result.message
        });
      }
    } catch (error: any) {
      setValidationResult({
        isValid: false,
        message: 'Error validating coupon',
        error: error.message
      });
    } finally {
      setIsValidating(false);
    }
  };

  const clearValidation = () => {
    setValidationResult(null);
  };

  return {
    isValidating,
    validationResult,
    validateCoupon,
    clearValidation
  };
};

// ---

// Coupon Input Component
interface CouponInputProps {
  email: string;
  orderAmount: number;
  onCouponApplied?: (discount: any) => void;
  onCouponRemoved?: () => void;
  disabled?: boolean;
}

const CouponInput: React.FC<CouponInputProps> = ({
  email,
  orderAmount,
  onCouponApplied,
  onCouponRemoved,
  disabled = false
}) => {
  const { appliedCoupon } = useCart()
  const [couponCode, setCouponCode] = useState('');
  
  const {
    isValidating,
    validationResult,
    validateCoupon,
    clearValidation
  } = useCoupon();

  const handleValidate = async () => {
    if (!couponCode.trim() || !email.trim()) return;
    await validateCoupon(couponCode.trim(), orderAmount, email);
  };

  const handleApply = () => {
    if (validationResult?.isValid && validationResult.discount) {
      onCouponApplied?.(validationResult);
      setCouponCode('');
      clearValidation();
    }
  };

  if (!email.trim()) {
    return (
      <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <Mail className="w-4 h-4 text-zinc-400" />
          <span className="text-sm text-zinc-300 font-medium">Email Required for Coupons</span>
        </div>
        <p className="text-sm text-zinc-400">
          Please enter your email address to apply coupon codes.
        </p>
      </div>
    );
  }

  if (appliedCoupon) {
    return (
      <div className="bg-green-900/30 border border-green-800 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
            <div>
              <span className="text-green-300 font-medium">Coupon {appliedCoupon.code} applied</span>
              <p className="text-green-400 text-sm mt-1">You're saving money on this order!</p>
            </div>
          </div>
          <button
            onClick={onCouponRemoved}
            className="text-green-400 hover:text-green-300 p-1 rounded-md hover:bg-green-800/30 transition-colors"
            disabled={disabled}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2 mb-2">
        <Tag className="w-4 h-4 text-zinc-400" />
        <span className="text-sm text-zinc-300 font-medium">Have a coupon?</span>
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
          placeholder="Enter coupon code"
          className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
          disabled={disabled || isValidating}
          onKeyPress={(e) => e.key === 'Enter' && handleValidate()}
        />
        <button
          onClick={handleValidate}
          disabled={disabled || isValidating || !couponCode.trim() || !email.trim()}
          className="px-4 py-2 bg-white text-black rounded-md hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
        >
          {isValidating ? 'Checking...' : 'Apply'}
        </button>
      </div>
      {validationResult && (
        <div className={`p-3 rounded-md border ${validationResult.isValid ? 'bg-green-900/30 border-green-800' : 'bg-red-900/30 border-red-800'}`}>
          <p className={`text-sm ${validationResult.isValid ? 'text-green-300' : 'text-red-300'}`}>
            {validationResult.message}
          </p>
          {validationResult.isValid && validationResult.discount && validationResult.order && (
            <div className="mt-2 space-y-1">
              <p className="text-sm text-green-400">
                Discount: {validationResult.discount.type === 'percentage' ? `${validationResult.discount.value}%` : `₹${validationResult.discount.value}`} 
                (₹{validationResult.discount.amount.toFixed(2)} off)
              </p>
              <p className="text-sm text-green-400">
                New Total: ₹{validationResult.order.finalAmount.toLocaleString()}
              </p>
              <button
                onClick={handleApply}
                className="mt-2 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 font-medium transition-colors"
                disabled={disabled}
              >
                Apply This Coupon
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ---

export default function Cart() {
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    clearCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    getCartCalculations
  } = useCart();

  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());
  const [isClearing, setIsClearing] = useState(false);

  const [userEmail, setUserEmail] = useState('');
  const [emailInputValue, setEmailInputValue] = useState('');
  const [showEmailInput, setShowEmailInput] = useState(false);
  
  // Destructuring updated to remove 'shipping'
  const { subtotal, couponDiscount, total } = getCartCalculations();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  }

  const handleRemoveItem = (productId: string) => {
    setRemovingItems((prev) => new Set(prev).add(productId));
    setTimeout(() => {
      removeFromCart(productId);
      setRemovingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }, 300);
  }

  const handleClearCart = () => {
    setIsClearing(true);
    const allItemIds = cart.map(item => item._id);
    setRemovingItems(new Set(allItemIds));
    setTimeout(() => {
      clearCart();
      setIsClearing(false);
    }, 500);
  }

  const handleCouponApplied = (couponData: any) => {
    applyCoupon({
      amount: couponData.order.discountAmount,
      code: couponData.coupon.code,
      type: couponData.discount.type,
      value: couponData.discount.value
    });
  };

  const handleCouponRemoved = () => {
    removeCoupon();
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInputValue.trim()) {
      setUserEmail(emailInputValue.trim());
      setShowEmailInput(false);
    }
  };


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
              <h1 className="text-2xl font-bold text-white mb-2">Your Cart is Empty</h1>
              <p className="text-zinc-400 mb-8">Looks like you haven't added anything yet.</p>
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
            href="/"
            className="inline-flex items-center text-zinc-400 hover:text-white transition-colors duration-200 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shopping
          </Link>
          <h1 className="text-3xl lg:text-4xl font-bold text-white">Shopping Cart</h1>
          <p className="text-zinc-400 mt-2">
            You have {cart.length} item{cart.length !== 1 ? "s" : ""} in your cart
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2">
            <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-lg shadow-lg overflow-hidden">
              {cart.map((item, index) => (
                <div key={`${item._id}-${item.selectedSize}`} className={`flex flex-col sm:flex-row sm:items-center p-6 transition-all duration-300 ease-out ${index !== cart.length - 1 ? "border-b border-zinc-800" : ""} ${removingItems.has(item._id) ? "opacity-0 -translate-x-4 scale-95" : "opacity-100 translate-x-0 scale-100"}`}>
                  <div className="relative w-24 h-24 mr-6 flex-shrink-0 mb-4 sm:mb-0">
                    <Image src={item.imagefront || "/placeholder.svg"} alt={item.name} fill className="object-cover rounded-md" sizes="96px"/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white text-lg mb-1 truncate">{item.name}</h3>
                    <p className="text-zinc-400 text-sm">Size: {item.selectedSize}</p>
                    <p className="text-zinc-300 font-medium text-lg sm:hidden mt-2">₹{item.price.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center space-x-2 mx-auto sm:mx-6 my-4 sm:my-0">
                    <button onClick={() => handleQuantityChange(item._id, item.quantity - 1)} className="w-10 h-10 rounded-md border border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800 transition-all duration-200 flex items-center justify-center" aria-label={`Decrease quantity of ${item.name}`}>
                      <Minus className="w-4 h-4 text-zinc-400" />
                    </button>
                    <div className="w-16 text-center"><span className="text-lg font-semibold text-white">{item.quantity}</span></div>
                    <button onClick={() => handleQuantityChange(item._id, item.quantity + 1)} className="w-10 h-10 rounded-md border border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800 transition-all duration-200 flex items-center justify-center" aria-label={`Increase quantity of ${item.name}`}>
                      <Plus className="w-4 h-4 text-zinc-400" />
                    </button>
                  </div>
                  <div className="text-left sm:text-right sm:mr-6 min-w-0 flex-shrink-0"><p className="font-bold text-lg text-white">₹{(item.price * item.quantity).toLocaleString()}</p></div>
                  <button onClick={() => handleRemoveItem(item._id)} className="w-10 h-10 rounded-md text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-colors duration-200 flex items-center justify-center ml-auto sm:ml-0 mt-4 sm:mt-0" aria-label={`Remove ${item.name} from cart`}>
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <button onClick={handleClearCart} disabled={isClearing} className={`px-6 py-3 rounded-md border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-all duration-200 font-medium ${isClearing ? "opacity-50 cursor-not-allowed" : "hover:border-zinc-600 hover:text-white"}`}>
                {isClearing ? "Clearing Cart..." : "Clear Cart"}
              </button>
            </div>
          </div>
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-lg shadow-lg p-6 sticky top-28">
              <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>
              
              {/* --- CHANGES START HERE --- */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-zinc-300">
                  <span>Subtotal:</span>
                  <span className="font-medium text-white">₹{subtotal.toLocaleString()}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-green-400">
                    <span>Coupon Discount ({appliedCoupon.code}):</span>
                    <span className="font-medium">-₹{couponDiscount.toLocaleString()}</span>
                  </div>
                )}
                {/* Shipping line and promotional message have been removed */}
              </div>
              {/* --- CHANGES END HERE --- */}
              
              {!userEmail && showEmailInput ? (
                <div className="mb-6 pb-6 border-b border-zinc-700">
                  <form onSubmit={handleEmailSubmit} className="space-y-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <Mail className="w-4 h-4 text-zinc-400" />
                      <span className="text-sm text-zinc-300 font-medium">Enter Email for Coupons</span>
                    </div>
                    <div className="flex gap-2">
                      <input 
                        type="email" 
                        value={emailInputValue} 
                        onChange={(e) => setEmailInputValue(e.target.value)} 
                        placeholder="your@email.com" 
                        className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent" 
                        required 
                      />
                      <button type="submit" className="px-4 py-2 bg-white text-black rounded-md hover:bg-zinc-200 font-medium transition-colors">Save</button>
                    </div>
                  </form>
                </div>
              ) : !userEmail ? (
                <div className="mb-6 pb-6 border-b border-zinc-700">
                  <button onClick={() => setShowEmailInput(true)} className="w-full flex items-center justify-center space-x-2 py-3 px-4 border border-zinc-600 rounded-md text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors">
                    <Tag className="w-4 h-4" />
                    <span>Add Email to Use Coupons</span>
                  </button>
                </div>
              ) : (
                <div className="mb-6 pb-6 border-b border-zinc-700">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-green-400 font-medium">Email: {userEmail}</span>
                    </div>
                    <button 
                      onClick={() => { 
                        setShowEmailInput(true);
                        setEmailInputValue(userEmail); 
                        setUserEmail(''); 
                        removeCoupon(); 
                      }} 
                      className="text-zinc-400 hover:text-white text-sm"
                    >
                      Change
                    </button>
                  </div>
                  <CouponInput email={userEmail} orderAmount={subtotal} onCouponApplied={handleCouponApplied} onCouponRemoved={handleCouponRemoved}/>
                </div>
              )}

              <div className="border-t border-zinc-700 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-white">Total:</span>
                  <span className="text-2xl font-bold text-white">₹{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>
              <div className="space-y-3">
                <Link href="/checkout" className="w-full bg-white text-black py-4 px-6 rounded-md text-center block hover:bg-zinc-200 transition-colors duration-200 font-semibold text-lg">Proceed to Checkout</Link>
                <div className="text-center text-sm text-zinc-500">
                  <div className="flex items-center justify-center space-x-2 mt-2">
                    <Lock className="w-3 h-3" />
                    <span>Secure checkout guaranteed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}