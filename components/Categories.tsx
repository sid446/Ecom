import React from 'react'

function Categories() {
    const items = [
        {
            id: 1,
            img: "/AllHoodies.png"
        },
        {
            id: 2,
            img: "/AllSweatShirt.png"
        },
        {
            id: 3,
            img: "/AllTshirt.png"
        }
    ]

    return (
        <div className="w-full  px-4 sm:px-4 md:px-6 lg:px-8 ">
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
            <h2 className="text-2xl  sm:text-2xl md:text-3xl lg:text:text-4xl  text-gray-800  mb-5 sm:mb-5 lg:mb-10">
                Categories
            </h2>
                         
            {/* Horizontally Scrollable Container */}
            <div className="overflow-x-auto scrollbar-hide">
                <div className="flex flex-col sm:flex-col md:flex-row lg:flex-row gap-2 pb-4 min-w-max">
                    {items.map((item) => (
                        <div 
                            key={item.id}
                            className="flex-shrink-0 w-full sm:w-full md:w-80 lg:w-121 bg-white   transition-shadow duration-300 overflow-hidden"
                        >
                            {/* Product Image */}
                            <div className="w-full h-110 sm:h-60 md:h-90 lg:h-140  bg-gray-200 flex items-center justify-center overflow-hidden">
                                <img 
                                    src={item.img}                                                                     
                                    className="w-full h-full object-cover hover:scale-101 transition-transform duration-300"
                                    onError={(e) => {
                                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjMyMCIgdmlld0JveD0iMCAwIDI1NiAzMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNTYiIGhlaWdodD0iMzIwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMjggMTAwQzExNi45NTQgMTAwIDEwOCAxMDguOTU0IDEwOCAxMjBDMTA4IDEzMS4wNDYgMTE2Ljk1NCAxNDAgMTI4IDE0MEMxMzkuMDQ2IDE0MCAxNDggMTMxLjA0NiAxNDggMTIwQzE0OCAxMDguOTU0IDEzOS4wNDYgMTAwIDEyOCAxMDBaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik04NCAxNDBIMTcyVjIwMEg4NFYxNDBaIiBmaWxsPSIjOUI5QkEwIi8+Cjx0ZXh0IHg9IjEyOCIgeT0iMjQwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNkI3MjgwIiBmb250LXNpemU9IjE0IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiPkltYWdlIE5vdCBGb3VuZDwvdGV4dD4KPC9zdmc+'
                                    }}
                                />
                            </div>
                                                                 
                        </div>
                    ))}
                </div>
            </div>
                                  
        </div>
    )
}

export default Categories