import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Thêm để lấy ID từ URL
import { MainLayout } from '../components/layout/MainLayout';
import { ProductGallery } from '../features/products/components/detail/ProductGallery';
import { ProductInfo } from '../features/products/components/detail/ProductInfo';
import { ProductTabs } from '../features/products/components/detail/ProductTabs';
import { BeforeAfterSection } from '../features/products/components/detail/BeforeAfterSection';
import { SectionHeading } from '../components/ui/SectionHeading';
import { ProductCard } from '../features/products/components/ProductCard';
import { ProductReviews } from '../features/products/components/detail/ProductReviews';
import { SkincareRoutine } from '../features/products/components/detail/SkincareRoutine';
import { productService } from '../services/productService';
import { Loader2 } from 'lucide-react';

export const ProductDetailPage = () => {
  // 1. Lấy ID sản phẩm từ URL 
  const { id } = useParams<{ id: string }>();

  // 2. State quản lý dữ liệu sản phẩm
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State kiểm soát video
  const [isPlaying, setIsPlaying] = useState(false);
  const videoId = "0YPJMxnpxdA";

  // 3. Gọi API khi tải trang hoặc khi ID thay đổi
  useEffect(() => {
    const fetchProductDetails = async () => {
      setIsLoading(true);
      try {
        // Gọi API lấy chi tiết sản phẩm
        if (id) {
          const data = await productService.getById(id);
          setProduct(data.data || data);
        }
        
        const allData = await productService.getAll();
        const productsArray = Array.isArray(allData) ? allData : (allData.items || allData.data || []);
        setRelatedProducts(productsArray);

      } catch (error) {
        console.error("Lỗi khi tải chi tiết sản phẩm:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  // Nếu đang tải dữ liệu, hiện màn hình loading
  if (isLoading) {
      return (
          <MainLayout>
              <div className="flex justify-center items-center min-h-[60vh]">
                  <Loader2 className="w-12 h-12 animate-spin text-primary" />
              </div>
          </MainLayout>
      );
  }

  // Nếu không tìm thấy sản phẩm (ID không hợp lệ)
  if (!product) {
      return (
          <MainLayout>
              <div className="flex flex-col items-center justify-center min-h-[60vh]">
                  <h2 className="text-2xl font-bold font-serif mb-4">Không tìm thấy sản phẩm</h2>
                  <p className="text-gray-500">Sản phẩm bạn tìm kiếm không tồn tại hoặc đã bị xóa.</p>
              </div>
          </MainLayout>
      );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <ProductGallery product={product} />
            <ProductInfo product={product} />
        </div>
        
        <ProductTabs product={product} />
      </div>

      <BeforeAfterSection />

      {/* Video Section */}
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
                 Bước 1: Khám phá công dụng
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

      <ProductReviews />
      <SkincareRoutine />

      <div className="container mx-auto px-4 py-20">
         <SectionHeading title="Bạn cũng có thể thích" />
         <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.slice(0, 4).map(p => (
                <ProductCard key={p.id} product={p} />
            ))}
         </div>
      </div>
    </MainLayout>
  );
};