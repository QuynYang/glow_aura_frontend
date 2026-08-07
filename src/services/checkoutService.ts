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
};

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
