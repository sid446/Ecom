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
  Plus,
  Sparkles,
  Award,
  Clock
} from 'lucide-react'

// Mock function to get product by ID - replace with your actual API call
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
    if (!product) return { text: '', color: '', bg: '', icon: Package }
    
    if (product.stock === 0) return { 
      text: 'Out of Stock', 
      color: 'text-red-600', 
      bg: 'bg-red-100 border-red-200', 
      icon: Package 
    }
    if (product.stock <= 5) return { 
      text: `Only ${product.stock} left!`, 
      color: 'text-amber-700', 
      bg: 'bg-amber-100 border-amber-200', 
      icon: Clock 
    }
    return { 
      text: `${product.stock} in stock`, 
      color: 'text-emerald-700', 
      bg: 'bg-emerald-100 border-emerald-200', 
      icon: Package 
    }
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
      <div className="min-h-screen bg-gradient-to-br from-[#E5D5C8] via-[#CCB8AD] to-[#B8A394] flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#8B7355] border-t-transparent mx-auto"></div>
          <p className="text-[#8B7355] font-medium mt-4 text-center">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#E5D5C8] via-[#CCB8AD] to-[#B8A394] flex flex-col items-center justify-center">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">Sorry, we couldn't find the product you're looking for.</p>
          <button
            onClick={() => router.back()}
            className="group flex items-center space-x-2 bg-gradient-to-r from-[#8B7355] to-[#6B5B47] text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 mx-auto"
          >
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    )
  }

  const stockStatus = getStockStatus()
  const StockIcon = stockStatus.icon

  // Mock additional images - replace with actual product images
  const productImages = [
    product.image,
    product.image, // You would have different angles/views here
    product.image,
    product.image,
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E5D5C8] via-[#CCB8AD] to-[#B8A394]">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Back button */}
        <div className="max-w-7xl mx-auto mb-8">
          <button
            onClick={() => router.back()}
            className="group flex items-center space-x-2 bg-white/80 backdrop-blur-sm text-gray-700 hover:text-gray-900 px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:bg-white/90 hover:shadow-lg border border-white/20"
          >
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Products</span>
          </button>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20">
            <div className="lg:grid lg:grid-cols-2">
              {/* Image Gallery */}
              <div className="p-8 lg:p-12 bg-gradient-to-br from-white/95 to-white/80">
                <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden mb-6 shadow-inner border border-gray-200/50 group">
                  <Image
                    src={productImages[selectedImageIndex]}
                    alt={product.name}
                    width={600}
                    height={600}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                
                {/* Thumbnail gallery */}
                <div className="grid grid-cols-4 gap-3">
                  {productImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden border-2 transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                        selectedImageIndex === index 
                          ? 'border-[#8B7355] shadow-lg ring-2 ring-[#8B7355]/20' 
                          : 'border-gray-200 hover:border-[#8B7355]/50'
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
              <div className="p-8 lg:p-12">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                        <Sparkles className="h-3 w-3" />
                        <span>FEATURED</span>
                      </div>
                    </div>
                    
                    <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4 leading-tight">
                      {product.name}
                    </h1>
                    
                    {/* Rating */}
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="flex items-center bg-yellow-50 px-3 py-2 rounded-xl border border-yellow-200">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-5 w-5 ${star <= 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span className="text-gray-600 font-medium">(4.0) • 127 reviews</span>
                      <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                        <Award className="h-3 w-3" />
                        <span>Bestseller</span>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center space-x-3 ml-6">
                    <button
                      onClick={() => setIsFavorited(!isFavorited)}
                      className={`p-3 rounded-xl border-2 transition-all duration-300 hover:scale-110 ${
                        isFavorited 
                          ? 'bg-red-50 border-red-300 text-red-600 shadow-lg' 
                          : 'bg-white/80 border-gray-300 text-gray-600 hover:text-red-600 hover:border-red-300'
                      }`}
                    >
                      <Heart className={`h-5 w-5 ${isFavorited ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={handleShare}
                      className="p-3 rounded-xl bg-white/80 border-2 border-gray-300 text-gray-600 hover:text-gray-800 hover:border-gray-400 transition-all duration-300 hover:scale-110 hover:shadow-lg"
                    >
                      <Share2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-8">
                  <div className="bg-gradient-to-r from-[#8B7355] to-[#6B5B47] text-white p-6 rounded-2xl shadow-lg">
                    <div className="flex items-baseline space-x-3">
                      <span className="text-5xl font-bold">
                        Rs.{product.price.toLocaleString()}
                      </span>
                      <span className="text-white/80 text-lg line-through">
                        Rs.{Math.round(product.price * 1.2).toLocaleString()}
                      </span>
                      <span className="bg-green-400 text-green-900 px-3 py-1 rounded-full text-sm font-bold">
                        17% OFF
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stock status */}
                <div className={`inline-flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold mb-8 border ${stockStatus.bg} ${stockStatus.color}`}>
                  <StockIcon className="h-5 w-5" />
                  <span>{stockStatus.text}</span>
                </div>

                {/* Description */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Product Details</h3>
                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {product.description}
                    </p>
                  </div>
                </div>

                {/* Quantity selector and Add to cart */}
                <div className="space-y-6 mb-8">
                  <div className="flex items-center space-x-6">
                    <span className="text-lg font-semibold text-gray-800">Quantity:</span>
                    <div className="flex items-center bg-white border-2 border-gray-300 rounded-xl overflow-hidden shadow-sm">
                      <button
                        onClick={() => handleQuantityChange('decrease')}
                        disabled={quantity <= 1}
                        className="p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                      >
                        <Minus className="h-5 w-5" />
                      </button>
                      <span className="px-6 py-3 text-gray-900 font-bold text-lg min-w-[4rem] text-center bg-gray-50">
                        {quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange('increase')}
                        disabled={quantity >= product.stock}
                        className="p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                      >
                        <Plus className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0 || isAdding}
                    className={`
                      w-full py-6 px-8 rounded-2xl font-bold text-xl transition-all duration-300 flex items-center justify-center space-x-4 shadow-lg hover:shadow-xl
                      ${product.stock === 0 
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                        : isAdding
                          ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                          : showSuccess
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                            : 'bg-gradient-to-r from-[#8B7355] to-[#6B5B47] text-white hover:from-[#6B5B47] hover:to-[#5A4A38] hover:scale-105 active:scale-95'
                      }
                    `}
                  >
                    {product.stock === 0 ? (
                      <>
                        <Package className="h-6 w-6" />
                        <span>Out of Stock</span>
                      </>
                    ) : isAdding ? (
                      <>
                        <div className="animate-spin h-6 w-6 border-3 border-white border-t-transparent rounded-full" />
                        <span>Adding to Cart...</span>
                      </>
                    ) : showSuccess ? (
                      <>
                        <div className="h-6 w-6 flex items-center justify-center">
                          <div className="h-4 w-4 bg-white rounded-full animate-ping" />
                        </div>
                        <span>Added to Cart!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-6 w-6" />
                        <span>Add {quantity} to Cart • Rs.{(product.price * quantity).toLocaleString()}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Features */}
                <div className="border-t-2 border-gray-200 pt-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">Why Choose This Product</h3>
                  <div className="grid gap-4">
                    <div className="flex items-center space-x-4 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                      <div className="bg-emerald-500 p-2 rounded-lg">
                        <Truck className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-emerald-800">Free Shipping</h4>
                        <p className="text-emerald-700">On orders over Rs.2,000</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <div className="bg-blue-500 p-2 rounded-lg">
                        <Shield className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-800">Quality Guarantee</h4>
                        <p className="text-blue-700">Premium quality assured</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-xl border border-purple-200">
                      <div className="bg-purple-500 p-2 rounded-lg">
                        <RefreshCw className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-purple-800">Easy Returns</h4>
                        <p className="text-purple-700">7-day return policy</p>
                      </div>
                    </div>
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