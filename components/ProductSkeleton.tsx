export default function ProductSkeleton() {
  return (
    <div className="flex-shrink-0 w-40 sm:w-40 md:w-60 lg:w-70 animate-pulse">
      {/* Product Image Skeleton */}
      <div className="w-full h-48 sm:h-48 md:h-70 lg:h-90 bg-gray-200 overflow-hidden"></div>
      
      {/* Product Details Skeleton */}
      <div className="px-2 py-3">
        {/* Product Name Skeleton - 2 lines */}
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
        
        {/* Price Skeleton */}
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  )
}