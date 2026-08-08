import { Link, useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { useState, useEffect, useRef, useCallback } from 'react';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import type { User } from '../context/AuthContext';
import { getPostLoginPath } from '../utils/authRoles';
import { Loader2, Eye, EyeOff, Facebook } from 'lucide-react';

const GoogleIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12.5S6.42 23 12.1 23c5.83 0 8.84-4.15 8.84-10.24 0-.68-.04-1.09-.04-1.09z"/></svg>
);
export const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

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

  const googleBtnRef = useRef<HTMLDivElement>(null);

  // Xử lý chung sau khi có data user + token trả về từ backend (dùng chung cho Google/Facebook)
  const handleSocialAuthSuccess = useCallback((data: { user?: unknown; message?: string }) => {
    if (!data?.user) {
      setError(data?.message || 'Đăng ký/Đăng nhập thất bại. Vui lòng thử lại.');
      return;
    }
    login(data.user as User);
    navigate(getPostLoginPath((data.user as User).role));
  }, [login, navigate]);

  const handleSocialError = (err: unknown, fallback: string) => {
    const message =
      err && typeof err === 'object' && 'message' in err
        ? String((err as { message?: string }).message)
        : fallback;
    setError(message || fallback);
  };

  // ----- GOOGLE -----
  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId || !window.google || !googleBtnRef.current) return;

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: async (response) => {
        setError('');
        setIsLoading(true);
        try {
          const data = await authService.loginWithGoogle(response.credential);
          handleSocialAuthSuccess(data);
        } catch (err) {
          handleSocialError(err, 'Đăng ký/Đăng nhập Google thất bại');
        } finally {
          setIsLoading(false);
        }
      },
    });

    window.google.accounts.id.renderButton(googleBtnRef.current, {
      theme: 'outline',
      size: 'large',
      width: 280,
    });
  }, [handleSocialAuthSuccess]);

  const triggerGoogleLogin = () => {
    const realButton = googleBtnRef.current?.querySelector<HTMLElement>('div[role="button"]');
    realButton?.click();
  };

  // ----- FACEBOOK -----
  useEffect(() => {
    const appId = import.meta.env.VITE_FACEBOOK_APP_ID;
    if (!appId) return;

    if (!document.getElementById('facebook-jssdk')) {
      const script = document.createElement('script');
      script.id = 'facebook-jssdk';
      script.src = 'https://connect.facebook.net/vi_VN/sdk.js';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }

    window.fbAsyncInit = () => {
      window.FB?.init({ appId, cookie: true, xfbml: false, version: 'v21.0' });
    };
  }, []);

  const handleFacebookLogin = () => {
    if (!window.FB) {
      setError('Facebook SDK chưa sẵn sàng, vui lòng thử lại sau giây lát.');
      return;
    }
    setError('');
    setIsLoading(true);
    window.FB.login(async (response) => {
      if (response.authResponse) {
        try {
          const data = await authService.loginWithFacebook(response.authResponse.accessToken);
          handleSocialAuthSuccess(data);
        } catch (err) {
          handleSocialError(err, 'Đăng ký/Đăng nhập Facebook thất bại');
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    }, { scope: 'public_profile,email' });
  };

  // Hàm xử lý khi bấm Đăng ký
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
        setError('Mật khẩu xác nhận không khớp!');
        return;
    }

    setIsLoading(true);

    try {
        // GỌI API ĐĂNG KÝ
        const data = await authService.register({
            fullName,
            email,
            phoneNumber,
            password,
            confirmPassword
        });

        if (data?.user) {
            login(data.user as User);
        }

        alert('Đăng ký thành công! Chào mừng bạn đến với Glow Aura.');
        navigate(getPostLoginPath((data.user as User | undefined)?.role));
    } catch (err: any) {
        console.error("Lỗi đăng ký:", err);
        if (err.errors && typeof err.errors === 'object') {
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

                  <div className="flex items-center gap-3 pt-2">
                      <div className="flex-1 h-px bg-white/20" />
                      <span className="text-xs text-gray-400 uppercase tracking-wider">Hoặc</span>
                      <div className="flex-1 h-px bg-white/20" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                      <button
                          type="button"
                          onClick={triggerGoogleLogin}
                          disabled={isLoading}
                          className="flex items-center justify-center gap-2 bg-[#333] text-white py-2 text-xs hover:bg-black transition-colors disabled:opacity-70"
                      >
                           <GoogleIcon /> Google
                      </button>
                      <button
                          type="button"
                          onClick={handleFacebookLogin}
                          disabled={isLoading}
                          className="flex items-center justify-center gap-2 bg-[#3b5998] text-white py-2 text-xs hover:opacity-90 transition-colors disabled:opacity-70"
                      >
                           <Facebook className="w-4 h-4" /> Facebook
                      </button>
                  </div>

                  {/* Nút Google thật của Google, ẩn đi — được "bấm hộ" khi user bấm nút custom phía trên */}
                  <div ref={googleBtnRef} style={{ position: 'absolute', top: '-9999px', left: '-9999px' }} />
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