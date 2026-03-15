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
  // 1. Thêm State lưu hàng mới về
  const [latestProducts, setLatestProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getAll();
        const productsArray = Array.isArray(data) ? data : (data.items || data.data || []);
        
        // Tạm thời lấy 4 sản phẩm đầu tiên làm Best Sellers
        setBestSellers(productsArray.slice(0, 4));

        // 2. Logic lấy hàng mới về: Sắp xếp ID giảm dần (mới nhất lên đầu), lấy 2 cái
        const sortedByNewest = [...productsArray].sort((a, b) => b.id - a.id);
        setLatestProducts(sortedByNewest.slice(0, 2));

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
      
      {/* 3. Truyền danh sách 2 sản phẩm mới nhất vào NewArrivals */}
      <NewArrivals products={latestProducts} />
      
      <PromoSection />

      <section className="container mx-auto px-4 py-20">
        <SectionHeading title="Sản Phẩm Bán Chạy" />
        
        {isLoading ? (
            <div className="flex justify-center items-center py-10">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
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
              <h2 className="text-4xl font-serif font-bold text-primary">Giảm giá tới 50%</h2>
              <p className="text-gray-600">
                Mừng Ngày của Mẹ! Hãy dành tặng sự chăm sóc tốt nhất để tri ân người phụ nữ tuyệt vời nhất của bạn.
              </p>
              <Button className="bg-accent text-white hover:bg-primary mt-4">
                Tìm hiểu thêm
              </Button>
           </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2">
         <div className="bg-primary text-white p-16 flex flex-col justify-center items-start">
            <h2 className="text-3xl font-serif font-bold mb-4">Về chúng tôi</h2>
            <p className="mb-8 text-gray-300 leading-relaxed">
               Chúng tôi tin rằng vẻ đẹp thăng hoa từ sự đa dạng và khám phá. Sứ mệnh của chúng tôi là mở rộng góc nhìn của thế giới về cái đẹp.
            </p>
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
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