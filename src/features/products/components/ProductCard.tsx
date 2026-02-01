import { ShoppingCart, Heart } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

// 1. Định nghĩa kiểu dữ liệu chuẩn cho toàn dự án
export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  brand?: string;       // Thêm dấu ? để không bắt buộc
  description?: string; // Thêm dấu ? (Dùng cho trang danh sách)
  tag?: string;         // Thêm dấu ?
}

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="group cursor-pointer flex flex-col h-full">
      {/* Image Section */}
      <div className="relative overflow-hidden mb-3 aspect-[3/4] bg-gray-100">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Tag (New/Hot) */}
        {product.tag && (
            <span className="absolute top-2 left-2 bg-white/90 text-[10px] font-bold px-2 py-1 uppercase tracking-wider">
                {product.tag}
            </span>
        )}

        {/* Action Buttons (Hiện khi hover) */}
        <div className="absolute bottom-4 left-0 right-0 px-4 flex gap-2 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
             <Button className="flex-1 bg-white text-gray-900 hover:bg-primary hover:text-white text-xs py-2 shadow-lg">
                Add To Cart
             </Button>
             <button className="bg-white p-2 text-gray-900 hover:bg-primary hover:text-white shadow-lg transition-colors">
                <Heart className="w-4 h-4" />
             </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-grow space-y-1">
        {/* Nếu có Brand thì hiện, không có thì ẩn đi */}
        {product.brand && (
            <p className="text-xs font-bold text-accent uppercase tracking-wide">
                {product.brand}
            </p>
        )}

        <h3 className="text-sm font-bold text-gray-900 leading-snug group-hover:text-primary transition-colors">
            {product.name}
        </h3>

        {/* Nếu có Description thì hiện (Dành cho trang List) */}
        {product.description && (
            <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">
                {product.description}
            </p>
        )}
        
        <div className="mt-auto pt-2">
            <p className="text-sm font-medium text-gray-900">
                ${product.price.toFixed(2)}
            </p>
        </div>
      </div>
    </div>
  );
};