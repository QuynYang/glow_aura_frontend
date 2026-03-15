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
    }
};