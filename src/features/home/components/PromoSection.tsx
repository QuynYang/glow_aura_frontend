import { Button } from '@/components/ui/Button';

export const PromoSection = () => {
  return (
    <section className="bg-primary overflow-hidden">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center">
          
          {/* Cột nội dung (Text) */}
          <div className="w-full md:w-1/2 py-16 px-8 md:pl-12 text-white">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              NEW Virtual Skincare Analysis
            </h2>
            <p className="text-gray-300 mb-8 leading-relaxed max-w-lg">
              Bạn đang tìm kiếm quy trình dưỡng da hoàn hảo? Công cụ phân tích da ảo AI của chúng tôi sẽ đánh giá làn da và đưa ra gợi ý cá nhân hóa nhất.
            </p>
            
            <div className="flex items-center gap-6">
               <div className="bg-white p-2 rounded-lg w-24 h-24 flex-shrink-0">
                  {/* Mock QR Code */}
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Example" alt="QR" className="w-full h-full"/>
               </div>
               <div>
                 <p className="font-bold mb-2 text-sm uppercase tracking-wider">Quét mã bằng điện thoại</p>
                 <span className="text-xs text-gray-400 block mb-2">Hoặc</span>
                 <Button variant="white" className="py-2 px-4 text-xs">Trả lời câu hỏi</Button>
               </div>
            </div>
          </div>

          {/* Cột ảnh (Image) - Tràn viền */}
          <div className="w-full md:w-1/2 h-[500px]">
            <img 
              src="https://shaunstore.com.vn/wp-content/uploads/2023/07/z4543200294754_f652e9cc028952b5481707928cd63543.jpg" 
              alt="Skincare Models" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};