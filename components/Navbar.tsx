'use client'

import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { ShoppingCart, Home, Store } from 'lucide-react'

const Navbar: React.FC = () => {
  const { getCartItemsCount } = useCart()
  const cartCount = getCartItemsCount()

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center space-x-2 text-xl sm:text-2xl font-bold hover:text-blue-200 transition-colors duration-200"
          >
            <Store className="h-6 w-6 sm:h-8 sm:w-8" />
            <span className="hidden sm:inline">Simple Store</span>
            <span className="sm:hidden">Store</span>
          </Link>
          
          {/* Navigation Links */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            <Link 
              href="/" 
              className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 hover:text-blue-100 transition-all duration-200 ease-in-out"
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            
            <Link 
              href="/cart" 
              className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 hover:text-blue-100 transition-all duration-200 ease-in-out relative group"
            >
              <div className="relative">
                <ShoppingCart className="h-4 w-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse group-hover:animate-none transition-all duration-200">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">Cart</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar