import { Camera, Edit2, AlertTriangle } from 'lucide-react';
import { MainLayout } from '../components/layout/MainLayout';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext'; // Import Auth để lấy thông tin user hiển thị
import { ProfileSidebar } from '../features/user/components/ProfileSidebar'; // Import Sidebar đã tách

export const ProfilePage = () => {
  const { user } = useAuth(); 

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen py-10 font-sans">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8">Tài khoản của tôi</h1>

          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* === 1. SIDEBAR (Sử dụng Component chung) === */}
            {/* Truyền prop activePage="profile" để tô đậm menu tương ứng */}
            <ProfileSidebar activePage="profile" />

            {/* === 2. MAIN CONTENT (Nội dung chính bên phải) === */}
            <div className="w-full lg:w-3/4 space-y-6">
              
              {/* Box Thông tin cá nhân */}
              <div className="bg-white rounded-xl shadow-sm p-8">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h2 className="text-2xl font-serif font-bold text-gray-900">Thông tin cá nhân</h2>
                        <p className="text-gray-500 text-sm mt-1">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
                    </div>
                    <Button variant="outline" className="flex items-center gap-2 text-xs h-9">
                        <Edit2 className="w-3 h-3" /> Chỉnh sửa
                    </Button>
                </div>

                {/* Avatar Section */}
                <div className="flex items-center gap-6 mb-10">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-100">
                             <img src="https://img.freepik.com/free-photo/portrait-white-man-isolated_53876-40306.jpg" alt="Avatar" className="w-full h-full object-cover" />
                        </div>
                        <button className="absolute bottom-0 right-0 bg-white border border-gray-200 p-1.5 rounded-full shadow-sm hover:text-primary">
                            <Camera className="w-4 h-4 text-gray-600" />
                        </button>
                    </div>
                    <div>
                        {/* Hiển thị tên thật từ Context */}
                        <h3 className="text-lg font-bold text-gray-900">{user?.name || 'Khách hàng'}</h3>
                        <p className="text-sm text-gray-500 mb-2">Thành viên từ: Tháng 1, 2024</p>
                        <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide">
                            Đã xác minh
                        </span>
                    </div>
                </div>

                {/* Form Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12 mb-10 border-b border-gray-100 pb-10">
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Họ và tên</label>
                        <p className="font-medium text-gray-900">{user?.name || 'Chưa cập nhật'}</p>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Email</label>
                        <p className="font-medium text-gray-900">{user?.email || 'Chưa cập nhật'}</p>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Số điện thoại</label>
                        <p className="font-medium text-gray-900">+84 90 123 4567</p>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Giới tính</label>
                        <p className="font-medium text-gray-900">Nam</p>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Ngày sinh</label>
                        <p className="font-medium text-gray-900">15 / 08 / 1996</p>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Địa chỉ mặc định</label>
                        <p className="font-medium text-gray-900">123 Đường Lê Lợi, Quận 1, TP. HCM</p>
                    </div>
                </div>

                {/* Social Connect */}
                <h4 className="font-serif font-bold text-gray-900 mb-4">Liên kết mạng xã hội</h4>
                <div className="flex gap-4">
                     <div className="flex items-center gap-3 px-4 py-2 border border-gray-200 rounded-sm bg-gray-50">
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                        <span className="text-sm font-medium">Google</span>
                        <CheckIcon />
                     </div>
                     <div className="flex items-center gap-3 px-4 py-2 border border-gray-200 rounded-sm hover:bg-gray-50 cursor-pointer">
                        <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="w-5 h-5" alt="Facebook" />
                        <span className="text-sm font-medium">Facebook</span>
                        <span className="text-[10px] text-gray-400 font-bold ml-2">Kết nối</span>
                     </div>
                </div>
              </div>

              {/* Security Alert Box */}
              <div className="bg-[#FFF9E6] border border-[#FFEBA8] rounded-xl p-6 flex items-start gap-4">
                 <AlertTriangle className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
                 <div>
                    <h4 className="font-bold text-orange-800 mb-1">Bảo mật tài khoản</h4>
                    <p className="text-sm text-orange-700 leading-relaxed mb-2">
                        Lần cuối bạn đổi mật khẩu là 6 tháng trước. Glow Aura khuyên bạn nên cập nhật mật khẩu định kỳ để bảo vệ tài khoản tốt hơn.
                    </p>
                    <a href="#" className="text-xs font-bold text-orange-900 underline hover:text-orange-700">Đổi mật khẩu ngay</a>
                 </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

// Icon check nhỏ màu xanh
const CheckIcon = () => (
    <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
);