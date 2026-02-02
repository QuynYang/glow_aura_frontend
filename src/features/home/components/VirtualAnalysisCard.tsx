import { ScanFace, ArrowRight } from 'lucide-react';

export const VirtualAnalysisCard = () => {
  return (
    <div className="h-full min-h-[450px] bg-primary text-white p-8 flex flex-col relative overflow-hidden group cursor-pointer">
      
      {/* Nội dung text */}
      <div className="relative z-10 space-y-4">
        <h3 className="text-2xl font-serif font-bold leading-tight">
          AI phân tích chăm sóc da
        </h3>
        <p className="text-sm text-gray-200 leading-relaxed opacity-90">
          Bạn đang tìm kiếm một quy trình chăm sóc da hoàn chỉnh? Công cụ phân tích da ảo MỚI của chúng tôi sẽ đánh giá làn da của bạn và đưa ra những khuyến nghị cá nhân hóa nhất.
        </p>
        
        <ul className="text-sm space-y-2 mt-2">
            <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                Chỉ có sẵn trên thiết bị di động
            </li>
        </ul>
      </div>

      {/* Hình ảnh cô gái scan mặt */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-56 mt-auto">
         {/* Giả lập vòng tròn scan khuôn mặt */}
         <div className="absolute inset-0 border border-white/30 rounded-[50%] animate-pulse"></div>
         <div className="absolute top-1/2 left-0 w-full h-0.5 bg-accent shadow-[0_0_10px_#C75B7A] animate-[scan_2s_ease-in-out_infinite]"></div>
         
         <img 
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqXA1n6Pgtpw4arL1esgP5wPfw93fKXiAAXQ&s" 
            alt="Quét khuôn mặt" 
            className="w-full h-full object-cover object-top mask-image-gradient"
            style={{ maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)' }}
         />
      </div>

      {/* QR Code & Call to Action ở dưới cùng */}
      <div className="relative z-10 mt-auto flex items-end justify-between">
         <span className="font-bold text-sm border-b border-transparent group-hover:border-white transition-all flex items-center gap-2">
            Quét để bắt đầu <ArrowRight className="w-4 h-4"/>
         </span>
         <div className="bg-white p-1 rounded-sm">
            {/* Ảnh QR Code mẫu */}
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BeautyaSkinAnalysis" alt="QR" className="w-16 h-16" />
         </div>
      </div>
    </div>
  );
};