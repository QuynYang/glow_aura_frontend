import { useState } from 'react';
import { Camera, Edit2, AlertTriangle, X, Loader2, Save } from 'lucide-react';
import { MainLayout } from '../components/layout/MainLayout';
import { useAuth } from '../context/AuthContext'; 
import { ProfileSidebar } from '../features/user/components/ProfileSidebar'; 
import { userService } from '../services/userService';

export const ProfilePage = () => {
  const { user, login } = useAuth(); // Dùng hàm login để cập nhật lại state user sau khi lưu
  
  // State quản lý Modal
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // State lưu dữ liệu Form
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    gender: '',
    dateOfBirth: '',
    address: ''
  });

  // Mở Modal và nạp dữ liệu hiện tại vào form
  const handleOpenEdit = () => {
    setFormData({
      fullName: user?.fullName || '',
      phoneNumber: user?.phoneNumber || '',
      gender: user?.gender || '',
      // Xử lý cắt chuỗi ngày giờ từ C# (VD: "1996-08-15T00:00:00" -> "1996-08-15") để cho vào thẻ <input type="date">
      dateOfBirth: user?.dateOfBirth ? user.dateOfBirth.split('T')[0] : '', 
      address: user?.address || ''
    });
    setIsEditing(true);
  };

  // Xử lý khi gõ vào Form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Lưu thông tin
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // 1. Gọi API PUT /api/User/me
      await userService.updateProfile(formData);
      
      // 2. Gọi lại API GET /api/User/me để lấy cục data mới nhất từ Database
      const updatedUser = await userService.getCurrentUser();
      
      // 3. Cập nhật lại Context
      login(updatedUser);
      
      setIsEditing(false);
      alert("Cập nhật thông tin thành công!");
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra khi cập nhật. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm Helper hiển thị text hoặc "Chưa cập nhật"
  const renderField = (value: string | undefined | null) => {
    return value ? value : <span className="text-gray-400 italic">Chưa cập nhật</span>;
  };

  // Hàm Helper format hiển thị ngày sinh
  const formatDisplayDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, ' / ');
  };

  const vipLevels = ['None', 'Bronze', 'Silver', 'Gold', 'Platinum'];
  const currentVip = String(user?.vipLevel || 'None');
  const vipIndex = Math.max(0, vipLevels.findIndex((v) => v.toLowerCase() === currentVip.toLowerCase()));
  const vipProgress = (vipIndex / (vipLevels.length - 1)) * 100;
  const nextVipTargets: Record<string, number> = {
    None: 1_000_000,
    Bronze: 5_000_000,
    Silver: 10_000_000,
    Gold: 20_000_000,
    Platinum: 0,
  };
  const totalSpent = Number((user as any)?.totalSpent || 0);
  const toNext = Math.max(0, (nextVipTargets[currentVip] ?? 0) - totalSpent);

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen py-10 font-sans relative">
        <div className="container mx-auto px-4 max-w-[1200px]">
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8">Tài khoản của tôi</h1>

          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* === 1. SIDEBAR === */}
            <ProfileSidebar activePage="profile" />

            {/* === 2. MAIN CONTENT === */}
            <div className="w-full lg:w-3/4 space-y-6">
              
              <div className="bg-white rounded-[2rem] shadow-sm p-8 md:p-10 border border-gray-100">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h2 className="text-2xl font-serif font-bold text-gray-900">Thông tin cá nhân</h2>
                        <p className="text-gray-500 text-sm mt-1">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
                    </div>
                    <button 
                        onClick={handleOpenEdit}
                        className="flex items-center gap-2 text-xs h-9 px-4 border border-gray-200 rounded-xl hover:border-[#3D021E] hover:text-[#3D021E] font-bold transition-colors shadow-sm"
                    >
                        <Edit2 className="w-3 h-3" /> CHỈNH SỬA
                    </button>
                </div>

                <div className="flex items-center gap-6 mb-10">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-50 shadow-sm bg-gray-100 flex items-center justify-center text-gray-400 text-3xl font-bold">
                            {user?.avatarUrl ? (
                               <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                               user?.fullName?.charAt(0).toUpperCase() || 'U'
                            )}
                        </div>
                        <button className="absolute bottom-0 right-0 bg-white border border-gray-200 p-1.5 rounded-full shadow-sm hover:text-[#3D021E] transition-colors">
                            <Camera className="w-4 h-4 text-gray-600" />
                        </button>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{user?.fullName || 'Khách hàng'}</h3>
                        <p className="text-sm text-gray-500 mb-3">Thành viên từ: 2024</p>
                        <span className="bg-green-50 text-green-600 border border-green-100 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                            Đã xác minh
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12 mb-10 border-b border-gray-100 pb-10">
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Họ và tên</label>
                        <p className="font-medium text-gray-900 text-sm">{renderField(user?.fullName)}</p>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Email <span className="text-gray-300 normal-case font-normal">(Không thể sửa)</span></label>
                        <p className="font-medium text-gray-900 text-sm">{renderField(user?.email)}</p>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Số điện thoại</label>
                        <p className="font-medium text-gray-900 text-sm">{renderField(user?.phoneNumber)}</p>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Giới tính</label>
                        <p className="font-medium text-gray-900 text-sm">{renderField(user?.gender)}</p>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Ngày sinh</label>
                        <p className="font-medium text-gray-900 text-sm">{renderField(formatDisplayDate(user?.dateOfBirth))}</p>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Địa chỉ mặc định</label>
                        <p className="font-medium text-gray-900 text-sm leading-relaxed">{renderField(user?.address)}</p>
                    </div>
                </div>

                <div className="mb-10 border-b border-gray-100 pb-10">
                  <h4 className="font-serif font-bold text-gray-900 mb-4 text-lg">Hạng thành viên & AI Skin Profile</h4>
                  <div className="bg-[#FAF7F8] border border-[#F3EAF0] rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-bold text-[#3D021E]">VIP {currentVip}</p>
                      <p className="text-xs text-gray-500">
                        {toNext > 0 ? `Cần thêm ${toNext.toLocaleString('vi-VN')}đ để lên hạng` : 'Bạn đã đạt hạng cao nhất'}
                      </p>
                    </div>
                    <div className="w-full h-2 bg-white rounded-full overflow-hidden mb-2">
                      <div className="h-full bg-[#3D021E]" style={{ width: `${vipProgress}%` }}></div>
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-500 uppercase font-bold tracking-wider">
                      {vipLevels.map((lv) => (
                        <span key={lv}>{lv}</span>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-[#F3EAF0] flex items-center justify-between">
                      <p className="text-sm text-gray-700">
                        Loại da: <span className="font-bold">{(user as any)?.skinType || 'Chưa xác định'}</span>
                      </p>
                      {(user as any)?.hasCompletedSkinQuiz && (
                        <span className="bg-green-50 text-green-700 border border-green-200 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                          Đã xác thực qua AI
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Liên kết MXH  */}
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

              {/* Box Bảo mật */}
              <div className="bg-[#FFF9E6] border border-[#FFEBA8] rounded-[1.5rem] p-6 md:p-8 flex items-start gap-4">
                 <AlertTriangle className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
                 <div>
                    <h4 className="font-bold text-orange-800 mb-1.5">Bảo mật tài khoản</h4>
                    <p className="text-sm text-orange-700 leading-relaxed mb-3">
                        Lần cuối bạn đổi mật khẩu là 6 tháng trước. Glow Aura khuyên bạn nên cập nhật mật khẩu định kỳ để bảo vệ tài khoản tốt hơn.
                    </p>
                    <a href="/profile/change-password" className="text-xs font-bold text-orange-900 underline underline-offset-4 hover:text-orange-700 transition-colors">Đổi mật khẩu ngay</a>
                 </div>
              </div>

            </div>
          </div>
        </div>

        {/* === MODAL POPUP CHỈNH SỬA THÔNG TIN === */}
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Lớp mờ nền */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsEditing(false)}></div>
            
            {/* Hộp thoại Modal */}
            <div className="bg-white rounded-3xl w-full max-w-lg relative z-10 shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="font-serif font-bold text-xl text-gray-900">Cập nhật hồ sơ</h3>
                    <button onClick={() => setIsEditing(false)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Họ và tên <span className="text-red-500">*</span></label>
                        <input 
                            type="text" required name="fullName" value={formData.fullName} onChange={handleChange} 
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-[#3D021E] transition-colors"
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-5">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1.5">Số điện thoại</label>
                            <input 
                                type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-[#3D021E] transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1.5">Email</label>
                            <input 
                                type="email" disabled value={user?.email || ''} 
                                className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-sm text-gray-500 cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1.5">Giới tính</label>
                            <select 
                                name="gender" value={formData.gender} onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-[#3D021E] transition-colors appearance-none"
                            >
                                <option value="">Chưa cập nhật</option>
                                <option value="Nam">Nam</option>
                                <option value="Nữ">Nữ</option>
                                <option value="Khác">Khác</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1.5">Ngày sinh</label>
                            <input 
                                type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-[#3D021E] transition-colors"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Địa chỉ</label>
                        <input 
                            type="text" name="address" value={formData.address} onChange={handleChange}
                            placeholder="Số nhà, đường, phường/xã, quận/huyện..."
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-[#3D021E] transition-colors"
                        />
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button type="button" onClick={() => setIsEditing(false)} className="flex-1 py-3 text-sm font-bold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
                            Hủy bỏ
                        </button>
                        <button type="submit" disabled={isLoading} className="flex-1 py-3 text-sm font-bold text-white bg-[#3D021E] rounded-xl hover:bg-[#5a032d] shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-70">
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4"/> Lưu thay đổi</>}
                        </button>
                    </div>
                </form>
            </div>
          </div>
        )}

      </div>
    </MainLayout>
  );
};

// Icon Check
const CheckIcon = () => (
    <svg className="w-4 h-4 text-green-500 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
);