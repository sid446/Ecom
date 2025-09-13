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
  Clock
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
      <div className="bg-zinc-800/50 p-8 border-b border-zinc-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-zinc-700 rounded-full flex items-center justify-center mr-4">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Review Your Order</h2>
              <p className="text-zinc-400 mt-1">Please review all details before placing your order</p>
            </div>
          </div>
          <button
            onClick={onEditDetails}
            disabled={loading}
            className="inline-flex items-center text-white hover:text-zinc-300 font-medium disabled:text-zinc-500 disabled:cursor-not-allowed transition-colors duration-200 bg-zinc-800 px-4 py-2 rounded-lg border border-zinc-700 hover:border-zinc-600"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Edit Details
          </button>
        </div>
      </div>

      <div className="p-8">
        {/* Shipping Address Summary */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Truck className="w-5 h-5 mr-2 text-zinc-400" />
            Shipping Address
          </h3>
          <div className="bg-zinc-800/50 rounded-lg p-6 border-l-4 border-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center text-zinc-300">
                  <User className="w-4 h-4 mr-2 text-zinc-500" />
                  <span className="font-medium">{formData.name}</span>
                </div>
                <div className="flex items-start text-zinc-300">
                  <MapPin className="w-4 h-4 mr-2 mt-0.5 text-zinc-500 flex-shrink-0" />
                  <div>
                    <p>{formData.address}</p>
                    <p>{formData.city}, {formData.postalCode}</p>
                    <p className="font-medium">{formData.country}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-zinc-300">
                  <Mail className="w-4 h-4 mr-2 text-zinc-500" />
                  <span>{formData.email}</span>
                </div>
                <div className="flex items-center text-zinc-300">
                  <Phone className="w-4 h-4 mr-2 text-zinc-500" />
                  <span>{formData.phone}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Delivery Information */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-zinc-400" />
            Delivery Information
          </h3>
          <div className="bg-green-900/30 rounded-lg p-6 border border-green-800">
            <div className="flex items-start">
              <div className="w-12 h-12 bg-green-800 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <Truck className="w-6 h-6 text-green-400" />
              </div>
              <div>
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
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <CreditCard className="w-5 h-5 mr-2 text-zinc-400" />
            Payment Method
          </h3>
          <div className="space-y-3">
            <label className={`group flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200
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
              <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center transition-colors duration-200
                ${paymentMethod === 'cod' ? 'border-green-500 bg-green-500' : 'border-zinc-600'}`}>
                {paymentMethod === 'cod' && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
              <div className="flex items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3
                  ${paymentMethod === 'cod' ? 'bg-green-800' : 'bg-zinc-800'}`}>
                  <Truck className={`w-5 h-5 ${paymentMethod === 'cod' ? 'text-green-400' : 'text-zinc-400'}`} />
                </div>
                <div>
                  <p className="font-medium text-white">Cash on Delivery</p>
                  <p className="text-sm text-zinc-400">Pay when you receive your order</p>
                </div>
              </div>
              {paymentMethod === 'cod' && (
                <div className="ml-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              )}
            </label>
            
            <label className={`group flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200
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
              <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center transition-colors duration-200
                ${paymentMethod === 'card' ? 'border-blue-500 bg-blue-500' : 'border-zinc-600'}`}>
                {paymentMethod === 'card' && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
              <div className="flex items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3
                  ${paymentMethod === 'card' ? 'bg-blue-800' : 'bg-zinc-800'}`}>
                  <CreditCard className={`w-5 h-5 ${paymentMethod === 'card' ? 'text-blue-400' : 'text-zinc-400'}`} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white">Credit/Debit Card</p>
                  <p className="text-sm text-zinc-400">Secure online payment</p>
                </div>
                <div className="bg-yellow-900 text-yellow-400 px-3 py-1 rounded-full text-sm font-medium">
                  Coming Soon
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Security Information */}
        <div className="mb-8">
          <div className="bg-zinc-800/50 rounded-lg p-6 border border-zinc-700">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-zinc-700 rounded-full flex items-center justify-center mr-4">
                <Shield className="w-5 h-5 text-zinc-400" />
              </div>
              <div>
                <h4 className="font-semibold text-white mb-1">Secure Checkout</h4>
                <p className="text-zinc-400 text-sm">
                  Your information is protected with SSL encryption and secure processing.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {errors.submit && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-800 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-400 mr-3 flex-shrink-0" />
              <p className="text-red-300">{errors.submit}</p>
            </div>
          </div>
        )}
        
        <form onSubmit={onSubmit}>
          <button
            type="submit"
            disabled={loading || paymentMethod === 'card'}
            className="w-full bg-white text-black py-4 px-6 rounded-lg disabled:bg-zinc-600 disabled:text-zinc-400 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-lg flex items-center justify-center hover:bg-zinc-200"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-3" />
                <span>Placing Your Order...</span>
              </>
            ) : (
              <>
                <Lock className="w-5 h-5 mr-3" />
                <span>{paymentMethod === 'card' ? 'Payment Method Coming Soon' : 'Place Order Securely'}</span>
              </>
            )}
          </button>
          
          {paymentMethod === 'cod' && (
            <p className="text-center text-sm text-zinc-400 mt-4">
              By placing this order, you agree to our terms of service and privacy policy.
            </p>
          )}
        </form>
      </div>
    </div>
  )
}