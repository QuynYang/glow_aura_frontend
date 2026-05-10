import apiClient from './apiClient';

export const userService = {
  // Lấy thông tin cá nhân
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get('/user/me');
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Lỗi khi lấy thông tin người dùng:', error);
      throw error;
    }
  },

  // Cập nhật thông tin cá nhân
  updateProfile: async (userData: any) => {
    try {
      const response = await apiClient.put('/user/me', userData);
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin:', error);
      throw error;
    }
  },

  // Lấy điểm tích lũy và hạng thành viên
  getLoyaltyPoints: async () => {
    try {
      const response = await apiClient.get('/user/me/loyalty');
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Lỗi khi lấy điểm loyalty:', error);
      throw error;
    }
  }
};