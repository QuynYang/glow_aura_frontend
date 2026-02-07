import { useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { MainLayout } from '../components/layout/MainLayout';
import { ProductCard } from '../features/products/components/ProductCard';

// 1. Mock Data chuyên biệt cho trang Môi (Lip Products)
const lipProducts = [
  {
    id: 1,
    brand: "Glow Aura Professional",
    name: "Rouge Velvet Matte Lipstick - Ruby Rush",
    price: 850000,
    image: "https://cdn.vuahanghieu.com/unsafe/0x0/left/top/smart/filters:quality(90)/https://admin.vuahanghieu.com/upload/news/content/2022/01/son-tom-ford-lip-color-matte-lipstick-07-ruby-rush-jpg-1582087662-19022020114742-jpg-1642744317-21012022125157.jpg",
    tag: "Best Seller"
  },
  {
    id: 2,
    brand: "Glow Aura Hydration",
    name: "Crystal Glass Lip Gloss - Nude Shimmer",
    price: 620000,
    image: "https://m.media-amazon.com/images/I/61TDRHfUKvL._AC_UF1000,1000_QL80_.jpg",
  },
  {
    id: 3,
    brand: "Glow Aura Care",
    name: "Therapy Lip Balm with Hyaluronic Acid",
    price: 450000,
    image: "https://paulaschoice.sg/cdn/shop/products/SKU9580_Lifestyle_1080x.png?v=1735489305",
    tag: "New"
  },
  {
    id: 4,
    brand: "Glow Aura Longwear",
    name: "Infinite Liquid Tint - Rose Petal",
    price: 790000,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdwczbqrysUhmWFaho6dWPjVZZBLHnt7SoyA&s",
  },
  {
    id: 5,
    brand: "Glow Aura Essential",
    name: "Classic Satin Finish - Vintage Red",
    price: 750000,
    image: "https://cdn.shopify.com/s/files/1/0739/4764/4135/files/613WuEsmnsL._SX679.jpg?v=1750474448",
  },
  {
    id: 6,
    brand: "Glow Aura Volumizing",
    name: "Lip Plumping Serum - Clear Ice",
    price: 920000,
    image: "https://cdn.hstatic.net/products/200000551679/sg-11134207-7rccx-ls86mziwj6m36a_3b7b3d307b544f1fadd4e3c4e56830a4.jpg",
  },
  {
    id: 7,
    brand: "Glow Aura Care",
    name: "Overnight Repair Lip Mask - Berry",
    price: 580000,
    image: "https://m.media-amazon.com/images/I/51Ok33JToNL._AC_UF1000,1000_QL80_.jpg",
  },
  {
    id: 8,
    brand: "Glow Aura Precision",
    name: "Sculpting Lip Liner - Deep Mauve",
    price: 390000,
    image: "https://www.makeupbymario.com/cdn/shop/files/sku_22015108_color_kevin-pinky-mauve_01_1d132850-83d7-431d-809d-742862d679ca.jpg?v=1719839393&width=640",
  },
];

// Bộ lọc màu sắc
const colors = [
  { id: 'red', hex: '#EF4444', label: 'Đỏ' },
  { id: 'nude', hex: '#D4A373', label: 'Nude' },
  { id: 'pink', hex: '#F472B6', label: 'Hồng' },
  { id: 'brown', hex: '#78350F', label: 'Nâu' },
  { id: 'wine', hex: '#881337', label: 'Đỏ rượu' },
];

export const LipsPage = () => {
  const [priceRange, setPriceRange] = useState(500000);

  return (
    <MainLayout>
      {/* 1. HERO BANNER (Full Width) */}
      <section className="relative h-[300px] md:h-[400px] bg-pink-100 overflow-hidden">
        <img 
          src="https://png.pngtree.com/background/20240412/original/pngtree-upscale-lipstick-advertisement-banner-featuring-a-3d-render-against-a-red-picture-image_8460112.jpg"
          alt="Lipstick Banner" 
          className="w-full h-full object-cover object-center"
        />
        {/* Text Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-4xl md:text-6xl font-serif text-white mb-2 drop-shadow-lg" style={{ fontFamily: 'Playfair Display, serif' }}>
                Velvet & Silk
            </h1>
            <p className="text-white/90 text-xs md:text-sm uppercase tracking-[0.2em] font-medium drop-shadow-md max-w-xl">
                Khám phá bộ sưu tập son môi cao cấp mang lại cảm giác mịn mượt và màu sắc thời thượng.
            </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* 2. SIDEBAR FILTER (Bên trái) */}
          <aside className="w-full lg:w-1/4 space-y-10">
            
            {/* Loại sản phẩm */}
            <div>
                <h3 className="font-serif font-bold text-[#3D021E] uppercase tracking-wider mb-4 text-sm">Loại sản phẩm</h3>
                <div className="space-y-3">
                    {['Son thỏi (Lipstick)', 'Son dưỡng (Balm)', 'Son bóng (Gloss)', 'Son tint (Tint)'].map((type) => (
                        <label key={type} className="flex items-center gap-3 cursor-pointer group">
                            <div className="w-4 h-4 border border-gray-300 rounded-sm flex items-center justify-center transition-colors group-hover:border-[#3D021E]">
                                {/* Checkbox giả lập */}
                            </div>
                            <span className="text-sm text-gray-600 group-hover:text-[#3D021E] transition-colors">{type}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Màu sắc */}
            <div>
                <h3 className="font-serif font-bold text-[#3D021E] uppercase tracking-wider mb-4 text-sm">Màu sắc</h3>
                <div className="flex flex-wrap gap-3">
                    {colors.map((color) => (
                        <button 
                            key={color.id}
                            className="w-8 h-8 rounded-full border border-gray-200 hover:scale-110 transition-transform shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-[#3D021E]"
                            style={{ backgroundColor: color.hex }}
                            title={color.label}
                        ></button>
                    ))}
                </div>
            </div>

            {/* Khoảng giá (Range Slider) */}
            <div>
                <h3 className="font-serif font-bold text-[#3D021E] uppercase tracking-wider mb-4 text-sm">Khoảng giá</h3>
                <input 
                    type="range" 
                    min="0" 
                    max="2000000" 
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#3D021E]"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2 font-medium">
                    <span>0đ</span>
                    {/* Hiển thị giá VND */}
                    <span className="text-[#3D021E] font-bold">{priceRange.toLocaleString('vi-VN')}đ</span>
                    <span>2.000.000đ</span>
                </div>
            </div>

            {/* Nút Xóa bộ lọc */}
            <button className="w-full bg-black text-white text-xs font-bold py-3 uppercase tracking-widest hover:bg-[#3D021E] transition-colors">
                Xóa tất cả bộ lọc
            </button>

          </aside>

          {/* 3. MAIN CONTENT (Bên phải) */}
          <div className="w-full lg:w-3/4">
            
            {/* Header của Grid (Số lượng + Sắp xếp) */}
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Hiển thị {lipProducts.length} sản phẩm
                </span>
                
                <div className="relative group">
                    <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider hover:text-[#3D021E]">
                        Sắp xếp: Phổ biến nhất <ChevronDown className="w-3 h-3" />
                    </button>
                    {/* Dropdown menu giả lập */}
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-lg border border-gray-100 py-2 hidden group-hover:block z-10 animate-in fade-in zoom-in-95">
                        <a href="#" className="block px-4 py-2 text-xs hover:bg-gray-50 hover:text-[#3D021E]">Giá thấp đến cao</a>
                        <a href="#" className="block px-4 py-2 text-xs hover:bg-gray-50 hover:text-[#3D021E]">Giá cao đến thấp</a>
                        <a href="#" className="block px-4 py-2 text-xs hover:bg-gray-50 hover:text-[#3D021E]">Mới nhất</a>
                    </div>
                </div>
            </div>

            {/* Product Grid (4 Cột như thiết kế) */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                {lipProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            {/* Pagination (Phân trang vuông) */}
            <div className="mt-16 flex justify-center gap-2">
                <button className="w-10 h-10 border border-gray-200 flex items-center justify-center hover:border-[#3D021E] hover:text-[#3D021E] transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="w-10 h-10 bg-[#3D021E] text-white flex items-center justify-center font-bold text-sm">
                    1
                </button>
                <button className="w-10 h-10 border border-gray-200 flex items-center justify-center hover:border-[#3D021E] hover:text-[#3D021E] transition-colors font-bold text-sm text-gray-600">
                    2
                </button>
                <button className="w-10 h-10 border border-gray-200 flex items-center justify-center hover:border-[#3D021E] hover:text-[#3D021E] transition-colors font-bold text-sm text-gray-600">
                    3
                </button>
                <button className="w-10 h-10 border border-gray-200 flex items-center justify-center hover:border-[#3D021E] hover:text-[#3D021E] transition-colors">
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>

          </div>
        </div>
      </div>
    </MainLayout>
  );
};