import { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { CheckCircle2, XCircle } from 'lucide-react';

function isSuccessFromQuery(search: URLSearchParams) {
  const vnp = search.get('vnp_ResponseCode');
  const momo = search.get('resultCode');
  const status = search.get('status');
  if (vnp) return vnp === '00';
  if (momo) return momo === '0';
  if (status) return status.toLowerCase() === 'success' || status === '1';
  return false;
}

export const PaymentResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const orderId = query.get('orderId');
  const isSuccess = isSuccessFromQuery(query);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <MainLayout>
      <div className="bg-[#FDFBFB] min-h-screen py-16">
        <div className="container mx-auto px-4 max-w-[800px]">
          <div className="bg-white rounded-[2rem] p-10 border border-gray-100 shadow-sm text-center">
            <div className="flex justify-center mb-6">
              {isSuccess ? (
                <CheckCircle2 className="w-16 h-16 text-green-600" />
              ) : (
                <XCircle className="w-16 h-16 text-red-600" />
              )}
            </div>
            <h1 className="text-3xl font-bold mb-3">{isSuccess ? 'Thanh toán thành công' : 'Thanh toán thất bại'}</h1>
            <p className="text-gray-600 mb-8">
              {isSuccess
                ? 'Đơn hàng đã được ghi nhận thanh toán. Bạn có thể theo dõi trạng thái ngay bây giờ.'
                : 'Giao dịch chưa thành công. Bạn có thể quay lại chi tiết đơn hàng để thử lại hoặc đổi phương thức.'}
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => navigate(orderId ? `/profile/orders/${orderId}` : '/profile/orders')}
                className="bg-[#3D021E] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#5a032d]"
              >
                Về chi tiết đơn hàng
              </button>
              <button
                onClick={() => navigate('/profile/orders')}
                className="border border-gray-200 px-6 py-3 rounded-xl font-bold text-gray-700 hover:bg-gray-50"
              >
                Lịch sử đơn hàng
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
