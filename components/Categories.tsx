import React from 'react'

function Categories({ onCategorySelect }: { onCategorySelect: (category: string) => void }) {
    const items = [
        {
            id: 1,
            type: "Hoodies",
            img: "/AllHoodies.JPEG",
            tagline: "Stay Warm, Stay Stylish",
            badge: "Best Seller"
        },
        {
            id: 2,
            type: "Sweatshirts",
            img: "/AllSweatShirt.JPEG",
            tagline: "Comfort Redefined",
            badge: "Premium"
        },
        {
            id: 3,
            type: "TShirts",
            img: "/AllTshirt.JPEG",
            tagline: "Express Yourself",
            badge: "New Collection"
        }
    ]

    const handleCategoryClick = (categoryType: string) => {
        // Call the callback function to handle category selection and scrolling
        if (onCategorySelect) {
            onCategorySelect(categoryType)
        }
    }

    return (
        <div className="w-full backdrop-blur-sm py-4 px-4 sm:px-4 md:px-6 lg:px-8">
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
                                     
            {/* Brand Header Section */}
            <div className="text-center mb-6 sm:mb-8 lg:mb-12">
                <div className="mb-4">
                    
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-black font-bold mb-3">
                    Shop by Categories
                </h2>
                <p className="text-gray-700 text-xs sm:text-sm md:text-base max-w-2xl mx-auto px-2">
                    Discover our carefully curated collection of premium apparel, designed for comfort and style
                </p>
            </div>
                                                   
            {/* Horizontally Scrollable Container */}
            <div className="overflow-x-auto scrollbar-hide">
                <div className="flex flex-col sm:flex-col md:flex-row lg:flex-row gap-2 sm:gap-3 md:gap-3 pb-4 min-w-max">
                    {items.map((item) => (
                        <div 
                            key={item.id}
                            onClick={() => handleCategoryClick(item.type.toLowerCase())}
                            className="flex-shrink-0 w-full sm:w-full md:w-80 lg:w-120 text-black transition-all duration-300 overflow-hidden group cursor-pointer hover:shadow-xl"
                        >
                            {/* Product Image Container with Relative Positioning */}
                            <div className="relative w-full h-80 sm:h-80 md:h-110 lg:h-140 bg-gray-200 flex items-center justify-center overflow-hidden rounded-lg">
                                {/* Badge */}
                                <div className="absolute top-2 left-2 sm:top-3 sm:left-3 md:top-4 md:left-4 z-10">
                                    <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold px-2 py-1 sm:px-3 rounded-full shadow-sm">
                                        {item.badge}
                                    </span>
                                </div>

                                <img 
                                    src={item.img}                                                                                                                                            
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjMyMCIgdmlld0JveD0iMCAwIDI1NiAzMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNTYiIGhlaWdodD0iMzIwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMjggMTAwQzExNi45NTQgMTAwIDEwOCAxMDguOTU0IDEwOCAxMjBDMTA4IDEzMS4wNDYgMTE2Ljk1NCAxNDAgMTI4IDE0MEMxMzkuMDQ2IDE0MCAxNDggMTMxLjA0NiAxNDggMTIwQzE0OCAxMDguOTU0IDEzOS4wNDYgMTAwIDEyOCAxMDBaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik04NCAxNDBIMTcyVjIwMEg4NFYxNDBaIiBmaWxsPSIjOUI5QkEwIi8+Cjx0ZXh0IHg9IjEyOCIgeT0iMjQwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNkI3MjgwIiBmb250LXNpemU9IjE0IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiPkltYWdlIE5vdCBGb3VuZDwvdGV4dD4KPC9zdmc+'
                                    }}
                                />
                                                                 
                                {/* Enhanced Overlay - Always visible on mobile, hover on desktop */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col items-center justify-center opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
                                    <h2 className="text-white text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-center px-3 mb-1 sm:mb-2">
                                        {item.type}
                                    </h2>
                                    <p className="text-white/90 text-xs sm:text-sm font-medium text-center px-3 mb-3 sm:mb-4">
                                        {item.tagline}
                                    </p>
                                    <button className="bg-white text-gray-800 px-4 py-1.5 sm:px-6 sm:py-2 rounded-full font-semibold text-xs sm:text-sm hover:bg-gray-100 transition-colors duration-200">
                                        Shop Now
                                    </button>
                                </div>
                            </div>
                            
                            {/* Category Info Below Image */}
                            
                        </div>
                    ))}
                </div>
            </div>

            {/* Brand Footer Section */}
            
        </div>
    )
}

export default Categories