import { Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { ProductListPage } from './pages/ProductListPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ProfilePage } from './pages/ProfilePage';
import { OrderHistoryPage } from './pages/OrderHistoryPage';



function App() {
  return (
    <Routes>
      {/* 1. Trang Chủ (Mặc định) */}
      <Route path="/" element={<HomePage />} />

      {/* 2. Trang Best Sellers (Khi bấm menu) */}
      <Route path="/best-sellers" element={<ProductListPage />} />
      
      {/* trang chi tiết: /product/123 */}
      <Route path="/product/:id" element={<ProductDetailPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/profile" element={<ProfilePage />} />
<Route path="/profile/orders" element={<OrderHistoryPage />} />


    </Routes>
  );
}

export default App;