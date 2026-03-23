import apiClient from './apiClient';

export const productService = {
    // Lấy tất cả sản phẩm
    getAll: async () => {
        try {
            const response = await apiClient.get('/products');
            return response.data;
        } catch (error) {
            console.error("Lỗi khi lấy danh sách sản phẩm:", error);
            throw error;
        }
    },
    
    getById: async (id: string | number) => {
        try {
            const response = await apiClient.get(`/products/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Lỗi khi lấy thông tin sản phẩm có ID ${id}:`, error);
            throw error;
        }
    },

    // Lọc và tìm kiếm nâng cao
    advancedSearch: async (searchParams: any) => {
    try {
      const response = await apiClient.post('/Products/advanced-search', searchParams);
      return response.data?.data || response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy danh sách danh mục (Để render ra Sidebar)
  getCategories: async () => {
    try {
      const response = await apiClient.get('/Products/categories');
      return response.data?.data || response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy danh sách Flash Sale
  getFlashSale: async () => {
    try {
      const response = await apiClient.get('/Products/flash-sale');
      return response.data?.data || response.data;
    } catch (error) {
      throw error;
    }
  },

};