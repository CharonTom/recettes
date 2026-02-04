import { useState } from "react";
import DefaultImage from "../assets/default.jpg";
import FullScreenCarouselModal from "../components/FullScreenCarouselModal";

interface CarouselProps {
  images?: string[];
  alt?: string;
}

const Carousel = ({ images, alt = "Image" }: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const imgs = images && images.length > 0 ? images : [DefaultImage];
  const totalImages = imgs.length;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative">
      <div className="details-image-wrapper cursor-zoom-in">
        <img
          src={imgs[currentIndex]}
          alt={alt}
          className="details-image w-full max-h-100 object-cover rounded-lg"
          onClick={() => setIsFullscreen(true)}
        />

        {totalImages > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white text-pink-600 shadow-md w-9 h-9 flex items-center justify-center text-lg cursor-pointer"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white text-pink-600 shadow-md w-9 h-9 flex items-center justify-center text-lg cursor-pointer"
            >
              ›
            </button>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/50 backdrop-blur text-[10px] text-slate-100">
              {imgs.map((_, index) => (
                <span
                  key={index}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentIndex
                      ? "w-4 bg-pink-400"
                      : "w-2 bg-slate-400/70"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {isFullscreen && (
        <FullScreenCarouselModal
          images={imgs}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
          onClose={() => setIsFullscreen(false)}
          alt={alt}
        />
      )}
    </div>
  );
};

export default Carousel;
