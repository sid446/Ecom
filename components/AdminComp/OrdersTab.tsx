// OrdersTab.tsx
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Package, Calendar, Eye } from 'lucide-react';
import { Order } from './types';   
import { api } from './api';

interface OrdersTabProps {
  orders: Order[];
  onOrderUpdate: () => void;
}

const OrdersTab: React.FC<OrdersTabProps> = ({ orders, onOrderUpdate }) => {
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
      onOrderUpdate();
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

export default OrdersTab;