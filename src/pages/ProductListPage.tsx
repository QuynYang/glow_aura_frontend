import { MainLayout } from '../components/layout/MainLayout';
import { FilterSidebar } from '../features/products/components/FilterSidebar';
import { ProductCard } from '../features/products/components/ProductCard';
import { ExpertBanner } from '../features/products/components/ExpertBanner';
import { VirtualAnalysisCard } from '../features/home/components/VirtualAnalysisCard'; 
import { AwardedBanner } from '../features/products/components/AwardedBanner';
import { products } from '../data/mockData';

export const ProductListPage = () => {
  return (
    <MainLayout>
      {/* 1. Header Section */}
      <div className="bg-secondary py-12 mb-12">
        <div className="container mx-auto px-4 text-center">
             <span className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-2 block">Skincare</span>
             <h1 className="text-4xl font-serif font-bold text-primary">BEST-SELLERS <span className="text-2xl text-gray-500 font-normal">(17)</span></h1>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-20">
        <div className="flex flex-col md:flex-row gap-8">
            
            {/* 2. Sidebar */}
            <aside className="w-full md:w-1/4 hidden md:block">
                <FilterSidebar />
            </aside>

            {/* 3. Main Content */}
            <div className="w-full md:w-3/4">
                
                {/* Sort Bar */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold font-serif md:hidden">Filter</h2>
                    <div className="flex items-center gap-2 ml-auto">
                        <span className="text-sm font-bold text-gray-600">Sort:</span>
                        <select className="text-sm border-none bg-transparent font-medium focus:ring-0 cursor-pointer outline-none">
                            <option>Recommended</option>
                            <option>Price: Low to High</option>
                            <option>Price: High to Low</option>
                        </select>
                    </div>
                </div>

                {/* === PRODUCT GRID COMPLEX LAYOUT === */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    
                    {/* 1. Đặt Banner Tím lên đầu tiên (Chiếm 2 cột) */}
                    <div className="col-span-1 sm:col-span-2 lg:col-span-2 min-h-[400px]">
                        <AwardedBanner />
                    </div>
                    
                    {/* 2. Render các sản phẩm và chèn thẻ xen kẽ */}
                    {products.map((product, index) => {
                        return (
                            <>
                                {/* Nếu là vị trí thứ 2 (index = 1), chèn Expert Banner vào trước nó */}
                                {index === 1 && (
                                    <div className="h-full min-h-[400px]">
                                        <ExpertBanner />
                                    </div>
                                )}

                                {/* Render Sản phẩm */}
                                <div className="h-full">
                                    <ProductCard key={product.id} product={product} />
                                </div>

                                {/* Nếu là vị trí thứ 3 (index = 2), chèn Virtual Analysis Card vào sau nó */}
                                {index === 2 && (
                                    <div className="h-full min-h-[400px]">
                                        <VirtualAnalysisCard />
                                    </div>
                                )}
                            </>
                        );
                    })}
                    
                </div>
            </div>
        </div>
      </div>
    </MainLayout>
  );
};