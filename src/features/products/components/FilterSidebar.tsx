import { ChevronDown, ChevronUp, X, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { productService } from '../../../services/productService'; // Import API gọi danh mục

const filters = {
    prices: [
        { label: "Dưới 500.000đ", value: "0-500000" },
        { label: "500.000đ - 1.000.000đ", value: "500000-1000000" },
        { label: "1.000.000đ - 2.000.000đ", value: "1000000-2000000" },
        { label: "2.000.000đ - 5.000.000đ", value: "2000000-5000000" },
        { label: "Trên 5.000.000đ", value: "5000000-" }
    ]
};

// Định nghĩa Props nhận từ Component cha (ProductListPage)
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
  
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  // GỌI API LẤY DANH MỤC TỪ BACKEND
  useEffect(() => {
    const fetchCategories = async () => {
        try {
            const data = await productService.getCategories();
            // Lọc bỏ các danh mục bị null hoặc rỗng
            const validCategories = data?.filter((c: string) => c) || [];
            setCategories(validCategories);
        } catch (error) {
            console.error("Lỗi khi tải danh mục:", error);
        } finally {
            setIsLoadingCategories(false);
        }
    };
    fetchCategories();
  }, []);

  // Hàm xử lý khi check/uncheck Danh mục
  const handleCategoryChange = (category: string) => {
      setSelectedCategories(prev => {
          if (prev.includes(category)) {
              return prev.filter(c => c !== category); // Bỏ check
          } else {
              return [...prev, category]; // Thêm check
          }
      });
  };

  // Hàm xử lý khi check/uncheck Giá
  const handlePriceChange = (value: string) => {
      setSelectedPriceRanges(prev => {
          if (prev.includes(value)) {
              return prev.filter(p => p !== value);
          } else {
              return [...prev, value];
          }
      });
  };

  // Hàm xóa tất cả bộ lọc
  const clearAllFilters = () => {
      setSelectedCategories([]);
      setSelectedPriceRanges([]);
  };

  return (
    <div className="w-full pr-8 hidden md:block">
      <h3 className="text-xl font-bold font-serif mb-6 text-gray-900">Lọc</h3>

      {/* Render Nút Bộ lọc đã áp dụng MỘT CÁCH ĐỘNG */}
      {(selectedCategories.length > 0 || selectedPriceRanges.length > 0) && (
          <div className="mb-8">
            <h4 className="font-bold text-sm mb-3 text-[#3D021E]">Bộ lọc đã áp dụng</h4>
            <div className="flex flex-wrap gap-2 mb-3">
                {/* Nút Danh mục */}
                {selectedCategories.map(cat => (
                    <span key={cat} onClick={() => handleCategoryChange(cat)} className="inline-flex items-center text-xs font-bold border border-gray-200 px-3 py-1.5 rounded-full cursor-pointer hover:bg-gray-50 transition-colors shadow-sm">
                        {cat} <X className="w-3 h-3 ml-2 text-gray-400"/>
                    </span>
                ))}
                {/* Nút Giá */}
                {selectedPriceRanges.map(val => {
                    const priceLabel = filters.prices.find(p => p.value === val)?.label;
                    return (
                        <span key={val} onClick={() => handlePriceChange(val)} className="inline-flex items-center text-xs font-bold border border-gray-200 px-3 py-1.5 rounded-full cursor-pointer hover:bg-gray-50 transition-colors shadow-sm">
                            {priceLabel} <X className="w-3 h-3 ml-2 text-gray-400"/>
                        </span>
                    );
                })}
            </div>
            <button onClick={clearAllFilters} className="text-xs font-bold text-gray-500 hover:text-[#3D021E] hover:underline underline-offset-2">Xóa tất cả bộ lọc</button>
          </div>
      )}

      {/* Toggle Out Of Stock */}
      <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-100">
         <span className="font-bold text-sm text-gray-700">Hàng hết hàng</span>
         <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3D021E]"></div>
         </label>
      </div>

      {/* Category Accordion */}
      <div className="mb-6">
        <button onClick={() => setOpenCategory(!openCategory)} className="flex items-center justify-between w-full mb-4">
            <span className="font-bold text-[#3D021E] text-sm uppercase tracking-wider">Danh Mục</span>
            {openCategory ? <ChevronUp className="w-4 h-4 text-[#3D021E]"/> : <ChevronDown className="w-4 h-4 text-gray-400"/>}
        </button>
        
        {openCategory && (
            <div className="space-y-3 animate-in slide-in-from-top-2 duration-200 max-h-64 overflow-y-auto custom-scrollbar pr-2">
                {isLoadingCategories ? (
                    <div className="flex items-center justify-center py-4">
                        <Loader2 className="w-5 h-5 animate-spin text-[#3D021E]" />
                    </div>
                ) : categories.length === 0 ? (
                    <p className="text-xs text-gray-500 italic">Chưa có danh mục nào</p>
                ) : (
                    categories.map((cat, idx) => (
                        <label key={idx} className="flex items-center space-x-3 cursor-pointer group">
                            <div className="relative flex items-center">
                                <input 
                                    type="checkbox" 
                                    checked={selectedCategories.includes(cat)}
                                    onChange={() => handleCategoryChange(cat)}
                                    className="peer h-4 w-4 border-2 border-gray-300 rounded-sm bg-white checked:bg-[#3D021E] checked:border-[#3D021E] focus:outline-none transition-all cursor-pointer" 
                                />
                            </div>
                            <span className="text-sm font-medium text-gray-600 group-hover:text-[#3D021E] transition-colors">{cat}</span>
                        </label>
                    ))
                )}
            </div>
        )}
      </div>

      {/* Price Accordion */}
      <div className="mb-6 pt-6 border-t border-gray-100">
        <button onClick={() => setOpenPrice(!openPrice)} className="flex items-center justify-between w-full mb-4">
            <span className="font-bold text-[#3D021E] text-sm uppercase tracking-wider">Khoảng Giá</span>
            {openPrice ? <ChevronUp className="w-4 h-4 text-[#3D021E]"/> : <ChevronDown className="w-4 h-4 text-gray-400"/>}
        </button>
        
        {openPrice && (
            <div className="space-y-3 animate-in slide-in-from-top-2 duration-200">
                {filters.prices.map((price, idx) => (
                    <label key={idx} className="flex items-center space-x-3 cursor-pointer group">
                        <input 
                            type="checkbox" 
                            checked={selectedPriceRanges.includes(price.value)}
                            onChange={() => handlePriceChange(price.value)}
                            className="peer h-4 w-4 border-2 border-gray-300 rounded-sm bg-white checked:bg-[#3D021E] checked:border-[#3D021E] focus:outline-none transition-all cursor-pointer" 
                        />
                        <span className="text-sm font-medium text-gray-600 group-hover:text-[#3D021E] transition-colors">{price.label}</span>
                    </label>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};