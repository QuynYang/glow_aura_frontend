import axios from 'axios';

// Tạo một instance của axios với cấu hình mặc định
const apiClient = axios.create({
    baseURL: 'http://localhost:5278/api', 
    headers: {
        'Content-Type': 'application/json',
    },
});

// Middleware tự động đính kèm Token (nếu có) vào mỗi request gửi đi
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

export default apiClient;