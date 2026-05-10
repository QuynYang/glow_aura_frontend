import apiClient from './apiClient';

export type CheckoutItemPayload = {
  productId: number;
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
};

export const checkoutService = {
  preview: async (payload: CheckoutPayload) => {
    const response = await apiClient.post('/checkout/preview', payload);
    return response.data;
  },

  checkout: async (payload: CheckoutPayload) => {
    const response = await apiClient.post('/checkout', payload);
    return response.data;
  },
};
