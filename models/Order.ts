import mongoose from 'mongoose'

const OrderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
    default: function() {
      // Generates a unique, human-readable Order ID
      return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase()
    }
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  orderItems: [{
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    size: { type: String, required: true }, // Added this line to store the product size
    image: { type: String, required: true },
    price: { type: Number, required: true },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
  }],
  shippingAddress: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  paymentMethod: {
    type: String,
    required: true,
    default: 'Cash on Delivery',
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  isPaid: {
    type: Boolean,
    required: true,
    default: false,
  },
  paidAt: {
    type: Date,
  },
  isDelivered: {
    type: Boolean,
    required: true,
    default: false,
  },
  deliveredAt: {
    type: Date,
  },
}, {
  timestamps: true,
})

export default mongoose.models.Order || mongoose.model('Order', OrderSchema)