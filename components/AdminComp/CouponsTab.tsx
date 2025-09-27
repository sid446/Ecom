// File: components/admin/CouponsTab.tsx
'use client'

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  Calendar,
  Percent,
  DollarSign,
  Users,
  Clock,
  Eye,
  Copy,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface Coupon {
  id: string;
  code: string;
  type: 'first_order' | 'minimum_amount';
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minimumAmount?: number;
  maxDiscount?: number;
  expiryDate?: string;
  usageLimit?: number;
  usedCount: number;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CouponFormData {
  code: string;
  type: 'first_order' | 'minimum_amount';
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minimumAmount: number;
  maxDiscount?: number;
  expiryDate?: string;
  usageLimit?: number;
  description: string;
}

const CouponsTab = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'first_order' | 'minimum_amount'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'expired'>('all');

  const [formData, setFormData] = useState<CouponFormData>({
    code: '',
    type: 'first_order',
    discountType: 'percentage',
    discountValue: 0,
    minimumAmount: 0,
    description: ''
  });

  // Load coupons
  const loadCoupons = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/coupons');
      const data = await response.json();
      
      if (data.success) {
        setCoupons(data.data || []);
      } else {
        console.error('Failed to load coupons:', data.message);
      }
    } catch (error) {
      console.error('Error loading coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingCoupon ? `/api/coupons/${editingCoupon.code}` : '/api/coupons';
      const method = editingCoupon ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        await loadCoupons();
        handleCloseModal();
        // Show success message
        console.log(editingCoupon ? 'Coupon updated successfully' : 'Coupon created successfully');
      } else {
        console.error('Error saving coupon:', data.message);
        alert(data.message);
      }
    } catch (error) {
      console.error('Error saving coupon:', error);
      alert('Failed to save coupon');
    }
  };

  // Handle delete
  const handleDelete = async (code: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    
    try {
      const response = await fetch(`/api/coupons/${code}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        await loadCoupons();
        console.log('Coupon deleted successfully');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error deleting coupon:', error);
      alert('Failed to delete coupon');
    }
  };

  // Handle edit
  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      type: coupon.type,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minimumAmount: coupon.minimumAmount || 0,
      maxDiscount: coupon.maxDiscount,
      expiryDate: coupon.expiryDate ? coupon.expiryDate.split('T')[0] : '',
      usageLimit: coupon.usageLimit,
      description: coupon.description
    });
    setShowModal(true);
  };

  // Handle create new
  const handleCreateNew = () => {
    setEditingCoupon(null);
    setFormData({
      code: '',
      type: 'first_order',
      discountType: 'percentage',
      discountValue: 0,
      minimumAmount: 0,
      description: ''
    });
    setShowModal(true);
  };

  // Handle close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCoupon(null);
    setFormData({
      code: '',
      type: 'first_order',
      discountType: 'percentage',
      discountValue: 0,
      minimumAmount: 0,
      description: ''
    });
  };

  // Copy coupon code
  const handleCopy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      // You could show a toast notification here
      console.log('Coupon code copied!');
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  // Filter coupons
  const filteredCoupons = coupons.filter(coupon => {
    const matchesSearch = coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         coupon.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || coupon.type === filterType;
    
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'active' && coupon.isActive) ||
      (filterStatus === 'expired' && !coupon.isActive);
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Format discount display
  const formatDiscount = (coupon: Coupon) => {
    if (coupon.discountType === 'percentage') {
      return `${coupon.discountValue}%`;
    } else {
      return `$${coupon.discountValue}`;
    }
  };

  // Check if coupon is expired
  const isExpired = (coupon: Coupon) => {
    if (!coupon.expiryDate) return false;
    return new Date(coupon.expiryDate) < new Date();
  };

  // Generate random coupon code
  const generateCouponCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, code: result }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Coupon Management</h1>
          <p className="text-gray-400">Create and manage promotional coupons</p>
        </div>
        <button
          onClick={handleCreateNew}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Create Coupon</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Coupons</p>
              <p className="text-2xl font-bold text-white">{coupons.length}</p>
            </div>
            <div className="bg-blue-500/20 p-3 rounded-lg">
              <Percent className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Coupons</p>
              <p className="text-2xl font-bold text-white">
                {coupons.filter(c => c.isActive && !isExpired(c)).length}
              </p>
            </div>
            <div className="bg-green-500/20 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Usage</p>
              <p className="text-2xl font-bold text-white">
                {coupons.reduce((sum, c) => sum + c.usedCount, 0)}
              </p>
            </div>
            <div className="bg-purple-500/20 p-3 rounded-lg">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Expired</p>
              <p className="text-2xl font-bold text-white">
                {coupons.filter(c => isExpired(c)).length}
              </p>
            </div>
            <div className="bg-red-500/20 p-3 rounded-lg">
              <XCircle className="w-6 h-6 text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search coupons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Types</option>
            <option value="first_order">First Order</option>
            <option value="minimum_amount">Minimum Amount</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>

      {/* Coupons Table */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-gray-600 rounded-full animate-pulse"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="text-left p-4 text-gray-300 font-semibold">Code</th>
                  <th className="text-left p-4 text-gray-300 font-semibold">Type</th>
                  <th className="text-left p-4 text-gray-300 font-semibold">Discount</th>
                  <th className="text-left p-4 text-gray-300 font-semibold">Usage</th>
                  <th className="text-left p-4 text-gray-300 font-semibold">Expiry</th>
                  <th className="text-left p-4 text-gray-300 font-semibold">Status</th>
                  <th className="text-left p-4 text-gray-300 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCoupons.map((coupon) => (
                  <tr key={coupon.id} className="border-t border-gray-700 hover:bg-gray-750">
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <code className="bg-gray-700 px-2 py-1 rounded text-blue-400 font-mono">
                          {coupon.code}
                        </code>
                        <button
                          onClick={() => handleCopy(coupon.code)}
                          className="text-gray-400 hover:text-white"
                          title="Copy code"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        coupon.type === 'first_order' 
                          ? 'bg-blue-500/20 text-blue-400' 
                          : 'bg-green-500/20 text-green-400'
                      }`}>
                        {coupon.type === 'first_order' ? 'First Order' : 'Min Amount'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="text-white">
                        {formatDiscount(coupon)}
                        {coupon.type === 'minimum_amount' && (
                          <div className="text-xs text-gray-400">
                            Min: ${coupon.minimumAmount}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-white">
                        {coupon.usedCount}{coupon.usageLimit && `/${coupon.usageLimit}`}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-white">
                        {coupon.expiryDate 
                          ? new Date(coupon.expiryDate).toLocaleDateString()
                          : 'No expiry'
                        }
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        isExpired(coupon)
                          ? 'bg-red-500/20 text-red-400'
                          : coupon.isActive
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {isExpired(coupon) ? 'Expired' : coupon.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(coupon)}
                          className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                          title="Edit coupon"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(coupon.code)}
                          className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                          title="Delete coupon"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredCoupons.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400">No coupons found</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal for Create/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-white mb-4">
              {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Coupon Code
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="COUPON123"
                    required
                    disabled={!!editingCoupon}
                  />
                  {!editingCoupon && (
                    <button
                      type="button"
                      onClick={generateCouponCode}
                      className="px-3 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg"
                      title="Generate random code"
                    >
                      🎲
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Coupon Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="first_order">First Order Only</option>
                  <option value="minimum_amount">Minimum Amount</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Discount Type
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData(prev => ({ ...prev, discountType: e.target.value as any }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Discount Value
                  </label>
                  <input
                    type="number"
                    value={formData.discountValue}
                    onChange={(e) => setFormData(prev => ({ ...prev, discountValue: parseFloat(e.target.value) }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder={formData.discountType === 'percentage' ? '10' : '5.00'}
                    step={formData.discountType === 'percentage' ? '1' : '0.01'}
                    min="0"
                    max={formData.discountType === 'percentage' ? '100' : undefined}
                    required
                  />
                </div>
              </div>

              {formData.type === 'minimum_amount' && (
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Minimum Amount ($)
                  </label>
                  <input
                    type="number"
                    value={formData.minimumAmount}
                    onChange={(e) => setFormData(prev => ({ ...prev, minimumAmount: parseFloat(e.target.value) }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="50.00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
              )}

              {formData.discountType === 'percentage' && (
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Max Discount ($) - Optional
                  </label>
                  <input
                    type="number"
                    value={formData.maxDiscount || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxDiscount: e.target.value ? parseFloat(e.target.value) : undefined }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="100.00"
                    step="0.01"
                    min="0"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Expiry Date - Optional
                  </label>
                  <input
                    type="date"
                    value={formData.expiryDate || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Usage Limit - Optional
                  </label>
                  <input
                    type="number"
                    value={formData.usageLimit || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, usageLimit: e.target.value ? parseInt(e.target.value) : undefined }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="100"
                    min="1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="Holiday special discount..."
                  rows={3}
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponsTab;

