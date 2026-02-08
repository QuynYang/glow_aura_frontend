import { useState } from 'react';
import { ChevronDown, Heart, ShoppingCart, ChevronRight } from 'lucide-react';
import { MainLayout } from '../components/layout/MainLayout';
import { Link } from 'react-router-dom';

// 1. Mock Data chuyên biệt cho trang Mắt
const eyeProducts = [
  {
    id: 201,
    category: 'eyes',
    name: "Bảng Phấn Mắt Velvet Twilight",
    description: "8 Sắc thái trung tính quyến rũ",
    price: 1250000,
    originalPrice: null,
    image: "https://cf.shopee.vn/file/f02e408b60acb00c188f57f9448e0f85",
    tag: "Mới"
  },
  {
    id: 202,
    category: 'mascara',
    name: "Mascara Obsidian Lash",
    description: "Làm dài và dày mi tức thì",
    price: 550000,
    originalPrice: 680000,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIxwMiMfObwY3zwV04igzKA7kb1Rv5nzbW2w&s",
    tag: "Sale"
  },
  {
    id: 203,
    category: 'eyeliner',
    name: "Kẻ Mắt Gel Precision",
    description: "Chống trôi suốt 24h",
    price: 420000,
    originalPrice: null,
    image: "https://cdn-images.kiotviet.vn/myphamusavn1/1b0460624574456a9195eebdee94913e.jpg",
  },
  {
    id: 204,
    category: 'eyes',
    name: "Phấn Mắt Nhũ Glimmer",
    description: "Hiệu ứng lấp lánh đa chiều",
    price: 380000,
    originalPrice: null,
    image: "https://gw.alicdn.com/imgextra/O1CN01kzzhlK1Ul9V1fHYKF_!!6000000002557-0-yinhe.jpg_540x540.jpg",
  },
  {
    id: 205,
    category: 'eyeliner',
    name: "Bộ Định Hình Lông Mày",
    description: "Tự nhiên & Bền màu",
    price: 650000,
    originalPrice: null,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRj_v1ceesPr0Loi_lwvDbx-q11ppknMRQGog&s",
  },
  {
    id: 206,
    category: 'eyes',
    name: "Kem Lót Mắt Silk Smooth",
    description: "Tăng độ bám màu phấn mắt",
    price: 450000,
    originalPrice: null,
    image: "https://bizweb.dktcdn.net/thumb/1024x1024/100/444/878/products/kem-lot-tfit-delicate-silk-veil-art-primer-0.jpg?v=1722236542317",
  },
  {
    id: 207,
    category: 'mascara',
    name: "Mascara Waterproof Volume",
    description: "Không lem, không trôi",
    price: 590000,
    originalPrice: null,
    image: "https://product.hstatic.net/200000810505/product/z5116644780690_77aba84307929fddb4cb372301e5b37a_99747cee3acc48abad583a6e84f02b9b_master.jpg",
  },
  {
    id: 208,
    category: 'eyeliner',
    name: "Bút Kẻ Mắt Nước Ultra Fine",
    description: "Đường nét sắc sảo, tinh tế",
    price: 350000,
    originalPrice: null,
    image: "https://bizweb.dktcdn.net/thumb/grande/100/382/633/products/z3617361881198-da649b1deafb3c7c8b7a5d77d77f23ae-f606290a89da4d359627f5c6eb7c471b-grande.jpg?v=1674971379843",
  }
];

// Danh sách Tabs
const tabs = [
  { id: 'all', label: 'TẤT CẢ' },
  { id: 'eyes', label: 'PHẤN MẮT' },
  { id: 'mascara', label: 'MASCARA' },
  { id: 'eyeliner', label: 'KẺ MẮT' },
];

export const EyesPage = () => {
  const [activeTab, setActiveTab] = useState('all');

  // Logic lọc sản phẩm theo Tab
  const filteredProducts = activeTab === 'all' 
    ? eyeProducts 
    : eyeProducts.filter(p => p.category === activeTab);

  return (
    <MainLayout>
      {/* 1. HERO BANNER: Ảnh mắt quyến rũ */}
      <section className="relative h-[350px] md:h-[450px] bg-gray-900 overflow-hidden">
        <img 
          src="https://www.bubblesindia.com/wp-content/uploads/2019/03/Bubbles_Services_Banner_Eye_Makeup.jpg" 
          alt="Eyes Makeup Banner" 
          className="w-full h-full object-cover object-top opacity-70"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-4xl md:text-6xl font-serif text-white mb-2 drop-shadow-lg" style={{ fontFamily: 'Playfair Display, serif' }}>
                Ánh nhìn quyến rũ
            </h1>
            <p className="text-white/90 text-xs md:text-sm uppercase tracking-[0.2em] font-medium drop-shadow-md max-w-xl">
                Khám phá bộ sưu tập phấn mắt, mascara và chì kẻ mắt cao cấp giúp tôn vinh vẻ đẹp cửa sổ tâm hồn của bạn.
            </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10">
        
        {/* 2. FILTER BAR & SORTING (Thanh công cụ ngang) */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6 border-b border-gray-100 pb-6">
            
            {/* Tabs chọn danh mục */}
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-6 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 rounded-sm
                            ${activeTab === tab.id 
                                ? 'bg-[#3D021E] text-white shadow-md' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                        `}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Thông tin số lượng & Sắp xếp */}
            <div className="flex items-center gap-6">
                <div className="relative group cursor-pointer flex items-center gap-2 text-xs font-bold uppercase text-gray-800 hover:text-[#3D021E]">
                    Sắp xếp: Tất cả sản phẩm <ChevronDown className="w-3 h-3" />
                    {/* Dropdown ẩn */}
                    <div className="absolute right-0 top-full mt-2 w-40 bg-white shadow-lg border border-gray-100 py-1 hidden group-hover:block z-20">
                         <div className="px-4 py-2 hover:bg-gray-50">Tất cả sản phẩm</div>
                         <div className="px-4 py-2 hover:bg-gray-50">Giá thấp đến cao</div>
                         <div className="px-4 py-2 hover:bg-gray-50">Giá cao đến thấp</div>
                         <div className="px-4 py-2 hover:bg-gray-50">Mới nhất</div>
                    </div>
                </div>
            </div>
        </div>

        {/* 3. PRODUCT GRID (4 CỘT) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {filteredProducts.map((product) => (
                <div key={product.id} className="group cursor-pointer">
                    
                    {/* Hình ảnh */}
                    <div className="relative aspect-square overflow-hidden mb-4 bg-gray-50">
                        <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        
                        {/* Tags */}
                        {product.tag && (
                            <span className={`absolute top-2 left-2 text-[10px] font-bold uppercase px-2 py-1 text-white shadow-sm
                                ${product.tag === 'Sale' ? 'bg-[#D3999D]' : 'bg-[#3D021E]'}
                            `}>
                                {product.tag}
                            </span>
                        )}

                        {/* Hover Action */}
                        <div className="absolute bottom-3 left-0 right-0 px-3 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                             <button className="bg-white hover:bg-[#3D021E] hover:text-white text-gray-900 p-2 rounded-full shadow-md transition-colors">
                                <Heart className="w-4 h-4" />
                            </button>
                            <button className="bg-white hover:bg-[#3D021E] hover:text-white text-gray-900 px-4 py-2 rounded-full text-xs font-bold uppercase shadow-md transition-colors flex items-center gap-2">
                                <ShoppingCart className="w-3 h-3" /> Thêm
                            </button>
                        </div>
                    </div>

                    {/* Thông tin Text (Có Subtitle in nghiêng) */}
                    <div>
                        <h3 className="text-sm font-serif font-bold text-gray-900 group-hover:text-[#3D021E] transition-colors mb-1">
                            <Link to={`/product/${product.id}`}>{product.name}</Link>
                        </h3>
                        
                        {/* Subtitle in nghiêng - Điểm đặc biệt của trang này */}
                        <p className="text-xs text-gray-500 italic mb-2 font-light">
                            {product.description}
                        </p>

                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-gray-900">
                                {product.price.toLocaleString('vi-VN')}đ
                            </span>
                            {product.originalPrice && (
                                <span className="text-xs text-gray-400 line-through">
                                    {product.originalPrice.toLocaleString('vi-VN')}đ
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {/* 4. PAGINATION */}
            <div className="mt-16 flex justify-center gap-2">
                 <button className="w-8 h-8 bg-[#A41C4E] text-white flex items-center justify-center font-medium text-sm rounded-sm">1</button>
                 <button className="w-8 h-8 border border-gray-200 text-gray-600 flex items-center justify-center font-medium text-sm rounded-sm hover:border-[#A41C4E] hover:text-[#A41C4E]">2</button>
                 <button className="w-8 h-8 border border-gray-200 text-gray-600 flex items-center justify-center font-medium text-sm rounded-sm hover:border-[#A41C4E] hover:text-[#A41C4E]">3</button>
                 <button className="w-8 h-8 border border-gray-200 text-gray-600 flex items-center justify-center rounded-sm hover:border-[#A41C4E] hover:text-[#A41C4E]">
                    <ChevronRight className="w-4 h-4" />
                 </button>
            </div>

      </div>
    </MainLayout>
  );
};