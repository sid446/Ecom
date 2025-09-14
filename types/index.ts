export interface Product {
_id: string
name: string
description: string
price: number
imagefront: string
imageback: string
allimages: string[]
category: string
createdAt?: string
updatedAt?: string
reviews: Array<{
_id: string
user: string
name: string
rating: number
comment: string
createdAt: string
updatedAt: string
}>
rating: number
numOfReviews: number
}

// An extended product interface that includes the detailed stock for a specific size.
// This is the type you should use on the frontend for product cards and details.
export interface ProductWithStock extends Product {
stock: {
S: number
M: number
L: number
XL: number
}
}

// The CartItem interface needs to track the selected size.
export interface CartItem {
_id: string
name: string
price: number
imagefront: string
image: string; // <-- This is the property that was missing
selectedSize: string
quantity: number
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
subtotal: number
shipping: number
tax: number
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