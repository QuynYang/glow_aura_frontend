import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, Ticket, Truck, ShoppingCart, 
  Receipt, Clock, Info
} from 'lucide-react';
import { MainLayout } from '../components/layout/MainLayout';

// Mock data (Trong thực tế, data này được truyền qua state của React Router hoặc lấy từ API)
const ORDER_DATA = {
    id: '#ORD-88291',
    date: '12 Tháng 10, 2023',
    paymentMethod: 'Thanh toán khi nhận hàng (COD)',
    total: 2450000,
    deliveryEstimate: '14 - 16 Tháng 10',
    deliveryType: 'Giao hàng tiêu chuẩn',
    items: [
        {
            id: 1,
            name: 'Giày Thể Thao Cao Cấp Maroon Edition',
            variant: 'Size: 42',
            quantity: 1,
            price: 2450000,
            image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=200'
        }
    ]
};

const formatVND = (amount: number) => new Intl.NumberFormat('vi-VN').format(amount) + 'đ';

export const OrderSuccessPage = () => {
  const navigate = useNavigate();

  // Cuộn lên đầu trang khi load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <MainLayout>
      <div className="bg-[#FDFBFB] min-h-screen pb-24 pt-12 font-sans text-gray-900">
        <div className="container mx-auto px-4 max-w-[850px] space-y-6">
            
            {/* ========================================== */}
            {/* KHỐI 1: HEADER THÔNG BÁO THÀNH CÔNG */}
            {/* ========================================== */}
            <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 flex flex-col items-center text-center">
                
                {/* Icon Check */}
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-[#3D021E]" strokeWidth={2.5} />
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Đặt hàng thành công!</h1>
                <p className="text-gray-600 max-w-lg mx-auto leading-relaxed mb-8">
                    Cảm ơn bạn đã tin tưởng lựa chọn chúng tôi. Đơn hàng của bạn đang được xử lý một cách cẩn trọng nhất.
                </p>

                {/* Mã đơn hàng */}
                <div className="bg-[#3D021E] text-white px-6 py-3 rounded-full flex items-center gap-2 font-bold text-sm shadow-md mb-10 hover:bg-[#5a032d] transition-colors cursor-pointer">
                    <Ticket className="w-4 h-4" /> Mã đơn hàng: {ORDER_DATA.id}
                </div>

                {/* Cụm nút hành động */}
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <button 
    // Chuyển hướng kèm theo ID đơn hàng
    onClick={() => navigate(`/profile/orders/${ORDER_DATA.id.replace('#', '')}`)} 
    className="bg-[#3D021E] text-white px-8 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#5a032d] transition-colors shadow-lg"
>
    <Truck className="w-4 h-4" /> Theo dõi đơn hàng
</button>
                    <button 
                        onClick={() => navigate('/')} 
                        className="bg-white border border-gray-200 text-gray-700 px-8 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
                    >
                        <ShoppingCart className="w-4 h-4" /> Tiếp tục mua sắm
                    </button>
                </div>
            </div>

            {/* ========================================== */}
            {/* KHỐI 2: CHI TIẾT & DỰ KIẾN GIAO HÀNG */}
            {/* ========================================== */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Cột trái: Chi tiết đơn hàng */}
                <div className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 flex flex-col justify-between">
                    <div>
                        <h3 className="font-bold text-lg text-gray-900 mb-6 flex items-center gap-2">
                            <Receipt className="w-5 h-5 text-[#3D021E]" /> Chi tiết đơn hàng
                        </h3>
                        <div className="space-y-4 text-sm mb-6">
                            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                                <span className="text-gray-500">Ngày đặt hàng</span>
                                <span className="font-medium text-gray-900">{ORDER_DATA.date}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                                <span className="text-gray-500">Thanh toán</span>
                                <span className="font-medium text-gray-900">{ORDER_DATA.paymentMethod}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between items-end pt-2">
                        <span className="font-bold text-gray-900 text-base">Tổng cộng</span>
                        <span className="font-black text-2xl text-[#3D021E] tracking-tight">{formatVND(ORDER_DATA.total)}</span>
                    </div>
                </div>

                {/* Cột phải: Dự kiến giao hàng */}
                <div className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50">
                    <h3 className="font-bold text-lg text-gray-900 mb-6 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-[#3D021E]" /> Dự kiến giao hàng
                    </h3>
                    
                    <div className="flex items-start gap-4 mb-6">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                            <Clock className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                            <p className="font-bold text-gray-900 text-base">{ORDER_DATA.deliveryEstimate}</p>
                            <p className="text-sm text-gray-500 mt-0.5">{ORDER_DATA.deliveryType}</p>
                        </div>
                    </div>

                    <div className="bg-pink-50/50 border border-pink-100/50 rounded-xl p-4 flex items-start gap-3">
                        <Info className="w-5 h-5 text-[#3D021E] flex-shrink-0 mt-0.5 opacity-70" />
                        <p className="text-sm text-gray-600 italic leading-relaxed">
                            "Sản phẩm của quý khách sẽ được kiểm tra kỹ lưỡng trước khi đóng gói và gửi đi."
                        </p>
                    </div>
                </div>

            </div>

            {/* ========================================== */}
            {/* KHỐI 3: DANH SÁCH SẢN PHẨM */}
            {/* ========================================== */}
            <div className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50">
                <h3 className="font-bold text-lg text-gray-900 mb-6">Sản phẩm trong đơn hàng</h3>
                
                <div className="space-y-6">
                    {ORDER_DATA.items.map((item) => (
                        <div key={item.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-colors">
                            
                            {/* Ảnh SP */}
                            <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 border border-gray-200">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                            </div>
                            
                            {/* Thông tin SP */}
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2">{item.name}</h4>
                                <p className="text-sm text-gray-500">
                                    {item.variant} <span className="mx-2">|</span> Số lượng: {item.quantity}
                                </p>
                            </div>
                            
                            {/* Giá */}
                            <div className="font-bold text-gray-900 mt-2 sm:mt-0">
                                {formatVND(item.price)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
      </div>
    </MainLayout>
  );
};