import apiClient from './apiClient';

export type CheckoutItemPayload = {
  productId: string;
  quantity: number;
};

export type CheckoutPayload = {
  items: CheckoutItemPayload[];
  shippingAddress: string;
  shippingPhone: string;
  receiverName: string;
  paymentMethod: string;
  couponCode?: string | null;
  notes?: string | null;
  returnUrl?: string;
  cancelUrl?: string;
};

export type CheckoutPreviewResponse = {
  isValid?: boolean;
  subTotal?: number;
  shippingFee?: number;
  totalDiscount?: number;
  totalAmount?: number;
  warnings?: string[];
  itemDetails?: Array<{
    productId: string;
    productName: string;
    appliedDiscounts?: string[];
  }>;
};

export type CheckoutResultResponse = {
  isSuccess: boolean;
  message?: string;
  orderId?: string;
  orderNumber?: string;
  totalAmount?: number;
  paymentUrl?: string;
  /** ASP.NET có thể trả PascalCase nếu chưa cấu hình camelCase */
  PaymentUrl?: string;
};

/** Chuẩn hóa field từ API (camelCase hoặc PascalCase). */
export function getCheckoutPaymentUrl(result: CheckoutResultResponse | null | undefined): string | undefined {
  const url = result?.paymentUrl ?? result?.PaymentUrl;
  return typeof url === 'string' && url.trim().length > 0 ? url.trim() : undefined;
}

export function getCheckoutOrderId(result: CheckoutResultResponse | null | undefined): string | undefined {
  const id = result?.orderId ?? (result as { OrderId?: string })?.OrderId;
  return typeof id === 'string' && id.length > 0 ? id : undefined;
}

export const checkoutService = {
  preview: async (payload: CheckoutPayload): Promise<CheckoutPreviewResponse> => {
    const response = await apiClient.post('/checkout/preview', payload);
    return response.data?.data ?? response.data;
  },

  checkout: async (payload: CheckoutPayload): Promise<CheckoutResultResponse> => {
    const response = await apiClient.post('/checkout', payload);
    return response.data?.data ?? response.data;
  },
};
