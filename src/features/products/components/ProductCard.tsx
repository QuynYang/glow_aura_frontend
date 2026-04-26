import React from 'react';
import { ShoppingCart, Heart } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../context/CartContext'; // Đưa Context vào đây

export interface Product {
  id: number | string;
  name: string;
  price: number;
  discountedPrice?: number; 
  image?: string;
  imageUrl?: string;
  brand?: string;
  description?: string;
  tag?: string;
  color?: string;
  size?: string;
}

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();
  // Lấy hàm addToCart từ Context
  const { addToCart } = useCart();

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  // Hàm xử lý Thêm vào giỏ hàng DÙNG CONTEXT
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Ngăn chuyển trang

    // Ưu tiên truyền giá đã giảm (nếu có Flash Sale)
    const productToAdd = {
        ...product,
        price: product.discountedPrice || product.price,
        imageUrl: product.imageUrl || product.image
    };

    addToCart(productToAdd, 1);
  };

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    alert(`Đã thêm "${product.name}" vào danh sách yêu thích!`);
  };

  const displayPrice = product.discountedPrice || product.price;
  const hasDiscount = product.discountedPrice && product.discountedPrice < product.price;

  return (
    <div 
      onClick={handleCardClick}
      className="group cursor-pointer flex flex-col h-full relative"
    >
      <div className="relative overflow-hidden mb-3 aspect-[3/4] bg-gray-100 border border-gray-100 rounded-xl">
        <img 
          src={product.imageUrl || product.image || "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=200"} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 mix-blend-multiply"
        />
        
        {product.tag && (
            <span className="absolute top-2 left-2 bg-white/90 text-gray-900 text-[10px] font-bold px-3 py-1 uppercase tracking-wider rounded-sm shadow-sm">
                {product.tag}
            </span>
        )}
        {hasDiscount && !product.tag && (
            <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-3 py-1 uppercase tracking-wider rounded-sm shadow-sm">
                SALE
            </span>
        )}

        <div className="absolute bottom-4 left-0 right-0 px-4 flex gap-2 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
             <Button 
                variant="solid-white" 
                className="flex-1 text-xs py-2 shadow-lg hover:bg-[#3D021E] hover:text-white transition-colors font-bold"
                onClick={handleAddToCart} 
             >
                <ShoppingCart className="w-4 h-4 mr-2 inline-block" /> Thêm vào giỏ
             </Button>
             <button 
                className="bg-white p-2 text-gray-400 hover:bg-[#3D021E] hover:text-white rounded-md shadow-lg transition-colors flex items-center justify-center"
                onClick={handleAddToWishlist} 
             >
                <Heart className="w-4 h-4" />
             </button>
        </div>
      </div>

      <div className="flex flex-col flex-grow space-y-1">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            {product.brand || 'GLOW AURA'}
        </p>
        <h3 className="text-sm font-bold text-gray-900 leading-snug group-hover:text-[#3D021E] transition-colors truncate">
            {product.name}
        </h3>
        {product.description && (
            <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">
                {product.description}
            </p>
        )}
        <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-bold text-gray-900">
                {displayPrice.toLocaleString('vi-VN')}đ
            </span>
            {hasDiscount && (
                <span className="text-xs text-gray-400 line-through">
                    {product.price.toLocaleString('vi-VN')}đ
                </span>
            )}
        </div>
      </div>
    </div>
  );
};