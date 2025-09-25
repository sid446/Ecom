'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import { ShoppingCart, Package, Star, Plus, Check, X, Minus } from 'lucide-react'
import { ProductWithStock } from '@/types'

// Price formatter utility function
const formatPrice = (price: number): string => {
  // Check if price has decimal places
  if (price % 1 === 0) {
    // No decimal places, show as integer
    return price.toLocaleString()
  } else {
    // Has decimal places, show with 2 decimal places
    return price.toLocaleString(undefined, { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })
  }
}

interface ProductCardProps {
  product: ProductWithStock
}

// Size selection modal component
interface SizeSelectionModalProps {
  product: ProductWithStock
  isOpen: boolean
  onClose: () => void
  onAddToCart: (size: string, quantity: number) => void
}

const SizeSelectionModal: React.FC<SizeSelectionModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart
}) => {
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)

  // Calculate prices based on offer
  const discountedPrice = product.offer
    ? product.price - (product.price * product.offer) / 100
    : product.price;
  const showOffer = typeof product.offer === 'number' && product.offer > 0;

  // Simplified since we now always have the structured stock
  const getSizeStock = () => {
    return [
      { size: 'S', stock: product.stock.S },
      { size: 'M', stock: product.stock.M },
      { size: 'L', stock: product.stock.L },
      { size: 'XL', stock: product.stock.XL },
    ]
  }

  const sizeStock = getSizeStock()
  
  const getCurrentStock = () => {
    if (!selectedSize) return 0
    return product.stock[selectedSize as keyof typeof product.stock] || 0
  }

  const handleQuantityChange = (action: 'increase' | 'decrease') => {
    const currentStock = getCurrentStock()
    if (action === 'increase' && quantity < currentStock) {
      setQuantity(prev => prev + 1)
    } else if (action === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1)
    }
  }

  const handleAddToCart = async () => {
    if (!selectedSize || getCurrentStock() === 0 || isAdding) return
    
    setIsAdding(true)
    await onAddToCart(selectedSize, quantity)
    
    // Reset and close modal
    setTimeout(() => {
      setIsAdding(false)
      setSelectedSize('')
      setQuantity(1)
      onClose()
    }, 1000)
  }

  // Auto-select first available size
  useState(() => {
    if (isOpen && !selectedSize) {
      const availableSizes = ['S', 'M', 'L', 'XL'] as const
      const firstAvailableSize = availableSizes.find(size => product.stock[size] > 0)
      if (firstAvailableSize) {
        setSelectedSize(firstAvailableSize)
      }
    }
  })

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Select Size & Quantity</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <div className="flex space-x-3 mb-4">
            <div className="w-16 h-16 bg-gray-200 rounded overflow-hidden flex-shrink-0">
              <Image
                src={product.imagefront}
                alt={product.name}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                {product.name}
              </h4>
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-lg font-semibold text-gray-900">
                  ₹{formatPrice(discountedPrice)}
                </span>
                {showOffer && (
                  <span className="text-sm text-gray-500 line-through">
                    ₹{formatPrice(product.price)}
                  </span>
                )}
                {showOffer && (
                  <span className="bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                    {product.offer}% OFF
                  </span>
                )}
              </div>
              {/* Rating display */}
              {product.numOfReviews > 0 && (
                <div className="flex items-center space-x-1">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < Math.floor(product.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">
                    ({product.numOfReviews})
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Size Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Size
            </label>
            <div className="grid grid-cols-4 gap-2">
              {sizeStock.map((sizeInfo) => {
                const isSelected = selectedSize === sizeInfo.size
                const isOutOfStock = sizeInfo.stock === 0
                const isLowStock = sizeInfo.stock > 0 && sizeInfo.stock <= 3
                
                return (
                  <button
                    key={sizeInfo.size}
                    onClick={() => !isOutOfStock && setSelectedSize(sizeInfo.size)}
                    disabled={isOutOfStock}
                    className={`
                      relative py-2 px-3 border rounded font-medium text-sm transition-all duration-200
                      ${isSelected 
                        ? 'border-black bg-black text-white' 
                        : isOutOfStock
                          ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                      }
                    `}
                  >
                    {sizeInfo.size}
                    {isLowStock && !isSelected && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full"></div>
                    )}
                    {isOutOfStock && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-px bg-gray-400 transform rotate-45"></div>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
            {selectedSize && (
              <p className="text-xs text-gray-500 mt-1">
                Size {selectedSize}: {getCurrentStock() > 0 ? `${getCurrentStock()} available` : 'Out of stock'}
              </p>
            )}
          </div>

          {/* Quantity Selection */}
          {selectedSize && getCurrentStock() > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center border border-gray-300 rounded w-fit">
                <button
                  onClick={() => handleQuantityChange('decrease')}
                  disabled={quantity <= 1}
                  className="p-2 text-gray-400 hover:text-gray-600 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 py-2 text-gray-900 font-medium min-w-[3rem] text-center border-x border-gray-300">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange('increase')}
                  disabled={quantity >= getCurrentStock()}
                  className="p-2 text-gray-400 hover:text-gray-600 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Max: {getCurrentStock()}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50">
          <button
            onClick={handleAddToCart}
            disabled={!selectedSize || getCurrentStock() === 0 || isAdding}
            className={`
              w-full py-3 px-4 font-semibold rounded transition-all duration-300 flex items-center justify-center space-x-2
              ${!selectedSize || getCurrentStock() === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : isAdding
                  ? 'bg-green-600 text-white'
                  : 'bg-black text-white hover:bg-gray-800 active:scale-[0.98]'
              }
            `}
          >
            {!selectedSize ? (
              <>
                <Package className="h-4 w-4" />
                <span>Select Size</span>
              </>
            ) : getCurrentStock() === 0 ? (
              <>
                <Package className="h-4 w-4" />
                <span>Out of Stock</span>
              </>
            ) : isAdding ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                <span>Adding to Cart...</span>
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" />
                <span>Add to Cart • ₹{formatPrice(discountedPrice * quantity)}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const router = useRouter()
  const { addToCart } = useCart()
  const [isAdding, setIsAdding] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showSizeModal, setShowSizeModal] = useState(false)

  // Calculate price based on offer
  const discountedPrice = product.offer
    ? product.price - (product.price * product.offer) / 100
    : product.price;
  const showOffer = typeof product.offer === 'number' && product.offer > 0;

  const handleCardClick = () => {
    router.push(`/products/${product._id}`)
  }

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation()
    
    // Since we now always have the structured stock, always show size modal
    setShowSizeModal(true)
  }

  // Updated handleModalAddToCart function with discount logic
  const handleModalAddToCart = async (size: string, quantity: number) => {
    if (!product || !size) return;

    // Calculate the discounted price
    const discountedPrice = product.offer
      ? product.price - (product.price * product.offer) / 100
      : product.price;

    // Create a product object with the discounted price
    const productWithDiscountedPrice = {
      ...product,
      price: discountedPrice,
      originalPrice: product.price, // Store original price
      // offer is already in the product object
    };

    for (let i = 0; i < quantity; i++) {
      addToCart(productWithDiscountedPrice, size);
    }

    // Show success animation
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 1500);
  };

  const getStockStatus = () => {
    const totalStock = Object.values(product.stock).reduce((sum, stock) => sum + stock, 0)
    if (totalStock === 0) return { text: 'Out of Stock', color: 'text-red-500', bg: 'bg-red-50' }
    if (totalStock <= 5) return { text: `Only ${totalStock} left!`, color: 'text-orange-500', bg: 'bg-orange-50' }
    return { text: `${totalStock} in stock`, color: 'text-green-600', bg: 'bg-green-50' }
  }

  const stockStatus = getStockStatus()
  const totalStock = Object.values(product.stock).reduce((sum, stock) => sum + stock, 0)

  return (
    <>
      <div
        className="flex-shrink-0 w-40 sm:w-40 md:w-60 lg:w-70 transition-shadow duration-300 overflow-hidden cursor-pointer group relative"
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

          {/* Offer Badge - Top Left (Conditionally rendered) */}
          {showOffer && (
            <div className="absolute top-2 left-2 z-20 text-red-600 text-xs sm:text-xs md:text-base lg:text-base font-bold px-1 py-1 flex flex-col items-center leading-tight">
              <span>SAVE</span>
              <span>{product.offer}%</span>
            </div>
          )}

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={totalStock === 0 || isAdding}
            className={`absolute bottom-3 right-3 z-10 p-2 rounded-full shadow-md transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:scale-100 scale-90 ${
              totalStock === 0
                ? 'bg-gray-400/80 cursor-not-allowed'
                : 'bg-white/80 hover:bg-white cursor-pointer'
            }`}
          >
            {showSuccess ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : isAdding ? (
              <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Plus className="h-4 w-4 text-gray-700" />
            )}
          </button>
        </div>

        {/* Product Details */}
        <div className="px-2 py-1">
          <h3 className="text-xs font-medium text-gray-700 line-clamp-2 mb-1">
            {product.name}
          </h3>

          {/* Rating display */}
          {product.numOfReviews > 0 && (
            <div className="flex items-center space-x-1 mb-1">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < Math.floor(product.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">
                ({product.numOfReviews})
              </span>
            </div>
          )}

          {/* Price display with strikethrough for original price - Updated with decimal formatting */}
          <div className="flex items-baseline space-x-2">
            {showOffer && (
              <p className="text-xs text-gray-500 font-semibold line-through">
                ₹{formatPrice(product.price)}
              </p>
            )}
            <p className="text-sm font-medium text-gray-900">
              ₹{formatPrice(discountedPrice)}
            </p>
          </div>

          {/* Stock status */}
          <div className={`inline-block px-2 py-1 rounded text-xs font-medium mt-1 ${stockStatus.bg} ${stockStatus.color}`}>
            {stockStatus.text}
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

      {/* Size Selection Modal */}
      <SizeSelectionModal
        product={product}
        isOpen={showSizeModal}
        onClose={() => setShowSizeModal(false)}
        onAddToCart={handleModalAddToCart}
      />
    </>
  )
}

export default ProductCard