import mongoose from 'mongoose'

const OrderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
    default: function() {
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
    size: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    // Add return tracking for individual items
    returnStatus: {
      type: String,
      enum: ['none', 'requested', 'approved', 'returned', 'refunded'],
      default: 'none'
    },
    returnQuantity: {
      type: Number,
      default: 0
    }
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
  // Enhanced pricing fields for coupon support
  originalAmount: {
    type: Number,
    default: 0.0,
  },
  couponCode: {
    type: String,
    uppercase: true,
    trim: true,
    default: null,
  },
  couponDiscount: {
    type: Number,
    default: 0.0,
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'partially_returned', 'fully_returned'],
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
  track: {
    type: String,
    required: false,
    default: null,
  },
  // Return related fields
  hasReturns: {
    type: Boolean,
    default: false
  },
  totalReturnAmount: {
    type: Number,
    default: 0.0
  },
  isReturnEligible: {
    type: Boolean,
    default: true
  },
  returnWindowExpiresAt: {
    type: Date
  }
}, {
  timestamps: true,
})

// Add indexes for coupon queries and returns
OrderSchema.index({ user: 1, couponCode: 1 });
OrderSchema.index({ couponCode: 1 });
OrderSchema.index({ user: 1, createdAt: -1 });
OrderSchema.index({ hasReturns: 1 });
OrderSchema.index({ isReturnEligible: 1, deliveredAt: 1 });

// Virtual for checking if order is within return window
OrderSchema.virtual('withinReturnWindow').get(function() {
  if (!this.deliveredAt) return false;
  if (!this.isReturnEligible) return false;
  
  const now = new Date();
  const deliveryDate = new Date(this.deliveredAt);
  const returnWindowEnd = new Date(deliveryDate);
  returnWindowEnd.setDate(deliveryDate.getDate() + 30); // 30-day return window
  
  return now <= returnWindowEnd;
});

// Method to check if specific items can be returned
OrderSchema.methods.getReturnableItems = function() {
  if (!this.withinReturnWindow) return [];

  return this.orderItems.filter((item:any) => 
    item.returnStatus === 'none' || 
    (item.returnStatus !== 'returned' && item.quantity > item.returnQuantity)
  );
};

// Method to update return status
OrderSchema.methods.updateReturnStatus = async function() {
  const totalItems = this.orderItems.reduce((sum:any, item:any) => sum + item.quantity, 0);
  const returnedItems = this.orderItems.reduce((sum:any, item:any) => sum + item.returnQuantity, 0);

  if (returnedItems === 0) {
    this.status = this.status === 'partially_returned' || this.status === 'fully_returned' 
      ? 'delivered' 
      : this.status;
    this.hasReturns = false;
  } else if (returnedItems === totalItems) {
    this.status = 'fully_returned';
    this.hasReturns = true;
  } else {
    this.status = 'partially_returned';
    this.hasReturns = true;
  }
  
  return this.save();
};

// Pre-save middleware to set return window expiration
OrderSchema.pre('save', function(next) {
  if (this.isModified('deliveredAt') && this.deliveredAt) {
    const deliveryDate = new Date(this.deliveredAt);
    const returnWindowEnd = new Date(deliveryDate);
    returnWindowEnd.setDate(deliveryDate.getDate() + 30);
    this.returnWindowExpiresAt = returnWindowEnd;
  }
  next();
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema)