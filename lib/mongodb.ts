import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
}

interface Cached {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  var mongoose: Cached | undefined
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

export async function connectToDatabase() {
  if (cached!.conn) {
    console.log('✅ Using existing MongoDB connection')
    return cached!.conn
  }

  if (!cached!.promise) {
    const opts = {
      bufferCommands: false,
    }

    console.log('🔄 Connecting to MongoDB...')
    cached!.promise = mongoose.connect(MONGODB_URI, opts)
  }

  try {
    cached!.conn = await cached!.promise
    console.log('✅ MongoDB connected successfully!')
    console.log(`📍 Connected to: ${mongoose.connection.name}`)
  } catch (e) {
    console.error('❌ MongoDB connection failed:', e)
    cached!.promise = null
    throw e
  }

  return cached!.conn
}