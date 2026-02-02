import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface ProductGalleryProps {
  images: string[];
}

export const ProductGallery = ({ images }: ProductGalleryProps) => {
  const [activeImage, setActiveImage] = useState(images[0]);

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* 1. Cột ảnh nhỏ (Thumbnails) */}
      <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible justify-center md:justify-start">
        {images.map((img, index) => (
          <div 
            key={index} 
            className={`w-20 h-20 border cursor-pointer transition-all ${activeImage === img ? 'border-primary' : 'border-transparent'}`}
            onMouseEnter={() => setActiveImage(img)} // Hover là đổi ảnh luôn cho mượt
          >
            <img src={img} alt="Thumb" className="w-full h-full object-cover" />
          </div>
        ))}
      </div>

      {/* 2. Ảnh lớn (Main Image) */}
      <div className="flex-1 bg-[#F9F9F9] aspect-[4/5] relative overflow-hidden group">
        <img 
          src={activeImage} 
          alt="Main Product" 
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
        />
      </div>
    </div>
  );
};