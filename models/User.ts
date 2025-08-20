import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IUser extends Document {
  email: string
  name?: string
  phone?: string
  address?: string
  city?: string
  postalCode?: string
  country?: string
  otp?: string
  otpExpires?: Date
  lastOtpRequest?: Date // Added this field
  createdAt: Date
  updatedAt: Date
  
}

const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    postalCode: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
      default: 'United States',
    },
    otp: {
      type: String,
      trim: true,
    },
    otpExpires: {
      type: Date,
    },
    lastOtpRequest: {
    type: Date,
    },
  },
  {
    timestamps: true,
  }
)

// Index for OTP expiration cleanup
UserSchema.index({ otpExpires: 1 }, { expireAfterSeconds: 0 })

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema)