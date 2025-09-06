import React, { useState, useEffect, useRef, useCallback } from 'react';

function Hero() {
  const data = [
    {
      title: "Fresh Arrival",
      imgDesktop: "/heroDesktop.png",
      imgMobile: "/heroMobile.png"
    },
    {
      title: "Best Seller",
      imgDesktop: "/heroDesktop2.png",
      imgMobile: "/heroMobile2.png"
    },
    {
      title: "Top Rated",
      imgDesktop: "/heroDesktop3.png",
      imgMobile: "/heroMobile3.png"
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragDistance, setDragDistance] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoPlayTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-play functionalityo
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % data.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, data.length]);

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
    setCurrentSlide((prev) => (prev + 1) % data.length);
    pauseAutoPlay();
  }, [data.length, pauseAutoPlay]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + data.length) % data.length);
    pauseAutoPlay();
  }, [data.length, pauseAutoPlay]);

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
        {data.map((slide, index) => (
          <div 
            key={index} 
            className='relative w-full h-full flex-shrink-0 cursor-grab active:cursor-grabbing'
          >
            {/* Desktop Image */}
            <img
              src={slide.imgDesktop}
              alt={slide.title}
              className='hidden md:block w-full h-full object-cover object-center pointer-events-none'
              onError={(e) => {
                console.error(`Failed to load desktop image: ${slide.imgDesktop}`);
                (e.target as HTMLImageElement).style.display = 'none';
              }}
              onLoad={() => console.log(`Desktop image loaded: ${slide.imgDesktop}`)}
              draggable={false}
            />
            
            {/* Mobile Image */}
            <img
              src={slide.imgMobile}
              alt={slide.title}
              className='block md:hidden w-full h-full object-cover object-center pointer-events-none'
              onError={(e) => {
                console.error(`Failed to load mobile image: ${slide.imgMobile}`);
                (e.target as HTMLImageElement).style.display = 'none';
              }}
              onLoad={() => console.log(`Mobile image loaded: ${slide.imgMobile}`)}
              draggable={false}
            />
          </div>
        ))}
      </div>

      {/* Top Gradient Overlay */}
      <div className='absolute top-0 left-0 w-full h-32 md:h-50 bg-gradient-to-b from-black/90 via-black/40 to-transparent pointer-events-none z-10'></div>
      
      {/* Bottom Gradient Overlay */}
      <div className='absolute bottom-0 left-0 w-full h-32 md:h-40 bg-gradient-to-t from-black/70 via-black/50 to-transparent pointer-events-none z-10'></div>

      {/* Navigation Arrows - Hidden on mobile for better swipe experience */}
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

      {/* Dot Indicators */}
      <div className='absolute bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20'>
        {data.map((_, index) => (
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

      {/* Swipe Indicator - Shows on mobile */}
      {/* Swipe Indicator - Shows on mobile */}
        
    </div>
  );
}

export default Hero;