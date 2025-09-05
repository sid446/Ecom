"use client"
import { Instrument_Sans } from "next/font/google"
import { useState, useEffect, useMemo } from "react"
import Navbar from "@/components/Navbar"
import ProductCard from "@/components/ProductCard"
import type { Product } from "@/types"
import { Search, RefreshCw, AlertCircle, Package, X, ChevronDown, Filter, SlidersHorizontal } from "lucide-react"
import ProductSkeleton from "@/components/ProductSkeleton"
import Hero from "@/components/Hero"
import NewArrival from "@/components/NewArrival"
import Categories from "@/components/Categories"

const Instrument = Instrument_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-Instrument",
})

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"name" | "price-low" | "price-high" | "stock">("name")
  const [filterByStock, setFilterByStock] = useState<"all" | "in-stock" | "low-stock">("all")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 10000 })
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [retryCount, setRetryCount] = useState(0)
  const [showFilters, setShowFilters] = useState(false) // Changed from showMobileFilters to showFilters

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/products")

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setProducts(data)
      setRetryCount(0)
    } catch (error) {
      console.error("Error fetching products:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch products")
      setRetryCount((prev) => prev + 1)
    } finally {
      setLoading(false)
    }
  }

  const handleRetry = () => {
    fetchProducts()
  }

  // Get unique categories from products
  const availableCategories = useMemo(() => {
    const categories = products.map(product => product.category)
    return [...new Set(categories)].filter(Boolean)
  }, [products])

  // Get price range from products
  const productPriceRange = useMemo(() => {
    if (products.length === 0) return { min: 0, max: 10000 }
    const prices = products.map(p => p.price)
    return {
      min: Math.floor(Math.min(...prices) / 100) * 100,
      max: Math.ceil(Math.max(...prices) / 100) * 100
    }
  }, [products])

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const filteredAndSortedProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStockFilter =
        filterByStock === "all" ||
        (filterByStock === "in-stock" && product.stock > 0) ||
        (filterByStock === "low-stock" && product.stock > 0 && product.stock <= 5)

      const matchesCategory = 
        selectedCategories.length === 0 || selectedCategories.includes(product.category)

      const matchesPrice = 
        product.price >= priceRange.min && product.price <= priceRange.max

      return matchesSearch && matchesStockFilter && matchesCategory && matchesPrice
    })

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "stock":
          return b.stock - a.stock
        default:
          return 0
      }
    })

    return filtered
  }, [products, searchTerm, sortBy, filterByStock, selectedCategories, priceRange])

  const clearAllFilters = () => {
    setSearchTerm("")
    setSortBy("name")
    setFilterByStock("all")
    setSelectedCategories([])
    setPriceRange(productPriceRange)
  }

  // Sidebar Filter Component
  const FilterSidebar = ({ isMobile = false }) => {
    // Custom styles for zinc-700 theme
    const checkboxStyle = {
      accentColor: 'black'
    };

    const radioStyle = {
      accentColor: 'black'
    };

    const rangeStyle = {
      accentColor: 'black'
    };

    return (
      <>
        <style dangerouslySetInnerHTML={{
          __html: `
            input[type="checkbox"]:checked {
              background-color: black !important;
              border-color: black !important;
            }
            input[type="radio"]:checked {
              background-color: black !important;
              border-color: black !important;
            }
            input[type="range"]::-webkit-slider-thumb {
              background-color: black !important;
            }
            input[type="range"]::-moz-range-thumb {
              background-color: black !important;
            }
            .custom-checkbox:checked {
              background-color: black;
              border-color: black;
            }
            .custom-radio:checked {
              background-color: black;
              border-color: black;
            }
            .custom-range::-webkit-slider-thumb {
              appearance: none;
              height: 20px;
              width: 20px;
              border-radius: 50%;
              background: black;
              cursor: pointer;
              border: none;
            }
            .custom-range::-moz-range-thumb {
              height: 20px;
              width: 20px;
              border-radius: 50%;
              background: black;
              cursor: pointer;
              border: none;
            }
          `
        }} />
        
        <div className={`bg-white/70 backdrop-blur-sm ${isMobile ? 'p-4' : 'p-6'} ${isMobile ? '' : 'sticky top-4'} h-fit`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
            <button
              onClick={() => setShowFilters(false)}
              className="p-1 hover:bg-[#A69080] rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Search Section */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-[#A69080] rounded-md focus:outline-none focus:ring-2 focus:ring-black text-gray-800 placeholder-gray-600"
                />
              </div>
            </div>

            {/* Categories Section */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Categories</label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {availableCategories.map((category) => (
                  <label key={category} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryToggle(category)}
                      style={checkboxStyle}
                      className="w-4 h-4 custom-checkbox bg-white border-[#A69080] rounded focus:ring-black focus:ring-2"
                    />
                    <span className="text-sm text-gray-700 capitalize">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range Section */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Price Range</label>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-gray-600">Min Price</label>
                    <input
                      type="number"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: Math.max(0, Number(e.target.value)) }))}
                      className="w-full px-3 py-1 bg-white border border-[#A69080] rounded-md focus:outline-none focus:ring-2 focus:ring-black text-gray-800 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">Max Price</label>
                    <input
                      type="number"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                      className="w-full px-3 py-1 bg-white border border-[#A69080] rounded-md focus:outline-none focus:ring-2 focus:ring-black text-gray-800 text-sm"
                    />
                  </div>
                </div>
                <input
                  type="range"
                  min={productPriceRange.min}
                  max={productPriceRange.max}
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                  style={rangeStyle}
                  className="w-full h-2 bg-white rounded-lg appearance-none cursor-pointer custom-range"
                />
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Rs.{productPriceRange.min.toLocaleString()}</span>
                  <span>Rs.{productPriceRange.max.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Stock Filter Section */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Stock Status</label>
              <div className="space-y-2">
                {[
                  { value: "all", label: "All Products" },
                  { value: "in-stock", label: "In Stock Only" },
                  { value: "low-stock", label: "Low Stock (≤5)" }
                ].map((option) => (
                  <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="stockFilter"
                      value={option.value}
                      checked={filterByStock === option.value}
                      onChange={(e) => setFilterByStock(e.target.value as any)}
                      style={radioStyle}
                      className="w-4 h-4 custom-radio bg-white border-[#A69080] focus:ring-black focus:ring-2"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Clear Filters Button */}
            <button
              onClick={clearAllFilters}
              className="w-full px-4 py-2 bg-black text-white hover:bg-[#7A6449] transition-colors text-sm font-medium rounded-md"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <style jsx global>{`
          html, body {
            overflow-x: hidden !important;
            max-width: 100vw !important;
          }
          
          * {
            scrollbar-width: none !important;
            -ms-overflow-style: none !important;
            box-sizing: border-box !important;
          }
          
          *::-webkit-scrollbar {
            display: none !important;
            width: 0 !important;
            height: 0 !important;
          }
          
          *::-webkit-scrollbar-track {
            display: none !important;
          }
          
          *::-webkit-scrollbar-thumb {
            display: none !important;
          }
          
          .scrollbar-hide {
            -ms-overflow-style: none !important;
            scrollbar-width: none !important;
            overflow-x: hidden !important;
          }
          
          .scrollbar-hide::-webkit-scrollbar { 
            display: none !important;
            width: 0 !important;
            height: 0 !important;
          }
        `}</style>

      <div className={`min-h-screen bg-black ${Instrument.className} scrollbar-hide`}>
        <div className="sticky top-0 z-50">
          <Navbar />
        </div>

        <main className="container mx-auto scrollbar-hide">
          {/* Hero Section */}
          <div className="text-center mb-5">
            <Hero />
          </div>

          <div className="mb-2 sm:mb-2 md:mb-3 lg:mb-0">
            <NewArrival />
          </div>

          <div className="mb-5 sm:mb-5 md:mb-8 lg:mb-10">
            <Categories />
          </div>

          {/* Main Content Area */}
          <div className="flex gap-6 px-4 sm:px-5 md:px-7 lg:px-8">
            {/* Desktop Sidebar - Only shown when showFilters is true */}
            {showFilters && (
              <aside className="hidden lg:block w-80 flex-shrink-0">
                <FilterSidebar />
              </aside>
            )}

            {/* Main Products Area */}
            <div className="flex-1">
              {/* Header with Sort and Filter Button */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white">
                    Our Products
                  </h2>
                  <span className="text-sm text-gray-400">
                    ({filteredAndSortedProducts.length} products)
                  </span>
                </div>

                <div className="flex  items-center gap-4">
                  {/* Sort Dropdown */}
                  <div className="hidden sm:block">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="px-4 py-2 bg-white/70 backdrop-blur-sm border border-[#A69080] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B7355] text-gray-800 text-sm"
                    >
                      <option value="name">Sort by Name</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="stock">Stock Level</option>
                    </select>
                  </div>

                  {/* Filter Button - Now works for both mobile and desktop */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm border border-[#A69080] rounded-md hover:bg-[#A69080] transition-colors"
                  >
                    <SlidersHorizontal className="w-4 h-4 text-gray-700" />
                    <span className="text-sm text-gray-700">Filters</span>
                  </button>
                </div>
              </div>

              {/* Mobile Filter Overlay */}
              {showFilters && (
                <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
                  <div className="absolute right-0 top-0 h-full w-80 bg-white overflow-y-auto">
                    <FilterSidebar isMobile={true} />
                  </div>
                </div>
              )}

              {/* Loading State */}
              {loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <ProductSkeleton key={index} />
                  ))}
                </div>
              )}

              {/* Error State */}
              {error && !loading && (
                <div className="text-center py-10 px-4 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
                  <h3 className="mt-2 text-lg font-medium text-red-800">Could not fetch products</h3>
                  <p className="mt-1 text-sm text-red-700">{error}</p>
                  <button
                    onClick={handleRetry}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Try Again
                  </button>
                </div>
              )}

              {/* Product Grid - Adjusted grid columns based on whether filters are shown */}
              {!loading && !error && filteredAndSortedProducts.length > 0 && (
                <div className={`inline-grid px-3 items-center gap-4 sm:gap-6 ${
                  showFilters 
                    ? 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                    : 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'
                }`}>
                  {filteredAndSortedProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              )}

              {/* No Products Found */}
              {!loading && !error && filteredAndSortedProducts.length === 0 && (
                <div className="text-center py-20">
                  <Package className="mx-auto h-16 w-16 text-gray-400" />
                  <h3 className="mt-4 text-xl font-medium text-gray-800">No Products Found</h3>
                  <p className="mt-2 text-gray-600">
                    Try adjusting your filters or search terms
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="mt-4 px-6 py-2 bg-[#8B7355] text-white hover:bg-[#7A6449] transition-colors rounded-md"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  )
}