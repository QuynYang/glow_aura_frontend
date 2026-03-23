import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  CheckCircle2, RotateCcw, BarChart2, 
  Lightbulb, Sparkles, ArrowRight, Loader2 
} from 'lucide-react';
import { MainLayout } from '../components/layout/MainLayout';
import { skinQuizService } from '../services/skinQuizService'; // Import API Service

// --- MOCK DATA (Dùng để backup khi API chưa có dữ liệu) ---
const SIDEBAR_PRODUCTS = [
    { id: '101', name: "2% BHA Liquid Exfoliant", brand: "PAULA'S CHOICE", price: "890.000đ", oldPrice: "940.000đ", img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=150" },
    { id: '102', name: "Niacinamide 10% + Zinc 1%", brand: "THE ORDINARY", price: "215.000đ", oldPrice: "320.000đ", img: "https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?q=80&w=150" },
    { id: '103', name: "Foaming Facial Cleanser", brand: "CERAVE", price: "385.000đ", oldPrice: "450.000đ", img: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=150" },
];

const BOTTOM_PRODUCTS = [
    { id: '201', name: "Kem Chống Nắng Kiềm Dầu", price: 450000, img: "https://images.unsplash.com/photo-1556228720-1987bb7b0033?q=80&w=300" },
    { id: '202', name: "Gel Dưỡng Cấp Nước", price: 320000, img: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?q=80&w=300" },
    { id: '203', name: "Mặt Nạ Đất Sét Hút Dầu", price: 290000, img: "https://images.unsplash.com/photo-1620917670397-a3313437ef1a?q=80&w=300" },
    { id: '204', name: "Toner Cân Bằng Độ pH", price: 540000, img: "https://images.unsplash.com/photo-1601049676869-702ea24cfd58?q=80&w=300" },
];

export const SkinQuizResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const skinTypeCode = location.state?.skinType;

  const [isLoading, setIsLoading] = useState(true);
  const [skinDetails, setSkinDetails] = useState<any>({});
  const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);

  useEffect(() => {
    if (!skinTypeCode) {
      navigate('/skin-quiz');
      return;
    }

    const fetchResultData = async () => {
      try {
        setIsLoading(true);
        // Gọi API lấy dữ liệu thực tế
        const [details, products] = await Promise.all([
          skinQuizService.getSkinTypeDetails(skinTypeCode).catch(() => ({})), // Tránh lỗi sập trang nếu API thiếu
          skinQuizService.getRecommendations(skinTypeCode).catch(() => [])
        ]);

        setSkinDetails(details || {});
        setRecommendedProducts(products || []);
      } catch (error) {
        console.error("Lỗi lấy kết quả:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResultData();
    window.scrollTo(0, 0);
  }, [skinTypeCode, navigate]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#FDFBFB]">
            <Loader2 className="w-12 h-12 animate-spin text-[#3D021E]" />
            <p className="mt-4 text-gray-500 font-bold tracking-wide">Đang xây dựng phác đồ của bạn...</p>
        </div>
      </MainLayout>
    );
  }

  // Fallback thông minh: Nếu API chưa có mảng, dùng mảng cứng để giữ giao diện đẹp
  const characteristics = skinDetails.characteristics?.length > 0 
        ? skinDetails.characteristics 
        : ["Lỗ chân lông to, nhìn rõ bằng mắt thường", "Bề mặt da thường xuyên bóng dầu", "Dễ gặp các vấn đề về mụn"];
  
  const advices = skinDetails.advices?.length > 0 
        ? skinDetails.advices 
        : ["Làm sạch kép (Double Cleansing) mỗi tối", "Sử dụng kem chống nắng kiềm dầu, mỏng nhẹ", "Không bỏ qua bước dưỡng ẩm cấp nước"];

  const displayProducts = recommendedProducts.length > 0 ? recommendedProducts : BOTTOM_PRODUCTS;

  return (
    <MainLayout>
      <div className="font-sans min-h-screen bg-[#FDFBFB]">
        <div className="container mx-auto px-4 py-12 animate-in fade-in duration-700 max-w-6xl">
            
            <div className="flex flex-col lg:flex-row gap-8 mb-16">
                
                {/* === CỘT TRÁI (KẾT QUẢ CHÍNH) === */}
                <div className="w-full lg:w-2/3 space-y-6">
                    
                    {/* Header */}
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black text-[#3D021E] mb-2 uppercase tracking-wide">
                            KẾT QUẢ: {skinDetails.name || skinDetails.title || skinTypeCode || "Đang xử lý"}
                        </h1>
                        <p className="text-gray-500 text-sm">
                            Dựa trên phân tích AI từ hình ảnh và thói quen sinh hoạt của bạn
                        </p>
                    </div>

                    {/* Score & Nội dung */}
                    <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
                        <div className="flex flex-col items-start gap-6">
                            <div className="inline-flex flex-col items-center justify-center border border-gray-100 bg-gray-50 rounded-2xl p-4 min-w-[120px]">
                                <span className="text-4xl font-black text-[#3D021E] mb-1">98%</span>
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Độ tin cậy</span>
                                <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" /> AI POWER
                                </span>
                            </div>
                            
                            <div className="border-l-4 border-gray-200 pl-5 py-1">
                                <p className="text-gray-700 leading-relaxed font-medium">
                                    {skinDetails.description || skinDetails.summary || "Làn da của bạn cần được chăm sóc đặc biệt để duy trì sự cân bằng tự nhiên và khỏe mạnh từ sâu bên trong."}
                                </p>
                            </div>
                            
                            <button 
                                onClick={() => navigate('/skin-quiz')} 
                                className="bg-[#3D021E] text-white px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-[#5a032d] transition-colors shadow-md mt-2"
                            >
                                <RotateCcw className="w-4 h-4" /> Làm lại Quiz
                            </button>
                        </div>
                    </div>

                    {/* Đặc điểm & Lời khuyên */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-[#3D021E] text-lg mb-6 flex items-center gap-3">
                                <BarChart2 className="w-6 h-6" /> Đặc điểm nhận biết
                            </h3>
                            <ul className="space-y-4 text-sm text-gray-600 font-medium">
                                {characteristics.map((char: string, i: number) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <CheckCircle2 className="w-3 h-3 text-gray-500" />
                                        </div>
                                        {char}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-[#3D021E] text-lg mb-6 flex items-center gap-3">
                                <Lightbulb className="w-6 h-6" /> Lời khuyên chăm sóc
                            </h3>
                            <ul className="space-y-4 text-sm text-gray-600 font-medium">
                                {advices.map((advice: string, i: number) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <Sparkles className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                        {advice}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* ĐÃ KHÔI PHỤC LẠI: Khối Thành phần Nên / Không Nên */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                        <div>
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4 block">NÊN SỬ DỤNG (RECOMMENDED)</span>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-[#EFFFEE] border border-[#C5EFCC] rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                                    <h4 className="font-bold text-[#147A42] text-lg mb-1">BHA</h4>
                                    <p className="text-[10px] font-bold text-[#147A42] uppercase tracking-wider">Làm sạch sâu</p>
                                </div>
                                <div className="bg-[#EFFFEE] border border-[#C5EFCC] rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                                    <h4 className="font-bold text-[#147A42] text-lg mb-1">Niacinamide</h4>
                                    <p className="text-[10px] font-bold text-[#147A42] uppercase tracking-wider">Kiểm soát dầu</p>
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4 block">NÊN TRÁNH (AVOID)</span>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-[#FFF0F0] border border-[#FAD4D4] rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                                    <h4 className="font-bold text-[#C81E1E] text-lg mb-1">Hương liệu</h4>
                                    <p className="text-[10px] font-bold text-[#C81E1E] uppercase tracking-wider">Gây kích ứng</p>
                                </div>
                                <div className="bg-[#FFF0F0] border border-[#FAD4D4] rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                                    <h4 className="font-bold text-[#C81E1E] text-lg mb-1">Cồn khô</h4>
                                    <p className="text-[10px] font-bold text-[#C81E1E] uppercase tracking-wider">Làm mất độ ẩm</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* === CỘT PHẢI (SIDEBAR) === */}
                <div className="w-full lg:w-1/3 space-y-6">
                    {/* Banner Sale */}
                    <div className="bg-[#3D021E] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                        <span className="bg-white/20 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest mb-4 inline-block relative z-10">
                            Ưu đãi độc quyền
                        </span>
                        <h3 className="text-3xl font-serif font-bold mb-4 leading-tight relative z-10">
                            Giảm ngay 5% cho đơn hàng tiếp theo
                        </h3>
                        <p className="text-sm text-white/70 mb-8 relative z-10 leading-relaxed">
                            Đã áp dụng tự động cho các sản phẩm phù hợp với làn da của bạn.
                        </p>
                        <Link to="/products" className="w-full bg-white text-[#3D021E] font-bold py-4 rounded-xl hover:bg-gray-100 transition-colors shadow-lg relative z-10 block text-center">
                            Mua sắm ngay
                        </Link>
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-pink-500 opacity-20 rounded-full blur-3xl"></div>
                    </div>

                    {/* ĐÃ KHÔI PHỤC LẠI: Khối Dành riêng cho bạn */}
                    <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-[#3D021E] text-lg mb-6">Dành riêng cho bạn</h3>
                        <div className="space-y-6">
                            {SIDEBAR_PRODUCTS.map((item) => (
                                <Link to={`/product/${item.id}`} key={item.id} className="flex items-center gap-4 group cursor-pointer block">
                                    <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                                        <img src={item.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt={item.name} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">{item.brand}</p>
                                        <h4 className="text-sm font-bold text-gray-900 line-clamp-1 group-hover:text-[#3D021E] transition-colors">{item.name}</h4>
                                        <div className="flex items-center justify-between mt-1.5">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold text-[#3D021E]">{item.price}</span>
                                                <span className="text-[10px] font-bold text-gray-400 line-through">{item.oldPrice}</span>
                                            </div>
                                            <span className="text-xs font-bold text-gray-800 flex items-center gap-1 group-hover:text-[#3D021E] transition-colors">Mua ngay <ArrowRight className="w-3 h-3"/></span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

            </div>

            {/* === BỘ SẢN PHẨM KHUYÊN DÙNG === */}
            <div className="border-t border-gray-200 pt-16">
                <div className="flex justify-between items-end mb-10">
                    <h2 className="text-3xl font-serif font-bold text-[#3D021E]">Bộ sản phẩm khuyên dùng</h2>
                    <Link to="/products" className="text-sm font-bold text-gray-500 hover:text-[#3D021E] underline underline-offset-4 transition-colors">Xem tất cả sản phẩm</Link>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {displayProducts.map((item: any) => (
                        <Link to={`/product/${item.id}`} key={item.id} className="bg-white border border-gray-100 rounded-[2rem] p-5 hover:shadow-xl transition-all duration-300 cursor-pointer group block">
                            <div className="aspect-square bg-gray-50 rounded-2xl mb-5 overflow-hidden border border-gray-100">
                                <img src={item.imageUrl || item.img || "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=300"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={item.name} />
                            </div>
                            <h3 className="font-bold text-sm text-gray-900 mb-2 text-center group-hover:text-[#3D021E] transition-colors line-clamp-2">{item.name}</h3>
                            <p className="text-[#3D021E] font-bold text-center">
                                {/* Xử lý linh hoạt định dạng giá từ C# hoặc dữ liệu tĩnh */}
                                {typeof item.price === 'number' ? `${item.price.toLocaleString('vi-VN')}đ` : item.price}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>

        </div>
      </div>
    </MainLayout>
  );
};