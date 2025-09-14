import React from 'react'
import ProductCard from './ProductCard' // Adjust path as needed
import ProductSkeleton from './ProductSkeleton' // Import your existing ProductSkeleton
import { ProductWithStock } from '@/types' // Adjust path as needed

interface NewArrivalProps {
    products: ProductWithStock[] // Required prop to pass products
    loading?: boolean // Optional loading prop
}

function NewArrival({ products, loading = false }: NewArrivalProps) {
    return (
        <div className="w-full px-4 sm:px-4 md:px-7 lg:px-10 sm:py-4 md:py-6 lg:py-8">
            {/* Custom CSS for hiding scrollbar */}
            <style jsx>{`
                .scrollbar-hide {
                    -ms-overflow-style: none;  /* Internet Explorer 10+ */
                    scrollbar-width: none;  /* Firefox */
                }
                .scrollbar-hide::-webkit-scrollbar { 
                    display: none;  /* Safari and Chrome */
                }
            `}</style>
            
            {/* Header */}
            <h2 className="text-2xl text-center sm:text-2xl md:text-3xl lg:text-4xl text-black font-semibold mb-5 sm:mb-5 lg:mb-10">
                New Arrivals
            </h2>

            {/* Loading State - Show skeletons */}
            {loading ? (
                <div className="overflow-x-auto scrollbar-hide">
                    <div className="flex space-x-4 pb-4" style={{ minWidth: 'max-content' }}>
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div key={index} className="flex-shrink-0">
                                <ProductSkeleton />
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                /* Check if products exist */
                products && products.length > 0 ? (
                    /* Horizontally Scrollable Container */
                    <div className="overflow-x-auto scrollbar-hide">
                        <div className="flex space-x-4 pb-4" style={{ minWidth: 'max-content' }}>
                            {products.map((product) => (
                                <div key={product._id} className="flex-shrink-0">
                                    <ProductCard 
                                        product={product}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    /* No products message */
                    <div className="flex justify-center items-center h-40">
                        <p className="text-gray-500 text-lg">No new arrivals available at the moment.</p>
                    </div>
                )
            )}
        </div>
    )
}

export default NewArrival