'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/context/CartContext'
import { ShoppingCart, Home, Store, X, User, Heart, Package, Menu, Phone, Info } from 'lucide-react'
import { useState, useEffect, useRef, useCallback } from 'react'
import { usePathname } from 'next/navigation'

const Navbar: React.FC = () => {
  const { getCartItemsCount } = useCart()
  const cartCount = getCartItemsCount()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  // Handle escape key and focus trap
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        closeMenu()
      }
    }

    if (isMenuOpen) {
      document.addEventListener('keydown', handleEscape)
      // Only prevent body scroll, don't set overflow hidden on html
      const originalStyle = window.getComputedStyle(document.body).overflow
      document.body.style.overflow = 'hidden'
      
      // Focus first menu item
      setTimeout(() => {
        const firstMenuItem = menuRef.current?.querySelector('a')
        firstMenuItem?.focus()
      }, 100)
      
      return () => {
        document.body.style.overflow = originalStyle
      }
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isMenuOpen])

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev)
  }, [])

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false)
  }, [])

  const isActivePath = (path: string) => pathname === path

  const menuItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/shop', label: 'Shop', icon: Store },
    { href: '/categories', label: 'Categories', icon: Store },
    { href: '/about', label: 'About Us', icon: Info },
    { href: '/contact', label: 'Contact', icon: Phone },
  ]

  const accountItems = [
    { href: '/account', label: 'My Account', icon: User },
    { href: '/orders', label: 'My Orders', icon: Package },
    { href: '/wishlist', label: 'Wishlist', icon: Heart },
  ]

  return (
    <>
      <nav className={`w-full fixed top-0 left-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-black/95 backdrop-blur-md shadow-lg' 
          : 'bg-black/30 backdrop-blur-sm'
      }`}>
        <div className="w-full max-w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side - Menu button */}
            <div className="flex items-center justify-start flex-shrink-0">
              <button
                onClick={toggleMenu}
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMenuOpen}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-white hover:bg-white/10 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200 group"
              >
                <Menu size={20} className="group-hover:scale-110 transition-transform flex-shrink-0" />
                <span className="hidden sm:inline whitespace-nowrap">Menu</span>
              </button>
            </div>

            {/* Center - Logo */}
            <div className="flex items-center justify-center flex-shrink-0 mx-4">
              <Link
                href="/"
                className="flex items-center justify-center text-xl sm:text-2xl font-bold text-white hover:scale-105 focus:scale-105 focus:outline-none focus:ring-2 focus:ring-white/20 rounded-lg p-2 transition-all duration-200"
                aria-label="Go to homepage"
              >
                <div className="relative w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 flex-shrink-0">
                  <Image
                    src="/logo.PNG"
                    alt="Company Logo"
                    fill
                    className="object-contain"
                    priority
                    sizes="(max-width: 640px) 40px, (max-width: 1024px) 48px, 56px"
                  />
                </div>
              </Link>
            </div>

            {/* Right side - Account and Cart */}
            <div className="flex items-center justify-end flex-shrink-0">
              <div className="flex items-center space-x-1">
                <Link
                  href="/account"
                  className="flex items-center space-x-1 px-2 sm:px-3 py-2 rounded-lg text-sm font-medium text-white hover:bg-white/10 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200 group"
                  aria-label="Go to account"
                >
                  <User size={20} className="group-hover:scale-110 transition-transform flex-shrink-0" />
                  <span className="hidden md:inline whitespace-nowrap">Account</span>
                </Link>
                
                <Link
                  href="/cart"
                  className="flex items-center space-x-2 px-2 sm:px-3 py-2 rounded-lg text-sm font-medium text-white hover:bg-white/10 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200 group relative"
                  aria-label={`Go to cart${cartCount > 0 ? ` (${cartCount} items)` : ''}`}
                >
                  <div className="relative flex-shrink-0">
                    <ShoppingCart size={20} className="group-hover:scale-110 transition-transform" />
                    {cartCount > 0 && (
                      <span 
                        className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center transition-all duration-200 animate-pulse group-hover:animate-none"
                        aria-hidden="true"
                      >
                        {cartCount > 99 ? '99+' : cartCount}
                      </span>
                    )}
                  </div>
                  <span className="hidden sm:inline whitespace-nowrap">Cart</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-all duration-300"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      {/* Sliding Menu */}
      <div 
        ref={menuRef}
        className={`fixed top-0 left-0 h-full w-full max-w-sm sm:max-w-md lg:max-w-sm bg-white shadow-2xl z-50 transform transition-all duration-300 ease-out ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Menu Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-gray-50 flex-shrink-0">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 truncate">Navigation</h2>
          <button
            onClick={closeMenu}
            className="p-2 rounded-full hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors duration-200 flex-shrink-0 ml-4"
            aria-label="Close menu"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Menu Content */}
        <div className="flex flex-col h-full overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
              {/* Main Navigation */}
              <div className="space-y-2">
                <h3 className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 sm:mb-4">
                  Navigation
                </h3>
                {menuItems.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={closeMenu}
                    className={`flex items-center space-x-3 px-3 sm:px-4 py-3 rounded-lg font-medium transition-all duration-200 group w-full ${
                      isActivePath(href)
                        ? 'bg-black text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400'
                    }`}
                  >
                    <Icon 
                      size={18} 
                      className={`group-hover:scale-110 transition-transform flex-shrink-0 ${
                        isActivePath(href) ? 'text-white' : 'text-gray-500'
                      }`} 
                    />
                    <span className="truncate">{label}</span>
                    {isActivePath(href) && (
                      <div className="ml-auto w-2 h-2 bg-white rounded-full flex-shrink-0" />
                    )}
                  </Link>
                ))}
              </div>

              {/* Account Section */}
              <div className="space-y-2">
                <h3 className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 sm:mb-4">
                  Account
                </h3>
                {accountItems.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={closeMenu}
                    className={`flex items-center space-x-3 px-3 sm:px-4 py-3 rounded-lg font-medium transition-all duration-200 group w-full ${
                      isActivePath(href)
                        ? 'bg-black text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400'
                    }`}
                  >
                    <Icon 
                      size={18} 
                      className={`group-hover:scale-110 transition-transform flex-shrink-0 ${
                        isActivePath(href) ? 'text-white' : 'text-gray-500'
                      }`} 
                    />
                    <span className="truncate">{label}</span>
                    {isActivePath(href) && (
                      <div className="ml-auto w-2 h-2 bg-white rounded-full flex-shrink-0" />
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Cart Quick Access - Fixed at bottom */}
          <div className="p-4 sm:p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
            <Link
              href="/cart"
              onClick={closeMenu}
              className="flex items-center justify-between w-full bg-black text-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl hover:bg-gray-800 focus:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-200 shadow-lg group"
            >
              <div className="flex items-center space-x-3 min-w-0">
                <ShoppingCart size={20} className="group-hover:scale-110 transition-transform flex-shrink-0" />
                <span className="font-medium truncate">View Cart</span>
              </div>
              {cartCount > 0 && (
                <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                  <span className="text-xs sm:text-sm text-gray-300 hidden sm:inline truncate">
                    {cartCount} item{cartCount !== 1 ? 's' : ''}
                  </span>
                  <span className="bg-red-500 text-white text-xs sm:text-sm font-bold rounded-full h-6 w-6 sm:h-7 sm:w-7 flex items-center justify-center flex-shrink-0">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                </div>
              )}
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar