import axios from 'axios';

// Tạo một instance của axios với cấu hình mặc định
const apiClient = axios.create({
    // Port 5278 là port thực tế mà Swagger/API của bạn đang chạy
    baseURL: 'http://localhost:5278/api', 
    headers: {
        'Content-Type': 'application/json',
    },
});

// Middleware tự động đính kèm Token (nếu có) vào mỗi request gửi đi
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default apiClient;