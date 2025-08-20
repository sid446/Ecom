'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import { Product } from '@/types'
import { ShoppingCart, Package, Star } from 'lucide-react'

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
      className="group relative bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Stock status badge */}
      {product.stock <= 5 && (
        <div className={`absolute top-2 right-2 z-10 px-2 py-1 rounded-full text-xs font-medium ${stockStatus.bg} ${stockStatus.color} backdrop-blur-sm`}>
          {product.stock === 0 ? 'Out of Stock' : 'Low Stock'}
        </div>
      )}

      {/* Image container with hover effects */}
      <div className="relative h-48 mb-4 overflow-hidden rounded-lg bg-gray-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        
        {/* Overlay gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Product info */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
          {product.name}
        </h3>
        
        <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Price and rating section */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-blue-600">
              ${product.price}
            </span>
            {/* Mock rating - you can replace with actual rating data */}
            <div className="flex items-center space-x-1 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-3 w-3 ${star <= 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                />
              ))}
              <span className="text-xs text-gray-500 ml-1">(4.0)</span>
            </div>
          </div>
        </div>

        {/* Stock status */}
        <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${stockStatus.bg} ${stockStatus.color}`}>
          <Package className="h-3 w-3" />
          <span>{stockStatus.text}</span>
        </div>
      </div>

      {/* Add to cart button */}
      <button
        onClick={handleAddToCart}
        disabled={product.stock === 0 || isAdding}
        className={`
          w-full mt-4 py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2
          ${product.stock === 0 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
            : isAdding
              ? 'bg-green-500 text-white cursor-wait'
              : showSuccess
                ? 'bg-green-500 text-white'
                : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md active:transform active:scale-95'
          }
        `}
      >
        {product.stock === 0 ? (
          <>
            <Package className="h-4 w-4" />
            <span>Out of Stock</span>
          </>
        ) : isAdding ? (
          <>
            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            <span>Adding...</span>
          </>
        ) : showSuccess ? (
          <>
            <div className="h-4 w-4 flex items-center justify-center">
              <div className="h-2 w-2 bg-white rounded-full animate-ping" />
            </div>
            <span>Added to Cart!</span>
          </>
        ) : (
          <>
            <ShoppingCart className="h-4 w-4" />
            <span>Add to Cart</span>
          </>
        )}
      </button>

      {/* Success notification overlay */}
      {showSuccess && (
        <div className="absolute inset-0 bg-green-500/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-full p-3 shadow-lg animate-bounce">
            <ShoppingCart className="h-6 w-6 text-green-500" />
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductCard