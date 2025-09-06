import React from 'react'
import ProductCard from './ProductCard' // Adjust path as needed
import { Product } from '@/types' // Adjust path as needed

interface NewArrivalProps {
  products: Product[] // Required prop to pass products
}

function NewArrival({ products }: NewArrivalProps) {
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

            {/* Check if products exist */}
            {products && products.length > 0 ? (
                /* Horizontally Scrollable Container */
                <div className="overflow-x-auto scrollbar-hide">
                    <div className="flex space-x-4 pb-4" style={{ minWidth: 'max-content' }}>
                        {products.map((product) => (
                            <ProductCard 
                                key={product._id}
                                product={product}
                            />
                        ))}
                    </div>
                </div>
            ) : (
                /* No products message */
                <div className="flex justify-center items-center h-40">
                    <p className="text-gray-500 text-lg">No new arrivals available at the moment.</p>
                </div>
            )}
        </div>
    )
}

export default NewArrival