import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, ShieldCheck, Truck } from 'lucide-react';
import { MainLayout } from '../components/layout/MainLayout';
import { useNavigate } from 'react-router-dom';

// --- MOCK DATA ---
const MOCK_CART_ITEMS = [
  {
    id: 1,
    name: 'Túi xách cao cấp Heritage',
    color: 'Đỏ Bordeaux',
    size: 'M',
    price: 4500000,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=400',
  },
  {
    id: 2,
    name: 'Ví cầm tay Classic',
    color: 'Đen Jet Black',
    size: null,
    price: 1200000,
    quantity: 2,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=400',
  }
];

const MOCK_RECOMMENDED = [
  {
    id: 101,
    name: 'Kính râm Aviator',
    category: 'Phụ kiện nam',
    price: 2100000,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=400'
  },
  {
    id: 102,
    name: 'Đồng hồ Chronograph',
    category: 'Đồng hồ cao cấp',
    price: 15500000,
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=400'
  },
  {
    id: 103,
    name: 'Thắt lưng da Ý',
    category: 'Phụ kiện da',
    price: 1850000,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=400'
  },
  {
    id: 104,
    name: 'Khăn choàng Silk',
    category: 'Thời trang nữ',
    price: 950000,
    image: 'https://images.unsplash.com/photo-1584030373081-f37b7bb4fa8e?q=80&w=400'
  }
];

// Helper format tiền tệ VNĐ
const formatVND = (amount: number) => {
  return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
};

export const CartPage = () => {
  const [cartItems, setCartItems] = useState(MOCK_CART_ITEMS);
  const [promoCode, setPromoCode] = useState('');
  const navigate = useNavigate();

  // --- LOGIC GIỎ HÀNG ---
  const handleUpdateQuantity = (id: number, delta: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );
  };

  const handleRemoveItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = 0; // Giả lập giảm giá 0đ
  const total = subTotal - discount;

  return (
    <MainLayout>
      <div className="bg-white min-h-screen pb-24 font-sans text-gray-900">
        <div className="container mx-auto px-4 max-w-[1200px] pt-12">
          
          {/* HEADER GIỎ HÀNG */}
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-[#3D021E] mb-2 font-serif">Giỏ hàng</h1>
            <p className="text-gray-600">Bạn đang có {cartItems.length} sản phẩm trong giỏ hàng.</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-10">
            
            {/* === CỘT TRÁI: DANH SÁCH SẢN PHẨM === */}
            <div className="w-full lg:w-2/3">
              {cartItems.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-gray-500 mb-4">Giỏ hàng của bạn đang trống.</p>
                    <Link to="/" className="text-[#3D021E] font-bold underline underline-offset-4">Tiếp tục mua sắm</Link>
                </div>
              ) : (
                <div className="flex flex-col gap-8">
                  {cartItems.map((item, index) => (
                    <div key={item.id} className={`flex gap-6 pb-8 ${index !== cartItems.length - 1 ? 'border-b border-gray-200' : ''}`}>
                      
                      {/* Ảnh sản phẩm */}
                      <div className="w-32 h-32 md:w-40 md:h-40 flex-shrink-0 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                      </div>

                      {/* Chi tiết sản phẩm */}
                      <div className="flex flex-col flex-1 justify-between">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <h3 className="font-bold text-lg text-gray-900 mb-1">{item.name}</h3>
                            <p className="text-sm text-gray-500">
                              Màu sắc: {item.color} {item.size && `| Kích thước: ${item.size}`}
                            </p>
                          </div>
                          <span className="font-bold text-lg text-[#3D021E] whitespace-nowrap">
                            {formatVND(item.price)}
                          </span>
                        </div>

                        {/* Controls (Số lượng & Nút Xóa) */}
                        <div className="flex items-center justify-between mt-4">
                          
                          {/* Tăng giảm số lượng */}
                          <div className="flex items-center border border-gray-200 rounded-lg">
                            <button 
                                onClick={() => handleUpdateQuantity(item.id, -1)}
                                className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-[#3D021E] hover:bg-gray-50 transition-colors rounded-l-lg"
                            >
                                <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-10 text-center font-bold text-sm select-none">{item.quantity}</span>
                            <button 
                                onClick={() => handleUpdateQuantity(item.id, 1)}
                                className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-[#3D021E] hover:bg-gray-50 transition-colors rounded-r-lg"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Nút Xóa */}
                          <button 
                            onClick={() => handleRemoveItem(item.id)}
                            className="flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" /> Xóa
                          </button>

                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* === CỘT PHẢI: TÓM TẮT ĐƠN HÀNG === */}
            <div className="w-full lg:w-1/3">
              <div className="sticky top-24 space-y-6">
                
                {/* Box tính tiền */}
                <div className="bg-[#FAFAFA] rounded-3xl p-8 shadow-sm border border-gray-100">
                  <h2 className="text-xl font-bold text-[#3D021E] mb-6 font-serif">Tóm tắt đơn hàng</h2>
                  
                  {/* Mã giảm giá */}
                  <div className="mb-6">
                    <label className="text-sm text-gray-600 mb-2 block">Mã giảm giá</label>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            placeholder="Nhập mã của bạn" 
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#3D021E] transition-colors uppercase"
                        />
                        <button className="px-6 py-3 bg-[#3D021E] text-white font-bold rounded-xl text-sm hover:bg-[#5a032d] transition-colors whitespace-nowrap">
                            Áp dụng
                        </button>
                    </div>
                  </div>

                  {/* Chi tiết tiền */}
                  <div className="space-y-4 text-sm text-gray-600 border-b border-gray-200 pb-6 mb-6">
                    <div className="flex justify-between">
                      <span>Tạm tính</span>
                      <span className="font-bold text-gray-900">{formatVND(subTotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Phí vận chuyển</span>
                      <span className="font-bold text-[#147A42]">Miễn phí</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Giảm giá</span>
                      <span className="font-bold text-red-500">-{formatVND(discount)}</span>
                    </div>
                  </div>

                  {/* Tổng cộng */}
                  <div className="flex justify-between items-center mb-8">
                    <span className="text-base font-bold text-gray-900">Tổng cộng</span>
                    <span className="text-2xl font-black text-[#3D021E] tracking-tight">{formatVND(total)}</span>
                  </div>

                  {/* Nút Thanh Toán */}
                                    <button 
                        onClick={() => navigate('/checkout')} 
                        className="w-full bg-[#3D021E] text-white py-4 rounded-2xl font-bold text-sm tracking-widest uppercase hover:bg-[#5a032d] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                        Tiến hành thanh toán
                    </button>

                  {/* Icon Payment Methods */}
                  <div className="flex justify-center items-center gap-2 mt-6 opacity-40">
                     <div className="w-8 h-5 bg-gray-500 rounded flex items-center justify-center text-[8px] text-white font-bold">VISA</div>
                     <div className="w-8 h-5 bg-gray-500 rounded flex items-center justify-center text-[8px] text-white font-bold">MC</div>
                     <div className="w-8 h-5 bg-gray-500 rounded flex items-center justify-center text-[8px] text-white font-bold">COD</div>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="space-y-3">
                    <div className="bg-[#FAFAFA] border border-gray-100 p-4 rounded-2xl flex items-center gap-4">
                        <ShieldCheck className="w-6 h-6 text-[#3D021E] opacity-80" />
                        <div>
                            <h4 className="text-sm font-bold text-gray-900">Thanh toán bảo mật</h4>
                            <p className="text-xs text-gray-500">Mã hóa 256-bit SSL tiêu chuẩn</p>
                        </div>
                    </div>
                    <div className="bg-[#FAFAFA] border border-gray-100 p-4 rounded-2xl flex items-center gap-4">
                        <Truck className="w-6 h-6 text-[#3D021E] opacity-80" />
                        <div>
                            <h4 className="text-sm font-bold text-gray-900">Giao hàng nhanh</h4>
                            <p className="text-xs text-gray-500">Từ 2-3 ngày làm việc</p>
                        </div>
                    </div>
                </div>

              </div>
            </div>
          </div>

          {/* === SECTION DƯỚI: CÓ THỂ BẠN SẼ THÍCH === */}
          <div className="mt-24 pt-12 border-t border-gray-200">
            <h2 className="text-2xl font-serif font-bold text-[#3D021E] mb-8">Có thể bạn sẽ thích</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {MOCK_RECOMMENDED.map((product) => (
                <Link to={`#`} key={product.id} className="group cursor-pointer flex flex-col">
                  {/* Khung ảnh nền màu kem */}
                  <div className="aspect-[4/5] bg-[#F2EDE4] rounded-2xl mb-4 overflow-hidden p-6 flex items-center justify-center relative">
                    <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" 
                    />
                    {/* Nút mua nhanh (Tùy chọn) */}
                    <div className="absolute inset-x-4 bottom-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="bg-white text-center py-2.5 rounded-xl text-xs font-bold text-gray-900 shadow-lg">Thêm nhanh</div>
                    </div>
                  </div>
                  
                  {/* Text */}
                  <div>
                    <h3 className="font-bold text-sm text-gray-900 mb-1 group-hover:text-[#3D021E] transition-colors line-clamp-1">{product.name}</h3>
                    <p className="text-xs text-gray-500 mb-1.5">{product.category}</p>
                    <p className="font-bold text-[#3D021E]">{formatVND(product.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </MainLayout>
  );
};