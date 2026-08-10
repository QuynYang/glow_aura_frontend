/** URL trang kết quả thanh toán — orderId đặt trước # để PayOS không làm mất khi redirect. */
export function buildPaymentResultUrl(orderId?: string): string {
  const base = `${window.location.origin}${import.meta.env.BASE_URL}`;
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  const hashRoute = '#/payment-result';

  if (!orderId) {
    return `${normalizedBase}${hashRoute}`;
  }

  return `${normalizedBase}?orderId=${encodeURIComponent(orderId)}${hashRoute}`;
}
