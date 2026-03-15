
import apiClient from './apiClient';

export const authService = {
    // Hàm xử lý đăng nhập
    login: async (email: string, password: string) => {
        try {
            const response = await apiClient.post('/auth/login', { email, password });
            
            if (response.data && response.data.isSuccess) {
                // Lưu token và thông tin user vào localStorage
                localStorage.setItem('accessToken', response.data.token.accessToken);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            return response.data;
        } catch (error: any) {
            // Trả về lỗi từ backend (nếu có) hoặc lỗi mặc định
            throw error.response?.data || { message: "Có lỗi xảy ra khi đăng nhập" };
        }
    },


    // đăng ký
    
    register: async (userData: { email: string; password: string; confirmPassword: string; fullName: string; phoneNumber: string }) => {
        try {
            const response = await apiClient.post('/auth/register', userData);
            
            // đăng ký thành công cũng trả về token luôn
            if (response.data && response.data.isSuccess && response.data.token) {
                localStorage.setItem('accessToken', response.data.token.accessToken);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            return response.data;
        } catch (error: any) {
            throw error.response?.data || { message: "Có lỗi xảy ra khi đăng ký" };
        }
    },


    // Hàm xử lý đăng xuất
    logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        // Chuyển hướng về trang đăng nhập hoặc trang chủ sẽ được xử lý ở UI
    },
    
    // Lấy thông tin user hiện tại
    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        if (userStr) return JSON.parse(userStr);
        return null;
    }
};