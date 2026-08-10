import { useEffect } from 'react';
import { getMergedReturnSearchParams } from '../../utils/payOsReturnParams';

/**
 * PayOS redirect thường gắn ?code=00&status=PAID vào URL trước dấu #.
 * Component này chuyển sang route #/payment-result kèm đủ tham số.
 */
export function PayOsReturnRedirect() {
  useEffect(() => {
    const merged = getMergedReturnSearchParams();
    const hasPayOsParams =
      merged.has('status') || merged.has('code') || merged.has('orderCode');

    if (!hasPayOsParams) {
      return;
    }

    if (window.location.hash.includes('/payment-result')) {
      return;
    }

    const base = import.meta.env.BASE_URL || '/';
    const normalizedBase = base.endsWith('/') ? base : `${base}/`;
    const qs = merged.toString();
    const target = `${window.location.origin}${normalizedBase}#/payment-result${qs ? `?${qs}` : ''}`;
    window.location.replace(target);
  }, []);

  return null;
}
