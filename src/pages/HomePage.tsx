import { MainLayout } from '../components/layout/MainLayout';
import { HeroBanner } from '../features/home/components/HeroBanner';
import { CategoryGrid } from '../features/home/components/CategoryGrid';
import { PromoSection } from '../features/home/components/PromoSection';
import { ProductCard } from '../features/products/components/ProductCard';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Button } from '../components/ui/Button';

// Mock data
const bestSellers = [
  { id: 1, brand: 'Dior', name: 'Capture Totale Dream Skin', price: 76.00, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600' },
  { id: 2, brand: 'Chanel', name: 'N°5 Eau de Parfum', price: 135.00, image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=600', tag: 'Hot' },
  { id: 3, brand: 'Estee Lauder', name: 'Advanced Night Repair', price: 110.00, image: 'https://images.unsplash.com/photo-1571781308847-a8434045d3e8?q=80&w=600' },
  { id: 4, brand: 'YSL', name: 'Libre Eau de Parfum', price: 95.00, image: 'https://images.unsplash.com/photo-1620917670397-a3313437ef78?q=80&w=600' },
];

export const HomePage = () => {
  return (
    <MainLayout>
      {/* 1. Hero Banner */}
      <HeroBanner />

      {/* 2. Danh mục sản phẩm */}
      <CategoryGrid />

      {/* 3. Promo Section */}
      <PromoSection />

      {/* 4. Best Sellers */}
      <section className="container mx-auto px-4 py-20">
        <SectionHeading title="Our Best Sellers" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. Special Offers */}
      <section className="bg-[#F9F1F0] py-16">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-10">
           <div className="w-full md:w-1/2">
              <img src="https://images.unsplash.com/photo-1596462502278-27bfdd403348?q=80&w=800" alt="Special Offer" className="rounded shadow-lg" />
           </div>
           <div className="w-full md:w-1/2 space-y-4">
              <h4 className="font-bold text-gray-500">Special Offers</h4>
              <h2 className="text-4xl font-serif font-bold text-primary">Save Up To 50%</h2>
              <p className="text-gray-600">Mother's Day Is Coming! For Everything She's Given You, It's Time To Give Back.</p>
              <Button className="bg-accent text-white hover:bg-primary mt-4">Find Branches</Button>
           </div>
        </div>
      </section>

      {/* 6. Our Brand */}
      <section className="grid grid-cols-1 md:grid-cols-2">
         <div className="bg-primary text-white p-16 flex flex-col justify-center items-start">
            <h2 className="text-3xl font-serif font-bold mb-4">Our Brand</h2>
            <p className="mb-8 text-gray-300 leading-relaxed">
               We Believe That Beauty Thrives In Diversity And Discovery. Our Purpose Is To Expand The Way The World Sees Beauty.
            </p>
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
               Discover More
            </Button>
         </div>
         <div className="h-[400px]">
            <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800" className="w-full h-full object-cover" alt="Brand" />
         </div>
      </section>

    </MainLayout>
  );
};