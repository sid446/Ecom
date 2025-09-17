export class CouponValidators {
  static validateCouponCode(code: string): { isValid: boolean; message?: string } {
    if (!code || typeof code !== 'string') {
      return { isValid: false, message: 'Coupon code is required' };
    }

    if (code.length < 3) {
      return { isValid: false, message: 'Coupon code must be at least 3 characters long' };
    }

    if (code.length > 20) {
      return { isValid: false, message: 'Coupon code must be less than 20 characters long' };
    }

    if (!/^[A-Z0-9-_]+$/i.test(code)) {
      return { isValid: false, message: 'Coupon code can only contain letters, numbers, hyphens, and underscores' };
    }

    return { isValid: true };
  }

  static validateDiscountValue(
    discountType: 'percentage' | 'fixed',
    discountValue: number
  ): { isValid: boolean; message?: string } {
    if (typeof discountValue !== 'number' || discountValue <= 0) {
      return { isValid: false, message: 'Discount value must be a positive number' };
    }

    if (discountType === 'percentage' && discountValue > 100) {
      return { isValid: false, message: 'Percentage discount cannot exceed 100%' };
    }

    if (discountType === 'fixed' && discountValue > 10000) {
      return { isValid: false, message: 'Fixed discount amount seems too high' };
    }

    return { isValid: true };
  }

  static validateExpiryDate(expiryDate: string | Date): { isValid: boolean; message?: string } {
    const date = new Date(expiryDate);
    
    if (isNaN(date.getTime())) {
      return { isValid: false, message: 'Invalid expiry date format' };
    }

    if (date <= new Date()) {
      return { isValid: false, message: 'Expiry date must be in the future' };
    }

    return { isValid: true };
  }
}