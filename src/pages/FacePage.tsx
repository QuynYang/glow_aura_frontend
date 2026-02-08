import { useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { MainLayout } from '../components/layout/MainLayout';
import { ProductCard } from '../features/products/components/ProductCard';

// 1. Mock Data chuyên biệt cho trang Mặt (Face Products)
// Dữ liệu mô phỏng các sản phẩm nền, phấn phủ, che khuyết điểm
const faceProducts = [
  {
    id: 101,
    brand: "Aura Luxe",
    name: "Silk Glow Foundation - Ivory",
    price: 850000,
    image: "https://images-na.ssl-images-amazon.com/images/I/31Fk0tmuJRL.jpg", // Ảnh chai kem nền
    tag: "Hot"
  },
  {
    id: 102,
    brand: "Silk Touch",
    name: "Velvet Setting Powder - Translucent",
    price: 520000,
    image: "https://row.iconiclondoninc.com/cdn/shop/files/ICONIC_Velvet-Blur_Creative_-_2000x2000_36a01574-5153-4b1e-8635-045493065328.jpg?v=1720090859&width=2000", // Ảnh phấn phủ
  },
  {
    id: 103,
    brand: "Glow Bloom",
    name: "Bright Eye Concealer - Light Beige",
    price: 390000,
    image: "https://static.beautytocare.com/cdn-cgi/image/f=auto/media/catalog/product/m/a/makeup-revolution-eye-bright-illuminating-under-eye-concealer-porcelain-3ml_2.jpg", // Ảnh che khuyết điểm
    tag: "New"
  },
  {
    id: 104,
    brand: "Aura Luxe",
    name: "Radiant Blush Palette - Rose Garden",
    price: 680000,
    image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjjYNa3OBWsMvqXMakkAZjiVapTriVy-gAs-BqlGk8kIIjrACLzdbGx5vlO7fiQuvjBOTeE16aHN57ZsEQaA9EdcO6y4c6gG8jhpWMOdhtg5MBewn30Z5666HXyIG1ER65TREipgvAx1AZV/s1600/0607845084914.jpg",
  },
  {
    id: 105,
    brand: "Silk Touch",
    name: "Hydrating Pore Primer",
    price: 450000,
    image: "https://assets.myntassets.com/w_360,q_50,,dpr_2,fl_progressive,f_webp/assets/images/2025/AUGUST/9/5F3GvNX9_bdd05010263b4d92ad5e5e09178673f6.jpg",
  },
  {
    id: 106,
    brand: "Glow Bloom",
    name: "Celestial Highlighter - Champagne",
    price: 580000,
    image: "https://cdn.vuahanghieu.com/unsafe/0x900/left/top/smart/filters:quality(90)/https://admin.vuahanghieu.com/upload/product/2024/04/phan-ma-hong-charlotte-tilbury-hollywood-glow-glide-face-architect-highlighter-mau-champagne-glow-6610c3cb56fa8-06042024103851.jpg", // Ảnh highlight
  },
  {
    id: 107,
    brand: "Aura Luxe",
    name: "Matte Fix Setting Spray",
    price: 320000,
    image: "https://www.maybelline.com/-/media/project/loreal/brand-sites/mny/americas/us/face-makeup/primer/facestudio-lasting-fix-setting-spray-matte-finish/maybelline-setting-spray-face-studio-master-fix-041554455571-b.jpg?rev=0019a39be8064fdab3a2e82f5da43ce0&cx=0&cy=0&cw=760&ch=1130&hash=8ECE6AA4D453A1F2115403D5A023B0BD",
  },
  {
    id: 108,
    brand: "Silk Touch",
    name: "Cream Contour Stick - Mocha",
    price: 410000,
    image: "https://images-na.ssl-images-amazon.com/images/I/71fuHBGGTRL.jpg",
  },
  {
    id: 109,
    brand: "Glow Bloom",
    name: "Mineral Loose Powder - Natural",
    price: 480000,
    image: "https://sampure.co.uk/113-large_default/mineral-setting-powder-natural-055g.jpg",
  },
];

// Danh mục con (Sidebar)
const categories = [
  { name: 'Kem nền (Foundation)', count: 12 },
  { name: 'Phấn phủ (Powder)', count: 8 },
  { name: 'Che khuyết điểm (Concealer)', count: 6 },
  { name: 'Kem lót (Primer)', count: 5 },
  { name: 'Phấn má (Blush)', count: 10 },
];

// Thương hiệu (Sidebar)
const brands = ['Aura Luxe', 'Silk Touch', 'Glow Bloom', 'Estee Lauder', 'Dior'];

export const FacePage = () => {
  const [priceRange, setPriceRange] = useState(1000000);

  return (
    <MainLayout>
      {/* 1. HERO BANNER: Tông màu Beige/Nude sang trọng */}
      <section className="relative h-[300px] md:h-[400px] bg-[#D4C4B7] overflow-hidden">
        <img 
          src="https://nima.edu/wp-content/uploads/2022/08/makeup.jpg" // Ảnh texture kem nền
          alt="Face Makeup Banner" 
          className="w-full h-full object-cover object-center opacity-80"
        />
        
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-4xl md:text-6xl font-serif text-white mb-2 drop-shadow-lg" style={{ fontFamily: 'Playfair Display, serif' }}>
                Trang điểm mặt
            </h1>
            <p className="text-white/90 text-xs md:text-sm uppercase tracking-[0.2em] font-medium drop-shadow-md max-w-xl">
                Lớp nền hoàn hảo bắt đầu từ sự thấu hiểu làn da. Khám phá các sản phẩm phấn nền, kem che khuyết điểm và phấn phủ cho vẻ đẹp rạng rỡ tự nhiên.
            </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* 2. SIDEBAR FILTER (Đúng theo ảnh mẫu) */}
          <aside className="w-full lg:w-1/4 space-y-8">
            
            {/* Danh mục */}
            <div>
                <h3 className="font-bold text-gray-900 uppercase tracking-wider mb-4 text-xs">Danh mục</h3>
                <ul className="space-y-3">
                    {categories.map((cat) => (
                        <li key={cat.name} className="flex justify-between items-center text-sm text-gray-600 cursor-pointer hover:text-[#A41C4E] transition-colors group">
                            <span>{cat.name}</span>
                            <span className="text-xs text-gray-400 group-hover:text-[#A41C4E]">({cat.count})</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="border-t border-gray-100"></div>

            {/* Lọc theo giá */}
            <div>
                <h3 className="font-bold text-gray-900 uppercase tracking-wider mb-4 text-xs">Lọc theo giá</h3>
                <input 
                    type="range" 
                    min="0" 
                    max="2000000" 
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#A41C4E]"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2 font-medium">
                    <span>0đ</span>
                    <span className="text-[#A41C4E] font-bold">{priceRange.toLocaleString('vi-VN')}đ</span>
                </div>
            </div>

            <div className="border-t border-gray-100"></div>

            {/* Thương hiệu */}
            <div>
                <h3 className="font-bold text-gray-900 uppercase tracking-wider mb-4 text-xs">Thương hiệu</h3>
                <div className="space-y-2">
                    {brands.map((brand) => (
                        <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                             <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#A41C4E] focus:ring-[#A41C4E]" />
                             <span className="text-sm text-gray-600 group-hover:text-[#A41C4E] transition-colors">{brand}</span>
                        </label>
                    ))}
                </div>
            </div>

          </aside>

          {/* 3. MAIN CONTENT */}
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

            {/* Product Grid: Sử dụng 3 cột (grid-cols-3) trên Desktop để giống ảnh mẫu */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10">
                {faceProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            {/* Pagination: Style đơn giản giống ảnh mẫu */}
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