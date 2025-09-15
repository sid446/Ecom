'use client'

import React, { useState, useEffect } from 'react';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  Edit, 
  Trash2, 
  Eye, 
  Plus,
  Search,
  Filter,
  X,
  Save,
  Upload,
  Menu,
  Home,
  Settings,
  Bell,
  ChevronDown,
  Grid3X3,
  List,
  Star,
  Calendar,
  DollarSign,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  Image as ImageIcon,
  AlertCircle,
  Check
} from 'lucide-react';

// API functions (keeping original)
const api = {
  async getProducts(params = {}) {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`/api/products?${query}`);
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  },
  
  async getOrders() {
    const response = await fetch('/api/orders');
    if (!response.ok) throw new Error('Failed to fetch orders');
    return response.json();
  },
  
  async getUsers() {
    const response = await fetch('/api/users');
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  },
  
  async createProduct(product: any) {
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    if (!response.ok) throw new Error('Failed to create product');
    return response.json();
  },
  
  async updateProduct(id: string, product: any) {
    const response = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    if (!response.ok) throw new Error('Failed to update product');
    return response.json();
  },
  
  async deleteProduct(id: string) {
    const response = await fetch(`/api/products/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete product');
    return response.json();
  },
  
  async updateOrderStatus(id: string, status: string) {
    const response = await fetch(`/api/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!response.ok) throw new Error('Failed to update order status');
    return response.json();
  }
};

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  imagefront: string;
  imageback: string;
  allimages: string[];
  stock: { S: number; M: number; L: number; XL: number };
  category: string;
  rating?: number;
  numOfReviews?: number;
  reviews?: any[];
}

interface Order {
  _id: string;
  orderId?: string;
  user?: { _id: string; name: string; email: string; };
  orderItems?: any[];
  totalPrice: number;
  status: string;
  createdAt: string;
  shippingAddress?:{
    address: string;
    city: string;
    postalCode: string;
    country: string;
  }
}

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewMode, setViewMode] = useState('grid');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Load initial data
  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'overview' || activeTab === 'products') {
        const productsData = await api.getProducts();
        setProducts(productsData.data || productsData);
      }
      if (activeTab === 'overview' || activeTab === 'orders') {
        const ordersData = await api.getOrders();
        setOrders(ordersData);
      }
      if (activeTab === 'overview' || activeTab === 'users') {
        try {
          const usersData = await api.getUsers();
          setUsers(usersData);
        } catch (error) {
          console.log('Users endpoint not available yet');
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setLoading(false);
  };

  // Modern Sidebar Navigation
  const Sidebar = () => {
    const menuItems = [
      { id: 'overview', name: 'Overview', icon: TrendingUp, color: 'text-blue-400' },
      { id: 'products', name: 'Products', icon: Package, color: 'text-purple-400' },
      { id: 'orders', name: 'Orders', icon: ShoppingCart, color: 'text-green-400' },
      { id: 'users', name: 'Users', icon: Users, color: 'text-orange-400' },
    ];

    return (
      <aside className={`fixed left-0 top-0 h-full bg-gray-900/95 backdrop-blur-xl border-r border-gray-800 transition-all duration-300 z-40 ${
        sidebarOpen ? 'w-72' : 'w-20'
      }`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          {sidebarOpen && (
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Admin Portal
              </h1>
              <p className="text-sm text-gray-400 mt-1">E-commerce Dashboard</p>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            <Menu className="h-5 w-5 text-gray-300" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-gray-800 text-white shadow-lg' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? item.color : 'text-gray-500'} transition-colors`} />
                {sidebarOpen && (
                  <span className="font-medium">{item.name}</span>
                )}
                {isActive && sidebarOpen && (
                  <div className="ml-auto w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
                )}
              </button>
            );
          })}
        </nav>

        {sidebarOpen && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-4 rounded-xl border border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
                  <Settings className="h-4 w-4 text-gray-300" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Admin User</p>
                  <p className="text-xs text-gray-400">admin@store.com</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </aside>
    );
  };

  // Modern Top Header
  const Header = () => {
    return (
      <header className={`fixed top-0 right-0 h-20 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800 z-30 transition-all duration-300 ${
        sidebarOpen ? 'left-72' : 'left-20'
      }`}>
        <div className="flex items-center justify-between h-full px-8">
          <div>
            <h2 className="text-2xl font-bold text-white capitalize">{activeTab}</h2>
            <p className="text-gray-400 text-sm">
              {activeTab === 'overview' && 'Dashboard overview and analytics'}
              {activeTab === 'products' && 'Manage your product inventory'}
              {activeTab === 'orders' && 'Track and manage customer orders'}
              {activeTab === 'users' && 'View and manage user accounts'}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button className="p-3 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors relative">
                <Bell className="h-5 w-5 text-gray-300" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              </button>
            </div>
            
            <div className="flex items-center gap-3 px-4 py-2 bg-gray-800 rounded-xl">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-medium">A</span>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-white">Admin</p>
                <p className="text-xs text-gray-400">Super Admin</p>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
      </header>
    );
  };

  // Enhanced Overview Tab
  const OverviewTab = () => {
    const stats = [
      {
        title: 'Total Products',
        value: products.length,
        icon: Package,
        color: 'from-blue-500 to-blue-600',
        change: '+12%',
        isPositive: true
      },
      {
        title: 'Total Orders',
        value: orders.length,
        icon: ShoppingCart,
        color: 'from-green-500 to-green-600',
        change: '+8%',
        isPositive: true
      },
      {
        title: 'Total Users',
        value: users.length,
        icon: Users,
        color: 'from-purple-500 to-purple-600',
        change: '+15%',
        isPositive: true
      },
      {
        title: 'Revenue',
        value: `₹${orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0).toLocaleString()}`,
        icon: DollarSign,
        color: 'from-orange-500 to-orange-600',
        change: '+23%',
        isPositive: true
      }
    ];

    return (
      <div className="space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
                    stat.isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {stat.isPositive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                    {stat.change}
                  </div>
                </div>
                <div>
                  <h3 className="text-gray-400 text-sm font-medium">{stat.title}</h3>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Recent Orders</h3>
              <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">View All</button>
            </div>
            <div className="space-y-4">
              {orders.slice(0, 5).map((order) => (
                <div key={order._id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <ShoppingCart className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium">#{order.orderId || order._id?.slice(-6)}</p>
                      <p className="text-gray-400 text-sm">{order.user?.name || 'Unknown'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">₹{order.totalPrice?.toLocaleString()}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'delivered' ? 'bg-green-500/20 text-green-400' :
                      order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Top Products</h3>
              <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">View All</button>
            </div>
            <div className="space-y-4">
              {products.slice(0, 5).map((product) => {
                const totalStock = product.stock ? Object.values(product.stock).reduce((sum, val) => sum + (val || 0), 0) : 0;
                return (
                  <div key={product._id} className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl">
                    <img 
                      src={product.imagefront} 
                      alt={product.name}
                      className="w-12 h-12 rounded-xl object-cover border border-gray-600"
                    />
                    <div className="flex-1">
                      <p className="text-white font-medium">{product.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-gray-400 text-sm">{product.rating || 0}</span>
                        <span className="text-gray-500 text-sm">•</span>
                        <span className="text-gray-400 text-sm">{totalStock} in stock</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-medium">₹{product.price?.toLocaleString()}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Enhanced Products Tab
  const ProductsTab = () => {
    const [localProducts, setLocalProducts] = useState(products);

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
      if (confirm('Are you sure you want to delete this product?')) {
        try {
          await api.deleteProduct(id);
          setLocalProducts(prev => prev.filter(p => p._id !== id));
        } catch (error) {
          console.error('Error deleting product:', error);
          alert('Error deleting product');
        }
      }
    };

    const categories = [...new Set(products.map(p => p.category))];

    return (
      <div className="space-y-6">
        {/* Enhanced Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Product Management</h2>
            <p className="text-gray-400">Manage your inventory and product listings</p>
          </div>
          <button
            onClick={() => {
              setEditingProduct(null);
              setShowProductModal(true);
            }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            <Plus className="h-5 w-5" />
            Add New Product
          </button>
        </div>

        {/* Enhanced Filters */}
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
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const totalStock = product.stock ? Object.values(product.stock).reduce((sum, val) => sum + (val || 0), 0) : 0;
              
              return (
                <div key={product._id} className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden hover:border-gray-600 transition-all duration-300 group hover:scale-105">
                  <div className="relative">
                    <img 
                      src={product.imagefront} 
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <div className="relative">
                        <button className="p-2 bg-gray-900/80 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="h-4 w-4 text-white" />
                        </button>
                      </div>
                    </div>
                    <div className={`absolute top-3 left-3 px-2 py-1 rounded-lg text-xs font-medium ${
                      totalStock === 0 ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      totalStock <= 5 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                      'bg-green-500/20 text-green-400 border border-green-500/30'
                    }`}>
                      {totalStock === 0 ? 'Out of Stock' : `${totalStock} in stock`}
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <div className="mb-3">
                      <h3 className="text-white font-semibold text-lg line-clamp-1">{product.name}</h3>
                      <p className="text-gray-400 text-sm line-clamp-2 mt-1">{product.description}</p>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-white">₹{product.price?.toLocaleString()}</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-gray-400 text-sm">{product.rating || 0}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingProduct(product);
                          setShowProductModal(true);
                        }}
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
        ) : (
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-800/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Product</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Price</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Stock</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Rating</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredProducts.map((product) => {
                    const totalStock = product.stock ? Object.values(product.stock).reduce((sum, val) => sum + (val || 0), 0) : 0;
                    
                    return (
                      <tr key={product._id} className="hover:bg-gray-800/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <img 
                              src={product.imagefront} 
                              alt={product.name}
                              className="w-12 h-12 rounded-xl object-cover border border-gray-600"
                            />
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
                          ₹{product.price?.toLocaleString()}
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
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-gray-300">{product.rating || 0}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => {
                                setEditingProduct(product);
                                setShowProductModal(true);
                              }}
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
        )}
      </div>
    );
  };

  // Enhanced Orders Tab
  const OrdersTab = () => {
    const [localOrders, setLocalOrders] = useState(orders);

    useEffect(() => {
      setLocalOrders(orders);
    }, [orders]);

    const handleStatusUpdate = async (orderId: string, newStatus: string) => {
      try {
        await api.updateOrderStatus(orderId, newStatus);
        setLocalOrders(prev => 
          prev.map(order => 
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
      } catch (error) {
        console.error('Error updating order status:', error);
        alert('Error updating order status');
      }
    };

    const getStatusColor = (status: string) => {
      switch(status) {
        case 'delivered': return 'bg-green-500/20 text-green-400 border-green-500/30';
        case 'shipped': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
        case 'processing': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
        case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
        case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
        default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">Order Management</h2>
            <p className="text-gray-400">Track and manage customer orders</p>
          </div>
        </div>

        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Order</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Customer</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Items</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Total</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Date</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {localOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                          <ShoppingCart className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-white font-medium">#{order.orderId || order._id?.slice(-6)}</p>
                          <p className="text-gray-400 text-sm">Order ID</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white font-medium">{order.user?.name || 'Unknown'}</p>
                        <p className="text-gray-400 text-sm">{order.user?.email}</p>
                        {order.shippingAddress && (
                          <div className="mt-1 text-xs text-gray-500">
                            <p>{order.shippingAddress.address}</p>
                            <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-300">{order.orderItems?.length || 0} items</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white font-semibold text-lg">₹{order.totalPrice?.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                        className={`px-3 py-2 text-sm font-medium rounded-xl border transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent ${getStatusColor(order.status)} bg-gray-700/50`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-300">{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center">
                        <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Users Tab Component
  const UsersTab = () => {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white">User Management</h2>
          <p className="text-gray-400">View and manage user accounts</p>
        </div>
        
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">User</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Contact</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Orders</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Joined</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {users.map((user) => {
                  const userOrders = orders.filter(order => order.user?._id === user._id);
                  return (
                    <tr key={user._id} className="hover:bg-gray-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                            <span className="text-white font-medium">{user.name.charAt(0)}</span>
                          </div>
                          <div>
                            <p className="text-white font-medium">{user.name}</p>
                            <p className="text-gray-400 text-sm">User ID: {user._id.slice(-6)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-gray-300">{user.email}</p>
                          <p className="text-gray-400 text-sm">{user.phone || 'No phone provided'}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <ShoppingCart className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-300">{userOrders.length} orders</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-300">{new Date(user.createdAt).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center">
                          <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                            <Eye className="h-4 w-4" />
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
      </div>
    );
  };

  // Enhanced Product Modal
  const ProductModal = () => {
    const [formData, setFormData] = useState({
      name: '',
      description: '',
      price: '',
      imagefront: '',
      imageback: '',
      allimages: [''],
      stock: { S: '', M: '', L: '', XL: '' },
      category: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
      if (editingProduct) {
        setFormData({
          name: editingProduct.name || '',
          description: editingProduct.description || '',
          price: editingProduct.price?.toString() || '',
          imagefront: editingProduct.imagefront || '',
          imageback: editingProduct.imageback || '',
          allimages: editingProduct.allimages || [''],
          stock: {
            S: editingProduct.stock?.S?.toString() || '',
            M: editingProduct.stock?.M?.toString() || '',
            L: editingProduct.stock?.L?.toString() || '',
            XL: editingProduct.stock?.XL?.toString() || ''
          },
          category: editingProduct.category || ''
        });
      } else {
        setFormData({
          name: '',
          description: '',
          price: '',
          imagefront: '',
          imageback: '',
          allimages: [''],
          stock: { S: '', M: '', L: '', XL: '' },
          category: ''
        });
      }
    }, [editingProduct]);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      
      try {
        const productData = {
          ...formData,
          price: parseFloat(formData.price),
          allimages: formData.allimages.filter(img => img.trim() !== ''),
          stock: {
            S: parseInt(formData.stock.S) || 0,
            M: parseInt(formData.stock.M) || 0,
            L: parseInt(formData.stock.L) || 0,
            XL: parseInt(formData.stock.XL) || 0,
          }
        };

        if (editingProduct) {
          await api.updateProduct(editingProduct._id, productData);
        } else {
          await api.createProduct(productData);
        }

        setShowProductModal(false);
        loadData();
      } catch (error) {
        console.error('Error saving product:', error);
        alert('Error saving product');
      } finally {
        setIsSubmitting(false);
      }
    };

    const addImageField = () => {
      setFormData({
        ...formData,
        allimages: [...formData.allimages, '']
      });
    };

    const removeImageField = (index: number) => {
      setFormData({
        ...formData,
        allimages: formData.allimages.filter((_, i) => i !== index)
      });
    };

    const updateImageField = (index: number, value: string) => {
      const newImages = [...formData.allimages];
      newImages[index] = value;
      setFormData({
        ...formData,
        allimages: newImages
      });
    };

    if (!showProductModal) return null;

    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-gray-800/90 backdrop-blur-xl rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-gray-700 shadow-2xl">
          {/* Modal Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-700">
            <div>
              <h3 className="text-2xl font-bold text-white">
                {editingProduct ? 'Edit Product' : 'Create New Product'}
              </h3>
              <p className="text-gray-400 mt-1">
                {editingProduct ? 'Update product information and inventory' : 'Add a new product to your store'}
              </p>
            </div>
            <button
              onClick={() => setShowProductModal(false)}
              className="p-3 bg-gray-700 hover:bg-gray-600 rounded-xl transition-colors"
            >
              <X className="h-6 w-6 text-gray-300" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
            <form onSubmit={handleSubmit} className="p-6 space-y-8">
              {/* Basic Information */}
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Package className="h-5 w-5 text-blue-400" />
                  Basic Information
                </h4>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-3">Product Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter product name..."
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-3">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="TShirts">T-Shirts</option>
                      <option value="SweatShirts">Sweatshirts</option>
                      <option value="Hoodies">Hoodies</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">Product Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    placeholder="Describe your product in detail..."
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">Price (₹)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="0.00"
                      className="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>

              {/* Images */}
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-purple-400" />
                  Product Images
                </h4>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-3">Front Image URL</label>
                    <input
                      type="url"
                      value={formData.imagefront}
                      onChange={(e) => setFormData({ ...formData, imagefront: e.target.value })}
                      placeholder="https://example.com/front-image.jpg"
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-3">Back Image URL</label>
                    <input
                      type="url"
                      value={formData.imageback}
                      onChange={(e) => setFormData({ ...formData, imageback: e.target.value })}
                      placeholder="https://example.com/back-image.jpg"
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">Additional Images</label>
                  <div className="space-y-3">
                    {formData.allimages.map((image, index) => (
                      <div key={index} className="flex gap-3">
                        <input
                          type="url"
                          value={image}
                          onChange={(e) => updateImageField(index, e.target.value)}
                          placeholder="https://example.com/additional-image.jpg"
                          className="flex-1 px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                        {formData.allimages.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeImageField(index)}
                            className="p-3 text-red-400 hover:text-red-300 hover:bg-gray-700/50 rounded-xl transition-colors"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addImageField}
                      className="flex items-center gap-2 px-4 py-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-xl transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      Add Another Image
                    </button>
                  </div>
                </div>
              </div>

              {/* Stock Management */}
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Package className="h-5 w-5 text-green-400" />
                  Stock Management
                </h4>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['S', 'M', 'L', 'XL'].map((size) => (
                    <div key={size} className="text-center">
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Size {size}
                      </label>
                      <input
                        type="number"
                        value={formData.stock[size as keyof typeof formData.stock]}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          stock: { ...formData.stock, [size]: e.target.value }
                        })}
                        placeholder="0"
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        min="0"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-4 pt-6 border-t border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-6 py-3 text-gray-300 bg-gray-700/50 rounded-xl hover:bg-gray-700 transition-colors font-medium"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      {editingProduct ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      {editingProduct ? 'Update Product' : 'Create Product'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Sidebar />
      <Header />
      
      {/* Main Content */}
      <main className={`transition-all duration-300 pt-20 ${sidebarOpen ? 'ml-72' : 'ml-20'} p-8`}>
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-gray-600 rounded-full animate-pulse"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'products' && <ProductsTab />}
            {activeTab === 'orders' && <OrdersTab />}
            {activeTab === 'users' && <UsersTab />}
          </>
        )}
      </main>

      {/* Product Modal */}
      <ProductModal />
    </div>
  );
};

export default AdminDashboard;