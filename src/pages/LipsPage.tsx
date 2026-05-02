import { useState, useEffect } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { MainLayout } from '../components/layout/MainLayout';
import { ProductCard } from '../features/products/components/ProductCard';
import { productService } from '../services/productService'; 
// Bộ lọc màu sắc 
const colors = [
  { id: 'red', hex: '#EF4444', label: 'Đỏ' },
  { id: 'nude', hex: '#D4A373', label: 'Nude' },
  { id: 'pink', hex: '#F472B6', label: 'Hồng' },
  { id: 'brown', hex: '#78350F', label: 'Nâu' },
  { id: 'wine', hex: '#881337', label: 'Đỏ rượu' },
];

export const LipsPage = () => {
  // 1. Quản lý State dữ liệu
  const [allProducts, setAllProducts] = useState<any[]>([]); 
  const [displayedProducts, setDisplayedProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 2. Quản lý State bộ lọc
  const [priceRange, setPriceRange] = useState<number>(2000000);
  const [sortOption, setSortOption] = useState<string>('all');
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  // 3. GỌI API LẤY SẢN PHẨM THEO DANH MỤC "MÔI"
  useEffect(() => {
    const fetchCategoryProducts = async () => {
      setIsLoading(true);
      try {
        const payload = {
            category: "Môi", 
            pageNumber: 1,
            pageSize: 100 // Lấy nhiều một chút để FE tự lọc
        };
        const response = await productService.advancedSearch(payload);
        const items = Array.isArray(response) ? response : (response?.items || response?.data || []);
        
        setAllProducts(items);
        setDisplayedProducts(items);
      } catch (error) {
        console.error("Lỗi khi tải danh mục Môi:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryProducts();
    window.scrollTo(0, 0);
  }, []);

  // 4. LOGIC LỌC GIÁ VÀ SẮP XẾP TRÊN FRONTEND
  useEffect(() => {
      // Bắt đầu từ mảng gốc
      let result = [...allProducts];

      // Lọc theo giá (chỉ lấy những sp có giá <= giá đang kéo)
      result = result.filter(p => {
          const currentPrice = p.discountedPrice || p.price;
          return currentPrice <= priceRange;
      });

      // Sắp xếp
      if (sortOption === 'priceAsc') {
          result.sort((a, b) => (a.discountedPrice || a.price) - (b.discountedPrice || b.price));
      } else if (sortOption === 'priceDesc') {
          result.sort((a, b) => (b.discountedPrice || b.price) - (a.discountedPrice || a.price));
      } else if (sortOption === 'newest') {
          result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }

      setDisplayedProducts(result);
  }, [priceRange, sortOption, allProducts]);

  return (
    <MainLayout>
      {/* 1. HERO BANNER */}
      <section className="relative h-[300px] md:h-[400px] bg-pink-100 overflow-hidden">
        <img 
          src="https://png.pngtree.com/background/20240412/original/pngtree-upscale-lipstick-advertisement-banner-featuring-a-3d-render-against-a-red-picture-image_8460112.jpg"
          alt="Lipstick Banner" 
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-4xl md:text-6xl font-serif text-white mb-2 drop-shadow-lg" style={{ fontFamily: 'Playfair Display, serif' }}>
                Velvet & Silk
            </h1>
            <p className="text-white/90 text-xs md:text-sm uppercase tracking-[0.2em] font-medium drop-shadow-md max-w-xl">
                Khám phá bộ sưu tập son môi cao cấp mang lại cảm giác mịn mượt và màu sắc thời thượng.
            </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 max-w-[1300px]">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* 2. SIDEBAR FILTER */}
          <aside className="w-full lg:w-1/4 space-y-10">
            <div>
                <h3 className="font-serif font-bold text-[#3D021E] uppercase tracking-wider mb-4 text-sm">Loại sản phẩm</h3>
                <div className="space-y-3">
                    {['Son thỏi (Lipstick)', 'Son dưỡng (Balm)', 'Son bóng (Gloss)', 'Son tint (Tint)'].map((type) => (
                        <label key={type} className="flex items-center gap-3 cursor-pointer group">
                            <input type="checkbox" className="w-4 h-4 border border-gray-300 rounded-sm checked:bg-[#3D021E] checked:border-[#3D021E] focus:ring-[#3D021E] transition-colors cursor-pointer" />
                            <span className="text-sm text-gray-600 group-hover:text-[#3D021E] transition-colors">{type}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Màu sắc */}
            <div>
                <h3 className="font-serif font-bold text-[#3D021E] uppercase tracking-wider mb-4 text-sm">Màu sắc</h3>
                <div className="flex flex-wrap gap-3">
                    {colors.map((color) => (
                        <button 
                            key={color.id}
                            className="w-8 h-8 rounded-full border border-gray-200 hover:scale-110 transition-transform shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-[#3D021E]"
                            style={{ backgroundColor: color.hex }}
                            title={color.label}
                        ></button>
                    ))}
                </div>
            </div>

            {/* Khoảng giá (Range Slider) */}
            <div>
                <h3 className="font-serif font-bold text-[#3D021E] uppercase tracking-wider mb-4 text-sm">Khoảng giá</h3>
                <input 
                    type="range" 
                    min="0" 
                    max="2000000" 
                    step="50000"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#3D021E]"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2 font-medium">
                    <span>0đ</span>
                    <span className="text-[#3D021E] font-bold text-sm">{priceRange.toLocaleString('vi-VN')}đ</span>
                </div>
            </div>

            <button 
                onClick={() => { setPriceRange(2000000); setSortOption('all'); }}
                className="w-full bg-white border border-gray-200 text-gray-700 text-xs font-bold py-3 uppercase tracking-widest hover:bg-gray-50 hover:border-gray-300 transition-colors rounded-lg shadow-sm"
            >
                Xóa bộ lọc
            </button>
          </aside>

          {/* 3. MAIN CONTENT */}
          <div className="w-full lg:w-3/4">
            
            {/* Header của Grid (Số lượng + Sắp xếp) */}
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100 relative">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Hiển thị {displayedProducts.length} sản phẩm
                </span>
                
                <div className="relative">
                    <button 
                        onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                        className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider hover:text-[#3D021E] py-2"
                    >
                        Sắp xếp: {sortOption === 'all' ? 'Tất cả' : sortOption === 'priceAsc' ? 'Giá tăng dần' : sortOption === 'priceDesc' ? 'Giá giảm dần' : 'Mới nhất'} <ChevronDown className="w-3 h-3" />
                    </button>
                    
                    {isSortDropdownOpen && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white shadow-xl border border-gray-100 py-2 z-20 rounded-lg animate-in fade-in slide-in-from-top-2">
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
                    <Loader2 className="w-10 h-10 animate-spin text-[#3D021E] mb-4" />
                    <p className="text-gray-500 font-bold">Đang tải bộ sưu tập...</p>
                </div>
            ) : displayedProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 bg-[#FAF7F8] rounded-3xl border border-[#F3EAF0]">
                    <p className="text-gray-500 text-lg font-medium">Không có sản phẩm nào phù hợp với tầm giá này.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                    {displayedProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}

            {/* Pagination  */}
            {displayedProducts.length > 0 && (
                <div className="mt-16 flex justify-center gap-2">
                    <button className="w-10 h-10 border border-gray-200 rounded-lg flex items-center justify-center hover:border-[#3D021E] hover:text-[#3D021E] transition-colors shadow-sm">
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button className="w-10 h-10 bg-[#3D021E] text-white rounded-lg flex items-center justify-center font-bold text-sm shadow-md">
                        1
                    </button>
                    <button className="w-10 h-10 border border-gray-200 rounded-lg flex items-center justify-center hover:border-[#3D021E] hover:text-[#3D021E] transition-colors font-bold text-sm text-gray-600 shadow-sm">
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