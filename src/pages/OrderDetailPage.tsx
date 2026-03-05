import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package } from 'lucide-react';
import { MainLayout } from '../components/layout/MainLayout';

export const OrderDetailPage = () => {
  // Lấy ID đơn hàng từ URL (Ví dụ: /profile/orders/ORD-88291 -> id = ORD-88291)
  const { id } = useParams(); 
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="bg-[#FDFBFB] min-h-[70vh] flex flex-col items-center justify-center py-20 px-4">
        
        {/* Khối chờ thiết kế */}
        <div className="bg-white p-12 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col items-center text-center max-w-lg w-full animate-in fade-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-pink-50/50 rounded-full flex items-center justify-center mb-6">
                <Package className="w-10 h-10 text-[#3D021E] opacity-80" />
            </div>
            
            <h1 className="text-3xl font-serif font-bold text-gray-900 mb-3">Chi tiết đơn hàng</h1>
            <p className="text-gray-500 mb-2">
                Mã đơn hàng: <span className="font-bold text-[#3D021E] uppercase">{id || 'ĐANG CẬP NHẬT'}</span>
            </p>
            
            <p className="text-gray-500 mb-10 leading-relaxed text-sm">
                Giao diện chi tiết của đơn hàng này sẽ được hiển thị tại đây sau khi có bản thiết kế chính thức.
            </p>
            
            <button 
                onClick={() => navigate(-1)} // Quay lại trang trước đó (Lịch sử hoặc Đặt hàng TC)
                className="bg-[#3D021E] text-white px-8 py-3.5 rounded-full text-sm font-bold hover:bg-[#5a032d] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2"
            >
                <ArrowLeft className="w-4 h-4" /> Quay lại
            </button>
        </div>

      </div>
    </MainLayout>
  );
};