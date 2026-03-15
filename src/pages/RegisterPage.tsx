import { Link, useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { useState } from 'react';
import { authService } from '../services/authService';
import { Loader2, Eye, EyeOff } from 'lucide-react'; 

export const RegisterPage = () => {
  const navigate = useNavigate();

  // Quản lý State cho form
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // State xử lý UI
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Hàm xử lý khi bấm Đăng ký
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Kiểm tra nhanh ở Frontend trước khi gửi API
    if (password !== confirmPassword) {
        setError('Mật khẩu xác nhận không khớp!');
        return;
    }

    setIsLoading(true);

    try {
        // GỌI API ĐĂNG KÝ
        await authService.register({
            fullName,
            email,
            phoneNumber,
            password,
            confirmPassword
        });

        alert('Đăng ký thành công! Chào mừng bạn đến với Glow Aura.');
        navigate('/'); // Đăng ký xong (có token luôn) thì về Trang chủ
    } catch (err: any) {
        console.error("Lỗi đăng ký:", err);
        // Backend có thể trả về lỗi dạng mảng (nhiều lỗi) hoặc chuỗi
        if (err.errors && typeof err.errors === 'object') {
             // Lấy lỗi đầu tiên trong mảng lỗi validation của ASP.NET
             const firstErrorKey = Object.keys(err.errors)[0];
             setError(err.errors[firstErrorKey][0]);
        } else {
             setError(err.message || 'Có lỗi xảy ra, vui lòng thử lại email/số điện thoại khác!');
        }
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="flex flex-1">
        
        <div className="hidden md:block w-1/2 relative">
           <img 
              src="https://media.glamourmagazine.co.uk/photos/6877cd7d536be3277df31c3f/1:1/w_2560%2Cc_limit/SKINCARE%2520160725%2520MAIN-GettyImages-1140452321.jpg" 
              alt="Register Cover" 
              className="absolute inset-0 w-full h-full object-cover"
           />
        </div>

        
        <div className="w-full md:w-1/2 bg-[#330511] flex items-center justify-center p-8 md:p-16 text-white overflow-y-auto">
          <div className="w-full max-w-md animate-in slide-in-from-right duration-700 my-auto">
              <h2 className="text-3xl font-serif font-bold mb-2 text-center md:text-left">Tạo tài khoản của bạn</h2>
              <p className="text-gray-400 text-sm mb-6 text-center md:text-left">Hãy gia nhập cộng đồng Glow Aura ngay hôm nay!</p>
              
              {/* Hiển thị lỗi */}
              {error && (
                  <div className="mb-6 p-3 bg-red-500/10 border border-red-500 text-red-200 text-sm rounded">
                      {error}
                  </div>
              )}

              <form className="space-y-4" onSubmit={handleRegister}>
                  <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider">Họ và Tên</label>
                      <input 
                        type="text" 
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        disabled={isLoading}
                        required
                        className="w-full bg-white text-gray-900 px-4 py-3 text-sm focus:outline-none border-2 border-transparent focus:border-accent rounded-sm" 
                      />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                          <label className="text-xs font-bold uppercase tracking-wider">Email</label>
                          <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                            required
                            className="w-full bg-white text-gray-900 px-4 py-3 text-sm focus:outline-none border-2 border-transparent focus:border-accent rounded-sm" 
                          />
                      </div>
                      <div className="space-y-1">
                          <label className="text-xs font-bold uppercase tracking-wider">Số điện thoại</label>
                          <input 
                            type="tel" 
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            disabled={isLoading}
                            required
                            className="w-full bg-white text-gray-900 px-4 py-3 text-sm focus:outline-none border-2 border-transparent focus:border-accent rounded-sm" 
                          />
                      </div>
                  </div>

                  <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider">Password</label>
                      <div className="relative">
                          <input 
                            type={showPassword ? "text" : "password"} 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                            required
                            minLength={6}
                            className="w-full bg-white text-gray-900 px-4 py-3 pr-10 text-sm focus:outline-none border-2 border-transparent focus:border-accent rounded-sm" 
                          />
                          <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                          >
                              {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                          </button>
                      </div>
                  </div>

                  <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider">Xác nhận Password</label>
                      <div className="relative">
                          <input 
                            type={showConfirmPassword ? "text" : "password"} 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={isLoading}
                            required
                            minLength={6}
                            className="w-full bg-white text-gray-900 px-4 py-3 pr-10 text-sm focus:outline-none border-2 border-transparent focus:border-accent rounded-sm" 
                          />
                          <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                          >
                              {showConfirmPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                          </button>
                      </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                      <input type="checkbox" id="newsletter" className="w-4 h-4 accent-primary cursor-pointer" />
                      <label htmlFor="newsletter" className="text-xs text-gray-300 cursor-pointer select-none">Đăng ký nhận bản tin của chúng tôi</label>
                  </div>

                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center items-center gap-2 bg-black text-white py-3 text-sm font-bold uppercase tracking-wider hover:bg-primary transition-colors mt-4 shadow-lg border border-gray-800 disabled:opacity-70"
                  >
                      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                      {isLoading ? 'ĐANG XỬ LÝ...' : 'ĐĂNG KÝ'}
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