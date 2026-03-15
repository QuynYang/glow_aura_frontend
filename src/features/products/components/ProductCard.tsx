import React from 'react';
import { ShoppingCart, Heart } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export interface Product {
  id: number;
  name: string;
  price: number;
  image?: string;
  imageUrl?: string;
  brand?: string;
  description?: string;
  tag?: string;
}

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    console.log("Action button clicked");
  };

  return (
    <div 
      onClick={handleCardClick}
      className="group cursor-pointer flex flex-col h-full relative"
    >
      {/* Image Section */}
      <div className="relative overflow-hidden mb-3 aspect-[3/4] bg-gray-100">
        <img 
          src={product.imageUrl || product.image} 
    alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Tag (New/Hot) */}
        {product.tag && (
            <span className="absolute top-2 left-2 bg-white/90 text-[10px] font-bold px-2 py-1 uppercase tracking-wider">
                {product.tag}
            </span>
        )}

        {/* Action Buttons */}
        <div className="absolute bottom-4 left-0 right-0 px-4 flex gap-2 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
             
             {/* Nút Add To Cart */}
             <Button 
                variant="solid-white" 
                className="flex-1 text-xs py-2 shadow-lg"
                onClick={handleActionClick} // Gắn hàm chặn click
             >
                Thêm vào giỏ hàng
             </Button>

             {/* Nút Wishlist */}
             <button 
                className="bg-white p-2 text-gray-900 hover:bg-primary hover:text-white shadow-lg transition-colors"
                onClick={handleActionClick} // Gắn hàm chặn click
             >
                <Heart className="w-4 h-4" />
             </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-grow space-y-1">
        {/* Brand */}
        {product.brand && (
            <p className="text-xs font-bold text-accent uppercase tracking-wide">
                {product.brand}
            </p>
        )}

        {/* Name */}
        <h3 className="text-sm font-bold text-gray-900 leading-snug group-hover:text-primary transition-colors">
            {product.name}
        </h3>

        {/* Description (cho trang List) */}
        {product.description && (
            <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">
                {product.description}
            </p>
        )}
        
        {/* Price */}
        <div className="text-sm font-medium text-gray-900">
            {/* Sử dụng toLocaleString('vi-VN') để hiển thị dạng 1.000.000 */}
            {product.price.toLocaleString('vi-VN')}đ
        </div>
      </div>
    </div>
  );
};