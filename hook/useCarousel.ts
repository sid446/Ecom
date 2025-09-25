'use client'

import { useState, useEffect } from 'react'
import { Carousel, CreateCarouselData, UpdateCarouselData, ApiResponse} from '../components/AdminComp/types'

export const useCarousel = () => {
  const [carousels, setCarousels] = useState<Carousel[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch all carousels
  const fetchCarousels = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/carousel')
      const result: ApiResponse<Carousel[]> = await response.json()
      
      if (result.success && result.data) {
        setCarousels(result.data)
      } else {
        setError(result.message || 'Failed to fetch carousels')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error')
    } finally {
      setLoading(false)
    }
  }

  // Fetch single carousel by ID
  const fetchCarouselById = async (id: string): Promise<Carousel | null> => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/carousel/${id}`)
      const result: ApiResponse<Carousel> = await response.json()
      
      if (result.success && result.data) {
        return result.data
      } else {
        setError(result.message || 'Failed to fetch carousel')
        return null
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error')
      return null
    } finally {
      setLoading(false)
    }
  }

  // Create new carousel
  const createCarousel = async (data: CreateCarouselData): Promise<Carousel | null> => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/carousel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      const result: ApiResponse<Carousel> = await response.json()
      
      if (result.success && result.data) {
        setCarousels(prev => [result.data!, ...prev])
        return result.data
      } else {
        setError(result.message || 'Failed to create carousel')
        return null
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error')
      return null
    } finally {
      setLoading(false)
    }
  }

  // Update carousel
  const updateCarousel = async (id: string, data: UpdateCarouselData): Promise<Carousel | null> => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/carousel/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      const result: ApiResponse<Carousel> = await response.json()
      
      if (result.success && result.data) {
        setCarousels(prev => 
          prev.map(carousel => 
            carousel._id === id ? result.data! : carousel
          )
        )
        return result.data
      } else {
        setError(result.message || 'Failed to update carousel')
        return null
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error')
      return null
    } finally {
      setLoading(false)
    }
  }

  // Delete carousel
  const deleteCarousel = async (id: string): Promise<boolean> => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/carousel/${id}`, {
        method: 'DELETE',
      })
      
      const result: ApiResponse<Carousel> = await response.json()
      
      if (result.success) {
        setCarousels(prev => prev.filter(carousel => carousel._id !== id))
        return true
      } else {
        setError(result.message || 'Failed to delete carousel')
        return false
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error')
      return false
    } finally {
      setLoading(false)
    }
  }

  // Load carousels on mount
  useEffect(() => {
    fetchCarousels()
  }, [])

  return {
    carousels,
    loading,
    error,
    fetchCarousels,
    fetchCarouselById,
    createCarousel,
    updateCarousel,
    deleteCarousel,
    refetch: fetchCarousels,
  }
}
