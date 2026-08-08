import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, Loader2, Eye, EyeOff } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { authService } from '../services/authService';

export const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const emailFromQuery = searchParams.get('email') ?? '';
  const tokenFromQuery = searchParams.get('token') ?? '';

  const [email, setEmail] = useState(emailFromQuery);
  const [token] = useState(tokenFromQuery);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !token) {
      setError('Liên kết không hợp lệ. Vui lòng yêu cầu gửi lại email khôi phục.');
      return;
    }

    if (newPassword.length < 8) {
      setError('Mật khẩu mới phải có ít nhất 8 ký tự.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Xác nhận mật khẩu không khớp.');
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword({
        email,
        token,
        newPassword,
        confirmNewPassword: confirmPassword,
      });
      setSuccess('Đặt lại mật khẩu thành công! Đang chuyển đến trang đăng nhập...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message?: string }).message)
          : 'Đặt lại mật khẩu thất bại. Liên kết có thể đã hết hạn.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans">
      <Header />

      <div className="flex flex-1">
        <div className="w-full md:w-1/2 bg-[#330511] flex items-center justify-center p-8">
          <div className="bg-white p-10 md:p-12 shadow-2xl w-full max-w-[500px] rounded-sm">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Đặt Lại Mật Khẩu</h2>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
              Nhập mật khẩu mới cho tài khoản của bạn.
            </p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded text-sm text-red-800">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded text-sm text-green-800">
                {success}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border border-gray-300 px-4 py-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary rounded-sm bg-gray-50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Mật khẩu mới</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={8}
                    className="w-full border border-gray-300 px-4 py-4 pr-12 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary rounded-sm bg-gray-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Xác nhận mật khẩu</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full border border-gray-300 px-4 py-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary rounded-sm bg-gray-50"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white py-4 text-sm font-bold uppercase tracking-wider hover:bg-primary transition-colors shadow-lg disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                Cập Nhật Mật Khẩu
              </button>
            </form>

            <div className="mt-8 text-center border-t border-gray-100 pt-6">
              <Link
                to="/login"
                className="text-black font-bold text-sm hover:underline inline-flex items-center gap-1 hover:text-primary transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Quay lại Đăng Nhập
              </Link>
            </div>
          </div>
        </div>

        <div className="hidden md:block w-1/2 relative bg-gray-100">
          <img
            src="https://m.lamer.eu/media/export/cms/2022LaMer/MPP/MPP_Hero_Banner/LM_FY23_2022_Face_MPP_Redesign_Desktop_Header_Module_Slice.jpg"
            alt="Reset Password Cover"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>
      </div>
    </div>
  );
};
