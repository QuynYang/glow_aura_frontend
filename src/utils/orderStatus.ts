/** Cổng thanh toán được bật cho demo đồ án (Part E). */
export const ENABLED_PAYMENT_METHODS = ['COD', 'PayOS'] as const;

export const DISABLED_PAYMENT_STUBS = ['Momo', 'VNPay', 'ZaloPay', 'BankTransfer'] as const;

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  COD: 'Thanh toán khi nhận hàng',
  PayOS: 'PayOS (QR / Chuyển khoản)',
  Momo: 'MoMo (chưa tích hợp)',
  VNPay: 'VNPay (chưa tích hợp)',
  ZaloPay: 'ZaloPay (chưa tích hợp)',
  BankTransfer: 'Chuyển khoản (chưa tích hợp)',
};

/** Phí ship đồng bộ với BE: miễn phí từ 500k. */
export function calculateShippingFee(subTotal: number): number {
  return subTotal >= 500_000 ? 0 : 30_000;
}

export type OrderLike = {
  status?: string | number;
  statusDescription?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  paidAt?: string | null;
};

export function isOrderPaid(order: OrderLike): boolean {
  const ps = String(order.paymentStatus ?? '').toLowerCase();
  return ps === 'paid' || !!order.paidAt;
}

export function isOnlinePaymentMethod(method?: string): boolean {
  return method != null && method !== 'COD';
}

/** Nhãn hiển thị kết hợp fulfillment + payment (Part F). */
export function getOrderDisplayStatus(order: OrderLike): string {
  if (order.statusDescription) return order.statusDescription;

  const status = String(order.status ?? 'Pending');
  const isCod = order.paymentMethod === 'COD';
  const isPaid = isOrderPaid(order);
  const isFailed = String(order.paymentStatus ?? '').toLowerCase() === 'paymentfailed';

  if (status === 'Pending') {
    if (isFailed) return 'Thanh toán thất bại';
    if (isPaid && !isCod) return 'Đã thanh toán, chờ duyệt';
    if (!isCod) return 'Chờ thanh toán';
    return 'Chờ xác nhận (COD)';
  }

  const labels: Record<string, string> = {
    Confirmed: 'Đã xác nhận (COD)',
    Paid: 'Đã thanh toán, chờ duyệt',
    Processing: 'Đang xử lý',
    Shipping: 'Đang giao hàng',
    Delivered: 'Đã giao hàng',
    Completed: 'Hoàn thành',
    Cancelled: 'Đã hủy',
    Refunded: 'Đã hoàn tiền',
    PaymentFailed: 'Thanh toán thất bại',
  };

  return labels[status] ?? status;
}

export type OrderFilterKey =
  | 'all'
  | 'awaiting_payment'
  | 'awaiting_approval'
  | 'confirmed'
  | 'processing'
  | 'shipping'
  | 'delivered'
  | 'cancelled'
  | 'payment_failed';

export function getOrderFilterKey(order: OrderLike): OrderFilterKey {
  const status = String(order.status ?? 'Pending');
  const isCod = order.paymentMethod === 'COD';
  const isPaid = isOrderPaid(order);
  const isFailed = String(order.paymentStatus ?? '').toLowerCase() === 'paymentfailed';

  if (status === 'Cancelled') return 'cancelled';
  if (isFailed || status === 'PaymentFailed') return 'payment_failed';
  if (status === 'Pending' && isPaid && !isCod) return 'awaiting_approval';
  if (status === 'Pending' && !isPaid && !isCod) return 'awaiting_payment';
  if (status === 'Pending' && isCod) return 'awaiting_payment';
  if (status === 'Confirmed') return 'confirmed';
  if (status === 'Processing' || status === 'Paid') return 'processing';
  if (status === 'Shipping') return 'shipping';
  if (status === 'Delivered' || status === 'Completed') return 'delivered';
  return 'all';
}

export function getStatusBadgeColor(displayStatus: string): string {
  if (displayStatus.includes('thất bại') || displayStatus.includes('Hủy')) {
    return 'bg-red-100 text-red-700';
  }
  if (displayStatus.includes('chờ duyệt') || displayStatus.includes('Đã thanh toán')) {
    return 'bg-indigo-100 text-indigo-700';
  }
  if (displayStatus.includes('Chờ thanh toán')) {
    return 'bg-orange-100 text-orange-700';
  }
  if (displayStatus.includes('Chờ xác nhận') || displayStatus.includes('Đã xác nhận')) {
    return 'bg-yellow-100 text-yellow-700';
  }
  if (displayStatus.includes('Đang xử lý') || displayStatus.includes('đóng gói')) {
    return 'bg-yellow-100 text-yellow-700';
  }
  if (displayStatus.includes('giao')) {
    return 'bg-blue-100 text-blue-700';
  }
  if (displayStatus.includes('Hoàn thành') || displayStatus.includes('Đã giao')) {
    return 'bg-green-100 text-green-700';
  }
  return 'bg-gray-100 text-gray-700';
}
