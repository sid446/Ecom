'use client'

import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useCart } from '@/context/CartContext'
import { Product } from '@/types'
import { 
  ShoppingCart, 
  Package, 
  Star, 
  ArrowLeft, 
  Truck, 
  Shield, 
  RefreshCw,
  Heart,
  Share2,
  Minus,
  Plus
} from 'lucide-react'

// Mock function to get product by ID - replace with your actual API call

  // This is a mock implementation
  // Replace this with your actual API call
const getProductById = async (id: string): Promise<Product | null> => {
    const response = await fetch(`/api/products/${id}`)
    if (!response.ok) return null
    return response.json()
}

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const { addToCart } = useCart()
  
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isFavorited, setIsFavorited] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      if (params.id) {
        setLoading(true)
        const productData = await getProductById(params.id as string)
        setProduct(productData)
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params.id])

  const handleAddToCart = async () => {
    if (!product || product.stock === 0 || isAdding) return
    
    setIsAdding(true)
    
    // Add the specified quantity to cart
    for (let i = 0; i < quantity; i++) {
      addToCart(product)
    }
    
    setShowSuccess(true)
    
    setTimeout(() => {
      setIsAdding(false)
      setShowSuccess(false)
    }, 2000)
  }

  const handleQuantityChange = (action: 'increase' | 'decrease') => {
    if (action === 'increase' && quantity < (product?.stock || 0)) {
      setQuantity(prev => prev + 1)
    } else if (action === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1)
    }
  }

  const getStockStatus = () => {
    if (!product) return { text: '', color: '', bg: '' }
    
    if (product.stock === 0) return { text: 'Out of Stock', color: 'text-red-500', bg: 'bg-red-50' }
    if (product.stock <= 5) return { text: `Only ${product.stock} left!`, color: 'text-orange-500', bg: 'bg-orange-50' }
    return { text: `${product.stock} in stock`, color: 'text-green-600', bg: 'bg-green-50' }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: product?.description,
          url: window.location.href,
        })
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      // You could show a toast notification here
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Go Back</span>
        </button>
      </div>
    )
  }

  const stockStatus = getStockStatus()

  // Mock additional images - replace with actual product images
  const productImages = [
    product.image,
    product.image, // You would have different angles/views here
    product.image,
    product.image,
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Products</span>
        </button>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8">
            {/* Image Gallery */}
            <div className="p-6 lg:p-8">
              <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-4">
                <Image
                  src={productImages[selectedImageIndex]}
                  alt={product.name}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Thumbnail gallery */}
              <div className="grid grid-cols-4 gap-2">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImageIndex === index ? 'border-blue-600' : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      width={120}
                      height={120}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="p-6 lg:p-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {product.name}
                  </h1>
                  
                  {/* Rating */}
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-5 w-5 ${star <= 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">(4.0) • 127 reviews</span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsFavorited(!isFavorited)}
                    className={`p-2 rounded-full border transition-colors ${
                      isFavorited 
                        ? 'bg-red-50 border-red-200 text-red-600' 
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:text-red-600'
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${isFavorited ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-full bg-gray-50 border border-gray-200 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Price */}
              <div className="mb-6">
                <span className="text-4xl font-bold text-blue-600">
                  ${product.price}
                </span>
              </div>

              {/* Stock status */}
              <div className={`inline-flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-medium mb-6 ${stockStatus.bg} ${stockStatus.color}`}>
                <Package className="h-4 w-4" />
                <span>{stockStatus.text}</span>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Quantity selector and Add to cart */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-700">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange('decrease')}
                      disabled={quantity <= 1}
                      className="p-2 text-gray-600 hover:text-gray-900 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-4 py-2 text-gray-900 font-medium min-w-[3rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange('increase')}
                      disabled={quantity >= product.stock}
                      className="p-2 text-gray-600 hover:text-gray-900 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || isAdding}
                  className={`
                    w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center space-x-3
                    ${product.stock === 0 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : isAdding
                        ? 'bg-green-500 text-white'
                        : showSuccess
                          ? 'bg-green-500 text-white'
                          : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg active:transform active:scale-95'
                    }
                  `}
                >
                  {product.stock === 0 ? (
                    <>
                      <Package className="h-5 w-5" />
                      <span>Out of Stock</span>
                    </>
                  ) : isAdding ? (
                    <>
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                      <span>Adding to Cart...</span>
                    </>
                  ) : showSuccess ? (
                    <>
                      <div className="h-5 w-5 flex items-center justify-center">
                        <div className="h-3 w-3 bg-white rounded-full animate-ping" />
                      </div>
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-5 w-5" />
                      <span>Add {quantity} to Cart</span>
                    </>
                  )}
                </button>
              </div>

              {/* Features */}
              <div className="border-t pt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-gray-600">
                    <Truck className="h-5 w-5 text-green-600" />
                    <span>Free shipping on orders over $100</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-600">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <span>2-year warranty included</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-600">
                    <RefreshCw className="h-5 w-5 text-purple-600" />
                    <span>30-day return policy</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}