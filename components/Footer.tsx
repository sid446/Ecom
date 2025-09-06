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
    <footer className="bg-black text-white mt-12">
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
              <li><a href="#" className="text-white hover:text-gray-300 transition-colors duration-300 text-sm sm:text-base">All Products</a></li>
              <li><a href="#" className="text-white hover:text-gray-300 transition-colors duration-300 text-sm sm:text-base">New Arrivals</a></li>
              <li><a href="#" className="text-white hover:text-gray-300 transition-colors duration-300 text-sm sm:text-base">Clothing</a></li>
              
              <li><a href="#" className="text-white hover:text-gray-300 transition-colors duration-300 text-sm sm:text-base">Best Sellers</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-xs sm:text-sm font-medium tracking-wider mb-4 sm:mb-6 text-gray-300">
              SUPPORT
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              <li><a href="#" className="text-white hover:text-gray-300 transition-colors duration-300 text-sm sm:text-base">Contact Us</a></li>
              <li><a href="#" className="text-white hover:text-gray-300 transition-colors duration-300 text-sm sm:text-base">Size Guide</a></li>
              <li><a href="#" className="text-white hover:text-gray-300 transition-colors duration-300 text-sm sm:text-base">Shipping</a></li>
              <li><a href="#" className="text-white hover:text-gray-300 transition-colors duration-300 text-sm sm:text-base">Returns</a></li>
              <li><a href="#" className="text-white hover:text-gray-300 transition-colors duration-300 text-sm sm:text-base">FAQ</a></li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-xs sm:text-sm font-medium tracking-wider mb-4 sm:mb-6 text-gray-300">
              BRAND
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              <li><a href="#" className="text-white hover:text-gray-300 transition-colors duration-300 text-sm sm:text-base">Our Story</a></li>
              <li><a href="#" className="text-white hover:text-gray-300 transition-colors duration-300 text-sm sm:text-base">About Us</a></li>
              <li><a href="#" className="text-white hover:text-gray-300 transition-colors duration-300 text-sm sm:text-base">Journal</a></li>
              <li><a href="#" className="text-white hover:text-gray-300 transition-colors duration-300 text-sm sm:text-base">Sustainability</a></li>
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
                <a href="#" className="w-8 h-8 sm:w-10 sm:h-10 border border-gray-600 flex items-center justify-center hover:border-white hover:bg-white hover:text-black transition-all duration-300">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="w-8 h-8 sm:w-10 sm:h-10 border border-gray-600 flex items-center justify-center hover:border-white hover:bg-white hover:text-black transition-all duration-300">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.739.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.744 2.840c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.624 0 11.99-5.367 11.99-11.99C24.007 5.367 18.641.001 12.017.001z"/>
                  </svg>
                </a>
                <a href="#" className="w-8 h-8 sm:w-10 sm:h-10 border border-gray-600 flex items-center justify-center hover:border-white hover:bg-white hover:text-black transition-all duration-300">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="#" className="w-8 h-8 sm:w-10 sm:h-10 border border-gray-600 flex items-center justify-center hover:border-white hover:bg-white hover:text-black transition-all duration-300">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
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
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                Cookie Settings
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                Accessibility
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