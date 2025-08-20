'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'

export default function Admin() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const testConnection = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/seed', { method: 'GET' })
      const data = await response.json()
      setResult({ type: 'connection', data, status: response.status })
    } catch (error) {
      setResult({ type: 'connection', data: { error: 'Failed to connect' }, status: 500 })
    } finally {
      setLoading(false)
    }
  }

  const seedDatabase = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/seed', { method: 'POST' })
      const data = await response.json()
      setResult({ type: 'seed', data, status: response.status })
    } catch (error) {
      setResult({ type: 'seed', data: { error: 'Failed to seed' }, status: 500 })
    } finally {
      setLoading(false)
    }
  }

  const checkProducts = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      setResult({ type: 'products', data, status: response.status })
    } catch (error) {
      setResult({ type: 'products', data: { error: 'Failed to fetch products' }, status: 500 })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={testConnection}
            disabled={loading}
            className="bg-blue-600 text-white p-4 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Testing...' : 'Test MongoDB Connection'}
          </button>
          
          <button
            onClick={seedDatabase}
            disabled={loading}
            className="bg-green-600 text-white p-4 rounded hover:bg-green-700 disabled:bg-gray-400"
          >
            {loading ? 'Seeding...' : 'Seed Database'}
          </button>
          
          <button
            onClick={checkProducts}
            disabled={loading}
            className="bg-purple-600 text-white p-4 rounded hover:bg-purple-700 disabled:bg-gray-400"
          >
            {loading ? 'Checking...' : 'Check Products'}
          </button>
        </div>

        {result && (
          <div className="bg-gray-100 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">
              Result ({result.type}) - Status: {result.status}
            </h2>
            <pre className="bg-black text-green-400 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(result.data, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-8 bg-yellow-50 border border-yellow-200 p-4 rounded">
          <h3 className="font-bold text-yellow-800 mb-2">MongoDB Connection Status:</h3>
          <p className="text-yellow-700 text-sm">
            Check your browser console and terminal for connection logs when testing.
          </p>
          <p className="text-yellow-700 text-sm mt-2">
            <strong>Make sure MongoDB is running:</strong><br/>
            • If using local MongoDB: <code className="bg-yellow-200 px-2 py-1 rounded">mongod</code><br/>
            • If using MongoDB Atlas: Check your connection string in .env.local
          </p>
        </div>
      </main>
    </div>
  )
}