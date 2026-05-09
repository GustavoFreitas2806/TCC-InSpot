import { useState } from 'react';
import { ChevronLeft, ChevronRight, Expand } from 'lucide-react';
import { Modal } from '../ui/Modal';

interface ImageCarouselProps {
  images: string[];
  name: string;
}

export function ImageCarousel({ images, name }: ImageCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const prev = () => setCurrent(i => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setCurrent(i => (i === images.length - 1 ? 0 : i + 1));

  const openLightbox = (idx: number) => {
    setLightboxIndex(idx);
    setLightbox(true);
  };

  return (
    <>
      <div className="relative">
        {/* Main image */}
        <div className="relative h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden bg-gray-200">
          <img
            src={images[current]}
            alt={`${name} - foto ${current + 1}`}
            className="w-full h-full object-cover transition-opacity duration-300"
          />
          <button
            onClick={() => openLightbox(current)}
            className="absolute top-3 right-3 p-2 bg-black/40 backdrop-blur-sm text-white rounded-xl hover:bg-black/60 transition-colors"
          >
            <Expand size={16} />
          </button>
          {images.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/40 backdrop-blur-sm text-white rounded-xl hover:bg-black/60 transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/40 backdrop-blur-sm text-white rounded-xl hover:bg-black/60 transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === current ? 'w-5 bg-white' : 'w-1.5 bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 mt-3 overflow-x-auto hide-scrollbar pb-1">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`shrink-0 w-16 h-12 rounded-xl overflow-hidden border-2 transition-all ${
                  i === current ? 'border-red-600 opacity-100' : 'border-transparent opacity-60 hover:opacity-80'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <Modal isOpen={lightbox} onClose={() => setLightbox(false)} size="xl">
        <div className="relative -mx-5 -mt-5">
          <img
            src={images[lightboxIndex]}
            alt={`${name} - foto ${lightboxIndex + 1}`}
            className="w-full rounded-t-2xl"
          />
          {images.length > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setLightboxIndex(i)}
                  className={`w-14 h-10 rounded-lg overflow-hidden border-2 transition-all ${
                    i === lightboxIndex ? 'border-red-600' : 'border-transparent opacity-60'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
