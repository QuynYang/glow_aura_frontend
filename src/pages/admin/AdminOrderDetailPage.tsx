import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronRight, Printer, CheckCircle, ArrowLeft } from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';

export const AdminOrderDetailPage = () => {
  const { id } = useParams(); // Lấy ID đơn hàng từ URL
  const navigate = useNavigate();

  // --- MOCK DATA (Giả lập dữ liệu fetch từ API dựa vào ID) ---
  const orderData = {
    id: id || '#ORD-7732',
    date: '24 Tháng 10, 2023 lúc 14:30',
    customer: {
      name: 'Nguyễn Văn An',
      address: '123 Đường Lê Lợi, Phường Bến Thành, Quận 1, TP.HCM',
      phone: '(+84) 90 123 4567'
    },
    items: [
      { id: 1, name: 'Serum Phục Hồi Glow', price: 1450000, quantity: 1, total: 1450000, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=100' },
      { id: 2, name: 'Kem Dưỡng Ẩm Midnight', price: 890000, quantity: 1, total: 890000, image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?q=80&w=100' }
    ],
    subtotal: 2340000,
    shipping: 30000,
    total: 2370000,
    paymentStatus: true, // true = Đã xác nhận, false = Chưa
    orderStatus: 'shipped', // 'pending', 'shipped', 'delivered'
    notes: ''
  };

  // States quản lý thao tác
  const [paymentConfirmed, setPaymentConfirmed] = useState(orderData.paymentStatus);
  const [internalNotes, setInternalNotes] = useState(orderData.notes);
  const [currentStatus, setCurrentStatus] = useState(orderData.orderStatus);

  // Logic hiển thị thanh Progress (Trạng thái đơn hàng)
  const getStatusProgress = () => {
    switch (currentStatus) {
      case 'pending': return { width: '33%', label: 'Đang xử lý' };
      case 'shipped': return { width: '66%', label: 'Đang giao hàng' };
      case 'delivered': return { width: '100%', label: 'Đã giao thành công' };
      default: return { width: '0%', label: 'Chưa rõ' };
    }
  };

  return (
    <AdminLayout>
      
      {/* 1. BREADCRUMBS & NÚT QUAY LẠI */}
      <div className="mb-6">
        <button 
            onClick={() => navigate('/admin/orders')}
            className="flex items-center gap-2 text-gray-500 hover:text-[#3D021E] transition-colors text-sm font-medium mb-4"
        >
            <ArrowLeft className="w-4 h-4" /> Quay lại danh sách
        </button>
        <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/admin/orders" className="hover:text-gray-900">Đơn hàng</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#E11D48] font-medium">{orderData.id}</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900">Chi tiết</span>
        </div>
      </div>

      {/* 2. HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Đơn hàng {orderData.id}</h1>
        <p className="text-sm text-gray-500">Đặt lúc {orderData.date}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
        {/* === CỘT TRÁI (Nội dung chính) === */}
        <div className="lg:col-span-2 space-y-8">
            
            {/* THÔNG TIN KHÁCH HÀNG */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Thông Tin Khách Hàng</h3>
                <div className="space-y-4">
                    <div className="flex items-start border-b border-gray-50 pb-4">
                        <span className="w-32 text-sm text-gray-500">Họ tên</span>
                        <span className="flex-1 text-sm font-medium text-gray-900">{orderData.customer.name}</span>
                    </div>
                    <div className="flex items-start border-b border-gray-50 pb-4">
                        <span className="w-32 text-sm text-gray-500">Địa chỉ</span>
                        <span className="flex-1 text-sm font-medium text-gray-900 leading-relaxed">{orderData.customer.address}</span>
                    </div>
                    <div className="flex items-start">
                        <span className="w-32 text-sm text-gray-500">Số điện thoại</span>
                        <span className="flex-1 text-sm font-medium text-gray-900">{orderData.customer.phone}</span>
                    </div>
                </div>
            </div>

            {/* CHI TIẾT SẢN PHẨM */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Chi Tiết Sản Phẩm</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-600 font-medium rounded-lg">
                            <tr>
                                <th className="px-4 py-3 rounded-l-lg">Sản phẩm</th>
                                <th className="px-4 py-3">Số lượng</th>
                                <th className="px-4 py-3">Đơn giá</th>
                                <th className="px-4 py-3 rounded-r-lg text-right">Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {orderData.items.map((item) => (
                                <tr key={item.id}>
                                    <td className="px-4 py-4 flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-md bg-gray-100 border border-gray-200 overflow-hidden">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <span className="font-medium text-gray-900">{item.name}</span>
                                    </td>
                                    <td className="px-4 py-4 text-[#E11D48] font-medium">{item.quantity}</td>
                                    <td className="px-4 py-4 text-gray-600">{item.price.toLocaleString('vi-VN')}đ</td>
                                    <td className="px-4 py-4 text-right font-medium text-gray-900">{item.total.toLocaleString('vi-VN')}đ</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="border-t border-gray-100">
                            <tr>
                                <td colSpan={3} className="px-4 py-3 text-right text-gray-500">Tạm tính</td>
                                <td className="px-4 py-3 text-right font-medium text-gray-900">{orderData.subtotal.toLocaleString('vi-VN')}đ</td>
                            </tr>
                            <tr>
                                <td colSpan={3} className="px-4 py-3 text-right text-gray-500">Phí vận chuyển</td>
                                <td className="px-4 py-3 text-right font-medium text-gray-900">{orderData.shipping.toLocaleString('vi-VN')}đ</td>
                            </tr>
                            <tr>
                                <td colSpan={3} className="px-4 py-4 text-right font-bold text-gray-900 text-base">Tổng cộng</td>
                                <td className="px-4 py-4 text-right font-bold text-[#E11D48] text-lg">{orderData.total.toLocaleString('vi-VN')}đ</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            {/* TRẠNG THÁI THANH TOÁN & GIAO HÀNG */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-8">
                
                {/* Thanh toán */}
                <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Trạng Thái Thanh Toán</h3>
                    <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl bg-gray-50">
                        <span className="text-sm font-medium text-gray-700">Xác nhận đã thanh toán</span>
                        {/* Custom Toggle Switch */}
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                className="sr-only peer" 
                                checked={paymentConfirmed}
                                onChange={() => setPaymentConfirmed(!paymentConfirmed)}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                        </label>
                    </div>
                </div>

                {/* Giao hàng (Progress bar) */}
                <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Trạng Thái Giao Hàng</h3>
                    <div className="mb-2">
                        <div className="w-full h-2 bg-pink-100 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-black transition-all duration-500 ease-out" 
                                style={{ width: getStatusProgress().width }}
                            ></div>
                        </div>
                    </div>
                    <p className="text-sm font-medium text-[#E11D48]">{getStatusProgress().label}</p>
                </div>

                {/* Nút hành động */}
                <div className="pt-6 flex justify-end gap-4 border-t border-gray-100">
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors text-sm">
                        <Printer className="w-4 h-4" /> In hóa đơn
                    </button>
                    <button 
                        onClick={() => setCurrentStatus('delivered')}
                        className="flex items-center gap-2 px-6 py-2.5 bg-[#E11D48] text-white font-bold rounded-lg hover:bg-[#BE123C] shadow-md shadow-red-200 transition-all text-sm"
                    >
                        <CheckCircle className="w-4 h-4" /> Đánh dấu Đã Giao
                    </button>
                </div>
            </div>

        </div>

        {/* === CỘT PHẢI (Ghi chú) === */}
        <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Ghi Chú Nội Bộ</h3>
                <textarea 
                    rows={6}
                    placeholder="Thêm ghi chú về đơn hàng này (Khách hàng không nhìn thấy)..."
                    value={internalNotes}
                    onChange={(e) => setInternalNotes(e.target.value)}
                    className="w-full px-4 py-3 bg-pink-50/30 border border-pink-100 rounded-xl text-sm focus:outline-none focus:border-[#E11D48] focus:ring-1 focus:ring-[#E11D48] transition-colors resize-none placeholder-pink-300 text-gray-700"
                ></textarea>
                <button className="w-full mt-4 px-4 py-2 bg-white border border-gray-200 text-gray-700 font-bold text-sm rounded-lg hover:bg-gray-50 transition-colors">
                    Lưu Ghi Chú
                </button>
            </div>
        </div>

      </div>
    </AdminLayout>
  );
};