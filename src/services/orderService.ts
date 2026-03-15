import apiClient from './apiClient';

export const orderService = {
  // Gửi dữ liệu tạo đơn hàng mới
  createOrder: async (orderData: any) => {
    try {
      const response = await apiClient.post('/Order', orderData);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi tạo đơn hàng:', error);
      throw error;
    }
  },

  // Lấy chi tiết một đơn hàng theo ID
  getOrderById: async (id: string | number) => {
    try {
      const response = await apiClient.get(`/Order/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi lấy đơn hàng ${id}:`, error);
      throw error;
    }
  }
};