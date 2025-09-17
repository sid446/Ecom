'use client'
import { 
  Lock, 
  CreditCard, 
  Truck, 
  AlertCircle,
  MapPin,
  Mail,
  Phone,
  User,
  Loader2,
  Edit3,
  Shield,
  Package,
  Clock,
  CheckCircle
} from 'lucide-react'

interface CustomerInfo {
  name: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
  country: string
}

interface OrderReviewProps {
  formData: CustomerInfo
  paymentMethod: 'cod' | 'card'
  setPaymentMethod: (method: 'cod' | 'card') => void
  loading: boolean
  errors: { [key: string]: string }
  onEditDetails: () => void
  onSubmit: (e: React.FormEvent) => void
}

export default function OrderReview({
  formData,
  paymentMethod,
  setPaymentMethod,
  loading,
  errors,
  onEditDetails,
  onSubmit
}: OrderReviewProps) {
  return (
    <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-zinc-800/50 p-4 sm:p-6 lg:p-8 border-b border-zinc-700">
        <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4">
          <div className="flex items-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-zinc-700 rounded-full flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
              <Package className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Review Your Order</h2>
              <p className="text-zinc-400 mt-1 text-sm sm:text-base">Please review all details before placing your order</p>
            </div>
          </div>
          <button
            onClick={onEditDetails}
            disabled={loading}
            className="inline-flex items-center text-white hover:text-zinc-300 font-medium disabled:text-zinc-500 disabled:cursor-not-allowed transition-colors duration-200 bg-zinc-800 px-3 py-2 sm:px-4 sm:py-2 rounded-lg border border-zinc-700 hover:border-zinc-600 text-sm sm:text-base flex-shrink-0"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Edit Details
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-6 lg:p-8">
        {/* Shipping Address Summary */}
        <div className="mb-6 sm:mb-8">
          <h3 className="text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center">
            <Truck className="w-5 h-5 mr-2 text-zinc-400" />
            Shipping Address
          </h3>
          <div className="bg-zinc-800/50 rounded-lg p-4 sm:p-6 border-l-4 border-white">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-3">
                <div className="flex items-center text-zinc-300">
                  <User className="w-4 h-4 mr-2 text-zinc-500 flex-shrink-0" />
                  <span className="font-medium break-words">{formData.name}</span>
                </div>
                <div className="flex items-start text-zinc-300">
                  <MapPin className="w-4 h-4 mr-2 mt-0.5 text-zinc-500 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="break-words">{formData.address}</p>
                    <p className="break-words">{formData.city}, {formData.postalCode}</p>
                    <p className="font-medium break-words">{formData.country}</p>
                  </div>
                </div>
                <div className="flex items-center text-zinc-300">
                  <Mail className="w-4 h-4 mr-2 text-zinc-500 flex-shrink-0" />
                  <span className="break-all min-w-0">{formData.email}</span>
                </div>
                <div className="flex items-center text-zinc-300">
                  <Phone className="w-4 h-4 mr-2 text-zinc-500 flex-shrink-0" />
                  <span className="break-words">{formData.phone}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Delivery Information */}
        <div className="mb-6 sm:mb-8">
          <h3 className="text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-zinc-400" />
            Delivery Information
          </h3>
          <div className="bg-green-900/30 rounded-lg p-4 sm:p-6 border border-green-800">
            <div className="flex items-start">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-800 rounded-full flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
              </div>
              <div className="min-w-0">
                <h4 className="font-semibold text-green-400 mb-2">Estimated Delivery</h4>
                <p className="text-green-300 mb-1">
                  <span className="font-medium">5-7 business days</span> for standard delivery
                </p>
                <p className="text-green-200 text-sm">
                  Orders are processed within 1-2 business days. You'll receive tracking information once your order ships.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Payment Method */}
        <div className="mb-6 sm:mb-8">
          <h3 className="text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center">
            <CreditCard className="w-5 h-5 mr-2 text-zinc-400" />
            Payment Method
          </h3>
          <div className="space-y-3">
            {/* Cash on Delivery */}
            <label className={`group flex items-start sm:items-center p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all duration-200
              ${paymentMethod === 'cod' ? 'border-green-500 bg-green-900/20' : 'border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800/50'}
              ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={paymentMethod === 'cod'}
                disabled={loading}
                onChange={() => setPaymentMethod('cod')}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center transition-colors duration-200 mt-0.5 sm:mt-0 flex-shrink-0
                ${paymentMethod === 'cod' ? 'border-green-500 bg-green-500' : 'border-zinc-600'}`}>
                {paymentMethod === 'cod' && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
              <div className="flex items-start sm:items-center flex-1 min-w-0">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0
                  ${paymentMethod === 'cod' ? 'bg-green-800' : 'bg-zinc-800'}`}>
                  <Truck className={`w-4 h-4 sm:w-5 sm:h-5 ${paymentMethod === 'cod' ? 'text-green-400' : 'text-zinc-400'}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-white">Cash on Delivery</p>
                  <p className="text-sm text-zinc-400">Pay when you receive your order</p>
                </div>
                {paymentMethod === 'cod' && (
                  <div className="ml-3 flex-shrink-0">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
              </div>
            </label>
            
            {/* Online Payment with Razorpay */}
            <label className={`group flex items-start sm:items-center p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all duration-200
              ${paymentMethod === 'card' ? 'border-blue-500 bg-blue-900/20' : 'border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800/50'}
              ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <input
                type="radio"
                name="payment"
                value="card"
                checked={paymentMethod === 'card'}
                disabled={loading}
                onChange={() => setPaymentMethod('card')}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center transition-colors duration-200 mt-0.5 sm:mt-0 flex-shrink-0
                ${paymentMethod === 'card' ? 'border-blue-500 bg-blue-500' : 'border-zinc-600'}`}>
                {paymentMethod === 'card' && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
              <div className="flex items-start sm:items-center flex-1 min-w-0">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0
                  ${paymentMethod === 'card' ? 'bg-blue-800' : 'bg-zinc-800'}`}>
                  <CreditCard className={`w-4 h-4 sm:w-5 sm:h-5 ${paymentMethod === 'card' ? 'text-blue-400' : 'text-zinc-400'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-white">Online Payment</p>
                    <div className="bg-blue-900 text-blue-400 px-2 py-0.5 rounded text-xs font-medium">
                      Secure
                    </div>
                  </div>
                  <p className="text-sm text-zinc-400 mb-2">Credit/Debit Card, UPI, Net Banking</p>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-zinc-500">Powered by</span>
                    <span className="text-xs font-medium text-blue-400">Razorpay</span>
                  </div>
                </div>
                {paymentMethod === 'card' && (
                  <div className="ml-3 flex-shrink-0">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
              </div>
            </label>
          </div>

          {/* Payment Method Info */}
          {paymentMethod === 'card' && (
            <div className="mt-4 bg-blue-900/20 border border-blue-800 rounded-lg p-3 sm:p-4">
              <div className="flex items-start">
                <Shield className="w-5 h-5 text-blue-400 mr-3 flex-shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-blue-300">Secure Online Payment</h4>
                    {process.env.NODE_ENV === 'development' && (
                      <span className="bg-orange-900 text-orange-400 px-2 py-1 rounded text-xs font-medium">
                        TEST MODE
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-blue-200 mb-2">
                    Your payment will be processed securely through Razorpay. We support all major payment methods.
                  </p>
                  {process.env.NODE_ENV === 'development' && (
                    <p className="text-xs text-orange-300 mb-2 bg-orange-900/20 p-2 rounded">
                      🧪 <strong>Test Mode:</strong> Use card 4111 1111 1111 1111 with any future expiry and CVV
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 text-xs text-blue-300">
                    <span className="bg-blue-800 px-2 py-1 rounded">Credit Cards</span>
                    <span className="bg-blue-800 px-2 py-1 rounded">Debit Cards</span>
                    <span className="bg-blue-800 px-2 py-1 rounded">UPI</span>
                    <span className="bg-blue-800 px-2 py-1 rounded">Net Banking</span>
                    <span className="bg-blue-800 px-2 py-1 rounded">Wallets</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Security Information */}
        <div className="mb-6 sm:mb-8">
          <div className="bg-zinc-800/50 rounded-lg p-4 sm:p-6 border border-zinc-700">
            <div className="flex items-start sm:items-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-zinc-700 rounded-full flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-400" />
              </div>
              <div className="min-w-0">
                <h4 className="font-semibold text-white mb-1">Secure Checkout</h4>
                <p className="text-zinc-400 text-sm">
                  Your information is protected with SSL encryption and secure processing.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {errors.submit && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-900/50 border border-red-800 rounded-lg">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-red-400 mr-3 flex-shrink-0 mt-0.5" />
              <p className="text-red-300 text-sm sm:text-base min-w-0">{errors.submit}</p>
            </div>
          </div>
        )}
        
        <form onSubmit={onSubmit}>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black py-3 sm:py-4 px-4 sm:px-6 rounded-lg disabled:bg-zinc-600 disabled:text-zinc-400 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-base sm:text-lg flex items-center justify-center hover:bg-zinc-200"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-3" />
                <span>
                  {paymentMethod === 'card' ? 'Processing Payment...' : 'Placing Your Order...'}
                </span>
              </>
            ) : (
              <>
                <Lock className="w-5 h-5 mr-3" />
                <span className="text-center">
                  {paymentMethod === 'card' ? 'Proceed to Payment' : 'Place Order Securely'}
                </span>
              </>
            )}
          </button>
          
          <p className="text-center text-xs sm:text-sm text-zinc-400 mt-3 sm:mt-4 px-2">
            By placing this order, you agree to our terms of service and privacy policy.
            {paymentMethod === 'card' && (
              <span className="block mt-1">
                You will be redirected to Razorpay for secure payment processing.
              </span>
            )}
          </p>
        </form>
      </div>
    </div>
  )
}