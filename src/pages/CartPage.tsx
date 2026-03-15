import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ShieldCheck, Truck } from 'lucide-react';
import { MainLayout } from '../components/layout/MainLayout';
import { useCart } from '../context/CartContext'; // Import Context Giỏ hàng
import { productService } from '../services/productService'; // Import API Sản phẩm

const formatVND = (amount: number) => {
  return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
};

export const CartPage = () => {
  const [promoCode, setPromoCode] = useState('');
  const [recommended, setRecommended] = useState<any[]>([]); // Lưu sản phẩm gợi ý thật
  const navigate = useNavigate();

  // 1. LẤY DỮ LIỆU TỪ GLOBAL STATE (CONTEXT)
  const { cartItems, updateQuantity, removeFromCart } = useCart();

  // 2. GỌI API ĐỂ LẤY SẢN PHẨM GỢI Ý
  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const data = await productService.getAll();
        const productsArray = Array.isArray(data) ? data : (data.items || data.data || []);
        setRecommended(productsArray.slice(0, 4)); // Lấy 4 sản phẩm
      } catch (error) {
        console.error("Lỗi tải sản phẩm gợi ý", error);
      }
    };
    fetchRecommended();
  }, []);

  // 3. TÍNH TOÁN TIỀN TỰ ĐỘNG
  const subTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = 0; 
  const total = subTotal - discount;

  return (
    <MainLayout>
      <div className="bg-white min-h-screen pb-24 font-sans text-gray-900">
        <div className="container mx-auto px-4 max-w-[1200px] pt-12">
          
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-[#3D021E] mb-2 font-serif">Giỏ hàng</h1>
            <p className="text-gray-600">Bạn đang có {cartItems.length} sản phẩm trong giỏ hàng.</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-10">
            
            {/* DANH SÁCH SẢN PHẨM === */}
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
                      
                      {/* Ảnh sản phẩm  */}
                      <div className="w-32 h-32 md:w-40 md:h-40 flex-shrink-0 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                      </div>

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

                        {/* Controls */}
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center border border-gray-200 rounded-lg">
                            <button 
                                onClick={() => updateQuantity(item.id, -1)}
                                className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-[#3D021E] hover:bg-gray-50 transition-colors rounded-l-lg"
                            >
                                <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-10 text-center font-bold text-sm select-none">{item.quantity}</span>
                            <button 
                                onClick={() => updateQuantity(item.id, 1)}
                                className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-[#3D021E] hover:bg-gray-50 transition-colors rounded-r-lg"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          <button 
                            onClick={() => removeFromCart(item.id)}
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

            {/* === TÓM TẮT ĐƠN HÀNG === */}
            <div className="w-full lg:w-1/3">
              <div className="sticky top-24 space-y-6">
                
                <div className="bg-[#FAFAFA] rounded-3xl p-8 shadow-sm border border-gray-100">
                  <h2 className="text-xl font-bold text-[#3D021E] mb-6 font-serif">Tóm tắt đơn hàng</h2>
                  
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

                  <div className="flex justify-between items-center mb-8">
                    <span className="text-base font-bold text-gray-900">Tổng cộng</span>
                    <span className="text-2xl font-black text-[#3D021E] tracking-tight">{formatVND(total)}</span>
                  </div>

                  {/* Vô hiệu hóa nút thanh toán nếu giỏ hàng trống */}
                  <button 
                      onClick={() => navigate('/checkout')} 
                      disabled={cartItems.length === 0}
                      className={`w-full text-white py-4 rounded-2xl font-bold text-sm tracking-widest uppercase transition-all shadow-lg 
                        ${cartItems.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#3D021E] hover:bg-[#5a032d] hover:shadow-xl hover:-translate-y-0.5'}`}
                  >
                      Tiến hành thanh toán
                  </button>

                  <div className="flex justify-center items-center gap-2 mt-6 opacity-40">
                     <div className="w-8 h-5 bg-gray-500 rounded flex items-center justify-center text-[8px] text-white font-bold">MOMO</div>
                     <div className="w-8 h-5 bg-gray-500 rounded flex items-center justify-center text-[8px] text-white font-bold">VNPAY</div>
                     <div className="w-8 h-5 bg-gray-500 rounded flex items-center justify-center text-[8px] text-white font-bold">COD</div>
                     <div className="w-8 h-5 bg-gray-500 rounded flex items-center justify-center text-[8px] text-white font-bold">ZALOPAY</div>
                  </div>
                </div>

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

          {recommended.length > 0 && (
              <div className="mt-24 pt-12 border-t border-gray-200">
                <h2 className="text-2xl font-serif font-bold text-[#3D021E] mb-8">Có thể bạn sẽ thích</h2>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                  {recommended.map((product) => (
                    <Link to={`/product/${product.id}`} key={product.id} className="group cursor-pointer flex flex-col">
                      <div className="aspect-[4/5] bg-[#F2EDE4] rounded-2xl mb-4 overflow-hidden p-6 flex items-center justify-center relative">
                        <img 
                            src={product.imageUrl || product.image || "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600"} 
                            alt={product.name} 
                            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" 
                        />
                      </div>
                      
                      <div>
                        <h3 className="font-bold text-sm text-gray-900 mb-1 group-hover:text-[#3D021E] transition-colors line-clamp-1">{product.name}</h3>
                        <p className="text-xs text-gray-500 mb-1.5">{product.category}</p>
                        <p className="font-bold text-[#3D021E]">{formatVND(product.price)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
          )}

        </div>
      </div>
    </MainLayout>
  );
};