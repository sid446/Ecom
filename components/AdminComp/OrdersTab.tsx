// OrdersTab.tsx
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Package, Calendar, Eye, Truck } from 'lucide-react';
import { Order } from './types';   
// Assuming the api.ts file now includes the updateOrder function
import { api } from './api'; 

interface OrdersTabProps {
  orders: Order[];
  onOrderUpdate: () => void;
}

const OrdersTab: React.FC<OrdersTabProps> = ({ orders, onOrderUpdate }) => {
  const [localOrders, setLocalOrders] = useState(orders);
  // State to manage the currently edited tracking link: { orderId: string, track: string | null } | null
  const [trackEdit, setTrackEdit] = useState<{ orderId: string, track: string | null } | null>(null);

  useEffect(() => {
    setLocalOrders(orders);
  }, [orders]);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      // Assuming updateOrderStatus uses a PUT to /api/orders/:id with { status: newStatus }
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

  // --- Handle Tracking Link Update (uses api.updateOrder) ---
  const handleTrackUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackEdit) return;

    try {
      // Call the generic updateOrder function implemented in api.ts
      await api.updateOrder(trackEdit.orderId, { track: trackEdit.track || null }); 
      
      // Update local state for immediate UI reflection
      setLocalOrders(prev => 
        prev.map(order => 
          order._id === trackEdit.orderId ? { ...order, track: trackEdit.track } : order
        )
      );
      setTrackEdit(null); // Close the modal
      onOrderUpdate(); // Trigger parent refresh if needed
    } catch (error) {
      console.error('Error updating tracking link:', error);
      alert('Error updating tracking link');
    }
  };
  // -------------------------------------------------------------

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
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Track ID</th>
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
                    <div className="flex flex-col items-center gap-2">
                      <button 
                        onClick={() => setTrackEdit({ orderId: order._id, track: order.track || '' })}
                        className={`p-2 rounded-lg transition-colors text-white ${order.track ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-600 hover:bg-gray-700'}`}
                        title={order.track ? "Edit Tracking Link" : "Add Tracking Link"}
                      >
                        <Truck className="h-4 w-4" />
                      </button>
                      {order.track && (
                        <a 
                          href={order.track} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline"
                          title={order.track}
                        >
                          View Track
                        </a>
                      )}
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

      {/* --- TRACKING LINK MODAL --- */}
      {trackEdit && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md border border-gray-700 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Truck className="h-5 w-5 text-indigo-400" />
              {trackEdit.track ? 'Edit Tracking Link' : 'Add Tracking Link'}
            </h3>
            <form onSubmit={handleTrackUpdate}>
              <label htmlFor="tracking-link" className="block text-sm font-medium text-gray-300 mb-2">
                Tracking URL
              </label>
              <input
                id="tracking-link"
                type="url"
                value={trackEdit.track || ''}
                onChange={(e) => setTrackEdit(prev => prev ? ({ ...prev, track: e.target.value }) : null)}
                className="w-full px-4 py-3 mb-2 border border-gray-600 rounded-lg bg-gray-700/50 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                placeholder="https://tracking.example.com/12345"
              />
              <p className="text-xs text-gray-400 mb-4">Leave blank to remove tracking link</p>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setTrackEdit(null)}
                  className="px-5 py-2 text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium"
                >
                  Save Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersTab;