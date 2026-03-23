import apiClient from './apiClient';

export const authService = {
    // Hàm xử lý đăng nhập
    login: async (email: string, password: string) => {
        try {
            const response = await apiClient.post('/auth/login', { email, password });
            
            if (response.data && response.data.isSuccess) {
                // LƯU CẢ ACCESS TOKEN LẪN REFRESH TOKEN
                localStorage.setItem('accessToken', response.data.token.accessToken);
                localStorage.setItem('refreshToken', response.data.token.refreshToken);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            return response.data;
        } catch (error: any) {
            throw error.response?.data || { message: "Có lỗi xảy ra khi đăng nhập" };
        }
    },

    // đăng ký
    register: async (userData: { email: string; password: string; confirmPassword: string; fullName: string; phoneNumber: string }) => {
        try {
            const response = await apiClient.post('/auth/register', userData);
            
            if (response.data && response.data.isSuccess && response.data.token) {
                // LƯU CẢ ACCESS TOKEN LẪN REFRESH TOKEN
                localStorage.setItem('accessToken', response.data.token.accessToken);
                localStorage.setItem('refreshToken', response.data.token.refreshToken);
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
        window.location.href = '/login'; // Ép văng ra trang login luôn cho an toàn
    },
    
    // Lấy thông tin user hiện tại
    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        if (userStr) return JSON.parse(userStr);
        return null;
    },

    // đổi mật khẩu user
    changePassword: async (data: { currentPassword: string, newPassword: string, confirmNewPassword: string }) => {
        try {
            const response = await apiClient.post('/Auth/change-password', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};