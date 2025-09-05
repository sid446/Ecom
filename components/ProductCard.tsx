'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import { Product } from '@/types'
import { ShoppingCart, Package, Star, Plus, Check } from 'lucide-react'

interface ProductCardProps {
  product: Product
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const router = useRouter()
  const { addToCart } = useCart()
  const [isAdding, setIsAdding] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleCardClick = () => {
    router.push(`/products/${product._id}`)
  }

  const handleAddToCart = async (e: React.MouseEvent) => {
    // Prevent card click when clicking the button
    e.stopPropagation()

    if (product.stock === 0 || isAdding) return

    setIsAdding(true)
    addToCart(product)

    // Show success animation
    setShowSuccess(true)

    // Reset states after animation
    setTimeout(() => {
      setIsAdding(false)
      setShowSuccess(false)
    }, 1500)
  }

  const getStockStatus = () => {
    if (product.stock === 0) return { text: 'Out of Stock', color: 'text-red-500', bg: 'bg-red-50' }
    if (product.stock <= 5) return { text: `Only ${product.stock} left!`, color: 'text-orange-500', bg: 'bg-orange-50' }
    return { text: `${product.stock} in stock`, color: 'text-green-600', bg: 'bg-green-50' }
  }

  const stockStatus = getStockStatus()

  return (
    <div
      className="flex-shrink-0 w-40 sm:w-40 md:w-60 lg:w-70 transition-shadow duration-300 overflow-hidden cursor-pointer group"
      onClick={handleCardClick}
    >
      {/* Product Image Container */}
      <div className="relative w-full h-50 sm:h-50 md:h-70 lg:h-90 bg-gray-200 flex items-center justify-center overflow-hidden">
        {/* Front Image */}
        <Image
          src={product.imagefront}
          alt={`${product.name} front`}
          fill
          className="object-cover transition-opacity duration-300 group-hover:opacity-0"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />

        {/* Back Image - Shows on hover */}
        <Image
          src={product.imageback}
          alt={`${product.name} back`}
          fill
          className="object-cover transition-opacity duration-300 opacity-0 group-hover:opacity-100 absolute inset-0"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />

        {/* Mock "Save 40%" Badge - Top Left */}
        <div className="absolute top-2 left-2 z-20 text-red-600 text-xs sm:text-xs md:text-base lg:text-base font-bold px-1 py-1 flex flex-col items-center leading-tight">
          <span>SAVE</span>
          <span>40%</span>
        </div>

        {/* Add to Cart Button Overlay - Shows on hover, positioned at bottom center */}
        

        {/* Quick Add Icon - Top right corner, shows on hover */}
        <div className="absolute bottom-3 right-3 z-10 p-2 bg-white/80 rounded-full shadow-md transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:scale-100 scale-90">
          <Plus className="h-4 w-4 text-gray-700" />
        </div>
      </div>

      {/* Product Details */}
      <div className="px-2 py-1">
        <h3 className="text-xs font-medium text-gray-300 line-clamp-2">
          {product.name}
        </h3>

        {/* Price display with strikethrough for original price */}
        <div className="flex items-baseline justify-between">
          <p className="text-xs text-gray-500 font-semibold line-through">
            Rs.{Math.round(product.price * 1.66).toLocaleString()} {/* Example for 40% off calculation */}
          </p>
          <p className="text-xs font-medium text-gray-400">
            Rs.{product.price.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Success notification overlay */}
      {showSuccess && (
        <div className="absolute inset-0 bg-green-500/10 rounded-xl flex items-center justify-center backdrop-blur-sm z-30">
          <div className="bg-white rounded-full p-3 shadow-lg animate-bounce">
            <ShoppingCart className="h-6 w-6 text-green-500" />
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductCard;