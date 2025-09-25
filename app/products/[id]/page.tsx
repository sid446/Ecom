'use client'

import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
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
  Clock,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import PremiumFooter from '@/components/Footer'
import Navbar from '@/components/Navbar'
import { FormEvent } from 'react'
import LeaveReview from '@/components/LeaveReview'

// Updated interface to match new schema with 'offer' field
interface ProductWithStock extends Omit<Product, 'stock'> {
  stock: {
    S: number
    M: number
    L: number
    XL: number
  }
  reviews: Array<{
    _id: string
    user: string
    name: string
    rating: number
    comment: string
    createdAt: string
    updatedAt: string
  }>
  rating: number
  numOfReviews: number
  offer?: number // New field for discount percentage
}

// Size stock interface (simplified since stock is now part of product)
interface SizeStock {
  size: string
  stock: number
}

// Updated function to get product by ID
const getProductById = async (id: string): Promise<ProductWithStock | null> => {
    try {
        const response = await fetch(`/api/products/${id}`)
        if (!response.ok) return null
        const product = await response.json()
        return product
    } catch (error) {
        console.error('Error fetching product:', error)
        return null
    }
}

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const { addToCart } = useCart()
  
  const [product, setProduct] = useState<ProductWithStock | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isFavorited, setIsFavorited] = useState(false)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [isMobile, setIsMobile] = useState(false)
  
  const handleReviewSubmitted = () => {
    // We add a small delay to ensure the database has updated before we fetch again
    setTimeout(() => {
      // Re-use your existing fetch function
      const fetchProduct = async () => {
        if (params.id) {
          const productData = await getProductById(params.id as string)
          setProduct(productData)
        }
      }
      fetchProduct();
    }, 500); 
  };
  
  const leftContainerRef = useRef<HTMLDivElement>(null)
  const rightContainerRef = useRef<HTMLDivElement>(null)
  const mainContentRef = useRef<HTMLDivElement>(null)
  const spacerRef = useRef<HTMLDivElement>(null)
  
  // Check if device is mobile or tablet
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024) // lg breakpoint
    }
    
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  useEffect(() => {
    const fetchProduct = async () => {
      if (params.id) {
        setLoading(true)
        const productData = await getProductById(params.id as string)
        setProduct(productData)
        
        if (productData) {
          // Auto-select first available size based on new stock structure
          const availableSizes = ['S', 'M', 'L', 'XL'] as const
          const firstAvailableSize = availableSizes.find(size => productData.stock[size] > 0)
          if (firstAvailableSize) {
            setSelectedSize(firstAvailableSize)
          }
        }
        
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params.id])

  // Convert product stock to SizeStock array for compatibility
  const getSizeStock = (): SizeStock[] => {
    if (!product) return []
    return [
      { size: 'S', stock: product.stock.S },
      { size: 'M', stock: product.stock.M },
      { size: 'L', stock: product.stock.L },
      { size: 'XL', stock: product.stock.XL },
    ]
  }

  // Desktop scroll effect - only applies to large screens
  useEffect(() => {
    if (isMobile) return // Skip scroll effects on mobile

    let totalScrollDistance = 0
    
    const calculateScrollDistances = () => {
      if (!leftContainerRef.current || !rightContainerRef.current) return { 
        phase1Duration: 0, 
        phase2Duration: 0, 
        maxLeftScroll: 0, 
        maxRightScroll: 0 
      }
      
      const leftContainer = leftContainerRef.current
      const rightContainer = rightContainerRef.current
      
      // Calculate maximum scroll distances for both containers
      const leftScrollHeight = leftContainer.scrollHeight
      const leftClientHeight = leftContainer.clientHeight
      const maxLeftScroll = Math.max(0, leftScrollHeight - leftClientHeight)

      const rightScrollHeight = rightContainer.scrollHeight
      const rightClientHeight = rightContainer.clientHeight
      const maxRightScroll = Math.max(0, rightScrollHeight - rightClientHeight)

      // Increase scroll durations to ensure content is fully visible
      const viewportHeight = window.innerHeight
      
      // Phase 1: Give more time for left side scrolling
      const phase1Duration = Math.max(maxLeftScroll * 1, viewportHeight * 1)
      
      // Phase 2: Give enough time for right side scrolling - this is key!
      const phase2Duration = Math.max(maxRightScroll * 1, viewportHeight * 2)
      
      return { phase1Duration, phase2Duration, maxLeftScroll, maxRightScroll }
    }

    const handleScroll = () => {
      if (!leftContainerRef.current || !rightContainerRef.current || !mainContentRef.current || !spacerRef.current) return

      const leftContainer = leftContainerRef.current
      const rightContainer = rightContainerRef.current
      const mainContent = mainContentRef.current
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop

      const { phase1Duration, phase2Duration, maxLeftScroll, maxRightScroll } = calculateScrollDistances()
      
      // Header height
      const headerHeight = 80
      
      // Phase boundaries
      const phase1End = phase1Duration
      const phase2End = phase1End + phase2Duration

      if (scrollTop <= phase1End) {
        // Phase 1: Scroll left side images completely
        const progress = Math.min(scrollTop / phase1Duration, 1)
        const leftScrollAmount = progress * maxLeftScroll
        
        leftContainer.scrollTop = leftScrollAmount
        rightContainer.style.transform = 'translateY(0px)'
        
        // Keep main content fixed
        mainContent.style.position = 'fixed'
        mainContent.style.top = `${headerHeight}px`
        mainContent.style.left = '0'
        mainContent.style.right = '0'
        mainContent.style.width = '100%'
        mainContent.style.zIndex = '10'
        
      } else if (scrollTop <= phase2End) {
        // Phase 2: Left is fully scrolled, now scroll right side
        leftContainer.scrollTop = maxLeftScroll // Keep left at maximum scroll
        
        const phase2Progress = Math.min((scrollTop - phase1End) / phase2Duration, 1)
        const rightScrollAmount = phase2Progress * maxRightScroll
        
        rightContainer.style.transform = `translateY(-${rightScrollAmount}px)`
        
        // Keep main content fixed
        mainContent.style.position = 'fixed'
        mainContent.style.top = `${headerHeight}px`
        mainContent.style.left = '0'
        mainContent.style.right = '0'
        mainContent.style.width = '100%'
        mainContent.style.zIndex = '10'
        
      } else {
        // Phase 3: Both sides fully scrolled, normal scrolling
        leftContainer.scrollTop = maxLeftScroll
        rightContainer.style.transform = `translateY(-${maxRightScroll}px)`
        
        // Smoothly transition to static positioning
        mainContent.style.position = 'absolute'
        mainContent.style.top = `${phase2End}px`
        mainContent.style.left = '0'
        mainContent.style.right = '0'
        mainContent.style.width = '100%'
        mainContent.style.zIndex = '1'
      }
    }

    const initializeLayout = () => {
      if (!spacerRef.current) return
      
      // Calculate total scroll distance and set spacer height
      const { phase1Duration, phase2Duration } = calculateScrollDistances()
      // Add extra buffer to ensure all content is scrollable
      totalScrollDistance = phase1Duration + phase2Duration + window.innerHeight * 1.5
      
      spacerRef.current.style.height = `${totalScrollDistance}px`
    }

    // Initialize layout after elements are rendered
    const timeoutId = setTimeout(() => {
      initializeLayout()
      handleScroll()
    }, 100)

    // Debounced scroll handler for better performance
    let ticking = false
    const scrollHandler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }
    
    window.addEventListener('scroll', scrollHandler, { passive: true })
    window.addEventListener('resize', () => {
      initializeLayout()
      scrollHandler()
    }, { passive: true })
    
    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('scroll', scrollHandler)
      window.removeEventListener('resize', scrollHandler)
    }
  }, [product, isMobile])

  // In your ProductPage.tsx file
  // In your ProductPage.tsx file, update the handleAddToCart function
const handleAddToCart = async () => {
  if (!product || !selectedSize || getCurrentStock() === 0 || isAdding) return;
  
  setIsAdding(true);
  
  // Calculate the discounted price
  const discountedPrice = product.offer
    ? product.price - (product.price * product.offer) / 100
    : product.price;
  
  // Create a product object with the discounted price
  const productWithDiscountedPrice = {
    ...product,
    price: discountedPrice,
    originalPrice: product.price, // Keep original price for reference
    offer: product.offer // Keep offer info
  };
  
  // Add items with discounted price
  for (let i = 0; i < quantity; i++) {
    addToCart(productWithDiscountedPrice, selectedSize); 
  }
  
  setShowSuccess(true);
  
  setTimeout(() => {
    setIsAdding(false);
    setShowSuccess(false);
  }, 2000);
}

  const handleQuantityChange = (action: 'increase' | 'decrease') => {
    const currentStock = getCurrentStock()
    if (action === 'increase' && quantity < currentStock) {
      setQuantity(prev => prev + 1)
    } else if (action === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1)
    }
  }

  const getCurrentStock = () => {
    if (!selectedSize || !product) return 0
    return product.stock[selectedSize as keyof typeof product.stock] || 0
  }

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size)
    setQuantity(1) // Reset quantity when size changes
  }

  const getStockStatus = () => {
    const currentStock = getCurrentStock()
    
    if (!selectedSize) return { 
      text: 'Select a size', 
      color: 'text-white', 
      bg: 'bg-gray-100 border-gray-200', 
      icon: Package 
    }
    
    if (currentStock === 0) return { 
      text: 'Out of Stock', 
      color: 'text-red-600', 
      bg: 'bg-red-100 border-red-200', 
      icon: Package 
    }
    if (currentStock <= 3) return { 
      text: `Only ${currentStock} left!`, 
      color: 'text-amber-700', 
      bg: 'bg-amber-100 border-amber-200', 
      icon: Clock 
    }
    return { 
      text: `${currentStock} in stock`, 
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

  // Image navigation for mobile
  const nextImage = () => {
    if (product) {
      const totalImages = product.allimages.length > 0 ? product.allimages.length : 2
      setSelectedImageIndex((prev) => (prev + 1) % totalImages)
    }
  }

  const prevImage = () => {
    if (product) {
      const totalImages = product.allimages.length > 0 ? product.allimages.length : 2
      setSelectedImageIndex((prev) => (prev - 1 + totalImages) % totalImages)
    }
  }

  // Format date for reviews
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) return 'Today'
    if (diffInDays === 1) return '1 day ago'
    if (diffInDays < 7) return `${diffInDays} days ago`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} week${Math.floor(diffInDays / 7) > 1 ? 's' : ''} ago`
    return `${Math.floor(diffInDays / 30)} month${Math.floor(diffInDays / 30) > 1 ? 's' : ''} ago`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-black mx-auto"></div>
          <p className="text-white font-medium mt-4">Loading product...</p>
        </div>
      </div> 
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="h-12 w-12 text-gray-400" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">Sorry, we couldn't find the product you're looking for.</p>
          <button
            onClick={() => router.back()}
            className="group flex items-center space-x-2 bg-black text-white px-6 py-3 font-medium transition-all duration-300 hover:bg-gray-800 mx-auto"
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
  const currentStock = getCurrentStock()
  const sizeStock = getSizeStock()

  // Product images from the updated schema
  const productImages = product.allimages.length > 0 ? product.allimages : [product.imagefront, product.imageback]
  
  // Calculate price and offer display
  const discountedPrice = product.offer
    ? product.price - (product.price * product.offer) / 100
    : product.price;

  const showOffer = typeof product.offer === 'number' && product.offer > 0;

  // Mobile Layout
  if (isMobile) {
    return (
      <div className="bg-gradient-to-b from-black via-zinc-800 to-black min-h-screen">
        <Navbar/>
        
        <div className="pt-20 pb-8">
          {/* Mobile Image Gallery */}
          <div className="relative">
            <div className="aspect-square bg-zinc-900 overflow-hidden relative">
              <Image
                src={productImages[selectedImageIndex]}
                alt={product.name}
                width={800}
                height={800}
                className="w-full h-full object-cover"
                priority
              />
              
              {productImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg"
                  >
                    <ChevronLeft className="h-6 w-6 text-gray-700" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg"
                  >
                    <ChevronRight className="h-6 w-6 text-gray-700" />
                  </button>
                  
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                    {productImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          selectedImageIndex === index ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="px-4 mt-6 space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex-1 pr-4">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-white font-bold py-1 rounded text-xl uppercase tracking-wide">
                    KASHÉ
                  </span>
                </div>

                <h1 className="text-2xl font-semibold text-white leading-tight mb-2">
                  {product.name}
                </h1>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  <span className="text-sm text-zinc-400">
                    {product.rating.toFixed(1)} ({product.numOfReviews} reviews)
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsFavorited(!isFavorited)}
                  className={`p-2 rounded-full border transition-all duration-200 ${
                    isFavorited 
                      ? 'bg-red-500/10 border-red-500 text-red-500' 
                      : 'bg-zinc-800 border-zinc-600 text-zinc-400 hover:text-red-500 hover:border-red-500'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${isFavorited ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 rounded-full bg-zinc-800 border border-zinc-600 text-zinc-400 hover:text-white hover:border-zinc-400 transition-all duration-200"
                >
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="border-b border-zinc-700 pb-6">
              <div className="flex items-baseline space-x-3 mb-2">
                <span className="text-3xl font-semibold text-white">
                  ₹{Math.round(discountedPrice).toLocaleString()}
                </span>
                {showOffer && (
                  <>
                    <span className="text-lg text-zinc-400 line-through">
                      ₹{product.price.toLocaleString()}
                    </span>
                    <span className="bg-green-600 text-white px-2 py-1 rounded text-sm font-medium">
                      {product.offer}% OFF
                    </span>
                  </>
                )}
              </div>
              <p className="text-sm text-zinc-400">Inclusive of all taxes</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-zinc-300">Size</label>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {sizeStock.map((sizeInfo) => {
                  const isSelected = selectedSize === sizeInfo.size
                  const isOutOfStock = sizeInfo.stock === 0
                  const isLowStock = sizeInfo.stock > 0 && sizeInfo.stock <= 3
                  
                  return (
                    <button
                      key={sizeInfo.size}
                      onClick={() => !isOutOfStock && handleSizeSelect(sizeInfo.size)}
                      disabled={isOutOfStock}
                      className={`
                        relative px-4 py-3 border font-medium transition-all duration-200 min-w-[3rem]
                        ${isSelected 
                          ? 'border-white bg-white text-black' 
                          : isOutOfStock
                            ? 'border-zinc-700 bg-zinc-800 text-zinc-500 cursor-not-allowed'
                            : 'border-zinc-600 bg-transparent text-zinc-300 hover:border-zinc-400'
                        }
                      `}
                    >
                      {sizeInfo.size}
                      {isLowStock && !isSelected && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full"></div>
                      )}
                      {isOutOfStock && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-full h-px bg-zinc-500 transform rotate-45"></div>
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
              
              {selectedSize && (
                <div className="text-xs text-zinc-400 mb-4">
                  Size {selectedSize}: {currentStock > 0 ? `${currentStock} available` : 'Out of stock'}
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-zinc-300">Quantity</label>
                <span className="text-sm text-zinc-400">Max: {currentStock}</span>
              </div>
              <div className="flex items-center border border-zinc-700 w-fit">
                <button
                  onClick={() => handleQuantityChange('decrease')}
                  disabled={quantity <= 1}
                  className="p-3 text-zinc-400 hover:text-white disabled:text-zinc-600 disabled:cursor-not-allowed transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-6 py-3 text-white font-medium min-w-[3rem] text-center border-x border-zinc-700">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange('increase')}
                  disabled={quantity >= currentStock}
                  className="p-3 text-zinc-400 hover:text-white disabled:text-zinc-600 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!selectedSize || currentStock === 0 || isAdding}
              className={`
                w-full py-4 px-6 font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-3
                ${!selectedSize
                  ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed'
                  : currentStock === 0 
                    ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed' 
                    : isAdding
                      ? 'bg-green-600 text-white'
                      : showSuccess
                        ? 'bg-green-600 text-white'
                        : 'bg-white text-black hover:bg-zinc-300 active:scale-[0.98]'
                }
              `}
            >
              {!selectedSize ? (
                <>
                  <Package className="h-5 w-5" />
                  <span>Select Size</span>
                </>
              ) : currentStock === 0 ? (
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
                  <span>Add to Cart • ₹{(Math.round(discountedPrice) * quantity).toLocaleString()}</span>
                </>
              )}
            </button>

            {productImages.length > 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">More Views</h3>
                <div className="grid grid-cols-2 gap-4">
                  {productImages.slice(1).map((image, index) => (
                    <div key={`mobile-${index}`} className="aspect-square bg-zinc-900 overflow-hidden">
                      <Image
                        src={image}
                        alt={`${product.name} view ${index + 2}`}
                        width={400}
                        height={400}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-zinc-700 pt-6">
              <h3 className="text-lg font-semibold text-white mb-3">Product Details</h3>
              <div className="prose prose-sm prose-invert text-zinc-300">
                <p className="leading-relaxed mb-6">
                  {product.description}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">What's Included</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center">
                    <Truck className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <span className="font-medium text-white">Free Shipping</span>
                    <p className="text-zinc-400">On orders above ₹2,000</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <span className="font-medium text-white">Quality Guarantee</span>
                    <p className="text-zinc-400">Premium quality assured</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center">
                    <RefreshCw className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <span className="font-medium text-white">Easy Returns</span>
                    <p className="text-zinc-400">7-day return policy</p>
                  </div>
                </div>
              </div>
            </div>

            <details className="border-t border-zinc-700 pt-6">
              <summary className="text-lg font-semibold text-white cursor-pointer mb-3">Size Guide</summary>
              <div className="bg-zinc-900 p-4">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="font-medium text-white">Size</div>
                    <div className="space-y-1 text-zinc-300 mt-2">
                      <div>S</div>
                      <div>M</div>
                      <div>L</div>
                      <div>XL</div>
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-white">Chest</div>
                    <div className="space-y-1 text-zinc-300 mt-2">
                      <div>34-36"</div>
                      <div>38-40"</div>
                      <div>42-44"</div>
                      <div>46-48"</div>
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-white">Length</div>
                    <div className="space-y-1 text-zinc-300 mt-2">
                      <div>26"</div>
                      <div>27"</div>
                      <div>28"</div>
                      <div>29"</div>
                    </div>
                  </div>
                </div>
              </div>
            </details>

            <details className="border-t border-zinc-700 pt-6">
              <summary className="text-lg font-semibold text-white cursor-pointer mb-3">Care Instructions</summary>
              <div className="bg-zinc-900 p-4">
                <ul className="text-zinc-300 space-y-2 text-sm">
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-zinc-500 rounded-full flex-shrink-0 mt-1.5"></div>
                    <span>Machine wash cold with similar colors</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-zinc-500 rounded-full flex-shrink-0 mt-1.5"></div>
                    <span>Do not bleach or use harsh detergents</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-zinc-500 rounded-full flex-shrink-0 mt-1.5"></div>
                    <span>Tumble dry low heat or hang to dry</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-zinc-500 rounded-full flex-shrink-0 mt-1.5"></div>
                    <span>Iron on low heat if needed</span>
                  </li>
                </ul>
              </div>
            </details>

            <details className="border-t border-zinc-700 pt-6">
              <summary className="text-lg font-semibold text-white cursor-pointer mb-3">Reviews</summary>
              <div className="space-y-4">
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.slice(0, 2).map((review) => (
                    <div key={review._id} className="bg-zinc-900 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${
                                i < review.rating 
                                  ? 'fill-yellow-400 text-yellow-400' 
                                  : 'text-zinc-600'
                              }`} 
                            />
                          ))}
                        </div>
                        <span className="text-sm text-zinc-500">
                          {formatDate(review.createdAt)}
                        </span>
                      </div>
                      <p className="text-zinc-300 mb-2 text-sm">"{review.comment}"</p>
                      <p className="text-xs text-zinc-500">- {review.name}</p>
                    </div>
                  ))
                ) : (
                  <div className="bg-zinc-900 p-4 text-center text-zinc-400">
                    No reviews yet.
                  </div>
                )}
                <LeaveReview
                  productId={params.id as string}
                  onReviewSubmit={handleReviewSubmitted}
                />
              </div>
            </details>

            <details className="border-t border-zinc-700 pt-6">
              <summary className="text-lg font-semibold text-white cursor-pointer mb-3">Shipping & Returns</summary>
              <div className="space-y-4">
                <div className="bg-zinc-900 p-4">
                  <h4 className="font-medium text-white mb-2 text-sm">Shipping Info</h4>
                  <ul className="text-sm text-zinc-300 space-y-1 list-disc list-inside">
                    <li>Free shipping on orders ₹2,000+</li>
                    <li>Standard delivery: 3-5 days</li>
                    <li>Express delivery: 1-2 days</li>
                  </ul>
                </div>
                <div className="bg-zinc-900 p-4">
                  <h4 className="font-medium text-white mb-2 text-sm">Returns Policy</h4>
                  <ul className="text-sm text-zinc-300 space-y-1 list-disc list-inside">
                    <li>7-day return window</li>
                    <li>Free returns & exchanges</li>
                    <li>Items must be unworn</li>
                  </ul>
                </div>
              </div>
            </details>

            <div className="border-t border-zinc-700 pt-6 pb-8">
              <h3 className="text-lg font-semibold text-white mb-3">Need Help?</h3>
              <div className="flex flex-col space-y-3">
                <a 
                  href="tel:+911800123456" 
                  className="flex items-center space-x-2 text-zinc-300 hover:text-white transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  <span>Call us: 1800-123-456</span>
                </a>
                <a 
                  href="mailto:support@kashe.com" 
                  className="flex items-center space-x-2 text-zinc-300 hover:text-white transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  <span>Email: support@kashe.com</span>
                </a>
              </div>
            </div>
          </div>
        </div>
        <PremiumFooter/>
      </div>
    )
  }

  // Desktop Layout
  return (
    <div className="bg-gradient-to-b from-black via-zinc-800 to-black">
      <Navbar/>

      <div ref={spacerRef} style={{ height: '400vh' }}></div>

      <div 
        ref={mainContentRef}
        className="w-full min-h-screen"
      >
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
          <div className="grid lg:grid-cols-[50%_1fr] gap-8 lg:gap-16 min-h-screen">
            
            <div 
              ref={leftContainerRef}
              className="h-screen overflow-hidden"
              style={{ 
                scrollbarWidth: 'none', 
                msOverflowStyle: 'none',
                height: 'calc(100vh - 80px)'
              }}
            >
              <div className="space-y-0">
                
                <div className="h-full bg-zinc-900 overflow-hidden mb-6 group">
                  <Image
                    src={productImages[selectedImageIndex]}
                    alt={product.name}
                    width={800}
                    height={800}
                    className="w-full h-[85vh] object-cover group-hover:scale-105 transition-transform duration-500"
                    priority
                  />
                </div>
                
                <div className="space-y-6 pb-20">
                  {productImages.slice(1).map((image, index) => (
                    <div key={`detail-${index + 1}`} className="aspect-square bg-zinc-900 overflow-hidden">
                      <Image
                        src={image}
                        alt={`${product.name} detail ${index + 2}`}
                        width={800}
                        height={800}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div 
              ref={rightContainerRef}
              className="transition-transform duration-100 ease-out overflow-visible"
              style={{ 
                height: 'calc(100vh - 80px)',
                overflowY: 'visible'
              }}
            >
              <div className="py-8 space-y-6 min-h-full">
                
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-white font-bold py-1 rounded text-xl uppercase tracking-wide">
                        KASHÉ
                      </span>
                    </div>
                    
                    <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold text-white leading-tight">
                      {product.name}
                    </h1>
                    <div className="flex items-center mt-2 space-x-1">
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      <span className="text-sm text-zinc-300">
                        {product.rating.toFixed(1)} ({product.numOfReviews} reviews)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4 lg:ml-14">
                    <button
                      onClick={() => setIsFavorited(!isFavorited)}
                       className={`p-2 rounded-full border transition-all duration-200 ${
                        isFavorited 
                          ? 'bg-red-500/10 border-red-500 text-red-500' 
                          : 'bg-zinc-800 border-zinc-600 text-zinc-400 hover:text-red-500 hover:border-red-500'
                      }`}
                    >
                      <Heart className={`h-5 w-5 ${isFavorited ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={handleShare}
                      className="p-2 rounded-full bg-zinc-800 border border-zinc-600 text-zinc-400 hover:text-white hover:border-zinc-400 transition-all duration-200"
                    >
                      <Share2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="border-b border-zinc-700 pb-6">
                  <div className="flex items-baseline space-x-3 mb-2">
                    <span className="text-2xl md:text-3xl font-semibold text-white">
                      ₹{Math.round(discountedPrice).toLocaleString()}
                    </span>
                    {showOffer && (
                      <>
                        <span className="text-lg text-zinc-400 line-through">
                          ₹{product.price.toLocaleString()}
                        </span>
                        <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
                          {product.offer}% OFF
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-sm text-zinc-300">Inclusive of all taxes</p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-white">Size</label>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {sizeStock.map((sizeInfo) => {
                      const isSelected = selectedSize === sizeInfo.size
                      const isOutOfStock = sizeInfo.stock === 0
                      const isLowStock = sizeInfo.stock > 0 && sizeInfo.stock <= 3
                      
                      return (
                        <button
                          key={sizeInfo.size}
                          onClick={() => !isOutOfStock && handleSizeSelect(sizeInfo.size)}
                          disabled={isOutOfStock}
                          className={`
                            relative px-3 md:px-4 py-2 md:py-3 border font-medium transition-all duration-200 min-w-[2.5rem] md:min-w-[3rem] text-sm md:text-base
                            ${isSelected 
                              ? 'border-white bg-white text-black' 
                              : isOutOfStock
                                ? 'border-zinc-700 bg-zinc-800 text-zinc-500 cursor-not-allowed'
                                : 'border-zinc-600 bg-transparent text-zinc-300 hover:border-zinc-400'
                            }
                          `}
                        >
                          {sizeInfo.size}
                          {isLowStock && !isSelected && (
                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full"></div>
                          )}
                          {isOutOfStock && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-full h-px bg-zinc-500 transform rotate-45"></div>
                            </div>
                          )}
                        </button>
                      )
                    })}
                  </div>
                  
                  {selectedSize && (
                    <div className="text-xs text-zinc-400 mb-4">
                      Size {selectedSize}: {currentStock > 0 ? `${currentStock} available` : 'Out of stock'}
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-white">Quantity</label>
                    <span className="text-sm text-zinc-400">Max: {currentStock}</span>
                  </div>
                  <div className="flex items-center border border-zinc-700 w-fit">
                    <button
                      onClick={() => handleQuantityChange('decrease')}
                      disabled={quantity <= 1}
                      className="p-2 md:p-3 text-zinc-400 hover:text-white disabled:text-zinc-600 disabled:cursor-not-allowed transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-4 md:px-6 py-2 md:py-3 text-white font-medium min-w-[2.5rem] md:min-w-[3rem] text-center border-x border-zinc-700">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange('increase')}
                      disabled={quantity >= currentStock}
                      className="p-2 md:p-3 text-zinc-400 hover:text-white disabled:text-zinc-600 disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={!selectedSize || currentStock === 0 || isAdding}
                  className={`
                    w-full py-3 md:py-4 px-4 md:px-6 font-semibold text-base md:text-lg transition-all duration-300 flex items-center justify-center space-x-3
                    ${!selectedSize
                      ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed'
                      : currentStock === 0 
                        ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed' 
                        : isAdding
                          ? 'bg-green-600 text-white'
                          : showSuccess
                            ? 'bg-green-600 text-white'
                            : 'bg-white text-black hover:bg-zinc-300 active:scale-[0.98]'
                    }
                  `}
                >
                  {!selectedSize ? (
                    <>
                      <Package className="h-5 w-5" />
                      <span className="hidden sm:inline">Select Size</span>
                      <span className="sm:hidden">Select Size</span>
                    </>
                  ) : currentStock === 0 ? (
                    <>
                      <Package className="h-5 w-5" />
                      <span>Out of Stock</span>
                    </>
                  ) : isAdding ? (
                    <>
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                      <span className="hidden sm:inline">Adding to Cart...</span>
                      <span className="sm:hidden">Adding...</span>
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
                      <span className="hidden sm:inline">Add to Cart • ₹{(Math.round(discountedPrice) * quantity).toLocaleString()}</span>
                      <span className="sm:hidden">₹{(Math.round(discountedPrice) * quantity).toLocaleString()}</span>
                    </>
                  )}
                </button>

                <div className="border-t border-zinc-700 pt-6">
                  <h3 className="text-base md:text-lg font-semibold text-white mb-3">Product Details</h3>
                  <div className="prose prose-sm prose-invert text-zinc-300">
                    <p className="leading-relaxed mb-6 text-sm md:text-base">
                      {product.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-base md:text-lg font-semibold text-white">What's Included</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center flex-shrink-0">
                        <Truck className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <span className="font-medium text-white">Free Shipping</span>
                        <p className="text-zinc-400">On orders above ₹2,000</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center flex-shrink-0">
                        <Shield className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <span className="font-medium text-white">Quality Guarantee</span>
                        <p className="text-zinc-400">Premium quality assured</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center flex-shrink-0">
                        <RefreshCw className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <span className="font-medium text-white">Easy Returns</span>
                        <p className="text-zinc-400">7-day return policy</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-zinc-700 pt-6">
                  <h3 className="text-base md:text-lg font-semibold text-white mb-3">Size Guide</h3>
                  <p className="text-zinc-300 mb-4 text-sm md:text-base">Find your perfect fit with our comprehensive size guide.</p>
                  <div className="bg-zinc-900 p-4">
                    <div className="grid grid-cols-3 gap-2 md:gap-4 text-xs md:text-sm">
                      <div>
                        <div className="font-medium text-white">Size</div>
                        <div className="space-y-1 text-zinc-300 mt-2">
                          <div>S</div>
                          <div>M</div>
                          <div>L</div>
                          <div>XL</div>
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-white">Chest (inches)</div>
                        <div className="space-y-1 text-zinc-300 mt-2">
                          <div>34-36</div>
                          <div>38-40</div>
                          <div>42-44</div>
                          <div>46-48</div>
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-white">Length (inches)</div>
                        <div className="space-y-1 text-zinc-300 mt-2">
                          <div>26</div>
                          <div>27</div>
                          <div>28</div>
                          <div>29</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-zinc-700 pt-6">
                  <h3 className="text-base md:text-lg font-semibold text-white mb-3">Care Instructions</h3>
                  <div className="bg-zinc-900 p-4">
                    <ul className="text-zinc-300 space-y-2 text-sm">
                       <li className="flex items-start space-x-2">
                         <div className="w-2 h-2 bg-zinc-500 rounded-full flex-shrink-0 mt-1.5"></div>
                         <span>Machine wash cold with similar colors</span>
                       </li>
                       <li className="flex items-start space-x-2">
                         <div className="w-2 h-2 bg-zinc-500 rounded-full flex-shrink-0 mt-1.5"></div>
                         <span>Do not bleach or use harsh detergents</span>
                       </li>
                       <li className="flex items-start space-x-2">
                         <div className="w-2 h-2 bg-zinc-500 rounded-full flex-shrink-0 mt-1.5"></div>
                         <span>Tumble dry low heat or hang to dry</span>
                       </li>
                       <li className="flex items-start space-x-2">
                         <div className="w-2 h-2 bg-zinc-500 rounded-full flex-shrink-0 mt-1.5"></div>
                         <span>Iron on low heat if needed</span>
                       </li>
                    </ul>
                  </div>
                </div>

                <div className="border-t border-zinc-700 pt-6">
                  <h3 className="text-base md:text-lg font-semibold text-white mb-3">Customer Reviews</h3>
                  <div className="space-y-4">
                    {product.reviews && product.reviews.length > 0 ? (
                      product.reviews.slice(0, 2).map((review) => (
                        <div key={review._id} className="bg-zinc-900 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-4 w-4 ${
                                    i < review.rating 
                                      ? 'fill-gray-400 text-gray-400' 
                                      : 'text-zinc-600'
                                  }`} 
                                />
                              ))}
                            </div>
                            <span className="text-xs md:text-sm text-zinc-500">
                              {formatDate(review.createdAt)}
                            </span>
                          </div>
                          <p className="text-zinc-300 mb-2 text-sm">"{review.comment}"</p>
                          <p className="text-xs text-zinc-500">- {review.name}</p>
                        </div>
                      ))
                    ) : (
                      <div className="bg-zinc-900 p-4 text-center text-zinc-400">
                        No reviews yet.
                      </div>
                    )}
                    <LeaveReview
                      productId={params.id as string}
                      onReviewSubmit={handleReviewSubmitted}
                    />
                  </div>
                </div>

                <div className="border-t border-zinc-700 pt-6">
                  <h3 className="text-base md:text-lg font-semibold text-white mb-3">Shipping & Returns</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-zinc-900 p-4">
                      <h4 className="font-medium text-white mb-2 text-sm">Shipping Info</h4>
                      <ul className="text-xs md:text-sm text-zinc-300 space-y-1 list-disc list-inside">
                        <li>Free shipping on orders ₹2,000+</li>
                        <li>Standard delivery: 3-5 days</li>
                        <li>Express delivery: 1-2 days</li>
                      </ul>
                    </div>
                    <div className="bg-zinc-900 p-4">
                      <h4 className="font-medium text-white mb-2 text-sm">Returns Policy</h4>
                      <ul className="text-xs md:text-sm text-zinc-300 space-y-1 list-disc list-inside">
                        <li>7-day return window</li>
                        <li>Free returns & exchanges</li>
                        <li>Items must be unworn</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border-t border-zinc-700 pt-6 pb-32">
                  <h3 className="text-base md:text-lg font-semibold text-white mb-3">Need Help?</h3>
                  <div className="flex flex-col gap-4">
                    <a 
                      href="tel:+911800123456" 
                      className="flex items-center space-x-2 text-zinc-300 hover:text-white transition-colors text-sm"
                    >
                      <Phone className="h-4 w-4" />
                      <span>Call us: 1800-123-456</span>
                    </a>
                    <a 
                      href="mailto:support@kashe.com" 
                      className="flex items-center space-x-2 text-zinc-300 hover:text-white transition-colors text-sm"
                    >
                      <Mail className="h-4 w-4" />
                      <span>Email: support@kashe.com</span>
                    </a>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div> 
      <PremiumFooter/>
    </div>
  )
}