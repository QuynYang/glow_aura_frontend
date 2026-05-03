import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Check, Loader2 } from 'lucide-react';
import { MainLayout } from '../components/layout/MainLayout';
import { ProductCard } from '../features/products/components/ProductCard';
import { productService } from '../services/productService'; // Import API

const subCategories = [
  "Làm Sạch (Cleanser)",
  "Tinh Chất (Serums)",
  "Dưỡng Ẩm (Moisturizers)",
  "Chống Nắng (Sunscreen)",
  "Mặt Nạ (Masks)",
  "Đặc Trị (Treatments)"
];

// Loại da
const skinTypes = [
  { id: 'all', label: 'Mọi loại da' },
  { id: 'oily', label: 'Da Dầu (Oily)' },
  { id: 'dry', label: 'Da Khô (Dry)' },
  { id: 'sensitive', label: 'Da Nhạy Cảm' },
  { id: 'combo', label: 'Da Hỗn Hợp' },
];

export const SkinCarePage = () => {
  // 1. Quản lý State dữ liệu
  const [allProducts, setAllProducts] = useState<any[]>([]); 
  const [displayedProducts, setDisplayedProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 2. Quản lý State bộ lọc
  const [priceRange, setPriceRange] = useState<number>(5000000);
  const [sortOption, setSortOption] = useState<string>('all');
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [selectedSkinTypes, setSelectedSkinTypes] = useState<string[]>([]);
  const [selectedSubCat, setSelectedSubCat] = useState<string>('');

  // 3. GỌI API LẤY SẢN PHẨM THEO DANH MỤC "Dưỡng da"
  useEffect(() => {
    const fetchCategoryProducts = async () => {
      setIsLoading(true);
      try {
        const payload = {
            category: "Dưỡng da", 
            pageNumber: 1,
            pageSize: 100
        };
        const response = await productService.advancedSearch(payload);
        const items = Array.isArray(response) ? response : (response?.items || response?.data || []);
        
        setAllProducts(items);
        setDisplayedProducts(items);
      } catch (error) {
        console.error("Lỗi khi tải danh mục Dưỡng da:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryProducts();
    window.scrollTo(0, 0);
  }, []);

  // 4. LOGIC LỌC GIÁ, LOẠI DA, SẮP XẾP TRÊN FRONTEND
  useEffect(() => {
      let result = [...allProducts];

      // Lọc theo giá
      result = result.filter(p => {
          const currentPrice = p.discountedPrice || p.price;
          return currentPrice <= priceRange;
      });

      // Lọc theo Skin Type (Nếu User có tích chọn)
      if (selectedSkinTypes.length > 0) {
          result = result.filter(p => {
              if (!p.skinType || p.skinType.toLowerCase() === 'all') return true; 
              return selectedSkinTypes.includes(p.skinType.toLowerCase());
          });
      }

      // Sắp xếp
      if (sortOption === 'priceAsc') {
          result.sort((a, b) => (a.discountedPrice || a.price) - (b.discountedPrice || b.price));
      } else if (sortOption === 'priceDesc') {
          result.sort((a, b) => (b.discountedPrice || b.price) - (a.discountedPrice || a.price));
      } else if (sortOption === 'newest') {
          result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }

      setDisplayedProducts(result);
  }, [priceRange, sortOption, selectedSkinTypes, allProducts]);

  return (
    <MainLayout>
      {/* 1. HERO BANNER */}
      <section className="relative h-[300px] md:h-[400px] bg-[#F5F5F5] overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=1200" 
          alt="Skincare Banner" 
          className="w-full h-full object-cover object-center opacity-80"
        />
        <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl md:text-6xl font-serif text-white mb-3 drop-shadow-md" style={{ fontFamily: 'Playfair Display, serif' }}>
                Chăm Sóc Da
            </h1>
            <p className="text-white text-xs md:text-sm uppercase tracking-[0.3em] font-bold drop-shadow-lg">
                Khám phá vẻ đẹp tự nhiên của bạn ngay
            </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 max-w-[1300px]">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* 2. SIDEBAR FILTER */}
          <aside className="w-full lg:w-1/4 space-y-10 font-sans">
            
            {/* Skin Type */}
            <div>
                <h3 className="font-bold text-gray-900 uppercase tracking-widest mb-5 text-xs">Loại Da (Skin Type)</h3>
                <div className="space-y-3">
                    {skinTypes.map((type) => {
                        const isChecked = selectedSkinTypes.includes(type.id);
                        return (
                            <label key={type.id} className="flex items-center gap-3 cursor-pointer group">
                                <div className={`w-4 h-4 border rounded-sm flex items-center justify-center transition-all
                                    ${isChecked 
                                        ? 'bg-[#A41C4E] border-[#A41C4E]' 
                                        : 'border-gray-300 bg-white group-hover:border-[#A41C4E]'}
                                `}>
                                    {isChecked && <Check className="w-3 h-3 text-white" />}
                                </div>
                                <span className={`text-sm transition-colors ${isChecked ? 'text-[#A41C4E] font-bold' : 'text-gray-600 group-hover:text-[#A41C4E]'}`}>
                                    {type.label}
                                </span>
                            </label>
                        );
                    })}
                </div>
            </div>

            {/* Sub-Category */}
            <div>
                <h3 className="font-bold text-gray-900 uppercase tracking-widest mb-5 text-xs">Danh mục con</h3>
                <ul className="space-y-3">
                    <li 
                        onClick={() => setSelectedSubCat('')}
                        className={`text-sm cursor-pointer transition-colors ${selectedSubCat === '' ? 'text-[#3D021E] font-bold border-l-2 border-[#3D021E] pl-3' : 'text-gray-500 hover:text-[#3D021E]'}`}
                    >
                        Tất cả
                    </li>
                    {subCategories.map((cat, index) => (
                        <li 
                            key={index} 
                            onClick={() => setSelectedSubCat(cat)}
                            className={`text-sm cursor-pointer transition-colors ${selectedSubCat === cat ? 'text-[#3D021E] font-bold border-l-2 border-[#3D021E] pl-3' : 'text-gray-500 hover:text-[#3D021E]'}`}
                        >
                            {cat}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Price Range */}
            <div>
                <h3 className="font-bold text-gray-900 uppercase tracking-widest mb-5 text-xs">Khoảng giá</h3>
                <input 
                    type="range" 
                    min="100000" 
                    max="5000000" 
                    step="100000"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#3D021E]"
                />
                <div className="flex justify-between text-[10px] text-gray-500 mt-2 font-bold uppercase tracking-wide">
                    <span>100.000đ</span>
                    <span className="text-[#3D021E] text-xs">{priceRange.toLocaleString('vi-VN')}đ</span>
                </div>
            </div>

            <button 
                onClick={() => { setPriceRange(5000000); setSortOption('all'); setSelectedSkinTypes([]); setSelectedSubCat(''); }}
                className="w-full bg-white border border-gray-200 text-gray-700 text-xs font-bold py-3 uppercase tracking-widest hover:bg-gray-50 hover:border-gray-300 transition-colors rounded-sm shadow-sm"
            >
                Xóa bộ lọc
            </button>

          </aside>

          {/* 3. MAIN CONTENT */}
          <div className="w-full lg:w-3/4">
            
            {/* Header Grid */}
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Hiển thị {displayedProducts.length} sản phẩm
                </span>
                
                <div className="relative">
                    <button 
                        onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                        className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-700 hover:text-[#A41C4E] py-2"
                    >
                        Sắp xếp: {sortOption === 'all' ? 'Tất cả' : sortOption === 'priceAsc' ? 'Giá tăng dần' : sortOption === 'priceDesc' ? 'Giá giảm dần' : 'Mới nhất'} <ChevronDown className="w-3 h-3" />
                    </button>
                    {isSortDropdownOpen && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white shadow-xl border border-gray-100 py-2 z-20 rounded-sm animate-in fade-in slide-in-from-top-2">
                            <button onClick={() => { setSortOption('all'); setIsSortDropdownOpen(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 hover:text-[#3D021E] font-medium">Tất cả sản phẩm</button>
                            <button onClick={() => { setSortOption('priceAsc'); setIsSortDropdownOpen(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 hover:text-[#3D021E] font-medium">Giá thấp đến cao</button>
                            <button onClick={() => { setSortOption('priceDesc'); setIsSortDropdownOpen(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 hover:text-[#3D021E] font-medium">Giá cao đến thấp</button>
                            <button onClick={() => { setSortOption('newest'); setIsSortDropdownOpen(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 hover:text-[#3D021E] font-medium">Mới nhất</button>
                        </div>
                    )}
                </div>
            </div>

            {/* Product Grid */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-32">
                    <Loader2 className="w-10 h-10 animate-spin text-[#A41C4E] mb-4" />
                    <p className="text-gray-500 font-bold">Đang tải Dược Mỹ Phẩm...</p>
                </div>
            ) : displayedProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 bg-[#FAF7F8] rounded-xl border border-[#F3EAF0]">
                    <p className="text-gray-500 text-lg font-medium">Không có sản phẩm nào phù hợp với tầm giá hoặc loại da này.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12">
                    {displayedProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {displayedProducts.length > 0 && (
                <div className="mt-16 flex justify-center gap-2">
                     <button className="w-8 h-8 bg-[#A41C4E] text-white flex items-center justify-center font-bold text-sm rounded-sm shadow-md">1</button>
                     <button className="w-8 h-8 border border-gray-200 text-gray-600 flex items-center justify-center font-bold text-sm rounded-sm hover:border-[#A41C4E] hover:text-[#A41C4E] shadow-sm">2</button>
                     <button className="w-8 h-8 border border-gray-200 text-gray-600 flex items-center justify-center rounded-sm hover:border-[#A41C4E] hover:text-[#A41C4E] shadow-sm">
                        <ChevronRight className="w-4 h-4" />
                     </button>
                </div>
            )}

          </div>
        </div>
      </div>
    </MainLayout>
  );
};