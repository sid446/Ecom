"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import Navbar from "@/components/Navbar"
import { useCart } from "@/context/CartContext"
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Package, Lock } from "lucide-react"

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart()
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set())
  const [isClearing, setIsClearing] = useState(false)

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    // Automatically remove if quantity drops to 0 or less
    if (newQuantity <= 0) {
      handleRemoveItem(productId)
    } else {
      updateQuantity(productId, newQuantity)
    }
  }

  const handleRemoveItem = (productId: string) => {
    setRemovingItems((prev) => new Set(prev).add(productId))
    setTimeout(() => {
      removeFromCart(productId)
      setRemovingItems((prev) => {
        const newSet = new Set(prev)
        newSet.delete(productId)
        return newSet
      })
    }, 300)
  }

  const handleClearCart = () => {
    setIsClearing(true)
    // Add all item IDs to the removing set for a smooth visual exit
    const allItemIds = cart.map(item => item._id)
    setRemovingItems(new Set(allItemIds))
    setTimeout(() => {
      clearCart()
      setIsClearing(false)
    }, 500) // Slightly longer timeout to allow animation
  }

  const subtotal = getCartTotal()
  const shippingThreshold = 2000 // Using a more realistic threshold in INR
  const shippingCost = 150
  const shipping = subtotal > shippingThreshold ? 0 : shippingCost
  const taxRate = 0.18 // 18% GST
  const tax = subtotal * taxRate
  const total = subtotal + shipping + tax

  // --- Empty Cart View ---
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <main className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-lg p-8">
              <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-10 h-10 text-zinc-500" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Your Cart is Empty</h1>
              <p className="text-zinc-400 mb-8">Looks like you haven't added anything yet.</p>
              <Link
                href="/"
                className="inline-flex items-center bg-white text-black px-6 py-3 rounded-md hover:bg-zinc-200 transition-colors duration-200 font-semibold"
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

  // --- Cart View with Items ---
  return (
    <div className="min-h-screen pt-10 bg-gradient-to-b from-black via-zinc-900 to-black text-white">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-zinc-400 hover:text-white transition-colors duration-200 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shopping
          </Link>
          <h1 className="text-3xl lg:text-4xl font-bold text-white">Shopping Cart</h1>
          <p className="text-zinc-400 mt-2">
            You have {cart.length} item{cart.length !== 1 ? "s" : ""} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2">
            <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-lg shadow-lg overflow-hidden">
              {cart.map((item, index) => (
                <div
                  key={item._id}
                  className={`
                    flex flex-col sm:flex-row sm:items-center p-6 transition-all duration-300 ease-out
                    ${index !== cart.length - 1 ? "border-b border-zinc-800" : ""}
                    ${removingItems.has(item._id) ? "opacity-0 -translate-x-4 scale-95" : "opacity-100 translate-x-0 scale-100"}
                  `}
                >
                  <div className="relative w-24 h-24 mr-6 flex-shrink-0 mb-4 sm:mb-0">
                    <Image
                      src={item.imagefront || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover rounded-md"
                      sizes="96px"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white text-lg mb-1 truncate">{item.name}</h3>
                    <p className="text-zinc-400 text-sm">Size: {item.selectedSize}</p>
                    <p className="text-zinc-300 font-medium text-lg sm:hidden mt-2">₹{item.price.toLocaleString()}</p>
                  </div>

                  <div className="flex items-center space-x-2 mx-auto sm:mx-6 my-4 sm:my-0">
                    <button
                      onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                      className="w-10 h-10 rounded-md border border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800 transition-all duration-200 flex items-center justify-center"
                      aria-label={`Decrease quantity of ${item.name}`}
                    >
                      <Minus className="w-4 h-4 text-zinc-400" />
                    </button>
                    <div className="w-16 text-center">
                      <span className="text-lg font-semibold text-white">{item.quantity}</span>
                    </div>
                    <button
                      onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                      className="w-10 h-10 rounded-md border border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800 transition-all duration-200 flex items-center justify-center"
                      aria-label={`Increase quantity of ${item.name}`}
                    >
                      <Plus className="w-4 h-4 text-zinc-400" />
                    </button>
                  </div>

                  <div className="text-left sm:text-right sm:mr-6 min-w-0 flex-shrink-0">
                    <p className="font-bold text-lg text-white">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>

                  <button
                    onClick={() => handleRemoveItem(item._id)}
                    className="w-10 h-10 rounded-md text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-colors duration-200 flex items-center justify-center ml-auto sm:ml-0 mt-4 sm:mt-0"
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
                  px-6 py-3 rounded-md border border-zinc-700 text-zinc-300 hover:bg-zinc-800 
                  transition-all duration-200 font-medium
                  ${isClearing ? "opacity-50 cursor-not-allowed" : "hover:border-zinc-600 hover:text-white"}
                `}
              >
                {isClearing ? "Clearing Cart..." : "Clear Cart"}
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-lg shadow-lg p-6 sticky top-28">
              <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-zinc-300">
                  <span>Subtotal:</span>
                  <span className="font-medium text-white">₹{subtotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-zinc-300">
                  <span>Shipping:</span>
                  <span className="font-medium text-white">
                    {shipping === 0 ? <span className="text-green-400">Free</span> : `₹${shipping.toLocaleString()}`}
                  </span>
                </div>

                <div className="flex justify-between text-zinc-300">
                  <span>Tax (18% GST):</span>
                  <span className="font-medium text-white">₹{tax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>

                {subtotal < shippingThreshold && (
                  <div className="text-sm text-zinc-300 bg-zinc-800/50 p-3 rounded-lg flex items-center space-x-2">
                    <Package className="w-5 h-5 text-zinc-400 flex-shrink-0" />
                    <span>Add ₹{(shippingThreshold - subtotal).toLocaleString()} more for free shipping!</span>
                  </div>
                )}
              </div>

              <div className="border-t border-zinc-700 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-white">Total:</span>
                  <span className="text-2xl font-bold text-white">₹{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>

              <div className="space-y-3">
                <Link
                  href="/checkout"
                  className="w-full bg-white text-black py-4 px-6 rounded-md text-center block hover:bg-zinc-200 transition-colors duration-200 font-semibold text-lg"
                >
                  Proceed to Checkout
                </Link>

                <div className="text-center text-sm text-zinc-500">
                  <div className="flex items-center justify-center space-x-2 mt-2">
                    <Lock className="w-3 h-3" />
                    <span>Secure checkout guaranteed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}