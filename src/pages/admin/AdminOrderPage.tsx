import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Download, ChevronLeft, ChevronRight, 
  MoreHorizontal, Calendar, Truck, DollarSign, Zap, Loader2, 
  Eye, Edit, Trash2
} from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import apiClient from '../../services/apiClient';

// Danh sách Tabs trạng thái
const tabs = ["Tất cả đơn hàng", "Chờ xác nhận", "Đã thanh toán", "Đang xử lý", "Đang giao", "Đã giao", "Đã hủy"];

const StatCard = ({ title, value, subtext, icon: Icon, iconColor, trend }: any) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex-1">
        <div className="flex justify-between items-start mb-4">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">{title}</h4>
            <div className={`p-2 rounded-lg ${iconColor} bg-opacity-10`}>
                <Icon className={`w-5 h-5 ${iconColor.replace('bg-', 'text-')}`} />
            </div>
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-2">{value}</div>
        <p className={`text-xs font-medium ${trend ? 'text-green-500' : 'text-gray-500'}`}>
            {subtext}
        </p>
    </div>
);

// HÀM DỊCH TRẠNG THÁI
const translateStatus = (status: string) => {
    switch (status?.toLowerCase()) {
        case 'pending': return 'Chờ xác nhận';
        case 'confirmed': return 'Đã xác nhận';
        case 'paid': return 'Đã thanh toán';
        case 'processing': return 'Đang xử lý';
        case 'shipping': return 'Đang giao';
        case 'delivered': return 'Đã giao';
        case 'completed': return 'Hoàn thành';
        case 'cancelled': return 'Đã hủy';
        default: return status?.toUpperCase() || 'MỚI';
    }
};

// HÀM GÁN MÀU SẮC (Đã xử lý cho Paid, Confirmed...)
const getStatusColor = (statusText: string) => {
    switch (statusText) {
        case 'Đã giao':
        case 'Hoàn thành':
        case 'Đã thanh toán': return 'bg-green-100 text-green-700';
        case 'Đang giao': return 'bg-blue-100 text-blue-700';
        case 'Đang xử lý':
        case 'Đã xác nhận': return 'bg-yellow-100 text-yellow-700';
        case 'Đã hủy': return 'bg-red-100 text-red-700';
        case 'Chờ xác nhận': return 'bg-gray-100 text-gray-700';
        default: return 'bg-gray-100 text-gray-700';
    }
};

export const AdminOrderPage = () => {
  const navigate = useNavigate();
  
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [avgOrderValue, setAvgOrderValue] = useState(0);

  const [activeTab, setActiveTab] = useState('Tất cả đơn hàng');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  
  // 1. STATE CHO PHÂN TRANG (PAGINATION)
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10; // Giới hạn 10 đơn/trang

  // 2. STATE CHO NÚT ACTION (...)
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
      const handleClickOutside = () => setOpenDropdownId(null);
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const response = await apiClient.get('/order?page=1&pageSize=100');
            
            let ordersList = [];
            if (response.data && Array.isArray(response.data)) ordersList = response.data;
            else if (response.data?.data && Array.isArray(response.data.data)) ordersList = response.data.data;
            else if (response.data?.items && Array.isArray(response.data.items)) ordersList = response.data.items;

            const formattedOrders = ordersList.map((o: any) => {
                const translatedStatus = translateStatus(o.status || o.orderStatus);
                return {
                    rawId: o.id, 
                    id: o.orderNumber || `#GA-${o.id}`,
                    customer: o.customerName || 'Khách hàng', 
                    avatar: (o.customerName || 'K').charAt(0).toUpperCase(),
                    date: new Date(o.createdAt || o.orderDate || Date.now()).toLocaleDateString('vi-VN', { day: '2-digit', month: 'short', year: 'numeric' }),
                    status: translatedStatus,
                    total: o.totalAmount || o.totalPrice || 0,
                    color: getStatusColor(translatedStatus)
                };
            });

            setOrders(formattedOrders);

            if (formattedOrders.length > 0) {
                const totalRev = formattedOrders.reduce((sum: number, ord: any) => sum + ord.total, 0);
                setAvgOrderValue(Math.round(totalRev / formattedOrders.length));
            }

        } catch (error) {
            console.error("Lỗi tải danh sách đơn hàng:", error);
        } finally {
            setIsLoading(false);
        }
    };

    fetchOrders();
  }, []);

  // Lọc theo Tab
  const filteredOrders = orders.filter((order) => {
      if (activeTab === 'Tất cả đơn hàng') return true;
      return order.status === activeTab;
  });

  // TÍNH TOÁN PHÂN TRANG LOGIC
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const currentOrders = filteredOrders.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Reset page & checkbox khi đổi Tab
  useEffect(() => {
      setCurrentPage(1);
      setSelectedOrders([]);
  }, [activeTab]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
          setSelectedOrders(currentOrders.map(order => order.id)); // Chỉ chọn ở trang hiện tại
      } else {
          setSelectedOrders([]);
      }
  };

  const handleSelectRow = (id: string) => {
      if (selectedOrders.includes(id)) {
          setSelectedOrders(selectedOrders.filter(item => item !== id));
      } else {
          setSelectedOrders([...selectedOrders, id]);
      }
  };

  const isAllSelected = currentOrders.length > 0 && selectedOrders.length === currentOrders.length;

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản Lý Đơn Hàng</h1>
            <p className="text-sm text-gray-500 mt-1">Tổng cộng {filteredOrders.length} đơn hàng {activeTab !== 'Tất cả đơn hàng' ? `đang ở trạng thái "${activeTab}"` : ''}.</p>
        </div>
        <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                <Download className="w-4 h-4" /> Xuất CSV
            </button>
            <button 
                onClick={() => navigate('/admin/orders/create')} 
                className="flex items-center gap-2 px-4 py-2 bg-[#3D021E] text-white font-bold rounded-lg hover:bg-[#5a032d] shadow-md shadow-pink-200 transition-all text-sm"
             >
                <Plus className="w-4 h-4" /> Tạo đơn hàng
            </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
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
             </div>
         </div>

         <div className="overflow-x-auto min-h-[400px]">
             <table className="w-full text-left text-sm">
                 <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-xs font-bold">
                     <tr>
                         <th className="px-6 py-4 w-12">
                             <input 
                                type="checkbox" 
                                className="rounded border-gray-300 text-[#3D021E] focus:ring-[#3D021E] w-4 h-4 cursor-pointer"
                                checked={isAllSelected}
                                onChange={handleSelectAll}
                             />
                         </th>
                         <th className="px-6 py-4 whitespace-nowrap">Mã Đơn</th>
                         <th className="px-6 py-4">Khách Hàng</th>
                         <th className="px-6 py-4 whitespace-nowrap">Ngày Đặt</th>
                         <th className="px-6 py-4 text-center">Trạng Thái</th>
                         <th className="px-6 py-4 text-right whitespace-nowrap">Tổng Tiền</th>
                         <th className="px-6 py-4 text-center">Hành Động</th>
                     </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                     {isLoading ? (
                         <tr>
                             <td colSpan={7} className="px-6 py-12 text-center">
                                 <Loader2 className="w-8 h-8 animate-spin text-[#3D021E] mx-auto mb-2" />
                                 <span className="text-gray-500 font-medium">Đang tải dữ liệu...</span>
                             </td>
                         </tr>
                     ) : currentOrders.length > 0 ? (
                         currentOrders.map((order) => (
                             <tr 
                                key={order.id} 
                                onClick={() => navigate(`/admin/orders/${order.rawId}`)}
                                className={`hover:bg-gray-50 transition-colors group cursor-pointer relative ${selectedOrders.includes(order.id) ? 'bg-red-50' : ''}`}
                             >
                                 <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                     <input 
                                        type="checkbox" 
                                        className="rounded border-gray-300 text-[#3D021E] focus:ring-[#3D021E] w-4 h-4 cursor-pointer"
                                        checked={selectedOrders.includes(order.id)}
                                        onChange={() => handleSelectRow(order.id)}
                                     />
                                 </td>
                                 <td className="px-6 py-4 font-bold text-[#E11D48] hover:underline whitespace-nowrap">{order.id}</td>
                                 <td className="px-6 py-4">
                                     <div className="flex items-center gap-3">
                                         <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs flex-shrink-0">
                                             {order.avatar}
                                         </div>
                                         <span className="font-medium text-gray-700 truncate max-w-[180px]">{order.customer}</span>
                                     </div>
                                 </td>
                                 <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{order.date}</td>
                                 <td className="px-6 py-4">
                                     <div className="flex justify-center">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-1 w-fit ${order.color}`}>
                                            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                                            {order.status}
                                        </span>
                                     </div>
                                 </td>
                                 <td className="px-6 py-4 text-right font-bold text-gray-900 whitespace-nowrap">
                                     {order.total.toLocaleString('vi-VN')}đ
                                 </td>
                                 
                                 {/* NÚT HÀNH ĐỘNG DROPDOWN */}
                                 <td className="px-6 py-4 text-center relative" onClick={(e) => e.stopPropagation()}>
                                     <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setOpenDropdownId(openDropdownId === order.id ? null : order.id);
                                        }}
                                        className={`p-2 rounded-full transition-colors ${openDropdownId === order.id ? 'bg-gray-200 text-gray-800' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
                                     >
                                         <MoreHorizontal className="w-4 h-4" />
                                     </button>

                                     {/* Popup Menu */}
                                     {openDropdownId === order.id && (
                                         <div className="absolute right-12 top-10 w-44 bg-white rounded-xl shadow-xl border border-gray-100 z-50 py-2 text-left animate-in fade-in zoom-in-95">
                                             <button 
                                                onClick={() => navigate(`/admin/orders/${order.rawId}`)}
                                                className="w-full px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 hover:text-[#3D021E] flex items-center gap-2"
                                             >
                                                <Eye className="w-3.5 h-3.5" /> Xem chi tiết
                                             </button>
                                             <button 
                                                onClick={() => { alert('Đang phát triển: Cập nhật nhanh'); setOpenDropdownId(null); }}
                                                className="w-full px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                             >
                                                <Edit className="w-3.5 h-3.5" /> Sửa trạng thái
                                             </button>
                                             <div className="border-t border-gray-100 my-1"></div>
                                             <button 
                                                onClick={() => { alert('Đang phát triển: Hủy đơn hàng'); setOpenDropdownId(null); }}
                                                className="w-full px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2"
                                             >
                                                <Trash2 className="w-3.5 h-3.5" /> Hủy đơn này
                                             </button>
                                         </div>
                                     )}
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

         {/* FOOTER PAGINATION ĐÃ HOẠT ĐỘNG */}
         {totalPages > 0 && (
             <div className="p-4 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
                 <span>Hiển thị {currentOrders.length} trên tổng {filteredOrders.length} kết quả</span>
                 <div className="flex items-center gap-2">
                     <button 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
                     >
                        <ChevronLeft className="w-4 h-4" />
                     </button>

                     {/* Render số trang */}
                     {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button 
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-8 h-8 flex items-center justify-center font-bold rounded-lg transition-all
                                ${currentPage === page 
                                    ? 'bg-[#3D021E] text-white shadow-md shadow-red-200' 
                                    : 'border border-gray-200 hover:bg-gray-50 text-gray-700'}
                            `}
                        >
                            {page}
                        </button>
                     ))}

                     <button 
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
                     >
                        <ChevronRight className="w-4 h-4" />
                     </button>
                 </div>
             </div>
         )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Giá trị đơn trung bình" value={`${avgOrderValue.toLocaleString('vi-VN')}đ`} subtext="Dữ liệu tính từ hệ thống" trend={true} icon={DollarSign} iconColor="bg-red-500" />
          <StatCard title="Khu vực giao hàng top đầu" value="Toàn quốc" subtext="Đang thu thập dữ liệu..." trend={false} icon={Truck} iconColor="bg-blue-500" />
          <StatCard title="Đơn hàng phát sinh lỗi" value="0%" subtext="Hoạt động ổn định" trend={true} icon={Zap} iconColor="bg-purple-500" />
      </div>

    </AdminLayout>
  );
};