import mongoose from 'mongoose'

const ReturnSchema = new mongoose.Schema({
  returnId: {
    type: String,
    required: true,
    unique: true,
    default: function() {
      return 'RET-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase()
    }
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  returnItems: [{
    orderItemId: { 
      type: String, 
      required: true 
    },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    size: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    reason: { 
      type: String, 
      required: true,
      enum: [
        'defective',
        'wrong_item',
        'wrong_size',
        'not_as_described',
        'damaged_in_shipping',
        'changed_mind',
        'quality_issues',
        'other'
      ]
    },
    reasonDescription: {
      type: String,
      maxlength: 500
    },
    images: [{
      type: String // URLs to uploaded images of the returned items
    }]
  }],
  returnReason: {
    type: String,
    required: true,
    enum: [
      'defective',
      'wrong_item', 
      'wrong_size',
      'not_as_described',
      'damaged_in_shipping',
      'changed_mind',
      'quality_issues',
      'other'
    ]
  },
  returnDescription: {
    type: String,
    maxlength: 1000
  },
  returnMethod: {
    type: String,
    required: true,
    enum: ['pickup', 'drop_off', 'mail'],
    default: 'pickup'
  },
  status: {
    type: String,
    required: true,
    enum: [
      'requested',
      'approved', 
      'rejected',
      'pickup_scheduled',
      'items_received',
      'items_inspected',
      'refund_processed',
      'completed',
      'cancelled'
    ],
    default: 'requested'
  },
  returnAmount: {
    type: Number,
    required: true,
    default: 0.0
  },
  refundAmount: {
    type: Number,
    default: 0.0
  },
  refundMethod: {
    type: String,
    enum: ['original_payment', 'bank_transfer', 'store_credit', 'cash'],
    default: 'original_payment'
  },
  pickupAddress: {
    address: { type: String },
    city: { type: String },
    postalCode: { type: String },
    country: { type: String },
    contactPhone: { type: String }
  },
  adminNotes: {
    type: String,
    maxlength: 1000
  },
  // Tracking and timeline
  timeline: [{
    status: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  // Important dates
  requestedAt: {
    type: Date,
    default: Date.now
  },
  approvedAt: {
    type: Date
  },
  pickupScheduledAt: {
    type: Date
  },
  itemsReceivedAt: {
    type: Date
  },
  refundProcessedAt: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  // Return policy compliance
  isWithinReturnWindow: {
    type: Boolean,
    default: true
  },
  returnWindowExpiresAt: {
    type: Date
  }
}, {
  timestamps: true,
})

// Indexes for efficient queries
ReturnSchema.index({ user: 1, createdAt: -1 });
ReturnSchema.index({ order: 1 });
ReturnSchema.index({ status: 1 });
// Removed duplicate returnId index since it's already unique: true

// Pre-save middleware to calculate return window
ReturnSchema.pre('save', async function(next) {
  if (this.isNew && this.order) {
    try {
      const Order = mongoose.model('Order');
      const order = await Order.findById(this.order);
      if (order && order.deliveredAt) {
        // Set return window to 30 days from delivery date
        const deliveryDate = new Date(order.deliveredAt);
        const returnWindowEnd = new Date(deliveryDate);
        returnWindowEnd.setDate(deliveryDate.getDate() + 30);
        
        this.returnWindowExpiresAt = returnWindowEnd;
        this.isWithinReturnWindow = new Date() <= returnWindowEnd;
      }
    } catch (error) {
      console.error('Error calculating return window:', error);
    }
  }
  next();
});

// Method to add timeline entry
ReturnSchema.methods.addTimelineEntry = function(status:any, message:any) {
  this.timeline.push({
    status,
    message,
    timestamp: new Date()
  });
  return this.save();
};

export default mongoose.models.Return || mongoose.model('Return', ReturnSchema)