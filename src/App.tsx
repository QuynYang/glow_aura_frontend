import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import apiClient from './services/apiClient';

import { HomePage } from './pages/HomePage';
import { ProductListPage } from './pages/ProductListPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ProfilePage } from './pages/ProfilePage';
import { OrderHistoryPage } from './pages/OrderHistoryPage';
import { WishlistPage } from './pages/WishlistPage';
import { ChangePasswordPage } from './pages/ChangePasswordPage';
import { AddressPage } from './pages/AddressPage';
import { LipsPage } from './pages/LipsPage';
import { FacePage } from './pages/FacePage';
import { EyesPage } from './pages/EyesPage';
import { FlashSalePage } from './pages/FlashSalePage';
import { SkinCarePage } from './pages/SkinCarePage';
import { AdminProductPage } from './pages/admin/AdminProductPage';
import { AdminOrderPage } from './pages/admin/AdminOrderPage';
import { AdminCustomerPage } from './pages/admin/AdminCustomerPage';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';
import { AdminPromotionPage } from './pages/admin/AdminPromotionPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminAddProductPage } from './pages/admin/AdminAddProductPage';
import { AdminOrderDetailPage } from './pages/admin/AdminOrderDetailPage';
import { AdminCreateOrderPage } from './pages/admin/AdminCreateOrderPage';
import { AdminAddCustomerPage } from './pages/admin/AdminAddCustomerPage';
import { AdminAddPromotionPage } from './pages/admin/AdminAddPromotionPage';
import { SkinQuizIntroPage } from './pages/SkinQuizIntroPage';
import { SkinQuizTestPage } from './pages/SkinQuizTestPage';
import { SkinQuizResultPage } from './pages/SkinQuizResultPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { OrderDetailPage } from './pages/OrderDetailPage';

function App() {

  // ==========================================
  // TEST KẾT NỐI API TỪ BACKEND
  // ==========================================
  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log("Đang gọi API lấy danh sách sản phẩm...");
        const response = await apiClient.get('/products'); 
        console.log("🎉 Thành công! Dữ liệu từ Backend:", response.data);
      } catch (error) {
        console.error("❌ Lỗi gọi API:", error);
      }
    };

    testConnection();
  }, []);
  // ==========================================

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/best-sellers" element={<ProductListPage />} />
      <Route path="/product/:id" element={<ProductDetailPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/profile/orders" element={<OrderHistoryPage />} />
      <Route path="/profile/wishlist" element={<WishlistPage />} />
      <Route path="/profile/change-password" element={<ChangePasswordPage />} />
      <Route path="/profile/address" element={<AddressPage />} />
      <Route path="/order-success" element={<OrderSuccessPage />} />
      <Route path="/profile/orders/:id" element={<OrderDetailPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/moi" element={<LipsPage />} />
      <Route path="/mat" element={<FacePage />} />
      <Route path="/mat-1" element={<EyesPage />} />
      <Route path="/sale" element={<FlashSalePage />} />
      <Route path="/da" element={<SkinCarePage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/skin-quiz" element={<SkinQuizIntroPage />} />
      <Route path="/skin-quiz/test" element={<SkinQuizTestPage />} />
      <Route path="/skin-quiz/result" element={<SkinQuizResultPage />} />
      <Route path="/admin/products" element={<AdminProductPage />} />
      <Route path="/admin/products/add" element={<AdminAddProductPage />} />
      <Route path="/admin/orders" element={<AdminOrderPage />} />
      <Route path="/admin/orders/create" element={<AdminCreateOrderPage />} />
      <Route path="/admin/orders/:id" element={<AdminOrderDetailPage />} />
      <Route path="/admin/customers" element={<AdminCustomerPage />} />
      <Route path="/admin/promotions" element={<AdminPromotionPage />} />
      <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
      <Route path="/admin/settings" element={<AdminSettingsPage />} />
      <Route path="/admin/customers/add" element={<AdminAddCustomerPage />} />
      <Route path="/admin/promotions/add" element={<AdminAddPromotionPage />} />
    </Routes>
  );
}

export default App;