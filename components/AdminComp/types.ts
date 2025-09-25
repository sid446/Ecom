// types.ts
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  imagefront: string;
  imageback: string;
  allimages: string[];
  stock: { S: number; M: number; L: number; XL: number };
  category: string;
  rating?: number;
  numOfReviews?: number;
  reviews?: any[];
  offer?: number;
}

export interface Order {
  _id: string;
  orderId?: string;
  user?: { _id: string; name: string; email: string; };
  orderItems?: any[];
  totalPrice: number;
  status: string;
  createdAt: string;
  shippingAddress?: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  }
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
}
// types/cloudinary.ts
export interface CloudinaryUploadResponse {
  public_id: string;
  version: number;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  folder?: string;
  access_mode: string;
  original_filename: string;
}

export interface CloudinaryDeleteResponse {
  result: 'ok' | 'not found';
  public_id?: string;
}

export interface CloudinaryConfig {
  cloudName: string;
  uploadPreset: string;
  apiKey?: string;
  apiSecret?: string;
}

export interface ImageTransformOptions {
  width?: number;
  height?: number;
  crop?: 'scale' | 'fit' | 'limit' | 'fill' | 'lfill' | 'pad' | 'lpad' | 'mpad' | 'crop' | 'thumb' | 'imagga_crop' | 'imagga_scale';
  gravity?: 'auto' | 'center' | 'north' | 'south' | 'east' | 'west' | 'north_east' | 'north_west' | 'south_east' | 'south_west' | 'face' | 'faces';
  quality?: 'auto' | number;
  format?: 'auto' | 'jpg' | 'png' | 'webp' | 'gif' | 'bmp' | 'tiff';
  dpr?: number;
  flags?: string[];
}

export interface ImageUploadState {
  file?: File;
  url: string;
  publicId?: string;
  isUploading: boolean;
  error?: string;
}

export interface ProductImageUploads {
  front: ImageUploadState;
  back: ImageUploadState;
  additional: ImageUploadState[];
}

// Extended Product interface with Cloudinary metadata
export interface ProductWithImages extends Product {
  imageMetadata?: {
    front?: {
      publicId: string;
      version: number;
      format: string;
    };
    back?: {
      publicId: string;
      version: number;
      format: string;
    };
    additional?: Array<{
      publicId: string;
      version: number;
      format: string;
    }>;
  };
}

// Upload error types
export type CloudinaryError = 
  | 'UPLOAD_FAILED'
  | 'FILE_TOO_LARGE'
  | 'INVALID_FORMAT'
  | 'NETWORK_ERROR'
  | 'PRESET_NOT_FOUND'
  | 'UNAUTHORIZED';

export interface UploadError extends Error {
  code: CloudinaryError;
  details?: any;
}

// File: types/carousel.ts
export interface Carousel {
  _id: string
  mobileimages: string[]
  desktopimages: string[]
  Text: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateCarouselData {
  mobileimages: string[]
  desktopimages: string[]
  Text: string
}

export interface UpdateCarouselData {
  mobileimages?: string[]
  desktopimages?: string[]
  Text?: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
  errors?: string[]
  count?: number
}