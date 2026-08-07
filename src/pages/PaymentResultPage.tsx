import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { orderService } from '../services/orderService';

type VerifyState = 'loading' | 'success' | 'failed' | 'pending';

function isPaidOnServer(order: Record<string, unknown> | null | undefined): boolean {
  if (!order) return false;
  const paymentStatus = String(order.paymentStatus ?? order.PaymentStatus ?? '').toLowerCase();
  if (paymentStatus === 'paid') return true;
  return !!(order.paidAt ?? order.PaidAt);
}

function isFailedOnServer(order: Record<string, unknown> | null | undefined): boolean {
  if (!order) return false;
  const paymentStatus = String(order.paymentStatus ?? order.PaymentStatus ?? '').toLowerCase();
  return paymentStatus === 'paymentfailed' || String(order.status ?? order.Status) === 'Cancelled';
}

export const PaymentResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const orderId = query.get('orderId');

  const [verifyState, setVerifyState] = useState<VerifyState>('loading');
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!orderId) {
      setVerifyState('failed');
      return;
    }

    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 8;

    const verify = async () => {
      try {
        const response = await orderService.getOrderById(orderId);
        const order = (response?.data ?? response) as Record<string, unknown>;
        if (cancelled) return;

        setOrderNumber(String(order.orderNumber ?? order.OrderNumber ?? ''));

        if (isPaidOnServer(order)) {
          setVerifyState('success');
          return;
        }

        if (isFailedOnServer(order)) {
          setVerifyState('failed');
          return;
        }

        attempts += 1;
        if (attempts < maxAttempts) {
          setVerifyState('pending');
          setTimeout(verify, 2000);
        } else {
          setVerifyState('failed');
        }
      } catch {
        if (!cancelled) setVerifyState('failed');
      }
    };

    void verify();
    return () => {
      cancelled = true;
    };
  }, [orderId]);

  const isSuccess = verifyState === 'success';
  const isLoading = verifyState === 'loading' || verifyState === 'pending';

  return (
    <MainLayout>
      <div className="bg-[#FDFBFB] min-h-screen py-16">
        <div className="container mx-auto px-4 max-w-[800px]">
          <div className="bg-white rounded-[2rem] p-10 border border-gray-100 shadow-sm text-center">
            <div className="flex justify-center mb-6">
              {isLoading ? (
                <Loader2 className="w-16 h-16 text-[#3D021E] animate-spin" />
              ) : isSuccess ? (
                <CheckCircle2 className="w-16 h-16 text-green-600" />
              ) : (
                <XCircle className="w-16 h-16 text-red-600" />
              )}
            </div>
            <h1 className="text-3xl font-bold mb-3">
              {isLoading
                ? 'Đang xác minh thanh toán...'
                : isSuccess
                  ? 'Thanh toán thành công'
                  : 'Thanh toán chưa hoàn tất'}
            </h1>
            <p className="text-gray-600 mb-2">
              {isLoading
                ? 'Hệ thống đang kiểm tra trạng thái đơn hàng với máy chủ. Vui lòng đợi trong giây lát.'
                : isSuccess
                  ? `Đơn hàng ${orderNumber ? `#${orderNumber}` : ''} đã được ghi nhận thanh toán.`
                  : 'Giao dịch chưa được xác nhận thanh toán. Bạn có thể thử lại từ chi tiết đơn hàng.'}
            </p>
            {!isLoading && (
              <p className="text-xs text-gray-400 mb-8">
                Trạng thái hiển thị dựa trên dữ liệu từ hệ thống, không chỉ tham số URL.
              </p>
            )}
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
