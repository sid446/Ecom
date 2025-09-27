import React, { useState } from 'react';

function PremiumFooter() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => setIsSubscribed(false), 3000);
      setEmail('');
    }
  };

  return (
    <footer className="bg-black text-white ">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-light mb-3 sm:mb-4 tracking-wide">
              STAY IN THE KNOW
            </h2>
            <p className="text-gray-300 mb-6 sm:mb-8 max-w-md mx-auto text-sm sm:text-base px-4 sm:px-0">
              Be the first to know about new drops, exclusive offers, and style inspiration.
            </p>
            <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-3 sm:gap-0 px-4 sm:px-0">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 bg-transparent border border-gray-600 px-4 py-3 focus:outline-none focus:border-white transition-colors duration-300 text-sm sm:text-base"
                required
              />
              <button
                type="submit"
                onClick={handleSubscribe}
                className="bg-white text-black px-6 sm:px-8 py-3 font-medium hover:bg-gray-200 transition-colors duration-300 border border-white text-sm sm:text-base"
              >
                SUBSCRIBE
              </button>
            </div>
            {isSubscribed && (
              <p className="text-green-400 mt-4 text-sm sm:text-base">Thank you for subscribing!</p>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          
          {/* Shop Section */}
          <div>
            <h3 className="text-xs sm:text-sm font-medium tracking-wider mb-4 sm:mb-6 text-gray-300">
              SHOP
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              <li><a href="/" className="text-white hover:text-gray-300 transition-colors duration-300 text-sm sm:text-base">All Products</a></li>
              <li><a href="/" className="text-white hover:text-gray-300 transition-colors duration-300 text-sm sm:text-base">New Arrivals</a></li>
              <li><a href="/" className="text-white hover:text-gray-300 transition-colors duration-300 text-sm sm:text-base">Clothing</a></li>
              
              <li><a href="/" className="text-white hover:text-gray-300 transition-colors duration-300 text-sm sm:text-base">Best Sellers</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-xs sm:text-sm font-medium tracking-wider mb-4 sm:mb-6 text-gray-300">
              SUPPORT
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              <li><a href="/information/contactUs" className="text-white hover:text-gray-300 transition-colors duration-300 text-sm sm:text-base">Contact Us</a></li>
              <li><a href="/information/sizeGuide" className="text-white hover:text-gray-300 transition-colors duration-300 text-sm sm:text-base">Size Guide</a></li>
              <li><a href="/information/shippingInfo" className="text-white hover:text-gray-300 transition-colors duration-300 text-sm sm:text-base">Shipping</a></li>
              
              
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-xs sm:text-sm font-medium tracking-wider mb-4 sm:mb-6 text-gray-300">
              BRAND
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              <li><a href="/story" className="text-white hover:text-gray-300 transition-colors duration-300 text-sm sm:text-base">Our Story</a></li>
              
             
              
            </ul>
          </div>

          {/* Connect */}
          <div>
            
            
            {/* Social Media Icons */}
            <div>
              <h4 className="text-xs sm:text-sm font-medium tracking-wider mb-3 sm:mb-4 text-gray-300">
                FOLLOW US
              </h4>
              <div className="flex space-x-3 sm:space-x-4">
                
                <a href="https://www.instagram.com/kashe.clothing" className="w-8 h-8 sm:w-10 sm:h-10 border border-gray-600 flex items-center justify-center hover:border-white hover:bg-white hover:text-black transition-all duration-300">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            
            {/* Logo/Brand */}
            <div className="flex items-center order-1 md:order-none">
              <h1 className="text-xl sm:text-2xl font-bold tracking-wider">KASHÉ</h1>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center md:justify-end gap-4 sm:gap-6 text-xs sm:text-sm order-2 md:order-none">
              <a href="/information/privacypolicy" className="text-gray-400 hover:text-white transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="/information/terms" className="text-gray-400 hover:text-white transition-colors duration-300">
                Terms of Service
              </a>
             
             
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-800 text-center">
            <p className="text-gray-400 text-xs sm:text-sm">
              © 2025 KASHÉ. All rights reserved. | Unisex fashion for everyone.
            </p>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-black border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <span className="text-gray-400 text-xs sm:text-sm">Secure Payments:</span>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {['VISA', 'MASTERCARD', 'PAYPAL', 'GPAY'].map((payment) => (
                <div key={payment} className="bg-white text-black px-2 sm:px-3 py-1 text-xs font-bold rounded">
                  {payment}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default PremiumFooter;