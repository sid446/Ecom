import React, { useState, useEffect } from 'react';

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

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % data.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, data.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % data.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + data.length) % data.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <div className='relative w-full h-[35vh] md:h-[80vh] overflow-hidden '>
      {/* Carousel Container */}
      <div 
        className='flex transition-transform duration-700 ease-out h-full'
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {data.map((slide, index) => (
          <div key={index} className='relative w-full h-full flex-shrink-0'>
            {/* Desktop Image */}
            <img
              src={slide.imgDesktop}
              alt={slide.title}
              className='hidden md:block w-full h-full object-cover object-center'
              onError={(e) => {
                console.error(`Failed to load desktop image: ${slide.imgDesktop}`);
                e.target.style.display = 'none';
              }}
              onLoad={() => console.log(`Desktop image loaded: ${slide.imgDesktop}`)}
            />
            {/* Mobile Image */}
            <img
              src={slide.imgMobile}
              alt={slide.title}
              className='block md:hidden w-full  object-cover object-center'
              onError={(e) => {
                console.error(`Failed to load mobile image: ${slide.imgMobile}`);
                e.target.style.display = 'none';
              }}
              onLoad={() => console.log(`Mobile image loaded: ${slide.imgMobile}`)}
            />
            
            {/* Fallback background with gradient if images fail to load */}
            
            
            {/* Overlay for better text readability */}
            
            
            {/* Title Overlay */}
            
          </div>
        ))}
      </div>

      

      

      {/* Dot Indicators */}
      <div className='absolute bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3'>
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

      {/* Progress Bar (Optional) */}
      
    </div>
  );
}

export default Hero;