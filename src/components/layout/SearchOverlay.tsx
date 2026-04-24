import { Search, X, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../../services/productService'; 

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchOverlay = ({ isOpen, onClose }: SearchOverlayProps) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dữ liệu API
  const [popularProducts, setPopularProducts] = useState<any[]>([]);
  const [trendingSearches, setTrendingSearches] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Khóa cuộn trang khi mở Overlay & Load dữ liệu động
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      
      // Load sản phẩm nổi bật
      if (popularProducts.length === 0) fetchPopularProducts();
      
      // Load danh mục làm "Đang thịnh hành"
      if (trendingSearches.length === 0) fetchTrending();

      // Load lịch sử tìm kiếm từ bộ nhớ trình duyệt (LocalStorage)
      const savedRecent = localStorage.getItem('glowaura_recent_searches');
      if (savedRecent) {
          setRecentSearches(JSON.parse(savedRecent));
      }

    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const fetchPopularProducts = async () => {
      setIsLoading(true);
      try {
          const payload = { pageNumber: 1, pageSize: 4 };
          const response = await productService.advancedSearch(payload);
          const items = Array.isArray(response) ? response : (response?.items || response?.data || []);
          setPopularProducts(items.slice(0, 4));
      } catch (error) {
          console.error("Lỗi lấy sản phẩm nổi bật:", error);
      } finally {
          setIsLoading(false);
      }
  };

  const fetchTrending = async () => {
      try {
          const categories = await productService.getCategories();
          const validCats = categories?.filter((c: string) => c) || [];
          // Lấy 5 danh mục đầu tiên làm Trending
          setTrendingSearches(validCats.slice(0, 5));
      } catch (error) {
          console.error("Lỗi lấy danh mục trending:", error);
      }
  };

  // Xử lý Lưu lịch sử & Chuyển trang
  const handleExecuteSearch = (keyword: string) => {
      if (!keyword.trim()) return;
      
      const newSearch = keyword.trim();
      
      // Cập nhật mảng Lịch sử tìm kiếm (Lưu tối đa 5 từ khóa, đẩy lên đầu, xóa trùng lặp)
      let updatedRecent = [newSearch, ...recentSearches.filter(item => item !== newSearch)];
      updatedRecent = updatedRecent.slice(0, 5);
      
      setRecentSearches(updatedRecent);
      localStorage.setItem('glowaura_recent_searches', JSON.stringify(updatedRecent)); // Lưu vào trình duyệt

      onClose();
      navigate(`/search?keyword=${encodeURIComponent(newSearch)}`); 
      setSearchTerm(''); 
  };

  const handleClearRecent = () => {
      setRecentSearches([]);
      localStorage.removeItem('glowaura_recent_searches');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
          handleExecuteSearch(searchTerm);
      }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white z-[60] overflow-y-auto animate-in fade-in duration-200">
      <div className="container mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="flex justify-end mb-4">
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-8 h-8 text-gray-500" />
            </button>
        </div>

        <div className="max-w-6xl mx-auto">
            {/* Search Input */}
            <div className="relative mb-12 border-b border-gray-300 pb-4">
                <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Bạn đang tìm kiếm gì?" 
                    className="w-full pl-10 pr-4 py-2 text-3xl font-serif text-gray-900 placeholder:text-gray-300 outline-none"
                    autoFocus
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                
                {/* Cột trái: Dữ liệu */}
                <div className="col-span-1 space-y-10">
                    <div>
                        <h3 className="font-bold text-lg mb-4 text-[#3D021E]">Đang thịnh hành</h3>
                        <ul className="space-y-3">
                            {trendingSearches.length > 0 ? trendingSearches.map(item => (
                                <li key={item}>
                                    <button 
                                        onClick={() => handleExecuteSearch(item)}
                                        className="text-gray-600 hover:text-[#3D021E] hover:font-bold font-medium transition-all text-left"
                                    >
                                        {item}
                                    </button>
                                </li>
                            )) : <p className="text-sm text-gray-400 italic">Đang cập nhật...</p>}
                        </ul>
                    </div>
                    
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg text-[#3D021E]">Lịch sử tìm kiếm</h3>
                            {recentSearches.length > 0 && (
                                <button onClick={handleClearRecent} className="text-xs text-gray-400 hover:text-red-500 hover:underline">Xóa lịch sử</button>
                            )}
                        </div>
                        {recentSearches.length === 0 ? (
                            <p className="text-sm text-gray-400 italic">Chưa có tìm kiếm nào</p>
                        ) : (
                            <ul className="space-y-3">
                                {recentSearches.map((item, index) => (
                                    <li key={`${item}-${index}`}>
                                        <button 
                                            onClick={() => handleExecuteSearch(item)}
                                            className="text-gray-600 hover:text-[#3D021E] hover:font-bold font-medium transition-all text-left"
                                        >
                                            {item}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Cột phải: Sản phẩm */}
                <div className="col-span-3">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg text-[#3D021E]">Sản phẩm nổi bật</h3>
                        <button onClick={() => { onClose(); navigate('/products'); }} className="text-gray-500 text-sm font-bold hover:text-[#3D021E] hover:underline">
                            Xem tất cả
                        </button>
                    </div>
                    
                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-[#3D021E]" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {popularProducts.map((product) => (
                                <div 
                                    key={product.id} 
                                    className="group cursor-pointer"
                                    onClick={() => { onClose(); navigate(`/product/${product.id}`); }}
                                >
                                    <div className="aspect-[3/4] overflow-hidden bg-gray-50 mb-3 border border-gray-100 rounded-xl relative">
                                        <img 
                                            src={product.imageUrl || product.image || "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=200"} 
                                            alt={product.name} 
                                            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500 p-2"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-[#3D021E] uppercase">{product.brand || 'GLOW AURA'}</p>
                                        <h4 className="text-sm font-bold text-gray-900 truncate">{product.name}</h4>
                                        <p className="text-[10px] text-gray-500 line-clamp-2 leading-relaxed">
                                            {product.description || 'Sản phẩm chăm sóc da cao cấp.'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
      </div>
    </div>
  );
};