import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, ArrowRight, Banknote, Wallet, QrCode, Smartphone } from 'lucide-react';
import { MainLayout } from '../components/layout/MainLayout';
import { useCart } from '../context/CartContext'; 
import apiClient from '../services/apiClient'; // Import apiClient để gọi trực tiếp

const formatVND = (amount: number) => new Intl.NumberFormat('vi-VN').format(amount) + 'đ';

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  
  const [isOrderCompleted, setIsOrderCompleted] = useState(false);
  const [shippingMethod, setShippingMethod] = useState<'fast' | 'standard'>('fast');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'momo' | 'zalopay' | 'vnpay'>('cod');
  const [promoCode, setPromoCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    district: ''
  });

  useEffect(() => {
    if (cartItems.length === 0 && !isOrderCompleted) {
      navigate('/');
    }
  }, [cartItems, navigate, isOrderCompleted]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const subTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = shippingMethod === 'fast' ? 35000 : 0;
  const discount = 0;
  const total = subTotal + shippingFee - discount;

  // XỬ LÝ ĐẶT HÀNG & CHUYỂN HƯỚNG THANH TOÁN (HỖ TRỢ VNPAY SANDBOX)
  const handlePlaceOrder = async () => {
    if (!formData.fullName || !formData.phone || !formData.address || !formData.city || !formData.district) {
        alert("Vui lòng điền đầy đủ thông tin vận chuyển (có dấu *)!");
        return;
    }
    
    setIsSubmitting(true);

    const paymentEnumMap: Record<string, number> = {
        'cod': 0, 'momo': 1, 'vnpay': 2, 'zalopay': 3
    };
    
    const orderPayload = {
      // ÉP KIỂU CHUẨN 100% CHO BACKEND C# KHÔNG THỂ TỪ CHỐI
      items: cartItems.map(item => ({
        productId: Number(item.id),
        quantity: Number(item.quantity)
      })),
      shippingAddress: `${formData.address}, ${formData.district}, ${formData.city}`,
      shippingPhone: formData.phone,
      receiverName: formData.fullName,
      paymentMethod: paymentEnumMap[paymentMethod], 
      notes: shippingMethod === 'fast' ? "Giao hàng nhanh" : "Giao hàng tiêu chuẩn",
      couponCode: promoCode || null
    };

    try {
      // BƯỚC 1: TẠO ĐƠN HÀNG VỚI BUILDER PATTERN
      const createRes = await apiClient.post('/Order', orderPayload);
      const createdOrder = createRes.data?.data || createRes.data;
      const orderId = createdOrder?.orderId || createdOrder?.id;

      if (!orderId) throw new Error("Không nhận được mã đơn hàng từ máy chủ.");

      // BƯỚC 2: GỌI API LẤY LINK THANH TOÁN (FACTORY PATTERN)
      if (paymentMethod !== 'cod') {
          const payPayload = {
              paymentMethod: paymentEnumMap[paymentMethod],
              returnUrl: window.location.origin + '/order-success'
          };
          
          const payRes = await apiClient.post(`/Order/${orderId}/pay`, payPayload);
          
          // Bắt đúng biến redirectUrl từ class PaymentResponse của C#
          const paymentUrl = payRes.data?.redirectUrl || payRes.data?.data?.redirectUrl;
          
          if (paymentUrl) {
              clearCart(); // Xóa giỏ hàng
              window.location.href = paymentUrl; // Đẩy thẳng sang web của VNPay/MoMo
              return; 
          }
      }
      
      // BƯỚC 3: NẾU LÀ COD THÌ VÀO TRANG SUCCESS LUÔN
      clearCart();
      setIsOrderCompleted(true);
      navigate('/order-success', { state: { order: createdOrder } });
      
    } catch (error: any) {
      // IN RA LỖI CHÍNH XÁC TỪ BACKEND ĐỂ DỄ BẮT BỆNH
      const errorMsg = error.response?.data?.message 
                    || error.response?.data?.title 
                    || "Đặt hàng thất bại. Vui lòng kiểm tra lại.";
      alert(errorMsg);
      console.error("Chi tiết lỗi:", error.response?.data || error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
        <div className="bg-white border-b border-gray-100 py-4">
            <div className="container mx-auto px-4 max-w-[1200px] flex items-center text-sm font-medium">
                <Link to="/cart" className="text-gray-500 hover:text-[#3D021E] transition-colors">Giỏ hàng</Link>
                <ChevronRightIcon className="w-4 h-4 mx-2 text-gray-400" />
                <span className="text-[#3D021E]">Thanh toán</span>
            </div>
        </div>

        <div className="container mx-auto px-4 max-w-[1200px] pt-10">
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="w-full lg:w-[60%] space-y-12">
                <section>
                    <SectionTitle number="1" title="Thông tin vận chuyển" />
                    <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Họ và tên <span className="text-red-500">*</span></label>
                            <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Nguyễn Văn A" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-[#3D021E] outline-none transition-all" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Số điện thoại <span className="text-red-500">*</span></label>
                                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="0901 234 567" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-[#3D021E] outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                                <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="example@gmail.com" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-[#3D021E] outline-none" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Địa chỉ chi tiết <span className="text-red-500">*</span></label>
                            <input type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="Số nhà, tên đường..." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-[#3D021E] outline-none" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <select name="city" value={formData.city} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none appearance-none cursor-pointer">
                                <option value="">Chọn Tỉnh/Thành phố</option>
                                <option value="Hà Nội">Hà Nội</option>
                                <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                                <option value="Đà Nẵng">Đà Nẵng</option>
                            </select>
                            <select name="district" value={formData.district} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none appearance-none cursor-pointer">
                                <option value="">Chọn Quận/Huyện</option>
                                <option value="1">Quận 1</option>
                                <option value="3">Quận 3</option>
                            </select>
                        </div>
                    </div>
                </section>

                <section>
                    <SectionTitle number="2" title="Phương thức vận chuyển" />
                    <div className="space-y-4">
                        <label className={`flex items-center justify-between p-5 rounded-2xl border-[1.5px] cursor-pointer transition-all ${shippingMethod === 'fast' ? 'border-[#3D021E] bg-[#3D021E]/5' : 'border-gray-200 bg-white'}`}>
                            <input type="radio" name="shipping" className="hidden" checked={shippingMethod === 'fast'} onChange={() => setShippingMethod('fast')} />
                            <div className="flex items-center gap-4">
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${shippingMethod === 'fast' ? 'border-[#3D021E]' : 'border-gray-300'}`}>
                                    {shippingMethod === 'fast' && <div className="w-2.5 h-2.5 bg-[#3D021E] rounded-full" />}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 uppercase text-sm">Giao hàng nhanh</h4>
                                    <p className="text-xs text-gray-500 italic mt-0.5">Dự kiến nhận hàng 2-3 ngày</p>
                                </div>
                            </div>
                            <span className="font-bold text-gray-900">35.000đ</span>
                        </label>
                        <label className={`flex items-center justify-between p-5 rounded-2xl border-[1.5px] cursor-pointer transition-all ${shippingMethod === 'standard' ? 'border-[#3D021E] bg-[#3D021E]/5' : 'border-gray-200 bg-white'}`}>
                             <input type="radio" name="shipping" className="hidden" checked={shippingMethod === 'standard'} onChange={() => setShippingMethod('standard')} />
                            <div className="flex items-center gap-4">
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${shippingMethod === 'standard' ? 'border-[#3D021E]' : 'border-gray-300'}`}>
                                    {shippingMethod === 'standard' && <div className="w-2.5 h-2.5 bg-[#3D021E] rounded-full" />}
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

                <section>
                    <SectionTitle number="3" title="Phương thức thanh toán" />
                    <div className="space-y-4">
                        {[
                            { id: 'cod', icon: Banknote, title: 'Thanh toán khi nhận hàng (COD)', desc: 'Kiểm tra hàng trước khi thanh toán' },
                            { id: 'momo', icon: Wallet, title: 'Ví điện tử MoMo', desc: 'Thanh toán nhanh qua ứng dụng MoMo' },
                            { id: 'zalopay', icon: Smartphone, title: 'Ví ZaloPay', desc: 'Thanh toán tiện lợi qua ứng dụng ZaloPay' },
                            { id: 'vnpay', icon: QrCode, title: 'Cổng thanh toán VNPay', desc: 'Quét mã QR qua ứng dụng ngân hàng' },
                        ].map((method) => (
                            <label key={method.id} className={`flex items-center gap-4 p-4 rounded-2xl border-[1.5px] cursor-pointer transition-all ${paymentMethod === method.id ? 'border-[#3D021E] bg-[#3D021E]/5' : 'border-gray-200 bg-white'}`}>
                                <input type="radio" name="payment" className="hidden" checked={paymentMethod === method.id} onChange={() => setPaymentMethod(method.id as any)} />
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${paymentMethod === method.id ? 'border-[#3D021E]' : 'border-gray-300'}`}>
                                    {paymentMethod === method.id && <div className="w-2.5 h-2.5 bg-[#3D021E] rounded-full" />}
                                </div>
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${paymentMethod === method.id ? 'bg-[#3D021E] text-white' : 'bg-gray-100 text-gray-500'}`}>
                                    <method.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className={`font-bold text-sm ${paymentMethod === method.id ? 'text-[#3D021E]' : 'text-gray-900'}`}>{method.title}</h4>
                                    <p className="text-xs text-gray-500 mt-0.5">{method.desc}</p>
                                </div>
                            </label>
                        ))}
                    </div>
                </section>
            </div>

            <div className="w-full lg:w-[40%]">
              <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-gray-100 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Đơn hàng của bạn <span className="text-gray-500 text-base font-normal">({cartItems.length})</span></h2>
                <div className="space-y-6 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {cartItems.map((item) => (
                        <div key={item.id} className="flex gap-4">
                            <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-xs text-gray-900 leading-tight line-clamp-2">{item.name}</h4>
                                <p className="text-[10px] text-gray-500 mt-1">SL: {item.quantity} | {item.color}</p>
                                <p className="font-bold text-xs text-[#3D021E] mt-1">{formatVND(item.price)}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="space-y-3 text-sm text-gray-600 border-b border-gray-100 pb-6 mb-6">
                    <div className="flex justify-between"><span>Tạm tính</span><span className="font-medium text-gray-900">{formatVND(subTotal)}</span></div>
                    <div className="flex justify-between"><span>Phí vận chuyển</span><span className="font-medium text-[#147A42]">{shippingFee === 0 ? 'Miễn phí' : formatVND(shippingFee)}</span></div>
                </div>
                <div className="flex justify-between items-end mb-8">
                    <span className="font-bold text-gray-900 text-lg">Tổng cộng</span>
                    <span className="text-2xl font-black text-[#3D021E]">{formatVND(total)}</span>
                </div>
                <button onClick={handlePlaceOrder} disabled={isSubmitting} className="w-full bg-[#3D021E] text-white py-4 rounded-2xl font-bold uppercase tracking-widest hover:bg-[#5a032d] transition-all shadow-lg disabled:opacity-70 flex items-center justify-center gap-2">
                    {isSubmitting ? 'Đang xử lý...' : <>Hoàn tất đặt hàng <ArrowRight className="w-5 h-5" /></>}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

function ChevronRightIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}