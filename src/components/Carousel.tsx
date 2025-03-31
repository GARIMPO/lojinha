
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CarouselImage {
  url: string;
  alt: string;
  title?: string;
  description?: string;
}

interface CarouselProps {
  images: CarouselImage[];
  autoPlayInterval?: number;
}

const Carousel = ({ images, autoPlayInterval = 5000 }: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (!autoPlayInterval) return;
    
    const interval = setInterval(nextSlide, autoPlayInterval);
    return () => clearInterval(interval);
  }, [autoPlayInterval]);

  return (
    <div className="relative w-full overflow-hidden h-[300px] md:h-[400px] lg:h-[500px]">
      <div 
        className="flex transition-transform duration-500 ease-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <div key={index} className="min-w-full h-full flex-shrink-0 relative">
            <img
              src={image.url}
              alt={image.alt}
              className="w-full h-full object-cover"
            />
            {(image.title || image.description) && (
              <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/70 to-transparent text-white">
                {image.title && (
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">{image.title}</h2>
                )}
                {image.description && (
                  <p className="text-sm md:text-base max-w-lg">{image.description}</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <Button 
        variant="outline" 
        size="icon" 
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80 rounded-full w-10 h-10 shadow-md"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <Button 
        variant="outline" 
        size="icon" 
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80 rounded-full w-10 h-10 shadow-md"
        onClick={nextSlide}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-colors ${
              currentIndex === index ? "bg-primary" : "bg-white/50"
            }`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
