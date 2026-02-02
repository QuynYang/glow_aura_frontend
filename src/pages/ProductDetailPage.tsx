import { useState } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { ProductGallery } from '../features/products/components/detail/ProductGallery';
import { ProductInfo } from '../features/products/components/detail/ProductInfo';
import { ProductTabs } from '../features/products/components/detail/ProductTabs';
import { BeforeAfterSection } from '../features/products/components/detail/BeforeAfterSection';
import { SectionHeading } from '../components/ui/SectionHeading';
import { ProductCard } from '../features/products/components/ProductCard';
import { singleProduct, products } from '../data/mockData';
// Import component còn thiếu
import { ProductReviews } from '../features/products/components/detail/ProductReviews';
import { SkincareRoutine } from '../features/products/components/detail/SkincareRoutine';

export const ProductDetailPage = () => {
  // State kiểm soát video
  const [isPlaying, setIsPlaying] = useState(false);
  const videoId = "0YPJMxnpxdA";

  return (
    <MainLayout>
      {/* 1. Phần thông tin chính */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <ProductGallery images={singleProduct.images} />
            <ProductInfo />
        </div>
        <ProductTabs />
      </div>

      {/* 2. Before/After Section */}
      <BeforeAfterSection />

      {/* 3. Video Section */}
      <div 
        className="relative h-[500px] w-full bg-black mt-16 group cursor-pointer overflow-hidden"
        onClick={() => setIsPlaying(true)}
      >
          {!isPlaying ? (
            <>
              <img 
                src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`} 
                className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                alt="Video Thumbnail"
              />
              <div className="absolute inset-0 flex items-center justify-center z-10">
                 <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white group-hover:scale-110 transition-transform duration-300">
                    <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[15px] border-l-white border-b-[10px] border-b-transparent ml-1"></div>
                 </div>
              </div>
              <span className="absolute bottom-10 left-10 text-white text-xl font-serif tracking-widest uppercase z-10 animate-in slide-in-from-bottom-4">
                 Bước 1: La Micro-Lotion De Rose
              </span>
            </>
          ) : (
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          )}
      </div>

      {/* === 4. THÊM MỚI: Phần Đánh giá (Review) === */}
      <ProductReviews />

      {/* === 5. THÊM MỚI: Phần Quy trình dưỡng da (Routine) === */}
      <SkincareRoutine />

      {/* 6. You May Also Like */}
      <div className="container mx-auto px-4 py-20">
         <SectionHeading title="Bạn cũng có thể thích" />
         <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.slice(0, 4).map(product => (
                <ProductCard key={product.id} product={product} />
            ))}
         </div>
      </div>
    </MainLayout>
  );
};