"use client"
import type React from "react"
import { useState, useEffect, ReactNode } from "react"
import { useUser } from "@/context/UserContext"
import { 
  UserIcon, 
  Package, 
  Edit3, 
  Save, 
  X, 
  ExternalLink, 
  Calendar, 
  MapPin, 
  CreditCard, 
  Truck, 
  Mail, 
  KeyRound, 
  Loader2,
  RotateCcw,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw
} from "lucide-react"

// --- TYPE DEFINITIONS ---

interface ShippingAddress {
  address: string
  city: string
  postalCode: string
  country: string
}

interface OrderItem {
  _id?: string
  productId?: string
  name: string
  image?: string
  size: string
  quantity: number
  price: number
  returnStatus?: string
  returnQuantity?: number
}

type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "partially_returned" | "fully_returned"

interface Order {
  _id: string
  orderId: string
  user: {
    _id: string
  }
  createdAt: string
  paymentMethod: string
  status: OrderStatus
  totalPrice: number
  isPaid: boolean
  isDelivered: boolean
  deliveredAt?: string
  track?: string
  orderItems: OrderItem[]
  shippingAddress: ShippingAddress
  hasReturns?: boolean
  totalReturnAmount?: number
  withinReturnWindow?: boolean
}

interface UserProfile {
  _id: string
  name: string
  email: string
  phone?: string
  address?: string
  city?: string
  postalCode?: string
  country?: string
}

interface ReturnItem {
  size: ReactNode
  name: ReactNode
  orderItemId: string
  quantity: number
  reason: string
  reasonDescription?: string
}

interface Return {
  _id: string
  returnId: string
  order: {
    orderId: string
    totalPrice: number
  }
  returnItems: ReturnItem[]
  returnReason: string
  returnDescription?: string
  status: string
  returnAmount: number
  refundAmount?: number
  createdAt: string
  timeline: Array<{
    status: string
    message: string
    timestamp: string
  }>
}

// --- COMPONENT ---

const AccountPage: React.FC = () => {
  const { userInfo, isAuthenticated, loginWithOtp, authLoading, logout } = useUser()

  const [activeTab, setActiveTab] = useState<"profile" | "orders" | "returns">("profile")
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [editInfo, setEditInfo] = useState<Partial<UserProfile>>({})
  const [orders, setOrders] = useState<Order[]>([])
  const [returns, setReturns] = useState<Return[]>([])
  const [email, setEmail] = useState<string>("")
  const [otp, setOtp] = useState<string>("")
  const [otpSent, setOtpSent] = useState<boolean>(false)
  const [sendingOtp, setSendingOtp] = useState<boolean>(false)
  const [otpCountdown, setOtpCountdown] = useState<number>(0)
  const [formError, setFormError] = useState<string>("")
  const [showReturnModal, setShowReturnModal] = useState<boolean>(false)
  const [selectedOrderForReturn, setSelectedOrderForReturn] = useState<Order | null>(null)
  const [returnItems, setReturnItems] = useState<ReturnItem[]>([])
  const [returnReason, setReturnReason] = useState<string>("")
  const [returnDescription, setReturnDescription] = useState<string>("")
  const [submittingReturn, setSubmittingReturn] = useState<boolean>(false)

  const returnReasons = [
    { value: 'defective', label: 'Defective Product' },
    { value: 'wrong_item', label: 'Wrong Item Received' },
    { value: 'wrong_size', label: 'Wrong Size' },
    { value: 'not_as_described', label: 'Not as Described' },
    { value: 'damaged_in_shipping', label: 'Damaged in Shipping' },
    { value: 'changed_mind', label: 'Changed Mind' },
    { value: 'quality_issues', label: 'Quality Issues' },
    { value: 'other', label: 'Other' }
  ]

  useEffect(() => {
    if (userInfo) {
      setEditInfo(userInfo)
    }
  }, [userInfo])

  useEffect(() => {
    const fetchData = async () => {
      if (!userInfo?._id) return

      try {
        // Fetch orders
        const ordersResponse = await fetch("/api/orders")
        if (ordersResponse.ok) {
          const allOrders = (await ordersResponse.json()) as Order[]
          const userOrders = allOrders.filter((order) => order.user?._id === userInfo._id)
          setOrders(userOrders)
        }

        // Fetch returns
        const returnsResponse = await fetch(`/api/returns?userId=${userInfo._id}`)
        if (returnsResponse.ok) {
          const userReturns = (await returnsResponse.json()) as Return[]
          setReturns(userReturns)
        }
      } catch (error) {
        console.error("Failed to fetch data:", error)
      }
    }

    if (isAuthenticated) {
      fetchData()
    }
  }, [userInfo, isAuthenticated])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (otpCountdown > 0) {
      interval = setInterval(() => setOtpCountdown((prev) => prev - 1), 1000)
    }
    return () => clearInterval(interval)
  }, [otpCountdown])

  const handleSendOtp = async () => {
    if (!email) {
      setFormError("Please enter your email address.")
      return
    }
    setSendingOtp(true)
    setFormError("")
    try {
      const response = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Failed to send OTP")
      setOtpSent(true)
      setOtpCountdown(120)
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Failed to send OTP.")
    } finally {
      setSendingOtp(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setFormError("Please enter a 6-digit code")
      return
    }
    setFormError("")
    try {
      await loginWithOtp(email, otp)
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Invalid OTP.")
    }
  }

  const handleEdit = () => {
    if (userInfo) {
      setEditInfo({ ...userInfo })
      setIsEditing(true)
    }
  }

  const handleCancel = () => {
    if (userInfo) {
      setEditInfo({ ...userInfo })
      setIsEditing(false)
    }
  }

  const handleSave = async () => {
    if (!userInfo?._id) {
      alert("Cannot save: User ID is missing.")
      return
    }
    setLoading(true)
    try {
      const response = await fetch(`/api/users/${userInfo._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editInfo),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update profile")
      }
      const updatedUser = (await response.json()) as UserProfile
      setEditInfo(updatedUser)
      setIsEditing(false)
    } catch (error) {
      console.error("Failed to update profile:", error)
      if (error instanceof Error) {
        alert(`Failed to update profile: ${error.message}`)
      } else {
        alert("An unknown error occurred while updating the profile.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setEditInfo((prev) => ({ ...prev, [field]: value }))
  }

  const handleReturnRequest = (order: Order) => {
  setSelectedOrderForReturn(order);
  // Initialize return items with all returnable items
  const returnableItems = order.orderItems
    .filter(
      (item) =>
        (!item.returnStatus || item.returnStatus === "none") &&
        (!item.returnQuantity || item.quantity > item.returnQuantity)
    )
    .map((item) => ({
      // Add the missing properties from the original item
      name: item.name,
      size: item.size,
      orderItemId: item._id || "",
      quantity: item.quantity - (item.returnQuantity || 0),
      reason: "",
      reasonDescription: "",
    }));
  setReturnItems(returnableItems);
  setReturnReason("");
  setReturnDescription("");
  setShowReturnModal(true);
};

  const handleReturnItemChange = (index: number, field: keyof ReturnItem, value: string | number) => {
    setReturnItems(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ))
  }

  const handleSubmitReturn = async () => {
    if (!selectedOrderForReturn || !userInfo?._id) return

    // Validate return items
    const validReturnItems = returnItems.filter(item => item.quantity > 0 && item.reason)
    if (validReturnItems.length === 0) {
      alert('Please select at least one item to return and provide a reason.')
      return
    }

    if (!returnReason) {
      alert('Please select a return reason.')
      return
    }

    setSubmittingReturn(true)
    try {
      const response = await fetch('/api/returns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: selectedOrderForReturn._id,
          userId: userInfo._id,
          returnItems: validReturnItems,
          returnReason,
          returnDescription,
          returnMethod: 'pickup',
          pickupAddress: {
            address: userInfo.address,
            city: userInfo.city,
            postalCode: userInfo.postalCode,
            country: userInfo.country,
            contactPhone: userInfo.phone
          }
        })
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit return request')
      }

      alert(`Return request submitted successfully! Return ID: ${data.returnId}`)
      setShowReturnModal(false)
      
      // Refresh data
      const returnsResponse = await fetch(`/api/returns?userId=${userInfo._id}`)
      if (returnsResponse.ok) {
        const userReturns = await returnsResponse.json()
        setReturns(userReturns)
      }

      const ordersResponse = await fetch("/api/orders")
      if (ordersResponse.ok) {
        const allOrders = await ordersResponse.json()
        const userOrders = allOrders.filter((order: Order) => order.user?._id === userInfo._id)
        setOrders(userOrders)
      }

    } catch (error) {
      console.error('Failed to submit return:', error)
      alert(error instanceof Error ? error.message : 'Failed to submit return request')
    } finally {
      setSubmittingReturn(false)
    }
  }

  const getStatusColor = (status: OrderStatus | string): string => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      processing: "bg-blue-100 text-blue-800 border-blue-200",
      shipped: "bg-purple-100 text-purple-800 border-purple-200",
      delivered: "bg-green-100 text-green-800 border-green-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
      partially_returned: "bg-orange-100 text-orange-800 border-orange-200",
      fully_returned: "bg-gray-100 text-gray-800 border-gray-200",
      // Return statuses
      requested: "bg-blue-100 text-blue-800 border-blue-200",
      approved: "bg-green-100 text-green-800 border-green-200",
      rejected: "bg-red-100 text-red-800 border-red-200",
      pickup_scheduled: "bg-purple-100 text-purple-800 border-purple-200",
      items_received: "bg-indigo-100 text-indigo-800 border-indigo-200",
      refund_processed: "bg-emerald-100 text-emerald-800 border-emerald-200",
      completed: "bg-green-100 text-green-800 border-green-200",
    }
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const canReturnOrder = (order: Order): boolean => {
    // Check if order is delivered (either by field or status)
    const orderDelivered = order.isDelivered || order.status === 'delivered'
    if (!orderDelivered) return false
    
    // Check if order status allows returns
    if (order.status === 'fully_returned' || order.status === 'cancelled') return false
    
    // Check if within 30-day return window
    // Use deliveredAt if available, otherwise use createdAt as fallback
    const referenceDate = order.deliveredAt ? new Date(order.deliveredAt) : new Date(order.createdAt)
    const returnWindowEnd = new Date(referenceDate)
    returnWindowEnd.setDate(referenceDate.getDate() + 30)
    const withinReturnWindow = new Date() <= returnWindowEnd
    
    if (!withinReturnWindow) return false
    
    // Check if there are returnable items
    const hasReturnableItems = order.orderItems.some(item => 
      (!item.returnStatus || item.returnStatus === 'none') &&
      (!item.returnQuantity || item.quantity > item.returnQuantity)
    )
    
    return hasReturnableItems
  }

  const getReturnStatusIcon = (status: string) => {
    switch (status) {
      case 'requested':
        return <Clock className="w-4 h-4" />
      case 'approved':
        return <CheckCircle className="w-4 h-4" />
      case 'rejected':
        return <AlertCircle className="w-4 h-4" />
      case 'completed':
        return <CheckCircle className="w-4 h-4" />
      default:
        return <RefreshCw className="w-4 h-4" />
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="absolute inset-0 bg-black"></div>
        <div className="relative z-10 max-w-md w-full mx-auto p-6">
          <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 backdrop-blur-sm rounded-lg p-8 border border-zinc-800/50 animate-fade-in">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-white">My Account</h1>
              <p className="text-zinc-400 mt-2">Verify your email to access your account.</p>
            </div>

            {!otpSent ? (
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 text-white placeholder-zinc-500"
                    />
                  </div>
                </div>
                <button
                  onClick={handleSendOtp}
                  disabled={sendingOtp}
                  className="w-full inline-flex items-center justify-center px-6 py-3 bg-white text-black rounded-lg hover:bg-zinc-200 transition-all duration-200 font-medium disabled:opacity-50"
                >
                  {sendingOtp ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send OTP"}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-zinc-300 mb-2">
                    Enter OTP
                  </label>
                  <p className="text-sm text-zinc-400 mb-2">
                    An OTP has been sent to <span className="font-medium text-white">{email}</span>
                  </p>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="otp"
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={6}
                      placeholder="Enter 6-digit code"
                      className="w-full pl-10 pr-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 text-white placeholder-zinc-500 tracking-widest text-center"
                    />
                  </div>
                </div>
                <button
                  onClick={handleVerifyOtp}
                  disabled={authLoading}
                  className="w-full inline-flex items-center justify-center px-6 py-3 bg-white text-black rounded-lg hover:bg-zinc-200 transition-all duration-200 font-medium disabled:opacity-50"
                >
                  {authLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify & Continue"}
                </button>
                <div className="text-center text-sm text-zinc-400">
                  {otpCountdown > 0 ? (
                    `Resend OTP in ${otpCountdown}s`
                  ) : (
                    <button onClick={handleSendOtp} disabled={sendingOtp} className="hover:text-white underline">
                      {sendingOtp ? "Sending..." : "Resend OTP"}
                    </button>
                  )}
                </div>
              </div>
            )}
            {formError && <p className="mt-4 text-center text-red-400 text-sm">{formError}</p>}
          </div>
        </div>
      </div>
    )
  }

  if (!userInfo) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black"></div>

      <div className="relative z-10 max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">
              My Account
            </h1>
            <p className="text-zinc-400 mt-2 text-lg">Manage your profile, track your orders, and handle returns</p>
          </div>
          <button
            onClick={logout}
            className="inline-flex items-center px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 hover:text-white transition-all duration-200 text-sm font-medium"
          >
            Logout
          </button>
        </div>

        <div className="border-b border-zinc-800 mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "profile"
                  ? "border-white text-white"
                  : "border-transparent text-zinc-500 hover:text-zinc-300 hover:border-zinc-600"
              }`}
            >
              <UserIcon className="w-4 h-4 mr-2" />
              Profile Information
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "orders"
                  ? "border-white text-white"
                  : "border-transparent text-zinc-500 hover:text-zinc-300 hover:border-zinc-600"
              }`}
            >
              <Package className="w-4 h-4 mr-2" />
              Order History
            </button>
            <button
              onClick={() => setActiveTab("returns")}
              className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "returns"
                  ? "border-white text-white"
                  : "border-transparent text-zinc-500 hover:text-zinc-300 hover:border-zinc-600"
              }`}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Returns & Refunds
            </button>
          </nav>
        </div>

        {activeTab === "profile" && (
          <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 backdrop-blur-sm rounded-lg p-6 border border-zinc-800/50 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-white">Profile Details</h2>
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="inline-flex items-center px-6 py-3 bg-white text-black rounded-lg hover:bg-zinc-200 transition-all duration-200 font-medium"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex space-x-3">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="inline-flex items-center px-6 py-3 bg-white text-black rounded-lg hover:bg-zinc-200 transition-all duration-200 disabled:opacity-50 font-medium"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="inline-flex items-center px-6 py-3 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition-all duration-200 font-medium"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editInfo.name || ""}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 text-white placeholder-zinc-500"
                  />
                ) : (
                  <p className="px-4 py-3 bg-zinc-800/30 border border-zinc-700/50 rounded-lg min-h-[48px] flex items-center text-white">
                    {userInfo.name || <span className="text-zinc-500">Not provided</span>}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Email Address</label>
                <p className="px-4 py-3 bg-zinc-900/50 border border-zinc-700/50 rounded-lg text-zinc-400 min-h-[48px] flex items-center cursor-not-allowed">
                  {userInfo.email}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Phone Number</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editInfo.phone || ""}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 text-white placeholder-zinc-500"
                  />
                ) : (
                  <p className="px-4 py-3 bg-zinc-800/30 border border-zinc-700/50 rounded-lg min-h-[48px] flex items-center text-white">
                    {userInfo.phone || <span className="text-zinc-500">Not provided</span>}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Address</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editInfo.address || ""}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 text-white placeholder-zinc-500"
                  />
                ) : (
                  <p className="px-4 py-3 bg-zinc-800/30 border border-zinc-700/50 rounded-lg min-h-[48px] flex items-center text-white">
                    {userInfo.address || <span className="text-zinc-500">Not provided</span>}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-semibold text-white mb-6">Order History</h2>
            {orders.length > 0 ? (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 backdrop-blur-sm border border-zinc-800/50 rounded-lg shadow-2xl overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-4">
                        <div>
                          <h3 className="text-xl font-semibold text-white">Order #{order.orderId}</h3>
                          <div className="flex items-center text-sm text-zinc-400 mt-1">
                            <Calendar className="w-4 h-4 mr-2" />
                            {formatDate(order.createdAt)}
                          </div>
                          <div className="flex items-center text-sm text-zinc-400 mt-1">
                            <CreditCard className="w-4 h-4 mr-2" />
                            Paid with {order.paymentMethod}
                          </div>
                          {order.hasReturns && order.totalReturnAmount && (
                            <div className="flex items-center text-sm text-orange-400 mt-1">
                              <RotateCcw className="w-4 h-4 mr-2" />
                              Return Amount: ₹{order.totalReturnAmount.toFixed(2)}
                            </div>
                          )}
                        </div>
                        <div className="text-left sm:text-right w-full sm:w-auto">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {(order.status || '').charAt(0).toUpperCase() + (order.status || '').slice(1).replace('_', ' ')}
                          </span>
                          <p className="text-2xl font-bold text-white mt-1">₹{order.totalPrice.toFixed(2)}</p>
                        </div>
                      </div>

                      <div className="border-t border-zinc-700/50 pt-4">
                        <h4 className="text-sm font-medium text-zinc-300 mb-3">Items</h4>
                        <div className="space-y-3">
                          {order.orderItems.map((item, idx) => (
                            <div
                              key={`${order._id}-${item._id || idx}`}
                              className="flex items-center space-x-4"
                            >
                              <img
                                src={item.image || `https://via.placeholder.com/80`}
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded-lg border border-zinc-700/50"
                              />
                              <div className="flex-1">
                                <p className="font-medium text-white">{item.name}</p>
                                <p className="text-sm text-zinc-400">
                                  Size: {item.size} • Qty: {item.quantity}
                                  {item.returnQuantity && item.returnQuantity > 0 && (
                                    <span className="text-orange-400 ml-2">
                                      (Returned: {item.returnQuantity})
                                    </span>
                                  )}
                                </p>
                                {item.returnStatus && item.returnStatus !== 'none' && (
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(item.returnStatus)}`}>
                                    {(item.returnStatus || '').charAt(0).toUpperCase() + (item.returnStatus || '').slice(1).replace('_', ' ')}
                                  </span>
                                )}
                              </div>
                              <p className="font-medium text-white">₹{(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="bg-zinc-900/30 px-6 py-4 border-t border-zinc-700/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-zinc-300 mb-2">Shipping Address</h4>
                        <div className="flex items-start text-sm text-zinc-400">
                          <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                          <div>
                            <p>{order.shippingAddress.address}</p>
                            <p>
                              {order.shippingAddress.city}, {order.shippingAddress.postalCode},{" "}
                              {order.shippingAddress.country}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-3">
                        {canReturnOrder(order) && (
                          <button
                            onClick={() => handleReturnRequest(order)}
                            className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all duration-200 text-sm font-medium"
                          >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Request Return
                          </button>
                        )}
                        
                        
                        
                        {order.isDelivered && order.deliveredAt ? (
                          <div className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg text-sm font-medium">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Delivered on {formatDate(order.deliveredAt)}
                          </div>
                        ) : order.status === 'delivered' ? (
                          <div className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg text-sm font-medium">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Delivered
                          </div>
                        ) : order.track ? (
                          <a
                            href={order.track}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-6 py-3 bg-white text-black rounded-lg hover:bg-zinc-200 transition-all duration-200 text-sm font-medium"
                          >
                            <Truck className="w-4 h-4 mr-2" />
                            Track Package
                            <ExternalLink className="w-4 h-4 ml-2" />
                          </a>
                        ) : (
                          <div className="inline-flex items-center px-6 py-3 bg-zinc-800 text-zinc-400 rounded-lg cursor-not-allowed text-sm font-medium">
                            <Truck className="w-4 h-4 mr-2" />
                            <span>Not Dispatched Yet</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gradient-to-br from-zinc-900/30 to-zinc-800/20 rounded-lg border-2 border-dashed border-zinc-700/50">
                <Package className="w-12 h-12 mx-auto text-zinc-600" />
                <h3 className="mt-2 text-sm font-medium text-white">No Orders Found</h3>
                <p className="mt-1 text-sm text-zinc-400">You haven't placed any orders with us yet.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "returns" && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-semibold text-white mb-6">Returns & Refunds</h2>
            {returns.length > 0 ? (
              <div className="space-y-6">
                {returns.map((returnItem) => (
                  <div
                    key={returnItem._id}
                    className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 backdrop-blur-sm border border-zinc-800/50 rounded-lg shadow-2xl overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-4">
                        <div>
                          <h3 className="text-xl font-semibold text-white">Return #{returnItem.returnId}</h3>
                          <p className="text-sm text-zinc-400 mt-1">
                            Order #{returnItem.order?.orderId}
                          </p>
                          <div className="flex items-center text-sm text-zinc-400 mt-1">
                            <Calendar className="w-4 h-4 mr-2" />
                            {formatDate(returnItem.createdAt)}
                          </div>
                        </div>
                        <div className="text-left sm:text-right w-full sm:w-auto">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                              returnItem.status
                            )}`}
                          >
                            {getReturnStatusIcon(returnItem.status)}
                            <span className="ml-1">{(returnItem.status || '').charAt(0).toUpperCase() + (returnItem.status || '').slice(1).replace('_', ' ')}</span>
                          </span>
                          <p className="text-xl font-bold text-white mt-1">₹{returnItem.returnAmount.toFixed(2)}</p>
                          {returnItem.refundAmount && returnItem.refundAmount > 0 && (
                            <p className="text-sm text-green-400">Refunded: ₹{returnItem.refundAmount.toFixed(2)}</p>
                          )}
                        </div>
                      </div>

                      <div className="border-t border-zinc-700/50 pt-4">
                        <h4 className="text-sm font-medium text-zinc-300 mb-3">Return Items</h4>
                        <div className="space-y-2">
                          {returnItem.returnItems.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-sm">
                              <span className="text-white">{item.name} (Size: {item.size})</span>
                              <span className="text-zinc-400">Qty: {item.quantity}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="mt-4 p-4 bg-zinc-800/30 rounded-lg">
                          <p className="text-sm font-medium text-zinc-300 mb-2">Return Reason:</p>
                          <p className="text-sm text-zinc-400">{returnReasons.find(r => r.value === returnItem.returnReason)?.label}</p>
                          {returnItem.returnDescription && (
                            <>
                              <p className="text-sm font-medium text-zinc-300 mt-3 mb-2">Description:</p>
                              <p className="text-sm text-zinc-400">{returnItem.returnDescription}</p>
                            </>
                          )}
                        </div>

                        {returnItem.timeline && returnItem.timeline.length > 0 && (
                          <div className="mt-4">
                            <h4 className="text-sm font-medium text-zinc-300 mb-3">Timeline</h4>
                            <div className="space-y-2">
                              {returnItem.timeline.slice(-3).map((entry, idx) => (
                                <div key={idx} className="flex items-center text-xs text-zinc-400">
                                  <div className="w-2 h-2 bg-zinc-600 rounded-full mr-3 flex-shrink-0"></div>
                                  <div className="flex-1">
                                    <p className="text-white">{entry.message}</p>
                                    <p className="text-zinc-500">{formatDate(entry.timestamp)}</p>
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
            ) : (
              <div className="text-center py-12 bg-gradient-to-br from-zinc-900/30 to-zinc-800/20 rounded-lg border-2 border-dashed border-zinc-700/50">
                <RotateCcw className="w-12 h-12 mx-auto text-zinc-600" />
                <h3 className="mt-2 text-sm font-medium text-white">No Returns Found</h3>
                <p className="mt-1 text-sm text-zinc-400">You haven't requested any returns yet.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Return Modal */}
      {showReturnModal && selectedOrderForReturn && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 rounded-lg border border-zinc-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-zinc-800">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-white">Request Return</h3>
                  <p className="text-sm text-zinc-400 mt-1">Order #{selectedOrderForReturn.orderId}</p>
                </div>
                <button
                  onClick={() => setShowReturnModal(false)}
                  className="text-zinc-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-sm font-medium text-zinc-300 mb-4">Select items to return</h4>
                <div className="space-y-4">
                  {selectedOrderForReturn.orderItems.map((item, idx) => {
                    const returnItem = returnItems[idx]
                    const maxReturnQuantity = item.quantity - (item.returnQuantity || 0)
                    
                    if (maxReturnQuantity <= 0) return null

                    return (
                      <div key={item._id || idx} className="bg-zinc-800/30 rounded-lg p-4">
                        <div className="flex items-start space-x-4">
                          <img
                            src={item.image || "https://via.placeholder.com/60"}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg border border-zinc-700"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-white">{item.name}</p>
                            <p className="text-sm text-zinc-400">Size: {item.size}</p>
                            <p className="text-sm text-zinc-400">Available for return: {maxReturnQuantity}</p>
                            
                            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-medium text-zinc-400 mb-1">Quantity</label>
                                <input
                                  type="number"
                                  min="0"
                                  max={maxReturnQuantity}
                                  value={returnItem?.quantity || 0}
                                  onChange={(e) => handleReturnItemChange(idx, 'quantity', parseInt(e.target.value) || 0)}
                                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white text-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-zinc-400 mb-1">Reason</label>
                                <select
                                  value={returnItem?.reason || ''}
                                  onChange={(e) => handleReturnItemChange(idx, 'reason', e.target.value)}
                                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white text-sm"
                                >
                                  <option value="">Select reason</option>
                                  {returnReasons.map(reason => (
                                    <option key={reason.value} value={reason.value}>
                                      {reason.label}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                            
                            {returnItem?.reason === 'other' && (
                              <div className="mt-3">
                                <label className="block text-xs font-medium text-zinc-400 mb-1">Description</label>
                                <textarea
                                  value={returnItem?.reasonDescription || ''}
                                  onChange={(e) => handleReturnItemChange(idx, 'reasonDescription', e.target.value)}
                                  placeholder="Please describe the issue..."
                                  rows={2}
                                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white text-sm resize-none"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Overall Return Reason</label>
                <select
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
                >
                  <option value="">Select primary reason</option>
                  {returnReasons.map(reason => (
                    <option key={reason.value} value={reason.value}>
                      {reason.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Additional Comments (Optional)</label>
                <textarea
                  value={returnDescription}
                  onChange={(e) => setReturnDescription(e.target.value)}
                  placeholder="Any additional information about your return..."
                  rows={3}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white resize-none"
                />
              </div>

              <div className="bg-zinc-800/50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-zinc-300 mb-2">Return Summary</h4>
                <div className="space-y-1 text-sm">
                  {returnItems.filter(item => item.quantity > 0).map((item, idx) => {
                    const orderItem = selectedOrderForReturn.orderItems[idx]
                    if (!orderItem || item.quantity === 0) return null
                    
                    return (
                      <div key={idx} className="flex justify-between text-zinc-400">
                        <span>{orderItem.name} x {item.quantity}</span>
                        <span>₹{(orderItem.price * item.quantity).toFixed(2)}</span>
                      </div>
                    )
                  })}
                  <div className="border-t border-zinc-700 pt-2 mt-2">
                    <div className="flex justify-between font-medium text-white">
                      <span>Total Return Amount:</span>
                      <span>₹{returnItems.reduce((total, item, idx) => {
                        const orderItem = selectedOrderForReturn.orderItems[idx]
                        return total + (orderItem ? orderItem.price * item.quantity : 0)
                      }, 0).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-zinc-800 flex justify-end space-x-3">
              <button
                onClick={() => setShowReturnModal(false)}
                className="px-6 py-3 text-zinc-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReturn}
                disabled={submittingReturn || returnItems.filter(item => item.quantity > 0 && item.reason).length === 0 || !returnReason}
                className="inline-flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submittingReturn ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Submit Return Request
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

export default AccountPage