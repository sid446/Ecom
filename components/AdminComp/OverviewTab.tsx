// OverviewTab.tsx
import React from 'react';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign, 
  ArrowUp, 
  ArrowDown, 
  Star 
} from 'lucide-react';
import { Product, Order, User } from './types';

interface OverviewTabProps {
  products: Product[];
  orders: Order[];
  users: User[];
}

const OverviewTab: React.FC<OverviewTabProps> = ({ products, orders, users }) => {
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

export default OverviewTab;