import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { orderService } from '../services/orderService';
import { paymentService } from '../services/paymentService';
import {
  getMergedReturnSearchParams,
  getReturnOrderId,
  isPayOsReturnCancelled,
  isPayOsReturnPaid,
  parsePayOsOrderCode,
} from '../utils/payOsReturnParams';

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
  const navigate = useNavigate();
  const returnParams = useMemo(() => getMergedReturnSearchParams(), []);
  const orderId = getReturnOrderId(returnParams);
  const orderCode = parsePayOsOrderCode(returnParams);
  const payOsPaid = isPayOsReturnPaid(returnParams);
  const payOsCancelled = isPayOsReturnCancelled(returnParams);

  const [verifyState, setVerifyState] = useState<VerifyState>('loading');
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [syncNote, setSyncNote] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (payOsCancelled) {
      setVerifyState('failed');
      return;
    }

    if (!orderId && !orderCode && !payOsPaid) {
      setVerifyState('failed');
      return;
    }

    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 8;

    const loadOrderNumber = async (id: string) => {
      try {
        const response = await orderService.getOrderById(id);
        const order = (response?.data ?? response) as Record<string, unknown>;
        setOrderNumber(String(order.orderNumber ?? order.OrderNumber ?? ''));
      } catch {
        /* optional */
      }
    };

    const syncWithBackend = async (): Promise<boolean> => {
      try {
        const result = await paymentService.confirmPayOsReturn({
          orderId,
          orderCode,
        });
        if (result.orderNumber) {
          setOrderNumber(result.orderNumber);
        }
        if (result.isSuccess) {
          setSyncNote(null);
          return true;
        }
        if (payOsPaid) {
          setSyncNote(
            'PayOS đã xác nhận thanh toán. Hệ thống đang đồng bộ — bạn không cần thanh toán lại.',
          );
        }
        return false;
      } catch {
        if (payOsPaid) {
          setSyncNote(
            'PayOS đã xác nhận thanh toán. Hệ thống đang đồng bộ — bạn không cần thanh toán lại.',
          );
        }
        return false;
      }
    };

    const verify = async () => {
      if (cancelled) return;

      if (payOsPaid) {
        setVerifyState('success');
        if (orderId) {
          void loadOrderNumber(orderId);
        }
        void syncWithBackend();
        return;
      }

      if (!orderId) {
        setVerifyState('failed');
        return;
      }

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
        if (attempts === 1) {
          const synced = await syncWithBackend();
          if (synced && !cancelled) {
            setVerifyState('success');
            return;
          }
        }

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
  }, [orderId, orderCode, payOsPaid, payOsCancelled]);

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
                  ? 'Thanh toán thành công!'
                  : payOsCancelled
                    ? 'Bạn đã hủy thanh toán'
                    : 'Thanh toán chưa hoàn tất'}
            </h1>
            <p className="text-gray-600 mb-2">
              {isLoading
                ? 'Hệ thống đang xác nhận giao dịch với PayOS và cập nhật đơn hàng.'
                : isSuccess
                  ? `Cảm ơn bạn! Giao dịch PayOS đã thành công${orderNumber ? ` cho đơn #${orderNumber}` : ''}. Shop sẽ xác nhận và giao hàng sớm — bạn không cần thanh toán lại.`
                  : payOsCancelled
                    ? 'Đơn hàng vẫn được lưu. Bạn có thể thanh toán lại từ chi tiết đơn hàng.'
                    : 'Giao dịch chưa được xác nhận. Bạn có thể thử lại từ chi tiết đơn hàng.'}
            </p>
            {syncNote && isSuccess && (
              <p className="text-sm text-amber-700 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mb-4">
                {syncNote}
              </p>
            )}
            {!isLoading && (
              <p className="text-xs text-gray-400 mb-8">
                {isSuccess
                  ? 'Trạng thái "Chờ duyệt" là bước xử lý đơn của shop — không có nghĩa là tiền chưa được trừ.'
                  : 'Nếu đã bị trừ tiền mà vẫn thấy lỗi, hãy chụp màn hình và liên hệ hỗ trợ kèm mã đơn hàng.'}
              </p>
            )}
            <div className="flex justify-center gap-4 flex-wrap">
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
