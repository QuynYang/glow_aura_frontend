import { User, Package, Heart, Lock, MapPin, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { MemberCard } from './MemberCard';

interface ProfileSidebarProps {
  activePage?: 'profile' | 'orders' | 'wishlist' | 'password' | 'address';
}

export const ProfileSidebar = ({ activePage }: ProfileSidebarProps) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    logout();
    navigate('/login');
  };

  // Hàm helper tạo class active
  const getMenuClass = (pageName: string) => {
    const isActive = activePage === pageName;
    return `flex items-center gap-3 px-6 py-4 font-medium transition-colors ${
      isActive 
        ? 'bg-[#3D021E] text-white border-l-4 border-accent' // Đã đổi màu nền thành #3D021E theo yêu cầu
        : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
    }`;
  };

  return (
    <div className="w-full lg:w-1/4 space-y-6">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <nav className="flex flex-col">
          {/* 1. Hồ sơ cá nhân */}
          <Link to="/profile" className={getMenuClass('profile')}>
            <User className="w-5 h-5" /> Hồ sơ cá nhân
          </Link>
          
          {/* 2. Lịch sử đơn hàng */}
          <Link to="/profile/orders" className={getMenuClass('orders')}>
            <Package className="w-5 h-5" /> Lịch sử đơn hàng
          </Link>
          
          {/* 3. Danh sách yêu thích */}
          <Link to="/profile/wishlist" className={getMenuClass('wishlist')}>
            <Heart className="w-5 h-5" /> Danh sách yêu thích
          </Link>
          
          {/* 4. Đổi mật khẩu (ĐÃ SỬA LINK CHÍNH XÁC) */}
          <Link to="/profile/change-password" className={getMenuClass('password')}>
            <Lock className="w-5 h-5" /> Đổi mật khẩu
          </Link>
          
          {/* 5. Địa chỉ giao hàng (Chưa có trang thì để #) */}

          <Link to="/profile/address" className={getMenuClass('address')}>
                <MapPin className="w-5 h-5" /> Địa chỉ giao hàng
            </Link>



          <div className="border-t border-gray-100 my-2"></div>
          
          {/* 6. Đăng xuất */}
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-3 px-6 py-4 text-red-500 hover:bg-red-50 font-medium transition-colors w-full text-left"
          >
            <LogOut className="w-5 h-5" /> Đăng xuất
          </button>
        </nav>
      </div>

      {/* Thẻ thành viên */}
      <MemberCard currentPoints={1240} />
    </div>
  );
};