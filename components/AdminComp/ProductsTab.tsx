// ProductsTab.tsx - Enhanced with better image handling
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Grid3X3, 
  List, 
  Edit, 
  Trash2, 
  Star, 
  MoreHorizontal,
  ImageIcon,
  AlertCircle
} from 'lucide-react';
import { Product } from './types';
import { api } from './api';
import { getOptimizedImageUrl } from './utils/cloudinartUtils';

interface ProductsTabProps {
  products: Product[];
  onProductUpdate: () => void;
  onEditProduct: (product: Product) => void;
  onCreateProduct: () => void;
}

const ProductsTab: React.FC<ProductsTabProps> = ({ 
  products, 
  onProductUpdate, 
  onEditProduct, 
  onCreateProduct 
}) => {
  const [localProducts, setLocalProducts] = useState(products);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    setLocalProducts(products);
  }, [products]);

  const filteredProducts = localProducts.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this product? This will also delete all associated images.')) {
      try {
        await api.deleteProduct(id);
        setLocalProducts(prev => prev.filter(p => p._id !== id));
        onProductUpdate();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product');
      }
    }
  };

  const categories = [...new Set(products.map(p => p.category))];

  // Enhanced image component with error handling
  const ProductImage = ({ src, alt, className }: { src: string; alt: string; className: string }) => {
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    return (
      <div className={`${className} relative overflow-hidden bg-gray-700`}>
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-gray-500 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        )}
        {imageError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
            <ImageIcon className="h-8 w-8 mb-2" />
            <span className="text-xs">Image not found</span>
          </div>
        ) : (
          <img 
            src={src}
            alt={alt}
            className={`w-full h-full object-cover transition-opacity duration-200 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
            onLoad={() => setImageLoading(false)}
            onError={() => {
              setImageError(true);
              setImageLoading(false);
            }}
          />
        )}
      </div>
    );
  };

  const ProductGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredProducts.map((product) => {
        const totalStock = product.stock ? Object.values(product.stock).reduce((sum, val) => sum + (val || 0), 0) : 0;
        const hasImages = product.imagefront || product.imageback || (product.allimages && product.allimages.length > 0);
        const discountedPrice = product.offer ? product.price - (product.price * product.offer / 100) : product.price;

        return (
          <div key={product._id} className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden hover:border-gray-600 transition-all duration-300 group hover:scale-105">
            <div className="relative">
              <ProductImage
                src={product.imagefront}
                alt={product.name}
                className="w-full h-48"
              />
              
              {/* Stock Status Badge */}
              <div className={`absolute top-3 left-3 px-2 py-1 rounded-lg text-xs font-medium backdrop-blur-sm ${
                totalStock === 0 ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                totalStock <= 5 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                'bg-green-500/20 text-green-400 border border-green-500/30'
              }`}>
                {totalStock === 0 ? 'Out of Stock' : `${totalStock} in stock`}
              </div>

              {/* Offer Badge - ADDED */}
              {typeof product.offer === 'number' && product.offer > 0 && (
                <div className="absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-medium backdrop-blur-sm bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  {product.offer}% OFF
                </div>
              )}

              {/* Image Status Badge */}
              {!hasImages && (
                <div className="absolute top-3 right-3 p-1 bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-lg backdrop-blur-sm">
                  <AlertCircle className="h-4 w-4" />
                </div>
              )}

              {/* Action Menu */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                {hasImages && (
                  <button className="p-2 bg-gray-900/80 backdrop-blur-sm rounded-lg">
                    <MoreHorizontal className="h-4 w-4 text-white" />
                  </button>
                )}
              </div>

              {/* Image Count Indicator */}
              {product.allimages && product.allimages.filter(img => img).length > 0 && (
                <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/50 backdrop-blur-sm text-white text-xs rounded-lg">
                  {product.allimages.filter(img => img).length + 2} images
                </div>
              )}
            </div>
            
            <div className="p-5">
              <div className="mb-3">
                <h3 className="text-white font-semibold text-lg line-clamp-1">{product.name}</h3>
                <p className="text-gray-400 text-sm line-clamp-2 mt-1">{product.description}</p>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                {/* Updated Price Display */}
                {typeof product.offer === 'number' && product.offer > 0 ? (
                  <div className="flex items-baseline space-x-2">
                    <span className="text-xl font-bold text-white">
                      ₹{Math.round(discountedPrice).toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      ₹{product.price?.toLocaleString()}
                    </span>
                  </div>
                ) : (
                  <span className="text-xl font-bold text-white">₹{product.price?.toLocaleString()}</span>
                )}
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-gray-400 text-sm">{product.rating || 0}</span>
                </div>
              </div>

              {/* Warning for missing images */}
              {!hasImages && (
                <div className="mb-3 p-2 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                  <div className="flex items-center gap-2 text-orange-400">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span className="text-xs">Missing product images</span>
                  </div>
                </div>
              )}
              
              <div className="flex gap-2">
                <button
                  onClick={() => onEditProduct(product)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteProduct(product._id)}
                  className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const ProductList = () => (
    <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-800/50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Product</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Category</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Price</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Offer</th> {/* ADDED */}
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Stock</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Images</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Rating</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredProducts.map((product) => {
              const totalStock = product.stock ? Object.values(product.stock).reduce((sum, val) => sum + (val || 0), 0) : 0;
              const imageCount = (product.imagefront ? 1 : 0) + (product.imageback ? 1 : 0) + (product.allimages ? product.allimages.filter(img => img).length : 0);
              const discountedPrice = product.offer ? product.price - (product.price * product.offer / 100) : product.price;

              return (
                <tr key={product._id} className="hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-600">
                        <ProductImage
                          src={product.imagefront}
                          alt={product.name}
                          className="w-full h-full"
                        />
                      </div>
                      <div>
                        <p className="text-white font-medium">{product.name}</p>
                        <p className="text-gray-400 text-sm line-clamp-1">{product.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-gray-700/50 text-gray-300 text-sm rounded-lg">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-white font-medium">
                    {typeof product.offer === 'number' && product.offer > 0 ? (
                      <div className="flex flex-col space-y-1">
                        <span className="text-white">₹{Math.round(discountedPrice).toLocaleString()}</span>
                        <span className="text-gray-500 text-xs line-through">₹{product.price?.toLocaleString()}</span>
                      </div>
                    ) : (
                      <span className="text-white">₹{product.price?.toLocaleString()}</span>
                    )}
                  </td>
                  <td className="px-6 py-4"> {/* ADDED */}
                    {typeof product.offer === 'number' && product.offer > 0 ? (
                      <span className="px-3 py-1 rounded-lg text-xs font-medium bg-purple-500/20 text-purple-400">
                        {product.offer}%
                      </span>
                    ) : (
                      <span className="text-gray-400 text-sm">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                      totalStock === 0 ? 'bg-red-500/20 text-red-400' :
                      totalStock <= 5 ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {totalStock} units
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 text-gray-400" />
                      <span className={`text-sm ${imageCount === 0 ? 'text-orange-400' : 'text-gray-300'}`}>
                        {imageCount} image{imageCount !== 1 ? 's' : ''}
                      </span>
                      {imageCount === 0 && <AlertCircle className="h-4 w-4 text-orange-400" />}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-gray-300">{product.rating || 0}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onEditProduct(product)}
                        className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Product Management</h2>
          <p className="text-gray-400">Manage your inventory and product listings</p>
        </div>
        <button
          onClick={onCreateProduct}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
        >
          <Plus className="h-5 w-5" />
          Add New Product
        </button>
      </div>

      {/* Filters */}
      <div className="bg-gray-800/30 backdrop-blur-sm p-6 rounded-2xl border border-gray-700">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search products by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-48"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            
            <div className="flex bg-gray-700/30 rounded-xl p-1 border border-gray-600">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Products Display */}
      {viewMode === 'grid' ? <ProductGrid /> : <ProductList />}
    </div>
  );
};

export default ProductsTab;