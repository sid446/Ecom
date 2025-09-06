'use client'

import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { useCart } from '@/context/CartContext'
import { Product } from '@/types'
import { 
  ShoppingCart,
  MapPin, 
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

// Size stock interface
interface SizeStock {
  size: string
  stock: number
}

// Mock function to get product by ID - replace with your actual API call
const getProductById = async (id: string): Promise<Product | null> => {
    const response = await fetch(`/api/products/${id}`)
    if (!response.ok) return null
    return response.json()
}

// Mock function to get size stock - replace with your actual API call
const getSizeStock = async (productId: string): Promise<SizeStock[]> => {
    // Mock data - replace with actual API call
    return [
      { size: 'S', stock: 8 },
      { size: 'M', stock: 12 },
      { size: 'L', stock: 5 },
      { size: 'XL', stock: 0 },
      { size: 'XXL', stock: 3 }
    ]
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
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [sizeStock, setSizeStock] = useState<SizeStock[]>([])
  const [isMobile, setIsMobile] = useState(false)
  
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
        
        // Fetch size stock data
        const sizeStockData = await getSizeStock(params.id as string)
        setSizeStock(sizeStockData)
        
        // Auto-select first available size
        const firstAvailableSize = sizeStockData.find(s => s.stock > 0)
        if (firstAvailableSize) {
          setSelectedSize(firstAvailableSize.size)
        }
        
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params.id])

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

  const handleAddToCart = async () => {
    if (!product || !selectedSize || getCurrentStock() === 0 || isAdding) return
    
    setIsAdding(true)
    
    // Add the specified quantity to cart with size information
    const productWithSize = {
      ...product,
      selectedSize,
      stock: getCurrentStock()
    }
    
    for (let i = 0; i < quantity; i++) {
      addToCart(productWithSize)
    }
    
    setShowSuccess(true)
    
    setTimeout(() => {
      setIsAdding(false)
      setShowSuccess(false)
    }, 2000)
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
    if (!selectedSize) return 0
    const sizeInfo = sizeStock.find(s => s.size === selectedSize)
    return sizeInfo ? sizeInfo.stock : 0
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-black mx-auto"></div>
          <p className="text-gray-600 font-medium mt-4">Loading product...</p>
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

  // Mock additional images - replace with actual product images
  const productImages = product.allimages.length > 0 ? product.allimages : [product.imagefront, product.imageback]

  // Mobile Layout
  if (isMobile) {
    return (
      <div className="bg-gradient-to-b from-black via-zinc-300 to-black min-h-screen">
        {/* Fixed Header */}
        <Navbar/>
        
        <div className="pt-20 pb-8">
          {/* Mobile Image Gallery */}
          <div className="relative">
            <div className="aspect-square bg-gray-50 overflow-hidden relative">
              <Image
                src={productImages[selectedImageIndex]}
                alt={product.name}
                width={800}
                height={800}
                className="w-full h-full object-cover"
                priority
              />
              
              {/* Image Navigation */}
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
                  
                  {/* Image Indicators */}
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
            {/* Product Header */}
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
                  <Star className="h-4 w-4 fill-gray-600 text-gray-400" />
                  <span className="text-sm text-gray-400">4.5 (128 reviews)</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsFavorited(!isFavorited)}
                  className={`p-2 rounded-full border transition-all duration-200 ${
                    isFavorited 
                      ? 'bg-red-50 border-red-200 text-red-600' 
                      : 'bg-white border-gray-300 text-gray-500 hover:text-red-600 hover:border-red-200'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${isFavorited ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 rounded-full bg-white border border-gray-300 text-gray-400 hover:text-gray-600 hover:border-gray-400 transition-all duration-200"
                >
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Price */}
            <div className="border-b border-gray-200 pb-6">
              <div className="flex items-baseline space-x-3 mb-2">
                <span className="text-3xl font-semibold text-white">
                  ₹{product.price.toLocaleString()}
                </span>
                <span className="text-lg text-gray-400 line-through">
                  ₹{Math.round(product.price * 1.2).toLocaleString()}
                </span>
                <span className="bg-green-600 text-white px-2 py-1 rounded text-sm font-medium">
                  17% OFF
                </span>
              </div>
              <p className="text-sm text-gray-400">Inclusive of all taxes</p>
            </div>

            {/* Size Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-400">Size</label>
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
                          ? 'border-black bg-black text-white' 
                          : isOutOfStock
                            ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'border-gray-300 bg-white text-gray-700 hover:border-gray-500'
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
              
              {/* Size stock details */}
              {selectedSize && (
                <div className="text-xs text-gray-400 mb-4">
                  Size {selectedSize}: {currentStock > 0 ? `${currentStock} available` : 'Out of stock'}
                </div>
              )}
            </div>

            {/* Quantity Selector */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-400">Quantity</label>
                <span className="text-sm text-gray-400">Max: {currentStock}</span>
              </div>
              <div className="flex items-center border border-gray-300 w-fit">
                <button
                  onClick={() => handleQuantityChange('decrease')}
                  disabled={quantity <= 1}
                  className="p-3 text-gray-400 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-6 py-3 text-gray-400 font-medium min-w-[3rem] text-center border-x border-gray-300">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange('increase')}
                  disabled={quantity >= currentStock}
                  className="p-3 text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={!selectedSize || currentStock === 0 || isAdding}
              className={`
                w-full py-4 px-6 font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-3
                ${!selectedSize
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : currentStock === 0 
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                    : isAdding
                      ? 'bg-green-600 text-white'
                      : showSuccess
                        ? 'bg-green-600 text-white'
                        : 'bg-black text-white hover:bg-gray-800 active:scale-[0.98]'
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
                  <span>Add to Cart • ₹{(product.price * quantity).toLocaleString()}</span>
                </>
              )}
            </button>

            {/* Additional Mobile Images */}
            {productImages.length > 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">More Views</h3>
                <div className="grid grid-cols-2 gap-4">
                  {productImages.slice(1).map((image, index) => (
                    <div key={`mobile-${index}`} className="aspect-square bg-gray-50 overflow-hidden">
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

            {/* Product Description */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Product Details</h3>
              <div className="prose prose-sm text-gray-700">
                <p className="leading-relaxed mb-6">
                  {product.description}
                </p>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">What's Included</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
                    <Truck className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Free Shipping</span>
                    <p className="text-gray-600">On orders above ₹2,000</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Quality Guarantee</span>
                    <p className="text-gray-600">Premium quality assured</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
                    <RefreshCw className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Easy Returns</span>
                    <p className="text-gray-600">7-day return policy</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Collapsible sections for mobile to save space */}
            <details className="border-t border-gray-200 pt-6">
              <summary className="text-lg font-semibold text-gray-900 cursor-pointer mb-3">Size Guide</summary>
              <div className="bg-gray-50 p-4">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="font-medium text-gray-900">Size</div>
                    <div className="space-y-1 text-gray-700 mt-2">
                      <div>S</div>
                      <div>M</div>
                      <div>L</div>
                      <div>XL</div>
                      <div>XXL</div>
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Chest</div>
                    <div className="space-y-1 text-gray-700 mt-2">
                      <div>34-36</div>
                      <div>38-40</div>
                      <div>42-44</div>
                      <div>46-48</div>
                      <div>50-52</div>
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Length</div>
                    <div className="space-y-1 text-gray-700 mt-2">
                      <div>26</div>
                      <div>27</div>
                      <div>28</div>
                      <div>29</div>
                      <div>30</div>
                    </div>
                  </div>
                </div>
              </div>
            </details>

            <details className="border-t border-gray-200 pt-6">
              <summary className="text-lg font-semibold text-gray-900 cursor-pointer mb-3">Care Instructions</summary>
              <div className="bg-gray-50 p-4">
                <ul className="text-gray-700 space-y-2 text-sm">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full flex-shrink-0"></div>
                    <span>Machine wash cold with similar colors</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full flex-shrink-0"></div>
                    <span>Do not bleach or use harsh detergents</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full flex-shrink-0"></div>
                    <span>Tumble dry low heat or hang to dry</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full flex-shrink-0"></div>
                    <span>Iron on low heat if needed</span>
                  </li>
                </ul>
              </div>
            </details>

            <details className="border-t border-gray-200 pt-6">
              <summary className="text-lg font-semibold text-gray-900 cursor-pointer mb-3">Reviews</summary>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">2 days ago</span>
                  </div>
                  <p className="text-gray-700 mb-2 text-sm">"Excellent quality and perfect fit. Highly recommended!"</p>
                  <p className="text-xs text-gray-500">- Verified Purchase</p>
                </div>
              </div>
            </details>

            <details className="border-t border-gray-200 pt-6">
              <summary className="text-lg font-semibold text-gray-900 cursor-pointer mb-3">Shipping & Returns</summary>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4">
                  <h4 className="font-medium text-gray-900 mb-2 text-sm">Shipping Info</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Free shipping on orders ₹2,000+</li>
                    <li>• Standard delivery: 3-5 days</li>
                    <li>• Express delivery: 1-2 days</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4">
                  <h4 className="font-medium text-gray-900 mb-2 text-sm">Returns Policy</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• 7-day return window</li>
                    <li>• Free returns & exchanges</li>
                    <li>• Items must be unworn</li>
                  </ul>
                </div>
              </div>
            </details>

            {/* Help Section */}
            <div className="border-t border-gray-200 pt-6 pb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Need Help?</h3>
              <div className="flex flex-col space-y-3">
                <a 
                  href="tel:+911800123456" 
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  <span>Call us: 1800-123-456</span>
                </a>
                <a 
                  href="mailto:support@kashe.com" 
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  <span>Email: support@kashe.com</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <PremiumFooter/>
      </div>
    )
  }

  // Desktop Layout (existing code with proper responsive classes)
  return (
    <div className="bg-gradient-to-b from-black via-zinc-300 to-black">
      {/* Fixed Header */}
      <Navbar/>

      {/* Spacer for scroll calculations */}
      <div ref={spacerRef} style={{ height: '400vh' }}></div>

      {/* Main Content */}
      <div 
        ref={mainContentRef}
        className="w-full min-h-screen"
      >
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
          <div className="grid lg:grid-cols-[50%_1fr] gap-8 lg:gap-16 min-h-screen">
            
            {/* Left Side - Image Gallery */}
            <div 
              ref={leftContainerRef}
              className="h-screen overflow-hidden"
              style={{ 
                scrollbarWidth: 'none', 
                msOverflowStyle: 'none',
                height: 'calc(100vh - 80px)' // Account for header
              }}
            >
              <div className="space-y-0">
                
                {/* Main Image */}
                <div className="h-full bg-gray-50 overflow-hidden mb-6 group">
                  <Image
                    src={productImages[selectedImageIndex]}
                    alt={product.name}
                    width={800}
                    height={800}
                    className="w-full h-[85vh] object-cover group-hover:scale-105 transition-transform duration-500"
                    priority
                  />
                </div>
                
                {/* Additional Scrollable Images */}
                <div className="space-y-6 pb-20">
                  {productImages.slice(1).map((image, index) => (
                    <div key={`detail-${index + 1}`} className="aspect-square bg-gray-50 overflow-hidden">
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

            {/* Right Side - Product Info */}
            <div 
              ref={rightContainerRef}
              className="transition-transform duration-100 ease-out overflow-visible"
              style={{ 
                height: 'calc(100vh - 80px)', // Match left side height
                overflowY: 'visible' // Allow content to overflow for scrolling
              }}
            >
              <div className="py-8 space-y-6 min-h-full">
                
                {/* Product Header */}
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
                      <Star className="h-4 w-4 fill-gray-500 text-gray-600" />
                      <span className="text-sm text-white">4.5 (128 reviews)</span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center space-x-2 ml-4 lg:ml-14">
                    <button
                      onClick={() => setIsFavorited(!isFavorited)}
                      className={`p-2 rounded-full border transition-all duration-200 ${
                        isFavorited 
                          ? 'bg-red-50 border-red-200 text-red-600' 
                          : 'bg-white border-gray-300 text-zinc-500 hover:text-red-600 hover:border-red-200'
                      }`}
                    >
                      <Heart className={`h-5 w-5 ${isFavorited ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={handleShare}
                      className="p-2 rounded-full bg-white border border-gray-300 text-gray-400 hover:text-white hover:border-gray-400 transition-all duration-200"
                    >
                      <Share2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Price */}
                <div className="border-b border-gray-200 pb-6">
                  <div className="flex items-baseline space-x-3 mb-2">
                    <span className="text-2xl md:text-3xl font-semibold text-white">
                      ₹{product.price.toLocaleString()}
                    </span>
                    <span className="text-lg text-white line-through">
                      ₹{Math.round(product.price * 1.2).toLocaleString()}
                    </span>
                    <span className="bg-gray-500 text-white px-2 py-1 rounded text-sm font-medium">
                      17% OFF
                    </span>
                  </div>
                  <p className="text-sm text-white">Inclusive of all taxes</p>
                </div>

                {/* Size Selection */}
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
                              ? 'border-black bg-black text-white' 
                              : isOutOfStock
                                ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-500'
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
                  
                  {/* Size stock details */}
                  {selectedSize && (
                    <div className="text-xs text-white mb-4">
                      Size {selectedSize}: {currentStock > 0 ? `${currentStock} available` : 'Out of stock'}
                    </div>
                  )}
                </div>

                {/* Quantity Selector */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-white">Quantity</label>
                    <span className="text-sm text-white">Max: {currentStock}</span>
                  </div>
                  <div className="flex items-center border border-gray-300 w-fit">
                    <button
                      onClick={() => handleQuantityChange('decrease')}
                      disabled={quantity <= 1}
                      className="p-2 md:p-3 text-white hover:text-white disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-4 md:px-6 py-2 md:py-3 text-white font-medium min-w-[2.5rem] md:min-w-[3rem] text-center border-x border-gray-300">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange('increase')}
                      disabled={quantity >= currentStock}
                      className="p-2 md:p-3 text-white hover:text-white disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedSize || currentStock === 0 || isAdding}
                  className={`
                    w-full py-3 md:py-4 px-4 md:px-6 font-semibold text-base md:text-lg transition-all duration-300 flex items-center justify-center space-x-3
                    ${!selectedSize
                      ? 'bg-gray-200 text-white cursor-not-allowed'
                      : currentStock === 0 
                        ? 'bg-gray-200 text-white cursor-not-allowed' 
                        : isAdding
                          ? 'bg-green-600 text-white'
                          : showSuccess
                            ? 'bg-green-600 text-white'
                            : 'bg-black text-white hover:bg-gray-800 active:scale-[0.98]'
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
                      <span className="hidden sm:inline">Add to Cart • ₹{(product.price * quantity).toLocaleString()}</span>
                      <span className="sm:hidden">₹{(product.price * quantity).toLocaleString()}</span>
                    </>
                  )}
                </button>

                {/* Product Description */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-base md:text-lg font-semibold text-black mb-3">Product Details</h3>
                  <div className="prose prose-sm text-black">
                    <p className="leading-relaxed mb-6 text-sm md:text-base">
                      {product.description}
                    </p>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-4">
                  <h3 className="text-base md:text-lg font-semibold text-black">What's Included</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                        <Truck className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <span className="font-medium text-black">Free Shipping</span>
                        <p className="text-black">On orders above ₹2,000</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                        <Shield className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <span className="font-medium text-black">Quality Guarantee</span>
                        <p className="text-black">Premium quality assured</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                        <RefreshCw className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <span className="font-medium text-black">Easy Returns</span>
                        <p className="text-black">7-day return policy</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Size Guide */}
                <div className="border-t text-gray-700 border-gray-200 pt-6">
                  <h3 className="text-base md:text-lg font-semibold text-black mb-3">Size Guide</h3>
                  <p className="text-zinc-900 mb-4 text-sm md:text-base">Find your perfect fit with our comprehensive size guide.</p>
                  <div className="bg-black p-4">
                    <div className="grid grid-cols-3 gap-2 md:gap-4 text-xs md:text-sm">
                      <div>
                        <div className="font-medium text-white">Size</div>
                        <div className="space-y-1 text-white mt-2">
                          <div>S</div>
                          <div>M</div>
                          <div>L</div>
                          <div>XL</div>
                          <div>XXL</div>
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-white">Chest (inches)</div>
                        <div className="space-y-1 text-white mt-2">
                          <div>34-36</div>
                          <div>38-40</div>
                          <div>42-44</div>
                          <div>46-48</div>
                          <div>50-52</div>
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-white">Length (inches)</div>
                        <div className="space-y-1 text-white mt-2">
                          <div>26</div>
                          <div>27</div>
                          <div>28</div>
                          <div>29</div>
                          <div>30</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Care Instructions */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-base md:text-lg font-semibold text-black mb-3">Care Instructions</h3>
                  <div className="bg-black p-4">
                    <ul className="text-white space-y-2 text-sm">
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full flex-shrink-0"></div>
                        <span>Machine wash cold with similar colors</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full flex-shrink-0"></div>
                        <span>Do not bleach or use harsh detergents</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full flex-shrink-0"></div>
                        <span>Tumble dry low heat or hang to dry</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full flex-shrink-0"></div>
                        <span>Iron on low heat if needed</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full flex-shrink-0"></div>
                        <span>Store in a cool, dry place</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Customer Reviews */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-base md:text-lg font-semibold text-black mb-3">Customer Reviews</h3>
                  <div className="space-y-4">
                    <div className="bg-black p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-gray-500 text-gray-600" />
                          ))}
                        </div>
                        <span className="text-xs md:text-sm text-white">2 days ago</span>
                      </div>
                      <p className="text-white mb-2 text-sm">"Excellent quality and perfect fit. Highly recommended!"</p>
                      <p className="text-xs text-white">- Verified Purchase</p>
                    </div>
                    
                    <div className="bg-black p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-1">
                          {[...Array(4)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-gray-500 text-gray-600" />
                          ))}
                          <Star className="h-4 w-4 text-gray-300" />
                        </div>
                        <span className="text-xs md:text-sm text-white">1 week ago</span>
                      </div>
                      <p className="text-white mb-2 text-sm">"Good product, delivered on time. Material is comfortable."</p>
                      <p className="text-xs text-white">- Verified Purchase</p>
                    </div>
                  </div>
                </div>

                {/* Shipping & Returns */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-base md:text-lg font-semibold text-black mb-3">Shipping & Returns</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-black p-4">
                      <h4 className="font-medium text-white mb-2 text-sm">Shipping Info</h4>
                      <ul className="text-xs md:text-sm text-white space-y-1">
                        <li>• Free shipping on orders ₹2,000+</li>
                        <li>• Standard delivery: 3-5 days</li>
                        <li>• Express delivery: 1-2 days</li>
                      </ul>
                    </div>
                    <div className="bg-black p-4">
                      <h4 className="font-medium text-white mb-2 text-sm">Returns Policy</h4>
                      <ul className="text-xs md:text-sm text-white space-y-1">
                        <li>• 7-day return window</li>
                        <li>• Free returns & exchanges</li>
                        <li>• Items must be unworn</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Help Section with extra bottom padding */}
                <div className="border-t border-gray-200 pt-6 pb-32">
                  <h3 className="text-base md:text-lg font-semibold text-black mb-3">Need Help?</h3>
                  <div className="flex flex-col gap-4">
                    <a 
                      href="tel:+911800123456" 
                      className="flex items-center space-x-2 text-zinc-900 hover:text-gray-800 transition-colors text-sm"
                    >
                      <Phone className="h-4 w-4" />
                      <span>Call us: 1800-123-456</span>
                    </a>
                    <a 
                      href="mailto:support@kashe.com" 
                      className="flex items-center space-x-2 text-zinc-900 hover:text-gray-800 transition-colors text-sm"
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

      {/* Footer */}
      <div className='-mt-70'>
        <PremiumFooter/>
      </div>
    </div>
  )
}