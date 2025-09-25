import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Save,
  Plus,
  Package,
  DollarSign,
  Image as ImageIcon,
  Upload,
  Trash2,
  Camera,
  Loader
} from 'lucide-react';
import { Product } from './types';
import { api } from './api';
import { uploadImageToCloudinary, deleteImageFromCloudinary } from './utils/cloudinartUtils';
import { useProducts } from '@/context/ProductContext'; 

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingProduct: Product | null;
  onSave: () => void;
}

interface FormData {
  name: string;
  description: string;
  price: string;
  imagefront: string;
  imageback: string;
  allimages: string[];
  stock: { S: string; M: string; L: string; XL: string };
  category: string;
  offer?: string; // ADDED: New field for offer
}

interface ImageUpload {
  file?: File;
  url: string;
  publicId?: string;
  isUploading: boolean;
}

const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  editingProduct,
  onSave
}) => {
  const { refetchProducts } = useProducts(); 
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    price: '',
    imagefront: '',
    imageback: '',
    allimages: [''],
    stock: { S: '', M: '', L: '', XL: '' },
    category: '',
    offer: '' // ADDED: Initial state for offer
  });

  const [imageUploads, setImageUploads] = useState<{
    front: ImageUpload;
    back: ImageUpload;
    additional: ImageUpload[];
  }>({
    front: { url: '', isUploading: false },
    back: { url: '', isUploading: false },
    additional: [{ url: '', isUploading: false }]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const frontImageRef = useRef<HTMLInputElement>(null);
  const backImageRef = useRef<HTMLInputElement>(null);
  
  // Helper function to correctly get the public ID from a Cloudinary URL
  const getPublicIdFromUrl = (url: string) => {
    if (!url) return '';
    try {
      const parts = url.split('/');
      const uploadIndex = parts.indexOf('upload');
      if (uploadIndex === -1) {
        return '';
      }
      const publicIdPath = parts.slice(uploadIndex + 2).join('/');
      const publicId = publicIdPath.split('.')[0];
      return publicId.split('/')[publicId.split('/').length - 1];
    } catch (e) {
      console.error("Failed to parse public ID from URL:", url, e);
      return '';
    }
  };

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name || '',
        description: editingProduct.description || '',
        price: editingProduct.price?.toString() || '',
        imagefront: editingProduct.imagefront || '',
        imageback: editingProduct.imageback || '',
        allimages: editingProduct.allimages || [''],
        stock: {
          S: editingProduct.stock?.S?.toString() || '',
          M: editingProduct.stock?.M?.toString() || '',
          L: editingProduct.stock?.L?.toString() || '',
          XL: editingProduct.stock?.XL?.toString() || ''
        },
        category: editingProduct.category || '',
        offer: editingProduct.offer?.toString() || '' // ADDED: Populating offer field
      });

      setImageUploads({
        front: {
          url: editingProduct.imagefront || '',
          publicId: getPublicIdFromUrl(editingProduct.imagefront || ''),
          isUploading: false
        },
        back: {
          url: editingProduct.imageback || '',
          publicId: getPublicIdFromUrl(editingProduct.imageback || ''),
          isUploading: false
        },
        additional: (editingProduct.allimages || []).map(url => ({
          url,
          publicId: getPublicIdFromUrl(url),
          isUploading: false
        }))
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        imagefront: '',
        imageback: '',
        allimages: [''],
        stock: { S: '', M: '', L: '', XL: '' },
        category: '',
        offer: '' // ADDED: Resetting offer
      });

      setImageUploads({
        front: { url: '', isUploading: false },
        back: { url: '', isUploading: false },
        additional: [{ url: '', isUploading: false }]
      });
    }
  }, [editingProduct, isOpen]);

  const handleImageUpload = async (file: File, type: 'front' | 'back' | 'additional', index?: number) => {
    let oldPublicId: string | undefined;

    try {
      if (type === 'front') {
        oldPublicId = imageUploads.front.publicId;
        setImageUploads(prev => ({ ...prev, front: { ...prev.front, isUploading: true } }));
      } else if (type === 'back') {
        oldPublicId = imageUploads.back.publicId;
        setImageUploads(prev => ({ ...prev, back: { ...prev.back, isUploading: true } }));
      } else if (type === 'additional' && index !== undefined) {
        oldPublicId = imageUploads.additional[index]?.publicId;
        setImageUploads(prev => ({
          ...prev,
          additional: prev.additional.map((img, i) =>
            i === index ? { ...img, isUploading: true } : img
          )
        }));
      }

      const uploadResult = await uploadImageToCloudinary(file);
      const imageUrl = uploadResult.url;

      console.log(`Successfully uploaded ${type} image. Raw URL: ${imageUrl}`);

      if (type === 'front') {
        setImageUploads(prev => ({
          ...prev,
          front: {
            url: imageUrl,
            publicId: uploadResult.public_id,
            isUploading: false
          }
        }));
        setFormData(prev => ({ ...prev, imagefront: imageUrl }));
      } else if (type === 'back') {
        setImageUploads(prev => ({
          ...prev,
          back: {
            url: imageUrl,
            publicId: uploadResult.public_id,
            isUploading: false
          }
        }));
        setFormData(prev => ({ ...prev, imageback: imageUrl }));
      } else if (type === 'additional' && index !== undefined) {
        // Use a new array to update the state immutably
        const newAdditionalImages = imageUploads.additional.map((img, i) =>
          i === index ? { url: imageUrl, publicId: uploadResult.public_id, isUploading: false } : img
        );
        setImageUploads(prev => ({
          ...prev,
          additional: newAdditionalImages
        }));

        // Update formData in a similar immutable way
        const newAllImages = [...formData.allimages];
        newAllImages[index] = imageUrl;
        setFormData(prev => ({
          ...prev,
          allimages: newAllImages
        }));
      }

      if (oldPublicId) {
        await deleteImageFromCloudinary(oldPublicId);
      }
    } catch (error) {
      console.error('Image upload failed:', error);
      alert(`Failed to upload image: ${error instanceof Error ? error.message : String(error)}`);

      if (type === 'front') {
        setImageUploads(prev => ({ ...prev, front: { ...prev.front, isUploading: false } }));
      } else if (type === 'back') {
        setImageUploads(prev => ({ ...prev, back: { ...prev.back, isUploading: false } }));
      } else if (type === 'additional' && index !== undefined) {
        setImageUploads(prev => ({
          ...prev,
          additional: prev.additional.map((img, i) =>
            i === index ? { ...img, isUploading: false } : img
          )
        }));
      }
    }
  };

  const handleImageDelete = async (type: 'front' | 'back' | 'additional', index?: number) => {
    try {
      let publicId: string | undefined;

      if (type === 'front') {
        publicId = imageUploads.front.publicId;
        setImageUploads(prev => ({ ...prev, front: { url: '', isUploading: false } }));
        setFormData(prev => ({ ...prev, imagefront: '' }));
      } else if (type === 'back') {
        publicId = imageUploads.back.publicId;
        setImageUploads(prev => ({ ...prev, back: { url: '', isUploading: false } }));
        setFormData(prev => ({ ...prev, imageback: '' }));
      } else if (type === 'additional' && index !== undefined) {
        publicId = imageUploads.additional[index]?.publicId;
        
        const newAdditionalImages = imageUploads.additional.filter((_, i) => i !== index);
        setImageUploads(prev => ({
          ...prev,
          additional: newAdditionalImages
        }));

        const newAllImages = formData.allimages.filter((_, i) => i !== index);
        setFormData(prev => ({
          ...prev,
          allimages: newAllImages
        }));
      }

      if (publicId) {
        await deleteImageFromCloudinary(publicId);
        await refetchProducts(); 
      }
    } catch (error) {
      console.error('Image deletion failed:', error);
      alert('Failed to delete image from cloud. Please try again.');
    }
  };

  const addImageField = () => {
  // Only add a new field if the last one has an image
  const lastImageHasContent = imageUploads.additional.length === 0 || 
    imageUploads.additional[imageUploads.additional.length - 1].url.trim() !== '';
  
  if (lastImageHasContent) {
    setImageUploads(prev => ({
      ...prev,
      additional: [...prev.additional, { url: '', isUploading: false }]
    }));
    setFormData(prev => ({
      ...prev,
      allimages: [...prev.allimages, '']
    }));
  } else {
    alert("Please upload an image to the current field before adding another.");
  }
};

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);

  // Client-side validation
  if (!formData.imagefront || !formData.imageback) {
    alert("Please upload both a front and a back image.");
    setIsSubmitting(false);
    return;
  }

  try {
    // Filter out empty strings and ensure we only include valid image URLs
    const validAllImages = formData.allimages
      .filter(img => img && img.trim() !== '')
      .map(img => img.trim());

    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      offer: formData.offer ? parseFloat(formData.offer) : undefined,
      // Only include allimages if we have valid images, otherwise use empty array
      allimages: validAllImages,
      stock: {
        S: parseInt(formData.stock.S) || 0,
        M: parseInt(formData.stock.M) || 0,
        L: parseInt(formData.stock.L) || 0,
        XL: parseInt(formData.stock.XL) || 0,
      }
    };

    if (editingProduct) {
      await api.updateProduct(editingProduct._id, productData);
    } else {
      await api.createProduct(productData);
    }

    onClose();
    onSave();
  } catch (error) {
    console.error('Error saving product:', error);
    alert('Error saving product');
  } finally {
    setIsSubmitting(false);
  }
};

  const ImageUploadComponent = ({
    title,
    upload,
    onUpload,
    onDelete,
    inputRef
  }: {
    title: string;
    upload: ImageUpload;
    onUpload: (file: File) => void;
    onDelete: () => void;
    inputRef: React.RefObject<HTMLInputElement | null>;
  }) => (
    <div>
      <label className="block text-sm font-semibold text-gray-300 mb-3">{title}</label>
      <div className="relative">
        {upload.url ? (
          <div className="relative group">
            <img
              src={upload.url}
              alt={title}
              className="w-full h-40 object-cover rounded-xl border border-gray-600"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Camera className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={onDelete}
                className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            {upload.isUploading && (
              <div className="absolute inset-0 bg-black/70 rounded-xl flex items-center justify-center">
                <Loader className="h-8 w-8 text-white animate-spin" />
              </div>
            )}
          </div>
        ) : (
          <div
            onClick={() => inputRef.current?.click()}
            className="w-full h-40 border-2 border-dashed border-gray-600 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-gray-500 transition-colors group"
          >
            {upload.isUploading ? (
              <Loader className="h-8 w-8 text-gray-400 animate-spin" />
            ) : (
              <>
                <Upload className="h-8 w-8 text-gray-400 group-hover:text-gray-300 transition-colors mb-2" />
                <p className="text-gray-400 group-hover:text-gray-300 text-sm">Click to upload image</p>
                <p className="text-gray-500 text-xs mt-1">JPG, PNG, WebP up to 10MB</p>
              </>
            )}
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onUpload(file);
          }}
          className="hidden"
        />
      </div>
    </div>
  );

  if (!isOpen) return null;

  const isFormValid = formData.name.trim() !== '' &&
    formData.description.trim() !== '' &&
    formData.price.trim() !== '' &&
    formData.category.trim() !== '' &&
    imageUploads.front.url.trim() !== '' &&
    imageUploads.back.url.trim() !== '' &&
    !isSubmitting &&
    !imageUploads.front.isUploading &&
    !imageUploads.back.isUploading &&
    !imageUploads.additional.some(img => img.isUploading);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800/90 backdrop-blur-xl rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-gray-700 shadow-2xl">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <div>
            <h3 className="text-2xl font-bold text-white">
              {editingProduct ? 'Edit Product' : 'Create New Product'}
            </h3>
            <p className="text-gray-400 mt-1">
              {editingProduct ? 'Update product information and inventory' : 'Add a new product to your store'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-3 bg-gray-700 hover:bg-gray-600 rounded-xl transition-colors"
          >
            <X className="h-6 w-6 text-gray-300" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-400" />
                Basic Information
              </h4>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">Product Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter product name..."
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="T-Shirts">T-Shirts</option>
                    <option value="Sweatshirts">Sweatshirts</option>
                    <option value="Hoodies">Hoodies</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">Product Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  placeholder="Describe your product in detail..."
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">Price (₹)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="0.00"
                      className="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                {/* ADDED: Offer field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">Offer (%)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5">%</span>
                    <input
                      type="number"
                      value={formData.offer}
                      onChange={(e) => setFormData({ ...formData, offer: e.target.value })}
                      placeholder="0"
                      className="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      min="0"
                      max="100"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-purple-400" />
                Product Images
              </h4>

              <div className="grid md:grid-cols-2 gap-6">
                <ImageUploadComponent
                  title="Front Image"
                  upload={imageUploads.front}
                  onUpload={(file) => handleImageUpload(file, 'front')}
                  onDelete={() => handleImageDelete('front')}
                  inputRef={frontImageRef}
                />

                <ImageUploadComponent
                  title="Back Image"
                  upload={imageUploads.back}
                  onUpload={(file) => handleImageUpload(file, 'back')}
                  onDelete={() => handleImageDelete('back')}
                  inputRef={backImageRef}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">Additional Images</label>
                <div className="space-y-4">
                  {imageUploads.additional.map((upload, index) => {
                    // Create a unique ref for each additional image
                    const additionalImageRef = React.createRef<HTMLInputElement>();
                    
                    return (
                      <div key={index} className="flex gap-4 items-end">
                        <div className="flex-1">
                          <label className="block text-sm font-semibold text-gray-300 mb-3">{`Additional Image ${index + 1}`}</label>
                          <div className="relative">
                            {upload.url ? (
                              <div className="relative group">
                                <img
                                  src={upload.url}
                                  alt={`Additional ${index + 1}`}
                                  className="w-full h-40 object-cover rounded-xl border border-gray-600"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-3">
                                  <button
                                    type="button"
                                    onClick={() => additionalImageRef.current?.click()}
                                    className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                  >
                                    <Camera className="h-4 w-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleImageDelete('additional', index)}
                                    className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                                {upload.isUploading && (
                                  <div className="absolute inset-0 bg-black/70 rounded-xl flex items-center justify-center">
                                    <Loader className="h-8 w-8 text-white animate-spin" />
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div
                                onClick={() => additionalImageRef.current?.click()}
                                className="w-full h-40 border-2 border-dashed border-gray-600 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-gray-500 transition-colors group"
                              >
                                {upload.isUploading ? (
                                  <Loader className="h-8 w-8 text-gray-400 animate-spin" />
                                ) : (
                                  <>
                                    <Upload className="h-8 w-8 text-gray-400 group-hover:text-gray-300 transition-colors mb-2" />
                                    <p className="text-gray-400 group-hover:text-gray-300 text-sm">Click to upload image</p>
                                    <p className="text-gray-500 text-xs mt-1">JPG, PNG, WebP up to 10MB</p>
                                  </>
                                )}
                              </div>
                            )}
                            <input
                              ref={additionalImageRef}
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleImageUpload(file, 'additional', index);
                              }}
                              className="hidden"
                            />
                          </div>
                        </div>
                        {imageUploads.additional.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleImageDelete('additional', index)}
                            className="p-3 text-red-400 hover:text-red-300 hover:bg-gray-700/50 rounded-xl transition-colors mb-2"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                  <button
                    type="button"
                    onClick={addImageField}
                    className="flex items-center gap-2 px-4 py-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-xl transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Add Another Image
                  </button>
                </div>
              </div>
            </div>

            {/* Stock Management */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                <Package className="h-5 w-5 text-green-400" />
                Stock Management
              </h4>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['S', 'M', 'L', 'XL'].map((size) => (
                  <div key={size} className="text-center">
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Size {size}
                    </label>
                    <input
                      type="number"
                      value={formData.stock[size as keyof typeof formData.stock]}
                      onChange={(e) => setFormData({
                        ...formData,
                        stock: { ...formData.stock, [size]: e.target.value }
                      })}
                      placeholder="0"
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      min="0"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-gray-300 bg-gray-700/50 rounded-xl hover:bg-gray-700 transition-colors font-medium"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isFormValid}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    {editingProduct ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    {editingProduct ? 'Update Product' : 'Create Product'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;