import { Link } from 'react-router-dom';
import { Header } from '../components/layout/Header'; // Import Header

export const RegisterPage = () => {
  return (
    // Container chính xếp dọc
    <div className="flex flex-col min-h-screen">
      
      {/* Header nằm trên cùng */}
      <Header />

      {/* Nội dung chính xếp ngang (flex-row) và chiếm hết chỗ trống */}
      <div className="flex flex-1">
        
        {/* Bên Trái: Hình ảnh */}
        <div className="hidden md:block w-1/2 relative">
           <img 
              src="https://media.glamourmagazine.co.uk/photos/6877cd7d536be3277df31c3f/1:1/w_2560%2Cc_limit/SKINCARE%2520160725%2520MAIN-GettyImages-1140452321.jpg" 
              alt="Register Cover" 
              className="absolute inset-0 w-full h-full object-cover"
           />
        </div>

        {/* Bên Phải: Form */}
        <div className="w-full md:w-1/2 bg-[#330511] flex items-center justify-center p-8 md:p-16 text-white">
          <div className="w-full max-w-md animate-in slide-in-from-right duration-700">
              <h2 className="text-3xl font-serif font-bold mb-2 text-center md:text-left">Tạo tài khoản của bạn</h2>
              <p className="text-gray-400 text-sm mb-8 text-center md:text-left">Hãy gia nhập cộng đồng Glow Aura ngay hôm nay!</p>
              
              <form className="space-y-5">
                  <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider">Tên</label>
                      <input type="text" className="w-full bg-white text-gray-900 px-4 py-3 text-sm focus:outline-none border-2 border-transparent focus:border-accent rounded-sm" />
                  </div>
                  <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider">Email</label>
                      <input type="email" className="w-full bg-white text-gray-900 px-4 py-3 text-sm focus:outline-none border-2 border-transparent focus:border-accent rounded-sm" />
                  </div>
                  <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider">Password</label>
                      <input type="password" className="w-full bg-white text-gray-900 px-4 py-3 text-sm focus:outline-none border-2 border-transparent focus:border-accent rounded-sm" />
                  </div>
                  <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider">Xác nhận Password</label>
                      <input type="password" className="w-full bg-white text-gray-900 px-4 py-3 text-sm focus:outline-none border-2 border-transparent focus:border-accent rounded-sm" />
                  </div>
                  <div className="flex items-center gap-2">
                      <input type="checkbox" id="newsletter" className="w-4 h-4 accent-primary cursor-pointer" />
                      <label htmlFor="newsletter" className="text-xs text-gray-300 cursor-pointer select-none">Đăng ký nhận bản tin của chúng tôi</label>
                  </div>
                  <button className="w-full bg-black text-white py-3 text-sm font-bold uppercase tracking-wider hover:bg-primary transition-colors mt-4 shadow-lg border border-gray-800">
                      Đăng ký
                  </button>
              </form>

              <div className="mt-6 text-center text-xs text-gray-400">
                  Bạn đã có tài khoản chưa? <Link to="/login" className="text-white font-bold hover:underline">Đăng nhập tại đây</Link>
              </div>
          </div>
        </div>

      </div>
    </div>
  );
};