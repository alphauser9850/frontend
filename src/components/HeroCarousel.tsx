import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';
import { cn } from '../lib/utils';

interface CarouselImage {
  id: number;
  src: string;
  alt: string;
  title: string;
  description: string;
}

const carouselImages: CarouselImage[] = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1920&q=80",
    alt: "Modern Data Center",
    title: "Enterprise Data Centers",
    description: "Advanced networking infrastructure powering the digital world"
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1544191696-102dbdaeeaa5?auto=format&fit=crop&w=1920&q=80",
    alt: "Network Equipment",
    title: "Cisco Network Equipment",
    description: "Professional-grade networking hardware and solutions"
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=1920&q=80",
    alt: "Server Room",
    title: "Server Infrastructure",
    description: "High-performance computing environments for enterprise applications"
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1544191696-102dbdaeeaa5?auto=format&fit=crop&w=1920&q=80",
    alt: "Network Cabling",
    title: "Network Cabling Solutions",
    description: "Structured cabling systems for optimal network performance"
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=1920&q=80",
    alt: "Cloud Infrastructure",
    title: "Cloud Networking",
    description: "Scalable cloud-based networking solutions for modern enterprises"
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1920&q=80",
    alt: "Network Security",
    title: "Network Security",
    description: "Advanced security solutions protecting enterprise networks"
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1544191696-102dbdaeeaa5?auto=format&fit=crop&w=1920&q=80",
    alt: "SD-WAN Technology",
    title: "SD-WAN Technology",
    description: "Software-defined wide area networking for modern enterprises"
  }
];

const HeroCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const { isDarkMode } = useThemeStore();

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 6000); // Change slide every 6 seconds

    return () => clearInterval(interval);
  }, [carouselImages.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const handleImageError = (imageId: number) => {
    setImageErrors(prev => new Set(prev).add(imageId));
  };

  return (
    <div className="absolute inset-0 z-5">
      {/* Carousel container */}
      <div className="relative h-full w-full overflow-hidden">
        <div 
          className="flex transition-transform duration-1000 ease-in-out h-full" 
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {carouselImages.map((image) => (
            <div key={image.id} className="w-full flex-shrink-0 relative">
              {imageErrors.has(image.id) ? (
                // Fallback gradient background when image fails to load
                <div className="w-full h-full bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-6xl mb-4">🌐</div>
                    <h2 className="text-3xl font-bold mb-2">{image.title}</h2>
                    <p className="text-xl opacity-90">{image.description}</p>
                  </div>
                </div>
              ) : (
                <img 
                  src={image.src} 
                  alt={image.alt} 
                  className="w-full h-full object-cover"
                  onError={() => handleImageError(image.id)}
                />
              )}
              {/* Overlay gradient for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/60"></div>
              
              {/* Image content */}
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                    {image.title}
                  </h2>
                  <p className="text-lg md:text-xl text-white/90 max-w-2xl">
                    {image.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Navigation buttons */}
        <button 
          onClick={prevSlide}
          className={cn(
            "absolute top-1/2 left-4 -translate-y-1/2 h-12 w-12 rounded-full flex items-center justify-center transition-all duration-300 z-20 hover:scale-110",
            isDarkMode 
              ? "bg-black/50 backdrop-blur-sm text-white hover:bg-black/70" 
              : "bg-white/80 backdrop-blur-sm text-gray-900 hover:bg-white"
          )}
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        
        <button 
          onClick={nextSlide}
          className={cn(
            "absolute top-1/2 right-4 -translate-y-1/2 h-12 w-12 rounded-full flex items-center justify-center transition-all duration-300 z-20 hover:scale-110",
            isDarkMode 
              ? "bg-black/50 backdrop-blur-sm text-white hover:bg-black/70" 
              : "bg-white/80 backdrop-blur-sm text-gray-900 hover:bg-white"
          )}
        >
          <ChevronRight className="h-6 w-6" />
        </button>
        
        {/* Slide indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "h-3 rounded-full transition-all duration-300 hover:scale-110",
                currentSlide === index 
                  ? "w-8 bg-white" 
                  : "w-3 bg-white/50 hover:bg-white/70"
              )}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
};

export { HeroCarousel }; 