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
  Upload
} from 'lucide-react';

// API functions
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
          console.log(usersData)
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

  // Overview Tab Component
  const OverviewTab = () => {
    const stats = {
      totalProducts: products.length,
      totalOrders: orders.length,
      totalUsers: users.length,
      totalRevenue: orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0)
    };

    const recentOrders = orders.slice(0, 5);

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 hover:border-gray-600 transition-all duration-200">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-600/20">
                <Package className="h-8 w-8 text-blue-400" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-400">Total Products</h3>
                <p className="text-2xl font-bold text-white">{stats.totalProducts}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 hover:border-gray-600 transition-all duration-200">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-600/20">
                <ShoppingCart className="h-8 w-8 text-green-400" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-400">Total Orders</h3>
                <p className="text-2xl font-bold text-white">{stats.totalOrders}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 hover:border-gray-600 transition-all duration-200">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-600/20">
                <Users className="h-8 w-8 text-purple-400" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-400">Total Users</h3>
                <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 hover:border-gray-600 transition-all duration-200">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-orange-600/20">
                <TrendingUp className="h-8 w-8 text-orange-400" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-400">Total Revenue</h3>
                <p className="text-2xl font-bold text-white">₹{stats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white">Recent Orders</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-750">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-750 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      #{order.orderId || order._id?.slice(-6)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {order.user?.name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        order.status === 'delivered' ? 'bg-green-600/20 text-green-400 border border-green-600/30' :
                        order.status === 'pending' ? 'bg-yellow-600/20 text-yellow-400 border border-yellow-600/30' :
                        'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      ₹{order.totalPrice?.toLocaleString()}
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

  // Products Tab Component
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
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Products Management</h2>
          <button
            onClick={() => {
              setEditingProduct(null);
              setShowProductModal(true);
            }}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center gap-2 shadow-lg"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </button>
        </div>

        {/* Filters */}
        <div className="bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-750">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {filteredProducts.map((product) => {
                  const totalStock = product.stock ? 
                    Object.values(product.stock).reduce((sum, val) => sum + (val || 0), 0) : 0;
                  
                  return (
                    <tr key={product._id} className="hover:bg-gray-750 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img 
                            src={product.imagefront} 
                            alt={product.name}
                            className="h-10 w-10 rounded-lg object-cover mr-4 border border-gray-600"
                          />
                          <div>
                            <div className="text-sm font-medium text-white">{product.name}</div>
                            <div className="text-sm text-gray-400">
                              {product.description?.substring(0, 50)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {product.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        ₹{product.price?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${
                          totalStock === 0 ? 'text-red-400' :
                          totalStock <= 5 ? 'text-yellow-400' :
                          'text-green-400'
                        }`}>
                          {totalStock} units
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setEditingProduct(product);
                              setShowProductModal(true);
                            }}
                            className="text-blue-400 hover:text-blue-300 p-2 rounded-lg hover:bg-gray-700 transition-colors duration-150"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product._id)}
                            className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-gray-700 transition-colors duration-150"
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
      </div>
    );
  };

  // Orders Tab Component
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

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Orders Management</h2>

        <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-750">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {localOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-750 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      #{order.orderId || order._id?.slice(-6)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">{order.user?.name || 'Unknown'}</div>
                      <div className="text-sm text-gray-400">{order.user?.email}</div>
                      <div className="text-sm text-gray-400">{order.shippingAddress?.address}</div>
                      <div className="text-sm text-gray-400">{order.shippingAddress?.city}</div>
                      <div className="text-sm text-gray-400">{order.shippingAddress?.postalCode}</div>
                      <div className="text-sm text-gray-400">{order.shippingAddress?.country}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {order.orderItems?.length || 0} items
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      ₹{order.totalPrice?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                        className={`px-3 py-1 text-xs font-semibold rounded-lg bg-gray-700 border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          order.status === 'delivered' ? 'text-green-400 border-green-600/30' :
                          order.status === 'pending' ? 'text-yellow-400 border-yellow-600/30' :
                          order.status === 'processing' ? 'text-blue-400 border-blue-600/30' :
                          'text-gray-300 border-gray-600'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-400 hover:text-blue-300 p-2 rounded-lg hover:bg-gray-700 transition-colors duration-150">
                        <Eye className="h-4 w-4" />
                      </button>
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
        <h2 className="text-2xl font-bold text-white">Users Management</h2>
        
        <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-750">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Orders
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {users.map((user) => {
                  const userOrders = orders.filter(order => order.user?._id === user._id);
                  return (
                    <tr key={user._id} className="hover:bg-gray-750 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">{user.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {user.phone || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {userOrders.length} orders
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {new Date(user.createdAt).toLocaleDateString()}
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

  // Product Modal Component
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
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-screen overflow-y-auto border border-gray-700 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-white">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h3>
            <button
              onClick={() => setShowProductModal(false)}
              className="text-gray-400 hover:text-white hover:bg-gray-700 p-2 rounded-lg transition-colors duration-150"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Product Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-150"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-150"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Price (₹)
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-150"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-150"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="TShirts">T-Shirts</option>
                  <option value="SweatShirts">Sweatshirts</option>
                  <option value="Hoodies">Hoodies</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Front Image URL
                </label>
                <input
                  type="url"
                  value={formData.imagefront}
                  onChange={(e) => setFormData({ ...formData, imagefront: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-150"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Back Image URL
                </label>
                <input
                  type="url"
                  value={formData.imageback}
                  onChange={(e) => setFormData({ ...formData, imageback: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-150"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Additional Images
              </label>
              {formData.allimages.map((image, index) => (
                <div key={index} className="flex gap-2 mb-3">
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => updateImageField(index, e.target.value)}
                    placeholder="Image URL"
                    className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-150"
                  />
                  {formData.allimages.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImageField(index)}
                      className="px-3 py-3 text-red-400 hover:text-red-300 hover:bg-gray-700 rounded-lg transition-colors duration-150"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addImageField}
                className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-700 transition-colors duration-150"
              >
                <Plus className="h-4 w-4" />
                Add Image
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Stock Quantities
              </label>
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">S</label>
                  <input
                    type="number"
                    value={formData.stock.S}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      stock: { ...formData.stock, S: e.target.value }
                    })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-150"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">M</label>
                  <input
                    type="number"
                    value={formData.stock.M}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      stock: { ...formData.stock, M: e.target.value }
                    })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-150"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">L</label>
                  <input
                    type="number"
                    value={formData.stock.L}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      stock: { ...formData.stock, L: e.target.value }
                    })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-150"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">XL</label>
                  <input
                    type="number"
                    value={formData.stock.XL}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      stock: { ...formData.stock, XL: e.target.value }
                    })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-150"
                    min="0"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-700">
              <button
                type="button"
                onClick={() => setShowProductModal(false)}
                className="px-6 py-3 text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-150"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center gap-2 shadow-lg"
              >
                <Save className="h-4 w-4" />
                {editingProduct ? 'Update' : 'Create'} Product
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="bg-gray-800/80 backdrop-blur-sm shadow-xl border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-gray-400 mt-1">Manage your e-commerce store</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-400 bg-gray-700/50 px-3 py-2 rounded-lg">
                Last updated: {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-gray-800/60 backdrop-blur-sm shadow-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: TrendingUp },
              { id: 'products', name: 'Products', icon: Package },
              { id: 'orders', name: 'Orders', icon: ShoppingCart },
              { id: 'users', name: 'Users', icon: Users },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-600"></div>
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 absolute top-0 left-0"></div>
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