import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { useState } from 'react';
import { filters } from '../../../data/mockData'; // Import data mẫu nếu bạn để riêng

export const FilterSidebar = () => {
  const [openCategory, setOpenCategory] = useState(true);
  const [openPrice, setOpenPrice] = useState(true);

  return (
    <div className="w-full pr-8 hidden md:block">
      <h3 className="text-xl font-bold font-serif mb-6">Lọc</h3>

      {/* Applied Filters (Demo) */}
      <div className="mb-8">
        <h4 className="font-bold text-sm mb-3">Bộ lọc đã áp dụng</h4>
        <div className="flex flex-wrap gap-2 mb-3">
           <span className="inline-flex items-center text-xs border border-gray-300 px-3 py-1 rounded-full">
              Sữa rửa mặt <X className="w-3 h-3 ml-2 cursor-pointer"/>
           </span>
           <span className="inline-flex items-center text-xs border border-gray-300 px-3 py-1 rounded-full">
              Mặt nạ và tẩy tế bào chết <X className="w-3 h-3 ml-2 cursor-pointer"/>
           </span>
        </div>
        <button className="text-xs text-accent hover:underline">Xóa tất cả bộ lọc</button>
      </div>

      {/* Toggle Out Of Stock */}
      <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-200">
         <span className="font-bold text-sm">Hàng hết hàng</span>
         <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" value="" className="sr-only peer" />
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
                            <input type="checkbox" className="peer h-4 w-4 border-2 border-gray-300 rounded-sm bg-white checked:bg-primary checked:border-primary focus:outline-none transition-all" />
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
                        <input type="checkbox" className="h-4 w-4 border-gray-300 rounded text-primary focus:ring-primary" />
                        <span className="text-sm text-gray-600 group-hover:text-primary">{price}</span>
                    </label>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};