import { Link } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { ArrowLeft } from 'lucide-react'; // Icon mũi tên quay lại

export const ForgotPasswordPage = () => {
  return (
    <div className="flex flex-col min-h-screen font-sans">
      
      {/* 1. Header (Giữ sự đồng bộ) */}
      <Header />

      <div className="flex flex-1">
        
        {/* === CỘT TRÁI: FORM (Nền đỏ rượu, Card trắng) === */}
        <div className="w-full md:w-1/2 bg-[#330511] flex items-center justify-center p-8">
          
          {/* Card trắng chứa Form */}
          <div className="bg-white p-10 md:p-12 shadow-2xl w-full max-w-[500px] animate-in slide-in-from-left duration-700 rounded-sm">
             
             {/* Tiêu đề */}
             <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">
                Quên Mật Khẩu?
             </h2>
             
             {/* Mô tả */}
             <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                Đừng lo lắng. Hãy nhập địa chỉ email đã đăng ký tài khoản, chúng tôi sẽ gửi cho bạn đường dẫn để đặt lại mật khẩu mới.
             </p>

             <form className="space-y-6">
                {/* Input Email */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                        Địa chỉ Email
                    </label>
                    <input 
                        type="email" 
                        placeholder="vidu@email.com" 
                        className="w-full border border-gray-300 px-4 py-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all rounded-sm bg-gray-50"
                    />
                </div>

                {/* Nút Gửi */}
                <button className="w-full bg-black text-white py-4 text-sm font-bold uppercase tracking-wider hover:bg-primary transition-colors shadow-lg">
                    Gửi Link Khôi Phục
                </button>
             </form>

             {/* Footer: Quay lại Login */}
             <div className="mt-8 text-center border-t border-gray-100 pt-6">
                <span className="text-sm text-gray-500">Bạn đã nhớ ra mật khẩu? </span>
                <Link to="/login" className="text-black font-bold text-sm hover:underline inline-flex items-center gap-1 ml-1 hover:text-primary transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Quay lại Đăng Nhập
                </Link>
             </div>
          </div>
        </div>

        {/* === CỘT PHẢI: ẢNH + SLOGAN (Giống thiết kế) === */}
        <div className="hidden md:block w-1/2 relative bg-gray-100">
           {/* Ảnh nền Full chiều cao */}
           <img 
              src="https://m.lamer.eu/media/export/cms/2022LaMer/MPP/MPP_Hero_Banner/LM_FY23_2022_Face_MPP_Redesign_Desktop_Header_Module_Slice.jpg" // Ảnh serum/tay cầm giống mẫu
              alt="Forgot Password Cover" 
              className="absolute inset-0 w-full h-full object-cover"
           />
           
           {/* Lớp phủ mờ nhẹ để chữ dễ đọc hơn */}
           <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

           {/* Slogan nghệ thuật ở góc dưới (Giống ảnh mẫu) */}
           <div className="absolute bottom-16 left-12 max-w-md text-white animate-in slide-in-from-bottom duration-1000 delay-300">
               <h3 className="text-4xl font-serif font-medium leading-tight italic">
                   "Đánh thức vẻ đẹp rạng ngời tiềm ẩn bên trong bạn cùng Glow Aura."
               </h3>
               <div className="w-16 h-1 bg-white mt-6"></div> {/* Gạch chân trang trí */}
           </div>
        </div>

      </div>
    </div>
  );
};