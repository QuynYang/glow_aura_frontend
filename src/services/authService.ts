import apiClient from './apiClient';

const USER_KEY = 'user';

/** Dữ liệu user lưu localStorage sau login (camelCase từ API) */
export type StoredUser = {
  id?: number;
  email?: string;
  fullName?: string;
  role?: string;
  vipLevel?: string | number;
  phoneNumber?: string;
  address?: string;
  avatarUrl?: string;
  [key: string]: unknown;
};

function persistSession(data: { token?: { accessToken: string; refreshToken: string }; user?: unknown }) {
    if (data.token) {
        localStorage.setItem('accessToken', data.token.accessToken);
        localStorage.setItem('refreshToken', data.token.refreshToken);
    }
    if (data.user) {
        const json = JSON.stringify(data.user);
        localStorage.setItem(USER_KEY, json);
        localStorage.setItem('glow_user', json);
    }
}

export const authService = {
    login: async (email: string, password: string) => {
        try {
            const response = await apiClient.post('/auth/login', { email, password });

            if (response.data?.isSuccess && response.data.token) {
                persistSession(response.data);
            }
            return response.data;
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            throw err.response?.data || { message: 'Có lỗi xảy ra khi đăng nhập' };
        }
    },

    register: async (userData: {
        email: string;
        password: string;
        confirmPassword: string;
        fullName: string;
        phoneNumber: string;
    }) => {
        try {
            const response = await apiClient.post('/auth/register', userData);

            if (response.data?.isSuccess && response.data.token) {
                persistSession(response.data);
            }
            return response.data;
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            throw err.response?.data || { message: 'Có lỗi xảy ra khi đăng ký' };
        }
    },

    logout: async () => {
        try {
            await apiClient.post('/auth/logout');
        } catch {
            /* ignore */
        } finally {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem(USER_KEY);
            localStorage.removeItem('glow_user');
            window.location.href = '/login';
        }
    },

    logoutLocal: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem('glow_user');
        window.location.href = '/login';
    },

    getCurrentUser: (): StoredUser | null => {
        const userStr = localStorage.getItem(USER_KEY) || localStorage.getItem('glow_user');
        if (userStr) return JSON.parse(userStr) as StoredUser;
        return null;
    },

    changePassword: async (data: {
        currentPassword: string;
        newPassword: string;
        confirmNewPassword: string;
    }) => {
        const response = await apiClient.post('/auth/change-password', data);
        return response.data;
    },
};