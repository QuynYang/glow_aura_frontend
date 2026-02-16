import { useState, useEffect } from 'react';
import { 
  Plus, Download, Filter, ChevronLeft, ChevronRight, 
  MoreHorizontal, Calendar, Truck, DollarSign, Zap 
} from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';

// --- 1. MOCK DATA (Dữ liệu đơn hàng) ---
const orders = [
  {
    id: "#ORD-7732",
    customer: "Nguyễn Văn An",
    avatar: "A",
    date: "24 Th10, 2023",
    status: "Đang xử lý",
    total: 4500000,
    color: "bg-orange-100 text-orange-600"
  },
  {
    id: "#ORD-7731",
    customer: "Trần Thị Bình",
    avatar: "T",
    date: "23 Th10, 2023",
    status: "Đang giao",
    total: 12200000,
    color: "bg-blue-100 text-blue-600"
  },
  {
    id: "#ORD-7730",
    customer: "Lê Minh Cường",
    avatar: "L",
    date: "22 Th10, 2023",
    status: "Đã giao",
    total: 890000,
    color: "bg-green-100 text-green-600"
  },
  {
    id: "#ORD-7729",
    customer: "Phạm Thu Dung",
    avatar: "P",
    date: "22 Th10, 2023",
    status: "Đang xử lý",
    total: 21000000,
    color: "bg-orange-100 text-orange-600"
  },
  {
    id: "#ORD-7728",
    customer: "Hoàng Văn Em",
    avatar: "H",
    date: "21 Th10, 2023",
    status: "Đã giao",
    total: 3450000,
    color: "bg-green-100 text-green-600"
  },
  {
    id: "#ORD-7727",
    customer: "Vũ Thị F",
    avatar: "V",
    date: "20 Th10, 2023",
    status: "Đã hủy",
    total: 0,
    color: "bg-red-100 text-red-600"
  }
];

// Danh sách Tabs trạng thái
const tabs = ["Tất cả đơn hàng", "Đang xử lý", "Đang giao", "Đã giao", "Đã hủy"];

// Component Thẻ Thống Kê
const StatCard = ({ title, value, subtext, icon: Icon, iconColor, trend }: any) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex-1">
        <div className="flex justify-between items-start mb-4">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">{title}</h4>
            <div className={`p-2 rounded-lg ${iconColor} bg-opacity-10`}>
                <Icon className={`w-5 h-5 ${iconColor.replace('bg-', 'text-')}`} />
            </div>
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-2">{value}</div>
        <p className={`text-xs font-medium ${trend ? 'text-green-500' : 'text-red-500'}`}>
            {subtext}
        </p>
    </div>
);

export const AdminOrderPage = () => {
  // State quản lý Tab đang chọn
  const [activeTab, setActiveTab] = useState('Tất cả đơn hàng');
  
  // State quản lý danh sách các ID đơn hàng đang được chọn (checkbox)
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  // 1. LOGIC LỌC (FILTER): Lọc danh sách dựa trên activeTab
  const filteredOrders = orders.filter((order) => {
      if (activeTab === 'Tất cả đơn hàng') return true;
      return order.status === activeTab;
  });

  // Reset checkbox khi chuyển Tab để tránh nhầm lẫn
  useEffect(() => {
      setSelectedOrders([]);
  }, [activeTab]);

  // 2. LOGIC CHỌN TẤT CẢ (SELECT ALL)
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
          // Nếu tick vào: Lấy toàn bộ ID của danh sách ĐANG HIỂN THỊ (filteredOrders)
          const allIds = filteredOrders.map(order => order.id);
          setSelectedOrders(allIds);
      } else {
          // Nếu bỏ tick: Xóa hết
          setSelectedOrders([]);
      }
  };

  // 3. LOGIC CHỌN TỪNG DÒNG (SELECT ROW)
  const handleSelectRow = (id: string) => {
      if (selectedOrders.includes(id)) {
          setSelectedOrders(selectedOrders.filter(item => item !== id));
      } else {
          setSelectedOrders([...selectedOrders, id]);
      }
  };

  // Kiểm tra xem có đang chọn tất cả không (để tick vào ô trên header)
  const isAllSelected = filteredOrders.length > 0 && selectedOrders.length === filteredOrders.length;

  return (
    <AdminLayout>
      
      {/* HEADER PAGE */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản Lý Đơn Hàng</h1>
            <p className="text-sm text-gray-500 mt-1">Tổng cộng {filteredOrders.length} đơn hàng {activeTab !== 'Tất cả đơn hàng' ? `đang ở trạng thái "${activeTab}"` : ''}.</p>
        </div>
        <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                <Download className="w-4 h-4" /> Xuất CSV
            </button>
            <button className="flex items-center gap-2 px-6 py-2 bg-[#3D021E] text-white rounded-lg text-sm font-bold hover:bg-red-600 shadow-lg shadow-red-100 transition-all">
                <Plus className="w-4 h-4" /> Tạo Đơn Hàng Mới
            </button>
        </div>
      </div>

      {/* ORDER LIST CARD */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
         
         {/* Toolbar: Tabs */}
         <div className="p-4 border-b border-gray-100 flex flex-col lg:flex-row justify-between items-center gap-4">
             <div className="flex gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 no-scrollbar">
                 {tabs.map((tab) => (
                     <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors
                            ${activeTab === tab 
                                ? 'bg-[#3D021E] text-white font-bold' 
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
                        `}
                     >
                         {tab}
                     </button>
                 ))}
             </div>

             <div className="flex items-center gap-3 w-full lg:w-auto">
                 <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 w-full lg:w-auto justify-center">
                     <Calendar className="w-4 h-4" /> 30 ngày qua
                 </button>
                 <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                     <Filter className="w-4 h-4 text-gray-500" />
                 </button>
             </div>
         </div>

         {/* Data Table */}
         <div className="overflow-x-auto">
             <table className="w-full text-left text-sm">
                 <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-xs font-bold">
                     <tr>
                         <th className="px-6 py-4 w-12">
                             {/* CHECKBOX CHỌN TẤT CẢ */}
                             <input 
                                type="checkbox" 
                                className="rounded border-gray-300 text-[#FF3B30] focus:ring-[#FF3B30] w-4 h-4 cursor-pointer"
                                checked={isAllSelected}
                                onChange={handleSelectAll}
                             />
                         </th>
                         <th className="px-6 py-4">Mã Đơn</th>
                         <th className="px-6 py-4">Khách Hàng</th>
                         <th className="px-6 py-4">Ngày Đặt</th>
                         <th className="px-6 py-4">Trạng Thái</th>
                         <th className="px-6 py-4 text-right">Tổng Tiền</th>
                         <th className="px-6 py-4 text-right">Hành Động</th>
                     </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                     {/* Duyệt qua filteredOrders thay vì orders gốc */}
                     {filteredOrders.length > 0 ? (
                         filteredOrders.map((order) => (
                            <tr key={order.id} className={`hover:bg-gray-50 transition-colors group ${selectedOrders.includes(order.id) ? 'bg-red-50' : ''}`}>
                                <td className="px-6 py-4">
                                    {/* CHECKBOX CHỌN TỪNG DÒNG */}
                                    <input 
                                       type="checkbox" 
                                       className="rounded border-gray-300 text-[#3D021E] focus:ring-[#3D021E] w-4 h-4 cursor-pointer"
                                       checked={selectedOrders.includes(order.id)}
                                       onChange={() => handleSelectRow(order.id)}
                                    />
                                </td>
                                <td className="px-6 py-4 font-bold text-gray-900">{order.id}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                                            {order.avatar}
                                        </div>
                                        <span className="font-medium text-gray-700">{order.customer}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-500">{order.date}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-1 w-fit ${order.color}`}>
                                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right font-bold text-gray-900">
                                    {order.total.toLocaleString('vi-VN')}đ
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))
                     ) : (
                        <tr>
                            <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                Không tìm thấy đơn hàng nào ở trạng thái "{activeTab}".
                            </td>
                        </tr>
                     )}
                 </tbody>
             </table>
         </div>

         {/* Footer Pagination */}
         <div className="p-4 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
             <span>Hiển thị {filteredOrders.length} kết quả</span>
             {/* ...Pagination buttons (Giữ nguyên)... */}
              <div className="flex items-center gap-2">
                 <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"><ChevronLeft className="w-4 h-4" /></button>
                 <button className="w-8 h-8 flex items-center justify-center bg-[#3D021E] text-white font-bold rounded-lg shadow-md shadow-red-200">1</button>
                 <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50">2</button>
                 <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"><ChevronRight className="w-4 h-4" /></button>
             </div>
         </div>
      </div>

      {/* BOTTOM STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Giá trị đơn trung bình" value="3.420.000đ" subtext="+12.5% so với tháng trước" trend={true} icon={DollarSign} iconColor="bg-red-500" />
          <StatCard title="Khu vực giao hàng top đầu" value="TP. Hồ Chí Minh" subtext="28% tổng lượng đơn hàng" trend={false} icon={Truck} iconColor="bg-blue-500" />
          <StatCard title="Tỷ lệ chuyển đổi đơn hàng" value="4.2%" subtext="-0.8% so với tháng trước" trend={false} icon={Zap} iconColor="bg-purple-500" />
      </div>

    </AdminLayout>
  );
};