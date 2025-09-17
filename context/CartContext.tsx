'use client'

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { Product, CartItem } from '@/types'

// Define the structure of an applied coupon
interface AppliedCoupon {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  amount: number; // The calculated discount amount
}

// Update CartState to include the coupon
interface CartState {
  items: CartItem[];
  appliedCoupon: AppliedCoupon | null;
}

// Update CartAction to handle coupons
type CartAction =
  | { type: 'ADD_TO_CART'; payload: { product: Product; selectedSize: string } }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'INIT_CART'; payload: CartState }
  | { type: 'APPLY_COUPON'; payload: AppliedCoupon }
  | { type: 'REMOVE_COUPON' };

// Define the return type for our new calculations function
// The 'shipping' property has been removed.
interface CartCalculations {
  subtotal: number;
  couponDiscount: number;
  discountedSubtotal: number;
  total: number;
}

// Update CartContextType with new coupon state and functions
interface CartContextType {
  cart: CartItem[];
  appliedCoupon: AppliedCoupon | null;
  addToCart: (product: Product, selectedSize: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (coupon: AppliedCoupon) => void;
  removeCoupon: () => void;
  getCartItemsCount: () => number;
  getCartCalculations: () => CartCalculations;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'INIT_CART':
      return action.payload;

    case 'ADD_TO_CART': {
      const { product, selectedSize } = action.payload;
      const existingItem = state.items.find(
        (item) => item._id === product._id && item.selectedSize === selectedSize
      );
      
      let updatedItems;
      if (existingItem) {
        updatedItems = state.items.map((item) =>
          item._id === product._id && item.selectedSize === selectedSize
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        const newItem: CartItem = {
          _id: product._id,
          name: product.name,
          price: product.price,
          imagefront: product.imagefront,
          selectedSize,
          quantity: 1,
          image: product.imagefront,
        };
        updatedItems = [...state.items, newItem];
      }
      // Invalidate coupon if cart changes
      return { ...state, items: updatedItems, appliedCoupon: null };
    }

    case 'REMOVE_FROM_CART': {
      const updatedItems = state.items.filter((item) => item._id !== action.payload);
      // Invalidate coupon if cart changes
      return { ...state, items: updatedItems, appliedCoupon: null };
    }

    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items.map((item) =>
        item._id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      // Invalidate coupon if cart changes
      return { ...state, items: updatedItems, appliedCoupon: null };
    }

    case 'CLEAR_CART':
      return { items: [], appliedCoupon: null };

    case 'APPLY_COUPON':
      return { ...state, appliedCoupon: action.payload };

    case 'REMOVE_COUPON':
      return { ...state, appliedCoupon: null };

    default:
      return state;
  }
};

const initialState: CartState = {
  items: [],
  appliedCoupon: null,
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    try {
      const savedState = localStorage.getItem('cartState');
      if (savedState) {
        const parsedState: CartState = JSON.parse(savedState);
        dispatch({ type: 'INIT_CART', payload: parsedState });
      }
    } catch (error) {
      console.error("Failed to parse cart state from localStorage", error);
    }
  }, []);

  useEffect(() => {
    // Save the entire state, including items and the applied coupon
    localStorage.setItem('cartState', JSON.stringify(state));
  }, [state]);

  const addToCart = (product: Product, selectedSize: string) => {
    dispatch({ type: 'ADD_TO_CART', payload: { product, selectedSize } });
  };

  const removeFromCart = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    // Also clear from storage immediately
    localStorage.removeItem('cartState');
  };

  const applyCoupon = (coupon: AppliedCoupon) => {
    dispatch({ type: 'APPLY_COUPON', payload: coupon });
  };

  const removeCoupon = () => {
    dispatch({ type: 'REMOVE_COUPON' });
  };

  const getCartItemsCount = (): number => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartCalculations = (): CartCalculations => {
    const subtotal = state.items.reduce((total, item) => total + item.price * item.quantity, 0);
    const couponDiscount = state.appliedCoupon?.amount || 0;
    const discountedSubtotal = subtotal - couponDiscount;
    
    // Shipping logic has been removed.
    
    // Total is now the same as the discounted subtotal.
    const total = discountedSubtotal;

    return {
      subtotal,
      couponDiscount,
      discountedSubtotal,
      total,
    };
  };

  return (
    <CartContext.Provider
      value={{
        cart: state.items,
        appliedCoupon: state.appliedCoupon,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
        getCartItemsCount,
        getCartCalculations,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};