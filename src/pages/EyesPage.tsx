import { useState, useEffect } from 'react';
import { ChevronDown, Heart, ShoppingCart, ChevronRight, Loader2 } from 'lucide-react';
import { MainLayout } from '../components/layout/MainLayout';
import { Link } from 'react-router-dom';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';

// Danh sách Tabs
const tabs = [
  { id: 'all', label: 'TẤT CẢ' },
  { id: 'Phấn mắt', label: 'PHẤN MẮT' },
  { id: 'Mascara', label: 'MASCARA' },
  { id: 'Kẻ mắt', label: 'KẺ MẮT' },
];

export const EyesPage = () => {
  const { addToCart } = useCart(); // Lấy hàm addToCart
  
  const [activeTab, setActiveTab] = useState('all');
  const [allProducts, setAllProducts] = useState<any[]>([]); 
  const [displayedProducts, setDisplayedProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Quản lý Sắp xếp
  const [sortOption, setSortOption] = useState<string>('all');
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      setIsLoading(true);
      try {
        const payload = {
            category: "Mắt", 
            pageNumber: 1,
            pageSize: 100 
        };
        const response = await productService.advancedSearch(payload);
        const items = Array.isArray(response) ? response : (response?.items || response?.data || []);
        
        setAllProducts(items);
        setDisplayedProducts(items);
      } catch (error) {
        console.error("Lỗi khi tải danh mục Mắt:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryProducts();
    window.scrollTo(0, 0);
  }, []);

  // LOGIC LỌC TABS VÀ SẮP XẾP
  useEffect(() => {
      let result = [...allProducts];

      // Lọc theo Tab
      if (activeTab !== 'all') {
          result = result.filter(p => 
             p.name.toLowerCase().includes(activeTab.toLowerCase()) || 
             (p.description && p.description.toLowerCase().includes(activeTab.toLowerCase()))
          );
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
  }, [activeTab, sortOption, allProducts]);

  // Xử lý thêm vào giỏ hàng
  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    
    const productToAdd = {
        ...product,
        price: product.discountedPrice || product.price,
        imageUrl: product.imageUrl || product.image
    };
    addToCart(productToAdd, 1);
  };

  const handleAddToWishlist = (e: React.MouseEvent, productName: string) => {
    e.preventDefault();
    e.stopPropagation(); 
    alert(`Đã thêm "${productName}" vào danh sách yêu thích!`);
  };

  return (
    <MainLayout>
      {/* 1. HERO BANNER */}
      <section className="relative h-[350px] md:h-[450px] bg-gray-900 overflow-hidden">
        <img 
          src="https://www.bubblesindia.com/wp-content/uploads/2019/03/Bubbles_Services_Banner_Eye_Makeup.jpg" 
          alt="Eyes Makeup Banner" 
          className="w-full h-full object-cover object-top opacity-60"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40 flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-4xl md:text-6xl font-serif text-white mb-2 drop-shadow-lg tracking-wide" style={{ fontFamily: 'Playfair Display, serif' }}>
                Ánh Nhìn Quyến Rũ
            </h1>
            <p className="text-white/90 text-xs md:text-sm uppercase tracking-[0.2em] font-medium drop-shadow-md max-w-xl mt-4">
                Khám phá bộ sưu tập phấn mắt, mascara và chì kẻ mắt cao cấp giúp tôn vinh vẻ đẹp cửa sổ tâm hồn của bạn.
            </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10 max-w-[1300px]">
        
        {/* 2. FILTER BAR & SORTING */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6 border-b border-gray-100 pb-6">
            
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 rounded-sm
                            ${activeTab === tab.id 
                                ? 'bg-[#3D021E] text-white shadow-md' 
                                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}
                        `}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Sắp xếp */}
            <div className="flex items-center gap-6">
                <div className="relative">
                    <button 
                        onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                        className="flex items-center gap-2 text-xs font-bold uppercase text-gray-800 hover:text-[#3D021E] py-2"
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
        </div>

        {/* 3. PRODUCT GRID */}
        {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32">
                <Loader2 className="w-10 h-10 animate-spin text-[#3D021E] mb-4" />
                <p className="text-gray-500 font-bold">Đang tải bộ sưu tập...</p>
            </div>
        ) : displayedProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 bg-[#FAF7F8] rounded-2xl border border-[#F3EAF0]">
                <p className="text-gray-500 text-lg font-medium">Chưa có sản phẩm nào trong danh mục này.</p>
            </div>
        ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
                {displayedProducts.map((product) => {
                    const displayPrice = product.discountedPrice || product.price;
                    const hasDiscount = product.discountedPrice && product.discountedPrice < product.price;

                    return (
                        <div key={product.id} className="group cursor-pointer flex flex-col h-full">
                            
                            {/* Hình ảnh */}
                            <Link to={`/product/${product.id}`} className="relative aspect-square overflow-hidden mb-4 bg-gray-50 rounded-xl border border-gray-100 block">
                                <img 
                                    src={product.imageUrl || product.image || "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=200"} 
                                    alt={product.name} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 mix-blend-multiply"
                                />
                                
                                {/* Tags */}
                                {product.tag && (
                                    <span className="absolute top-2 left-2 text-[10px] font-bold uppercase px-3 py-1 text-white bg-[#3D021E] rounded-sm shadow-sm">
                                        {product.tag}
                                    </span>
                                )}
                                {hasDiscount && !product.tag && (
                                    <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-3 py-1 uppercase tracking-wider rounded-sm shadow-sm">
                                        SALE
                                    </span>
                                )}

                                {/* Hover Action */}
                                <div className="absolute bottom-3 left-0 right-0 px-3 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                                    <button 
                                        onClick={(e) => handleAddToWishlist(e, product.name)}
                                        className="bg-white hover:bg-[#3D021E] hover:text-white text-gray-900 p-2 rounded-full shadow-md transition-colors"
                                    >
                                        <Heart className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={(e) => handleAddToCart(e, product)}
                                        className="bg-white hover:bg-[#3D021E] hover:text-white text-gray-900 px-4 py-2 rounded-full text-xs font-bold uppercase shadow-md transition-colors flex items-center gap-2"
                                    >
                                        <ShoppingCart className="w-3 h-3" /> Thêm
                                    </button>
                                </div>
                            </Link>

                            {/* Thông tin Text */}
                            <div className="flex flex-col flex-grow">
                                <h3 className="text-sm font-serif font-bold text-gray-900 group-hover:text-[#3D021E] transition-colors mb-1 truncate">
                                    <Link to={`/product/${product.id}`}>{product.name}</Link>
                                </h3>
                                
                                <p className="text-xs text-gray-500 italic mb-2 font-light line-clamp-1">
                                    {product.description || "Sản phẩm trang điểm mắt"}
                                </p>

                                <div className="flex items-center gap-2 mt-auto">
                                    <span className="text-sm font-bold text-gray-900">
                                        {displayPrice.toLocaleString('vi-VN')}đ
                                    </span>
                                    {hasDiscount && (
                                        <span className="text-xs text-gray-400 line-through">
                                            {product.price.toLocaleString('vi-VN')}đ
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        )}

        {/* 4. PAGINATION */}
        {displayedProducts.length > 0 && (
            <div className="mt-16 flex justify-center gap-2">
                <button className="w-8 h-8 bg-[#3D021E] text-white flex items-center justify-center font-medium text-sm rounded-sm shadow-md">1</button>
                <button className="w-8 h-8 border border-gray-200 text-gray-600 flex items-center justify-center font-medium text-sm rounded-sm hover:border-[#3D021E] hover:text-[#3D021E] shadow-sm">2</button>
                <button className="w-8 h-8 border border-gray-200 text-gray-600 flex items-center justify-center rounded-sm hover:border-[#3D021E] hover:text-[#3D021E] shadow-sm">
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        )}

      </div>
    </MainLayout>
  );
};