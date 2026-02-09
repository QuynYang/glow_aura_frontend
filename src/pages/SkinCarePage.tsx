import { useState } from 'react';
import { ChevronDown, ChevronRight, Check } from 'lucide-react';
import { MainLayout } from '../components/layout/MainLayout';
import { ProductCard } from '../features/products/components/ProductCard';

// 1. Mock Data: Dữ liệu Skincare chuyên sâu
// Lưu ý: Trường 'brand' ở đây được tận dụng để hiển thị "Loại sản phẩm + Loại da" (VD: SERUM • DA NHẠY CẢM) cho giống thiết kế
const skinProducts = [
  {
    id: 301,
    brand: "SERUM • DA NHẠY CẢM", 
    name: "Radiance Vitamin C Glow Serum",
    price: 1250000,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600",
    tag: "Mới"
  },
  {
    id: 302,
    brand: "DƯỠNG ẨM • DA KHÔ",
    name: "Deep Hydration Barrier Cream",
    price: 890000,
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=600",
    tag: "Bán chạy"
  },
  {
    id: 303,
    brand: "DẦU DƯỠNG • MỌI LOẠI DA",
    name: "Midnight Recovery Elixir",
    price: 1450000,
    image: "https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?q=80&w=600",
  },
  {
    id: 304,
    brand: "TONER • DA HỖN HỢP",
    name: "Rose Petal Soothing Toner",
    price: 550000,
    image: "https://images.unsplash.com/photo-1601049676869-702ea24cfd58?q=80&w=600",
  },
  {
    id: 305,
    brand: "CHỐNG NẮNG • DA NHẠY CẢM",
    name: "Invisible Shield SPF 50+",
    price: 620000,
    image: "https://images.unsplash.com/photo-1556228720-1987bb7b0033?q=80&w=600",
  },
  {
    id: 306,
    brand: "LÀM SẠCH • DA DẦU",
    name: "Pure Balance Cleansing Gel",
    price: 380000,
    originalPrice: 475000, // Có giá gốc để hiện gạch ngang
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?q=80&w=600",
    tag: "-20%"
  },
  {
    id: 307,
    brand: "TẨY TẾ BÀO CHẾT • DA THƯỜNG",
    name: "Gentle Apricot Scrub",
    price: 420000,
    image: "https://images.unsplash.com/photo-1596462502278-27bfdd403348?q=80&w=600",
  },
  {
    id: 308,
    brand: "MẶT NẠ • DA KHÔ",
    name: "Hyaluronic Sleeping Mask",
    price: 580000,
    image: "https://images.unsplash.com/photo-1620917670397-a3313437ef1a?q=80&w=600",
  },
  {
    id: 309,
    brand: "ĐẶC TRỊ • DA MỤN",
    name: "Tea Tree Spot Treatment",
    price: 320000,
    image: "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=600",
  },
];

// Danh mục bên trái
const categories = [
  "Làm Sạch (Cleanser)",
  "Tinh Chất (Serums)",
  "Dưỡng Ẩm (Moisturizers)",
  "Chống Nắng (Sunscreen)",
  "Mặt Nạ (Masks)",
  "Đặc Trị (Treatments)"
];

// Loại da
const skinTypes = [
  { id: 'oily', label: 'Da Dầu (Oily)' },
  { id: 'dry', label: 'Da Khô (Dry)' },
  { id: 'sensitive', label: 'Da Nhạy Cảm', checked: true }, // Giả lập đang chọn
  { id: 'combo', label: 'Da Hỗn Hợp' },
];

export const SkinCarePage = () => {
  const [priceRange, setPriceRange] = useState(800000);

  return (
    <MainLayout>
      {/* 1. HERO BANNER: Hình ảnh chai lọ clean, sang trọng */}
      <section className="relative h-[300px] md:h-[400px] bg-[#F5F5F5] overflow-hidden">
        <img 
          src="https://cityskinclinic.com/wp-content/uploads/2024/12/titanium-dioxide.png" // Ảnh chai lọ skincare
          alt="Skincare Banner" 
          className="w-full h-full object-cover object-center opacity-90"
        />
        <div className="absolute inset-0 bg-black/10 flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl md:text-6xl font-serif text-white mb-3 drop-shadow-md" style={{ fontFamily: 'Playfair Display, serif' }}>
                Chăm Sóc Da
            </h1>
            <p className="text-white text-xs md:text-sm uppercase tracking-[0.3em] font-medium drop-shadow-sm">
                Khám phá vẻ đẹp tự nhiên của bạn
            </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* 2. SIDEBAR FILTER (Bên trái) */}
          <aside className="w-full lg:w-1/4 space-y-10 font-sans">
            
            {/* Skin Type (Loại da) */}
            <div>
                <h3 className="font-bold text-gray-900 uppercase tracking-widest mb-5 text-xs">Skin Type</h3>
                <div className="space-y-3">
                    {skinTypes.map((type) => (
                        <label key={type.id} className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-4 h-4 border rounded-sm flex items-center justify-center transition-all
                                ${type.checked 
                                    ? 'bg-[#A41C4E] border-[#A41C4E]' 
                                    : 'border-gray-300 group-hover:border-[#A41C4E]'}
                            `}>
                                {type.checked && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <span className={`text-sm transition-colors ${type.checked ? 'text-[#A41C4E] font-medium' : 'text-gray-500 group-hover:text-[#A41C4E]'}`}>
                                {type.label}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Category (Danh mục) */}
            <div>
                <h3 className="font-bold text-gray-900 uppercase tracking-widest mb-5 text-xs">Category</h3>
                <ul className="space-y-3">
                    {categories.map((cat, index) => (
                        <li key={index} className={`text-sm cursor-pointer transition-colors
                            ${index === 1 ? 'text-[#3D021E] font-bold border-l-2 border-[#3D021E] pl-3' : 'text-gray-500 hover:text-[#3D021E]'}
                        `}>
                            {cat}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Price Range */}
            <div>
                <h3 className="font-bold text-gray-900 uppercase tracking-widest mb-5 text-xs">Price Range</h3>
                <input 
                    type="range" 
                    min="0" 
                    max="5000000" 
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#3D021E]"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-2 font-medium uppercase tracking-wide">
                    <span>100.000đ</span>
                    <span>5.000.000đ+</span>
                </div>
            </div>

          </aside>

          {/* 3. MAIN CONTENT (Bên phải) */}
          <div className="w-full lg:w-3/4">
            
            
            {/* Header Grid */}
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
                <span className="text-xs text-gray-500">
                    Hiển thị 12 sản phẩm
                </span>
                
                <div className="relative group">
                    <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-700 hover:text-[#A41C4E]">
                        Sắp xếp: Tất cả sản phẩm <ChevronDown className="w-3 h-3" />
                    </button>
                    {/* Dropdown */}
                    <div className="absolute right-0 top-full mt-2 w-40 bg-white shadow-lg border border-gray-100 py-1 hidden group-hover:block z-10">
                        <a href="#" className="block px-4 py-2 text-xs hover:bg-gray-50">Tất cả sản phẩm</a>
                        <a href="#" className="block px-4 py-2 text-xs hover:bg-gray-50">Giá thấp đến cao</a>
                        <a href="#" className="block px-4 py-2 text-xs hover:bg-gray-50">Giá cao đến thấp</a>
                        <a href="#" className="block px-4 py-2 text-xs hover:bg-gray-50">Mới nhất</a>
                        
                    </div>
                </div>
            </div>

            {/* Product Grid: 3 Cột (Giống ảnh) */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-12">
                {skinProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            {/* Pagination: Style vuông tối giản */}
            <div className="mt-16 flex justify-center gap-2">
                 <button className="w-8 h-8 bg-[#A41C4E] text-white flex items-center justify-center font-medium text-sm rounded-sm">1</button>
                 <button className="w-8 h-8 border border-gray-200 text-gray-600 flex items-center justify-center font-medium text-sm rounded-sm hover:border-[#A41C4E] hover:text-[#A41C4E]">2</button>
                 <button className="w-8 h-8 border border-gray-200 text-gray-600 flex items-center justify-center font-medium text-sm rounded-sm hover:border-[#A41C4E] hover:text-[#A41C4E]">3</button>
                 <button className="w-8 h-8 border border-gray-200 text-gray-600 flex items-center justify-center rounded-sm hover:border-[#A41C4E] hover:text-[#A41C4E]">
                    <ChevronRight className="w-4 h-4" />
                 </button>
            </div>

          </div>
        </div>
      </div>
    </MainLayout>
  );
};