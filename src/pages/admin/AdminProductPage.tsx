import { useState } from 'react';
import { 
  Plus, Search, Filter, Edit, Trash2, ChevronLeft, ChevronRight, 
  MoreHorizontal, AlertCircle, CheckCircle2, XCircle 
} from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';

// --- 1. MOCK DATA (Dữ liệu giả lập ngành mỹ phẩm) ---
const products = [
  {
    id: 1,
    name: "Son Kem Lì Aura Velvet",
    variant: "Màu Đỏ Gạch (01)",
    sku: "SKU-88219",
    category: "Trang Điểm",
    price: 299000,
    stock: 82,
    maxStock: 100,
    status: "Còn hàng",
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=100"
  },
  {
    id: 2,
    name: "Serum Vitamin C Glow",
    variant: "30ml - Bản Giới Hạn",
    sku: "SKU-44120",
    category: "Chăm Sóc Da",
    price: 1450000,
    stock: 4,
    maxStock: 50,
    status: "Sắp hết",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=100"
  },
  {
    id: 3,
    name: "Kem Dưỡng Ẩm Midnight",
    variant: "Hũ 50g",
    sku: "SKU-11005",
    category: "Chăm Sóc Da",
    price: 890000,
    stock: 42,
    maxStock: 100,
    status: "Còn hàng",
    image: "https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?q=80&w=100"
  },
  {
    id: 4,
    name: "Nước Hoa Rose Garden",
    variant: "50ml Spray",
    sku: "SKU-90921",
    category: "Nước Hoa",
    price: 2500000,
    stock: 0,
    maxStock: 30,
    status: "Hết hàng",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=100"
  },
  {
    id: 5,
    name: "Phấn Phủ Kiềm Dầu",
    variant: "Tone Tự Nhiên",
    sku: "SKU-77283",
    category: "Trang Điểm",
    price: 420000,
    stock: 156,
    maxStock: 200,
    status: "Còn hàng",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdd403348?q=80&w=100"
  },
];

// Thẻ thống kê nhỏ
const StatCard = ({ label, value, colorClass }: any) => (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex-1">
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{label}</h4>
        <div className={`text-3xl font-bold ${colorClass}`}>{value}</div>
    </div>
);

export const AdminProductPage = () => {
  const [activeTab, setActiveTab] = useState('all');

  // Hàm tính toán màu sắc thanh tiến trình tồn kho
  const getStockBarColor = (current: number, max: number) => {
    if (current === 0) return 'bg-gray-200';
    if (current <= 10) return 'bg-red-500'; // Sắp hết
    return 'bg-[#3D021E]'; // Bình thường
  };

  const getStockWidth = (current: number, max: number) => {
    return `${Math.min((current / max) * 100, 100)}%`;
  };

  return (
    <AdminLayout>
      
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
            <h1 className="text-2xl font-bold text-[#3D021E]">Quản Lý Kho Hàng</h1>
            <p className="text-sm text-gray-500 mt-1">Theo dõi mức tồn kho và quản lý danh mục sản phẩm của bạn.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-[#3D021E] text-white rounded-lg text-sm font-bold hover:bg-[#5a032d] shadow-lg shadow-purple-900/20 transition-all transform hover:-translate-y-1">
            <Plus className="w-5 h-5" /> Thêm Sản Phẩm Mới
        </button>
      </div>

      {/* 2. STATS BOARD */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
         <StatCard label="Tổng Mã Hàng (SKU)" value="1,284" colorClass="text-[#3D021E]" />
         <StatCard label="Sắp Hết Hàng" value="24" colorClass="text-red-500" />
         <StatCard label="Hết Hàng" value="8" colorClass="text-gray-400" />
         <StatCard label="Giá Trị Kho" value="8.5 Tỷ" colorClass="text-[#3D021E]" />
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
                />
            </div>
            {/* Filter Button */}
            <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50">
                <Filter className="w-4 h-4" /> Bộ lọc
            </button>
        </div>

        {/* Categories Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
            {['Tất cả', 'Trang điểm', 'Chăm sóc da', 'Nước hoa'].map((tab) => (
                <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors
                        ${activeTab === tab 
                            ? 'bg-[#3D021E] text-white' 
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
         <div className="overflow-x-auto">
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
                     {products.map((product) => (
                         <tr key={product.id} className="hover:bg-gray-50 transition-colors group">
                             {/* Product Info */}
                             <td className="px-6 py-4">
                                 <div className="flex items-center gap-4">
                                     <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 p-1 flex-shrink-0">
                                        <img src={product.image} alt="" className="w-full h-full object-cover rounded-md" />
                                     </div>
                                     <div>
                                         <h4 className="font-bold text-gray-900 line-clamp-1">{product.name}</h4>
                                         <p className="text-xs text-gray-500">{product.variant}</p>
                                     </div>
                                 </div>
                             </td>
                             
                             {/* SKU */}
                             <td className="px-6 py-4">
                                 <span className="font-mono text-xs font-bold bg-gray-100 px-2 py-1 rounded text-gray-600">
                                     {product.sku}
                                 </span>
                             </td>
                             
                             {/* Category */}
                             <td className="px-6 py-4 text-gray-600">
                                 {product.category}
                             </td>

                             {/* Price */}
                             <td className="px-6 py-4 font-bold text-gray-900">
                                 {product.price.toLocaleString('vi-VN')}đ
                             </td>

                             {/* Stock Level (Progress Bar) */}
                             <td className="px-6 py-4">
                                 <div className="flex items-center justify-between mb-1 text-xs">
                                     <span className="font-bold text-gray-700">{product.stock} SP</span>
                                     {product.status === 'Sắp hết' && <span className="text-red-500 font-bold text-[10px] uppercase">Sắp hết</span>}
                                     {product.status === 'Hết hàng' && <span className="text-gray-400 font-bold text-[10px] uppercase">Hết hàng</span>}
                                 </div>
                                 <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                     <div 
                                        className={`h-full rounded-full ${getStockBarColor(product.stock, product.maxStock)}`} 
                                        style={{ width: getStockWidth(product.stock, product.maxStock) }}
                                     ></div>
                                 </div>
                             </td>

                             {/* Actions */}
                             <td className="px-6 py-4 text-right">
                                 <div className="flex items-center justify-end gap-2">
                                     <button className="p-2 text-gray-400 hover:text-[#3D021E] hover:bg-purple-50 rounded-lg transition-colors">
                                         <Edit className="w-4 h-4" />
                                     </button>
                                     <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                         <Trash2 className="w-4 h-4" />
                                     </button>
                                 </div>
                             </td>
                         </tr>
                     ))}
                 </tbody>
             </table>
         </div>
         
         {/* Footer Pagination */}
         <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
             <span>Hiển thị 1 đến 5 của 1,284 kết quả</span>
             <div className="flex items-center gap-2">
                 <button className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"><ChevronLeft className="w-4 h-4" /></button>
                 <button className="w-8 h-8 flex items-center justify-center bg-[#3D021E] text-white font-bold rounded-lg">1</button>
                 <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg">2</button>
                 <span className="px-2">...</span>
                 <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg">128</button>
                 <button className="p-2 hover:bg-gray-100 rounded-lg"><ChevronRight className="w-4 h-4" /></button>
             </div>
         </div>
      </div>

    </AdminLayout>
  );
};