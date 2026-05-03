import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle2, Ticket, Truck, ShoppingCart, Receipt, Clock, Info } from 'lucide-react';
import { MainLayout } from '../components/layout/MainLayout';

const formatVND = (amount: number) => new Intl.NumberFormat('vi-VN').format(amount) + 'đ';

export const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const order = location.state?.order;
  // Cuộn lên đầu trang khi load
  useEffect(() => {
    window.scrollTo(0, 0);
    if (!order) {
        navigate('/');
    }
  }, [order, navigate]);
if (!order) return null;
  return (
    <MainLayout>
      <div className="bg-[#FDFBFB] min-h-screen pb-24 pt-12 font-sans text-gray-900">
        <div className="container mx-auto px-4 max-w-[850px] space-y-6">
            
            <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-600" strokeWidth={2.5} />
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Đặt hàng thành công!</h1>
                <p className="text-gray-600 max-w-lg mx-auto leading-relaxed mb-8">
                    Hệ thống đã nhận được đơn hàng của bạn. Chúng tôi sẽ sớm liên hệ để xác nhận thông tin.
                </p>

                {/* HIỂN THỊ MÃ ĐƠN HÀNG THẬT (OrderNumber) */}
                <div className="bg-[#3D021E] text-white px-6 py-3 rounded-full flex items-center gap-2 font-bold text-sm shadow-md mb-10">
                    <Ticket className="w-4 h-4" /> Mã đơn hàng: {order.orderNumber}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <button 
                        onClick={() => navigate(`/profile/orders/${order.id}`)} 
                        className="bg-[#3D021E] text-white px-8 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#5a032d] transition-colors shadow-lg"
                    >
                        <Truck className="w-4 h-4" /> Theo dõi đơn hàng
                    </button>
                    <button onClick={() => navigate('/')} className="bg-white border border-gray-200 text-gray-700 px-8 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
                        <ShoppingCart className="w-4 h-4" /> Tiếp tục mua sắm
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-50 flex flex-col justify-between">
                    <div>
                        <h3 className="font-bold text-lg text-gray-900 mb-6 flex items-center gap-2">
                            <Receipt className="w-5 h-5 text-[#3D021E]" /> Chi tiết đơn hàng
                        </h3>
                        <div className="space-y-4 text-sm mb-6">
                            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                                <span className="text-gray-500">Phương thức</span>
                                <span className="font-medium text-gray-900">
                                    {order.paymentMethod === 0 ? "Thanh toán (COD)" : "Thanh toán Online"}
                                </span>
                            </div>
                            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                                <span className="text-gray-500">Người nhận</span>
                                <span className="font-medium text-gray-900">{order.receiverName}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between items-end pt-2">
                        <span className="font-bold text-gray-900 text-base">Tổng tiền đã lưu</span>
                        <span className="font-black text-2xl text-[#3D021E] tracking-tight">{formatVND(order.totalAmount)}</span>
                    </div>
                </div>

                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-50">
                    <h3 className="font-bold text-lg text-gray-900 mb-6 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-[#3D021E]" /> Dự kiến giao hàng
                    </h3>
                    <p className="font-bold text-gray-900 text-base mb-1">2-4 ngày làm việc</p>
                    <p className="text-sm text-gray-500 mb-6">Giao hàng đến: {order.shippingAddress}</p>

                    <div className="bg-pink-50/50 border border-pink-100/50 rounded-xl p-4 flex items-start gap-3">
                        <Info className="w-5 h-5 text-[#3D021E] flex-shrink-0 mt-0.5 opacity-70" />
                        <p className="text-sm text-gray-600 italic leading-relaxed">
                            "Mọi thắc mắc vui lòng liên hệ hotline 1900xxxx để được hỗ trợ nhanh nhất."
                        </p>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </MainLayout>
  );
};