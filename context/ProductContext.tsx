"use client"
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { ProductWithStock } from '@/types'


interface ProductsResponse {
  data: ProductWithStock[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

interface ProductsContextType {
  products: ProductWithStock[]
  loading: boolean
  error: string | null
  refetchProducts: () => Promise<void>
  getProductById: (id: string) => ProductWithStock | undefined
  getProductsByCategory: (category: string) => ProductWithStock[]
  getUniqueCategories: () => string[]
  getPriceRange: () => { min: number; max: number }
  searchProducts: (searchTerm: string) => ProductWithStock[]
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined)

interface ProductsProviderProps {
  children: ReactNode
  cacheStrategy?: 'none' | 'session' | 'local' | 'memory'
  cacheDuration?: number // in minutes
}

export const ProductsProvider: React.FC<ProductsProviderProps> = ({ 
  children, 
  cacheStrategy = 'session', // Default to session storage
  cacheDuration = 30 // Default 30 minutes
}) => {
  const [products, setProducts] = useState<ProductWithStock[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const CACHE_KEY = 'products_cache'
  const CACHE_TIMESTAMP_KEY = 'products_cache_timestamp'

  // Check if cached data is still valid
  const isCacheValid = (): boolean => {
    if (cacheStrategy === 'none' || cacheStrategy === 'memory') return false
    
    const timestamp = cacheStrategy === 'session' 
      ? sessionStorage.getItem(CACHE_TIMESTAMP_KEY)
      : localStorage.getItem(CACHE_TIMESTAMP_KEY)
    
    if (!timestamp) return false
    
    const cacheTime = parseInt(timestamp)
    const now = Date.now()
    const maxAge = cacheDuration * 60 * 1000 // Convert minutes to milliseconds
    
    return (now - cacheTime) < maxAge
  }

  // Get cached products
  const getCachedProducts = (): ProductWithStock[] | null => {
    if (cacheStrategy === 'none' || cacheStrategy === 'memory') return null
    
    try {
      const cached = cacheStrategy === 'session'
        ? sessionStorage.getItem(CACHE_KEY)
        : localStorage.getItem(CACHE_KEY)
      
      return cached ? JSON.parse(cached) : null
    } catch (error) {
      console.error('Error reading cached products:', error)
      return null
    }
  }

  // Cache products
  const cacheProducts = (productsData: ProductWithStock[]) => {
    if (cacheStrategy === 'none' || cacheStrategy === 'memory') return
    
    try {
      const storage = cacheStrategy === 'session' ? sessionStorage : localStorage
      storage.setItem(CACHE_KEY, JSON.stringify(productsData))
      storage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString())
    } catch (error) {
      console.error('Error caching products:', error)
    }
  }

  // Clear cache
  const clearCache = () => {
    if (cacheStrategy === 'none' || cacheStrategy === 'memory') return
    
    const storage = cacheStrategy === 'session' ? sessionStorage : localStorage
    storage.removeItem(CACHE_KEY)
    storage.removeItem(CACHE_TIMESTAMP_KEY)
  }

  const fetchProducts = async (forceRefresh: boolean = false) => {
    try {
      // Check cache first (unless forced refresh)
      if (!forceRefresh && isCacheValid()) {
        const cachedProducts = getCachedProducts()
        if (cachedProducts) {
          console.log('Using cached products')
          setProducts(cachedProducts)
          setLoading(false)
          return
        }
      }

      console.log('Fetching fresh products from API')
      setLoading(true)
      setError(null)

      const response = await fetch('/api/products?page=1&limit=1000')

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: ProductsResponse = await response.json()
      setProducts(data.data)
      
      // Cache the fresh data
      cacheProducts(data.data)
      
    } catch (error) {
      console.error('Error fetching products:', error)
      setError(error instanceof Error ? error.message : 'Failed to fetch products')
      
      // Try to use cached data as fallback
      const cachedProducts = getCachedProducts()
      if (cachedProducts) {
        console.log('Using cached products as fallback')
        setProducts(cachedProducts)
      }
    } finally {
      setLoading(false)
    }
  }

  const refetchProducts = async () => {
    clearCache()
    await fetchProducts(true)
  }

  // Utility functions remain the same
  const getProductById = (id: string): ProductWithStock | undefined => {
    return products.find(product => product._id === id)
  }

  const getProductsByCategory = (category: string): ProductWithStock[] => {
    return products.filter(product => 
      product.category.toLowerCase() === category.toLowerCase()
    )
  }

  const getUniqueCategories = (): string[] => {
    const categories = products.map(product => product.category)
    return [...new Set(categories)].filter(Boolean)
  }

  const getPriceRange = (): { min: number; max: number } => {
    if (products.length === 0) return { min: 0, max: 10000 }
    
    const prices = products.map(product => {
      // Calculate the discounted price if an offer exists
      const finalPrice = product.offer
        ? product.price - (product.price * product.offer / 100)
        : product.price;
      return finalPrice;
    });

    // Check if prices array is empty after mapping
    if (prices.length === 0) return { min: 0, max: 10000 }

    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices))
    }
  }

  const searchProducts = (searchTerm: string): ProductWithStock[] => {
    if (!searchTerm.trim()) return products
    
    const term = searchTerm.toLowerCase()
    return products.filter(product =>
      product.name.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term)
    )
  }

  // Initialize products on mount
  useEffect(() => {
    fetchProducts()
  }, [])

  const contextValue: ProductsContextType = {
    products,
    loading,
    error,
    refetchProducts,
    getProductById,
    getProductsByCategory,
    getUniqueCategories,
    getPriceRange,
    searchProducts
  }

  return (
    <ProductsContext.Provider value={contextValue}>
      {children}
    </ProductsContext.Provider>
  )
}

export const useProducts = (): ProductsContextType => {
  const context = useContext(ProductsContext)
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider')
  }
  return context
}

export { ProductsContext }