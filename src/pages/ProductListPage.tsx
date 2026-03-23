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
  // 1. Quản lý State cho Dữ liệu (Từ API)
  const [products, setProducts] = useState<any[]>([]); 
  const [displayedProducts, setDisplayedProducts] = useState<any[]>([]); // Dùng để render và sắp xếp FE
  const [isLoading, setIsLoading] = useState(true);

  // 2. Quản lý State cho Bộ lọc & Sắp xếp
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<string>('recommended');

  // 3. LOGIC GỌI API LỌC THẬT TỪ BACKEND
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setIsLoading(true);
      try {
        // --- XỬ LÝ KHOẢNG GIÁ ---
        let minPrice = null;
        let maxPrice = null;
        
        if (selectedPriceRanges.length > 0) {
            const allMins = selectedPriceRanges.map(r => parseInt(r.split('-')[0]));
            const allMaxs = selectedPriceRanges.map(r => {
                const maxVal = r.split('-')[1];
                return maxVal ? parseInt(maxVal) : 999999999;
            });
            minPrice = Math.min(...allMins);
            maxPrice = Math.max(...allMaxs);
        }

        // Đóng gói Payload theo chuẩn C#
        const payload = {
            keyword: null, // Bỏ trống vì trang này không dùng text search
            category: selectedCategories.length > 0 ? selectedCategories[0] : null, 
            minPrice: minPrice,
            maxPrice: maxPrice === 999999999 ? null : maxPrice,
            pageNumber: 1,
            pageSize: 50 
        };

        const response = await productService.advancedSearch(payload);
        const productsArray = Array.isArray(response) ? response : (response?.items || response?.data || []);
        
        setProducts(productsArray);

      } catch (error) {
        console.error("Lỗi khi tải danh sách sản phẩm:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilteredProducts();
  }, [selectedCategories, selectedPriceRanges]);

  // 4. XỬ LÝ SẮP XẾP Ở FRONTEND
  useEffect(() => {
    let result = [...products];

    if (sortOption === 'priceAsc') {
        result.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'priceDesc') {
        result.sort((a, b) => b.price - a.price);
    }

    setDisplayedProducts(result);
  }, [products, sortOption]);

  return (
    <MainLayout>
      <div className="bg-secondary py-12 mb-12">
        <div className="container mx-auto px-4 text-center">
             <span className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-2 block">Skincare</span>
             <h1 className="text-4xl font-serif font-bold text-primary">
                 BEST-SELLERS <span className="text-2xl text-gray-500 font-normal">({displayedProducts.length})</span>
             </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-20">
        <div className="flex flex-col md:flex-row gap-8">
            
            <aside className="w-full md:w-1/4 hidden md:block">
                {/* Truyền State xuống Sidebar */}
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
                ) : displayedProducts.length === 0 ? (
                    <div className="flex flex-col justify-center items-center py-20">
                        <p className="text-gray-500 text-lg font-medium">Không có sản phẩm nào phù hợp với bộ lọc!</p>
                        <button 
                            onClick={() => {
                                setSelectedCategories([]);
                                setSelectedPriceRanges([]);
                            }}
                            className="mt-4 text-primary font-bold hover:underline"
                        >
                            Xóa bộ lọc
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="col-span-1 sm:col-span-2 lg:col-span-2 min-h-[400px]">
                            <AwardedBanner />
                        </div>
                        
                        {displayedProducts.map((product, index) => {
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