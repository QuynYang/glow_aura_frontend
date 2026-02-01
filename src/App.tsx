import { Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { ProductListPage } from './pages/ProductListPage';

function App() {
  return (
    <Routes>
      {/* 1. Trang Chủ (Mặc định) */}
      <Route path="/" element={<HomePage />} />

      {/* 2. Trang Best Sellers (Khi bấm menu) */}
      <Route path="/best-sellers" element={<ProductListPage />} />
      
      {/* Sau này thêm trang chi tiết: /product/123 */}
      {/* <Route path="/product/:id" element={<ProductDetail />} /> */}
    </Routes>
  );
}

export default App;