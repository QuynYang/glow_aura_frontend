import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Download, RefreshCw, Check, Package, 
  Truck, MapPin, CreditCard, Receipt, Ticket, Loader2, XCircle
} from 'lucide-react';
import { MainLayout } from '../components/layout/MainLayout';
import { orderService } from '../services/orderService'; // Import API

const formatVND = (amount: number) => new Intl.NumberFormat('vi-VN').format(amount || 0) + 'đ';

export const OrderDetailPage = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCanceling, setIsCanceling] = useState(false);

  // Gọi API lấy chi tiết đơn hàng
  useEffect(() => {
    const fetchOrderDetail = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const data = await orderService.getOrderById(id);
        setOrder(data);
      } catch (error) {
        console.error(error);
        alert("Không thể tải thông tin đơn hàng!");
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrderDetail();
    window.scrollTo(0, 0);
  }, [id]);

  // Xử lý Hủy đơn hàng
  const handleCancelOrder = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")) return;
    
    try {
        setIsCanceling(true);
        await orderService.cancelOrder(id!);
        alert("Hủy đơn hàng thành công!");
        // Gọi lại API để load trạng thái mới nhất
        const updatedData = await orderService.getOrderById(id!);
        setOrder(updatedData);
    } catch (error: any) {
        alert(error.response?.data?.message || "Hủy đơn thất bại. Đơn hàng có thể đã được xử lý.");
    } finally {
        setIsCanceling(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#FDFBFB]">
            <Loader2 className="w-10 h-10 animate-spin text-[#3D021E]" />
            <p className="mt-4 text-gray-500 font-bold">Đang tải chi tiết đơn hàng...</p>
        </div>
      </MainLayout>
    );
  }

  if (!order) return null;

  // Dữ liệu hiển thị
  const orderNumber = order.orderNumber || order.id;
  const orderDate = new Date(order.createdAt || order.orderDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const statusInt = typeof order.status === 'number' ? order.status : parseInt(order.status);
  
  // Logic Timeline (Ánh xạ từ Enum C#)
  // 0: Pending, 1: Confirmed, 2: Paid, 3: Processing, 4: Shipping, 5: Delivered, 6: Completed, 7: Cancelled
  const isCancelled = statusInt === 7 || statusInt === 8;
  const stepPlaced = !isCancelled; 
  const stepProcessing = statusInt >= 2 && !isCancelled;
  const stepShipping = statusInt >= 4 && !isCancelled;
  const stepDelivered = statusInt >= 5 && !isCancelled;

  return (
    <MainLayout>
      <div className="bg-[#FDFBFB] min-h-screen pb-24 pt-8 font-sans text-gray-900">
        <div className="container mx-auto px-4 max-w-[1200px]">
            
            {/* ========================================== */}
            {/* 1. HEADER & TOP ACTIONS */}
            {/* ========================================== */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <button 
                        onClick={() => navigate('/profile/orders')}
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#3D021E] transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" /> Quay lại danh sách
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                        Chi tiết đơn hàng
                        {isCancelled && <span className="text-sm bg-red-100 text-red-600 px-3 py-1 rounded-full uppercase tracking-widest font-bold">Đã Hủy</span>}
                    </h1>
                    <p className="text-gray-600 text-sm">
                        Mã đơn hàng: <span className="font-bold text-gray-900">#{orderNumber}</span> • Ngày đặt: {orderDate}
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    {/* CHỈ CHO PHÉP HỦY NẾU TRẠNG THÁI LÀ PENDING (0) HOẶC CONFIRMED (1) */}
                    {(statusInt === 0 || statusInt === 1) && (
                        <button 
                            onClick={handleCancelOrder}
                            disabled={isCanceling}
                            className="flex items-center gap-2 px-5 py-2.5 border border-red-200 bg-white text-red-600 rounded-xl font-bold text-sm hover:bg-red-50 transition-colors shadow-sm disabled:opacity-50"
                        >
                            {isCanceling ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />} 
                            Hủy đơn hàng
                        </button>
                    )}
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-[#3D021E] text-white rounded-xl font-bold text-sm hover:bg-[#5a032d] transition-colors shadow-md">
                        <RefreshCw className="w-4 h-4" /> Mua lại đơn hàng
                    </button>
                </div>
            </div>

            {/* ========================================== */}
            {/* 2. TIMELINE THEO DÕI ĐƠN HÀNG */}
            {/* ========================================== */}
            {!isCancelled && (
                <div className="bg-white rounded-3xl p-8 mb-8 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden">
                    <div className="relative max-w-4xl mx-auto">
                        <div className="absolute top-6 left-[10%] right-[10%] h-1 bg-gray-100 -z-0 rounded-full"></div>
                        
                        {/* Thanh Progress chạy theo trạng thái */}
                        <div className={`absolute top-6 left-[10%] h-1 bg-[#3D021E] -z-0 rounded-full transition-all duration-1000 ${
                            stepDelivered ? 'w-[80%]' : stepShipping ? 'w-[53%]' : stepProcessing ? 'w-[26%]' : 'w-[0%]'
                        }`}></div>

                        <div className="grid grid-cols-4 relative z-10">
                            {/* Bước 1 */}
                            <div className="flex flex-col items-center text-center">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-white mb-4 transition-colors ${stepPlaced ? 'bg-[#3D021E] text-white shadow-md' : 'bg-gray-100 text-gray-400'}`}>
                                    <Check className="w-5 h-5" strokeWidth={3} />
                                </div>
                                <h4 className={`font-bold text-sm mb-1 ${stepPlaced ? 'text-gray-900' : 'text-gray-400'}`}>Đã đặt hàng</h4>
                            </div>
                            
                            {/* Bước 2 */}
                            <div className="flex flex-col items-center text-center">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-white mb-4 transition-colors ${stepProcessing ? 'bg-[#3D021E] text-white shadow-md' : 'bg-gray-100 text-gray-400'}`}>
                                    <Package className="w-5 h-5" />
                                </div>
                                <h4 className={`font-bold text-sm mb-1 ${stepProcessing ? 'text-gray-900' : 'text-gray-400'}`}>Đang xử lý</h4>
                            </div>

                            {/* Bước 3 */}
                            <div className="flex flex-col items-center text-center">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-white mb-4 transition-colors ${stepShipping ? 'bg-[#3D021E] text-white shadow-md' : 'bg-gray-100 text-gray-400'}`}>
                                    <Truck className="w-5 h-5" />
                                </div>
                                <h4 className={`font-bold text-sm mb-1 ${stepShipping ? 'text-gray-900' : 'text-gray-400'}`}>Đang giao hàng</h4>
                            </div>

                            {/* Bước 4 */}
                            <div className="flex flex-col items-center text-center">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-white mb-4 transition-colors ${stepDelivered ? 'bg-[#3D021E] text-white shadow-md' : 'bg-gray-100 text-gray-400'}`}>
                                    <Package className="w-5 h-5" />
                                </div>
                                <h4 className={`font-bold text-sm mb-1 ${stepDelivered ? 'text-gray-900' : 'text-gray-400'}`}>Đã nhận hàng</h4>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ========================================== */}
            {/* 3. KHỐI THÔNG TIN (ĐỊA CHỈ - THANH TOÁN - VẬN CHUYỂN) */}
            {/* ========================================== */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Thẻ Địa chỉ */}
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-[#3D021E]" /> Địa chỉ nhận hàng
                    </h3>
                    <div className="flex-1">
                        <p className="font-bold text-gray-900 uppercase tracking-wide mb-2">{order.shippingAddress?.fullName || order.customerName || "Khách hàng"}</p>
                        <p className="text-gray-600 text-sm mb-1">{order.shippingAddress?.phoneNumber || order.customerPhone}</p>
                        <p className="text-gray-600 text-sm leading-relaxed">{order.shippingAddress?.addressLine || order.shippingAddress}</p>
                    </div>
                </div>

                {/* Thẻ Thanh toán */}
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-[#3D021E]" /> Phương thức thanh toán
                    </h3>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-[#3D021E] rounded-lg flex items-center justify-center text-white font-bold text-[10px] uppercase">
                            {order.paymentMethod || "COD"}
                        </div>
                        <div>
                            <p className="font-bold text-gray-900">{order.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng' : order.paymentMethod}</p>
                        </div>
                    </div>
                    <div className="mt-auto border-t border-gray-100 pt-4">
                        <p className={`${statusInt >= 2 ? 'text-[#147A42]' : 'text-orange-600'} text-xs font-bold flex items-center gap-1.5`}>
                            {statusInt >= 2 ? <><Check className="w-4 h-4" /> Đã thanh toán</> : 'Chưa thanh toán'}
                        </p>
                    </div>
                </div>

                {/* Thẻ Vận chuyển */}
                <div className="bg-[#FAF7F8] rounded-3xl p-6 border border-[#F3EAF0] shadow-sm flex flex-col">
                    <h3 className="font-bold text-gray-900 mb-4 uppercase text-xs tracking-widest text-[#3D021E]">Đơn vị vận chuyển</h3>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-teal-700 rounded-lg flex items-center justify-center text-white font-black text-xs">GHN</div>
                        <div>
                            <p className="font-bold text-gray-900">Giao Hàng Nhanh</p>
                            <p className="text-gray-500 text-xs mt-1">Mã vận đơn: Đang cập nhật</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ========================================== */}
            {/* 4. SẢN PHẨM & TỔNG KẾT ĐƠN HÀNG */}
            {/* ========================================== */}
            <div className="flex flex-col lg:flex-row gap-8">
                
                {/* Cột trái: Danh sách sản phẩm */}
                <div className="w-full lg:w-2/3 bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
                    <h3 className="font-bold text-lg text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
                        <Receipt className="w-5 h-5 text-[#3D021E]" /> Danh sách sản phẩm ({order.items?.length || 0})
                    </h3>
                    
                    <div className="space-y-6">
                        {order.items?.map((item: any, index: number) => (
                            <div key={item.id || index} className={`flex flex-col sm:flex-row gap-4 pb-6 ${index !== order.items.length - 1 ? 'border-b border-gray-100' : ''}`}>
                                <div className="w-24 h-24 bg-gray-50 rounded-2xl flex-shrink-0 overflow-hidden border border-gray-100 p-2">
                                    <img src={item.imageUrl || item.image || "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=200"} alt={item.productName || item.name} className="w-full h-full object-contain mix-blend-multiply" />
                                </div>
                                <div className="flex-1 flex flex-col justify-between">
                                    <div className="flex justify-between items-start gap-4">
                                        <div>
                                            <h4 className="font-bold text-gray-900 mb-1">{item.productName || item.name}</h4>
                                            <span className="inline-block bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-lg mt-2">
                                                SL: {item.quantity < 10 ? `0${item.quantity}` : item.quantity}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <span className="font-bold text-gray-900 text-lg whitespace-nowrap">
                                                {formatVND(item.unitPrice || item.price)}
                                            </span>
                                        </div>
                                    </div>
                                    {stepDelivered && (
                                        <div className="flex justify-end mt-4 sm:mt-0">
                                            <button className="text-[#3D021E] text-sm font-bold hover:underline underline-offset-4">Viết nhận xét</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Cột phải: Tổng kết */}
                <div className="w-full lg:w-1/3">
                    <div className="bg-[#FAF7F8] rounded-3xl p-6 md:p-8 border border-[#F3EAF0] sticky top-24">
                        <h3 className="font-bold text-lg text-gray-900 mb-6">Tổng kết đơn hàng</h3>
                        
                        <div className="space-y-4 text-sm text-gray-600 border-b border-gray-200 pb-6 mb-6">
                            <div className="flex justify-between items-center">
                                <span>Tạm tính</span>
                                <span className="font-medium text-gray-900">{formatVND(order.subTotal)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Phí vận chuyển</span>
                                <span className="font-medium text-gray-900">{formatVND(order.shippingFee || 0)}</span>
                            </div>
                            {(order.discountAmount > 0 || order.discount > 0) && (
                                <div className="flex justify-between items-center text-[#147A42] font-medium">
                                    <span className="flex items-center gap-2"><Ticket className="w-4 h-4" /> Giảm giá</span>
                                    <span>-{formatVND(order.discountAmount || order.discount)}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between items-end mb-8">
                            <span className="font-bold text-gray-900 text-lg">Tổng cộng</span>
                            <div className="text-right">
                                <span className="block text-2xl font-black text-[#3D021E]">{formatVND(order.totalAmount || order.total)}</span>
                                <span className="text-[10px] text-gray-500">(Đã bao gồm VAT)</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <button className="w-full bg-[#3D021E] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#5a032d] shadow-md transition-colors">
                                <Truck className="w-4 h-4" /> Theo dõi kiện hàng
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