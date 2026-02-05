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

// Mock data (Đã Việt hóa tag)
const bestSellers = [
  { id: 1, brand: 'Dior', name: 'Capture Totale Dream Skin', price: 76.00, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600' },
  { id: 2, brand: 'Chanel', name: 'N°5 Eau de Parfum', price: 135.00, image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=600', tag: 'Bán Chạy' },
  { id: 3, brand: 'Estee Lauder', name: 'Advanced Night Repair', price: 110.00, image: 'https://product.hstatic.net/1000209952/product/z4930630178742_89d5ef0e650d66386b039f40c5cf5892_b7b4388486564c3b8f5581bfb30fa499_grande.jpg' },
  { id: 4, brand: 'YSL', name: 'Libre Eau de Parfum', price: 95.00, image: 'https://cdn.vuahanghieu.com/unsafe/0x900/left/top/smart/filters:quality(90)/https://admin.vuahanghieu.com/upload/product/2024/06/nuoc-hoa-nu-yves-saint-laurent-ysl-libre-edp-90ml-66696f319f3fd-12062024164937.jpg' },
];

export const HomePage = () => {
  return (
    <MainLayout>
      {/* 1. Hero Banner */}
      <HeroBanner />

      {/* 2. Danh mục sản phẩm */}
      <CategoryGrid />

      <BrandPhilosophy />
      <FeaturedCollection />
      <NewArrivals />
      {/* 3. Promo Section */}
      <PromoSection />

      {/* 4. Best Sellers */}
      <section className="container mx-auto px-4 py-20">
        <SectionHeading title="Sản Phẩm Bán Chạy" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. Special Offers */}
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

      {/* 6. Our Brand */}
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