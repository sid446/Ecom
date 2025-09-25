import React, { useState, useEffect, useRef, useCallback } from 'react';

// Types for carousel data
interface CarouselData {
  _id: string;
  mobileimages: string[];
  desktopimages: string[];
  Text: string;
  createdAt?: string;
}

// API function to fetch carousels
// API function to fetch carousels
const fetchCarousels = async (): Promise<CarouselData[]> => {
  try {
    const response = await fetch('/api/carousel');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('API Response:', result); // Debug log
    
    // Check if the response has the expected structure
    if (result.success && result.data && Array.isArray(result.data)) {
      return result.data;
    } else {
      console.warn('Unexpected API response structure:', result);
      return [];
    }
  } catch (error) {
    console.error('Error fetching carousels:', error);
    return [];
  }
};

function Hero() {
  // State for carousel data
  const [carousels, setCarousels] = useState<CarouselData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Carousel state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragDistance, setDragDistance] = useState(0);
  
  // Refs
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoPlayTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fallback data if no carousels are loaded
  const fallbackData = [
    {
      _id: 'fallback-1',
      Text: "Fresh Arrival",
      desktopimages: ["/heroDesktop.png"],
      mobileimages: ["/heroMobile.png"]
    },
    {
      _id: 'fallback-2',
      Text: "Best Seller",
      desktopimages: ["/heroDesktop2.png"],
      mobileimages: ["/heroMobile2.png"]
    },
    
  ];

  // Load carousel data on component mount
  useEffect(() => {
    const loadCarousels = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchCarousels();
        
        if (data && data.length > 0) {
          setCarousels(data);
        } else {
          // Use fallback data if no carousels found
          setCarousels(fallbackData);
        }
      } catch (err) {
        console.error('Error loading carousels:', err);
        setError('Failed to load carousel data');
        setCarousels(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    loadCarousels();
  }, []);

  // Get current carousel data
  const currentCarousel = carousels[currentSlide];
  const totalSlides = carousels.length;

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || totalSlides <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, totalSlides]);

  const pauseAutoPlay = useCallback(() => {
    setIsAutoPlaying(false);
    if (autoPlayTimeoutRef.current) {
      clearTimeout(autoPlayTimeoutRef.current);
    }
    // Resume auto-play after 10 seconds
    autoPlayTimeoutRef.current = setTimeout(() => setIsAutoPlaying(true), 10000);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    pauseAutoPlay();
  };

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
    pauseAutoPlay();
  }, [totalSlides, pauseAutoPlay]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    pauseAutoPlay();
  }, [totalSlides, pauseAutoPlay]);

  // Touch/Mouse event handlers
  const handleStart = (clientX: number) => {
    setIsDragging(true);
    setDragStartX(clientX);
    setDragDistance(0);
    pauseAutoPlay();
  };

  const handleMove = (clientX: number) => {
    if (!isDragging) return;
    
    const distance = clientX - dragStartX;
    setDragDistance(distance);
  };

  const handleEnd = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    // Threshold for slide change (30% of container width or minimum 50px)
    const threshold = Math.max(50, window.innerWidth * 0.3);
    
    if (Math.abs(dragDistance) > threshold) {
      if (dragDistance > 0) {
        prevSlide();
      } else {
        nextSlide();
      }
    }
    
    setDragDistance(0);
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    e.preventDefault();
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleEnd();
    }
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  // Calculate transform with drag offset
  const getTransform = () => {
    const baseTransform = -currentSlide * 100;
    const dragOffset = isDragging ? (dragDistance / window.innerWidth) * 100 : 0;
    return `translateX(${baseTransform + dragOffset}%)`;
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current);
      }
    };
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className='relative w-full h-[40vh] md:h-[100vh] overflow-hidden bg-gray-100 flex items-center justify-center'>
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-600 text-sm">Loading carousel...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && carousels.length === 0) {
    return (
      <div className='relative w-full h-[40vh] md:h-[100vh] overflow-hidden bg-gray-100 flex items-center justify-center'>
        <div className="text-center">
          <p className="text-red-600 text-sm mb-2">Error loading carousel</p>
          <p className="text-gray-600 text-xs">{error}</p>
        </div>
      </div>
    );
  }

  // No slides available
  if (totalSlides === 0) {
    return (
      <div className='relative w-full h-[40vh] md:h-[100vh] overflow-hidden bg-gray-100 flex items-center justify-center'>
        <p className="text-gray-600">No carousel slides available</p>
      </div>
    );
  }

  return (
    <div className='relative w-full h-[40vh] md:h-[100vh] overflow-hidden select-none'>
      {/* Carousel Container */}
      <div
        ref={carouselRef}
        className={`flex h-full ${isDragging ? 'transition-none' : 'transition-transform duration-700 ease-out'}`}
        style={{ transform: getTransform() }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onDragStart={(e) => e.preventDefault()} // Prevent default drag behavior
      >
        {carousels.map((slide, index) => {
          // Get the first image from each array, fallback to empty string
          const desktopImage = slide.desktopimages && slide.desktopimages.length > 0 ? slide.desktopimages[0] : '';
          const mobileImage = slide.mobileimages && slide.mobileimages.length > 0 ? slide.mobileimages[0] : '';
          
          return (
            <div 
              key={slide._id} 
              className='relative w-full h-full flex-shrink-0 cursor-grab active:cursor-grabbing'
            >
              {/* Desktop Image */}
              {desktopImage && (
                <img
                  src={desktopImage}
                  alt={slide.Text}
                  className='hidden md:block w-full h-full object-cover object-center pointer-events-none'
                  onError={(e) => {
                    console.error(`Failed to load desktop image: ${desktopImage}`);
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                  onLoad={() => console.log(`Desktop image loaded: ${desktopImage}`)}
                  draggable={false}
                />
              )}
              
              {/* Mobile Image */}
              {mobileImage && (
                <img
                  src={mobileImage}
                  alt={slide.Text}
                  className='block md:hidden w-full h-full object-cover object-center pointer-events-none'
                  onError={(e) => {
                    console.error(`Failed to load mobile image: ${mobileImage}`);
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                  onLoad={() => console.log(`Mobile image loaded: ${mobileImage}`)}
                  draggable={false}
                />
              )}

              {/* Fallback if no images are available */}
              {!desktopImage && !mobileImage && (
                <div className='w-full h-full bg-gradient-to-r from-gray-400 to-gray-600 flex items-center justify-center'>
                  <div className="text-center text-white">
                    <h2 className="text-2xl md:text-4xl font-bold mb-2">{slide.Text}</h2>
                    <p className="text-sm md:text-base opacity-80">No image available</p>
                  </div>
                </div>
              )}

              {/* Slide Title Overlay */}
              {slide.Text && (
                <div className='absolute bottom-20 md:bottom-24 left-1/2 transform -translate-x-1/2 text-center z-30'>
                  <h2 className='text-white text-xl md:text-3xl font-bold drop-shadow-2xl'>
                    {/* {slide.Text} */}
                  </h2>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Top Gradient Overlay */}
      <div className='absolute top-0 left-0 w-full h-32 md:h-50 bg-gradient-to-b from-black/90 via-black/40 to-transparent pointer-events-none z-10'></div>
      
      {/* Bottom Gradient Overlay */}
      <div className='absolute bottom-0 left-0 w-full h-32 md:h-40 bg-gradient-to-t from-black/70 via-black/50 to-transparent pointer-events-none z-10'></div>

      {/* Navigation Arrows - Hidden on mobile for better swipe experience */}
      {totalSlides > 1 && (
        <>
          <button
            onClick={prevSlide}
            className='hidden md:block absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm z-20'
            aria-label="Previous slide"
          >
            <img className='w-4 h-4' src="./left.png" alt="" />
          </button>

          <button
            onClick={nextSlide}
            className='hidden md:block absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm z-20'
            aria-label="Next slide"
          >
            <img className='w-4 h-4' src="./next.png" alt="" />
          </button>
        </>
      )}

      {/* Dot Indicators */}
      {totalSlides > 1 && (
        <div className='absolute bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20'>
          {carousels.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-white scale-125'
                  : 'bg-white bg-opacity-50 hover:bg-opacity-75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Admin indicator - shows when using fallback data */}
      {carousels === fallbackData && (
        <div className='absolute top-4 right-4 bg-yellow-500 text-yellow-900 px-3 py-1 rounded-full text-xs font-medium z-30'>
          Using Default Data
        </div>
      )}
    </div>
  );
}

export default Hero;