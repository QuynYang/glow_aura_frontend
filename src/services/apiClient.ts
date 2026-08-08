import axios from 'axios';

/** API production (Railway) — dùng khi build production mà không có VITE_API_BASE_URL */
const PRODUCTION_API_HOST = 'https://glowauraapimongodb-production.up.railway.app';

/** Chuẩn hóa base URL: luôn kết thúc bằng /api (backend ASP.NET dùng route /api/...) */
function resolveApiBase(): string {
  const fromEnv = (import.meta.env.VITE_API_BASE_URL || '').trim();
  const host = fromEnv || (import.meta.env.PROD ? PRODUCTION_API_HOST : 'http://localhost:5278');
  const raw = host.replace(/\/$/, '');
  return raw.endsWith('/api') ? raw : `${raw}/api`;
}

const API_BASE = resolveApiBase();

/** Các route đăng nhập công khai — không gắn JWT cũ, không auto refresh khi 401 */
const PUBLIC_AUTH_PATHS = [
  '/auth/login',
  '/auth/register',
  '/auth/google',
  '/auth/facebook',
  '/auth/refresh-token',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/Auth/refresh-token',
] as const;

function isPublicAuthRequest(url: string): boolean {
  const normalized = url.toLowerCase();
  return PUBLIC_AUTH_PATHS.some((path) => normalized.includes(path));
}

/** Đường dẫn login tương thích GitHub Pages (HashRouter) */
export function getLoginUrl(): string {
  const base = import.meta.env.BASE_URL || '/';
  return `${base.replace(/\/?$/, '/')}#/login`;
}

const apiClient = axios.create({
    baseURL: API_BASE.replace(/\/$/, ''),
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
  (config) => {
    const url = String(config.url || '');
    const token = localStorage.getItem('accessToken');

    if (token && !isPublicAuthRequest(url)) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi là 401 (Unauthorized) VÀ API này chưa từng được "thử lại" lần nào
    const url = String(originalRequest?.url || '');

    if (error.response?.status === 401 && !originalRequest._retry && !isPublicAuthRequest(url)) {
      originalRequest._retry = true; // Đánh dấu là "Đang thử lại" để tránh lặp vô hạn (Infinite Loop)

      try {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');

        if (!accessToken || !refreshToken) {
          throw new Error("Không có token dự phòng để làm mới.");
        }

        // GỌI API REFRESH TOKEN
        const refreshResponse = await axios.post(`${API_BASE.replace(/\/$/, '')}/auth/refresh-token`, {
          accessToken: accessToken,
          refreshToken: refreshToken
        });

        // Lấy token mới từ Backend trả về
        const newTokens = refreshResponse.data?.token || refreshResponse.data?.data?.token || refreshResponse.data;

        if (newTokens && newTokens.accessToken) {
          localStorage.setItem('accessToken', newTokens.accessToken);
          if (newTokens.refreshToken) {
            localStorage.setItem('refreshToken', newTokens.refreshToken);
          }

          originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;

          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        console.error("Refresh Token thất bại. Bắt buộc đăng nhập lại.", refreshError);

        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        localStorage.removeItem('glow_user');

        const onAuthPage =
          window.location.hash.includes('/login') ||
          window.location.hash.includes('/register');
        if (!onAuthPage) {
          window.location.href = getLoginUrl();
        }

        return Promise.reject(refreshError);
      }
    }

    // Nếu là lỗi khác (400, 404, 500...) hoặc đã retry rồi mà vẫn lỗi thì ném lỗi ra như bình thường
    return Promise.reject(error);
  }
);

export default apiClient;