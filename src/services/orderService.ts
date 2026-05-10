import apiClient from './apiClient';

export const orderService = {
  createOrder: async (orderData: Record<string, unknown>) => {
    const response = await apiClient.post('/order', orderData);
    return response.data;
  },

  getOrderById: async (id: string | number) => {
    const response = await apiClient.get(`/order/${id}`);
    return response.data;
  },

  getMyOrders: async () => {
    const response = await apiClient.get('/order/my-orders');
    return response.data;
  },

  cancelOrder: async (id: string | number, reason: string = 'Khách hàng yêu cầu hủy') => {
    const response = await apiClient.post(`/order/${id}/cancel`, { reason });
    return response.data;
  },

  payOrder: async (
    id: string | number,
    payload: { paymentMethod: number; returnUrl?: string }
  ) => {
    const response = await apiClient.post(`/order/${id}/pay`, payload);
    return response.data;
  },

  /** Admin / Staff */
  getAllOrders: async (params?: { page?: number; pageSize?: number; status?: string }) => {
    const response = await apiClient.get('/order', { params });
    return response.data;
  },

  getOrderStats: async () => {
    const response = await apiClient.get('/order/stats');
    return response.data;
  },
};