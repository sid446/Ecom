import React, { useState } from 'react';
import { useCoupon } from '@/hook/use-coupon';

interface CouponInputProps {
  orderAmount: number;
  email: string; // Email is required for coupon validation
  onCouponApplied?: (discount: any) => void;
  onCouponRemoved?: () => void;
  disabled?: boolean;
}

export const CouponInput: React.FC<CouponInputProps> = ({
  orderAmount,
  email,
  onCouponApplied,
  onCouponRemoved,
  disabled = false
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  
  const {
    isValidating,
    validationResult,
    validateCoupon,
    clearValidation
  } = useCoupon();

  const handleValidate = async () => {
    if (!couponCode.trim()) return;
    if (!email.trim()) {
      alert('Please enter your email address first');
      return;
    }
    await validateCoupon(couponCode.trim(), orderAmount, email);
  };

  const handleApply = () => {
    if (validationResult?.isValid && validationResult.discount) {
      setAppliedCoupon(couponCode.trim().toUpperCase());
      onCouponApplied?.(validationResult);
      setCouponCode('');
      clearValidation();
    }
  };

  const handleRemove = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    clearValidation();
    onCouponRemoved?.();
  };

  // Don't show coupon input if email is not provided
  if (!email.trim()) {
    return (
      <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
        <p className="text-sm text-gray-600">
          Please enter your email address to apply coupon codes
        </p>
      </div>
    );
  }

  if (appliedCoupon) {
    return (
      <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="text-green-700 font-medium">Coupon {appliedCoupon} applied</span>
        </div>
        <button
          onClick={handleRemove}
          className="text-green-600 hover:text-green-800 text-sm font-medium"
          disabled={disabled}
        >
          Remove
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
          placeholder="Enter coupon code"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={disabled || isValidating}
          onKeyPress={(e) => e.key === 'Enter' && handleValidate()}
        />
        <button
          onClick={handleValidate}
          disabled={disabled || isValidating || !couponCode.trim() || !email.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isValidating ? 'Checking...' : 'Apply'}
        </button>
      </div>

      {validationResult && (
        <div className={`p-3 rounded-md ${
          validationResult.isValid 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          <p className={`text-sm ${
            validationResult.isValid ? 'text-green-700' : 'text-red-700'
          }`}>
            {validationResult.message}
          </p>
          
          {validationResult.isValid && validationResult.discount && validationResult.order && (
            <div className="mt-2 space-y-1">
              <p className="text-sm text-green-600">
                Discount: {validationResult.discount.type === 'percentage' 
                  ? `${validationResult.discount.value}%` 
                  : `$${validationResult.discount.value}`} 
                (${validationResult.discount.amount.toFixed(2)} off)
              </p>
              <p className="text-sm text-green-600">
                New Total: ${validationResult.order.finalAmount.toFixed(2)}
              </p>
              <button
                onClick={handleApply}
                className="mt-2 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
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