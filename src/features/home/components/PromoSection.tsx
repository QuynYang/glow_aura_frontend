import { useNavigate } from 'react-router-dom';

export const PromoSection = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-[#3D021E] overflow-hidden">
      <div className="container mx-auto px-4 md:px-0">
        <div className="flex flex-col md:flex-row items-center">
          
          {/* Cột nội dung (Text) */}
          <div className="w-full md:w-1/2 py-16 px-4 md:pl-16 lg:pl-24 text-white">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 leading-tight">
              AI phân tích chăm sóc da
            </h2>
            <p className="text-gray-300 mb-10 leading-relaxed text-sm md:text-base max-w-md">
              Bạn đang tìm kiếm quy trình dưỡng da hoàn hảo? Công cụ phân tích da ảo AI của chúng tôi sẽ đánh giá làn da và đưa ra gợi ý cá nhân hóa nhất.
            </p>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="bg-white p-2 rounded-lg w-28 h-28 flex-shrink-0">
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=GlowAuraApp" alt="QR" className="w-full h-full"/>
                </div>
                <div className="flex flex-col space-y-3">
                  <p className="font-bold text-sm uppercase tracking-widest">Quét mã bằng điện thoại</p>
                  <span className="text-xs text-gray-400">Hoặc</span>
                  
                  {/* SỬA NÚT CHUYỂN HƯỚNG TẠI ĐÂY */}
                  <button 
                    onClick={() => navigate('/skin-quiz')}
                    className="border border-white text-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-[#3D021E] transition-colors w-fit"
                  >
                    Trả lời câu hỏi
                  </button>
                </div>
            </div>
          </div>

          {/* Cột ảnh (Image) */}
          <div className="w-full md:w-1/2 h-[400px] md:h-[600px]">
            <img 
              src="https://shaunstore.com.vn/wp-content/uploads/2023/07/z4543200294754_f652e9cc028952b5481707928cd63543.jpg" 
              alt="Skincare AI" 
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>
      </div>
    </section>
  );
};