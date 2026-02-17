import { useState } from 'react';
import { 
  Search, Plus, Ticket, ShoppingCart, Clock, 
  Copy, Edit, Trash2, ChevronLeft, ChevronRight, Sparkles 
} from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';

// --- 1. MOCK DATA (Dữ liệu Khuyến mãi) ---
const vouchers = [
  {
    id: 1,
    code: "SUMMER24",
    type: "Phần trăm",
    value: "20% GIẢM",
    used: 82,
    limit: 100,
    expiry: "31 Th12, 2024",
    status: "active"
  },
  {
    id: 2,
    code: "WELCOME50",
    type: "Số tiền cố định",
    value: "50.000đ GIẢM",
    used: 45,
    limit: 500,
    expiry: "15 Th01, 2025",
    status: "active"
  },
  {
    id: 3,
    code: "FLASH_SALE",
    type: "Phần trăm",
    value: "40% GIẢM",
    used: 230,
    limit: 250,
    expiry: "Trong 2 ngày",
    status: "active"
  },
  {
    id: 4,
    code: "BFF_OFFER",
    type: "Số tiền cố định",
    value: "15.000đ GIẢM",
    used: 0,
    limit: -1, // Không giới hạn
    expiry: "01 Th12, 2024",
    status: "active"
  },
  {
    id: 5,
    code: "VIP_MEMBER",
    type: "Phần trăm",
    value: "10% GIẢM",
    used: 120,
    limit: 200,
    expiry: "Đã hết hạn",
    status: "expired"
  }
];

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
  const [activeTab, setActiveTab] = useState('active');
  const [searchTerm, setSearchTerm] = useState('');

  // --- LOGIC LỌC & TÌM KIẾM ---
  const filteredVouchers = vouchers.filter(voucher => {
      // 1. Lọc theo Tab (Trạng thái)
      // Lưu ý: Logic này giả lập, thực tế sẽ check ngày hết hạn hoặc trường status
      let matchesTab = true;
      if (activeTab === 'active') matchesTab = voucher.status === 'active';
      else if (activeTab === 'expired') matchesTab = voucher.status === 'expired';
      
      // 2. Tìm kiếm (Mã code)
      const matchesSearch = voucher.code.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesTab && matchesSearch;
  });

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
            <button className="flex items-center gap-2 px-6 py-2.5 bg-[#3D021E] text-white rounded-lg text-sm font-bold hover:bg-orange-600 shadow-lg shadow-orange-100 transition-all whitespace-nowrap">
                <Plus className="w-4 h-4" /> Thêm Mã Mới
            </button>
        </div>
      </div>

      {/* 2. STATS BOARD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard label="Tổng Mã Đang Hoạt Động" value="128" subtext="+5% so với tuần trước" icon={Ticket} colorClass="bg-orange-500" />
          <StatCard label="Tổng Lượt Sử Dụng" value="14,250" subtext="-2% so với tuần trước" icon={ShoppingCart} colorClass="bg-blue-500" />
          <StatCard label="Sắp Hết Hạn" value="12" subtext="Trong 7 ngày tới" icon={Clock} colorClass="bg-red-500" />
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
         <div className="overflow-x-auto p-6">
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
                 <tbody className="">
                     {filteredVouchers.length > 0 ? (
                         filteredVouchers.map((voucher) => (
                             <tr key={voucher.id} className="bg-white hover:bg-gray-50 transition-shadow shadow-sm hover:shadow-md rounded-xl group">
                                 {/* Code Name */}
                                 <td className="py-4 pl-4 border-t border-b border-l border-gray-100 rounded-l-xl">
                                     <div className="flex items-center gap-2">
                                         <span className="font-bold text-gray-900 text-base">{voucher.code}</span>
                                         <button className="text-gray-400 hover:text-[#3D021E]" title="Sao chép">
                                             <Copy className="w-3.5 h-3.5" />
                                         </button>
                                     </div>
                                 </td>

                                 {/* Type */}
                                 <td className="py-4 border-t border-b border-gray-100">
                                     <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium border border-gray-200">
                                         {voucher.type === 'Phần trăm' ? '% Phần trăm' : '$ Số tiền cố định'}
                                     </span>
                                 </td>

                                 {/* Value */}
                                 <td className="py-4 border-t border-b border-gray-100">
                                     <span className="font-bold text-[#3D021E] text-base">{voucher.value}</span>
                                 </td>

                                 {/* Usage Status (Progress Bar) */}
                                 <td className="py-4 border-t border-b border-gray-100 pr-6">
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
                                 <td className="py-4 border-t border-b border-gray-100 text-gray-600 font-medium">
                                     {voucher.expiry}
                                 </td>

                                 {/* Actions */}
                                 <td className="py-4 pr-4 border-t border-b border-r border-gray-100 rounded-r-xl text-right">
                                     <div className="flex items-center justify-end gap-2">
                                         <button className="p-2 text-gray-400 hover:text-[#3D021E] hover:bg-orange-50 rounded-lg transition-colors">
                                             <Edit className="w-4 h-4" />
                                         </button>
                                         <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                             <Trash2 className="w-4 h-4" />
                                         </button>
                                     </div>
                                 </td>
                             </tr>
                         ))
                     ) : (
                        <tr>
                            <td colSpan={6} className="py-12 text-center text-gray-500">
                                Không tìm thấy mã giảm giá nào.
                            </td>
                        </tr>
                     )}
                 </tbody>
             </table>
         </div>

         {/* Footer Pagination */}
         <div className="p-6 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
             <span>Hiển thị {filteredVouchers.length} kết quả</span>
             <div className="flex items-center gap-2">
                 <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50"><ChevronLeft className="w-4 h-4" /></button>
                 <button className="w-8 h-8 flex items-center justify-center bg-[#3D021E] text-white font-bold rounded-lg shadow-md shadow-orange-200">1</button>
                 <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50">2</button>
                 <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50">3</button>
                 <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50"><ChevronRight className="w-4 h-4" /></button>
             </div>
         </div>
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