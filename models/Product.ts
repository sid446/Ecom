import mongoose, { Document, Model, Schema } from 'mongoose'

/**
 * Interface for a single Review sub-document.
 * Note: `user` is a reference to a User document's ObjectId.
 */
export interface IReview extends Document {
  user: mongoose.Schema.Types.ObjectId
  name: string
  rating: number
  comment: string
  createdAt?: Date
  updatedAt?: Date
}

/**
 * Interface for the main Product document.
 */
export interface IProduct extends Document {
  name: string
  description: string
  price: number
  imagefront: string
  imageback: string
  allimages: string[]
  stock: {
    S: number
    M: number
    L: number
    XL: number
  }
  category: string
  reviews: IReview[] // An array of review sub-documents
  rating: number
  numOfReviews: number
  createdAt?: Date
  updatedAt?: Date
  // Virtual properties
  totalStock?: number
  isInStock?: boolean
  isLowStock?: boolean
}

// --- 1. Define the schema for a single review ---
// This schema will be embedded within the ProductSchema.
const reviewSchema = new Schema<IReview>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'User reference is required'],
      ref: 'User', // This creates the reference to your User model
    },
    name: {
      // We still store the user's name at the time of review
      // to prevent it from changing if the user updates their profile name.
      type: String,
      required: [true, 'Reviewer name is required'],
      trim: true,
      maxlength: [100, 'Reviewer name cannot exceed 100 characters']
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      trim: true,
      maxlength: [1000, 'Review comment cannot exceed 1000 characters']
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt for each review
  }
)

// --- 2. Define the main product schema ---
const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [200, 'Product name cannot exceed 200 characters'],
      index: true // Add index for search performance
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true,
      maxlength: [2000, 'Product description cannot exceed 2000 characters']
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price must be non-negative'],
      validate: {
        validator: function(value: number) {
          return !isNaN(value) && isFinite(value)
        },
        message: 'Price must be a valid number'
      }
    },
    imagefront: {
      type: String,
      required: [true, 'Front image URL is required'],
      trim: true,
      validate: {
        validator: function(value: string) {
          // Basic URL validation
          const urlPattern = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i
          return urlPattern.test(value)
        },
        message: 'Front image must be a valid image URL'
      }
    },
    imageback: {
      type: String,
      required: [true, 'Back image URL is required'],
      trim: true,
      validate: {
        validator: function(value: string) {
          const urlPattern = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i
          return urlPattern.test(value)
        },
        message: 'Back image must be a valid image URL'
      }
    },
    allimages: {
      type: [String],
      required: [true, 'Product images are required'],
      validate: {
        validator: function(images: string[]) {
          if (!Array.isArray(images) || images.length === 0) {
            return false
          }
          // Validate each image URL
          const urlPattern = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i
          return images.every(img => urlPattern.test(img))
        },
        message: 'All images must be valid image URLs'
      }
    },
    stock: {
      S: { 
        type: Number, 
        required: true, 
        min: [0, 'Stock cannot be negative'],
        default: 0 
      },
      M: { 
        type: Number, 
        required: true, 
        min: [0, 'Stock cannot be negative'],
        default: 0 
      },
      L: { 
        type: Number, 
        required: true, 
        min: [0, 'Stock cannot be negative'],
        default: 0 
      },
      XL: { 
        type: Number, 
        required: true, 
        min: [0, 'Stock cannot be negative'],
        default: 0 
      },
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      trim: true,
      lowercase: true,
      maxlength: [100, 'Category name cannot exceed 100 characters'],
      index: true // Add index for filtering performance
    },

    // Embed the array of reviews using the schema defined above
    reviews: [reviewSchema],

    rating: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Rating cannot be negative'],
      max: [5, 'Rating cannot exceed 5'],
    },
    numOfReviews: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Number of reviews cannot be negative']
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt for the entire product
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

// --- 3. Add virtual properties ---
ProductSchema.virtual('totalStock').get(function(this: IProduct) {
  return this.stock.S + this.stock.M + this.stock.L + this.stock.XL
})

ProductSchema.virtual('isInStock').get(function(this: IProduct) {
  return (this.stock.S + this.stock.M + this.stock.L + this.stock.XL) > 0
})

ProductSchema.virtual('isLowStock').get(function(this: IProduct) {
  const total = this.stock.S + this.stock.M + this.stock.L + this.stock.XL
  return total > 0 && total <= 5
})

// --- 4. Add compound indexes for better query performance ---
ProductSchema.index({ category: 1, price: 1 })
ProductSchema.index({ name: 'text', description: 'text' }) // Text search index
ProductSchema.index({ createdAt: -1 }) // For sorting by newest
ProductSchema.index({ rating: -1, numOfReviews: -1 }) // For sorting by rating

// --- 5. Add pre-save middleware to calculate rating ---
ProductSchema.pre('save', function(this: IProduct) {
  if (this.reviews && this.reviews.length > 0) {
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0)
    this.rating = totalRating / this.reviews.length
    this.numOfReviews = this.reviews.length
  } else {
    this.rating = 0
    this.numOfReviews = 0
  }
})

// --- 6. Add static methods ---
ProductSchema.statics.findByCategory = function(category: string) {
  return this.find({ category: category.toLowerCase() })
}

ProductSchema.statics.findInStock = function() {
  return this.find({
    $expr: {
      $gt: [
        { $add: ['$stock.S', '$stock.M', '$stock.L', '$stock.XL'] },
        0
      ]
    }
  })
}

ProductSchema.statics.findLowStock = function() {
  return this.find({
    $expr: {
      $and: [
        { $gt: [{ $add: ['$stock.S', '$stock.M', '$stock.L', '$stock.XL'] }, 0] },
        { $lte: [{ $add: ['$stock.S', '$stock.M', '$stock.L', '$stock.XL'] }, 5] }
      ]
    }
  })
}

ProductSchema.statics.searchProducts = function(searchTerm: string) {
  return this.find({
    $text: { $search: searchTerm }
  }, {
    score: { $meta: 'textScore' }
  }).sort({
    score: { $meta: 'textScore' }
  })
}

// --- 7. Add instance methods ---
ProductSchema.methods.addReview = function(reviewData: Partial<IReview>) {
  this.reviews.push(reviewData)
  return this.save()
}

ProductSchema.methods.updateStock = function(size: 'S' | 'M' | 'L' | 'XL', quantity: number) {
  if (this.stock[size] + quantity < 0) {
    throw new Error('Insufficient stock')
  }
  this.stock[size] += quantity
  return this.save()
}

ProductSchema.methods.getStockBySize = function(size: 'S' | 'M' | 'L' | 'XL') {
  return this.stock[size]
}

/**
 * The Mongoose Model for the Product.
 */
export const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema)