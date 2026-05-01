import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Search, Trash2, CheckCircle2, 
  User, MapPin, Phone, CreditCard, ShoppingBag, Receipt,
  FileText, Truck, Loader2 
} from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import apiClient from '../../services/apiClient';

export const AdminCreateOrderPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  // States Dữ liệu
  const [productsList, setProductsList] = useState<any[]>([]);
  
  // States Form
  const [customer, setCustomer] = useState({ name: '', phone: '', address: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<any[]>([]);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  
  // States Giao hàng & Khuyến mãi (Chỉ phục vụ hiển thị UI tạm tính)
  const [shippingProvider, setShippingProvider] = useState('ghtk');
  const [shippingFee, setShippingFee] = useState(30000);
  const [discount, setDiscount] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [orderNote, setOrderNote] = useState('');

  // 1. TẢI DANH SÁCH SẢN PHẨM TỪ API
  useEffect(() => {
      const fetchProducts = async () => {
          setIsLoadingProducts(true);
          try {
              const response = await apiClient.get('/products');
              let pList = [];
              if (response.data && Array.isArray(response.data)) pList = response.data;
              else if (response.data?.data && Array.isArray(response.data.data)) pList = response.data.data;
              else if (response.data?.items && Array.isArray(response.data.items)) pList = response.data.items;

              const formattedProducts = pList.map((p: any) => ({
                  id: p.id,
                  name: p.name,
                  price: p.discountedPrice || p.price || 0,
                  stock: p.stockQuantity || p.stock || 0,
                  image: p.imageUrl || p.image || 'https://via.placeholder.com/100'
              })).filter((p: any) => p.stock > 0); // Chỉ hiển thị SP còn hàng
              
              setProductsList(formattedProducts);
          } catch (error) {
              console.error("Lỗi tải danh sách sản phẩm:", error);
          } finally {
              setIsLoadingProducts(false);
          }
      };
      fetchProducts();
  }, []);

  // 2. HANDLERS GIỎ HÀNG
  const handleAddToCart = (product: any) => {
    if (product.stock <= 0) {
        alert('Sản phẩm này hiện đã hết hàng!');
        return;
    }
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
        if (existing.quantity >= product.stock) {
            alert(`Sản phẩm này chỉ còn tối đa ${product.stock} trong kho!`);
            return;
        }
        setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
        setCart([...cart, { ...product, quantity: 1 }]);
    }
    setSearchQuery(''); 
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const product = productsList.find(p => p.id === id);
        let newQty = item.quantity + delta;
        if (newQty < 1) newQty = 1;
        if (product && newQty > product.stock) {
            alert(`Chỉ còn ${product.stock} sản phẩm trong kho!`);
            newQty = product.stock;
        }
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const handleApplyCoupon = () => {
      if(!couponCode.trim()) return;
      // Tạm thời mock logic coupon trên Frontend. Thực tế Backend sẽ xử lý qua CouponCode DTO
      if(couponCode.toUpperCase() === 'SALE50') {
          setDiscount(50000);
          alert('Áp dụng mã giảm giá thành công! (Mô phỏng UI)');
      } else {
          alert('Mã giảm giá không hợp lệ!');
          setDiscount(0);
      }
  };

  // Tính toán tiền
  const subTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const currentShippingFee = subTotal > 0 ? shippingFee : 0;
  const total = Math.max(0, subTotal + currentShippingFee - discount);

  // 3. XỬ LÝ SUBMIT CREATE ORDER
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return alert('Vui lòng thêm sản phẩm vào đơn hàng!');
    if (!customer.name.trim() || !customer.phone.trim() || !customer.address.trim()) {
        return alert('Vui lòng điền đầy đủ thông tin khách hàng!');
    }
    
    setIsSubmitting(true);
    
    // Map đúng số của Enum PaymentMethod
    let paymentMethodId = 0; // Mặc định 0 = COD
    if (paymentMethod === 'Ví MoMo') paymentMethodId = 1; // Momo = 1
    if (paymentMethod === 'Chuyển khoản (VNPay)') paymentMethodId = 2; // VNPay = 2

    const payload = {
        items: cart.map(item => ({
            productId: item.id,
            quantity: item.quantity
        })),
        shippingAddress: customer.address,
        shippingPhone: customer.phone,
        receiverName: customer.name,
        paymentMethod: paymentMethodId,
        notes: orderNote,
        couponCode: couponCode || null
    };

    try {
        await apiClient.post('/order', payload);
        alert('Tạo đơn hàng thành công!');
        navigate('/admin/orders');
    } catch (error: any) {
        console.error("Lỗi tạo đơn:", error);
        const errorMsg = error.response?.data?.message || 'Có lỗi xảy ra khi tạo đơn hàng.';
        alert(errorMsg);
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto font-sans">
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
                <button 
                  onClick={() => navigate('/admin/orders')}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Tạo Đơn Hàng Mới</h1>
                    <p className="text-sm text-gray-500 mt-1">Thêm sản phẩm và thông tin khách hàng</p>
                </div>
            </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* === CỘT TRÁI === */}
            <div className="lg:col-span-2 space-y-6">
                
                {/* 1. Thông tin khách hàng */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <User className="w-5 h-5 text-[#3D021E]" /> Thông tin khách hàng
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên *</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input required type="text" placeholder="Nhập tên khách hàng" 
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:border-[#3D021E] outline-none"
                                    value={customer.name} onChange={e => setCustomer({...customer, name: e.target.value})}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại *</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input required type="text" placeholder="Nhập số điện thoại" 
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:border-[#3D021E] outline-none"
                                    value={customer.phone} onChange={e => setCustomer({...customer, phone: e.target.value})}
                                />
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ giao hàng *</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                <textarea required rows={2} placeholder="Nhập địa chỉ chi tiết" 
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:border-[#3D021E] outline-none resize-none"
                                    value={customer.address} onChange={e => setCustomer({...customer, address: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Chọn sản phẩm */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-[#3D021E]" /> Sản phẩm trong đơn
                    </h2>
                    
                    {/* Thanh tìm kiếm */}
                    <div className="relative mb-6">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder={isLoadingProducts ? "Đang tải kho hàng..." : "Tìm kiếm sản phẩm theo tên..."}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:border-[#3D021E] outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            disabled={isLoadingProducts}
                        />
                        {/* Dropdown Gợi ý tìm kiếm */}
                        {searchQuery && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden max-h-60 overflow-y-auto">
                                {productsList.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).map(product => (
                                    <div key={product.id} className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0" onClick={() => handleAddToCart(product)}>
                                        <div className="flex items-center gap-3">
                                            <img src={product.image} alt={product.name} className="w-10 h-10 rounded object-cover mix-blend-multiply" />
                                            <div>
                                                <p className="text-sm font-bold text-gray-900 line-clamp-1 max-w-[200px]">{product.name}</p>
                                                <p className="text-xs text-gray-500">Kho: {product.stock}</p>
                                            </div>
                                        </div>
                                        <span className="text-sm font-bold text-[#3D021E]">{product.price.toLocaleString('vi-VN')}đ</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Danh sách đã chọn */}
                    {cart.length > 0 ? (
                        <div className="space-y-4">
                            {cart.map(item => (
                                <div key={item.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                                    <div className="flex items-center gap-4">
                                        <img src={item.image} className="w-14 h-14 rounded-lg object-cover bg-gray-50 mix-blend-multiply" />
                                        <div>
                                            <h4 className="font-bold text-sm text-gray-900 line-clamp-1 max-w-[150px] md:max-w-[250px]">{item.name}</h4>
                                            <p className="text-sm text-[#3D021E] font-medium mt-1">{item.price.toLocaleString('vi-VN')}đ</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg p-1">
                                            <button type="button" onClick={() => updateQuantity(item.id, -1)} className="w-7 h-7 flex items-center justify-center bg-white rounded shadow-sm hover:text-[#3D021E] transition-colors">-</button>
                                            <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                                            <button type="button" onClick={() => updateQuantity(item.id, 1)} className="w-7 h-7 flex items-center justify-center bg-white rounded shadow-sm hover:text-[#3D021E] transition-colors">+</button>
                                        </div>
                                        <p className="font-bold text-gray-900 w-24 text-right hidden sm:block">{(item.price * item.quantity).toLocaleString('vi-VN')}đ</p>
                                        <button type="button" onClick={() => removeFromCart(item.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                            <ShoppingBag className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">Chưa có sản phẩm nào trong đơn hàng</p>
                        </div>
                    )}
                </div>

                {/* 3. KHU VỰC GIAO HÀNG */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Truck className="w-5 h-5 text-[#3D021E]" /> Giao hàng
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Đơn vị vận chuyển</label>
                            <select
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:border-[#3D021E] outline-none"
                                value={shippingProvider}
                                onChange={(e) => setShippingProvider(e.target.value)}
                            >
                                <option value="ghtk">Giao Hàng Tiết Kiệm (GHTK)</option>
                                <option value="ghn">Giao Hàng Nhanh (GHN)</option>
                                <option value="viettel">Viettel Post</option>
                                <option value="shop">Khách nhận tại cửa hàng</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Phí giao hàng (Tạm tính UI)</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:border-[#3D021E] outline-none text-right font-medium"
                                    value={shippingFee}
                                    onChange={(e) => setShippingFee(Number(e.target.value))}
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">đ</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* === CỘT PHẢI === */}
            <div className="lg:col-span-1 space-y-6">
                
                {/* 1. Phương thức thanh toán */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-[#3D021E]" /> Thanh toán
                    </h2>
                    <div className="space-y-3">
                        {['COD', 'Chuyển khoản (VNPay)', 'Ví MoMo'].map(method => (
                            <label key={method} className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === method ? 'border-[#3D021E] bg-pink-50/30' : 'border-gray-200 hover:border-gray-300'}`}>
                                <span className="text-sm font-medium text-gray-700">{method}</span>
                                <input type="radio" name="payment" value={method} 
                                    checked={paymentMethod === method} onChange={() => setPaymentMethod(method)}
                                    className="w-4 h-4 text-[#3D021E] focus:ring-[#3D021E]"
                                />
                            </label>
                        ))}
                    </div>
                </div>

                {/* 2. Ghi chú đơn hàng */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-[#3D021E]" /> Ghi chú đơn hàng
                    </h2>
                    <textarea 
                        rows={3} 
                        placeholder="Nhập ghi chú cho đơn hàng..." 
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-[#3D021E] outline-none resize-none"
                        value={orderNote}
                        onChange={e => setOrderNote(e.target.value)}
                    />
                </div>

                {/* 3. Tổng quan & Mã Giảm Giá */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
                    <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Receipt className="w-5 h-5 text-[#3D021E]" /> Tổng quan
                    </h2>
                    
                    <div className="flex gap-2 mb-6">
                        <input 
                            type="text" 
                            placeholder="Nhập mã giảm giá..." 
                            value={couponCode}
                            onChange={e => setCouponCode(e.target.value)}
                            className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:border-[#3D021E] outline-none uppercase"
                        />
                        <button 
                            type="button" 
                            onClick={handleApplyCoupon}
                            className="px-4 py-2 bg-gray-900 text-white text-sm font-bold rounded-lg hover:bg-black transition-colors"
                        >
                            Áp dụng
                        </button>
                    </div>

                    <div className="space-y-4 text-sm mb-6">
                        <div className="flex justify-between text-gray-600">
                            <span>Tạm tính ({cart.length} sản phẩm)</span>
                            <span className="font-medium text-gray-900">{subTotal.toLocaleString('vi-VN')}đ</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Phí giao hàng</span>
                            <span className="font-medium text-gray-900">{currentShippingFee.toLocaleString('vi-VN')}đ</span>
                        </div>
                        
                        <div className="flex justify-between items-center text-gray-600">
                            <span>Giảm giá</span>
                            <div className="flex items-center gap-1">
                                <span className="text-[#E11D48]">-</span>
                                <input 
                                    type="number" 
                                    value={discount} 
                                    onChange={e => setDiscount(Number(e.target.value))} 
                                    className="w-24 text-right border-b border-gray-300 focus:border-[#3D021E] outline-none text-[#E11D48] font-medium bg-transparent"
                                />
                                <span className="text-[#E11D48] font-medium">đ</span>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 mb-6 flex justify-between items-center">
                        <span className="font-bold text-gray-900">Tổng cộng</span>
                        <span className="text-2xl font-bold text-[#E11D48]">{total.toLocaleString('vi-VN')}đ</span>
                    </div>

                    <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#3D021E] text-white font-bold rounded-xl hover:bg-[#5a032d] shadow-lg shadow-pink-200 transition-all disabled:opacity-70"
                    >
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                        {isSubmitting ? 'Đang tạo đơn...' : 'Tạo Đơn Hàng Mới'}
                    </button>
                </div>

            </div>
        </form>
      </div>
    </AdminLayout>
  );
};