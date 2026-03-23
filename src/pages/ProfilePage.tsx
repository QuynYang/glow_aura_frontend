import { Camera, Edit2, AlertTriangle } from 'lucide-react';
import { MainLayout } from '../components/layout/MainLayout';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext'; 
import { ProfileSidebar } from '../features/user/components/ProfileSidebar'; 

export const ProfilePage = () => {
  // Lấy thông tin user từ Context (vốn được lấy từ localStorage sau khi Đăng nhập)
  const { user } = useAuth(); 

  // Hàm helper để render Text, nếu trống thì hiện "Chưa cập nhật"
  const renderField = (value: string | undefined | null) => {
    return value ? value : <span className="text-gray-400 italic">Chưa cập nhật</span>;
  };

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen py-10 font-sans">
        <div className="container mx-auto px-4 max-w-[1200px]">
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8">Tài khoản của tôi</h1>

          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* === 1. SIDEBAR === */}
            <ProfileSidebar activePage="profile" />

            {/* === 2. MAIN CONTENT === */}
            <div className="w-full lg:w-3/4 space-y-6">
              
              {/* Box Thông tin cá nhân */}
              <div className="bg-white rounded-[2rem] shadow-sm p-8 md:p-10 border border-gray-100">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h2 className="text-2xl font-serif font-bold text-gray-900">Thông tin cá nhân</h2>
                        <p className="text-gray-500 text-sm mt-1">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
                    </div>
                    <Button variant="outline" className="flex items-center gap-2 text-xs h-9 rounded-xl">
                        <Edit2 className="w-3 h-3" /> Chỉnh sửa
                    </Button>
                </div>

                {/* Avatar Section */}
                <div className="flex items-center gap-6 mb-10">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-50 shadow-sm bg-gray-100">
                            {/* Logic hiển thị Avatar thật từ DB */}
                             <img 
                                src={user?.avatarUrl || "https://img.freepik.com/free-photo/portrait-white-man-isolated_53876-40306.jpg"} 
                                alt="Avatar" 
                                className="w-full h-full object-cover" 
                             />
                        </div>
                        <button className="absolute bottom-0 right-0 bg-white border border-gray-200 p-1.5 rounded-full shadow-sm hover:text-[#3D021E] transition-colors">
                            <Camera className="w-4 h-4 text-gray-600" />
                        </button>
                    </div>
                    <div>
                        {/* Hiển thị Tên thật */}
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{user?.fullName || 'Khách hàng'}</h3>
                        <p className="text-sm text-gray-500 mb-3">Thành viên từ: 2024</p>
                        <span className="bg-green-50 text-green-600 border border-green-100 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                            Đã xác minh
                        </span>
                    </div>
                </div>

                {/* Form Grid - Đổ dữ liệu thật từ API */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12 mb-10 border-b border-gray-100 pb-10">
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Họ và tên</label>
                        <p className="font-medium text-gray-900 text-sm">{renderField(user?.fullName)}</p>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Email</label>
                        <p className="font-medium text-gray-900 text-sm">{renderField(user?.email)}</p>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Số điện thoại</label>
                        <p className="font-medium text-gray-900 text-sm">{renderField(user?.phoneNumber)}</p>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Giới tính</label>
                        <p className="font-medium text-gray-900 text-sm">{renderField(null)}</p>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Ngày sinh</label>
                        <p className="font-medium text-gray-900 text-sm">{renderField(null)}</p>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Địa chỉ mặc định</label>
                        <p className="font-medium text-gray-900 text-sm leading-relaxed">{renderField(user?.address)}</p>
                    </div>
                </div>

                {/* Social Connect */}
                <h4 className="font-serif font-bold text-gray-900 mb-4 text-lg">Liên kết mạng xã hội</h4>
                <div className="flex flex-wrap gap-4">
                     <div className="flex items-center gap-3 px-5 py-2.5 border border-gray-100 rounded-xl bg-gray-50 shadow-sm">
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                        <span className="text-sm font-bold text-gray-700">Google</span>
                        <CheckIcon />
                     </div>
                     <div className="flex items-center gap-3 px-5 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors shadow-sm">
                        <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="w-5 h-5" alt="Facebook" />
                        <span className="text-sm font-bold text-gray-700">Facebook</span>
                        <span className="text-[10px] text-gray-400 font-bold ml-2 uppercase">Kết nối</span>
                     </div>
                </div>
              </div>

              {/* Security Alert Box */}
              <div className="bg-[#FFF9E6] border border-[#FFEBA8] rounded-[1.5rem] p-6 md:p-8 flex items-start gap-4">
                 <AlertTriangle className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
                 <div>
                    <h4 className="font-bold text-orange-800 mb-1.5">Bảo mật tài khoản</h4>
                    <p className="text-sm text-orange-700 leading-relaxed mb-3">
                        Lần cuối bạn đổi mật khẩu là 6 tháng trước. Glow Aura khuyên bạn nên cập nhật mật khẩu định kỳ để bảo vệ tài khoản tốt hơn.
                    </p>
                    <a href="#" className="text-xs font-bold text-orange-900 underline underline-offset-4 hover:text-orange-700 transition-colors">Đổi mật khẩu ngay</a>
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
    <svg className="w-4 h-4 text-green-500 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
);