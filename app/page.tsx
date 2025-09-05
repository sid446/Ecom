"use client"
import { Kalnia } from "next/font/google"
import { useState, useEffect, useMemo } from "react"
import Navbar from "@/components/Navbar"
import ProductCard from "@/components/ProductCard"
import type { Product } from "@/types"
import { Search, RefreshCw, AlertCircle, Package, X, ChevronDown } from "lucide-react"
import ProductSkeleton from "@/components/ProductSkeleton"
import Hero from "@/components/Hero"
import NewArrival from "@/components/NewArrival"
import Categories from "@/components/Categories"

const kalnia = Kalnia({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-kalnia",
})

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"name" | "price-low" | "price-high" | "stock">("name")
  const [filterByStock, setFilterByStock] = useState<"all" | "in-stock" | "low-stock">("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [retryCount, setRetryCount] = useState(0)
  const [showFilters, setShowFilters] = useState(false)

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

  const filteredAndSortedProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStockFilter =
        filterByStock === "all" ||
        (filterByStock === "in-stock" && product.stock > 0) ||
        (filterByStock === "low-stock" && product.stock > 0 && product.stock <= 5)

      return matchesSearch && matchesStockFilter
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
  }, [products, searchTerm, sortBy, filterByStock])

  return (
    <>
      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;  /* Internet Explorer 10+ */
          scrollbar-width: none;  /* Firefox */
        }
        .scrollbar-hide::-webkit-scrollbar { 
          display: none;  /* Safari and Chrome */
        }
        
        /* Apply to all elements with horizontal scroll */
        * {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        *::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <div className={`min-h-screen bg-[#CCB8AD] ${kalnia.className} scrollbar-hide`}>
        <Navbar />

        <main className="container mx-auto scrollbar-hide">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <Hero />
          </div>

          <div className="mb-3 sm:mb-5 md:mb-8 lg:mb-10">
            <NewArrival />
          </div>

          <div className="mb-5 sm:mb-5 md:mb-8 lg:mb-10">
            <Categories />
          </div>

          <div className="w-full flex justify-between px-5 sm:px-5 md:px-7 lg:px-8 mb-6 items-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-gray-800">Our Products</h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex gap-4 items-center hover:opacity-80 transition-opacity"
            >
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-gray-800">Filter</h2>
              <img className="w-5 sm:w-5 md:w-7 lg:w-9 h-6 sm:h-7 md:h-8 lg:h-10" src="/stroke.png" alt="" />
            </button>
          </div>

          {showFilters && (
            <div className="mx-5 mb-6 bg-[#B8A394]  p-6 shadow-lg border border-[#A69080]">
              <div className="flex justify-end items-center mb-4">
              
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-1 hover:bg-[#A69080] rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-700" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search Section */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Search Products</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search by name or description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-[#D4C4B8] border border-[#A69080] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B7355] text-gray-800 placeholder-gray-600"
                    />
                  </div>
                </div>

                {/* Sort Section */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Sort By</label>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="w-full px-4 py-2 bg-[#D4C4B8] border border-[#A69080] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B7355] text-gray-800 appearance-none cursor-pointer"
                    >
                      <option value="name">Name (A-Z)</option>
                      <option value="price-low">Price (Low to High)</option>
                      <option value="price-high">Price (High to Low)</option>
                      <option value="stock">Stock Level</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4 pointer-events-none" />
                  </div>
                </div>

                {/* Stock Filter Section */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Stock Status</label>
                  <div className="relative">
                    <select
                      value={filterByStock}
                      onChange={(e) => setFilterByStock(e.target.value as any)}
                      className="w-full px-4 py-2 bg-[#D4C4B8] border border-[#A69080] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B7355] text-gray-800 appearance-none cursor-pointer"
                    >
                      <option value="all">All Products</option>
                      <option value="in-stock">In Stock Only</option>
                      <option value="low-stock">Low Stock (≤5)</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Clear Filters Button */}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => {
                    setSearchTerm("")
                    setSortBy("name")
                    setFilterByStock("all")
                  }}
                  className="px-4 py-2 bg-[#8B7355] text-white  hover:bg-[#7A6449] transition-colors text-sm font-medium"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center">
              <div className="px-4 sm:px-5 md:px-7 lg:px-8 inline-grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
                {/* Render 8 skeleton loaders while fetching data */}
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

          {/* Product Grid - Renders when not loading, no error, and products exist */}
          {!loading && !error && filteredAndSortedProducts.length > 0 && (
            // Add a parent div with text-center to center the inline-grid
            <div className="text-center">
              <div className="px-4 sm:px-5 md:px-7 lg:px-8 inline-grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
                {filteredAndSortedProducts.map((product) => (
                  <div key={product._id} className="text-left">
                    {" "}
                    {/* Wrapper to reset text-align for card content */}
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Products Available State */}
          {!loading && !error && filteredAndSortedProducts.length === 0 && (
            <div className=" h-[50vh] justify-items-center  text-center py-10 px-4  ">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-800">No Products Found</h3>
              <p className="mt-1 text-sm text-gray-600">
                We couldn't find any products matching your search or filters.
              </p>
            </div>
          )}
        </main>
      </div>
    </>
  )
}
