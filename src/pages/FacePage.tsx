import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Loader2 } from 'lucide-react';
import { MainLayout } from '../components/layout/MainLayout';
import { ProductCard } from '../features/products/components/ProductCard';
import { productService } from '../services/productService'; 

// Danh mục con
const subCategories = [
  'Kem nền',
  'Phấn phủ',
  'Che khuyết điểm',
  'Kem lót',
  'Phấn má'
];

export const FacePage = () => {
  const [allProducts, setAllProducts] = useState<any[]>([]); 
  const [displayedProducts, setDisplayedProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [priceRange, setPriceRange] = useState<number>(2000000);
  const [sortOption, setSortOption] = useState<string>('all');
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedSubCat, setSelectedSubCat] = useState<string>(''); // Thêm State lọc danh mục con
  
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      setIsLoading(true);
      try {
        const payload = {
            category: "Trang điểm mặt", 
            pageNumber: 1,
            pageSize: 100 
        };
        const response = await productService.advancedSearch(payload);
        const items = Array.isArray(response) ? response : (response?.items || response?.data || []);
        
        setAllProducts(items);
        setDisplayedProducts(items);

        // Trích xuất thương hiệu thực tế
        const brands = Array.from(new Set(items.map((p: any) => p.brand).filter(Boolean))) as string[];
        setAvailableBrands(brands);

      } catch (error) {
        console.error("Lỗi khi tải danh mục Mặt:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryProducts();
    window.scrollTo(0, 0);
  }, []);

  // LOGIC LỌC
  useEffect(() => {
      let result = [...allProducts];

      // Lọc theo danh mục con (Tìm trong tên hoặc mô tả sản phẩm)
      if (selectedSubCat) {
          result = result.filter(p => 
              p.name.toLowerCase().includes(selectedSubCat.toLowerCase()) || 
              (p.description && p.description.toLowerCase().includes(selectedSubCat.toLowerCase()))
          );
      }

      // Lọc theo giá
      result = result.filter(p => {
          const currentPrice = p.discountedPrice || p.price;
          return currentPrice <= priceRange;
      });

      // Lọc theo Thương hiệu
      if (selectedBrands.length > 0) {
          result = result.filter(p => p.brand && selectedBrands.includes(p.brand));
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
  }, [priceRange, sortOption, selectedBrands, selectedSubCat, allProducts]);

  const handleBrandToggle = (brand: string) => {
      setSelectedBrands(prev => {
          if (prev.includes(brand)) return prev.filter(b => b !== brand);
          return [...prev, brand];
      });
  };

  return (
    <MainLayout>
      {/* 1. HERO BANNER */}
      <section className="relative h-[300px] md:h-[400px] bg-[#D4C4B7] overflow-hidden">
        <img 
          src="https://nima.edu/wp-content/uploads/2022/08/makeup.jpg" 
          alt="Face Makeup Banner" 
          className="w-full h-full object-cover object-center opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-4xl md:text-6xl font-serif text-white mb-2 drop-shadow-lg tracking-wide" style={{ fontFamily: 'Playfair Display, serif' }}>
                Trang Điểm Mặt
            </h1>
            <p className="text-white/90 text-xs md:text-sm uppercase tracking-[0.2em] font-medium drop-shadow-md max-w-xl mt-2 leading-relaxed">
                Lớp nền hoàn hảo bắt đầu từ sự thấu hiểu làn da.
            </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 max-w-[1300px]">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* 2. SIDEBAR FILTER */}
          <aside className="w-full lg:w-1/4 space-y-8">
            
            {/* Danh mục con */}
            <div>
                <h3 className="font-bold text-gray-900 uppercase tracking-wider mb-4 text-xs">Danh mục con</h3>
                <ul className="space-y-3">
                    <li 
                        onClick={() => setSelectedSubCat('')}
                        className={`text-sm cursor-pointer transition-colors ${selectedSubCat === '' ? 'text-[#A41C4E] font-bold border-l-2 border-[#A41C4E] pl-2' : 'text-gray-600 hover:text-[#A41C4E]'}`}
                    >
                        Tất cả
                    </li>
                    {subCategories.map((cat) => (
                        <li 
                            key={cat} 
                            onClick={() => setSelectedSubCat(cat)}
                            className={`text-sm cursor-pointer transition-colors ${selectedSubCat === cat ? 'text-[#A41C4E] font-bold border-l-2 border-[#A41C4E] pl-2' : 'text-gray-600 hover:text-[#A41C4E]'}`}
                        >
                            {cat}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="border-t border-gray-100"></div>

            {/* Lọc theo giá */}
            <div>
                <h3 className="font-bold text-gray-900 uppercase tracking-wider mb-4 text-xs">Lọc theo giá</h3>
                <input 
                    type="range" 
                    min="100000" 
                    max="2000000" 
                    step="50000"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#A41C4E]"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2 font-bold uppercase tracking-wide">
                    <span>100.000đ</span>
                    <span className="text-[#A41C4E]">{priceRange.toLocaleString('vi-VN')}đ</span>
                </div>
            </div>

            <div className="border-t border-gray-100"></div>

            {/* Thương hiệu */}
            <div>
                <h3 className="font-bold text-gray-900 uppercase tracking-wider mb-4 text-xs">Thương hiệu</h3>
                {availableBrands.length === 0 ? (
                    <p className="text-xs text-gray-400 italic">Không có dữ liệu</p>
                ) : (
                    <div className="space-y-2">
                        {availableBrands.map((brand) => (
                            <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                                <input 
                                    type="checkbox" 
                                    checked={selectedBrands.includes(brand)}
                                    onChange={() => handleBrandToggle(brand)}
                                    className="w-4 h-4 rounded border-gray-300 text-[#A41C4E] focus:ring-[#A41C4E] cursor-pointer" 
                                />
                                <span className={`text-sm transition-colors ${selectedBrands.includes(brand) ? 'text-[#A41C4E] font-bold' : 'text-gray-600 group-hover:text-[#A41C4E]'}`}>{brand}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            <button 
                onClick={() => { setPriceRange(2000000); setSortOption('all'); setSelectedBrands([]); setSelectedSubCat(''); }}
                className="w-full bg-white border border-gray-200 text-gray-700 text-xs font-bold py-3 uppercase tracking-widest hover:bg-gray-50 hover:border-gray-300 transition-colors rounded-sm shadow-sm mt-4"
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
                    <p className="text-gray-500 font-bold">Đang tải dữ liệu...</p>
                </div>
            ) : displayedProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 bg-[#FAF7F8] rounded-xl border border-[#F3EAF0]">
                    <p className="text-gray-500 text-lg font-medium">Không có sản phẩm nào phù hợp.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10">
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