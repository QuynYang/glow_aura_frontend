import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Search, Filter, Edit, Trash2, ChevronLeft, ChevronRight, Loader2
} from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import apiClient from '../../services/apiClient';

const StatCard = ({ label, value, colorClass }: any) => (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex-1">
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{label}</h4>
        <div className={`text-3xl font-bold ${colorClass}`}>{value}</div>
    </div>
);

export const AdminProductPage = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [stats, setStats] = useState({ totalSKU: 0, lowStock: 0, outOfStock: 0, totalValue: 0 });

  // State Quản lý UI
  const [activeTab, setActiveTab] = useState('Tất cả');
  const [dynamicCategories, setDynamicCategories] = useState<string[]>(['Tất cả']); // Tabs động
  const [searchTerm, setSearchTerm] = useState('');
  
  // State Quản lý Bộ lọc (Filter Dropdown)
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [stockFilter, setStockFilter] = useState('all'); // 'all', 'low', 'out'
  const filterRef = useRef<HTMLDivElement>(null);

  // State Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Đóng bộ lọc khi click ra ngoài
  useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
          if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
              setIsFilterOpen(false);
          }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const response = await apiClient.get('/Products');
            
            let productsList = [];
            if (response.data && Array.isArray(response.data)) productsList = response.data;
            else if (response.data?.data && Array.isArray(response.data.data)) productsList = response.data.data;
            else if (response.data?.items && Array.isArray(response.data.items)) productsList = response.data.items;

            const formattedProducts = productsList.map((p: any) => ({
                id: p.id,
                name: p.name,
                variant: p.brand || p.description?.substring(0, 30) + '...',
                sku: p.sku || `SKU-${p.id.toString().padStart(5, '0')}`,
                category: p.category || 'Khác',
                price: p.discountedPrice || p.price || 0,
                stock: p.stockQuantity || p.stock || 0,
                maxStock: 100, 
                status: (p.stockQuantity || p.stock || 0) === 0 ? "Hết hàng" : (p.stockQuantity || p.stock || 0) <= 5 ? "Sắp hết" : "Còn hàng",
                image: p.imageUrl || p.image || "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=100"
            }));

            setProducts(formattedProducts);

            // 1. TỰ ĐỘNG TẠO TABS DANH MỤC TỪ DỮ LIỆU THẬT
            const uniqueCats = Array.from(new Set(formattedProducts.map((p: any) => p.category))).filter(Boolean) as string[];
            setDynamicCategories(['Tất cả', ...uniqueCats]);

            // Tính toán Thống kê
            let low = 0, out = 0, value = 0;
            formattedProducts.forEach((p: any) => {
                if (p.stock === 0) out++;
                else if (p.stock <= 5) low++;
                value += (p.price * p.stock);
            });

            setStats({
                totalSKU: formattedProducts.length,
                lowStock: low,
                outOfStock: out,
                totalValue: value
            });

        } catch (error) {
            console.error("Lỗi tải danh sách Sản phẩm:", error);
        } finally {
            setIsLoading(false);
        }
    };

    fetchProducts();
  }, []);

  // --- LOGIC LỌC SẢN PHẨM CHẶT CHẼ ---
  const filteredProducts = products.filter((product) => {
    // 1. Điều kiện Danh mục (Tabs)
    const matchesCategory = activeTab === 'Tất cả' || product.category === activeTab;

    // 2. Điều kiện Tìm kiếm (Tên hoặc SKU)
    const matchesSearch = 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        product.sku.toLowerCase().includes(searchTerm.toLowerCase());

    // 3. Điều kiện Bộ lọc Tồn kho (Nút Filter)
    let matchesStock = true;
    if (stockFilter === 'low') matchesStock = product.stock <= 5 && product.stock > 0;
    if (stockFilter === 'out') matchesStock = product.stock === 0;

    return matchesCategory && matchesSearch && matchesStock;
  });

  // LOGIC PHÂN TRANG
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const currentProducts = filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Reset trang khi đổi filter
  useEffect(() => { setCurrentPage(1); }, [activeTab, searchTerm, stockFilter]);

  // UI Helpers
  const getStockBarColor = (current: number, max: number) => {
    if (current === 0) return 'bg-gray-200';
    if (current <= 5) return 'bg-red-500';
    return 'bg-[#3D021E]';
  };

  const getStockWidth = (current: number, max: number) => {
    return `${Math.min((current / max) * 100, 100)}%`;
  };

  const formatCurrency = (amount: number) => {
      if (amount >= 1000000000) return `${(amount / 1000000000).toFixed(1)} Tỷ`;
      if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)} Triệu`;
      return `${amount.toLocaleString('vi-VN')}đ`;
  };

  return (
    <AdminLayout>
      
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
            <h1 className="text-2xl font-bold text-[#3D021E]">Quản Lý Kho Hàng</h1>
            <p className="text-sm text-gray-500 mt-1">Theo dõi mức tồn kho và quản lý danh mục sản phẩm của bạn.</p>
        </div>
        <button 
            onClick={() => navigate('/admin/products/add')}
            className="flex items-center gap-2 px-6 py-3 bg-[#3D021E] text-white rounded-lg text-sm font-bold hover:bg-[#5a032d] shadow-lg shadow-pink-900/20 transition-all transform hover:-translate-y-1"
        >
            <Plus className="w-5 h-5" /> Thêm Sản Phẩm Mới
        </button>
      </div>

      {/* 2. STATS BOARD */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
         <StatCard label="Tổng Mã Hàng (SKU)" value={stats.totalSKU.toLocaleString('vi-VN')} colorClass="text-[#3D021E]" />
         <StatCard label="Sắp Hết Hàng" value={stats.lowStock} colorClass="text-red-500" />
         <StatCard label="Hết Hàng" value={stats.outOfStock} colorClass="text-gray-400" />
         <StatCard label="Giá Trị Kho" value={formatCurrency(stats.totalValue)} colorClass="text-[#3D021E]" />
      </div>

      {/* 3. TOOLBAR (Search & Filter) */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex gap-4 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Tìm kiếm theo tên, SKU..." 
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#3D021E] focus:ring-1 focus:ring-[#3D021E]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            
            {/* NÚT BỘ LỌC ĐÃ HOẠT ĐỘNG */}
            <div className="relative" ref={filterRef}>
                <button 
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm font-bold transition-colors ${stockFilter !== 'all' ? 'border-[#3D021E] text-[#3D021E] bg-pink-50' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                >
                    <Filter className="w-4 h-4" /> {stockFilter === 'all' ? 'Bộ lọc' : 'Đang lọc...'}
                </button>
                
                {isFilterOpen && (
                    <div className="absolute left-0 md:right-0 md:left-auto top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-50 py-2 animate-in fade-in zoom-in-95">
                        <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Lọc Tồn kho</div>
                        <button onClick={() => {setStockFilter('all'); setIsFilterOpen(false)}} className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${stockFilter === 'all' ? 'text-[#3D021E] font-bold' : 'text-gray-700'}`}>Tất cả trạng thái</button>
                        <button onClick={() => {setStockFilter('low'); setIsFilterOpen(false)}} className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center justify-between ${stockFilter === 'low' ? 'text-red-500 font-bold' : 'text-gray-700'}`}>
                            Sắp hết hàng <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full">{stats.lowStock}</span>
                        </button>
                        <button onClick={() => {setStockFilter('out'); setIsFilterOpen(false)}} className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center justify-between ${stockFilter === 'out' ? 'text-gray-500 font-bold' : 'text-gray-700'}`}>
                            Hết hàng <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{stats.outOfStock}</span>
                        </button>
                    </div>
                )}
            </div>
        </div>

        {/* TABS DANH MỤC ĐỘNG (Dynamic Categories) */}
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
            {dynamicCategories.map((tab) => (
                <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors
                        ${activeTab === tab 
                            ? 'bg-[#3D021E] text-white shadow-sm shadow-pink-200' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                    `}
                >
                    {tab}
                </button>
            ))}
        </div>
      </div>

      {/* 4. PRODUCT TABLE */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
         <div className="overflow-x-auto min-h-[400px]">
             <table className="w-full text-left text-sm">
                 <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-xs font-bold border-b border-gray-100">
                     <tr>
                         <th className="px-6 py-4">Sản phẩm</th>
                         <th className="px-6 py-4">Mã SKU</th>
                         <th className="px-6 py-4">Danh mục</th>
                         <th className="px-6 py-4">Giá bán</th>
                         <th className="px-6 py-4 w-1/4">Tồn kho</th>
                         <th className="px-6 py-4 text-right">Hành động</th>
                     </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                     {isLoading ? (
                         <tr>
                             <td colSpan={6} className="px-6 py-12 text-center">
                                 <Loader2 className="w-8 h-8 animate-spin text-[#3D021E] mx-auto mb-2" />
                                 <span className="text-gray-500 font-medium">Đang tải kho hàng...</span>
                             </td>
                         </tr>
                     ) : currentProducts.length > 0 ? (
                         currentProducts.map((product) => (
                             <tr key={product.id} className="hover:bg-gray-50 transition-colors group">
                                 <td className="px-6 py-4">
                                     <div className="flex items-center gap-4">
                                         <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 p-1 flex-shrink-0">
                                            <img src={product.image} alt="" className="w-full h-full object-cover rounded-md mix-blend-multiply" />
                                         </div>
                                         <div>
                                             <h4 className="font-bold text-gray-900 line-clamp-1 max-w-[200px]">{product.name}</h4>
                                             <p className="text-xs text-gray-500">{product.variant}</p>
                                         </div>
                                     </div>
                                 </td>
                                 <td className="px-6 py-4">
                                     <span className="font-mono text-xs font-bold bg-gray-100 px-2 py-1 rounded text-gray-600">
                                         {product.sku}
                                     </span>
                                 </td>
                                 <td className="px-6 py-4 text-gray-600">
                                     {product.category}
                                 </td>
                                 <td className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap">
                                     {product.price.toLocaleString('vi-VN')}đ
                                 </td>
                                 <td className="px-6 py-4">
                                     <div className="flex items-center justify-between mb-1 text-xs">
                                         <span className="font-bold text-gray-700">{product.stock} SP</span>
                                         {product.status === 'Sắp hết' && <span className="text-red-500 font-bold text-[10px] uppercase">Sắp hết</span>}
                                         {product.status === 'Hết hàng' && <span className="text-gray-400 font-bold text-[10px] uppercase">Hết hàng</span>}
                                     </div>
                                     <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                         <div 
                                            className={`h-full rounded-full transition-all duration-1000 ${getStockBarColor(product.stock, product.maxStock)}`} 
                                            style={{ width: getStockWidth(product.stock, product.maxStock) }}
                                         ></div>
                                     </div>
                                 </td>
                                 <td className="px-6 py-4 text-right">
                                     <div className="flex items-center justify-end gap-2">
                                         <button 
                                            onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                                            className="p-2 text-gray-400 hover:text-[#3D021E] hover:bg-purple-50 rounded-lg transition-colors"
                                         >
                                             <Edit className="w-4 h-4" />
                                         </button>
                                         <button 
                                            onClick={() => { if(window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) alert('Đang gọi API Xóa...'); }}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                         >
                                             <Trash2 className="w-4 h-4" />
                                         </button>
                                     </div>
                                 </td>
                             </tr>
                         ))
                     ) : (
                         <tr>
                             <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                 Không tìm thấy sản phẩm nào phù hợp với bộ lọc.
                             </td>
                         </tr>
                     )}
                 </tbody>
             </table>
         </div>
         
         {/* Footer Pagination */}
         {totalPages > 0 && (
             <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                 <span>Hiển thị {currentProducts.length} trên tổng {filteredProducts.length} kết quả</span>
                 <div className="flex items-center gap-2">
                     <button 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 transition-colors"
                     >
                        <ChevronLeft className="w-4 h-4" />
                     </button>
                     
                     {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button 
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-8 h-8 flex items-center justify-center font-bold rounded-lg transition-all
                                ${currentPage === page 
                                    ? 'bg-[#3D021E] text-white shadow-md shadow-pink-200' 
                                    : 'border border-transparent hover:bg-gray-50 text-gray-700'}
                            `}
                        >
                            {page}
                        </button>
                     ))}

                     <button 
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 transition-colors"
                     >
                        <ChevronRight className="w-4 h-4" />
                     </button>
                 </div>
             </div>
         )}
      </div>

    </AdminLayout>
  );
};