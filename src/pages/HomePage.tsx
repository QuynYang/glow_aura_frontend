import { useState, useEffect } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { HeroBanner } from '../features/home/components/HeroBanner';
import { CategoryGrid } from '../features/home/components/CategoryGrid';
import { PromoSection } from '../features/home/components/PromoSection';
import { ProductCard } from '../features/products/components/ProductCard';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Button } from '../components/ui/Button';
import { FeaturedCollection } from '../features/home/components/FeaturedCollection';
import { BrandPhilosophy } from '../features/home/components/BrandPhilosophy';
import { NewArrivals } from '../features/home/components/NewArrivals';
import { productService } from '../services/productService'; 
import { Loader2 } from 'lucide-react'; 

export const HomePage = () => {
  const [bestSellers, setBestSellers] = useState<any[]>([]);
  const [latestProducts, setLatestProducts] = useState<any[]>([]);
  // 1. Thêm State lưu danh sách Flash Sale
  const [flashSaleProducts, setFlashSaleProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // 2. Gọi 2 API cùng lúc để tối ưu hiệu năng
        const [allData, flashSaleData] = await Promise.all([
            productService.getAll(),
            productService.getFlashSale()
        ]);

        // Xử lý dữ liệu sản phẩm chung
        const productsArray = Array.isArray(allData) ? allData : (allData?.items || allData?.data || []);
        setBestSellers(productsArray.slice(0, 4));

        const sortedByNewest = [...productsArray].sort((a, b) => b.id - a.id);
        setLatestProducts(sortedByNewest.slice(0, 2));

        // Xử lý dữ liệu Flash Sale
        const flashSaleArray = Array.isArray(flashSaleData) ? flashSaleData : (flashSaleData?.items || flashSaleData?.data || []);
        setFlashSaleProducts(flashSaleArray.slice(0, 4)); 

      } catch (error) {
        console.error("Không tải được sản phẩm", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <MainLayout>
      <HeroBanner />
      <CategoryGrid />
      <BrandPhilosophy />
      <FeaturedCollection />
      
      <NewArrivals products={latestProducts} />
      
      <PromoSection />

      {/* 3. SECTION FLASH SALE MỚI THÊM VÀO */}
      {flashSaleProducts.length > 0 && (
          <section className="container mx-auto px-4 pt-20 pb-10">
             <div className="flex justify-between items-center mb-8 border-b border-red-100 pb-4">
                 <h2 className="text-3xl font-serif font-bold text-red-600 flex items-center gap-2">
                     <span className="animate-pulse">⚡</span> FLASH SALE SỐC
                 </h2>
                 
             </div>
             
             {isLoading ? (
                 <div className="flex justify-center items-center py-10">
                     <Loader2 className="w-8 h-8 animate-spin text-red-600" />
                 </div>
             ) : (
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                   {flashSaleProducts.map((product) => (
                     <ProductCard key={`flash-${product.id}`} product={product} />
                   ))}
                 </div>
             )}
          </section>
      )}

      {/* SECTION BÁN CHẠY  */}
      <section className="container mx-auto px-4 py-10">
        <SectionHeading title="Sản Phẩm Bán Chạy" />
        
        {isLoading ? (
            <div className="flex justify-center items-center py-10">
                <Loader2 className="w-8 h-8 animate-spin text-[#3D021E]" />
            </div>
        ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {bestSellers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
        )}
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-10">
           <div className="w-full md:w-1/2">
              <img src="https://i0.wp.com/www.breastofus.com/wp-content/uploads/2020/05/baddiemakeup2.jpg?fit=512%2C512&ssl=1" alt="Special Offer" className="rounded shadow-lg" />
           </div>
           <div className="w-full md:w-1/2 space-y-4">
              <h4 className="font-bold text-gray-500">Ưu đãi đặc biệt</h4>
              <h2 className="text-4xl font-serif font-bold text-[#3D021E]">Giảm giá tới 50%</h2>
              <p className="text-gray-600">
                Mừng Ngày của Mẹ! Hãy dành tặng sự chăm sóc tốt nhất để tri ân người phụ nữ tuyệt vời nhất của bạn.
              </p>
              <Button className="bg-accent text-white hover:bg-[#3D021E] mt-4 transition-colors">
                Tìm hiểu thêm
              </Button>
           </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2">
         <div className="bg-[#3D021E] text-white p-16 flex flex-col justify-center items-start">
            <h2 className="text-3xl font-serif font-bold mb-4">Về chúng tôi</h2>
            <p className="mb-8 text-gray-300 leading-relaxed">
               Chúng tôi tin rằng vẻ đẹp thăng hoa từ sự đa dạng và khám phá. Sứ mệnh của chúng tôi là mở rộng góc nhìn của thế giới về cái đẹp.
            </p>
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-[#3D021E] transition-colors">
               Khám phá thêm
            </Button>
         </div>
         <div className="h-[400px]">
            <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800" className="w-full h-full object-cover" alt="Brand" />
         </div>
      </section>
    </MainLayout>
  );
};