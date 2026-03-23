import { useState } from 'react';
import { Lock, Eye, EyeOff, Save, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { MainLayout } from '../components/layout/MainLayout';
import { ProfileSidebar } from '../features/user/components/ProfileSidebar';
import { authService } from '../services/authService'; // Import service gọi API

export const ChangePasswordPage = () => {
  // State hiển thị/ẩn mật khẩu
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // State lưu dữ liệu form
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // State trạng thái xử lý
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Xóa thông báo lỗi khi user bắt đầu gõ lại
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // 1. Validate cơ bản ở Frontend
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setError('Vui lòng điền đầy đủ các trường.');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Xác nhận mật khẩu mới không khớp.');
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      setError('Mật khẩu mới không được trùng với mật khẩu hiện tại.');
      return;
    }

    // 2. Gọi API xử lý
    setIsLoading(true);
    try {
      
      await authService.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmNewPassword: formData.confirmPassword 
      });

      // Thành công: Hiện thông báo và xóa trắng form
      setSuccess('Đổi mật khẩu thành công! Hãy sử dụng mật khẩu mới cho lần đăng nhập sau.');
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      console.error("Lỗi đổi mật khẩu:", err);
      // Hiển thị lỗi từ Backend (ví dụ: "Mật khẩu hiện tại không đúng")
      // Hiển thị lỗi từ Backend (ví dụ: "Mật khẩu hiện tại không đúng")
      let errorMessage = 'Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu hiện tại.';
      const responseData = err.response?.data;

      if (responseData) {
          if (typeof responseData === 'string') {
              errorMessage = responseData; // Nếu C# trả về string thuần
          } else if (responseData.message) {
              errorMessage = responseData.message; // Nếu C# có trả message
          } else if (responseData.errors) {
              // Nếu là lỗi Validation (400) từ C# -> Lấy dòng lỗi đầu tiên ra
              const firstErrorKey = Object.keys(responseData.errors)[0];
              errorMessage = responseData.errors[firstErrorKey][0];
          } else if (responseData.title) {
              errorMessage = responseData.title;
          }
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen py-10 font-sans">
        <div className="container mx-auto px-4 max-w-[1200px]">
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8">Tài khoản của tôi</h1>

          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* 1. Sidebar */}
            <ProfileSidebar activePage="password" />

            {/* 2. Main Content */}
            <div className="w-full lg:w-3/4">
              <div className="bg-white rounded-[2rem] shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[500px] border border-gray-100">
                
                {/* --- FORM ĐỔI MẬT KHẨU --- */}
                <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center">
                    <h2 className="text-2xl font-serif font-bold text-[#3D021E] mb-2">Đổi mật khẩu</h2>
                    <p className="text-sm text-gray-500 mb-6">Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác.</p>
                    
                    {/* Khu vực thông báo lỗi / thành công */}
                    {error && (
                      <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 animate-in fade-in">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-800 font-medium">{error}</p>
                      </div>
                    )}

                    {success && (
                      <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-xl flex items-start gap-3 animate-in fade-in">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-green-800 font-medium">{success}</p>
                      </div>
                    )}

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {/* Mật khẩu hiện tại */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Mật khẩu hiện tại</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input 
                                    type={showCurrent ? "text" : "password"} 
                                    name="currentPassword"
                                    value={formData.currentPassword}
                                    onChange={handleChange}
                                    placeholder="Nhập mật khẩu hiện tại"
                                    className="w-full bg-gray-50 border border-gray-200 pl-11 pr-10 py-3.5 text-sm rounded-xl focus:outline-none focus:bg-white focus:border-[#3D021E] transition-colors"
                                    disabled={isLoading}
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowCurrent(!showCurrent)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#3D021E] transition-colors"
                                >
                                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Mật khẩu mới */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Mật khẩu mới</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input 
                                    type={showNew ? "text" : "password"} 
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    placeholder="Nhập mật khẩu mới"
                                    className="w-full bg-gray-50 border border-gray-200 pl-11 pr-10 py-3.5 text-sm rounded-xl focus:outline-none focus:bg-white focus:border-[#3D021E] transition-colors"
                                    disabled={isLoading}
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowNew(!showNew)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#3D021E] transition-colors"
                                >
                                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Xác nhận mật khẩu mới */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Xác nhận mật khẩu mới</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input 
                                    type={showConfirm ? "text" : "password"} 
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Nhập lại mật khẩu mới"
                                    className="w-full bg-gray-50 border border-gray-200 pl-11 pr-10 py-3.5 text-sm rounded-xl focus:outline-none focus:bg-white focus:border-[#3D021E] transition-colors"
                                    disabled={isLoading}
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#3D021E] transition-colors"
                                >
                                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Nút Submit */}
                        <div className="pt-4">
                            <button 
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-[#3D021E] hover:bg-[#5a032d] text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        Cập Nhật Mật Khẩu
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* --- HÌNH ẢNH --- */}
                <div className="hidden md:block w-1/2 relative bg-gray-100">
                    <img 
                        src="https://img.freepik.com/free-photo/beauty-portrait-ginger-woman-with-flower-hair-touching-her-face_176420-19207.jpg" 
                        alt="Change Password Banner" 
                        className="absolute inset-0 w-full h-full object-cover mix-blend-multiply"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#3D021E]/60 to-transparent"></div>
                    <div className="absolute bottom-10 left-10 right-10 text-white">
                        <h3 className="font-serif font-bold text-2xl mb-2">Bảo vệ nhan sắc, bảo vệ cả tài khoản.</h3>
                        <p className="text-sm text-white/80 leading-relaxed">Hãy cập nhật mật khẩu thường xuyên để có trải nghiệm mua sắm an toàn nhất cùng Glow Aura.</p>
                    </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};