import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Download, RefreshCw, Check, Package, 
  Truck, MapPin, CreditCard, Receipt, Ticket
} from 'lucide-react';
import { MainLayout } from '../components/layout/MainLayout';

// --- MOCK DATA (Dữ liệu giả lập cho đơn hàng) ---
const MOCK_ORDER = {
  date: '20/10/2023',
  status: 'delivering', // 'placed' | 'processing' | 'delivering' | 'delivered'
  timeline: [
    { id: 'placed', label: 'Đã đặt hàng', time: '10:30, 20/10/2023', active: true },
    { id: 'processing', label: 'Đang xử lý', time: '14:20, 20/10/2023', active: true },
    { id: 'delivering', label: 'Đang giao hàng', time: 'Dự kiến: 22/10/2023', active: true },
    { id: 'delivered', label: 'Đã nhận hàng', time: 'Chưa cập nhật', active: false },
  ],
  customer: {
    name: 'NGUYỄN THANH TRÚC',
    phone: '090 123 4567',
    address: '123 Đường Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh'
  },
  payment: {
    method: 'Thẻ Visa',
    detail: 'Kết thúc bằng **** 4829',
    status: 'Đã thanh toán thành công'
  },
  shipping: {
    provider: 'GHN Express',
    trackingCode: 'GHN-8291028301'
  },
  items: [
    {
      id: 1,
      name: 'Serum Tái Tạo Da Radiant Glow',
      variant: 'Dung tích: 30ml | Loại: Ban đêm',
      quantity: 1,
      price: 1250000,
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=200'
    },
    {
      id: 2,
      name: 'Kem Dưỡng Ẩm Aqua Velvet',
      variant: 'Khối lượng: 50g | Loại: Mọi loại da',
      quantity: 2,
      price: 850000,
      image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=200'
    },
    {
      id: 3,
      name: 'Nước Thần Cân Bằng Rose Dew',
      variant: 'Dung tích: 150ml | Chiết xuất: Hoa hồng',
      quantity: 1,
      price: 620000,
      image: 'https://images.unsplash.com/photo-1601049676869-702ea24cfd58?q=80&w=200'
    }
  ],
  pricing: {
    subTotal: 3570000,
    shippingFee: 35000,
    discount: 250000,
    total: 3355000
  }
};

const formatVND = (amount: number) => new Intl.NumberFormat('vi-VN').format(amount) + 'đ';

export const OrderDetailPage = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const orderId = id ? `GA-${id.toUpperCase()}` : 'GA-882910';

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
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#3D021E] transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" /> Quay lại
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Chi tiết đơn hàng</h1>
                    <p className="text-gray-600 text-sm">
                        Mã đơn hàng: <span className="font-bold text-gray-900">#{orderId}</span> • Ngày đặt: {MOCK_ORDER.date}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 bg-white text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors shadow-sm">
                        <Download className="w-4 h-4" /> Tải hóa đơn
                    </button>
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-[#3D021E] text-white rounded-xl font-bold text-sm hover:bg-[#5a032d] transition-colors shadow-md">
                        <RefreshCw className="w-4 h-4" /> Mua lại đơn hàng
                    </button>
                </div>
            </div>

            {/* ========================================== */}
            {/* 2. TIMELINE THEO DÕI ĐƠN HÀNG */}
            {/* ========================================== */}
            <div className="bg-white rounded-3xl p-8 mb-8 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden">
                <div className="relative max-w-4xl mx-auto">
                    {/* Đường kẻ ngang nền */}
                    <div className="absolute top-6 left-[10%] right-[10%] h-1 bg-gray-100 -z-0 rounded-full"></div>
                    {/* Đường kẻ ngang Active */}
                    <div className="absolute top-6 left-[10%] w-[60%] h-1 bg-[#3D021E] -z-0 rounded-full transition-all duration-1000"></div>

                    <div className="grid grid-cols-4 relative z-10">
                        {MOCK_ORDER.timeline.map((step, index) => (
                            <div key={step.id} className="flex flex-col items-center text-center">
                                {/* Icon vòng tròn */}
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-white mb-4 transition-colors
                                    ${step.active ? 'bg-[#3D021E] text-white shadow-md' : 'bg-gray-100 text-gray-400'}
                                `}>
                                    {index === 0 && <Check className="w-5 h-5" strokeWidth={3} />}
                                    {index === 1 && <Package className="w-5 h-5" />}
                                    {index === 2 && <Truck className="w-5 h-5" />}
                                    {index === 3 && <Package className="w-5 h-5 opacity-50" />}
                                </div>
                                {/* Text */}
                                <h4 className={`font-bold text-sm mb-1 ${step.active ? 'text-gray-900' : 'text-gray-400'}`}>
                                    {step.label}
                                </h4>
                                <p className={`text-xs ${step.active ? 'text-gray-500' : 'text-gray-400'}`}>
                                    {step.time}
                                </p>
                                {/* Nút link (chỉ hiện ở bước hiện tại) */}
                                {index === 2 && (
                                    <button className="text-[#3D021E] text-xs font-bold underline underline-offset-4 mt-2 hover:text-[#5a032d]">
                                        Theo dõi kiện hàng
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

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
                        <p className="font-bold text-gray-900 uppercase tracking-wide mb-2">{MOCK_ORDER.customer.name}</p>
                        <p className="text-gray-600 text-sm mb-1">{MOCK_ORDER.customer.phone}</p>
                        <p className="text-gray-600 text-sm leading-relaxed">{MOCK_ORDER.customer.address}</p>
                    </div>
                </div>

                {/* Thẻ Thanh toán */}
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-[#3D021E]" /> Phương thức thanh toán
                    </h3>
                    <div className="flex items-center gap-4 mb-4">
                        {/* Mock Logo Visa */}
                        <div className="w-12 h-12 bg-[#1A1F71] rounded-lg flex items-center justify-center text-white font-bold text-[10px] italic">
                            VISA
                        </div>
                        <div>
                            <p className="font-bold text-gray-900">{MOCK_ORDER.payment.method}</p>
                            <p className="text-gray-500 text-sm">{MOCK_ORDER.payment.detail}</p>
                        </div>
                    </div>
                    <div className="mt-auto border-t border-gray-100 pt-4">
                        <p className="text-[#147A42] text-xs font-bold flex items-center gap-1.5">
                            <Check className="w-4 h-4" /> {MOCK_ORDER.payment.status}
                        </p>
                    </div>
                </div>

                {/* Thẻ Vận chuyển */}
                <div className="bg-[#FAF7F8] rounded-3xl p-6 border border-[#F3EAF0] shadow-sm flex flex-col">
                    <h3 className="font-bold text-gray-900 mb-4 uppercase text-xs tracking-widest text-[#3D021E]">
                        Đơn vị vận chuyển
                    </h3>
                    <div className="flex items-center gap-4">
                        {/* Mock Logo GHN */}
                        <div className="w-12 h-12 bg-teal-700 rounded-lg flex items-center justify-center text-white font-black text-xs">
                            GHN
                        </div>
                        <div>
                            <p className="font-bold text-gray-900">{MOCK_ORDER.shipping.provider}</p>
                            <p className="text-gray-500 text-xs mt-1">Mã vận đơn: {MOCK_ORDER.shipping.trackingCode}</p>
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
                        <Receipt className="w-5 h-5 text-[#3D021E]" /> Danh sách sản phẩm ({MOCK_ORDER.items.length})
                    </h3>
                    
                    <div className="space-y-6">
                        {MOCK_ORDER.items.map((item, index) => (
                            <div key={item.id} className={`flex flex-col sm:flex-row gap-4 pb-6 ${index !== MOCK_ORDER.items.length - 1 ? 'border-b border-gray-100' : ''}`}>
                                
                                {/* Ảnh sản phẩm */}
                                <div className="w-24 h-24 bg-gray-50 rounded-2xl flex-shrink-0 overflow-hidden border border-gray-100 p-2">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                                </div>
                                
                                {/* Chi tiết */}
                                <div className="flex-1 flex flex-col justify-between">
                                    <div className="flex justify-between items-start gap-4">
                                        <div>
                                            <h4 className="font-bold text-gray-900 mb-1">{item.name}</h4>
                                            <p className="text-sm text-gray-500 mb-3">{item.variant}</p>
                                            <span className="inline-block bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-lg">
                                                SL: {item.quantity < 10 ? `0${item.quantity}` : item.quantity}
                                            </span>
                                        </div>
                                        <div className="text-right flex flex-col items-end justify-between h-full">
                                            <span className="font-bold text-gray-900 text-lg whitespace-nowrap">
                                                {formatVND(item.price)}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex justify-end mt-4 sm:mt-0">
                                        <button className="text-[#3D021E] text-sm font-bold hover:underline underline-offset-4">
                                            Viết nhận xét
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Cột phải: Tổng kết đơn hàng */}
                <div className="w-full lg:w-1/3">
                    <div className="bg-[#FAF7F8] rounded-3xl p-6 md:p-8 border border-[#F3EAF0] sticky top-24">
                        <h3 className="font-bold text-lg text-gray-900 mb-6">Tổng kết đơn hàng</h3>
                        
                        <div className="space-y-4 text-sm text-gray-600 border-b border-gray-200 pb-6 mb-6">
                            <div className="flex justify-between items-center">
                                <span>Tạm tính ({MOCK_ORDER.items.length} sản phẩm)</span>
                                <span className="font-medium text-gray-900">{formatVND(MOCK_ORDER.pricing.subTotal)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Phí vận chuyển</span>
                                <span className="font-medium text-gray-900">{formatVND(MOCK_ORDER.pricing.shippingFee)}</span>
                            </div>
                            <div className="flex justify-between items-center text-[#147A42] font-medium">
                                <span className="flex items-center gap-2">
                                    <Ticket className="w-4 h-4" /> Mã giảm giá (GLOWLUXE)
                                </span>
                                <span>-{formatVND(MOCK_ORDER.pricing.discount)}</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-end mb-8">
                            <span className="font-bold text-gray-900 text-lg">Tổng cộng</span>
                            <div className="text-right">
                                <span className="block text-2xl font-black text-[#3D021E]">{formatVND(MOCK_ORDER.pricing.total)}</span>
                                <span className="text-[10px] text-gray-500">(Đã bao gồm VAT)</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <button className="w-full bg-[#3D021E] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#5a032d] shadow-md transition-colors">
                                <Truck className="w-4 h-4" /> Theo dõi kiện hàng
                            </button>
                            <button className="w-full bg-white border border-gray-200 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-50 transition-colors">
                                Liên hệ hỗ trợ
                            </button>
                        </div>
                        
                        <p className="text-xs text-gray-500 text-center mt-6 italic">
                            Cảm ơn bạn đã lựa chọn Glow Aura cho hành trình chăm sóc vẻ đẹp của mình.
                        </p>
                    </div>
                </div>

            </div>

        </div>
      </div>
    </MainLayout>
  );
};