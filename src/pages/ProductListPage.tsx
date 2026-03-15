import React, { useState, useEffect } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { FilterSidebar } from '../features/products/components/FilterSidebar';
import { ProductCard } from '../features/products/components/ProductCard';
import { ExpertBanner } from '../features/products/components/ExpertBanner';
import { VirtualAnalysisCard } from '../features/home/components/VirtualAnalysisCard'; 
import { AwardedBanner } from '../features/products/components/AwardedBanner';
import { productService } from '../services/productService';
import { Loader2 } from 'lucide-react';

export const ProductListPage = () => {
  // 1. Quản lý State cho Dữ liệu
  const [allProducts, setAllProducts] = useState<any[]>([]); // Giữ nguyên data gốc từ API
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]); // Data sau khi đã lọc/sắp xếp để hiển thị
  const [isLoading, setIsLoading] = useState(true);

  // 2. Quản lý State cho Bộ lọc & Sắp xếp
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<string>('recommended');

  // Gọi API lần đầu tiên
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getAll();
        const productsArray = Array.isArray(data) ? data : (data.items || data.data || []);
        
        setAllProducts(productsArray);
        setFilteredProducts(productsArray); // Mặc định hiển thị tất cả
      } catch (error) {
        console.error("Lỗi khi tải danh sách sản phẩm:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // 3. Logic: Tự động tính toán lại danh sách hiển thị mỗi khi bộ lọc thay đổi
  useEffect(() => {
    // Copy mảng gốc ra để xử lý
    let result = [...allProducts];

    // Lọc theo Danh mục (Loại)
    if (selectedCategories.length > 0) {
        // LƯU Ý: Thay 'category' bằng tên trường thực tế trả về từ Backend của bạn (vd: categoryName)
        result = result.filter(p => selectedCategories.includes(p.category));
    }

    // Lọc theo Khoảng Giá
    if (selectedPriceRanges.length > 0) {
        result = result.filter(p => {
            return selectedPriceRanges.some(range => {
                const [minStr, maxStr] = range.split('-');
                const min = parseInt(minStr);
                const max = maxStr ? parseInt(maxStr) : null;

                if (max) return p.price >= min && p.price <= max;
                return p.price >= min; // Xử lý trường hợp "Trên X tiền"
            });
        });
    }

    // Sắp xếp
    if (sortOption === 'priceAsc') {
        result.sort((a, b) => a.price - b.price); // Giá thấp đến cao
    } else if (sortOption === 'priceDesc') {
        result.sort((a, b) => b.price - a.price); // Giá cao đến thấp
    }

    // Cập nhật giao diện
    setFilteredProducts(result);
  }, [allProducts, selectedCategories, selectedPriceRanges, sortOption]);

  return (
    <MainLayout>
      <div className="bg-secondary py-12 mb-12">
        <div className="container mx-auto px-4 text-center">
             <span className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-2 block">Skincare</span>
             <h1 className="text-4xl font-serif font-bold text-primary">
                 BEST-SELLERS <span className="text-2xl text-gray-500 font-normal">({filteredProducts.length})</span>
             </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-20">
        <div className="flex flex-col md:flex-row gap-8">
            
            <aside className="w-full md:w-1/4 hidden md:block">
                {/* 4. Truyền State và Hàm cập nhật xuống Sidebar */}
                <FilterSidebar 
                    selectedCategories={selectedCategories}
                    setSelectedCategories={setSelectedCategories}
                    selectedPriceRanges={selectedPriceRanges}
                    setSelectedPriceRanges={setSelectedPriceRanges}
                />
            </aside>

            <div className="w-full md:w-3/4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold font-serif md:hidden">Filter</h2>
                    <div className="flex items-center gap-2 ml-auto">
                        <span className="text-sm font-bold text-gray-600">Sort:</span>
                        {/* 5. Gắn sự kiện cho ô select Sắp xếp */}
                        <select 
                            className="text-sm border-none bg-transparent font-medium focus:ring-0 cursor-pointer outline-none"
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                        >
                            <option value="recommended">Recommended</option>
                            <option value="priceAsc">Giá: Từ thấp đến cao</option>
                            <option value="priceDesc">Giá: Từ cao đến thấp</option>
                        </select>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="col-span-1 sm:col-span-2 lg:col-span-2 min-h-[400px]">
                            <AwardedBanner />
                        </div>
                        
                        {/* 6. Render từ mảng ĐÃ LỌC (filteredProducts) */}
                        {filteredProducts.map((product, index) => {
                            return (
                                <React.Fragment key={product.id || index}>
                                    {index === 1 && (
                                        <div className="h-full min-h-[400px]">
                                            <ExpertBanner />
                                        </div>
                                    )}

                                    <div className="h-full">
                                        <ProductCard product={product} />
                                    </div>

                                    {index === 2 && (
                                        <div className="h-full min-h-[400px]">
                                            <VirtualAnalysisCard />
                                        </div>
                                    )}
                                </React.Fragment>
                            );
                        })}
                        
                    </div>
                )}
            </div>
        </div>
      </div>
    </MainLayout>
  );
};