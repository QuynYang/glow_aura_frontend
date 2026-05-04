import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5278/api';

// Tạo một instance của axios với cấu hình mặc định
const apiClient = axios.create({
    baseURL: API_BASE.replace(/\/$/, ''),
    headers: {
        'Content-Type': 'application/json',
    },
});

// Middleware 1: Tự động đính kèm Token (nếu có) vào mỗi request gửi đi
apiClient.interceptors.request.use(
  (config) => {
    // Tìm thẻ thành viên (token) trong localStorage
    const token = localStorage.getItem('accessToken'); 
    
    if (token) {
      // Nếu có token, dán nó vào Header Authorization
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Middleware 2: Đánh chặn lỗi 401 (Hết hạn Token) và Tự động gọi Refresh Token
apiClient.interceptors.response.use(
  (response) => {
    // Nếu API gọi thành công (200), cho qua bình thường
    return response;
  },
  async (error) => {
    // Lấy lại cái cấu hình của API vừa bị lỗi
    const originalRequest = error.config;

    // Kiểm tra: Nếu lỗi là 401 (Unauthorized) VÀ API này chưa từng được "thử lại" lần nào
    const url = String(originalRequest?.url || '');
    const isAuthRoute =
      url.includes('/auth/refresh-token') ||
      url.includes('/Auth/refresh-token') ||
      url.includes('/auth/login') ||
      url.includes('/auth/register');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
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
          // 1. Lưu token mới vào ổ cứng
          localStorage.setItem('accessToken', newTokens.accessToken);
          if (newTokens.refreshToken) {
            localStorage.setItem('refreshToken', newTokens.refreshToken);
          }

          // 2. Gắn Token mới vào cái API cũ vừa bị lỗi 401 lúc nãy
          originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;

          // 3. Thực hiện lại request cũ với cái chìa khóa mới!
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Nếu việc làm mới Token cũng thất bại (Ví dụ: Refresh Token hết hạn nốt)
        console.error("Refresh Token thất bại. Bắt buộc đăng nhập lại.", refreshError);
        
        // Dọn dẹp rác
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        localStorage.removeItem('glow_user');
        
        // Đá người dùng văng ra trang Login
        window.location.href = '/login';
        
        return Promise.reject(refreshError);
      }
    }

    // Nếu là lỗi khác (400, 404, 500...) hoặc đã retry rồi mà vẫn lỗi thì ném lỗi ra như bình thường
    return Promise.reject(error);
  }
);

export default apiClient;