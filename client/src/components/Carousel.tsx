import { useState } from "react";

interface CarouselProps {
  images: string[];
  alt?: string;
}

const Carousel = ({ images, alt = "Image" }: CarouselProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const totalImages = images.length;

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
  };

  return (
    <div>
      {" "}
      <div className="details-image-wrapper cursor-zoom-in">
        <img
          src={images[currentImageIndex]}
          alt={alt}
          className="details-image"
          onClick={() => setIsFullscreen(true)}
        />

        {totalImages > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white text-pink-600 shadow-md w-9 h-9 flex items-center justify-center text-lg cursor-pointer"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={handleNextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white text-pink-600 shadow-md w-9 h-9 flex items-center justify-center text-lg cursor-pointer"
            >
              ›
            </button>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/50 backdrop-blur text-[10px] text-slate-100">
              {images.map((_, index) => (
                <span
                  key={index}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentImageIndex
                      ? "w-4 bg-pink-400"
                      : "w-2 bg-slate-400/70"
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Bouton pour le plein écran */}
        <button
          type="button"
          onClick={() => setIsFullscreen(true)}
          className="absolute bottom-3 right-3 rounded-full bg-slate-900/70 hover:bg-slate-900 text-xs sm:text-[13px] text-slate-50 px-4 py-2 shadow-md cursor-pointer"
        >
          Cliquer l'image pour voir en plein écran
        </button>
      </div>
      {/* Modal plein écran */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 flex items-center justify-center px-4">
          <div className="relative w-full max-w-5xl">
            <button
              type="button"
              onClick={() => setIsFullscreen(false)}
              className="absolute -top-10 right-0 text-slate-200 hover:text-white text-sm underline underline-offset-4 cursor-pointer"
            >
              Fermer
            </button>

            <div className="relative bg-slate-900/60 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl">
              <img
                src={images[currentImageIndex]}
                alt={alt}
                className="w-full max-h-[80vh] object-contain bg-black"
              />

              {totalImages > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 hover:bg-white text-pink-600 shadow-lg w-11 h-11 flex items-center justify-center text-2xl cursor-pointer"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 hover:bg-white text-pink-600 shadow-lg w-11 h-11 flex items-center justify-center text-2xl cursor-pointer"
                  >
                    ›
                  </button>

                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/65 backdrop-blur text-[11px] text-slate-100">
                    {images.map((_, index) => (
                      <span
                        key={index}
                        className={`h-1.5 rounded-full transition-all ${
                          index === currentImageIndex
                            ? "w-5 bg-pink-400"
                            : "w-2 bg-slate-500/70"
                        }`}
                      />
                    ))}
                    <span className="ml-1 opacity-80">
                      {currentImageIndex + 1} / {totalImages}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Carousel;
