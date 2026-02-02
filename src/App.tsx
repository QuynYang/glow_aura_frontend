import { Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { ProductListPage } from './pages/ProductListPage';
import { ProductDetailPage } from './pages/ProductDetailPage';

function App() {
  return (
    <Routes>
      {/* 1. Trang Chủ (Mặc định) */}
      <Route path="/" element={<HomePage />} />

      {/* 2. Trang Best Sellers (Khi bấm menu) */}
      <Route path="/best-sellers" element={<ProductListPage />} />
      
      {/* trang chi tiết: /product/123 */}
      <Route path="/product/:id" element={<ProductDetailPage />} />
    </Routes>
  );
}

export default App;