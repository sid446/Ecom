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
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Review Your Order</h2>
              <p className="text-gray-600 mt-1">Please review all details before placing your order</p>
            </div>
          </div>
          <button
            onClick={onEditDetails}
            disabled={loading}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium disabled:text-gray-400 disabled:cursor-not-allowed transition-colors duration-200 bg-white px-4 py-2 rounded-lg border border-blue-200 hover:border-blue-300"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Edit Details
          </button>
        </div>
      </div>

      <div className="p-8">
        {/* Shipping Address Summary */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Truck className="w-5 h-5 mr-2 text-gray-600" />
            Shipping Address
          </h3>
          <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-blue-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center text-gray-700">
                  <User className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="font-medium">{formData.name}</span>
                </div>
                <div className="flex items-start text-gray-700">
                  <MapPin className="w-4 h-4 mr-2 mt-0.5 text-gray-500 flex-shrink-0" />
                  <div>
                    <p>{formData.address}</p>
                    <p>{formData.city}, {formData.postalCode}</p>
                    <p className="font-medium">{formData.country}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-gray-700">
                  <Mail className="w-4 h-4 mr-2 text-gray-500" />
                  <span>{formData.email}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Phone className="w-4 h-4 mr-2 text-gray-500" />
                  <span>{formData.phone}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Delivery Information */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-gray-600" />
            Delivery Information
          </h3>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
            <div className="flex items-start">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <Truck className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-green-900 mb-2">Estimated Delivery</h4>
                <p className="text-green-800 mb-1">
                  <span className="font-medium">5-7 business days</span> for standard delivery
                </p>
                <p className="text-green-700 text-sm">
                  Orders are processed within 1-2 business days. You'll receive tracking information once your order ships.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Payment Method */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <CreditCard className="w-5 h-5 mr-2 text-gray-600" />
            Payment Method
          </h3>
          <div className="space-y-3">
            <label className={`group flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200
              ${paymentMethod === 'cod' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}
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
                ${paymentMethod === 'cod' ? 'border-green-500 bg-green-500' : 'border-gray-300'}`}>
                {paymentMethod === 'cod' && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
              <div className="flex items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3
                  ${paymentMethod === 'cod' ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <Truck className={`w-5 h-5 ${paymentMethod === 'cod' ? 'text-green-600' : 'text-gray-600'}`} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Cash on Delivery</p>
                  <p className="text-sm text-gray-600">Pay when you receive your order</p>
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
              ${paymentMethod === 'card' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}
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
                ${paymentMethod === 'card' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                {paymentMethod === 'card' && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
              <div className="flex items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3
                  ${paymentMethod === 'card' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                  <CreditCard className={`w-5 h-5 ${paymentMethod === 'card' ? 'text-blue-600' : 'text-gray-600'}`} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Credit/Debit Card</p>
                  <p className="text-sm text-gray-600">Secure online payment</p>
                </div>
                <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                  Coming Soon
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Security Information */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                <Shield className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Secure Checkout</h4>
                <p className="text-gray-600 text-sm">
                  Your information is protected with SSL encryption and secure processing.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {errors.submit && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0" />
              <p className="text-red-800">{errors.submit}</p>
            </div>
          </div>
        )}
        
        <form onSubmit={onSubmit}>
          <button
            type="submit"
            disabled={loading || paymentMethod === 'card'}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 px-6 rounded-lg disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-lg flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none"
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
            <p className="text-center text-sm text-gray-600 mt-4">
              By placing this order, you agree to our terms of service and privacy policy.
            </p>
          )}
        </form>
      </div>
    </div>
  )
}