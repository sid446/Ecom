// utils/cloudinaryUtils.ts - Frontend version using API routes
export interface CloudinaryUploadResponse {
  url: any;
  public_id: string;
  secure_url: string;
  format: string;
  width: number;
  height: number;
  resource_type?: string;
  created_at?: string;
  bytes?: number;
}

export const uploadImageToCloudinary = async (file: File): Promise<CloudinaryUploadResponse> => {
  console.log('Starting server-side upload...', file.name, file.type, file.size);

  // Basic validation
  if (!file) {
    throw new Error('No file provided');
  }

  // Check file size (10MB limit)
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('File too large. Maximum size is 10MB');
  }

  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/avif'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`File type ${file.type} not supported`);
  }

  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/cloudinary/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Upload failed: ${response.statusText}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Upload failed');
    }

    console.log('Upload successful:', result.data.secure_url);
    return result.data;

  } catch (error) {
    console.error('Upload error:', error);
    
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('Unknown upload error');
    }
  }
};

export const deleteImageFromCloudinary = async (publicId: string): Promise<void> => {
  if (!publicId) {
    throw new Error('Public ID is required for deletion');
  }

  try {
    console.log(`Deleting image: ${publicId}`);
    
    const response = await fetch('/api/cloudinary/delete', {
      method: 'DELETE',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ publicId })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Delete failed');
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Delete failed');
    }

    console.log('Image deleted successfully');
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw error;
  }
};

// Helper function to generate optimized image URLs
export const getOptimizedImageUrl = (
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: 'auto' | number;
    format?: 'auto' | 'webp' | 'jpg' | 'png';
    crop?: 'fill' | 'fit' | 'crop' | 'scale' | 'pad';
    gravity?: 'auto' | 'face' | 'center' | 'north' | 'south' | 'east' | 'west';
  } = {}
): string => {
  if (!publicId) return '';

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dltitjam1';
  
  const { 
    width, 
    height, 
    quality = 'auto', 
    format = 'auto',
    crop = 'fill',
    gravity
  } = options;

  let transformations: string[] = [];
  
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  if (crop) transformations.push(`c_${crop}`);
  if (gravity) transformations.push(`g_${gravity}`);
  transformations.push(`q_${quality}`);
  transformations.push(`f_${format}`);

  const transformString = transformations.join(',');
  
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformString}/${publicId}`;
};

// Utility function to extract public_id from Cloudinary URL
export const extractPublicIdFromUrl = (url: string): string | null => {
  try {
    const regex = /\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/;
    const match = url.match(regex);
    return match ? match[1] : null;
  } catch (error) {
    console.error('Error extracting public_id:', error);
    return null;
  }
};