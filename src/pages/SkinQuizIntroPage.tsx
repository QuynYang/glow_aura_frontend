import { useNavigate } from 'react-router-dom';
import { Wand2, CheckSquare, Tag, ArrowRight } from 'lucide-react';
import { MainLayout } from '../components/layout/MainLayout';

export const SkinQuizIntroPage = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="font-sans min-h-screen bg-white">
        
        {/* ========================================== */}
        {/* 1. HERO BANNER  */}
        {/* ========================================== */}
        <div className="max-w-[1200px] mx-auto px-4 pt-10 mb-20">
          <div className="bg-[#3D021E] rounded-[2.5rem] relative overflow-hidden flex min-h-[500px] shadow-lg">
            
            {/* Ảnh bên phải với Gradient mờ dần sang trái */}
            <div className="absolute top-0 right-0 w-full md:w-[60%] h-full">
                {/* Lớp phủ gradient để hòa trộn ảnh với nền đỏ mận */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#3D021E] via-[#3D021E]/80 to-transparent z-10"></div>
                <img 
                    src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1200" 
                    alt="Serum Routine" 
                    className="w-full h-full object-cover object-center"
                />
            </div>
            
            {/* Nội dung Text bên trái */}
            <div className="relative z-20 p-10 md:p-20 w-full md:w-[65%] flex flex-col justify-center items-start">
                <span className="bg-white/10 backdrop-blur-sm border border-white/10 text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest w-fit mb-6">
                    CÁ NHÂN HÓA BỞI AI
                </span>
                
                <h1 className="text-4xl md:text-6xl font-serif font-bold text-white leading-[1.1] mb-6">
                    Khám phá nhu cầu <br/> thực sự của làn da <br/> bạn
                </h1>
                
                <p className="text-white/80 text-sm md:text-base mb-10 max-w-md leading-relaxed font-light">
                    Công nghệ phân tích da bằng AI tiên tiến mang lại giải pháp cá nhân hóa hoàn hảo cho vẻ đẹp rạng rỡ của bạn từ bên trong.
                </p>
                
                <button 
                    onClick={() => navigate('/skin-quiz/test')}
                    className="bg-white text-[#3D021E] font-bold px-8 py-3.5 rounded-full text-sm hover:bg-gray-100 transition-colors w-fit flex items-center gap-2"
                >
                    Bắt đầu phân tích
                </button>
            </div>
          </div>
        </div>

        {/* ========================================== */}
        {/* 2. LỢI ÍCH ĐỘC QUYỀN  */}
        {/* ========================================== */}
        <div className="max-w-[1100px] mx-auto px-4 mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-[#3D021E]">Lợi ích độc quyền</h2>
            <div className="w-12 h-0.5 bg-gray-300 mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {[
                  { icon: Wand2, title: 'Phân tích da tức thì', desc: 'Nhận kết quả đánh giá tình trạng da chính xác chỉ sau vài giây phân tích AI.' },
                  { icon: CheckSquare, title: 'Lộ trình 4 bước cá nhân', desc: 'Quy trình chăm sóc chuyên biệt được thiết kế riêng cho từng vấn đề của bạn.' },
                  { icon: Tag, title: 'Ưu đãi đặc quyền', desc: 'Giảm ngay 5% cho tất cả các sản phẩm được đề xuất trong lộ trình cá nhân.' },
              ].map((item, idx) => (
                  <div key={idx} className="bg-[#3D021E] p-10 md:p-12 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300">
                      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 text-[#3D021E]">
                          <item.icon className="w-6 h-6 stroke-[1.5]" />
                      </div>
                      <h3 className="font-bold text-white mb-3 text-lg">{item.title}</h3>
                      <p className="text-sm text-gray-200 leading-relaxed px-2">{item.desc}</p>
                  </div>
              ))}
          </div>
        </div>

        {/* ========================================== */}
        {/* 3. QUY TRÌNH THỰC HIỆN */}
        {/* ========================================== */}
        <div className="w-full bg-[#3D021E] py-24 px-4 border-y border-gray-100">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-serif font-bold text-white mb-3">Quy trình thực hiện</h2>
            <p className="text-sm text-gray-200 mb-20 font-medium">Đơn giản, khoa học và hoàn toàn miễn phí</p>

            <div className="relative">
                {/* Đường kẻ ngang mảnh */}
                <div className="hidden md:block absolute top-7 left-[15%] right-[15%] h-[2px] bg-white z-0"></div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
                    {[
                        { step: '1', title: 'Làm khảo sát', desc: 'Trả lời các câu hỏi nhanh về thói quen và cảm nhận làn da.' },
                        { step: '2', title: 'Phân tích AI', desc: 'Hệ thống AI đối chiếu dữ liệu với hàng nghìn tình trạng da tương đồng.' },
                        { step: '3', title: 'Nhận phác đồ', desc: 'Sở hữu lộ trình dưỡng da chuyên biệt cùng bộ sản phẩm phù hợp nhất.' },
                    ].map((item) => (
                        <div key={item.step} className="flex flex-col items-center bg-[#3D021E]">
                            <div className="w-14 h-14 rounded-full bg-[#3D021E] text-white flex items-center justify-center font-bold text-lg mb-6 shadow-md ring-[10px] ring-[#FDFBFB]">
                                {item.step}
                            </div>
                            <h3 className="font-bold text-gray-100 mb-3">{item.title}</h3>
                            <p className="text-sm text-gray-200 leading-relaxed px-4">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
          </div>
        </div>

        {/* ========================================== */}
        {/* 4. CALL TO ACTION (Giống ảnh image_0b1db4.png) */}
        {/* ========================================== */}
        <div className="max-w-[1000px] mx-auto px-4 py-24">
          <div className="bg-[#3D021E] rounded-[2.5rem] p-16 md:p-20 text-center text-white shadow-2xl relative overflow-hidden">
            {/* Nội dung */}
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Sẵn sàng để tỏa sáng?</h2>
              <p className="text-white/80 text-sm md:text-base mb-10 max-w-lg mx-auto leading-relaxed">
                  Tham gia ngay skin quiz và nhận lộ trình thay đổi làn da của bạn chỉ trong 4 tuần.
              </p>
              <button 
                  onClick={() => navigate('/skin-quiz/test')}
                  className="bg-white text-[#3D021E] font-bold px-8 py-3.5 rounded-full text-sm hover:bg-gray-100 transition-colors shadow-lg flex items-center gap-2 mx-auto"
              >
                  Bắt đầu phân tích ngay <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Hiệu ứng ánh sáng trang trí (Decorations) */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-pink-500 opacity-10 rounded-full blur-3xl translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
          </div>
        </div>

      </div>
    </MainLayout>
  );
};