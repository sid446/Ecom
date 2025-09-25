'use client'

import React, { useState, useEffect } from 'react'
import {
  RotateCcw,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Search,
  Filter,
  Eye,
  Edit,
  Calendar,
  DollarSign,
  User,
  Phone,
  MapPin,
  MessageSquare,
  Truck,
  CheckCheck,
  X,
  Save,
  AlertTriangle,
  Info,
  FileText,
  Timer,
  CreditCard,
  Home,
  Camera,
  ExternalLink,
  ArrowRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

interface ReturnItem {
  orderItemId: string
  name: string
  size: string
  image?: string
  quantity: number
  price: number
  reason: string
  reasonDescription?: string
  images?: string[]
}

interface Timeline {
  status: string
  message: string
  timestamp: string
}

interface PickupAddress {
  address?: string
  city?: string
  postalCode?: string
  country?: string
  contactPhone?: string
}

interface Return {
  _id: string
  returnId: string
  order: {
    _id: string
    orderId: string
    orderItems: any[]
    totalPrice: number
    createdAt: string
    deliveredAt?: string
    shippingAddress: {
      address: string
      city: string
      postalCode: string
      country: string
    }
  }
  user: {
    _id: string
    name: string
    email: string
    phone?: string
  }
  returnItems: ReturnItem[]
  returnReason: string
  returnDescription?: string
  status: string
  returnAmount: number
  refundAmount?: number
  refundMethod?: string
  returnMethod: string
  pickupAddress?: PickupAddress
  adminNotes?: string
  createdAt: string
  requestedAt: string
  approvedAt?: string
  pickupScheduledAt?: string
  itemsReceivedAt?: string
  refundProcessedAt?: string
  completedAt?: string
  isWithinReturnWindow: boolean
  returnWindowExpiresAt?: string
  timeline: Timeline[]
}

interface ReturnsTabProps {}

const ReturnsTab: React.FC<ReturnsTabProps> = () => {
  const [returns, setReturns] = useState<Return[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedReturn, setSelectedReturn] = useState<Return | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [showQuickUpdate, setShowQuickUpdate] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [updating, setUpdating] = useState(false)
  const [newStatus, setNewStatus] = useState('')
  const [adminNotes, setAdminNotes] = useState('')
  const [refundAmount, setRefundAmount] = useState('')
  const [refundMethod, setRefundMethod] = useState('')

  const statusOptions = [
    { value: 'all', label: 'All Returns' },
    { value: 'requested', label: 'Pending Approval' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'pickup_scheduled', label: 'Pickup Scheduled' },
    { value: 'items_received', label: 'Items Received' },
    { value: 'items_inspected', label: 'Items Inspected' },
    { value: 'refund_processed', label: 'Refund Processed' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ]

  const statusUpdateOptions = [
    { value: 'approved', label: 'Approve Return', color: 'green', icon: CheckCircle },
    { value: 'rejected', label: 'Reject Return', color: 'red', icon: XCircle },
    { value: 'pickup_scheduled', label: 'Schedule Pickup', color: 'blue', icon: Truck },
    { value: 'items_received', label: 'Items Received', color: 'purple', icon: Package },
    { value: 'items_inspected', label: 'Items Inspected', color: 'indigo', icon: CheckCheck },
    { value: 'refund_processed', label: 'Process Refund', color: 'emerald', icon: DollarSign },
    { value: 'completed', label: 'Complete Return', color: 'green', icon: CheckCircle },
    { value: 'cancelled', label: 'Cancel Return', color: 'gray', icon: XCircle }
  ]

  const refundMethodOptions = [
    { value: 'original_payment', label: 'Original Payment Method' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'store_credit', label: 'Store Credit' },
    { value: 'cash', label: 'Cash' }
  ]

  const getNextPossibleStatuses = (currentStatus: string): string[] => {
    const statusFlow: Record<string, string[]> = {
      'requested': ['approved', 'rejected'],
      'approved': ['pickup_scheduled', 'cancelled'],
      'pickup_scheduled': ['items_received', 'cancelled'],
      'items_received': ['items_inspected', 'rejected'],
      'items_inspected': ['refund_processed', 'rejected'],
      'refund_processed': ['completed'],
      'rejected': ['approved'],
      'cancelled': ['approved'],
      'completed': []
    }
    return statusFlow[currentStatus as keyof typeof statusFlow] || []
  }

  useEffect(() => {
    fetchReturns()
  }, [])

  const fetchReturns = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/returns')
      if (response.ok) {
        const data = await response.json()
        setReturns(data)
      } else {
        console.error('Failed to fetch returns')
      }
    } catch (error) {
      console.error('Error fetching returns:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      requested: "bg-yellow-100 text-yellow-800 border-yellow-200",
      approved: "bg-green-100 text-green-800 border-green-200",
      rejected: "bg-red-100 text-red-800 border-red-200",
      pickup_scheduled: "bg-blue-100 text-blue-800 border-blue-200",
      items_received: "bg-purple-100 text-purple-800 border-purple-200",
      items_inspected: "bg-indigo-100 text-indigo-800 border-indigo-200",
      refund_processed: "bg-emerald-100 text-emerald-800 border-emerald-200",
      completed: "bg-green-100 text-green-800 border-green-200",
      cancelled: "bg-gray-100 text-gray-800 border-gray-200",
    }
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'requested':
        return <Clock className="w-4 h-4" />
      case 'approved':
        return <CheckCircle className="w-4 h-4" />
      case 'rejected':
        return <XCircle className="w-4 h-4" />
      case 'pickup_scheduled':
        return <Truck className="w-4 h-4" />
      case 'items_received':
        return <Package className="w-4 h-4" />
      case 'items_inspected':
        return <CheckCheck className="w-4 h-4" />
      case 'refund_processed':
        return <DollarSign className="w-4 h-4" />
      case 'completed':
        return <CheckCircle className="w-4 h-4" />
      case 'cancelled':
        return <XCircle className="w-4 h-4" />
      default:
        return <RefreshCw className="w-4 h-4" />
    }
  }

  const handleViewReturn = (returnItem: Return) => {
    setSelectedReturn(returnItem)
    setNewStatus('')
    setAdminNotes('')
    setRefundAmount(returnItem.refundAmount?.toString() || returnItem.returnAmount.toString())
    setRefundMethod(returnItem.refundMethod || 'original_payment')
    setShowModal(true)
  }

  const handleQuickStatusUpdate = async (returnId: string, status: string) => {
    setUpdating(true)
    try {
      const response = await fetch(`/api/returns/${returnId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })

      if (response.ok) {
        await fetchReturns()
        setShowQuickUpdate(null)
      } else {
        const error = await response.json()
        alert(`Failed to update return: ${error.error}`)
      }
    } catch (error) {
      console.error('Error updating return:', error)
      alert('Failed to update return status')
    } finally {
      setUpdating(false)
    }
  }

  const handleUpdateStatus = async () => {
    if (!selectedReturn || !newStatus) return

    setUpdating(true)
    try {
      const response = await fetch(`/api/returns/${selectedReturn.returnId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          adminNotes: adminNotes || undefined,
          refundAmount: refundAmount ? parseFloat(refundAmount) : undefined,
          refundMethod: refundMethod
        })
      })

      if (response.ok) {
        await fetchReturns()
        setShowModal(false)
        setSelectedReturn(null)
      } else {
        const error = await response.json()
        alert(`Failed to update return: ${error.error}`)
      }
    } catch (error) {
      console.error('Error updating return:', error)
      alert('Failed to update return status')
    } finally {
      setUpdating(false)
    }
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const filteredReturns = returns.filter(returnItem => {
    const matchesSearch = returnItem.returnId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         returnItem.order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         returnItem.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         returnItem.user.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || returnItem.status === statusFilter

    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-600 rounded-full animate-pulse"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Returns Management</h1>
          <p className="text-gray-400 mt-1">Manage customer return requests and processing</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search returns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm font-medium">Pending</p>
              <p className="text-2xl font-bold text-white">
                {returns.filter(r => r.status === 'requested').length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">In Progress</p>
              <p className="text-2xl font-bold text-white">
                {returns.filter(r => ['approved', 'pickup_scheduled', 'items_received', 'items_inspected'].includes(r.status)).length}
              </p>
            </div>
            <RefreshCw className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Completed</p>
              <p className="text-2xl font-bold text-white">
                {returns.filter(r => r.status === 'completed').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Rejected</p>
              <p className="text-2xl font-bold text-white">
                {returns.filter(r => r.status === 'rejected').length}
              </p>
            </div>
            <XCircle className="w-8 h-8 text-red-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Total Refunds</p>
              <p className="text-xl font-bold text-white">
                ₹{returns.reduce((sum, r) => sum + (r.refundAmount || 0), 0).toFixed(0)}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Returns Table */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Return Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Order Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Return Window
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {filteredReturns.map((returnItem) => (
                <tr key={returnItem._id} className="hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-start space-x-2">
                      <RotateCcw className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-medium text-white">
                          #{returnItem.returnId}
                        </div>
                        <div className="text-xs text-gray-400">
                          Method: {returnItem.returnMethod}
                        </div>
                        <div className="text-xs text-gray-400">
                          Items: {returnItem.returnItems.length}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-white">
                        {returnItem.user.name}
                      </div>
                      <div className="text-sm text-gray-400">
                        {returnItem.user.email}
                      </div>
                      {returnItem.user.phone && (
                        <div className="text-xs text-gray-500 flex items-center">
                          <Phone className="w-3 h-3 mr-1" />
                          {returnItem.user.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-white">
                        #{returnItem.order.orderId}
                      </div>
                      <div className="text-sm text-gray-400">
                        Total: ₹{returnItem.order.totalPrice.toFixed(2)}
                      </div>
                      {returnItem.order.deliveredAt && (
                        <div className="text-xs text-gray-500">
                          Delivered: {formatDate(returnItem.order.deliveredAt)}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        returnItem.isWithinReturnWindow 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        <Timer className="w-3 h-3 mr-1" />
                        {returnItem.isWithinReturnWindow ? 'Valid' : 'Expired'}
                      </div>
                      {returnItem.returnWindowExpiresAt && (
                        <div className="text-xs text-gray-400 mt-1">
                          Until: {formatDate(returnItem.returnWindowExpiresAt)}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-white">
                        ₹{returnItem.returnAmount.toFixed(2)}
                      </div>
                      {returnItem.refundAmount && (
                        <div className="text-sm text-green-400">
                          Refunded: ₹{returnItem.refundAmount.toFixed(2)}
                        </div>
                      )}
                      {returnItem.refundMethod && (
                        <div className="text-xs text-gray-400">
                          via {returnItem.refundMethod.replace('_', ' ')}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 relative">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(returnItem.status)}`}>
                        {getStatusIcon(returnItem.status)}
                        <span className="ml-1">
                          {returnItem.status.charAt(0).toUpperCase() + returnItem.status.slice(1).replace('_', ' ')}
                        </span>
                      </span>
                      
                      {/* Fixed Quick Status Update */}
                      {getNextPossibleStatuses(returnItem.status).length > 0 && (
                        <div className="relative">
                          <button
                            onClick={() => setShowQuickUpdate(
                              showQuickUpdate === returnItem.returnId ? null : returnItem.returnId
                            )}
                            className="p-1 text-gray-400 hover:text-white transition-colors"
                            title="Quick status update"
                          >
                            {showQuickUpdate === returnItem.returnId ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewReturn(returnItem)}
                        className="inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredReturns.length === 0 && (
          <div className="text-center py-12">
            <RotateCcw className="w-12 h-12 mx-auto text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No Returns Found</h3>
            <p className="text-gray-400">
              {searchTerm || statusFilter !== 'all' 
                ? 'No returns match your current filters.'
                : 'No return requests have been submitted yet.'
              }
            </p>
          </div>
        )}
      </div>

      {/* Fixed Quick Update Dropdown Portal */}
      {showQuickUpdate && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowQuickUpdate(null)}
          />
          <div className="fixed z-50">
            {(() => {
              const returnItem = filteredReturns.find(r => r.returnId === showQuickUpdate)
              if (!returnItem) return null
              
              return (
                <div 
                  className="bg-gray-700 border border-gray-600 rounded-lg shadow-xl min-w-64 max-w-sm"
                  style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-sm font-medium text-white">
                        Quick Update: #{showQuickUpdate}
                      </p>
                      <button
                        onClick={() => setShowQuickUpdate(null)}
                        className="text-gray-400 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {getNextPossibleStatuses(returnItem.status).map(status => {
                        const option = statusUpdateOptions.find(opt => opt.value === status)
                        if (!option) return null
                        const Icon = option.icon
                        return (
                          <button
                            key={status}
                            onClick={() => handleQuickStatusUpdate(returnItem.returnId, status)}
                            disabled={updating}
                            className={`w-full flex items-center px-3 py-2 text-sm rounded hover:bg-gray-600 transition-colors text-left ${
                              option.color === 'green' ? 'text-green-400 hover:bg-green-900/20' :
                              option.color === 'red' ? 'text-red-400 hover:bg-red-900/20' :
                              option.color === 'blue' ? 'text-blue-400 hover:bg-blue-900/20' :
                              option.color === 'purple' ? 'text-purple-400 hover:bg-purple-900/20' :
                              option.color === 'emerald' ? 'text-emerald-400 hover:bg-emerald-900/20' :
                              'text-gray-300 hover:bg-gray-600'
                            } ${updating ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <Icon className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span>{option.label}</span>
                            {updating && <RefreshCw className="w-3 h-3 ml-auto animate-spin" />}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )
            })()}
          </div>
        </>
      )}

      {/* Enhanced Return Details Modal */}
      {showModal && selectedReturn && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-6xl w-full max-h-[95vh] overflow-y-auto">
            <div className="sticky top-0 bg-gray-800 p-6 border-b border-gray-700 z-10">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Return #{selectedReturn.returnId}
                  </h2>
                  <p className="text-gray-400 mt-1">
                    Order #{selectedReturn.order.orderId} • Requested: {formatDate(selectedReturn.requestedAt)}
                  </p>
                  <div className="mt-2 flex items-center gap-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedReturn.status)}`}>
                      {getStatusIcon(selectedReturn.status)}
                      <span className="ml-2">
                        {selectedReturn.status.charAt(0).toUpperCase() + selectedReturn.status.slice(1).replace('_', ' ')}
                      </span>
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      selectedReturn.isWithinReturnWindow 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      <Timer className="w-3 h-3 mr-1" />
                      Return Window: {selectedReturn.isWithinReturnWindow ? 'Valid' : 'Expired'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Enhanced Customer & Order Info */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Customer Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-300">
                      <span className="font-medium">Name:</span> {selectedReturn.user.name}
                    </p>
                    <p className="text-gray-300">
                      <span className="font-medium">Email:</span> {selectedReturn.user.email}
                    </p>
                    {selectedReturn.user.phone && (
                      <p className="text-gray-300 flex items-center">
                        <Phone className="w-4 h-4 mr-2" />
                        {selectedReturn.user.phone}
                      </p>
                    )}
                    <p className="text-gray-300">
                      <span className="font-medium">User ID:</span> {selectedReturn.user._id}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <Package className="w-5 h-5 mr-2" />
                    Order Details
                  </h3>
                  <div className="text-sm text-gray-300 space-y-2">
                    <p><span className="font-medium">Order ID:</span> #{selectedReturn.order.orderId}</p>
                    <p><span className="font-medium">Order Total:</span> ₹{selectedReturn.order.totalPrice.toFixed(2)}</p>
                    <p><span className="font-medium">Order Date:</span> {formatDate(selectedReturn.order.createdAt)}</p>
                    {selectedReturn.order.deliveredAt && (
                      <p><span className="font-medium">Delivered:</span> {formatDate(selectedReturn.order.deliveredAt)}</p>
                    )}
                    <p><span className="font-medium">Total Items:</span> {selectedReturn.order.orderItems.length}</p>
                  </div>
                </div>

                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <Timer className="w-5 h-5 mr-2" />
                    Return Window
                  </h3>
                  <div className="text-sm text-gray-300 space-y-2">
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      selectedReturn.isWithinReturnWindow 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      <Timer className="w-3 h-3 mr-1" />
                      {selectedReturn.isWithinReturnWindow ? 'Valid Window' : 'Window Expired'}
                    </div>
                    {selectedReturn.returnWindowExpiresAt && (
                      <p><span className="font-medium">Expires:</span> {formatDate(selectedReturn.returnWindowExpiresAt)}</p>
                    )}
                    <p><span className="font-medium">Requested:</span> {formatDate(selectedReturn.requestedAt)}</p>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Shipping Address
                </h3>
                <div className="text-sm text-gray-300">
                  <p>{selectedReturn.order.shippingAddress.address}</p>
                  <p>
                    {selectedReturn.order.shippingAddress.city}, {selectedReturn.order.shippingAddress.postalCode}
                  </p>
                  <p>{selectedReturn.order.shippingAddress.country}</p>
                </div>
              </div>

              {/* Pickup Address (if applicable) */}
              {selectedReturn.pickupAddress && (
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <Home className="w-5 h-5 mr-2" />
                    Pickup Address
                  </h3>
                  <div className="text-sm text-gray-300 space-y-1">
                    {selectedReturn.pickupAddress.address && (
                      <p>{selectedReturn.pickupAddress.address}</p>
                    )}
                    {selectedReturn.pickupAddress.city && selectedReturn.pickupAddress.postalCode && (
                      <p>{selectedReturn.pickupAddress.city}, {selectedReturn.pickupAddress.postalCode}</p>
                    )}
                    {selectedReturn.pickupAddress.country && (
                      <p>{selectedReturn.pickupAddress.country}</p>
                    )}
                    {selectedReturn.pickupAddress.contactPhone && (
                      <p className="flex items-center">
                        <Phone className="w-4 h-4 mr-2" />
                        {selectedReturn.pickupAddress.contactPhone}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Enhanced Return Items */}
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Return Items ({selectedReturn.returnItems.length} items)
                </h3>
                <div className="space-y-4">
                  {selectedReturn.returnItems.map((item, idx) => (
                    <div key={idx} className="bg-gray-800 rounded-lg p-4">
                      <div className="flex items-start space-x-4">
                        <img
                          src={item.image || "https://via.placeholder.com/80"}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded border border-gray-600 flex-shrink-0"
                        />
                        <div className="flex-1 space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-white">{item.name}</p>
                              <p className="text-sm text-gray-400">
                                Size: {item.size} • Quantity: {item.quantity}
                              </p>
                              <p className="text-sm text-gray-400">
                                Unit Price: ₹{item.price.toFixed(2)}
                              </p>
                            </div>
                            <p className="font-medium text-white text-lg">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                          
                          <div className="bg-gray-900 rounded p-3 space-y-2">
                            <p className="text-sm text-gray-300">
                              <span className="font-medium">Return Reason:</span> {item.reason.replace('_', ' ').toUpperCase()}
                            </p>
                            {item.reasonDescription && (
                              <p className="text-sm text-gray-300">
                                <span className="font-medium">Description:</span> {item.reasonDescription}
                              </p>
                            )}
                          </div>
                          
                          {/* Item Images */}
                          {item.images && item.images.length > 0 && (
                            <div>
                              <p className="text-sm font-medium text-gray-300 mb-2 flex items-center">
                                <Camera className="w-4 h-4 mr-1" />
                                Customer Uploaded Images ({item.images.length})
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {item.images.map((imageUrl, imgIdx) => (
                                  <div key={imgIdx} className="relative group">
                                    <img
                                      src={imageUrl}
                                      alt={`Return evidence ${imgIdx + 1}`}
                                      className="w-16 h-16 object-cover rounded border border-gray-600 cursor-pointer hover:opacity-80 transition-opacity"
                                      onClick={() => window.open(imageUrl, '_blank')}
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                      <ExternalLink className="w-4 h-4 text-white" />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Return Details */}
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Return Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-300">Primary Reason:</p>
                      <p className="text-white">{selectedReturn.returnReason.replace('_', ' ').toUpperCase()}</p>
                    </div>
                    {selectedReturn.returnDescription && (
                      <div>
                        <p className="text-sm font-medium text-gray-300">Description:</p>
                        <p className="text-white">{selectedReturn.returnDescription}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-300">Return Method:</p>
                      <p className="text-white capitalize">{selectedReturn.returnMethod.replace('_', ' ')}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-300">Return Amount:</p>
                      <p className="text-2xl font-bold text-white">₹{selectedReturn.returnAmount.toFixed(2)}</p>
                    </div>
                    {selectedReturn.refundAmount && (
                      <div>
                        <p className="text-sm font-medium text-gray-300">Refund Amount:</p>
                        <p className="text-2xl font-bold text-green-400">₹{selectedReturn.refundAmount.toFixed(2)}</p>
                      </div>
                    )}
                    {selectedReturn.refundMethod && (
                      <div>
                        <p className="text-sm font-medium text-gray-300">Refund Method:</p>
                        <p className="text-white capitalize flex items-center">
                          <CreditCard className="w-4 h-4 mr-2" />
                          {selectedReturn.refundMethod.replace('_', ' ')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Enhanced Timeline with Key Dates */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Key Dates */}
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Key Dates
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Requested:</span>
                      <span className="text-white">{formatDate(selectedReturn.requestedAt)}</span>
                    </div>
                    {selectedReturn.approvedAt && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Approved:</span>
                        <span className="text-green-400">{formatDate(selectedReturn.approvedAt)}</span>
                      </div>
                    )}
                    {selectedReturn.pickupScheduledAt && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Pickup Scheduled:</span>
                        <span className="text-blue-400">{formatDate(selectedReturn.pickupScheduledAt)}</span>
                      </div>
                    )}
                    {selectedReturn.itemsReceivedAt && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Items Received:</span>
                        <span className="text-purple-400">{formatDate(selectedReturn.itemsReceivedAt)}</span>
                      </div>
                    )}
                    {selectedReturn.refundProcessedAt && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Refund Processed:</span>
                        <span className="text-emerald-400">{formatDate(selectedReturn.refundProcessedAt)}</span>
                      </div>
                    )}
                    {selectedReturn.completedAt && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Completed:</span>
                        <span className="text-green-400">{formatDate(selectedReturn.completedAt)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Timeline */}
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Activity Timeline
                  </h3>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {selectedReturn.timeline.map((entry, idx) => (
                      <div key={idx} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium break-words">{entry.message}</p>
                          <p className="text-sm text-gray-400">{formatDate(entry.timestamp)}</p>
                          <p className="text-xs text-gray-500 capitalize">Status: {entry.status.replace('_', ' ')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Admin Actions */}
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Edit className="w-5 h-5 mr-2" />
                  Admin Actions
                </h3>
                
                <div className="space-y-6">
                  {/* Status Update Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Update Status
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 mb-4">
                      {statusUpdateOptions
                        .filter(option => 
                          getNextPossibleStatuses(selectedReturn.status).includes(option.value) ||
                          option.value === selectedReturn.status
                        )
                        .map(option => {
                          const Icon = option.icon
                          const isCurrentStatus = option.value === selectedReturn.status
                          const isAvailable = getNextPossibleStatuses(selectedReturn.status).includes(option.value)
                          
                          return (
                            <button
                              key={option.value}
                              onClick={() => setNewStatus(option.value)}
                              disabled={isCurrentStatus}
                              className={`
                                flex items-center p-3 rounded-lg border transition-all text-left
                                ${newStatus === option.value 
                                  ? 'border-blue-500 bg-blue-500/20 text-blue-400' 
                                  : isCurrentStatus 
                                    ? 'border-gray-500 bg-gray-600 text-gray-400 cursor-not-allowed'
                                    : isAvailable
                                      ? 'border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-500 hover:bg-gray-750'
                                      : 'border-gray-700 bg-gray-800 text-gray-500 cursor-not-allowed opacity-50'
                                }
                              `}
                            >
                              <Icon className="w-4 h-4 mr-3 flex-shrink-0" />
                              <div>
                                <p className="text-sm font-medium">{option.label}</p>
                                {isCurrentStatus && (
                                  <p className="text-xs opacity-75">Current Status</p>
                                )}
                              </div>
                              {newStatus === option.value && (
                                <ArrowRight className="w-4 h-4 ml-auto" />
                              )}
                            </button>
                          )
                        })
                      }
                    </div>
                    
                    {/* Status transition info */}
                    <div className="bg-gray-800 rounded-lg p-4 mb-4">
                      <div className="flex items-start space-x-3">
                        <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                          <p className="text-gray-300">
                            <span className="font-medium">Current Status:</span> {selectedReturn.status.replace('_', ' ').toUpperCase()}
                          </p>
                          {getNextPossibleStatuses(selectedReturn.status).length > 0 ? (
                            <p className="text-gray-400 mt-1">
                              <span className="font-medium">Available transitions:</span> {getNextPossibleStatuses(selectedReturn.status).map(s => s.replace('_', ' ')).join(', ')}
                            </p>
                          ) : (
                            <p className="text-gray-400 mt-1">
                              This return has reached its final state.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Refund Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Refund Amount
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={refundAmount}
                        onChange={(e) => setRefundAmount(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter refund amount"
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        Original return amount: ₹{selectedReturn.returnAmount.toFixed(2)}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Refund Method
                      </label>
                      <select
                        value={refundMethod}
                        onChange={(e) => setRefundMethod(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {refundMethodOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {selectedReturn.refundMethod && (
                        <p className="text-xs text-gray-400 mt-1">
                          Current: {selectedReturn.refundMethod.replace('_', ' ')}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Admin Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Admin Notes
                    </label>
                    <textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      placeholder="Add notes about this status update..."
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Max 1000 characters
                    </p>
                  </div>

                  {/* Previous Admin Notes */}
                  {selectedReturn.adminNotes && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Previous Admin Notes
                      </label>
                      <div className="bg-gray-800 rounded-lg p-3 text-sm text-gray-300 border-l-4 border-blue-500">
                        {selectedReturn.adminNotes}
                      </div>
                    </div>
                  )}

                  {/* Warning for critical actions */}
                  {(newStatus === 'rejected' || newStatus === 'cancelled') && (
                    <div className="bg-yellow-900/20 border border-yellow-600 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                          <p className="text-yellow-400 font-medium">
                            Warning: {newStatus === 'rejected' ? 'Rejection' : 'Cancellation'} Action
                          </p>
                          <p className="text-yellow-300 mt-1">
                            {newStatus === 'rejected' 
                              ? 'This will reject the return request. The customer will be notified and no refund will be processed unless manually overridden.'
                              : 'This will cancel the return process. Make sure to add notes explaining the reason for cancellation.'
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {newStatus === 'refund_processed' && (
                    <div className="bg-green-900/20 border border-green-600 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <DollarSign className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                          <p className="text-green-400 font-medium">
                            Refund Processing
                          </p>
                          <p className="text-green-300 mt-1">
                            This will mark the refund as processed. Ensure the actual refund has been initiated through your payment system.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Fixed Footer */}
            <div className="sticky bottom-0 bg-gray-800 p-6 border-t border-gray-700 flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Close
              </button>
              <button
                onClick={handleUpdateStatus}
                disabled={!newStatus || updating || newStatus === selectedReturn.status}
                className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updating ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Update Return Status
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReturnsTab