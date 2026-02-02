import { Search, X } from 'lucide-react';
import { useEffect } from 'react';

// 1. Mock Data cho giao diện tìm kiếm (Đã Việt hóa)
const searchData = {
  trending: [
    "Kem dưỡng ban đêm", "Mặt nạ", "Kem dưỡng ẩm", "Tinh chất Serum"
  ],
  recent: [
    "Tinh chất dưỡng da", "Kem dưỡng mắt"
  ],
  popularProducts: [
    {
      id: 1,
      brand: "Beautya Prestige La",
      name: "Mousse Micellaire",
      description: "Son bóng làm căng mọng môi - Hiệu quả tức thì và lâu dài - Cấp ẩm suốt 24h",
      image: "https://meihouse.vn/thumbs/600x760x1/upload/product/screen-shot-2024-05-14-at-130121-2357.png"
    },
    {
      id: 2,
      brand: "Beautya Prestige La",
      name: "Mousse Micellaire",
      description: "Son bóng làm căng mọng môi - Hiệu quả tức thì và lâu dài - Cấp ẩm suốt 24h",
      image: "https://m.esteelauder.co.id/media/export/cms/splashpage/splashpage_module_3_a.jpg"
    },
    {
      id: 3,
      brand: "Beautya Prestige La",
      name: "Mousse Micellaire",
      description: "Son bóng làm căng mọng môi - Hiệu quả tức thì và lâu dài - Cấp ẩm suốt 24h",
      image: "https://bonita.vn/wp-content/uploads/2019/10/319319711_8501465356591854_5537683614421960567_n.jpg"
    },
    {
      id: 4,
      brand: "Beautya Prestige La",
      name: "Mousse Micellaire",
      description: "Son bóng làm căng mọng môi - Hiệu quả tức thì và lâu dài - Cấp ẩm suốt 24h",
      image: "https://vilip.vn/wp-content/uploads/2022/07/tinh-chat-phuc-hoi-da-ban-dem-estee-lauder-advanced-night-repair-intense-reset-concentrate-4.png"
    }
  ]
};

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchOverlay = ({ isOpen, onClose }: SearchOverlayProps) => {
  // Khi mở overlay, cấm body cuộn
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white z-[60] overflow-y-auto animate-in fade-in duration-200">
      <div className="container mx-auto px-4 py-8">
        
        {/* 1. Header của Search (Nút đóng và Input) */}
        <div className="flex justify-end mb-4">
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-8 h-8 text-gray-500" />
            </button>
        </div>

        <div className="max-w-6xl mx-auto">
            {/* Search Input khổng lồ */}
            <div className="relative mb-12 border-b border-gray-300 pb-4">
                <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Bạn đang tìm kiếm gì?" 
                    className="w-full pl-10 pr-4 py-2 text-3xl font-serif text-gray-900 placeholder:text-gray-300 outline-none"
                    autoFocus
                />
            </div>

            {/* 2. Layout chia cột */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                
                {/* Cột trái: Trending & Recent */}
                <div className="col-span-1 space-y-10">
                    <div>
                        <h3 className="font-bold text-lg mb-4">Đang thịnh hành</h3>
                        <ul className="space-y-3">
                            {searchData.trending.map(item => (
                                <li key={item}>
                                    <a href="#" className="text-gray-600 hover:text-primary font-medium">{item}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-4">Lịch sử tìm kiếm</h3>
                        <ul className="space-y-3">
                            {searchData.recent.map(item => (
                                <li key={item}>
                                    <a href="#" className="text-gray-600 hover:text-primary font-medium">{item}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Cột phải: Popular Products Grid */}
                <div className="col-span-3">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg">Sản phẩm nổi bật</h3>
                        <a href="#" className="text-accent text-sm font-bold hover:underline">Xem tất cả</a>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {searchData.popularProducts.map((product) => (
                            <div key={product.id} className="group cursor-pointer">
                                <div className="aspect-[3/4] overflow-hidden bg-gray-50 mb-3">
                                    <img 
                                        src={product.image} 
                                        alt={product.name} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-accent uppercase">{product.brand}</p>
                                    <h4 className="text-sm font-bold text-gray-900">{product.name}</h4>
                                    <p className="text-[10px] text-gray-500 line-clamp-3 leading-relaxed">
                                        {product.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
      </div>
    </div>
  );
};