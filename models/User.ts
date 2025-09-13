import mongoose, { Document, Model, Schema } from 'mongoose'
import bcrypt from 'bcryptjs'

/**
 * Interface representing a User document in MongoDB.
 */
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string
  name?: string
  phone?: string
  address?: string
  city?: string
  postalCode?: string
  country?: string
  otp?: string
  otpExpires?: Date
  lastOtpRequest?: Date
  createdAt: Date
  updatedAt: Date

  // Method to compare entered OTP with the hashed OTP in the database
  compareOTP(enteredOTP: string): Promise<boolean>
}

const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/.+\@.+\..+/, 'Please fill a valid email address'],
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

// --- IMPORTANT SECURITY FEATURE: HASH OTP BEFORE SAVING ---
// Use a pre-save hook to automatically hash the OTP if it has been modified.
UserSchema.pre<IUser>('save', async function (next) {
  // Only hash the otp if it has been modified (or is new) and is not null/undefined
  if (!this.isModified('otp') || !this.otp) {
    return next()
  }

  try {
    const salt = await bcrypt.genSalt(10)
    this.otp = await bcrypt.hash(this.otp, salt)
    next()
  } catch (error: any) {
    next(error)
  }
})

// --- HELPER METHOD: COMPARE ENTERED OTP WITH HASHED OTP ---
// This method will be available on all instances of the User model.
UserSchema.methods.compareOTP = async function (
  enteredOTP: string
): Promise<boolean> {
  // Check if there is an OTP stored for the user to avoid errors
  if (!this.otp) {
    return false
  }
  return await bcrypt.compare(enteredOTP, this.otp)
}


// --- NOTE ON INDEXING ---
// The TTL (Time-To-Live) index `UserSchema.index({ otpExpires: 1 }, { expireAfterSeconds: 0 })`
// was REMOVED. This type of index DELETES the ENTIRE document when the OTP expires,
// which is not the desired behavior. OTP expiration must be checked in your application logic
// (i.e., in the controller or service where you verify the OTP).


/**
 * The Mongoose Model for the User.
 * The `mongoose.models.User ||` part prevents the model from being re-compiled on
 * hot-reloads, which is common in environments like Next.js.
 */
export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema)