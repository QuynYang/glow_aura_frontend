import { useState } from 'react';
import { Lock, Eye, EyeOff, Save } from 'lucide-react';
import { MainLayout } from '../components/layout/MainLayout';
import { ProfileSidebar } from '../features/user/components/ProfileSidebar';

export const ChangePasswordPage = () => {
  // State quản lý ẩn/hiện mật khẩu
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen py-10 font-sans">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8">Tài khoản của tôi</h1>

          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* 1. Sidebar (Active tab: password) */}
            <ProfileSidebar activePage="password" />

            {/* 2. Main Content */}
            <div className="w-full lg:w-3/4">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[500px]">
                
                {/* --- CỘT TRÁI: FORM ĐỔI MẬT KHẨU --- */}
                <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center">
                    <h2 className="text-2xl font-serif font-bold text-[#3D021E] mb-6">Đổi Mật Khẩu</h2>
                    
                    <form className="space-y-5">
                        {/* Mật khẩu hiện tại */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Mật khẩu hiện tại</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input 
                                    type={showCurrent ? "text" : "password"} 
                                    placeholder="Nhập mật khẩu hiện tại"
                                    className="w-full border border-gray-300 pl-10 pr-10 py-3 text-sm rounded-sm focus:outline-none focus:border-[#3D021E] transition-colors"
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowCurrent(!showCurrent)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#3D021E]"
                                >
                                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Mật khẩu mới */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Mật khẩu mới</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input 
                                    type={showNew ? "text" : "password"} 
                                    placeholder="Nhập mật khẩu mới"
                                    className="w-full border border-gray-300 pl-10 pr-10 py-3 text-sm rounded-sm focus:outline-none focus:border-[#3D021E] transition-colors"
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowNew(!showNew)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#3D021E]"
                                >
                                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Xác nhận mật khẩu mới */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Xác nhận mật khẩu mới</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input 
                                    type={showConfirm ? "text" : "password"} 
                                    placeholder="Nhập lại mật khẩu mới"
                                    className="w-full border border-gray-300 pl-10 pr-10 py-3 text-sm rounded-sm focus:outline-none focus:border-[#3D021E] transition-colors"
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#3D021E]"
                                >
                                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Nút Submit */}
                        <div className="pt-4">
                            <button className="w-full bg-[#3D021E] hover:bg-[#5a032d] text-white font-bold py-3 px-4 rounded-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-lg">
                                <Save className="w-4 h-4" />
                                Cập Nhật Mật Khẩu
                            </button>
                        </div>
                    </form>
                </div>

                {/* --- CỘT PHẢI: HÌNH ẢNH (Giống mẫu) --- */}
                <div className="hidden md:block w-1/2 relative">
                    <img 
                        src="https://img.freepik.com/free-photo/beauty-portrait-ginger-woman-with-flower-hair-touching-her-face_176420-19207.jpg" 
                        alt="Change Password Banner" 
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    {/* Lớp phủ màu nhẹ để ảnh hòa quyện hơn nếu cần */}
                    <div className="absolute inset-0 bg-[#3D021E]/10"></div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};