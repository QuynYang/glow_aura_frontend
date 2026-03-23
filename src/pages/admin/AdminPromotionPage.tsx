import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Plus, Ticket, ShoppingCart, Clock, 
  Copy, Edit, Trash2, ChevronLeft, ChevronRight, Sparkles, Loader2 
} from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import apiClient from '../../services/apiClient';

// Danh sách Tabs
const tabs = [
    { id: 'active', label: 'Đang hoạt động' },
    { id: 'scheduled', label: 'Đã lên lịch' },
    { id: 'expired', label: 'Đã hết hạn' },
    { id: 'archived', label: 'Đã lưu trữ' },
];

// Component Thẻ Thống Kê
const StatCard = ({ label, value, subtext, icon: Icon, colorClass }: any) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex-1 flex flex-col justify-between h-36 relative overflow-hidden">
        <div className="flex justify-between items-start z-10">
            <div>
                <p className="text-gray-500 text-sm font-medium mb-1">{label}</p>
                <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${colorClass} bg-opacity-10`}>
                <Icon className={`w-6 h-6 ${colorClass.replace('bg-', 'text-')}`} />
            </div>
        </div>
        <div className={`text-xs font-bold z-10 ${colorClass.replace('bg-', 'text-')}`}>
            {subtext}
        </div>
    </div>
);

export const AdminPromotionPage = () => {
  const navigate = useNavigate(); 
  
  // States Quản lý Dữ liệu
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({ active: 0, totalUsed: 0, expiringSoon: 0 });

  // States Quản lý UI
  const [activeTab, setActiveTab] = useState('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // States Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // 1. GỌI API LẤY DANH SÁCH MÃ GIẢM GIÁ
  useEffect(() => {
      const fetchCoupons = async () => {
          setIsLoading(true);
          try {
              // Gọi API lấy danh sách Coupon (Giả sử endpoint là /Coupons)
              // Nếu Backend C# của bạn dùng tên khác (như /Discounts), hãy sửa lại nhé!
              const response = await apiClient.get('/Coupons').catch(() => ({ data: [] })); 
              
              let couponsList = [];
              if (response.data && Array.isArray(response.data)) couponsList = response.data;
              else if (response.data?.data && Array.isArray(response.data.data)) couponsList = response.data.data;
              else if (response.data?.items && Array.isArray(response.data.items)) couponsList = response.data.items;

              const now = new Date();
              let activeCount = 0;
              let usedCount = 0;
              let expiringCount = 0;

              const formattedCoupons = couponsList.map((c: any) => {
                  const expiryDate = new Date(c.expiryDate || c.validUntil || Date.now());
                  const isExpired = expiryDate < now;
                  const status = isExpired ? 'expired' : (c.isActive === false ? 'archived' : 'active');
                  
                  // Kiểm tra sắp hết hạn (trong vòng 7 ngày)
                  const diffTime = Math.abs(expiryDate.getTime() - now.getTime());
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  if (!isExpired && diffDays <= 7) expiringCount++;

                  if (status === 'active') activeCount++;
                  usedCount += (c.usedCount || c.used || 0);

                  return {
                      id: c.id,
                      code: c.code || c.couponCode,
                      type: c.discountType === 1 || c.type === 'Percentage' ? 'Phần trăm' : 'Số tiền cố định',
                      value: c.discountType === 1 || c.type === 'Percentage' ? `${c.discountValue}% GIẢM` : `${(c.discountValue || 0).toLocaleString('vi-VN')}đ GIẢM`,
                      used: c.usedCount || c.used || 0,
                      limit: c.usageLimit || c.maxUses || -1,
                      expiry: isExpired ? 'Đã hết hạn' : expiryDate.toLocaleDateString('vi-VN', { day: '2-digit', month: 'short', year: 'numeric' }),
                      status: status
                  };
              });

              setVouchers(formattedCoupons);
              setStats({ active: activeCount, totalUsed: usedCount, expiringSoon: expiringCount });

          } catch (error) {
              console.error("Lỗi khi tải danh sách Khuyến mãi:", error);
          } finally {
              setIsLoading(false);
          }
      };

      fetchCoupons();
  }, []);

  // --- LOGIC LỌC & TÌM KIẾM ---
  const filteredVouchers = vouchers.filter(voucher => {
      // 1. Lọc theo Tab (Trạng thái)
      let matchesTab = true;
      if (activeTab === 'active') matchesTab = voucher.status === 'active';
      else if (activeTab === 'expired') matchesTab = voucher.status === 'expired';
      else if (activeTab === 'scheduled') matchesTab = voucher.status === 'scheduled';
      else if (activeTab === 'archived') matchesTab = voucher.status === 'archived';
      
      // 2. Tìm kiếm (Mã code)
      const matchesSearch = voucher.code.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesTab && matchesSearch;
  });

  // --- LOGIC PHÂN TRANG ---
  const totalPages = Math.ceil(filteredVouchers.length / ITEMS_PER_PAGE);
  const currentVouchers = filteredVouchers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  useEffect(() => { setCurrentPage(1); }, [activeTab, searchTerm]);

  // --- LOGIC SAO CHÉP MÃ ---
  const handleCopyCode = (code: string, id: string) => {
      navigator.clipboard.writeText(code);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <AdminLayout>
      
      {/* 1. HEADER PAGE */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Khuyến Mãi & Mã Giảm Giá</h1>
            <p className="text-sm text-gray-500 mt-1">Quản lý các mã giảm giá và chương trình ưu đãi đặc biệt.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Tìm kiếm mã code..." 
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#3D021E] focus:ring-1 focus:ring-[#3D021E]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <button 
                onClick={() => navigate('/admin/promotions/add')}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#3D021E] text-white rounded-lg text-sm font-bold hover:bg-orange-600 shadow-lg shadow-orange-100 transition-all whitespace-nowrap"
            >
                <Plus className="w-4 h-4" /> Thêm Mã Mới
            </button>
        </div>
      </div>

      {/* 2. STATS BOARD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard label="Tổng Mã Đang Hoạt Động" value={stats.active} subtext="Realtime" icon={Ticket} colorClass="bg-orange-500" />
          <StatCard label="Tổng Lượt Sử Dụng" value={stats.totalUsed.toLocaleString('vi-VN')} subtext="Tính đến hiện tại" icon={ShoppingCart} colorClass="bg-blue-500" />
          <StatCard label="Sắp Hết Hạn" value={stats.expiringSoon} subtext="Trong 7 ngày tới" icon={Clock} colorClass="bg-red-500" />
      </div>

      {/* 3. VOUCHER LIST */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
         
         {/* Tabs Navigation */}
         <div className="px-6 pt-6 border-b border-gray-100 flex gap-8 overflow-x-auto no-scrollbar">
             {tabs.map((tab) => (
                 <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap
                        ${activeTab === tab.id 
                            ? 'border-[#3D021E] text-[#3D021E]' 
                            : 'border-transparent text-gray-500 hover:text-gray-900'}
                    `}
                 >
                     {tab.label}
                 </button>
             ))}
         </div>

         {/* Data Table */}
         <div className="overflow-x-auto p-6 min-h-[300px]">
             <table className="w-full text-left text-sm border-separate border-spacing-y-4">
                 <thead className="text-gray-500 uppercase tracking-wider text-xs font-bold">
                     <tr>
                         <th className="pb-4 pl-4">Tên Mã Code</th>
                         <th className="pb-4">Loại</th>
                         <th className="pb-4">Giá Trị</th>
                         <th className="pb-4 w-1/4">Trạng Thái Sử Dụng</th>
                         <th className="pb-4">Ngày Hết Hạn</th>
                         <th className="pb-4 text-right pr-4">Hành Động</th>
                     </tr>
                 </thead>
                 <tbody>
                     {isLoading ? (
                         <tr>
                             <td colSpan={6} className="py-12 text-center">
                                 <Loader2 className="w-8 h-8 animate-spin text-[#3D021E] mx-auto mb-2" />
                                 <span className="text-gray-500 font-medium">Đang tải mã khuyến mãi...</span>
                             </td>
                         </tr>
                     ) : currentVouchers.length > 0 ? (
                         currentVouchers.map((voucher) => (
                             <tr key={voucher.id} className="bg-white hover:bg-gray-50 transition-shadow shadow-sm hover:shadow-md rounded-xl group border border-gray-100">
                                 {/* Code Name */}
                                 <td className="py-4 pl-4 rounded-l-xl">
                                     <div className="flex items-center gap-2">
                                         <span className="font-bold text-gray-900 text-base uppercase">{voucher.code}</span>
                                         <button 
                                            onClick={() => handleCopyCode(voucher.code, voucher.id)}
                                            className={`transition-colors ${copiedId === voucher.id ? 'text-green-500' : 'text-gray-400 hover:text-[#3D021E]'}`} 
                                            title="Sao chép mã"
                                         >
                                             {copiedId === voucher.id ? <span className="text-xs font-bold">Đã chép!</span> : <Copy className="w-3.5 h-3.5" />}
                                         </button>
                                     </div>
                                 </td>

                                 {/* Type */}
                                 <td className="py-4">
                                     <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium border border-gray-200 whitespace-nowrap">
                                         {voucher.type}
                                     </span>
                                 </td>

                                 {/* Value */}
                                 <td className="py-4">
                                     <span className="font-bold text-[#3D021E] text-base whitespace-nowrap">{voucher.value}</span>
                                 </td>

                                 {/* Usage Status (Progress Bar) */}
                                 <td className="py-4 pr-6">
                                     <div className="flex justify-between text-xs font-medium mb-1.5 text-gray-500">
                                         <span>{voucher.limit === -1 ? 'Không giới hạn' : `${voucher.used} / ${voucher.limit}`}</span>
                                         {voucher.limit !== -1 && <span>{Math.round((voucher.used / voucher.limit) * 100)}%</span>}
                                     </div>
                                     <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                         <div 
                                            className={`h-full rounded-full ${voucher.limit === -1 ? 'bg-blue-300 w-full' : 'bg-[#3D021E]'}`} 
                                            style={{ width: voucher.limit === -1 ? '100%' : `${(voucher.used / voucher.limit) * 100}%` }}
                                         ></div>
                                     </div>
                                 </td>

                                 {/* Expiry Date */}
                                 <td className={`py-4 font-medium whitespace-nowrap ${voucher.status === 'expired' ? 'text-red-500' : 'text-gray-600'}`}>
                                     {voucher.expiry}
                                 </td>

                                 {/* Actions */}
                                 <td className="py-4 pr-4 rounded-r-xl text-right">
                                     <div className="flex items-center justify-end gap-2">
                                         <button 
                                            onClick={() => alert('Đang phát triển API Chỉnh sửa Khuyến mãi')}
                                            className="p-2 text-gray-400 hover:text-[#3D021E] hover:bg-orange-50 rounded-lg transition-colors"
                                         >
                                             <Edit className="w-4 h-4" />
                                         </button>
                                         <button 
                                            onClick={() => { if(window.confirm('Xóa mã này?')) alert('Đang gọi API Xóa...'); }}
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
                             <td colSpan={6} className="py-12 text-center text-gray-500">
                                 Không tìm thấy mã giảm giá nào phù hợp.
                             </td>
                         </tr>
                     )}
                 </tbody>
             </table>
         </div>

         {/* Footer Pagination */}
         {totalPages > 0 && (
             <div className="p-6 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                 <span>Hiển thị {currentVouchers.length} trên tổng {filteredVouchers.length} kết quả</span>
                 <div className="flex items-center gap-2">
                     <button 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                     >
                        <ChevronLeft className="w-4 h-4" />
                     </button>

                     {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button 
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-8 h-8 flex items-center justify-center font-bold rounded-lg transition-all
                                ${currentPage === page 
                                    ? 'bg-[#3D021E] text-white shadow-md shadow-orange-200' 
                                    : 'border border-gray-200 hover:bg-gray-50 text-gray-700'}
                            `}
                        >
                            {page}
                        </button>
                     ))}

                     <button 
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                     >
                        <ChevronRight className="w-4 h-4" />
                     </button>
                 </div>
             </div>
         )}
      </div>

      {/* 4. BOTTOM BANNER */}
      <div className="bg-blue-50 border border-blue-100 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center">
          <div className="text-blue-400 mb-2">
              <Sparkles className="w-6 h-6 inline-block" />
          </div>
          <p className="text-gray-600 text-sm max-w-lg mx-auto leading-relaxed">
              Sử dụng các chương trình khuyến mãi để thúc đẩy doanh số bán hàng theo mùa và thưởng cho khách hàng trung thành.
              Hầu hết các chiến dịch thành công đều sử dụng mức giảm giá <span className="font-bold text-gray-800">15-20%</span>.
          </p>
      </div>

    </AdminLayout>
  );
};