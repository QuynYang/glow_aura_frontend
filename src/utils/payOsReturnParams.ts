/** Gộp query PayOS (trước #) và query trong hash route (#/payment-result?...). */
export function getMergedReturnSearchParams(): URLSearchParams {
  const merged = new URLSearchParams(window.location.search);

  const hash = window.location.hash;
  const queryStart = hash.indexOf('?');
  if (queryStart >= 0) {
    const hashQuery = new URLSearchParams(hash.slice(queryStart + 1));
    hashQuery.forEach((value, key) => {
      if (!merged.has(key)) {
        merged.set(key, value);
      }
    });
  }

  return merged;
}

/** PayOS redirect về returnUrl kèm code=00 & status=PAID khi khách đã trả tiền. */
export function isPayOsReturnPaid(params: URLSearchParams): boolean {
  const code = params.get('code');
  const status = params.get('status')?.toUpperCase();
  const cancel = params.get('cancel')?.toLowerCase();
  return code === '00' && status === 'PAID' && cancel !== 'true';
}

export function isPayOsReturnCancelled(params: URLSearchParams): boolean {
  return params.get('cancel')?.toLowerCase() === 'true';
}

export function parsePayOsOrderCode(params: URLSearchParams): number | undefined {
  const raw = params.get('orderCode');
  if (!raw) return undefined;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : undefined;
}

/** orderId từ query (PayOS thường gắn trước #) hoặc trong hash route. */
export function getReturnOrderId(params: URLSearchParams): string | undefined {
  return params.get('orderId') ?? undefined;
}
