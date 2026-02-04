import { useState } from 'react'; // 1. Import useState
import { Filter, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { MainLayout } from '../components/layout/MainLayout';
import { ProfileSidebar } from '../features/user/components/ProfileSidebar';

// Dữ liệu mẫu (Giữ nguyên)
const orders = [
  { id: '#GA-882190', date: '12/10/2023', status: 'Đã hoàn thành', total: 1250000 },
  { id: '#GA-879541', date: '28/09/2023', status: 'Đang giao', total: 890000 },
  { id: '#GA-866432', date: '15/08/2023', status: 'Đã hủy', total: 2100000 },
  { id: '#GA-854122', date: '02/07/2023', status: 'Đã hoàn thành', total: 540000 },
  { id: '#GA-854121', date: '01/07/2023', status: 'Đang xử lý', total: 150000 },
];

// Danh sách các trạng thái để lọc
const FILTER_OPTIONS = ['Tất cả', 'Đã hoàn thành', 'Đang giao', 'Đang xử lý', 'Đã hủy'];

export const OrderHistoryPage = () => {
  // 2. State quản lý bộ lọc
  const [filterStatus, setFilterStatus] = useState('Tất cả');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // 3. Logic lọc đơn hàng
  const filteredOrders = filterStatus === 'Tất cả' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  // Helper: Màu sắc trạng thái
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Đã hoàn thành': return 'bg-green-100 text-green-700';
      case 'Đang giao': return 'bg-blue-100 text-blue-700';
      case 'Đã hủy': return 'bg-gray-100 text-gray-500';
      case 'Đang xử lý': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen py-10 font-sans">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8">Lịch sử đơn hàng</h1>

          <div className="flex flex-col lg:flex-row gap-8">
            <ProfileSidebar activePage="orders" />

            <div className="w-full lg:w-3/4">
              <div className="bg-white rounded-xl shadow-sm overflow-visible"> {/* overflow-visible để hiện dropdown */}
                
                {/* Header & Filter */}
                <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 relative z-20">
                    <h2 className="text-xl font-serif font-bold text-gray-900">Đơn hàng của bạn</h2>
                    
                    {/* === FILTER DROPDOWN === */}
                    <div className="relative">
                        <button 
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="flex items-center gap-2 text-xs font-bold text-gray-700 border border-gray-300 px-4 py-2 rounded-sm hover:border-primary hover:text-primary transition-colors uppercase tracking-wider bg-white"
                        >
                            <Filter className="w-4 h-4" />
                            {filterStatus === 'Tất cả' ? 'Tất cả đơn hàng' : filterStatus}
                        </button>

                        {/* Menu thả xuống */}
                        {isFilterOpen && (
                            <>
                                {/* Overlay tàng hình để click ra ngoài thì đóng menu */}
                                <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)}></div>
                                
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 shadow-xl rounded-md z-20 py-1 animate-in fade-in zoom-in-95 duration-200">
                                    {FILTER_OPTIONS.map((option) => (
                                        <button
                                            key={option}
                                            onClick={() => {
                                                setFilterStatus(option);
                                                setIsFilterOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary flex items-center justify-between"
                                        >
                                            {option}
                                            {filterStatus === option && <Check className="w-4 h-4 text-primary" />}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Table Content */}
                <div className="overflow-x-auto min-h-[300px]"> {/* Min-height để tránh giật layout */}
                    {filteredOrders.length > 0 ? (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                                    <th className="px-6 py-4">Mã đơn hàng</th>
                                    <th className="px-6 py-4">Ngày đặt</th>
                                    <th className="px-6 py-4">Trạng thái</th>
                                    <th className="px-6 py-4">Tổng cộng</th>
                                    <th className="px-6 py-4 text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-gray-900">{order.id}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{order.date}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-block px-3 py-1 text-[10px] font-bold uppercase rounded-full ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-900">
                                            {order.total.toLocaleString()}đ
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <a href="#" className="text-xs font-bold text-primary uppercase hover:underline tracking-wider">
                                                Xem chi tiết
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        // Giao diện khi không tìm thấy đơn hàng nào
                        <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                            <Filter className="w-12 h-12 mb-4 text-gray-300" />
                            <p>Không tìm thấy đơn hàng nào có trạng thái "{filterStatus}"</p>
                            <button 
                                onClick={() => setFilterStatus('Tất cả')}
                                className="mt-4 text-primary font-bold hover:underline"
                            >
                                Xóa bộ lọc
                            </button>
                        </div>
                    )}
                </div>

                {/* Pagination (Chỉ hiện khi có dữ liệu) */}
                {filteredOrders.length > 0 && (
                    <div className="p-6 border-t border-gray-100 flex justify-center items-center gap-4">
                        <button className="p-2 border border-gray-200 rounded-sm hover:bg-gray-100 disabled:opacity-50">
                            <ChevronLeft className="w-4 h-4 text-gray-600" />
                        </button>
                        <span className="text-sm font-bold text-gray-900">TRANG 1 / 1</span>
                        <button className="p-2 border border-gray-200 rounded-sm hover:bg-gray-100 disabled:opacity-50">
                            <ChevronRight className="w-4 h-4 text-gray-600" />
                        </button>
                    </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};