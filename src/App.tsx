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
import { WishlistPage } from './pages/WishlistPage';
import { ChangePasswordPage } from './pages/ChangePasswordPage';
import { AddressPage } from './pages/AddressPage';
import { LipsPage } from './pages/LipsPage';
import { FacePage } from './pages/FacePage';
import { EyesPage } from './pages/EyesPage';
import { FlashSalePage } from './pages/FlashSalePage';
import { SkinCarePage } from './pages/SkinCarePage';
import { AdminProductPage } from './pages/admin/AdminProductPage';




function App() {
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
      <Route path="/moi" element={<LipsPage />} />
      <Route path="/mat" element={<FacePage />} />
      <Route path="/mat-1" element={<EyesPage />} />
      <Route path="/sale" element={<FlashSalePage />} />
      <Route path="/da" element={<SkinCarePage />} />
      <Route path="/admin/products" element={<AdminProductPage />} />
    </Routes>
  );
}

export default App;