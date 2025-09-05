import React from 'react'

function NewArrival() {
    const items = [
        { id: 1, title: "Typhoon black Unisex Green Jogs", price: "Rs. 999", img: "/na1.png" },
        { id: 2, title: "Modern Urban Sneakers", price: "Rs. 1000", img: "/na2.png" },
        { id: 3, title: "Classic Leather Loafers", price: "Rs. 1000", img: "/na3.png" },
        { id: 4, title: "Retro Running Shoes", price: "Rs. 999", img: "/na4.png" },
        { id: 5, title: "High-Top Canvas Kicks", price: "Rs. 1200", img: "/na5.png" },
        
    ]

    return (
        <div className="w-full px-4 sm:px-4 md:px-7 lg:px-10 py-4 sm:py-4 md:py-6 lg:py-8">
            {/* Custom CSS for hiding scrollbar on Webkit (Chrome, Safari) */}
            <style jsx>{`
                .component-scrollbar-hide::-webkit-scrollbar { 
                    display: none;
                }
            `}</style>
            
            <h2 className="text-2xl text-center sm:text-2xl md:text-3xl lg:text-4xl text-white font-semibold mb-5 sm:mb-5 lg:mb-10">
                New Arrivals
            </h2>
                    
            {/* Horizontally Scrollable Container */}
            <div className="overflow-x-auto component-scrollbar-hide">
                <div className="flex space-x-4 pb-4">
                    {items.map((item) => (
                        <div 
                            key={item.id}
                            // FIX: Using valid, standard Tailwind classes
                            className="flex-shrink-0 w-48 sm:w-56 md:w-64 transition-shadow duration-300 overflow-hidden"
                        >
                            {/* Product Image */}
                            <div className="w-full h-56 sm:h-64 md:h-72 bg-gray-200 flex items-center justify-center overflow-hidden rounded-md">
                                <img 
                                    src={item.img}
                                    alt={item.title}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjMyMCIgdmlld0JveD0iMCAwIDI1NiAzMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNTYiIGhlaWdodD0iMzIwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMjggMTAwQzExNi45NTQgMTAwIDEwOCAxMDguOTU0IDEwOCAxMjBDMTA4IDEzMS4wNDYgMTE2Ljk1NCAxNDAgMTI4IDE0MEMxMzkuMDQ2IDE0MCAxNDggMTMxLjA0NiAxNDggMTIwQzE0OCAxMDguOTU0IDEzOS4wNDYgMTAwIDEyOCAxMDBaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik04NCAxNDBIMTcyVjIwMEg4NFYxNDBaIiBmaWxsPSIjOUI5QkEwIi8+Cjx0ZXh0IHg9IjEyOCIgeT0iMjQwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNkI3MjgwIiBmb250LXNpemU9IjE0IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiPkltYWdlIE5vdCBGb3VuZDwvdGV4dD4KPC9zdmc+'
                                    }}
                                />
                            </div>
                                        
                            {/* Product Details */}
                            <div className="px-2 py-3">
                                <h3 className="text-sm font-medium text-gray-300 line-clamp-2">
                                    {item.title}
                                </h3>
                                <p className="text-sm font-semibold text-gray-400">
                                    {item.price}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default NewArrival