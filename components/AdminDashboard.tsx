'use client'

import React, { useState, useEffect, useCallback } from 'react';
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

// API functions (remains the same)
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

// Interfaces (remain the same)
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

// Define props interfaces for the components
interface OverviewTabProps {
  products: Product[];
  orders: Order[];
  users: User[];
}

interface ProductsTabProps {
  products: Product[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  onEditProduct: (product: Product | null) => void;
  onShowProductModal: (show: boolean) => void;
  onDeleteProduct: (id: string) => void;
}

interface OrdersTabProps {
  orders: Order[];
}

interface UsersTabProps {
  users: User[];
  orders: Order[];
}

interface ProductModalProps {
  showProductModal: boolean;
  setShowProductModal: (show: boolean) => void;
  editingProduct: Product | null;
  loadData: () => void;
}

// FIXED: Move components outside and use React.memo to prevent unnecessary re-renders
const OverviewTab = React.memo(({ products, orders, users }: OverviewTabProps) => {
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-black p-6 rounded-xl shadow-xl border border-gray-800">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-blue-500 bg-opacity-20">
                            <Package className="h-8 w-8 text-blue-400" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-400">Total Products</p>
                            <p className="text-2xl font-semibold text-white">{stats.totalProducts}</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-black p-6 rounded-xl shadow-xl border border-gray-800">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-green-500 bg-opacity-20">
                            <ShoppingCart className="h-8 w-8 text-green-400" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-400">Total Orders</p>
                            <p className="text-2xl font-semibold text-white">{stats.totalOrders}</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-black p-6 rounded-xl shadow-xl border border-gray-800">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-purple-500 bg-opacity-20">
                            <Users className="h-8 w-8 text-purple-400" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-400">Total Users</p>
                            <p className="text-2xl font-semibold text-white">{stats.totalUsers}</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-black p-6 rounded-xl shadow-xl border border-gray-800">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-yellow-500 bg-opacity-20">
                            <TrendingUp className="h-8 w-8 text-yellow-400" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-400">Revenue</p>
                            <p className="text-2xl font-semibold text-white">₹{stats.totalRevenue.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="bg-black rounded-xl shadow-xl border border-gray-800">
                <div className="px-6 py-4 border-b border-gray-800">
                    <h3 className="text-lg font-semibold text-white">Recent Orders</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-800">
                        <thead className="bg-gray-900">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Order ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Total</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                            </tr>
                        </thead>
                        <tbody className="bg-black divide-y divide-gray-800">
                            {recentOrders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-900">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                                        #{order.orderId || order._id.slice(-6)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                        {order.user?.name || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                        ₹{order.totalPrice.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                            order.status === 'delivered' 
                                                ? 'bg-green-100 text-green-800' 
                                                : order.status === 'pending'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-blue-100 text-blue-800'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
});

// FIXED: Use React.memo and useCallback for stable references
const ProductsTab = React.memo(({ 
    products, 
    searchTerm, 
    setSearchTerm, 
    selectedCategory, 
    setSelectedCategory,
    onEditProduct,
    onShowProductModal,
    onDeleteProduct
}: ProductsTabProps) => {
    // FIXED: Remove local state that was causing re-renders
    const filteredProducts = React.useMemo(() => {
        return products.filter(product => {
            const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                product.description?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === '' || product.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [products, searchTerm, selectedCategory]);

    const categories = React.useMemo(() => {
        return [...new Set(products.map(p => p.category))];
    }, [products]);

    const handleAddProduct = useCallback(() => {
        onEditProduct(null);
        onShowProductModal(true);
    }, [onEditProduct, onShowProductModal]);

    const handleEditProduct = useCallback((product: Product) => {
        onEditProduct(product);
        onShowProductModal(true);
    }, [onEditProduct, onShowProductModal]);
    
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Products Management</h2>
                <button
                    onClick={handleAddProduct}
                    className="bg-black border border-gray-700 text-white px-4 py-2 rounded-lg hover:border-gray-600 transition-all duration-200 flex items-center gap-2 shadow-lg"
                >
                    <Plus className="h-4 w-4" />
                    Add Product
                </button>
            </div>
            
            {/* Filters */}
            <div className="bg-black p-4 rounded-xl shadow-xl border border-gray-800">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent"
                            />
                        </div>
                    </div>
                    <div>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent"
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
            <div className="bg-black rounded-xl shadow-xl border border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-800">
                        <thead className="bg-gray-900">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Product</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Stock</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-black divide-y divide-gray-800">
                            {filteredProducts.map((product) => (
                                <tr key={product._id} className="hover:bg-gray-900">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <img 
                                                className="h-10 w-10 rounded-lg object-cover" 
                                                src={product.imagefront || '/placeholder.png'} 
                                                alt={product.name}
                                            />
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-white">{product.name}</div>
                                                <div className="text-sm text-gray-400">{product.description?.substring(0, 50)}...</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{product.category}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">₹{product.price}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                        {Object.values(product.stock || {}).reduce((a, b) => a + b, 0)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleEditProduct(product)}
                                            className="text-blue-400 hover:text-blue-300 mr-3"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => onDeleteProduct(product._id)}
                                            className="text-red-400 hover:text-red-300"
                                        >
                                            <Trash2 className="h-4 w-4" />
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
});

// FIXED: Use React.memo for other components too
const OrdersTab = React.memo(({ orders }: OrdersTabProps) => {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Orders Management</h2>
            <div className="bg-black rounded-xl shadow-xl border border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-800">
                        <thead className="bg-gray-900">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Order ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Total</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                            </tr>
                        </thead>
                        <tbody className="bg-black divide-y divide-gray-800">
                            {orders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-900">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                                        #{order.orderId || order._id.slice(-6)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                        {order.user?.name || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                        ₹{order.totalPrice.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                            order.status === 'delivered' 
                                                ? 'bg-green-100 text-green-800' 
                                                : order.status === 'pending'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-blue-100 text-blue-800'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
});

const UsersTab = React.memo(({ users, orders }: UsersTabProps) => {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Users Management</h2>
            <div className="bg-black rounded-xl shadow-xl border border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-800">
                        <thead className="bg-gray-900">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Phone</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Orders</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Joined</th>
                            </tr>
                        </thead>
                        <tbody className="bg-black divide-y divide-gray-800">
                            {users.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-900">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                                        {user.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                        {user.phone || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                        {orders.filter(order => order.user?._id === user._id).length}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
});

const ProductModal = ({ showProductModal, setShowProductModal, editingProduct, loadData }: ProductModalProps) => {
    if (!showProductModal) return null;
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-black border border-gray-800 rounded-xl p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold text-white mb-4">
                    {editingProduct ? 'Edit Product' : 'Add Product'}
                </h3>
                <p className="text-gray-400">Product modal content goes here...</p>
                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={() => setShowProductModal(false)}
                        className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => setShowProductModal(false)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

// FIXED: Main component with stable callback references
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

    // FIXED: Use useCallback to create stable function references
    const handleDeleteProduct = useCallback(async (id: string) => {
        if (confirm('Are you sure you want to delete this product?')) {
            try {
                await api.deleteProduct(id);
                setProducts(prev => prev.filter(p => p._id !== id));
            } catch (error) {
                console.error('Error deleting product:', error);
                alert('Error deleting product');
            }
        }
    }, []);

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

    return (
        <div className="min-h-screen bg-black">
            {/* Header */}
            <header className="bg-black shadow-xl border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div className="flex items-center">
                            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                        </div>
                    </div>
                </div>
            </header>

            {/* Navigation Tabs */}
            <nav className="bg-black shadow-lg border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex space-x-8">
                        {[
                            { id: 'overview', label: 'Overview', icon: TrendingUp },
                            { id: 'products', label: 'Products', icon: Package },
                            { id: 'orders', label: 'Orders', icon: ShoppingCart },
                            { id: 'users', label: 'Users', icon: Users },
                        ].map(({ id, label, icon: Icon }) => (
                            <button
                                key={id}
                                onClick={() => setActiveTab(id)}
                                className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 ${
                                    activeTab === id
                                        ? 'border-blue-500 text-blue-400'
                                        : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                                } transition-colors duration-200`}
                            >
                                <Icon className="h-5 w-5 mr-2" />
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <>
                        {activeTab === 'overview' && <OverviewTab products={products} orders={orders} users={users} />}
                        {activeTab === 'products' && (
                            <ProductsTab 
                                products={products}
                                searchTerm={searchTerm}
                                setSearchTerm={setSearchTerm}
                                selectedCategory={selectedCategory}
                                setSelectedCategory={setSelectedCategory}
                                onEditProduct={setEditingProduct}
                                onShowProductModal={setShowProductModal}
                                onDeleteProduct={handleDeleteProduct}
                            />
                        )}
                        {activeTab === 'orders' && <OrdersTab orders={orders} />}
                        {activeTab === 'users' && <UsersTab users={users} orders={orders} />}
                    </>
                )}
            </main>

            {/* Product Modal */}
            <ProductModal 
                showProductModal={showProductModal}
                setShowProductModal={setShowProductModal}
                editingProduct={editingProduct}
                loadData={loadData}
            />
        </div>
    );
};

export default AdminDashboard;