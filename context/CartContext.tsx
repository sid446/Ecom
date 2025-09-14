'use client'

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { Product, CartItem } from '@/types'

// Updated CartItem interface to be consistent across the application
// This interface should be in your '@/types' file.
// export interface CartItem {
//   _id: string;
//   name: string;
//   price: number;
//   imagefront: string;
//   selectedSize: string;
//   quantity: number;
//   image: string; // <-- Add this property
// }

interface CartState {
  items: CartItem[]
}

type CartAction =
  // Updated payload to accept the full product and selected size
  | { type: 'ADD_TO_CART'; payload: { product: Product; selectedSize: string } }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'INIT_CART'; payload: CartItem[] }

interface CartContextType {
  cart: CartItem[]
  addToCart: (product: Product, selectedSize: string) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
  getCartItemsCount: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'INIT_CART':
      return { items: action.payload }
        
    case 'ADD_TO_CART':
      const { product, selectedSize } = action.payload
      
      const existingItem = state.items.find(item => 
        item._id === product._id && 
        item.selectedSize === selectedSize
      )
            
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item._id === product._id && 
            item.selectedSize === selectedSize
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        }
      }
            
      // When creating a new item, ensure it has all required properties
      return {
        ...state,
        items: [...state.items, { 
          _id: product._id,
          name: product.name,
          price: product.price,
          imagefront: product.imagefront,
          selectedSize: selectedSize,
          quantity: 1, 
          image: product.imagefront, // Populate the 'image' property
        }],
      }
        
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => item._id !== action.payload),
      }
        
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item._id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      }
        
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
      }
        
    default:
      return state
  }
}

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, { items: [] })
  
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      const cartItems: CartItem[] = JSON.parse(savedCart)
      dispatch({ type: 'INIT_CART', payload: cartItems })
    }
  }, [])
  
  useEffect(() => {
    if (cart.items.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart.items))
    }
  }, [cart.items])
  
  const addToCart = (product: Product, selectedSize: string) => {
    dispatch({ type: 'ADD_TO_CART', payload: { product, selectedSize } })
  }
  
  const removeFromCart = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId })
  }
  
  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } })
  }
  
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
    localStorage.removeItem('cart')
  }
  
  const getCartTotal = (): number => {
    return cart.items.reduce((total, item) => total + item.price * item.quantity, 0)
  }
  
  const getCartItemsCount = (): number => {
    return cart.items.reduce((total, item) => total + item.quantity, 0)
  }
  
  return (
    <CartContext.Provider value={{
      cart: cart.items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartItemsCount,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = (): CartContextType => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
