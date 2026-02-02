import { ProductCard } from '../../products/components/ProductCard';
import { VirtualAnalysisCard } from './VirtualAnalysisCard';
import { SectionHeading } from '../../../components/ui/SectionHeading';

// Mock Data chuẩn theo ảnh bạn gửi (Dior Lotion & Capture Youth)
const newArrivals = [
  { 
    id: 101, 
    brand: 'Dior', 
    name: 'Tinh chất dưỡng da Beautya La Mousse Off/On', 
    price: 520.00, 
    image: 'https://cdn.vuahanghieu.com/unsafe/0x900/left/top/smart/filters:quality(90)/https://admin.vuahanghieu.com/upload/product/2023/05/sua-rua-mat-ket-hop-tay-trang-dior-prestige-la-mousse-micellaire-nettoyant-120g-646acb5b0aa85-22052023085435.jpg', // Thay bằng ảnh lọ vàng nếu có
    description: 'Tinh chất dưỡng da chống lão hóa, với chiết xuất hoa súng Pháp thanh lọc'
  },
  { 
    id: 102, 
    brand: 'Dior', 
    name: 'Sữa rửa mặt tạo bọt Beautya La Mousse Off/On', 
    price: 65.00, 
    image: 'https://cdn.vuahanghieu.com/unsafe/0x0/left/top/smart/filters:quality(90)/https://admin.vuahanghieu.com/upload/news/content/2024/03/sua-rua-mat-tao-bot-dior-la-mousse-off-on-foaming-cleanser-01-jpg-1710754526-18032024163526.jpg', // Thay bằng ảnh lọ trắng nếu có
    description: 'Sữa rửa mặt tạo bọt chống ô nhiễm với chiết xuất hoa súng Pháp thanh lọc'
  }
];

export const NewArrivals = () => {
  return (
    <section className="container mx-auto px-4 py-16">
      {/* Tiêu đề Section */}
      <SectionHeading title="Hàng mới về" />
      
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