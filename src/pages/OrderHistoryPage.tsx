import { Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { MainLayout } from '../components/layout/MainLayout';
import { ProfileSidebar } from '../features/user/components/ProfileSidebar'; // Import Sidebar vừa tách

// Mock Data giống ảnh
const orders = [
  { id: '#GA-882190', date: '12/10/2023', status: 'Đã hoàn thành', total: 1250000 },
  { id: '#GA-879541', date: '28/09/2023', status: 'Đang giao', total: 890000 },
  { id: '#GA-866432', date: '15/08/2023', status: 'Đã hủy', total: 2100000 },
  { id: '#GA-854122', date: '02/07/2023', status: 'Đã hoàn thành', total: 540000 },
  { id: '#GA-854121', date: '01/07/2023', status: 'Đang xử lý', total: 150000 },
];

export const OrderHistoryPage = () => {
  
  // Hàm xử lý màu sắc trạng thái
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Đã hoàn thành':
        return 'bg-green-100 text-green-700';
      case 'Đang giao':
        return 'bg-blue-100 text-blue-700';
      case 'Đã hủy':
        return 'bg-gray-100 text-gray-500';
      case 'Đang xử lý':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen py-10 font-sans">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8">Lịch sử đơn hàng</h1>

          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* 1. Sidebar (Tái sử dụng, activeTab là 'orders') */}
            <ProfileSidebar activePage="orders" />

            {/* 2. Main Content (Bảng đơn hàng) */}
            <div className="w-full lg:w-3/4">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                
                {/* Header của Bảng */}
                <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <h2 className="text-xl font-serif font-bold text-gray-900">Đơn hàng của bạn</h2>
                    
                    {/* Filter Button */}
                    <button className="flex items-center gap-2 text-sm font-bold text-gray-600 border border-gray-300 px-4 py-2 rounded-sm hover:border-primary hover:text-primary transition-colors">
                        <Filter className="w-4 h-4" />
                        TẤT CẢ ĐƠN HÀNG
                    </button>
                </div>

                {/* Table Content */}
                <div className="overflow-x-auto">
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
                            {orders.map((order) => (
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
                </div>

                {/* Pagination (Phân trang) */}
                <div className="p-6 border-t border-gray-100 flex justify-center items-center gap-4">
                    <button className="p-2 border border-gray-200 rounded-sm hover:bg-gray-100 disabled:opacity-50">
                        <ChevronLeft className="w-4 h-4 text-gray-600" />
                    </button>
                    <span className="text-sm font-bold text-gray-900">TRANG 1 / 1</span>
                    <button className="p-2 border border-gray-200 rounded-sm hover:bg-gray-100 disabled:opacity-50">
                        <ChevronRight className="w-4 h-4 text-gray-600" />
                    </button>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </MainLayout>
  );
};