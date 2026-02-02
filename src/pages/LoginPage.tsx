import { Link } from 'react-router-dom';
import { Facebook } from 'lucide-react';
import { Header } from '../components/layout/Header'; // 1. Import Header

const GoogleIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12.5S6.42 23 12.1 23c5.83 0 8.84-4.15 8.84-10.24 0-.68-.04-1.09-.04-1.09z"/></svg>
);

export const LoginPage = () => {
  return (
    // 2. Thay đổi container chính: flex-col để Header nằm trên, nội dung nằm dưới
    <div className="flex flex-col min-h-screen">
      
      {/* 3. Chèn Header vào đầu */}
      <Header />

      {/* 4. Phần nội dung chính (Split Screen) chiếm hết chiều cao còn lại (flex-1) */}
      <div className="flex flex-1">
          
          {/* Bên Trái: Form */}
          <div className="w-full md:w-1/2 bg-[#330511] flex items-center justify-center p-8">
            <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md animate-in slide-in-from-left duration-700">
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Đăng nhập vào Glow Aura</h2>
                
                <form className="space-y-4">
                    <div>
                        <input type="text" placeholder="Email or Phone" className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors rounded-sm" />
                    </div>
                    <div>
                        <input type="password" placeholder="Password" className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors rounded-sm" />
                    </div>
                    <div className="flex justify-between items-center text-xs">
                        <a href="#" className="text-gray-400 hover:text-primary transition-colors">Quên Password?</a>
                    </div>
                    <button className="w-full bg-black text-white py-3 text-sm font-bold uppercase tracking-wider hover:bg-primary transition-colors">
                        Đăng nhập
                    </button>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <button type="button" className="flex items-center justify-center gap-2 bg-[#333] text-white py-2 text-xs hover:bg-black transition-colors">
                             <GoogleIcon /> Google
                        </button>
                        <button type="button" className="flex items-center justify-center gap-2 bg-[#3b5998] text-white py-2 text-xs hover:opacity-90 transition-colors">
                             <Facebook className="w-4 h-4" /> Facebook
                        </button>
                    </div>
                </form>

                <div className="mt-6 text-center text-xs text-gray-500">
                    Bạn chưa có tài khoản? <Link to="/register" className="text-primary font-bold hover:underline">Đăng ký</Link>
                </div>
            </div>
          </div>

          {/* Bên Phải: Hình ảnh */}
          <div className="hidden md:block w-1/2 relative">
             <img 
                src="https://int.filorga.com/wp-content/uploads/sites/2/2024/11/FILORGA-prend-soin-de-la-peau-des-femmes-et-des-hommes-1079x1080.jpg" 
                alt="Login Cover" 
                className="absolute inset-0 w-full h-full object-cover"
             />
          </div>
      </div>
    </div>
  );
};