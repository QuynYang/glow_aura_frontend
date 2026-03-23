import { useState, useEffect } from 'react';
import { Filter, ChevronLeft, ChevronRight, Check, Loader2, PackageX } from 'lucide-react';
import { MainLayout } from '../components/layout/MainLayout';
import { ProfileSidebar } from '../features/user/components/ProfileSidebar';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../services/orderService'; 

// CHUẨN HÓA ENUM: Dịch chính xác từ số (0-9) sang Tiếng Việt theo C#
const getStatusLabel = (statusValue: number | string) => {
  switch (String(statusValue)) {
    case '0': return 'Chờ xác nhận';
    case '1': return 'Đã xác nhận';
    case '2': return 'Đã thanh toán';
    case '3': return 'Đang xử lý';
    case '4': return 'Đang giao hàng';
    case '5': return 'Đã giao hàng';
    case '6': return 'Hoàn thành';
    case '7': return 'Đã hủy';
    case '8': return 'Đã hoàn tiền';
    case '9': return 'Thanh toán thất bại';
    default: return 'Không xác định';
  }
};

// CHUẨN HÓA MÀU SẮC: Gom nhóm các trạng thái vào các tông màu phù hợp
const getStatusColor = (statusLabel: string) => {
  switch (statusLabel) {
    // Nhóm Thành công / Tích cực (Xanh lá)
    case 'Đã thanh toán':
    case 'Đã giao hàng':
    case 'Hoàn thành': 
        return 'bg-green-50 text-green-700 border border-green-200';
    
    // Nhóm Đang vận chuyển (Xanh dương)
    case 'Đang giao hàng': 
        return 'bg-blue-50 text-blue-700 border border-blue-200';
    
    // Nhóm Thất bại / Hủy (Đỏ)
    case 'Đã hủy': 
    case 'Đã hoàn tiền':
    case 'Thanh toán thất bại':
        return 'bg-red-50 text-red-600 border border-red-100';
    
    // Nhóm Chờ đợi / Xử lý (Vàng/Cam)
    case 'Chờ xác nhận': 
    case 'Đã xác nhận':
    case 'Đang xử lý': 
        return 'bg-orange-50 text-orange-700 border border-orange-200';
        
    default: 
        return 'bg-gray-50 text-gray-700 border border-gray-200';
  }
};

// Cập nhật Bộ lọc (Gom các trạng thái chính để user dễ lọc)
const FILTER_OPTIONS = [
    'Tất cả', 
    'Chờ xác nhận', 
    'Đã xác nhận',
    'Đã thanh toán',
    'Đang xử lý', 
    'Đang giao hàng', 
    'Hoàn thành', 
    'Đã hủy'
];

export const OrderHistoryPage = () => {
  const navigate = useNavigate();
  
  const [orders, setOrders] = useState<any[]>([]); 
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState('');

  const [filterStatus, setFilterStatus] = useState('Tất cả');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        setIsLoading(true);
        const data = await orderService.getMyOrders();
        const sortedData = (data || []).sort((a: any, b: any) => 
            new Date(b.createdAt || b.orderDate).getTime() - new Date(a.createdAt || a.orderDate).getTime()
        );
        setOrders(sortedData);
      } catch (err: any) {
        console.error(err);
        setError('Không thể tải lịch sử đơn hàng. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyOrders();
    window.scrollTo(0, 0);
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const filteredOrders = filterStatus === 'Tất cả' 
    ? orders 
    : orders.filter(order => getStatusLabel(order.status) === filterStatus);

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen py-10 font-sans">
        <div className="container mx-auto px-4 max-w-[1200px]">
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8">Lịch sử đơn hàng</h1>

          <div className="flex flex-col lg:flex-row gap-8">
            <ProfileSidebar activePage="orders" />

            <div className="w-full lg:w-3/4">
              <div className="bg-white rounded-[2rem] shadow-sm overflow-visible border border-gray-100"> 
                
                {/* Header & Filter */}
                <div className="p-6 md:p-8 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 relative z-20">
                    <h2 className="text-xl font-serif font-bold text-gray-900">Đơn hàng của bạn</h2>
                    
                    <div className="relative">
                        <button 
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="flex items-center gap-2 text-xs font-bold text-gray-700 border border-gray-300 px-4 py-2.5 rounded-xl hover:border-[#3D021E] hover:text-[#3D021E] transition-colors uppercase tracking-wider bg-white shadow-sm"
                        >
                            <Filter className="w-4 h-4" />
                            {filterStatus === 'Tất cả' ? 'Tất cả đơn hàng' : filterStatus}
                        </button>

                        {isFilterOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)}></div>
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 shadow-[0_10px_40px_rgb(0,0,0,0.1)] rounded-xl z-20 py-2 animate-in fade-in zoom-in-95 duration-200 h-64 overflow-y-auto custom-scrollbar">
                                    {FILTER_OPTIONS.map((option) => (
                                        <button
                                            key={option}
                                            onClick={() => {
                                                setFilterStatus(option);
                                                setIsFilterOpen(false);
                                            }}
                                            className="w-full text-left px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#3D021E] flex items-center justify-between transition-colors"
                                        >
                                            {option}
                                            {filterStatus === option && <Check className="w-4 h-4 text-[#3D021E]" />}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="min-h-[400px]">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-full py-20">
                            <Loader2 className="w-8 h-8 text-[#3D021E] animate-spin mb-4" />
                            <p className="text-gray-500 font-medium">Đang tải lịch sử đơn hàng...</p>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-20 text-red-500">
                            <p className="font-medium">{error}</p>
                            <button onClick={() => window.location.reload()} className="mt-4 text-[#3D021E] font-bold underline">Thử lại</button>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 text-gray-500">
                            <PackageX className="w-16 h-16 mb-4 text-gray-300 stroke-[1.5]" />
                            <p className="text-lg font-medium text-gray-900 mb-2">Bạn chưa có đơn hàng nào</p>
                            <p className="text-sm mb-6 text-center max-w-sm">Hãy khám phá các sản phẩm tuyệt vời của chúng tôi và đặt hàng ngay nhé!</p>
                            <button 
                                onClick={() => navigate('/products')}
                                className="bg-[#3D021E] text-white px-8 py-3 rounded-xl font-bold uppercase tracking-wider text-sm hover:bg-[#5a032d] transition-colors shadow-md"
                            >
                                Bắt đầu mua sắm
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            {filteredOrders.length > 0 ? (
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50/50 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                                            <th className="px-6 md:px-8 py-5 whitespace-nowrap">Mã đơn hàng</th>
                                            <th className="px-6 md:px-8 py-5 whitespace-nowrap">Ngày đặt</th>
                                            <th className="px-6 md:px-8 py-5 whitespace-nowrap">Trạng thái</th>
                                            <th className="px-6 md:px-8 py-5 whitespace-nowrap">Tổng cộng</th>
                                            <th className="px-6 md:px-8 py-5 whitespace-nowrap text-right">Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredOrders.map((order) => {
                                            const statusLabel = getStatusLabel(order.status);
                                            return (
                                                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-6 md:px-8 py-5 font-bold text-gray-900 whitespace-nowrap">
                                                        #{order.orderNumber || order.id}
                                                    </td>
                                                    <td className="px-6 md:px-8 py-5 text-sm text-gray-500 font-medium whitespace-nowrap">
                                                        {formatDate(order.createdAt || order.orderDate)}
                                                    </td>
                                                    <td className="px-6 md:px-8 py-5 whitespace-nowrap">
                                                        <span className={`inline-flex items-center justify-center px-3 py-1 text-[10px] font-bold uppercase rounded-md tracking-wider ${getStatusColor(statusLabel)}`}>
                                                            {statusLabel}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 md:px-8 py-5 font-black text-[#3D021E] whitespace-nowrap">
                                                        {order.totalAmount?.toLocaleString('vi-VN')}đ
                                                    </td>
                                                    <td className="px-6 md:px-8 py-5 text-right whitespace-nowrap">
                                                        <button 
                                                            onClick={() => navigate(`/profile/orders/${order.id}`)}
                                                            className="text-xs font-bold text-gray-700 bg-white border border-gray-200 px-4 py-2 rounded-lg hover:border-[#3D021E] hover:text-[#3D021E] transition-all shadow-sm"
                                                        >
                                                            Xem chi tiết
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                                    <Filter className="w-12 h-12 mb-4 text-gray-300" />
                                    <p>Không tìm thấy đơn hàng nào có trạng thái <span className="font-bold text-gray-900">"{filterStatus}"</span></p>
                                    <button 
                                        onClick={() => setFilterStatus('Tất cả')}
                                        className="mt-4 text-[#3D021E] font-bold underline underline-offset-4"
                                    >
                                        Xóa bộ lọc
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {!isLoading && filteredOrders.length > 0 && (
                    <div className="p-6 md:p-8 border-t border-gray-100 flex justify-center items-center gap-6 bg-gray-50/30 rounded-b-[2rem]">
                        <button className="p-2 border border-gray-200 bg-white rounded-lg hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 transition-colors shadow-sm">
                            <ChevronLeft className="w-4 h-4 text-gray-600" />
                        </button>
                        <span className="text-sm font-bold text-gray-900 tracking-wider">TRANG 1 / 1</span>
                        <button className="p-2 border border-gray-200 bg-white rounded-lg hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 transition-colors shadow-sm">
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