import { useState } from 'react'; 
import { ShoppingCart, MapPin, Package, Truck, ShieldCheck, Heart } from 'lucide-react'; 
import { Button } from '../../../../components/ui/Button';
import { useCart } from '../../../../context/CartContext';


// 1. Khai báo cổng nhận dữ liệu product
interface ProductInfoProps {
    product: any;
}

export const ProductInfo = ({ product }: ProductInfoProps) => {
  const [isWishlist, setIsWishlist] = useState(false);
    const { addToCart } = useCart();
  // Xử lý an toàn: Nếu Backend chưa có mảng tags hoặc sizes, ta dùng mảng mặc định để UI không vỡ
  const tags = product.tags || ['Mới', 'Bán chạy'];
  const sizes = product.sizes || ['Tiêu chuẩn'];

  return (
    <div className="space-y-6">
      {/* Brand & Title */}
      <div>
        <h2 className="text-primary font-bold text-lg uppercase tracking-wider mb-2">
            {product.brandName || product.category || 'Glow Aura'}
        </h2>
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 leading-tight mb-2">
          {product.name}
        </h1>
        <div className="flex items-center gap-3 text-xs text-gray-500 font-medium uppercase tracking-wide">
            {tags.map((tag: string) => (
                <span key={tag} className="border-r border-gray-300 pr-3 last:border-0">{tag}</span>
            ))}
        </div>
      </div>

      <p className="text-gray-600 text-sm">{product.description}</p>

      {/* Price & Size */}
      <div className="border-t border-b border-gray-100 py-6">
        <div className="flex justify-between items-center mb-4">
            <span className="text-3xl font-bold text-gray-900">
                {product.price?.toLocaleString('vi-VN')}đ
            </span>
        </div>
        
        {/* Size Selector Mockup */}
        <div className="relative">
            <select className="w-full border-b border-gray-300 py-3 text-sm font-medium bg-transparent outline-none cursor-pointer appearance-none">
                {sizes.map((size: string) => (
                    <option key={size} value={size}>{size} - {product.price?.toLocaleString('vi-VN')}đ</option>
                ))}
            </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button 
        onClick={() => addToCart(product, 1)} // Gọi hàm thêm 1 sản phẩm
        className="flex-1 py-4 text-sm font-bold bg-[#A41C4E] hover:bg-[#8a1640]"
      >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Thêm vào giỏ hàng
      </Button>

        <button 
            onClick={() => setIsWishlist(!isWishlist)}
            className={`w-14 flex items-center justify-center border transition-all duration-300 rounded-sm
                ${isWishlist 
                    ? 'border-[#A41C4E] bg-[#A41C4E] text-white' 
                    : 'border-gray-300 text-gray-400 hover:border-[#A41C4E] hover:text-[#A41C4E]'
                }
            `}
            title={isWishlist ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
        >
            <Heart className={`w-6 h-6 ${isWishlist ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Benefits */}
      <div className="bg-[#FFF0F5] p-4 space-y-3 rounded-sm">
        <div className="flex items-center gap-3 text-xs text-[#A41C4E] font-medium">
            <Package className="w-4 h-4" /> Nhận ngay 2 mẫu thử miễn phí khi mua hàng trị giá 300.000 VNĐ
        </div>
        <div className="flex items-center gap-3 text-xs text-[#A41C4E] font-medium">
            <Truck className="w-4 h-4" /> Nhận ngay 50.000 VNĐ khi trả lại 5 hộp đựng rỗng
        </div>
        <div className="flex items-center gap-3 text-xs text-[#A41C4E] font-medium">
            <ShieldCheck className="w-4 h-4" /> Nhận tư vấn chuyên gia trực tiếp miễn phí tại các chi nhánh
        </div>
      </div>
    </div>
  );
};