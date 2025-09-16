"use client"
import { Instrument_Sans } from "next/font/google"
import { useState, useMemo, useRef, Dispatch, SetStateAction } from "react"
import Navbar from "@/components/Navbar"
import ProductCard from "@/components/ProductCard"
import { Search, RefreshCw, AlertCircle, Package, X, SlidersHorizontal } from "lucide-react"
import ProductSkeleton from "@/components/ProductSkeleton"
import Hero from "@/components/Hero"
import NewArrival from "@/components/NewArrival"
import Categories from "@/components/Categories"
import PremiumFooter from "@/components/Footer"
import { useProducts } from "@/context/ProductContext"
import type { ProductWithStock } from "@/types"

const Instrument = Instrument_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-Instrument",
})

// CHANGE 1: Define a props interface for the FilterSidebar component.
// This makes the props explicit and provides type safety.
interface FilterSidebarProps {
  isMobile?: boolean;
  setShowFilters: (show: boolean) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  availableCategories: string[];
  selectedCategories: string[];
  handleCategoryToggle: (category: string) => void;
  priceRange: { min: number; max: number };
  setPriceRange: Dispatch<SetStateAction<{ min: number; max: number }>>;
  productPriceRange: { min: number; max: number };
  filterByStock: "all" | "in-stock" | "low-stock";
  setFilterByStock: Dispatch<SetStateAction<"all" | "in-stock" | "low-stock">>;
  clearAllFilters: () => void;
}

// CHANGE 2: Move the FilterSidebar component OUTSIDE of the Home component.
// This ensures its definition is stable and doesn't get re-created on every render.
const FilterSidebar = ({
  isMobile = false,
  setShowFilters,
  searchTerm,
  setSearchTerm,
  availableCategories,
  selectedCategories,
  handleCategoryToggle,
  priceRange,
  setPriceRange,
  productPriceRange,
  filterByStock,
  setFilterByStock,
  clearAllFilters
}: FilterSidebarProps) => {
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
            {availableCategories.map((category: any) => (
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
              className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer custom-range"
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
  )
}

export default function Home() {
  const {
    products,
    loading,
    error,
    refetchProducts,
    getUniqueCategories,
    getPriceRange
  } = useProducts()

  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"name" | "price-low" | "price-high" | "stock">("name")
  const [filterByStock, setFilterByStock] = useState<"all" | "in-stock" | "low-stock">("all")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 10000 })
  const [showFilters, setShowFilters] = useState(false)

  // Ref for products section
  const productsRef = useRef<HTMLDivElement>(null)

  // Calculate stock total for filtering
  const getStockTotal = (stock: any) => {
    if (typeof stock === 'number') return stock
    if (typeof stock === 'object' && stock !== null) {
      return (stock.S || 0) + (stock.M || 0) + (stock.L || 0) + (stock.XL || 0)
    }
    return 0
  }

  // Get available categories and price range from context
  const availableCategories = getUniqueCategories()
  const productPriceRange = getPriceRange()

  // Update price range when products change
  useMemo(() => {
    if (products.length > 0 && priceRange.min === 0 && priceRange.max === 10000) {
      setPriceRange(productPriceRange)
    }
  }, [products, productPriceRange, priceRange])

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  // Handle category selection from Categories component
  const handleCategorySelect = (categoryType: string) => {
    console.log('Selected category:', categoryType) // Debug log
    console.log('Available categories:', availableCategories) // Debug log
    console.log('Products sample:', products.slice(0, 3).map(p => ({ name: p.name, category: p.category }))) // Debug log

    // Clear existing filters first (optional - you can remove this if you want to keep other filters)
    setSearchTerm("")

    // Set the selected category (already in lowercase from Categories component)
    setSelectedCategories([categoryType])

    // Scroll to products section
    if (productsRef.current) {
      productsRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }

    // Don't show filters sidebar on mobile - keep it closed for better UX
    // setShowFilters(true)
  }


  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    const filtered = products.filter((product: any) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())

      const stockTotal = getStockTotal(product.stock)
      const matchesStockFilter =
        filterByStock === "all" ||
        (filterByStock === "in-stock" && stockTotal > 0) ||
        (filterByStock === "low-stock" && stockTotal > 0 && stockTotal <= 5)

      const matchesCategory =
        selectedCategories.length === 0 || selectedCategories.includes(product.category)

      const matchesPrice =
        product.price >= priceRange.min && product.price <= priceRange.max

      return matchesSearch && matchesStockFilter && matchesCategory && matchesPrice
    })

    filtered.sort((a: any, b: any) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "stock":
          return getStockTotal(b.stock) - getStockTotal(a.stock)
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

  const handleRetry = () => {
    refetchProducts()
  }

  // An object to hold all props for the FilterSidebar to avoid repetition
  const filterProps = {
    setShowFilters,
    searchTerm,
    setSearchTerm,
    availableCategories,
    selectedCategories,
    handleCategoryToggle,
    priceRange,
    setPriceRange,
    productPriceRange,
    filterByStock,
    setFilterByStock,
    clearAllFilters,
  };

  return (
    <div className={` bg-white ${Instrument.className} scrollbar-hide`}>
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>

      <main className="container min-w-screen mx-auto scrollbar-hide ">
        {/* Hero Section */}
        <div className="text-center  mb-5">
          <Hero />
        </div>

        <div className="mb-2 sm:mb-2 md:mb-3 lg:mb-0 ">
          <NewArrival products={products} loading={loading} />
        </div>

        <div id="categories-section" className=" mb-5 sm:mb-5 md:mb-8 lg:mb-10">
          <Categories onCategorySelect={handleCategorySelect} />
        </div>

        {/* Main Content Area - Added ref here */}
        <div id="products-section" ref={productsRef} className="flex gap-6 px-4 sm:px-5 md:px-7 lg:px-8">
          {/* Desktop Sidebar - Only shown when showFilters is true */}
          {showFilters && (
            <aside className="hidden lg:block w-80 flex-shrink-0">
              {/* CHANGE 3: Pass all necessary state and functions as props */}
              <FilterSidebar {...filterProps} />
            </aside>
          )}

          {/* Main Products Area */}
          <div className=" flex-1 mb-6">
            {/* Header with Sort and Filter Button */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-black">
                  Our Products
                </h2>
                <span className="text-sm text-gray-400">
                  ({filteredAndSortedProducts.length} products)
                </span>
                {/* Show selected category indicator - Hidden on mobile to prevent layout shift */}
                {selectedCategories.length > 0 && (
                  <div className="hidden sm:flex items-center gap-2">
                    <span className="text-sm text-gray-500">Filtered by:</span>
                    {selectedCategories.map((category) => (
                      <span key={category} className="bg-black text-white text-xs px-2 py-1 rounded-full">
                        {category}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4">
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

                {/* Filter Button */}
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
                  {/* CHANGE 3: Pass props to the mobile sidebar as well */}
                  <FilterSidebar {...filterProps} isMobile={true} />
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="w-full">
                <div className={`grid gap-4 sm:gap-6 justify-items-center ${
                  showFilters
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3'
                    : 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
                  }`}>
                  {Array.from({ length: 8 }).map((_, index) => (
                    <ProductSkeleton key={index} />
                  ))}
                </div>
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

            {/* Product Grid */}
            {!loading && !error && filteredAndSortedProducts.length > 0 && (
              <div className="w-full">
                <div className={`grid gap-4 sm:gap-6 justify-items-center ${
                  showFilters
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3'
                    : 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
                  }`}>
                  {filteredAndSortedProducts.map((product) => (
                    <ProductCard key={product._id} product={product as ProductWithStock} />
                  ))}
                </div>
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
        <div className="absolute w-full height-auto ">
          <PremiumFooter />
        </div>
      </main>
    </div>
  )
}