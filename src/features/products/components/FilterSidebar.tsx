import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { useState } from 'react';

// --- Tạm thời định nghĩa data bộ lọc trực tiếp ở đây để tránh lỗi ---
// --- Bạn có thể chỉnh sửa lại chữ sao cho giống hệt với trường 'category' ở BE ---
const filters = {
    categories: [
        "Sữa rửa mặt", 
        "Tẩy tế bào chết", 
        "Nước cân bằng (Toner)", 
        "Retinol", 
        "Mặt nạ & Peel da", 
        "Kem dưỡng ẩm", 
        "Kem dưỡng ban đêm", 
        "Dầu dưỡng da", 
        "Kem chống nắng", 
        "Chăm sóc mắt"
    ],
    prices: [
        { label: "Dưới 500.000đ", value: "0-500000" },
        { label: "500.000đ - 1.000.000đ", value: "500000-1000000" },
        { label: "1.000.000đ - 2.000.000đ", value: "1000000-2000000" },
        { label: "2.000.000đ - 5.000.000đ", value: "2000000-5000000" },
        { label: "Trên 5.000.000đ", value: "5000000-" }
    ]
};

// 1. Định nghĩa Props nhận từ Component cha (ProductListPage)
interface FilterSidebarProps {
    selectedCategories: string[];
    setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
    selectedPriceRanges: string[];
    setSelectedPriceRanges: React.Dispatch<React.SetStateAction<string[]>>;
}

export const FilterSidebar = ({ 
    selectedCategories, 
    setSelectedCategories, 
    selectedPriceRanges, 
    setSelectedPriceRanges 
}: FilterSidebarProps) => {
  const [openCategory, setOpenCategory] = useState(true);
  const [openPrice, setOpenPrice] = useState(true);

  // 2. Hàm xử lý khi check/uncheck Danh mục
  const handleCategoryChange = (category: string) => {
      setSelectedCategories(prev => {
          if (prev.includes(category)) {
              return prev.filter(c => c !== category); // Bỏ check
          } else {
              return [...prev, category]; // Thêm check
          }
      });
  };

  // 3. Hàm xử lý khi check/uncheck Giá
  const handlePriceChange = (value: string) => {
      setSelectedPriceRanges(prev => {
          if (prev.includes(value)) {
              return prev.filter(p => p !== value);
          } else {
              return [...prev, value];
          }
      });
  };

  // 4. Hàm xóa tất cả bộ lọc
  const clearAllFilters = () => {
      setSelectedCategories([]);
      setSelectedPriceRanges([]);
  };

  return (
    <div className="w-full pr-8 hidden md:block">
      <h3 className="text-xl font-bold font-serif mb-6">Lọc</h3>

      {/* 5. Render Nút Bộ lọc đã áp dụng MỘT CÁCH ĐỘNG */}
      {(selectedCategories.length > 0 || selectedPriceRanges.length > 0) && (
          <div className="mb-8">
            <h4 className="font-bold text-sm mb-3">Bộ lọc đã áp dụng</h4>
            <div className="flex flex-wrap gap-2 mb-3">
                {/* Nút Danh mục */}
                {selectedCategories.map(cat => (
                    <span key={cat} onClick={() => handleCategoryChange(cat)} className="inline-flex items-center text-xs border border-gray-300 px-3 py-1 rounded-full cursor-pointer hover:bg-gray-100 transition-colors">
                        {cat} <X className="w-3 h-3 ml-2"/>
                    </span>
                ))}
                {/* Nút Giá */}
                {selectedPriceRanges.map(val => {
                    // Tìm cái label (chữ hiển thị) dựa trên value
                    const priceLabel = filters.prices.find(p => p.value === val)?.label;
                    return (
                        <span key={val} onClick={() => handlePriceChange(val)} className="inline-flex items-center text-xs border border-gray-300 px-3 py-1 rounded-full cursor-pointer hover:bg-gray-100 transition-colors">
                            {priceLabel} <X className="w-3 h-3 ml-2"/>
                        </span>
                    );
                })}
            </div>
            <button onClick={clearAllFilters} className="text-xs text-accent hover:underline">Xóa tất cả bộ lọc</button>
          </div>
      )}

      {/* Toggle Out Of Stock */}
      <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-200">
         <span className="font-bold text-sm">Hàng hết hàng</span>
         <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
         </label>
      </div>

      {/* Category Accordion */}
      <div className="mb-6">
        <button onClick={() => setOpenCategory(!openCategory)} className="flex items-center justify-between w-full mb-4">
            <span className="font-bold text-accent text-sm">Loại</span>
            {openCategory ? <ChevronUp className="w-4 h-4 text-accent"/> : <ChevronDown className="w-4 h-4"/>}
        </button>
        
        {openCategory && (
            <div className="space-y-3 animate-in slide-in-from-top-2 duration-200">
                {filters.categories.map((cat, idx) => (
                    <label key={idx} className="flex items-center space-x-3 cursor-pointer group">
                        <div className="relative flex items-center">
                            {/* 6. Gắn thuộc tính checked và onChange */}
                            <input 
                                type="checkbox" 
                                checked={selectedCategories.includes(cat)}
                                onChange={() => handleCategoryChange(cat)}
                                className="peer h-4 w-4 border-2 border-gray-300 rounded-sm bg-white checked:bg-primary checked:border-primary focus:outline-none transition-all" 
                            />
                        </div>
                        <span className="text-sm text-gray-600 group-hover:text-primary">{cat}</span>
                    </label>
                ))}
            </div>
        )}
      </div>

      {/* Price Accordion */}
      <div className="mb-6 pt-6 border-t border-gray-200">
        <button onClick={() => setOpenPrice(!openPrice)} className="flex items-center justify-between w-full mb-4">
            <span className="font-bold text-accent text-sm">Giá</span>
            {openPrice ? <ChevronUp className="w-4 h-4 text-accent"/> : <ChevronDown className="w-4 h-4"/>}
        </button>
        
        {openPrice && (
            <div className="space-y-3 animate-in slide-in-from-top-2 duration-200">
                {filters.prices.map((price, idx) => (
                    <label key={idx} className="flex items-center space-x-3 cursor-pointer group">
                        {/* 7. Gắn thuộc tính checked và onChange */}
                        <input 
                            type="checkbox" 
                            checked={selectedPriceRanges.includes(price.value)}
                            onChange={() => handlePriceChange(price.value)}
                            className="h-4 w-4 border-gray-300 rounded text-primary focus:ring-primary" 
                        />
                        <span className="text-sm text-gray-600 group-hover:text-primary">{price.label}</span>
                    </label>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};