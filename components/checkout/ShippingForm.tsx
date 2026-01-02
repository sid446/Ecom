'use client'
import { useState, useEffect } from 'react'
import { 
  Truck, 
  AlertCircle,
  MapPin,
  Mail,
  Phone,
  User,
  Clock,
  Loader2
} from 'lucide-react'

interface FormErrors {
  [key: string]: string
}

interface CustomerInfo {
  name: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
  country: string
}

// --- MODIFIED: Added isAuthenticated prop ---
interface ShippingFormProps {
  formData: CustomerInfo
  setFormData: (data: CustomerInfo | ((prev: CustomerInfo) => CustomerInfo)) => void
  onSubmit: () => void
  isAuthenticated: boolean // This prop is new
  sendingOtp: boolean
  verifyingOtp: boolean
  otp: string
  setOtp: (otp: string) => void
  otpSent: boolean
  otpVerified: boolean
  otpCountdown: number
  otpError: string
  onVerifyOtp: () => void
  onSendOtp: () => void
}

const COUNTRIES = [
  'India'
]

export default function ShippingForm({
  formData,
  setFormData,
  onSubmit,
  isAuthenticated, // Destructure the new prop
  sendingOtp,
  verifyingOtp,
  otp,
  setOtp,
  otpSent,
  otpVerified,
  otpCountdown,
  otpError,
  onVerifyOtp,
  onSendOtp
}: ShippingFormProps) {
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<{[key: string]: boolean}>({})

  // ... (All validation and handler functions remain the same)
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (validateForm()) {
            onSubmit()
        }
    }

  return (
    <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-lg shadow-lg p-4 sm:p-6 lg:p-8">
      <div className="flex items-center mb-4 sm:mb-6">
        <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-white mr-2 sm:mr-3 flex-shrink-0" />
        <h2 className="text-xl sm:text-2xl font-bold text-white">Shipping Information</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              required
              disabled={sendingOtp || verifyingOtp}
              value={formData.name}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`w-full border text-white bg-zinc-800 rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 transition-colors duration-200 text-sm sm:text-base
                ${errors.name && touched.name ? 'border-red-500 bg-red-900/20' : 'border-zinc-700 hover:border-zinc-600 focus:border-white'} 
                ${sendingOtp || verifyingOtp ? 'bg-zinc-700/50 cursor-not-allowed' : ''}
                focus:outline-none focus:ring-2 focus:ring-white/20`}
              placeholder="Enter your full name"
            />
            {errors.name && touched.name && (
              <p className="mt-1 text-sm text-red-400 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                <span className="break-words">{errors.name}</span>
              </p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              <Mail className="w-4 h-4 inline mr-2" />
              Email Address *
            </label>
            {/* --- MODIFIED: Email input is disabled for logged-in users --- */}
            <input
              type="email"
              name="email"
              required
              disabled={sendingOtp || verifyingOtp || isAuthenticated}
              value={formData.email}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`w-full border text-white bg-zinc-800 rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 transition-colors duration-200 text-sm sm:text-base
                ${errors.email && touched.email ? 'border-red-500 bg-red-900/20' : 'border-zinc-700 hover:border-zinc-600 focus:border-white'} 
                ${(sendingOtp || verifyingOtp || isAuthenticated) ? 'bg-zinc-700/50 cursor-not-allowed text-zinc-400' : ''}
                focus:outline-none focus:ring-2 focus:ring-white/20`}
              placeholder="Enter your email address"
            />
            {errors.email && touched.email && (
              <p className="mt-1 text-sm text-red-400 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                <span className="break-words">{errors.email}</span>
              </p>
            )}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-white mb-2">
            <Phone className="w-4 h-4 inline mr-2" />
            Phone Number *
          </label>
          <input
            type="tel"
            name="phone"
            required
            disabled={sendingOtp || verifyingOtp}
            value={formData.phone}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={`w-full border text-white bg-zinc-800 rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 transition-colors duration-200 text-sm sm:text-base
              ${errors.phone && touched.phone ? 'border-red-500 bg-red-900/20' : 'border-zinc-700 hover:border-zinc-600 focus:border-white'} 
              ${sendingOtp || verifyingOtp ? 'bg-zinc-700/50 cursor-not-allowed' : ''}
              focus:outline-none focus:ring-2 focus:ring-white/20`}
            placeholder="Enter your phone number"
          />
          {errors.phone && touched.phone && (
            <p className="mt-1 text-sm text-red-400 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
              <span className="break-words">{errors.phone}</span>
            </p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-white mb-2">
            <MapPin className="w-4 h-4 inline mr-2" />
            Street Address *
          </label>
          <textarea
            name="address"
            required
            disabled={sendingOtp || verifyingOtp}
            value={formData.address}
            onChange={handleInputChange}
            onBlur={handleBlur}
            rows={3}
            className={`w-full border text-white bg-zinc-800 rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 transition-colors duration-200 resize-none text-sm sm:text-base
              ${errors.address && touched.address ? 'border-red-500 bg-red-900/20' : 'border-zinc-700 hover:border-zinc-600 focus:border-white'} 
              ${sendingOtp || verifyingOtp ? 'bg-zinc-700/50 cursor-not-allowed' : ''}
              focus:outline-none focus:ring-2 focus:ring-white/20`}
            placeholder="Enter your complete address"
          />
          {errors.address && touched.address && (
            <p className="mt-1 text-sm text-red-400 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
              <span className="break-words">{errors.address}</span>
            </p>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          <div>
            <label className="block text-sm font-semibold text-white mb-2">City *</label>
            <input
              type="text"
              name="city"
              required
              disabled={sendingOtp || verifyingOtp}
              value={formData.city}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`w-full border text-white bg-zinc-800 rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 transition-colors duration-200 text-sm sm:text-base
                ${errors.city && touched.city ? 'border-red-500 bg-red-900/20' : 'border-zinc-700 hover:border-zinc-600 focus:border-white'} 
                ${sendingOtp || verifyingOtp ? 'bg-zinc-700/50 cursor-not-allowed' : ''}
                focus:outline-none focus:ring-2 focus:ring-white/20`}
              placeholder="City"
            />
            {errors.city && touched.city && (
              <p className="mt-1 text-sm text-red-400">{errors.city}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Postal Code *</label>
            <input
              type="text"
              name="postalCode"
              required
              disabled={sendingOtp || verifyingOtp}
              value={formData.postalCode}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`w-full border text-white bg-zinc-800 rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 transition-colors duration-200 text-sm sm:text-base
                ${errors.postalCode && touched.postalCode ? 'border-red-500 bg-red-900/20' : 'border-zinc-700 hover:border-zinc-600 focus:border-white'} 
                ${sendingOtp || verifyingOtp ? 'bg-zinc-700/50 cursor-not-allowed' : ''}
                focus:outline-none focus:ring-2 focus:ring-white/20`}
              placeholder="Postal Code"
            />
            {errors.postalCode && touched.postalCode && (
              <p className="mt-1 text-sm text-red-400">{errors.postalCode}</p>
            )}
          </div>
          
          <div className="sm:col-span-2 md:col-span-1">
            <label className="block text-sm font-semibold text-white mb-2">Country *</label>
            <select
              name="country"
              required
              disabled={sendingOtp || verifyingOtp}
              value={formData.country}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`w-full border text-white bg-zinc-800 border-zinc-700 rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 transition-colors duration-200 text-sm sm:text-base
                ${sendingOtp || verifyingOtp ? 'bg-zinc-700/50 cursor-not-allowed' : ''}
                focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white`}
            >
              {COUNTRIES.map(country => (
                <option key={country} value={country} className="bg-zinc-800 text-white">{country}</option>
              ))}
            </select>
          </div>
        </div>

        {/* --- MODIFIED: OTP Section is now hidden for logged-in users --- */}
        {!isAuthenticated && otpSent && !otpVerified && (
          <div className="pt-4 sm:pt-6 border-t border-zinc-700">
            <div className="bg-blue-900/30 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 border border-blue-800">
              <h3 className="text-lg font-semibold text-blue-400 mb-2 flex items-center">
                <Mail className="w-5 h-5 mr-2 flex-shrink-0" />
                <span className="break-words">Email Verification Required</span>
              </h3>
              <p className="text-blue-300 mb-4 text-sm sm:text-base">
                We've sent a 6-digit verification code to <span className="font-semibold break-all">{formData.email}</span>. 
                Please check your inbox and enter the code below to continue.
              </p>
              
              <div className="bg-zinc-800 rounded-lg p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                  <div className="flex-1 w-full">
                    <label className="block text-sm font-semibold text-white mb-2">
                      Verification Code
                    </label>
                    <input
                      type="text"
                      value={otp}
                      disabled={verifyingOtp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className={`w-full border text-white bg-zinc-900 border-zinc-700 rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 text-center text-base sm:text-lg font-mono tracking-widest transition-colors duration-200
                        ${verifyingOtp ? 'bg-zinc-800 cursor-not-allowed' : 'bg-zinc-900'}
                        focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white`}
                      placeholder="000000"
                      maxLength={6}
                    />
                  </div>
                  <div className="w-full sm:w-auto sm:mt-8">
                    <button
                      type="button"
                      onClick={onVerifyOtp}
                      disabled={otp.length !== 6 || verifyingOtp}
                      className="w-full sm:w-auto bg-white text-black px-4 py-2.5 sm:px-6 sm:py-3 rounded-lg hover:bg-zinc-200 disabled:bg-zinc-600 disabled:text-zinc-400 disabled:cursor-not-allowed transition-colors duration-200 font-medium flex items-center justify-center text-sm sm:text-base"
                    >
                      {verifyingOtp ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Verifying...
                        </>
                      ) : (
                        'Verify Code'
                      )}
                    </button>
                  </div>
                </div>
                
                {otpCountdown > 0 && (
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm text-zinc-400 flex items-center">
                      <Clock className="w-4 h-4 mr-1 text-orange-400 flex-shrink-0" />
                      <span>Code expires in</span>
                      <span className="font-mono ml-1 font-semibold text-orange-400">
                        {Math.floor(otpCountdown / 60)}:{(otpCountdown % 60).toString().padStart(2, '0')}
                      </span>
                    </p>
                  </div>
                )}
                
                {otpCountdown === 0 && !sendingOtp && (
                  <button
                    type="button"
                    onClick={onSendOtp}
                    disabled={sendingOtp}
                    className="mt-4 text-white hover:text-zinc-300 text-sm font-medium inline-flex items-center transition-colors duration-200"
                  >
                    {sendingOtp ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-1" />
                        Sending new code...
                      </>
                    ) : (
                      'Resend verification code'
                    )}
                  </button>
                )}
                
                {otpError && (
                  <div className="mt-4 p-3 bg-red-900/50 border border-red-800 rounded-lg">
                    <p className="text-sm text-red-300 flex items-start">
                      <AlertCircle className="w-4 h-4 mr-2 text-red-400 flex-shrink-0 mt-0.5" />
                      <span className="break-words">{otpError}</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        <div className="flex justify-end pt-4 sm:pt-6">
          <button
            type="submit"
            disabled={sendingOtp || verifyingOtp}
            className="w-full sm:w-auto bg-white text-black px-6 py-3 sm:px-8 rounded-lg hover:bg-zinc-200 disabled:bg-zinc-600 disabled:text-zinc-400 disabled:cursor-not-allowed transition-colors duration-200 font-semibold flex items-center justify-center text-sm sm:text-base"
          >
            {sendingOtp ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Sending Code...
              </>
            ) : verifyingOtp ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Verifying...
              </>
            ) : (
              // This logic works for both guests and logged-in users now
              otpSent && !otpVerified ? 'Verify and Continue' : 'Continue to Review'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}