interface FullscreenCarouselModalProps {
  images: string[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  onClose: () => void;
  alt?: string;
}

const FullscreenCarouselModal = ({
  images,
  currentIndex,
  setCurrentIndex,
  onClose,
  alt = "Image",
}: FullscreenCarouselModalProps) => {
  const totalImages = images.length;

  const handlePrev = () => {
    setCurrentIndex(currentIndex === 0 ? totalImages - 1 : currentIndex - 1);
  };

  const handleNext = () => {
    setCurrentIndex(currentIndex === totalImages - 1 ? 0 : currentIndex + 1);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 flex items-center justify-center px-4">
      <div className="relative w-full max-w-5xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-10 right-0 text-slate-200 hover:text-white text-sm underline underline-offset-4 cursor-pointer"
        >
          Fermer
        </button>

        <div className="relative bg-slate-900/60 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl">
          <img
            src={images[currentIndex]}
            alt={alt}
            className="w-full max-h-[80vh] object-contain bg-black"
          />

          {totalImages > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 hover:bg-white text-pink-600 shadow-lg w-11 h-11 flex items-center justify-center text-2xl cursor-pointer"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 hover:bg-white text-pink-600 shadow-lg w-11 h-11 flex items-center justify-center text-2xl cursor-pointer"
              >
                ›
              </button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/65 backdrop-blur text-[11px] text-slate-100">
                {images.map((_, index) => (
                  <span
                    key={index}
                    className={`h-1.5 rounded-full transition-all ${
                      index === currentIndex
                        ? "w-5 bg-pink-400"
                        : "w-2 bg-slate-500/70"
                    }`}
                  />
                ))}
                <span className="ml-1 opacity-80">
                  {currentIndex + 1} / {totalImages}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FullscreenCarouselModal;
