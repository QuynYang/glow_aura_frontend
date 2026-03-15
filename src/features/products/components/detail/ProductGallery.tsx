import { useState, useEffect } from 'react';

// 1. Đổi cổng nhận từ `images: string[]` sang nhận cả cục `product`
interface ProductGalleryProps {
  product: any;
}

export const ProductGallery = ({ product }: ProductGalleryProps) => {
  // 2. Lấy ảnh thật từ DB, fallback về ảnh mặc định nếu không có
  const mainImg = product?.imageUrl || product?.image || "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600";
  
  // Tạm thời tạo mảng 3 ảnh giống nhau để giữ nguyên UI Gallery
  const images = [mainImg, mainImg, mainImg];

  const [activeImage, setActiveImage] = useState(images[0]);

  // Cập nhật lại ảnh khi load sang sản phẩm khác
  useEffect(() => {
    setActiveImage(images[0]);
  }, [product]);

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* 1. Cột ảnh nhỏ (Thumbnails) */}
      <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible justify-center md:justify-start">
        {images.map((img, index) => (
          <div 
            key={index} 
            className={`w-20 h-20 border cursor-pointer transition-all ${activeImage === img ? 'border-primary' : 'border-transparent'}`}
            onMouseEnter={() => setActiveImage(img)}
          >
            <img src={img} alt="Thumb" className="w-full h-full object-cover" />
          </div>
        ))}
      </div>

      {/* 2. Ảnh lớn (Main Image) */}
      <div className="flex-1 bg-[#F9F9F9] aspect-[4/5] relative overflow-hidden group">
        <img 
          src={activeImage} 
          alt="Sản phẩm chính" 
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
        />
      </div>
    </div>
  );
};