import { useState } from 'react'; // 1. Import useState
import { MainLayout } from '../components/layout/MainLayout';
import { ProductGallery } from '../features/products/components/detail/ProductGallery';
import { ProductInfo } from '../features/products/components/detail/ProductInfo';
import { ProductTabs } from '../features/products/components/detail/ProductTabs';
import { BeforeAfterSection } from '../features/products/components/detail/BeforeAfterSection';
import { SectionHeading } from '../components/ui/SectionHeading';
import { ProductCard } from '../features/products/components/ProductCard';
import { singleProduct, products } from '../data/mockData';

export const ProductDetailPage = () => {
  // 2. Tạo state để kiểm soát việc phát video
  const [isPlaying, setIsPlaying] = useState(false);

  // ID của video YouTube bạn muốn chèn (Lấy từ link: https://youtu.be/0YPJMxnpxdA)
  const videoId = "0YPJMxnpxdA";

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <ProductGallery images={singleProduct.images} />
            <ProductInfo />
        </div>
        <ProductTabs />
      </div>

      <BeforeAfterSection />

      {/* 4. Video Section Nâng Cao */}
      <div 
        className="relative h-[500px] w-full bg-black mt-16 group cursor-pointer overflow-hidden"
        onClick={() => setIsPlaying(true)} // Bấm vào khung thì cho phép phát
      >
          {!isPlaying ? (
            // === TRẠNG THÁI 1: CHƯA PHÁT (Hiện ảnh bìa đẹp) ===
            <>
              {/* Lấy ảnh thumbnail chất lượng cao từ YouTube */}
              <img 
                src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`} 
                className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                alt="Video Thumbnail"
              />
              
              {/* Nút Play (Giữ nguyên thiết kế cũ) */}
              <div className="absolute inset-0 flex items-center justify-center z-10">
                 <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white group-hover:scale-110 transition-transform duration-300">
                    <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[15px] border-l-white border-b-[10px] border-b-transparent ml-1"></div>
                 </div>
              </div>

              {/* Text Overlay */}
              <span className="absolute bottom-10 left-10 text-white text-xl font-serif tracking-widest uppercase z-10 animate-in slide-in-from-bottom-4">
                 Step 1: La Micro-Lotion De Rose
              </span>
            </>
          ) : (
            // === TRẠNG THÁI 2: ĐANG PHÁT (Hiện Video YouTube) ===
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`} // autoplay=1 để tự chạy khi hiện ra
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          )}
      </div>

      <div className="container mx-auto px-4 py-20">
         <SectionHeading title="You May Also Like" />
         <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.slice(0, 4).map(product => (
                <ProductCard key={product.id} product={product} />
            ))}
         </div>
      </div>
    </MainLayout>
  );
};