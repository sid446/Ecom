'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import { useCart } from '@/context/CartContext'
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react'

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart()
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set())
  const [isClearing, setIsClearing] = useState(false)

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setRemovingItems(prev => new Set([...prev, productId]))
      setTimeout(() => {
        removeFromCart(productId)
        setRemovingItems(prev => {
          const newSet = new Set(prev)
          newSet.delete(productId)
          return newSet
        })
      }, 300)
    } else {
      updateQuantity(productId, newQuantity)
    }
  }

  const handleRemoveItem = (productId: string) => {
    setRemovingItems(prev => new Set([...prev, productId]))
    setTimeout(() => {
      removeFromCart(productId)
      setRemovingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(productId)
        return newSet
      })
    }, 300)
  }

  const handleClearCart = () => {
    setIsClearing(true)
    setTimeout(() => {
      clearCart()
      setIsClearing(false)
    }, 300)
  }

  const subtotal = getCartTotal()
  const shipping = subtotal > 100 ? 0 : 10
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-10 h-10 text-gray-400" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
              <p className="text-gray-600 mb-8">Looks like you haven't added anything to your cart yet.</p>
              <Link
                href="/"
                className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continue Shopping
              </Link>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-200 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-2">{cart.length} item{cart.length !== 1 ? 's' : ''} in your cart</p>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          <div className="xl:col-span-3">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {cart.map((item, index) => (
                <div
                  key={item._id}
                  className={`
                    flex items-center p-6 transition-all duration-300 ease-out
                    ${index !== cart.length - 1 ? 'border-b border-gray-100' : ''}
                    ${removingItems.has(item._id) ? 'opacity-0 translate-x-4 scale-95' : 'opacity-100 translate-x-0 scale-100'}
                    hover:bg-gray-50
                  `}
                >
                  <div className="relative w-20 h-20 mr-6 flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover rounded-lg"
                      sizes="80px"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-lg mb-1 truncate">{item.name}</h3>
                    <p className="text-blue-600 font-bold text-lg">${item.price.toFixed(2)}</p>
                  </div>
                  
                  <div className="flex items-center space-x-1 mx-6">
                    <button
                      onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                      className="w-10 h-10 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center"
                      disabled={item.quantity <= 1}
                      aria-label={`Decrease quantity of ${item.name}`}
                    >
                      <Minus className="w-4 h-4 text-gray-600" />
                    </button>
                    <div className="w-16 text-center">
                      <span className="text-lg font-semibold text-gray-900">{item.quantity}</span>
                    </div>
                    <button
                      onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                      className="w-10 h-10 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center"
                      aria-label={`Increase quantity of ${item.name}`}
                    >
                      <Plus className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                  
                  <div className="text-right mr-6 min-w-0">
                    <p className="font-bold text-lg text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  
                  <button
                    onClick={() => handleRemoveItem(item._id)}
                    className="w-10 h-10 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors duration-200 flex items-center justify-center"
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleClearCart}
                disabled={isClearing}
                className={`
                  px-6 py-3 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 
                  transition-all duration-200 font-medium
                  ${isClearing ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-300'}
                `}
              >
                {isClearing ? 'Clearing...' : 'Clear Cart'}
              </button>
            </div>
          </div>
          
          <div className="xl:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cart.length} item{cart.length !== 1 ? 's' : ''}):</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span>Shipping:</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span>Tax:</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                
                {subtotal < 100 && (
                  <div className="text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
                    💡 Add ${(100 - subtotal).toFixed(2)} more for free shipping!
                  </div>
                )}
              </div>
              
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total:</span>
                  <span className="text-2xl font-bold text-gray-900">${total.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <Link
                  href="/checkout"
                  className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg text-center block hover:bg-blue-700 transition-colors duration-200 font-semibold text-lg"
                >
                  Proceed to Checkout
                </Link>
                
                <div className="text-center text-sm text-gray-500">
                  <div className="flex items-center justify-center space-x-1 mt-2">
                    <span>🔒</span>
                    <span>Secure checkout</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  Free returns within 30 days. Questions?{' '}
                  <Link href="/support" className="text-blue-600 hover:underline">
                    Contact us
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}