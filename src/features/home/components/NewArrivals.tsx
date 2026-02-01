import { ProductCard } from '../../products/components/ProductCard';
import { VirtualAnalysisCard } from './VirtualAnalysisCard';
import { SectionHeading } from '../../../components/ui/SectionHeading';

// Mock Data chuẩn theo ảnh bạn gửi (Dior Lotion & Capture Youth)
const newArrivals = [
  { 
    id: 101, 
    brand: 'Dior', 
    name: 'Beautya Prestige La Mousse Micellaire', 
    price: 520.00, 
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600', // Thay bằng ảnh lọ vàng nếu có
    description: 'Anti-Aging Face Serum, With Purifying French Water Lily'
  },
  { 
    id: 102, 
    brand: 'Dior', 
    name: 'Beautya La Mousse Off/On Foaming Cleaner', 
    price: 65.00, 
    image: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=600', // Thay bằng ảnh lọ trắng nếu có
    description: 'Anti-Pollution Foaming Cleanser With Purifying French Water Lily'
  }
];

export const NewArrivals = () => {
  return (
    <section className="container mx-auto px-4 py-16">
      {/* Tiêu đề Section */}
      <SectionHeading title="New Arrivals" />
      
      {/* Grid 3 cột: 2 Sản phẩm + 1 Thẻ Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Render 2 sản phẩm đầu tiên */}
        {newArrivals.map((product) => (
           <div key={product.id} className="h-full">
              <ProductCard product={product} />
           </div>
        ))}

        {/* Cột 3: Thẻ Analysis */}
        <div className="h-full">
            <VirtualAnalysisCard />
        </div>

      </div>
    </section>
  );
};