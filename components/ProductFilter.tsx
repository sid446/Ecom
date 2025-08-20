import { Search, Filter, Grid, List } from 'lucide-react'

interface Props {
  searchTerm: string
  setSearchTerm: (val: string) => void
  filterByStock: 'all' | 'in-stock' | 'low-stock'
  setFilterByStock: (val: 'all' | 'in-stock' | 'low-stock') => void
  sortBy: 'name' | 'price-low' | 'price-high' | 'stock'
  setSortBy: (val: 'name' | 'price-low' | 'price-high' | 'stock') => void
  viewMode: 'grid' | 'list'
  setViewMode: (val: 'grid' | 'list') => void
  loading: boolean
  productsCount: number
  filteredCount: number
}

export default function ProductFilters({
  searchTerm, setSearchTerm,
  filterByStock, setFilterByStock,
  sortBy, setSortBy,
  viewMode, setViewMode,
  loading, productsCount, filteredCount
}: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-900 h-4 w-4" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full placeholder:black text-black pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={filterByStock}
              onChange={(e) => setFilterByStock(e.target.value as any)}
              className="border border-gray-300 text-black rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Products</option>
              <option value="in-stock">In Stock</option>
              <option value="low-stock">Low Stock</option>
            </select>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="border border-gray-300 text-black rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="name">Sort by Name</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="stock">Stock Level</option>
          </select>

          {/* View Toggle */}
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 transition-colors ${
                viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'
              }`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 transition-colors ${
                viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {!loading && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            {searchTerm || filterByStock !== 'all' 
              ? `Showing ${filteredCount} of ${productsCount} products`
              : `${productsCount} products available`
            }
          </p>
        </div>
      )}
    </div>
  )
}
