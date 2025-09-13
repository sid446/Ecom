'use client'
import Image from 'next/image'
import { 
  CheckCircle,
  Loader2,
  Package,
  Truck,
  CreditCard,
  Shield,
  Tag,
  Clock
} from 'lucide-react'

interface CartItem {
  _id: string
  name: string
  price: number
  quantity: number
  image: string
}

interface OrderSummaryProps {
  cart: CartItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  loading: boolean
  sendingOtp: boolean
  verifyingOtp: boolean
}

export default function OrderSummary({
  cart,
  subtotal,
  shipping,
  tax,
  total,
  loading,
  sendingOtp,
  verifyingOtp
}: OrderSummaryProps) {
  const isProcessing = loading || sendingOtp || verifyingOtp

  return (
    <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-lg shadow-lg overflow-hidden sticky top-28">
      {/* Header */}
      <div className="bg-zinc-800/50 p-6 border-b border-zinc-700">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-zinc-700 rounded-full flex items-center justify-center mr-3">
            <Package className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Order Summary</h3>
            <p className="text-sm text-zinc-400">{cart.length} item{cart.length !== 1 ? 's' : ''} in your cart</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Cart Items */}
        <div className="space-y-4 mb-6">
          {cart.map((item) => (
            <div key={item._id} className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 
              ${isProcessing ? 'bg-zinc-800/30' : 'hover:bg-zinc-800/50'}`}>
              <div className="relative w-14 h-14 flex-shrink-0">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className={`object-cover rounded-lg transition-all duration-200 
                    ${isProcessing ? 'opacity-60' : ''}`}
                  sizes="56px"
                />
                {isProcessing && (
                  <div className="absolute inset-0 bg-zinc-800 bg-opacity-50 rounded-lg flex items-center justify-center">
                    <div className="w-3 h-3 bg-zinc-500 rounded-full animate-pulse"></div>
                  </div>
                )}
                {/* Quantity Badge */}
                <div className={`absolute -top-2 -right-2 w-5 h-5 bg-white text-black rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-200
                  ${isProcessing ? 'bg-zinc-500 text-zinc-300' : ''}`}>
                  {item.quantity}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium text-white truncate transition-colors duration-200
                  ${isProcessing ? 'text-zinc-400' : ''}`}>
                  {item.name}
                </p>
                <p className={`text-xs text-zinc-400 transition-colors duration-200
                  ${isProcessing ? 'text-zinc-500' : ''}`}>
                  ${item.price.toFixed(2)} × {item.quantity}
                </p>
              </div>
              <p className={`text-sm font-semibold text-white transition-colors duration-200
                ${isProcessing ? 'text-zinc-400' : ''}`}>
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        {/* Promotional Message */}
        {subtotal > 100 && (
          <div className={`mb-6 p-4 bg-green-900/30 border border-green-800 rounded-lg transition-colors duration-200
            ${isProcessing ? 'bg-zinc-800/30 border-zinc-700' : ''}`}>
            <div className="flex items-center">
              <div className={`w-8 h-8 bg-green-800 rounded-full flex items-center justify-center mr-3
                ${isProcessing ? 'bg-zinc-700' : ''}`}>
                <Truck className={`w-4 h-4 transition-colors duration-200
                  ${isProcessing ? 'text-zinc-400' : 'text-green-400'}`} />
              </div>
              <div>
                <p className={`text-sm font-medium transition-colors duration-200
                  ${isProcessing ? 'text-zinc-400' : 'text-green-300'}`}>
                  🎉 Free Shipping Unlocked!
                </p>
                <p className={`text-xs transition-colors duration-200
                  ${isProcessing ? 'text-zinc-500' : 'text-green-200'}`}>
                  You've saved $10 on shipping
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Price Breakdown */}
        <div className="border-t border-zinc-700 pt-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className={`text-zinc-400 flex items-center transition-colors duration-200
              ${isProcessing ? 'text-zinc-500' : ''}`}>
              <Tag className="w-4 h-4 mr-1" />
              Subtotal:
            </span>
            <span className={`font-medium transition-colors duration-200
              ${isProcessing ? 'text-zinc-400' : 'text-white'}`}>
              ${subtotal.toFixed(2)}
            </span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className={`text-zinc-400 flex items-center transition-colors duration-200
              ${isProcessing ? 'text-zinc-500' : ''}`}>
              <Truck className="w-4 h-4 mr-1" />
              Shipping:
            </span>
            <span className={`font-medium transition-colors duration-200
              ${isProcessing ? 'text-zinc-400' : 'text-white'}`}>
              {shipping === 0 ? (
                <span className={`transition-colors duration-200
                  ${isProcessing ? 'text-zinc-500' : 'text-green-400'}`}>
                  Free
                </span>
              ) : (
                `$${shipping.toFixed(2)}`
              )}
            </span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className={`text-zinc-400 flex items-center transition-colors duration-200
              ${isProcessing ? 'text-zinc-500' : ''}`}>
              <CreditCard className="w-4 h-4 mr-1" />
              Tax:
            </span>
            <span className={`font-medium transition-colors duration-200
              ${isProcessing ? 'text-zinc-400' : 'text-white'}`}>
              ${tax.toFixed(2)}
            </span>
          </div>
          
          {/* Total */}
          <div className={`border-t border-zinc-700 pt-3 bg-zinc-800/50 -mx-6 px-6 py-4 mt-4
            ${isProcessing ? 'bg-zinc-800/30' : ''}`}>
            <div className="flex justify-between">
              <span className={`text-lg font-bold text-white flex items-center transition-colors duration-200
                ${isProcessing ? 'text-zinc-400' : ''}`}>
                <Package className="w-5 h-5 mr-2" />
                Total:
              </span>
              <span className={`text-xl font-bold text-white transition-colors duration-200
                ${isProcessing ? 'text-zinc-400' : ''}`}>
                ${total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
        
        {/* Security and Processing Status */}
        <div className="mt-6 pt-6 border-t border-zinc-700">
          <div className="flex items-center justify-center text-sm">
            {isProcessing ? (
              <div className="flex items-center text-white">
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                <span className="font-medium">
                  {sendingOtp ? 'Sending verification...' : 
                   verifyingOtp ? 'Verifying code...' : 
                   'Processing order...'}
                </span>
              </div>
            ) : (
              <div className="flex items-center text-green-400">
                <Shield className="w-4 h-4 mr-2" />
                <span className="font-medium">SSL Secured Checkout</span>
              </div>
            )}
          </div>
          
          {/* Additional Security Badges */}
          {!isProcessing && (
            <div className="flex items-center justify-center mt-3 space-x-4 text-xs text-zinc-500">
              <div className="flex items-center">
                <CheckCircle className="w-3 h-3 mr-1" />
                <span>256-bit SSL</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                <span>Real-time Processing</span>
              </div>
            </div>
          )}
        </div>

        {/* Shipping Estimate */}
        {!isProcessing && (
          <div className="mt-4 p-4 bg-blue-900/30 rounded-lg border border-blue-800">
            <div className="flex items-start">
              <div className="w-8 h-8 bg-blue-800 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <Truck className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-400 mb-1">Estimated Delivery</p>
                <p className="text-xs text-blue-300">
                  5-7 business days after order confirmation
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}