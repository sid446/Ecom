import { useState, useCallback } from 'react';
import { IValidationResult, IApiResponse } from '@/types/coupon';

interface UseCouponReturn {
  isValidating: boolean;
  validationResult: IValidationResult | null;
  isApplying: boolean;
  validateCoupon: (code: string, orderAmount: number, email: string) => Promise<void>;
  applyCoupon: (code: string, orderAmount: number, orderId: string, email: string) => Promise<boolean>;
  clearValidation: () => void;
  getCouponHistory: (email: string) => Promise<any>;
}

export const useCoupon = (): UseCouponReturn => {
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<IValidationResult | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  const validateCoupon = useCallback(async (
    code: string,
    orderAmount: number,
    email: string
  ) => {
    setIsValidating(true);
    try {
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, orderAmount, email }),
      });

      const result: IApiResponse = await response.json();
      
      if (result.success) {
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
  }, []);

  const applyCoupon = useCallback(async (
    code: string,
    orderAmount: number,
    orderId: string,
    email: string
  ): Promise<boolean> => {
    setIsApplying(true);
    try {
      const response = await fetch('/api/coupons/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, orderAmount, orderId, email }),
      });

      const result: IApiResponse = await response.json();
      return result.success;
    } catch (error) {
      console.error('Error applying coupon:', error);
      return false;
    } finally {
      setIsApplying(false);
    }
  }, []);

  const getCouponHistory = useCallback(async (email: string) => {
    try {
      const response = await fetch(`/api/coupons/history?email=${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result: IApiResponse = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching coupon history:', error);
      return { success: false, message: 'Error fetching coupon history' };
    }
  }, []);

  const clearValidation = useCallback(() => {
    setValidationResult(null);
  }, []);

  return {
    isValidating,
    validationResult,
    isApplying,
    validateCoupon,
    applyCoupon,
    clearValidation,
    getCouponHistory
  };
};