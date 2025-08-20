'use client'

import { useState, useEffect, useMemo } from 'react'
import Navbar from '@/components/Navbar'
import ProductCard from '@/components/ProductCard'
import { Product } from '@/types'
import { Search, Filter, Grid, List, RefreshCw, AlertCircle, Package } from 'lucide-react'
import ProductSkeleton from '@/components/ProductSkeleton'
import ProductFilters from '@/components/ProductFilter'
export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'price-low' | 'price-high' | 'stock'>('name')
  const [filterByStock, setFilterByStock] = useState<'all' | 'in-stock' | 'low-stock'>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/products')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      setProducts(data)
      setRetryCount(0)
    } catch (error) {
      console.error('Error fetching products:', error)
      setError(error instanceof Error ? error.message : 'Failed to fetch products')
      setRetryCount(prev => prev + 1)
    } finally {
      setLoading(false)
    }
  }

  const handleRetry = () => {
    fetchProducts()
  }

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStockFilter = 
        filterByStock === 'all' ||
        (filterByStock === 'in-stock' && product.stock > 0) ||
        (filterByStock === 'low-stock' && product.stock > 0 && product.stock <= 5)
      
      return matchesSearch && matchesStockFilter
    })

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'stock':
          return b.stock - a.stock
        default:
          return 0
      }
    })

    return filtered
  }, [products, searchTerm, sortBy, filterByStock])

  

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Discover Amazing Products
          </h1>
          <p className="text-lg text-gray-900 max-w-2xl mx-auto">
            Browse our curated collection of high-quality products at unbeatable prices
          </p>
        </div>

        {/* Search and Filter Controls */}
        <ProductFilters {...{ searchTerm, setSearchTerm, filterByStock, setFilterByStock, sortBy, setSortBy, viewMode, setViewMode, loading, productsCount: products.length, filteredCount: filteredAndSortedProducts.length }}/>

        {/* Loading State */}
        {loading && (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {Array.from({ length: 8 }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Oops! Something went wrong
            </h3>
            <p className="text-gray-600 mb-4">
              {error}
            </p>
            <button
              onClick={handleRetry}
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Try Again {retryCount > 0 && `(${retryCount})`}</span>
            </button>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && filteredAndSortedProducts.length > 0 && (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1 max-w-4xl mx-auto'
          }`}>
            {filteredAndSortedProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredAndSortedProducts.length === 0 && products.length > 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Search className="h-8 w-8 text-gray-900" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={() => {
                setSearchTerm('')
                setFilterByStock('all')
                setSortBy('name')
              }}
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* No Products Available */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Package className="h-8 w-8 text-gray-900" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No products available
            </h3>
            <p className="text-gray-600 mb-4">
              Check back later for new arrivals!
            </p>
            <button
              onClick={handleRetry}
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
          </div>
        )}
      </main>
    </div>
  )
}