import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ChevronRight, Printer, CheckCircle, ArrowLeft, Loader2, 
  XCircle, Package, Truck, CheckCircle2 
} from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import apiClient from '../../services/apiClient';

export const AdminOrderDetailPage = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false); // Trạng thái loading khi bấm nút
  const [internalNotes, setInternalNotes] = useState('');

  // 1. GỌI API LẤY CHI TIẾT ĐƠN HÀNG
  const fetchOrderDetails = async () => {
      setIsLoading(true);
      try {
          const response = await apiClient.get(`/Order/${id}`);
          const data = response.data?.data || response.data; // Tùy cấu trúc C#
          setOrder(data);
          setInternalNotes(data.notes || '');
      } catch (error) {
          console.error("Lỗi lấy chi tiết đơn hàng:", error);
          alert("Không thể tải thông tin đơn hàng!");
          navigate('/admin/orders');
      } finally {
          setIsLoading(false);
      }
  };

  useEffect(() => {
      if (id) fetchOrderDetails();
  }, [id]);

  // 2. CÁC HÀM XỬ LÝ API (DUYỆT, ĐỔI TRẠNG THÁI, HỦY)
  const handleConfirmOrder = async () => {
      if (!window.confirm("Xác nhận duyệt đơn hàng này?")) return;
      setIsProcessing(true);
      try {
          // Gửi fee ship mặc định 30k như Request Model yêu cầu
          await apiClient.post(`/Order/${id}/confirm`, { shippingFee: 30000 });
          await fetchOrderDetails(); // Tải lại data mới
      } catch (error) {
          console.error(error);
          alert("Lỗi khi xác nhận đơn hàng!");
      } finally {
          setIsProcessing(false);
      }
  };

  const handleUpdateStatus = async (newStatus: string) => {
      if (!window.confirm(`Chuyển trạng thái đơn hàng sang: ${newStatus}?`)) return;
      setIsProcessing(true);
      try {
          await apiClient.patch(`/Order/${id}/status?newStatus=${newStatus}`);
          await fetchOrderDetails();
      } catch (error) {
          console.error(error);
          alert("Lỗi cập nhật trạng thái!");
      } finally {
          setIsProcessing(false);
      }
  };

  const handleCancelOrder = async () => {
      const reason = window.prompt("Nhập lý do hủy đơn hàng:");
      if (reason === null) return; // Nhấn Cancel trên prompt
      if (!reason.trim()) return alert("Vui lòng nhập lý do hủy!");

      setIsProcessing(true);
      try {
          await apiClient.post(`/Order/${id}/cancel`, { reason });
          await fetchOrderDetails();
      } catch (error) {
          console.error(error);
          alert("Lỗi khi hủy đơn hàng!");
      } finally {
          setIsProcessing(false);
      }
  };

  const handleSaveNotes = () => {
      alert("Đang phát triển API cập nhật Ghi chú nội bộ!");
      // Tương lai gắn API: await apiClient.put(`/Order/${id}/notes`, { notes: internalNotes })
  };

  // --- LOGIC GIAO DIỆN ---
  if (isLoading || !order) {
      return (
          <AdminLayout>
              <div className="flex flex-col items-center justify-center h-[70vh]">
                  <Loader2 className="w-12 h-12 animate-spin text-[#3D021E] mb-4" />
                  <p className="text-gray-500 font-bold">Đang tải chi tiết đơn hàng...</p>
              </div>
          </AdminLayout>
      );
  }

  // Phân tích trạng thái hiện tại
  const status = order.status || 'Pending';
  const isCancelled = status === 'Cancelled';
  const isPaid = !!order.paidAt || status === 'Paid';

  // Logic hiển thị thanh Progress
  const getStatusProgress = () => {
    if (isCancelled) return { width: '100%', label: 'Đã hủy', color: 'bg-red-500', barColor: 'bg-red-100' };
    switch (status) {
      case 'Pending': return { width: '15%', label: 'Chờ xác nhận', color: 'bg-gray-800', barColor: 'bg-pink-100' };
      case 'Confirmed': return { width: '40%', label: 'Đã xác nhận', color: 'bg-yellow-500', barColor: 'bg-pink-100' };
      case 'Processing': return { width: '60%', label: 'Đang đóng gói', color: 'bg-orange-500', barColor: 'bg-pink-100' };
      case 'Shipping': return { width: '80%', label: 'Đang giao hàng', color: 'bg-blue-500', barColor: 'bg-pink-100' };
      case 'Delivered': 
      case 'Completed': return { width: '100%', label: 'Đã giao thành công', color: 'bg-green-500', barColor: 'bg-pink-100' };
      default: return { width: '5%', label: status, color: 'bg-gray-500', barColor: 'bg-gray-200' };
    }
  };

  const progress = getStatusProgress();

  return (
    <AdminLayout>
      
      {/* 1. BREADCRUMBS & NÚT QUAY LẠI */}
      <div className="mb-6">
        <button 
            onClick={() => navigate('/admin/orders')}
            className="flex items-center gap-2 text-gray-500 hover:text-[#3D021E] transition-colors text-sm font-medium mb-4"
        >
            <ArrowLeft className="w-4 h-4" /> Quay lại danh sách
        </button>
        <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/admin/orders" className="hover:text-gray-900">Đơn hàng</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#E11D48] font-medium">{order.orderNumber || `#${order.id}`}</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900">Chi tiết</span>
        </div>
      </div>

      {/* 2. HEADER */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Đơn hàng {order.orderNumber || `#${order.id}`}</h1>
            <p className="text-sm text-gray-500">Đặt lúc {new Date(order.createdAt).toLocaleString('vi-VN')}</p>
        </div>
        
        {/* NÚT IN HÓA ĐƠN */}
        <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors text-sm w-fit shadow-sm">
            <Printer className="w-4 h-4" /> In hóa đơn
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
        {/* === CỘT TRÁI (Nội dung chính) === */}
        <div className="lg:col-span-2 space-y-8">
            
            {/* THÔNG TIN KHÁCH HÀNG */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Thông Tin Khách Hàng & Giao Hàng</h3>
                <div className="space-y-4">
                    <div className="flex items-start border-b border-gray-50 pb-4">
                        <span className="w-32 text-sm text-gray-500">Người nhận</span>
                        <span className="flex-1 text-sm font-medium text-gray-900">{order.receiverName || order.userName || 'Chưa cập nhật'}</span>
                    </div>
                    <div className="flex items-start border-b border-gray-50 pb-4">
                        <span className="w-32 text-sm text-gray-500">Số điện thoại</span>
                        <span className="flex-1 text-sm font-medium text-gray-900">{order.shippingPhone || 'Chưa cập nhật'}</span>
                    </div>
                    <div className="flex items-start border-b border-gray-50 pb-4">
                        <span className="w-32 text-sm text-gray-500">Địa chỉ</span>
                        <span className="flex-1 text-sm font-medium text-gray-900 leading-relaxed">{order.shippingAddress || 'Chưa cập nhật'}</span>
                    </div>
                    <div className="flex items-start">
                        <span className="w-32 text-sm text-gray-500">Ghi chú của khách</span>
                        <span className="flex-1 text-sm font-medium text-orange-600 italic">
                            {order.notes ? `"${order.notes}"` : 'Không có ghi chú'}
                        </span>
                    </div>
                </div>
            </div>

            {/* CHI TIẾT SẢN PHẨM */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Chi Tiết Sản Phẩm</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-600 font-medium rounded-lg">
                            <tr>
                                <th className="px-4 py-3 rounded-l-lg">Sản phẩm</th>
                                <th className="px-4 py-3 text-center">Số lượng</th>
                                <th className="px-4 py-3 text-right">Đơn giá</th>
                                <th className="px-4 py-3 rounded-r-lg text-right">Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {order.items && order.items.length > 0 ? order.items.map((item: any) => (
                                <tr key={item.id}>
                                    <td className="px-4 py-4 flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-md bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0">
                                            <img src={item.productImageUrl || 'https://via.placeholder.com/100'} alt={item.productName} className="w-full h-full object-cover mix-blend-multiply" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-900 line-clamp-2">{item.productName}</span>
                                            {item.discountDescription && <span className="text-[10px] text-green-600 bg-green-50 px-2 py-0.5 rounded w-fit mt-1">{item.discountDescription}</span>}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-[#E11D48] font-bold text-center">x{item.quantity}</td>
                                    <td className="px-4 py-4 text-gray-600 text-right">{(item.discountedPrice || item.unitPrice || 0).toLocaleString('vi-VN')}đ</td>
                                    <td className="px-4 py-4 text-right font-bold text-gray-900">{(item.totalPrice || 0).toLocaleString('vi-VN')}đ</td>
                                </tr>
                            )) : (
                                <tr><td colSpan={4} className="py-8 text-center text-gray-500">Đơn hàng không có sản phẩm.</td></tr>
                            )}
                        </tbody>
                        <tfoot className="border-t border-gray-100">
                            <tr>
                                <td colSpan={3} className="px-4 py-3 text-right text-gray-500">Tạm tính</td>
                                <td className="px-4 py-3 text-right font-medium text-gray-900">{(order.subTotal || 0).toLocaleString('vi-VN')}đ</td>
                            </tr>
                            {order.totalDiscount > 0 && (
                                <tr>
                                    <td colSpan={3} className="px-4 py-2 text-right text-green-600">Giảm giá</td>
                                    <td className="px-4 py-2 text-right font-medium text-green-600">- {(order.totalDiscount || 0).toLocaleString('vi-VN')}đ</td>
                                </tr>
                            )}
                            <tr>
                                <td colSpan={3} className="px-4 py-3 text-right text-gray-500">Phí vận chuyển</td>
                                <td className="px-4 py-3 text-right font-medium text-gray-900">{(order.shippingFee || 0).toLocaleString('vi-VN')}đ</td>
                            </tr>
                            <tr>
                                <td colSpan={3} className="px-4 py-4 text-right font-bold text-gray-900 text-base">Tổng cộng</td>
                                <td className="px-4 py-4 text-right font-bold text-[#E11D48] text-xl">{(order.totalAmount || 0).toLocaleString('vi-VN')}đ</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

        </div>

        {/* === CỘT PHẢI (Trạng thái & Ghi chú) === */}
        <div className="lg:col-span-1 space-y-6">
            
            {/* TRẠNG THÁI GIAO HÀNG & THANH TOÁN */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                
                {/* Tiến trình */}
                <h3 className="text-lg font-bold text-gray-900 mb-4">Trạng Thái Đơn</h3>
                <div className="mb-2">
                    <div className={`w-full h-2 rounded-full overflow-hidden ${progress.barColor}`}>
                        <div 
                            className={`h-full transition-all duration-500 ease-out ${progress.color}`} 
                            style={{ width: progress.width }}
                        ></div>
                    </div>
                </div>
                <div className="flex justify-between items-center mb-6">
                    <p className={`text-sm font-bold ${isCancelled ? 'text-red-600' : 'text-[#E11D48]'}`}>{progress.label}</p>
                    <span className="text-xs text-gray-400 font-mono uppercase">{status}</span>
                </div>

                {/* Box Thanh Toán Read-only */}
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-6">
                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Thanh toán qua: <span className="text-gray-900">{order.paymentMethod || 'COD'}</span></p>
                    <div className="flex items-center gap-2">
                        {isPaid ? (
                            <><CheckCircle2 className="w-5 h-5 text-green-500" /> <span className="text-sm font-bold text-green-700">Đã thanh toán</span></>
                        ) : (
                            <><Clock className="w-5 h-5 text-orange-500" /> <span className="text-sm font-bold text-orange-700">Chờ thanh toán</span></>
                        )}
                    </div>
                    {order.paidAt && <p className="text-[10px] text-gray-400 mt-2">Lúc: {new Date(order.paidAt).toLocaleString('vi-VN')}</p>}
                </div>

                {/* BẢNG ĐIỀU KHIỂN HÀNH ĐỘNG (THAY ĐỔI THEO TRẠNG THÁI) */}
                <div className="space-y-3 pt-4 border-t border-gray-100">
                    {isProcessing && <p className="text-sm text-center text-gray-500 animate-pulse mb-2">Đang xử lý hệ thống...</p>}
                    
                    {/* Luồng 1: Xác nhận đơn */}
                    {status === 'Pending' && (
                        <button onClick={handleConfirmOrder} disabled={isProcessing} className="w-full flex justify-center items-center gap-2 px-4 py-3 bg-[#E11D48] text-white font-bold rounded-xl hover:bg-[#BE123C] shadow-md shadow-red-200 transition-all disabled:opacity-50">
                            <CheckCircle className="w-5 h-5" /> Duyệt đơn hàng
                        </button>
                    )}
                    
                    {/* Luồng 2: Đóng gói */}
                    {status === 'Confirmed' && (
                        <button onClick={() => handleUpdateStatus('Processing')} disabled={isProcessing} className="w-full flex justify-center items-center gap-2 px-4 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 shadow-md shadow-orange-200 transition-all disabled:opacity-50">
                            <Package className="w-5 h-5" /> Bắt đầu đóng gói
                        </button>
                    )}

                    {/* Luồng 3: Giao hàng */}
                    {status === 'Processing' && (
                        <button onClick={() => handleUpdateStatus('Shipping')} disabled={isProcessing} className="w-full flex justify-center items-center gap-2 px-4 py-3 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-600 shadow-md shadow-blue-200 transition-all disabled:opacity-50">
                            <Truck className="w-5 h-5" /> Giao cho ĐVVC
                        </button>
                    )}

                    {/* Luồng 4: Hoàn thành */}
                    {status === 'Shipping' && (
                        <button onClick={() => handleUpdateStatus('Delivered')} disabled={isProcessing} className="w-full flex justify-center items-center gap-2 px-4 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 shadow-md shadow-green-200 transition-all disabled:opacity-50">
                            <CheckCircle2 className="w-5 h-5" /> Xác nhận đã giao
                        </button>
                    )}

                    {/* Nút Hủy: Chỉ hiện khi chưa giao */}
                    {['Pending', 'Confirmed', 'Processing'].includes(status) && (
                        <button onClick={handleCancelOrder} disabled={isProcessing} className="w-full flex justify-center items-center gap-2 px-4 py-3 bg-white border border-red-200 text-red-600 font-bold rounded-xl hover:bg-red-50 transition-all disabled:opacity-50">
                            <XCircle className="w-5 h-5" /> Hủy đơn hàng
                        </button>
                    )}

                    {isCancelled && (
                        <div className="bg-red-50 p-4 rounded-xl text-center">
                            <p className="text-red-700 font-bold mb-1">Đơn hàng đã bị hủy</p>
                            {order.cancellationReason && <p className="text-xs text-red-500">Lý do: {order.cancellationReason}</p>}
                        </div>
                    )}
                </div>
            </div>

            {/* GHI CHÚ NỘI BỘ */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Ghi Chú Nội Bộ</h3>
                <textarea 
                    rows={4}
                    placeholder="Thêm ghi chú về đơn hàng này (Khách không nhìn thấy)..."
                    value={internalNotes}
                    onChange={(e) => setInternalNotes(e.target.value)}
                    className="w-full px-4 py-3 bg-pink-50/30 border border-pink-100 rounded-xl text-sm focus:outline-none focus:border-[#E11D48] focus:ring-1 focus:ring-[#E11D48] transition-colors resize-none placeholder-pink-300 text-gray-700"
                ></textarea>
                <button onClick={handleSaveNotes} className="w-full mt-4 px-4 py-2 bg-white border border-gray-200 text-gray-700 font-bold text-sm rounded-lg hover:bg-gray-50 transition-colors">
                    Lưu Ghi Chú
                </button>
            </div>
        </div>

      </div>
    </AdminLayout>
  );
};

// Mock the Clock icon manually as it might not be imported if you don't have it
function Clock(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
}