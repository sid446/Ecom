'use client'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { ShoppingCart, Home, Store, X } from 'lucide-react'
import { useState } from 'react'

const Navbar: React.FC = () => {
  const { getCartItemsCount } = useCart()
  const cartCount = getCartItemsCount()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <>
      <nav className="bg-black text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-2 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side - Menu button */}
            <div className="flex-1 flex justify-start">
              <button
                onClick={toggleMenu}
                className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 hover:text-blue-100 transition-all duration-200 ease-in-out"
              >
                <img className='w-5' src="/menu.png" alt="" />
                <span className="hidden sm:inline">Menu</span>
              </button>
            </div>

            {/* Center - Logo */}
            <div className="flex-1 flex justify-center">
              <Link
                href="/"
                className="flex items-center space-x-2 text-xl sm:text-2xl font-bold hover:text-blue-200 transition-colors duration-200"
              >
                <img className='w-12 sm:w-12 md:w-14 lg:w-[4.5rem]' src="/logo.PNG" alt="" />
              </Link>
            </div>

            {/* Right side - Account and Cart */}
            <div className="flex-1 flex justify-end">
              <div className='flex'>
                <Link
                  href={"/account"}
                  className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 hover:text-blue-100 transition-all duration-200 ease-in-out relative group"
                >
                  <img className='w-5' src="/user.png" alt="" />
                </Link>
                <Link
                  href="/cart"
                  className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 hover:text-blue-100 transition-all duration-200 ease-in-out relative group"
                >
                  <div className="relative">
                    <img className='w-6' src="/cart.png" alt="" />
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
        </div>
      </nav>

      {/* Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={closeMenu}
        />
      )}

      {/* Sliding Menu */}
      <div className={`fixed top-0 left-0 h-full w-full sm:w-1/2 md:w-2/5 lg:w-1/3 bg-white text-black shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
        isMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Menu Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Menu</h2>
          <button
            onClick={closeMenu}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Menu Content */}
        <div className="flex flex-col p-6 space-y-6">
          {/* Main Navigation */}
          <div className="space-y-4">
            <Link
              href="/"
              onClick={closeMenu}
              className="flex items-center space-x-3 text-lg font-medium text-gray-800 hover:text-blue-600 transition-colors duration-200 py-2"
            >
             
              <span>Home</span>
            </Link>
            
            <Link
              href="/shop"
              onClick={closeMenu}
              className="flex items-center space-x-3 text-lg font-medium text-gray-800 hover:text-blue-600 transition-colors duration-200 py-2"
            >
              
              <span>Shop</span>
            </Link>
            
            <Link
              href="/categories"
              onClick={closeMenu}
              className="flex items-center space-x-3 text-lg font-medium text-gray-800 hover:text-blue-600 transition-colors duration-200 py-2"
            >
              
              <span>Categories</span>
            </Link>
            
            <Link
              href="/about"
              onClick={closeMenu}
              className="flex items-center space-x-3 text-lg font-medium text-gray-800 hover:text-blue-600 transition-colors duration-200 py-2"
            >
              
              <span>About Us</span>
            </Link>
            
            <Link
              href="/contact"
              onClick={closeMenu}
              className="flex items-center space-x-3 text-lg font-medium text-gray-800 hover:text-blue-600 transition-colors duration-200 py-2"
            >
              
              <span>Contact</span>
            </Link>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Account</h3>
            <div className="space-y-4">
              <Link
                href="/account"
                onClick={closeMenu}
                className="flex items-center space-x-3 text-lg font-medium text-gray-800 hover:text-blue-600 transition-colors duration-200 py-2"
              >
               
                <span>My Account</span>
              </Link>
              
              <Link
                href="/orders"
                onClick={closeMenu}
                className="flex items-center space-x-3 text-lg font-medium text-gray-800 hover:text-blue-600 transition-colors duration-200 py-2"
              >
                
                <span>My Orders</span>
              </Link>
              
              <Link
                href="/wishlist"
                onClick={closeMenu}
                className="flex items-center space-x-3 text-lg font-medium text-gray-800 hover:text-blue-600 transition-colors duration-200 py-2"
              >
               
                <span>Wishlist</span>
              </Link>
            </div>
          </div>

          {/* Cart Quick Access */}
          <div className="border-t border-gray-200 pt-6">
            <Link
              href="/cart"
              onClick={closeMenu}
              className="flex items-center justify-between bg-black text-white px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors duration-200"
            >
              <div className="flex items-center space-x-3">
                
                <span className="font-medium">View Cart</span>
              </div>
              {cartCount > 0 && (
                <span className="bg-red-500 text-white text-sm font-bold rounded-full h-6 w-6 flex items-center justify-center">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar