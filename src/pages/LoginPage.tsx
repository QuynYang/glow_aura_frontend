import { Link, useNavigate } from 'react-router-dom';
import { Facebook, Loader2, Eye, EyeOff } from 'lucide-react'; // 1. Import thêm Eye và EyeOff
import { Header } from '../components/layout/Header';
import { useState } from 'react';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import type { User } from '../context/AuthContext';

const GoogleIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12.5S6.42 23 12.1 23c5.83 0 8.84-4.15 8.84-10.24 0-.68-.04-1.09-.04-1.09z"/></svg>
);

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // 2. Thêm state để quản lý trạng thái ẩn/hiện mật khẩu
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
        const data = await authService.login(email, password);

        if (data.user) {
            login(data.user as User);
        }

        if (String(data.user?.role).toLowerCase() === 'admin') {
            alert('Chào mừng Quản trị viên!');
            navigate('/admin');
        } else {
            alert('Đăng nhập thành công!');
            navigate('/'); 
        }
    } catch (err: any) {
        console.error("Lỗi đăng nhập:", err);
        setError(err.message || 'Email hoặc mật khẩu không chính xác!');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
          <div className="w-full md:w-1/2 bg-[#330511] flex items-center justify-center p-8">
            <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md animate-in slide-in-from-left duration-700">
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Đăng nhập vào Glow Aura</h2>
                
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 text-sm rounded">
                        {error}
                    </div>
                )}

                <form className="space-y-4" onSubmit={handleLogin}>
                    <div>
                        <input 
                            type="text" 
                            placeholder="Email"
                            className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors rounded-sm"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                            required
                        />
                    </div>
                    
                    <div className="relative">
                        <input 
                            type={showPassword ? "text" : "password"} // Thay đổi type dựa trên state
                            placeholder="Mật khẩu"
                            className="w-full border border-gray-300 px-4 py-3 pr-10 text-sm focus:outline-none focus:border-primary transition-colors rounded-sm" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                            {showPassword ? (
                                <EyeOff className="w-5 h-5" />
                            ) : (
                                <Eye className="w-5 h-5" />
                            )}
                        </button>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                        <Link to="/forgot-password" className="text-gray-400 hover:text-primary transition-colors italic">
                            Quên mật khẩu?
                        </Link>
                    </div>

                    <button 
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center items-center gap-2 bg-black text-white py-3 text-sm font-bold uppercase tracking-wider hover:bg-primary transition-colors disabled:opacity-70"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                        {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
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

          <div className="hidden md:block w-1/2 relative">
             <img 
                src="https://img.freepik.com/premium-photo/beauty-skincare-black-woman-with-facial-product-cream-her-face-studio-with-brown-background-smile-afro-happy-african-model-with-natural-lotion-glowing-smooth-soft-skin_590464-94166.jpg" 
                alt="Login Cover" 
                className="absolute inset-0 w-full h-full object-cover"
             />
          </div>
      </div>
    </div>
  );
};