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
  // State to manage the currently viewed order details
  const [viewOrder, setViewOrder] = useState<Order | null>(null);

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
          order._id === trackEdit.orderId ? { ...order, track: trackEdit.track || undefined } : order
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
                      <button 
                        onClick={() => setViewOrder(order)}
                        className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        title="View Order Details"
                      >
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

      {/* --- ORDER DETAILS MODAL --- */}
      {viewOrder && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-4xl border border-gray-700 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <Eye className="h-6 w-6 text-blue-400" />
                Order Details - #{viewOrder.orderId || viewOrder._id?.slice(-6)}
              </h3>
              <button
                onClick={() => setViewOrder(null)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Information */}
              <div className="bg-gray-700/30 rounded-xl p-4">
                <h4 className="text-lg font-semibold text-white mb-3">Customer Information</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-400">Name:</span> <span className="text-white">{viewOrder.user?.name || 'Unknown'}</span></p>
                  <p><span className="text-gray-400">Email:</span> <span className="text-white">{viewOrder.user?.email || 'N/A'}</span></p>
                  <p><span className="text-gray-400">Phone:</span> <span className="text-white">{viewOrder.user?.phone || 'N/A'}</span></p>
                </div>
              </div>

              {/* Order Information */}
              <div className="bg-gray-700/30 rounded-xl p-4">
                <h4 className="text-lg font-semibold text-white mb-3">Order Information</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-400">Order ID:</span> <span className="text-white">#{viewOrder.orderId || viewOrder._id?.slice(-6)}</span></p>
                  <p><span className="text-gray-400">Status:</span> <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(viewOrder.status)}`}>{(viewOrder.status || '').charAt(0).toUpperCase() + (viewOrder.status || '').slice(1).replace('_', ' ')}</span></p>
                  <p><span className="text-gray-400">Date:</span> <span className="text-white">{new Date(viewOrder.createdAt).toLocaleString()}</span></p>
                  {viewOrder.track && (
                    <p><span className="text-gray-400">Tracking:</span> <a href={viewOrder.track} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 hover:underline">View Tracking</a></p>
                  )}
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            {viewOrder.shippingAddress && (
              <div className="bg-gray-700/30 rounded-xl p-4 mt-6">
                <h4 className="text-lg font-semibold text-white mb-3">Shipping Address</h4>
                <div className="text-sm text-gray-300">
                  <p>{viewOrder.shippingAddress.address}</p>
                  <p>{viewOrder.shippingAddress.city}, {viewOrder.shippingAddress.postalCode}</p>
                  <p>{viewOrder.shippingAddress.country}</p>
                </div>
              </div>
            )}

            {/* Order Items */}
            <div className="bg-gray-700/30 rounded-xl p-4 mt-6">
              <h4 className="text-lg font-semibold text-white mb-3">Order Items</h4>
              <div className="space-y-4">
                {viewOrder.orderItems?.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-600/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-500 rounded-lg flex items-center justify-center">
                        <Package className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{item.name}</p>
                        <p className="text-gray-400 text-sm">Size: {item.size} • Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                      <p className="text-gray-400 text-sm">₹{item.price.toFixed(2)} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-gray-700/30 rounded-xl p-4 mt-6">
              <h4 className="text-lg font-semibold text-white mb-3">Order Summary</h4>
              <div className="space-y-2 text-sm">
                {viewOrder.originalAmount && viewOrder.originalAmount > viewOrder.totalPrice && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Original Amount:</span>
                    <span className="text-gray-300 line-through">₹{viewOrder.originalAmount.toFixed(2)}</span>
                  </div>
                )}
                {viewOrder.couponDiscount && viewOrder.couponDiscount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Coupon Discount ({viewOrder.couponCode}):</span>
                    <span className="text-green-400">-₹{viewOrder.couponDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-lg pt-2 border-t border-gray-600">
                  <span className="text-white">Total:</span>
                  <span className="text-white">₹{viewOrder.totalPrice?.toFixed(2) || '0.00'}</span>
                </div>
                {viewOrder.paymentMethod && (
                  <div className="flex justify-between text-sm pt-1">
                    <span className="text-gray-400">Payment:</span>
                    <span className="text-white">{viewOrder.paymentMethod}</span>
                  </div>
                )}
                {viewOrder.isPaid !== undefined && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Paid:</span>
                    <span className={viewOrder.isPaid ? 'text-green-400' : 'text-red-400'}>
                      {viewOrder.isPaid ? 'Yes' : 'No'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersTab;