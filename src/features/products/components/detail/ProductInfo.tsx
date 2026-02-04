import { useState } from 'react'; // 1. Import useState để xử lý click
import { MapPin, Package, Truck, ShieldCheck, Heart } from 'lucide-react'; // 2. Import icon Heart
import { Button } from '../../../../components/ui/Button';
import { singleProduct } from '../../../../data/mockData';

export const ProductInfo = () => {
  // 3. State quản lý trạng thái yêu thích
  const [isWishlist, setIsWishlist] = useState(false);

  return (
    <div className="space-y-6">
      {/* Brand & Title */}
      <div>
        <h2 className="text-primary font-bold text-lg uppercase tracking-wider mb-2">{singleProduct.brand}</h2>
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 leading-tight mb-2">
          {singleProduct.name}
        </h1>
        <div className="flex items-center gap-3 text-xs text-gray-500 font-medium uppercase tracking-wide">
            {singleProduct.tags.map(tag => (
                <span key={tag} className="border-r border-gray-300 pr-3 last:border-0">{tag}</span>
            ))}
        </div>
      </div>

      <p className="text-gray-600 text-sm">{singleProduct.description}</p>

      {/* Price & Size */}
      <div className="border-t border-b border-gray-100 py-6">
        <div className="flex justify-between items-center mb-4">
            <span className="text-3xl font-bold text-gray-900">${singleProduct.price.toFixed(2)}</span>
        </div>
        
        {/* Size Selector Mockup */}
        <div className="relative">
            <select className="w-full border-b border-gray-300 py-3 text-sm font-medium bg-transparent outline-none cursor-pointer appearance-none">
                {singleProduct.sizes.map(size => (
                    <option key={size} value={size}>{size} - ${singleProduct.price.toFixed(2)}</option>
                ))}
            </select>
        </div>
      </div>

      {/* 4. Action Buttons: Gồm nút Kiểm tra kho + Nút Tim */}
      <div className="flex gap-4">
        {/* Nút chính */}
        <Button className="flex-1 py-4 text-sm font-bold bg-[#A41C4E] hover:bg-[#8a1640]">
            <MapPin className="w-4 h-4 mr-2" />
            Kiểm tra kho hàng tại các chi nhánh
        </Button>

        {/* Nút Trái tim Yêu thích */}
        <button 
            onClick={() => setIsWishlist(!isWishlist)}
            className={`w-14 flex items-center justify-center border transition-all duration-300 rounded-sm
                ${isWishlist 
                    ? 'border-[#A41C4E] bg-[#A41C4E] text-white' // Khi đã thích: Nền đỏ đậm, tim trắng
                    : 'border-gray-300 text-gray-400 hover:border-[#A41C4E] hover:text-[#A41C4E]' // Khi chưa thích: Viền xám
                }
            `}
            title={isWishlist ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
        >
            {/* fill-current giúp icon tô màu đặc khi class cha có text-white */}
            <Heart className={`w-6 h-6 ${isWishlist ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Benefits (Các dòng hồng nhạt) */}
      <div className="bg-[#FFF0F5] p-4 space-y-3 rounded-sm">
        <div className="flex items-center gap-3 text-xs text-[#A41C4E] font-medium">
            <Package className="w-4 h-4" /> Nhận ngay 2 mẫu thử miễn phí khi mua hàng trị giá $100
        </div>
        <div className="flex items-center gap-3 text-xs text-[#A41C4E] font-medium">
            <Truck className="w-4 h-4" /> Nhận ngay 2 đô la khi trả lại 5 hộp đựng rỗng
        </div>
        <div className="flex items-center gap-3 text-xs text-[#A41C4E] font-medium">
            <ShieldCheck className="w-4 h-4" /> Nhận tư vấn chuyên gia trực tiếp miễn phí tại các chi nhánh
        </div>
      </div>
    </div>
  );
};