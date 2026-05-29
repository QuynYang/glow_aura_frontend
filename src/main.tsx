import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Kiểm tra xem ứng dụng có đang chạy ở môi trường Production (GitHub Pages) hay không
const isProduction = import.meta.env.MODE === 'production';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Cấu hình basename động: chèn '/glow_aura_frontend' khi lên GitHub, giữ trống khi ở local */}
    <BrowserRouter basename={isProduction ? '/glow_aura_frontend' : ''}>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);