import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Lock, ArrowRight, Banknote, CreditCard, Wallet
} from 'lucide-react';
import { MainLayout } from '../components/layout/MainLayout';

// --- MOCK DATA SẢN PHẨM ---
const CHECKOUT_ITEMS = [
  {
    id: 1,
    name: 'Đồng hồ đeo tay Minimalist Classic',
    variant: 'Phân loại: Bạc / 40mm',
    price: 1250000,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=200',
  },
  {
    id: 2,
    name: 'Giày Sneaker Thời Trang Sporty',
    variant: 'Phân loại: Đỏ / Size 42',
    price: 2450000,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=200',
  }
];

const formatVND = (amount: number) => new Intl.NumberFormat('vi-VN').format(amount) + 'đ';

export const CheckoutPage = () => {
  const navigate = useNavigate();
  
  // States quản lý phương thức (Mặc định chọn Giao nhanh và Thanh toán COD)
  const [shippingMethod, setShippingMethod] = useState<'fast' | 'standard'>('fast');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'atm' | 'momo'>('cod');
  
  const [promoCode, setPromoCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // States thông tin khách hàng
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    district: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Logic Tính Tiền linh hoạt theo Phương thức vận chuyển
  const subTotal = CHECKOUT_ITEMS.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = shippingMethod === 'fast' ? 35000 : 0;
  const discount = 0;
  const total = subTotal + shippingFee - discount;

  // Xử lý nút Đặt hàng
  const handlePlaceOrder = () => {
    if (!formData.fullName || !formData.phone || !formData.address) {
        alert("Vui lòng điền đầy đủ thông tin vận chuyển!");
        return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
        setIsSubmitting(false);
        alert("Đặt hàng thành công!");
        navigate('/'); // Trở về trang chủ
    }, 1500);
  };

  // Cuộn lên top khi vừa vào trang
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Component tiêu đề từng Section
  const SectionTitle = ({ number, title }: { number: string, title: string }) => (
      <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-[#3D021E] text-white flex items-center justify-center font-bold text-sm shadow-md">
              {number}
          </div>
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      </div>
  );

  return (
    <MainLayout>
      <div className="bg-[#FDFBFB] min-h-screen pb-24 font-sans text-gray-900">
        
        {/* Breadcrumb Header */}
        <div className="bg-white border-b border-gray-100 py-4">
            <div className="container mx-auto px-4 max-w-[1200px] flex items-center text-sm font-medium">
                <Link to="/cart" className="text-gray-500 hover:text-[#3D021E] transition-colors">Giỏ hàng</Link>
                <ChevronRightIcon className="w-4 h-4 mx-2 text-gray-400" />
                <span className="text-[#3D021E]">Thanh toán</span>
            </div>
        </div>

        <div className="container mx-auto px-4 max-w-[1200px] pt-10">
          <div className="flex flex-col lg:flex-row gap-10">
            
            {/* === CỘT TRÁI: FORM ĐIỀN THÔNG TIN === */}
            <div className="w-full lg:w-[60%] space-y-12">
                
                {/* 1. THÔNG TIN VẬN CHUYỂN */}
                <section>
                    <SectionTitle number="1" title="Thông tin vận chuyển" />
                    <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Họ và tên <span className="text-red-500">*</span></label>
                            <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Nguyễn Văn A" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-[#3D021E] focus:ring-1 focus:ring-[#3D021E] outline-none transition-all" />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Số điện thoại <span className="text-red-500">*</span></label>
                                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="0901 234 567" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-[#3D021E] focus:ring-1 focus:ring-[#3D021E] outline-none transition-all" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                                <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="example@gmail.com" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-[#3D021E] focus:ring-1 focus:ring-[#3D021E] outline-none transition-all" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Địa chỉ chi tiết <span className="text-red-500">*</span></label>
                            <input type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="Số nhà, tên đường, phường/xã..." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-[#3D021E] focus:ring-1 focus:ring-[#3D021E] outline-none transition-all" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Tỉnh/Thành phố <span className="text-red-500">*</span></label>
                                <select name="city" value={formData.city} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-[#3D021E] focus:ring-1 focus:ring-[#3D021E] outline-none transition-all appearance-none cursor-pointer">
                                    <option value="">Chọn Tỉnh/Thành phố</option>
                                    <option value="Hà Nội">Hà Nội</option>
                                    <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                                    <option value="Đà Nẵng">Đà Nẵng</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Quận/Huyện <span className="text-red-500">*</span></label>
                                <select name="district" value={formData.district} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-[#3D021E] focus:ring-1 focus:ring-[#3D021E] outline-none transition-all appearance-none cursor-pointer">
                                    <option value="">Chọn Quận/Huyện</option>
                                    <option value="1">Quận 1</option>
                                    <option value="3">Quận 3</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. PHƯƠNG THỨC VẬN CHUYỂN */}
                <section>
                    <SectionTitle number="2" title="Phương thức vận chuyển" />
                    <div className="space-y-4">
                        {/* Option 1: Giao Nhanh */}
                        <label className={`flex items-center justify-between p-5 rounded-2xl border-[1.5px] cursor-pointer transition-all duration-200
                            ${shippingMethod === 'fast' ? 'border-[#3D021E] bg-[#3D021E]/[0.03]' : 'border-gray-200 bg-white hover:border-[#3D021E]/30'}
                        `}>
                            {/* Input ẩn để quản lý logic */}
                            <input 
                                type="radio" 
                                name="shipping" 
                                className="hidden" 
                                checked={shippingMethod === 'fast'} 
                                onChange={() => setShippingMethod('fast')} 
                            />
                            <div className="flex items-center gap-4">
                                <div className={`w-5 h-5 rounded-full border-[1.5px] flex items-center justify-center transition-colors
                                    ${shippingMethod === 'fast' ? 'border-[#3D021E]' : 'border-gray-300'}
                                `}>
                                    {shippingMethod === 'fast' && <div className="w-2.5 h-2.5 bg-[#3D021E] rounded-full animate-in zoom-in duration-200" />}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 uppercase text-sm">Giao hàng nhanh</h4>
                                    <p className="text-xs text-gray-500 italic mt-0.5">Dự kiến nhận hàng 2-3 ngày</p>
                                </div>
                            </div>
                            <span className="font-bold text-gray-900">35.000đ</span>
                        </label>

                        {/* Option 2: Tiêu chuẩn */}
                        <label className={`flex items-center justify-between p-5 rounded-2xl border-[1.5px] cursor-pointer transition-all duration-200
                            ${shippingMethod === 'standard' ? 'border-[#3D021E] bg-[#3D021E]/[0.03]' : 'border-gray-200 bg-white hover:border-[#3D021E]/30'}
                        `}>
                             {/* Input ẩn để quản lý logic */}
                             <input 
                                type="radio" 
                                name="shipping" 
                                className="hidden" 
                                checked={shippingMethod === 'standard'} 
                                onChange={() => setShippingMethod('standard')} 
                            />
                            <div className="flex items-center gap-4">
                                <div className={`w-5 h-5 rounded-full border-[1.5px] flex items-center justify-center transition-colors
                                    ${shippingMethod === 'standard' ? 'border-[#3D021E]' : 'border-gray-300'}
                                `}>
                                    {shippingMethod === 'standard' && <div className="w-2.5 h-2.5 bg-[#3D021E] rounded-full animate-in zoom-in duration-200" />}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 uppercase text-sm">Giao hàng tiêu chuẩn</h4>
                                    <p className="text-xs text-gray-500 italic mt-0.5">Dự kiến nhận hàng 4-7 ngày</p>
                                </div>
                            </div>
                            <span className="font-bold text-[#147A42]">Miễn phí</span>
                        </label>
                    </div>
                </section>

                {/* 3. PHƯƠNG THỨC THANH TOÁN */}
                <section>
                    <SectionTitle number="3" title="Phương thức thanh toán" />
                    <div className="space-y-4">
                        {[
                            { id: 'cod', icon: Banknote, title: 'Thanh toán khi nhận hàng (COD)', desc: 'Kiểm tra hàng trước khi thanh toán' },
                            { id: 'atm', icon: CreditCard, title: 'Thẻ ngân hàng (ATM)', desc: 'Thanh toán qua cổng Napas' },
                            { id: 'momo', icon: Wallet, title: 'Ví điện tử MoMo', desc: 'Thanh toán nhanh qua ứng dụng MoMo' },
                        ].map((method) => (
                            <label key={method.id} className={`flex items-center gap-4 p-4 rounded-2xl border-[1.5px] cursor-pointer transition-all duration-200
                                ${paymentMethod === method.id ? 'border-[#3D021E] bg-[#3D021E]/[0.03]' : 'border-gray-200 bg-white hover:border-[#3D021E]/30'}
                            `}>
                                {/* Input ẩn để quản lý logic */}
                                <input 
                                    type="radio" 
                                    name="payment" 
                                    className="hidden" 
                                    checked={paymentMethod === method.id} 
                                    onChange={() => setPaymentMethod(method.id as 'cod' | 'atm' | 'momo')} 
                                />

                                <div className={`w-5 h-5 rounded-full border-[1.5px] flex items-center justify-center transition-colors flex-shrink-0
                                    ${paymentMethod === method.id ? 'border-[#3D021E]' : 'border-gray-300'}
                                `}>
                                    {paymentMethod === method.id && <div className="w-2.5 h-2.5 bg-[#3D021E] rounded-full animate-in zoom-in duration-200" />}
                                </div>
                                
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors
                                    ${paymentMethod === method.id ? 'bg-[#3D021E] text-white' : 'bg-gray-100 text-gray-500'}
                                `}>
                                    <method.icon className="w-5 h-5" />
                                </div>

                                <div>
                                    <h4 className={`font-bold text-sm transition-colors ${paymentMethod === method.id ? 'text-[#3D021E]' : 'text-gray-900'}`}>
                                        {method.title}
                                    </h4>
                                    <p className="text-xs text-gray-500 mt-0.5">{method.desc}</p>
                                </div>
                            </label>
                        ))}
                    </div>
                </section>

            </div>

            {/* === CỘT PHẢI: TÓM TẮT ĐƠN HÀNG (STICKY) === */}
            <div className="w-full lg:w-[40%]">
              <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 sticky top-24">
                
                <h2 className="text-xl font-bold text-gray-900 mb-6">Đơn hàng của bạn <span className="text-gray-500 text-base font-normal">({CHECKOUT_ITEMS.length} sản phẩm)</span></h2>
                
                {/* Danh sách sản phẩm */}
                <div className="space-y-6 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {CHECKOUT_ITEMS.map((item) => (
                        <div key={item.id} className="flex gap-4">
                            <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                            </div>
                            <div className="flex-1 flex flex-col justify-between py-0.5">
                                <div>
                                    <div className="flex justify-between items-start gap-2">
                                        <h4 className="font-bold text-sm text-gray-900 leading-tight line-clamp-2 pr-2">{item.name}</h4>
                                        <span className="font-bold text-sm text-[#3D021E] whitespace-nowrap">{formatVND(item.price)}</span>
                                    </div>
                                    <p className="text-[11px] text-gray-500 mt-1">{item.variant}</p>
                                </div>
                                <p className="text-xs font-bold text-gray-700">Số lượng: {item.quantity}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mã giảm giá */}
                <div className="flex gap-2 mb-8">
                    <input 
                        type="text" 
                        placeholder="Mã giảm giá" 
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-[#3D021E] transition-colors"
                    />
                    <button className="px-6 py-3 bg-[#3D021E] text-white font-bold rounded-xl text-sm hover:bg-[#5a032d] transition-colors shadow-md">
                        Áp dụng
                    </button>
                </div>

                {/* Chi tiết giá */}
                <div className="space-y-3 text-sm text-gray-600 border-b border-gray-100 pb-6 mb-6">
                    <div className="flex justify-between items-center">
                        <span>Tạm tính</span>
                        <span className="font-medium text-gray-900">{formatVND(subTotal)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Phí vận chuyển</span>
                        <span className={`font-medium ${shippingFee === 0 ? 'text-[#147A42]' : 'text-gray-900'}`}>
                            {shippingFee === 0 ? 'Miễn phí' : formatVND(shippingFee)}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Giảm giá</span>
                        <span className="font-medium text-gray-400">-{formatVND(discount)}</span>
                    </div>
                </div>

                {/* Tổng cộng */}
                <div className="flex justify-between items-end mb-8">
                    <span className="font-bold text-gray-900 text-lg">Tổng cộng</span>
                    <div className="text-right">
                        <span className="block text-2xl font-black text-[#3D021E]">{formatVND(total)}</span>
                        <span className="text-[10px] text-gray-400">ĐÃ BAO GỒM VAT</span>
                    </div>
                </div>

                {/* Nút Đặt hàng */}
                <button 
                    onClick={handlePlaceOrder}
                    disabled={isSubmitting}
                    className="w-full bg-[#3D021E] text-white py-4 rounded-2xl font-bold uppercase tracking-widest hover:bg-[#5a032d] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none"
                >
                    {isSubmitting ? 'Đang xử lý...' : <>Hoàn tất đặt hàng <ArrowRight className="w-5 h-5" /></>}
                </button>

                <div className="mt-6 flex items-center justify-center gap-2 text-gray-400">
                    <Lock className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-medium tracking-wide uppercase">Thanh toán an toàn 256-bit SSL</span>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </MainLayout>
  );
};

// Mini component để tái sử dụng icon
function ChevronRightIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}