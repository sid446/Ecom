
'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Plus, Edit2, Trash2, Save, X, Image, Monitor, Smartphone, Eye, AlertCircle, Upload, Camera, Loader } from 'lucide-react'
import { Carousel, CreateCarouselData, UpdateCarouselData } from './types'
import { useCarousel } from '../../hook/useCarousel'
import { uploadImageToCloudinary, deleteImageFromCloudinary } from './utils/cloudinartUtils'

interface CarouselFormData {
  mobileimage: string
  desktopimage: string
  Text: string
}

interface ImageUpload {
  file?: File
  url: string
  publicId?: string
  isUploading: boolean
}

const CarouselTab: React.FC = () => {
  const {
    carousels,
    loading,
    error,
    createCarousel,
    updateCarousel,
    deleteCarousel,
    refetch
  } = useCarousel()

  const [showModal, setShowModal] = useState(false)
  const [editingCarousel, setEditingCarousel] = useState<Carousel | null>(null)
  const [formData, setFormData] = useState<CarouselFormData>({
    mobileimage: '',
    desktopimage: '',
    Text: ''
  })
  const [formLoading, setFormLoading] = useState(false)
  const [previewCarousel, setPreviewCarousel] = useState<Carousel | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  // Image upload states
  const [mobileImageUpload, setMobileImageUpload] = useState<ImageUpload>({ url: '', isUploading: false })
  const [desktopImageUpload, setDesktopImageUpload] = useState<ImageUpload>({ url: '', isUploading: false })

  // Helper function to get public ID from Cloudinary URL
  const getPublicIdFromUrl = (url: string) => {
    if (!url) return ''
    try {
      const parts = url.split('/')
      const uploadIndex = parts.indexOf('upload')
      if (uploadIndex === -1) return ''
      const publicIdPath = parts.slice(uploadIndex + 2).join('/')
      const publicId = publicIdPath.split('.')[0]
      return publicId.split('/')[publicId.split('/').length - 1]
    } catch (e) {
      console.error("Failed to parse public ID from URL:", url, e)
      return ''
    }
  }

  const resetForm = () => {
    setFormData({ mobileimage: '', desktopimage: '', Text: '' })
    setEditingCarousel(null)
    setShowModal(false)
    setFormLoading(false)
    setMobileImageUpload({ url: '', isUploading: false })
    setDesktopImageUpload({ url: '', isUploading: false })
  }

  // Populate form when editing
  useEffect(() => {
    if (editingCarousel) {
      setFormData({
        mobileimage: editingCarousel.mobileimages?.[0] || '',
        desktopimage: editingCarousel.desktopimages?.[0] || '',
        Text: editingCarousel.Text || ''
      })

      setMobileImageUpload({
        url: editingCarousel.mobileimages?.[0] || '',
        publicId: getPublicIdFromUrl(editingCarousel.mobileimages?.[0] || ''),
        isUploading: false
      })

      setDesktopImageUpload({
        url: editingCarousel.desktopimages?.[0] || '',
        publicId: getPublicIdFromUrl(editingCarousel.desktopimages?.[0] || ''),
        isUploading: false
      })
    } else {
      setFormData({ mobileimage: '', desktopimage: '', Text: '' })
      setMobileImageUpload({ url: '', isUploading: false })
      setDesktopImageUpload({ url: '', isUploading: false })
    }
  }, [editingCarousel, showModal])

  const handleImageUpload = async (file: File, type: 'mobile' | 'desktop') => {
    const upload = type === 'mobile' ? mobileImageUpload : desktopImageUpload
    const setUpload = type === 'mobile' ? setMobileImageUpload : setDesktopImageUpload
    const oldPublicId = upload?.publicId

    try {
      // Set uploading state
      setUpload(prev => ({ ...prev, isUploading: true }))

      const uploadResult = await uploadImageToCloudinary(file)
      const imageUrl = uploadResult.url

      console.log(`Successfully uploaded ${type} image. Raw URL: ${imageUrl}`)

      // Update upload state
      setUpload({
        url: imageUrl,
        publicId: uploadResult.public_id,
        isUploading: false
      })

      // Update form data
      setFormData(prev => ({
        ...prev,
        [type === 'mobile' ? 'mobileimage' : 'desktopimage']: imageUrl
      }))

      // Delete old image if exists
      if (oldPublicId) {
        await deleteImageFromCloudinary(oldPublicId)
      }
    } catch (error) {
      console.error('Image upload failed:', error)
      alert(`Failed to upload image: ${error instanceof Error ? error.message : String(error)}`)

      // Reset uploading state
      setUpload(prev => ({ ...prev, isUploading: false }))
    }
  }

  const handleImageDelete = async (type: 'mobile' | 'desktop') => {
    const upload = type === 'mobile' ? mobileImageUpload : desktopImageUpload
    const setUpload = type === 'mobile' ? setMobileImageUpload : setDesktopImageUpload
    const publicId = upload?.publicId

    try {
      // Reset upload state
      setUpload({ url: '', isUploading: false })

      // Update form data
      setFormData(prev => ({
        ...prev,
        [type === 'mobile' ? 'mobileimage' : 'desktopimage']: ''
      }))

      // Delete from cloud if has publicId
      if (publicId) {
        await deleteImageFromCloudinary(publicId)
      }
    } catch (error) {
      console.error('Image deletion failed:', error)
      alert('Failed to delete image from cloud. Please try again.')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormLoading(true)
    
    try {
      // Validate required fields
      if (!formData.mobileimage.trim() || !formData.desktopimage.trim() || !formData.Text.trim()) {
        alert('Please upload both mobile and desktop images and provide carousel text')
        return
      }

      const carouselData = {
        mobileimages: [formData.mobileimage.trim()],
        desktopimages: [formData.desktopimage.trim()],
        Text: formData.Text.trim()
      }

      let success = false

      if (editingCarousel) {
        const result = await updateCarousel(editingCarousel._id, carouselData as UpdateCarouselData)
        success = result !== null
      } else {
        const result = await createCarousel(carouselData as CreateCarouselData)
        success = result !== null
      }

      if (success) {
        resetForm()
        refetch()
      }
    } catch (err) {
      console.error('Error submitting carousel:', err)
      alert('Failed to save carousel. Please try again.')
    } finally {
      setFormLoading(false)
    }
  }

  const handleEdit = (carousel: Carousel) => {
    setEditingCarousel(carousel)
    setShowModal(true)
  }

  const handleDelete = async (id: string, carouselText: string) => {
    if (window.confirm(`Are you sure you want to delete the carousel "${carouselText}"?`)) {
      setFormLoading(true)
      const success = await deleteCarousel(id)
      if (success) {
        refetch()
      }
      setFormLoading(false)
    }
  }

  const handlePreview = (carousel: Carousel) => {
    setPreviewCarousel(carousel)
    setShowPreview(true)
  }

  // Image Upload Component
  const ImageUploadComponent = ({
    title,
    upload,
    onUpload,
    onDelete,
    index
  }: {
    title: string
    upload: ImageUpload
    onUpload: (file: File) => void
    onDelete: () => void
    index: number
  }) => {
    const fileInputRef = useRef<HTMLInputElement>(null)

    return (
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">{title}</label>
        <div className="relative">
          {upload.url ? (
            <div className="relative group">
              <img
                src={upload.url}
                alt={title}
                className="w-full h-40 object-cover rounded-xl border border-gray-300"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
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
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-40 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors group"
            >
              {upload.isUploading ? (
                <Loader className="h-8 w-8 text-gray-400 animate-spin" />
              ) : (
                <>
                  <Upload className="h-8 w-8 text-gray-400 group-hover:text-gray-500 transition-colors mb-2" />
                  <p className="text-gray-500 group-hover:text-gray-600 text-sm">Click to upload image</p>
                  <p className="text-gray-400 text-xs mt-1">JPG, PNG, WebP up to 10MB</p>
                </>
              )}
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) onUpload(file)
            }}
            className="hidden"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Carousel Management</h1>
            <p className="text-blue-100">Manage your website carousels and banners</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            disabled={loading || formLoading}
            className="flex items-center space-x-2 bg-white text-blue-700 px-6 py-3 rounded-xl hover:bg-blue-50 transition-all duration-200 font-semibold disabled:opacity-50"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Carousel</span>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center space-x-2 text-red-800">
            <AlertCircle className="w-5 h-5" />
            <p className="font-medium">Error: {error}</p>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Carousels</p>
              <p className="text-2xl font-bold text-gray-900">{carousels.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Image className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Mobile Images</p>
              <p className="text-2xl font-bold text-gray-900">
                {carousels.length}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Smartphone className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Desktop Images</p>
              <p className="text-2xl font-bold text-gray-900">
                {carousels.length}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Monitor className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Carousels List */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">All Carousels</h2>
          <p className="text-gray-600 mt-1">Manage your carousel content and images</p>
        </div>

        {loading && carousels.length === 0 ? (
          <div className="p-8 text-center">
            <div className="relative mx-auto w-16 h-16 mb-4">
              <div className="w-16 h-16 border-4 border-gray-200 rounded-full animate-pulse"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-600">Loading carousels...</p>
          </div>
        ) : carousels.length === 0 ? (
          <div className="p-8 text-center">
            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Image className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Carousels Found</h3>
            <p className="text-gray-600 mb-4">Get started by creating your first carousel.</p>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mx-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Carousel</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {carousels.map((carousel, index) => (
              <div key={carousel._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        #{index + 1}
                      </div>
                      <h3 className="text-lg font-medium text-gray-900">{carousel.Text}</h3>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Smartphone className="w-4 h-4 text-gray-600" />
                          <h4 className="text-sm font-medium text-gray-700">Mobile Image</h4>
                        </div>
                        <div className="flex space-x-2">
                          {carousel.mobileimages.length > 0 ? (
                            <img
                              src={carousel.mobileimages[0]}
                              alt="Mobile"
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                              <span className="text-xs text-gray-500">No image</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Monitor className="w-4 h-4 text-gray-600" />
                          <h4 className="text-sm font-medium text-gray-700">Desktop Image</h4>
                        </div>
                        <div className="flex space-x-2">
                          {carousel.desktopimages.length > 0 ? (
                            <img
                              src={carousel.desktopimages[0]}
                              alt="Desktop"
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                              <span className="text-xs text-gray-500">No image</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span>ID: {carousel._id}</span>
                      {carousel.createdAt && (
                        <span>• Created: {new Date(carousel.createdAt).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handlePreview(carousel)}
                      className="flex items-center space-x-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                      title="Preview Carousel"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="hidden sm:inline">Preview</span>
                    </button>
                    <button
                      onClick={() => handleEdit(carousel)}
                      disabled={formLoading}
                      className="flex items-center space-x-1 bg-yellow-100 text-yellow-700 px-3 py-2 rounded-lg hover:bg-yellow-200 transition-colors disabled:opacity-50"
                      title="Edit Carousel"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(carousel._id, carousel.Text)}
                      disabled={formLoading}
                      className="flex items-center space-x-1 bg-red-100 text-red-700 px-3 py-2 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
                      title="Delete Carousel"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingCarousel ? 'Edit Carousel' : 'Add New Carousel'}
                </h2>
                <button
                  onClick={resetForm}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-8">
              {/* Carousel Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Carousel Text / Description <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.Text}
                  onChange={(e) => setFormData(prev => ({ ...prev, Text: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter carousel title or description"
                  required
                />
              </div>

              {/* Mobile Images */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                  <Smartphone className="h-5 w-5 text-blue-600" />
                  Mobile Image
                </h4>
                <ImageUploadComponent
                  title="Mobile Image"
                  upload={mobileImageUpload}
                  onUpload={(file) => handleImageUpload(file, 'mobile')}
                  onDelete={() => handleImageDelete('mobile')}
                  index={0}
                />
              </div>

              {/* Desktop Images */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                  <Monitor className="h-5 w-5 text-purple-600" />
                  Desktop Image
                </h4>
                <ImageUploadComponent
                  title="Desktop Image"
                  upload={desktopImageUpload}
                  onUpload={(file) => handleImageUpload(file, 'desktop')}
                  onDelete={() => handleImageDelete('desktop')}
                  index={0}
                />
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={formLoading}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading || mobileImageUpload.isUploading || desktopImageUpload.isUploading}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {formLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      <span>{editingCarousel ? 'Updating...' : 'Creating...'}</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{editingCarousel ? 'Update Carousel' : 'Create Carousel'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && previewCarousel && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Preview: {previewCarousel.Text}</h2>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-8">
              <div>
                <h3 className="flex items-center space-x-2 text-lg font-semibold text-gray-900 mb-4">
                  <Smartphone className="w-5 h-5" />
                  <span>Mobile Image</span>
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {previewCarousel.mobileimages.length > 0 ? (
                    <div className="bg-gray-100 rounded-lg overflow-hidden aspect-video">
                      <img
                        src={previewCarousel.mobileimages[0]}
                        alt="Mobile image"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.parentElement!.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 text-sm">Failed to load image</div>`;
                        }}
                      />
                    </div>
                  ) : (
                    <div className="bg-gray-200 rounded-lg aspect-video flex items-center justify-center">
                      <span className="text-gray-500">No mobile image</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="flex items-center space-x-2 text-lg font-semibold text-gray-900 mb-4">
                  <Monitor className="w-5 h-5" />
                  <span>Desktop Image</span>
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {previewCarousel.desktopimages.length > 0 ? (
                    <div className="bg-gray-100 rounded-lg overflow-hidden aspect-video">
                      <img
                        src={previewCarousel.desktopimages[0]}
                        alt="Desktop image"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.parentElement!.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 text-sm">Failed to load image</div>`;
                        }}
                      />
                    </div>
                  ) : (
                    <div className="bg-gray-200 rounded-lg aspect-video flex items-center justify-center">
                      <span className="text-gray-500">No desktop image</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CarouselTab