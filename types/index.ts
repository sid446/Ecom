export interface Product {
  _id: string
  name: string
  description: string
  price: number
  imagefront: string,
  imageback: string,
  allimages: string[],
  stock: number
  category: string
  createdAt?: string
  updatedAt?: string
}

export interface User {
  _id: string
  name: string
  email: string
  password?: string
  address?: {
    street: string
    city: string
    zipCode: string
    country: string
  }
  phone?: string
  createdAt?: string
  updatedAt?: string
}

export interface CartItem extends Product {
  quantity: number,
  image: string
}

export interface OrderItem {
  product: string
  name: string
  quantity: number
  price: number
  image: string
}

export interface Order {
  _id: string
  orderId: string
  user: User | string
  orderItems: OrderItem[]
  shippingAddress: {
    address: string
    city: string
    postalCode: string
    country: string
  }
  paymentMethod: string
  totalPrice: number
  isPaid: boolean
  paidAt?: Date
  isDelivered: boolean
  deliveredAt?: Date
  createdAt: string
  updatedAt: string
}
export interface OrderData {
  _id: string
  orderId: string
  customerInfo: CustomerInfo
  orderItems: OrderItem[]
  shippingAddress: {
    address: string
    city: string
    postalCode: string
    country: string
  }
  subtotal: number // Add this
  shipping: number // Add this
  tax: number // Add this
  totalPrice: number
  status: string
  createdAt: Date
}

export interface CustomerInfo {
  name: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
  country: string
}