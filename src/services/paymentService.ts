import apiClient from './apiClient';

export type ConfirmPayOsReturnPayload = {
  orderId?: string;
  orderCode?: number;
};

export type ConfirmPayOsReturnResponse = {
  isSuccess: boolean;
  message?: string;
  orderId?: string;
  orderNumber?: string;
  paymentStatus?: string;
};

export const paymentService = {
  /** Đồng bộ trạng thái Paid từ PayOS sau khi khách quay về returnUrl (webhook có thể trễ). */
  confirmPayOsReturn: async (
    payload: ConfirmPayOsReturnPayload,
  ): Promise<ConfirmPayOsReturnResponse> => {
    const response = await apiClient.post('/payments/payos/confirm-return', payload);
    return response.data;
  },
};
