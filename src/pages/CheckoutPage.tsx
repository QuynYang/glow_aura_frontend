import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Banknote, Landmark } from 'lucide-react';
import { MainLayout } from '../components/layout/MainLayout';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { checkoutService } from '../services/checkoutService';
import { AddressMapPicker } from '../components/ui/AddressMapPicker';

const formatVND = (amount: number) => new Intl.NumberFormat('vi-VN').format(amount) + 'đ';

type PaymentMethodId = 'cod' | 'payos';

const PAYMENT_METHODS: Array<{
  id: PaymentMethodId;
  icon: typeof Banknote;
  title: string;
  desc: string;
}> = [
  {
    id: 'cod',
    icon: Banknote,
    title: 'Thanh toán khi nhận hàng (COD)',
    desc: 'Admin xác nhận đơn trước, thu tiền khi giao hàng',
  },
  {
    id: 'payos',
    icon: Landmark,
    title: 'PayOS (QR / Chuyển khoản)',
    desc: 'Thanh toán online qua QR hoặc chuyển khoản ngân hàng',
  },
];

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();

  const [isOrderCompleted, setIsOrderCompleted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>('cod');
  const [couponInput, setCouponInput] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState<Awaited<ReturnType<typeof checkoutService.preview>> | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    phone: user?.phoneNumber || '',
    email: user?.email || '',
    address: '',
  });

  useEffect(() => {
    if (cartItems.length === 0 && !isOrderCompleted) {
      navigate('/');
    }
  }, [cartItems, navigate, isOrderCompleted]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = useCallback((fullAddress: string) => {
    setFormData((prev) => {
      if (prev.address === fullAddress) return prev;
      return { ...prev, address: fullAddress };
    });
  }, []);

  const subTotal = preview?.subTotal ?? cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = preview?.shippingFee ?? (subTotal >= 500_000 ? 0 : 30_000);
  const discount = preview?.totalDiscount ?? 0;
  const total = preview?.totalAmount ?? subTotal + shippingFee - discount;

  const cartItemsJson = JSON.stringify(cartItems);
  const formDataJson = JSON.stringify(formData);

  useEffect(() => {
    const canPreview = formData.fullName && formData.phone && formData.address.length > 10;
    if (!canPreview || cartItems.length === 0) return;

    const timeoutId = setTimeout(() => {
      const fetchPreview = async () => {
        try {
          const data = await checkoutService.preview({
            items: cartItems.map((item) => ({
              productId: String(item.id),
              quantity: Number(item.quantity),
            })),
            shippingAddress: formData.address,
            shippingPhone: formData.phone,
            receiverName: formData.fullName,
            paymentMethod: paymentMethod.toUpperCase(),
            couponCode: promoCode || null,
            notes: null,
          });
          setPreview(data);
          setWarnings(Array.isArray(data?.warnings) ? data.warnings : []);
        } catch (error) {
          console.error('Lỗi Preview:', error);
          setPreview(null);
          setWarnings([]);
        }
      };
      void fetchPreview();
    }, 800);

    return () => clearTimeout(timeoutId);
  }, [cartItemsJson, formDataJson, paymentMethod, promoCode, user]);

  const handlePlaceOrder = async () => {
    if (!formData.fullName || !formData.phone || !formData.address) {
      alert('Vui lòng điền đầy đủ thông tin vận chuyển (có dấu *)!');
      return;
    }

    setIsSubmitting(true);
    const resultBaseUrl = `${window.location.origin}${import.meta.env.BASE_URL}#/payment-result`;

    const orderPayload = {
      items: cartItems.map((item) => ({
        productId: String(item.id),
        quantity: Number(item.quantity),
      })),
      shippingAddress: formData.address,
      shippingPhone: formData.phone,
      receiverName: formData.fullName,
      paymentMethod: paymentMethod.toUpperCase(),
      notes: null,
      couponCode: promoCode || null,
      returnUrl: resultBaseUrl,
      cancelUrl: resultBaseUrl,
    };

    try {
      const result = await checkoutService.checkout(orderPayload);

      if (!result?.isSuccess) {
        throw new Error(result?.message || 'Đặt hàng thất bại');
      }

      if (result.paymentUrl) {
        clearCart();
        window.location.href = result.paymentUrl;
        return;
      }

      clearCart();
      setIsOrderCompleted(true);
      navigate('/order-success', {
        state: {
          order: {
            orderNumber: result.orderNumber,
            totalAmount: result.totalAmount,
            shippingAddress: formData.address,
          },
        },
      });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string; title?: string } }; message?: string };
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.title ||
        err.message ||
        'Đặt hàng thất bại. Vui lòng kiểm tra lại.';
      alert(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const SectionTitle = ({ number, title }: { number: string; title: string }) => (
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
            <Link to="/cart" className="text-gray-500 hover:text-[#3D021E] transition-colors">
              Giỏ hàng
            </Link>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Họ và tên <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Nguyễn Văn A"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-[#3D021E] outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Số điện thoại <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="0901 234 567"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-[#3D021E] outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email (Để nhận hóa đơn)</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="example@gmail.com"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-[#3D021E] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Địa chỉ giao hàng <span className="text-red-500">*</span>
                    </label>
                    <AddressMapPicker onAddressChange={handleAddressChange} />
                  </div>
                </div>
              </section>

              <section>
                <SectionTitle number="2" title="Phương thức vận chuyển" />
                <div className="bg-white p-5 rounded-2xl border border-gray-200">
                  <p className="font-bold text-gray-900 text-sm">Giao hàng tiêu chuẩn</p>
                  <p className="text-xs text-gray-500 mt-1">Dự kiến 4–7 ngày làm việc</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Phí ship: {shippingFee === 0 ? 'Miễn phí (đơn từ 500.000đ)' : '30.000đ (miễn phí từ 500.000đ)'}
                  </p>
                </div>
              </section>

              <section>
                <SectionTitle number="3" title="Phương thức thanh toán" />
                <div className="space-y-4">
                  {PAYMENT_METHODS.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center gap-4 p-4 rounded-2xl border-[1.5px] cursor-pointer transition-all ${
                        paymentMethod === method.id ? 'border-[#3D021E] bg-[#3D021E]/5' : 'border-gray-200 bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        className="hidden"
                        checked={paymentMethod === method.id}
                        onChange={() => setPaymentMethod(method.id)}
                      />
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${
                          paymentMethod === method.id ? 'border-[#3D021E]' : 'border-gray-300'
                        }`}
                      >
                        {paymentMethod === method.id && <div className="w-2.5 h-2.5 bg-[#3D021E] rounded-full" />}
                      </div>
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          paymentMethod === method.id ? 'bg-[#3D021E] text-white' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        <method.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className={`font-bold text-sm ${paymentMethod === method.id ? 'text-[#3D021E]' : 'text-gray-900'}`}>
                          {method.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-0.5">{method.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </section>
            </div>

            <div className="w-full lg:w-[40%]">
              <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-gray-100 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Đơn hàng của bạn <span className="text-gray-500 text-base font-normal">({cartItems.length})</span>
                </h2>
                <div className="space-y-6 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-xs text-gray-900 leading-tight line-clamp-2">{item.name}</h4>
                        <p className="text-[10px] text-gray-500 mt-1">
                          SL: {item.quantity} | {item.color}
                        </p>
                        <p className="font-bold text-xs text-[#3D021E] mt-1">{formatVND(item.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mb-6 border-b border-gray-100 pb-6">
                  <input
                    type="text"
                    placeholder="Nhập mã giảm giá"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-[#3D021E] uppercase text-sm font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setPromoCode(couponInput)}
                    className="px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors text-sm whitespace-nowrap shadow-sm"
                  >
                    ÁP DỤNG
                  </button>
                </div>
                <div className="space-y-3 text-sm text-gray-600 border-b border-gray-100 pb-6 mb-6">
                  <div className="flex justify-between">
                    <span>Tạm tính</span>
                    <span className="font-medium text-gray-900">{formatVND(subTotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phí vận chuyển</span>
                    <span className="font-medium text-[#147A42]">{shippingFee === 0 ? 'Miễn phí' : formatVND(shippingFee)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Giảm giá</span>
                    <span className="font-medium text-red-600">-{formatVND(discount)}</span>
                  </div>
                </div>
                {warnings.length > 0 && (
                  <div className="mb-6 space-y-1">
                    {warnings.map((w) => (
                      <p key={w} className="text-xs text-orange-600 font-medium">
                        {w}
                      </p>
                    ))}
                  </div>
                )}
                <div className="flex justify-between items-end mb-8">
                  <span className="font-bold text-gray-900 text-lg">Tổng cộng</span>
                  <span className="text-2xl font-black text-[#3D021E]">{formatVND(total)}</span>
                </div>
                <button
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting}
                  className="w-full bg-[#3D021E] text-white py-4 rounded-2xl font-bold uppercase tracking-widest hover:bg-[#5a032d] transition-all shadow-lg disabled:opacity-70 flex items-center justify-center gap-2"
                >
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

function ChevronRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
