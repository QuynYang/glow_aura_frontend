import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { ProductCard } from '../features/products/components/ProductCard';
import { productService } from '../services/productService';
import { Loader2, SearchX, ArrowLeft } from 'lucide-react';

export const SearchPage = () => {
  // lấy keyword
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('keyword') || '';

  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!keyword.trim()) {
          setProducts([]);
          setIsLoading(false);
          return;
      }

      setIsLoading(true);
      try {
        const payload = {
            keyword: keyword.trim(),
            pageNumber: 1,
            pageSize: 50 // Lấy tối đa 50 kết quả
        };
        const response = await productService.advancedSearch(payload);
        const items = Array.isArray(response) ? response : (response?.items || response?.data || []);
        setProducts(items);
      } catch (error) {
        console.error("Lỗi khi tìm kiếm:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
    window.scrollTo(0, 0); // Cuộn lên đầu trang
  }, [keyword]);

  return (
    <MainLayout>
      <div className="bg-[#FDFBFB] min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-[1200px]">
          
          <Link to="/best-sellers" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#3D021E] transition-colors mb-6 font-medium">
             <ArrowLeft className="w-4 h-4" /> Trở lại danh sách sản phẩm
          </Link>

          <div className="mb-10">
            <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
                Kết quả tìm kiếm cho: <span className="text-[#3D021E]">"{keyword}"</span>
            </h1>
            <p className="text-gray-500 font-medium">Tìm thấy {products.length} sản phẩm phù hợp</p>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
               <Loader2 className="w-10 h-10 animate-spin text-[#3D021E] mb-4" />
               <p className="text-gray-500 font-bold">Đang tìm kiếm...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-gray-100 shadow-sm">
               <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                   <SearchX className="w-10 h-10 text-gray-300" />
               </div>
               <h3 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy sản phẩm nào</h3>
               <p className="text-gray-500 max-w-md text-center">
                   Rất tiếc, chúng tôi không tìm thấy sản phẩm nào khớp với "{keyword}". Vui lòng thử lại với từ khóa khác chung chung hơn.
               </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
               {products.map(product => (
                  <ProductCard key={product.id} product={product} />
               ))}
            </div>
          )}

        </div>
      </div>
    </MainLayout>
  );
};