import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, ShoppingBag } from 'lucide-react';
import { MainLayout } from '../components/layout/MainLayout';
import { Link } from 'react-router-dom';

// --- 1. MOCK DATA (Dữ liệu Sale) ---
const saleProducts = [
  {
    id: 1,
    name: "Luminous Face Serum",
    category: "Serum Dưỡng Da",
    price: 1250000,
    originalPrice: 2080000,
    discount: 40,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600",
  },
  {
    id: 2,
    name: "Rose Petal Mist",
    category: "Toner & Mist",
    price: 450000,
    originalPrice: 600000,
    discount: 25,
    image: "https://images.unsplash.com/photo-1601049676869-702ea24cfd58?q=80&w=600",
  },
  {
    id: 3,
    name: "Velvet Night Lip Balm",
    category: "Chăm Sóc Môi",
    price: 195000,
    originalPrice: 390000,
    discount: 50,
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=600",
  },
  {
    id: 4,
    name: "Hyaluronic Cleanser",
    category: "Sữa Rửa Mặt",
    price: 680000,
    originalPrice: 970000,
    discount: 30,
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?q=80&w=600",
  },
  {
    id: 5,
    name: "Botanical Facial Oil",
    category: "Dầu Dưỡng",
    price: 890000,
    originalPrice: 1050000,
    discount: 15,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCUFNPYqA_MMvP0SOPpazKuqyVRC2E__EVPw&s",
  },
  {
    id: 6,
    name: "Amazonian Clay Detox Mask",
    category: "Mặt Nạ",
    price: 520000,
    originalPrice: 650000,
    discount: 20,
    image: "https://cdn-tp3.mozu.com/30113-50133/cms/50133/files/fbc11975-fd27-4aff-bc98-db2b4a7aa8b7",
  },
  {
    id: 7,
    name: "Radiance Vitamin C Cream",
    category: "Kem Dưỡng",
    price: 750000,
    originalPrice: 1150000,
    discount: 35,
    image: "https://bizweb.dktcdn.net/100/421/115/products/920886c7-8639-4d7c-b52e-f81ef2ef230a-jpeg.jpg?v=1619629327927",
  },
  {
    id: 8,
    name: "Night Repair Eye Cream",
    category: "Chăm Sóc Mắt",
    price: 1050000,
    originalPrice: 1900000,
    discount: 45,
    image: "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=600",
  },
];

// --- 2. COMPONENT COUNTDOWN (Đồng hồ đếm ngược) ---
const CountdownTimer = () => {
    // Giả lập thời gian kết thúc (3 ngày tới)
    const calculateTimeLeft = () => {
        // Đây là logic giả định, thực tế bạn sẽ lấy từ API hoặc set cứng ngày
        return { days: '02', hours: '14', minutes: '45', seconds: '32' };
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    // Hiệu ứng chạy đồng hồ (Giả lập cho đẹp)
    useEffect(() => {
        const timer = setInterval(() => {
            // Logic giảm giây thực tế sẽ phức tạp hơn, ở đây ta giả lập để UI động
            // Trong dự án thật: new Date(target) - new Date()
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const timeBoxClass = "w-16 h-20 md:w-20 md:h-24 bg-[#F9F5F2] rounded-lg border border-[#EBEBEB] flex flex-col items-center justify-center shadow-sm";
    const numberClass = "text-2xl md:text-3xl font-bold text-[#3D021E]";
    const labelClass = "text-[10px] uppercase tracking-wider text-gray-500 mt-1";

    return (
        <div className="flex gap-4 mb-10">
            <div className={timeBoxClass}>
                <span className={numberClass}>{timeLeft.days}</span>
                <span className={labelClass}>Ngày</span>
            </div>
            <div className={timeBoxClass}>
                <span className={numberClass}>{timeLeft.hours}</span>
                <span className={labelClass}>Giờ</span>
            </div>
            <div className={timeBoxClass}>
                <span className={numberClass}>{timeLeft.minutes}</span>
                <span className={labelClass}>Phút</span>
            </div>
            <div className={timeBoxClass}>
                <span className={numberClass}>{timeLeft.seconds}</span>
                <span className={labelClass}>Giây</span>
            </div>
        </div>
    );
};

// --- 3. MAIN PAGE ---
export const FlashSalePage = () => {
  return (
    <MainLayout>
      {/* === HERO SECTION (Banner Sale) === */}
      <div className="bg-white py-10">
        <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-10 bg-white">
                
                {/* Cột trái: Nội dung & Countdown */}
                <div className="w-full lg:w-1/2 space-y-6">
                    <span className="inline-block bg-[#3D021E] text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest mb-2">
                        Ưu đãi giới hạn
                    </span>
                    <h1 className="text-5xl md:text-7xl font-serif font-bold text-[#3D021E] leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                        Đang Sale Sốc
                    </h1>
                    <p className="text-gray-500 text-lg max-w-md leading-relaxed">
                        Sở hữu ngay những sản phẩm dưỡng da cao cấp nhất với mức giá ưu đãi lên đến 50%. Duy nhất trong tuần này.
                    </p>
                    
                    {/* Đồng hồ */}
                    <CountdownTimer />

                    <button className="bg-[#3D021E] hover:bg-[#5c032d] text-white px-10 py-4 rounded-sm font-bold text-sm uppercase tracking-widest transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                        Mua sắm ngay
                    </button>
                </div>

                {/* Cột phải: Hình ảnh Hero */}
                <div className="w-full lg:w-1/2 relative">
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                        <img 
                            src="https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=1000" 
                            alt="Flash Sale Hero" 
                            className="w-full h-full object-cover"
                        />
                        {/* Hiệu ứng bóng đổ tròn giống thiết kế */}
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#3D021E] rounded-full flex items-center justify-center text-white text-center shadow-2xl z-10 p-4">
                            <div>
                                <p className="text-xs uppercase font-medium mb-1">Lên đến</p>
                                <p className="text-3xl font-bold">-50%</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* === PRODUCT LIST SECTION === */}
      <div className="bg-[#FAFAFA] py-16">
        <div className="container mx-auto px-4">
            
            {/* Header List */}
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
                <span className="text-xs text-gray-500">
                    Hiển thị 8 sản phẩm
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

            {/* Grid Sản Phẩm */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {saleProducts.map((product) => (
                    <div key={product.id} className="group bg-white rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
                        
                        {/* Ảnh sản phẩm */}
                        <div className="relative aspect-square overflow-hidden bg-gray-50">
                            <img 
                                src={product.image} 
                                alt={product.name} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            
                            {/* Badge Giảm Giá (Màu đen góc trái) */}
                            <span className="absolute top-3 left-3 bg-[#3D021E] text-white text-[10px] font-bold px-2 py-1 rounded-sm shadow-md">
                                -{product.discount}%
                            </span>

                            {/* Overlay hover */}
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button className="bg-white text-[#3D021E] px-4 py-2 rounded-full font-bold text-xs flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                                    <ShoppingBag className="w-3 h-3" /> Mua Ngay
                                </button>
                            </div>
                        </div>

                        {/* Thông tin */}
                        <div className="p-5">
                            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">{product.category}</p>
                            <h3 className="font-bold text-gray-900 text-sm mb-3 line-clamp-1 group-hover:text-[#3D021E] transition-colors">
                                <Link to={`/product/${product.id}`}>{product.name}</Link>
                            </h3>
                            
                            {/* Giá (Giá đỏ + Giá gạch ngang) */}
                            <div className="flex items-center gap-3">
                                <span className="text-[#3D021E] font-bold text-lg">
                                    {product.price.toLocaleString('vi-VN')}đ
                                </span>
                                <span className="text-gray-400 text-xs line-through font-medium">
                                    {product.originalPrice.toLocaleString('vi-VN')}đ
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
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
    </MainLayout>
  );
};