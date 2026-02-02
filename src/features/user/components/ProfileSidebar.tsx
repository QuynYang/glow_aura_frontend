import { User, Package, Heart, Lock, MapPin, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { MemberCard } from './MemberCard'; // Import thẻ thành viên bạn đã làm

interface ProfileSidebarProps {
  activePage: 'profile' | 'orders' | 'wishlist' | 'password' | 'address';
}

export const ProfileSidebar = ({ activePage }: ProfileSidebarProps) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    logout();
    navigate('/login');
  };

  // Hàm helper để tạo class cho menu item
  const getMenuClass = (pageName: string) => {
    const isActive = activePage === pageName;
    return `flex items-center gap-3 px-6 py-4 font-medium transition-colors ${
      isActive 
        ? 'bg-[#330511] text-white border-l-4 border-accent' 
        : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
    }`;
  };

  return (
    <div className="w-full lg:w-1/4 space-y-6">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <nav className="flex flex-col">
          <Link to="/profile" className={getMenuClass('profile')}>
            <User className="w-5 h-5" /> Hồ sơ cá nhân
          </Link>
          <Link to="/profile/orders" className={getMenuClass('orders')}>
            <Package className="w-5 h-5" /> Lịch sử đơn hàng
          </Link>
          <Link to="#" className={getMenuClass('wishlist')}>
            <Heart className="w-5 h-5" /> Danh sách yêu thích
          </Link>
          <Link to="#" className={getMenuClass('password')}>
            <Lock className="w-5 h-5" /> Đổi mật khẩu
          </Link>
          <Link to="#" className={getMenuClass('address')}>
            <MapPin className="w-5 h-5" /> Địa chỉ giao hàng
          </Link>

          <div className="border-t border-gray-100 my-2"></div>
          
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-3 px-6 py-4 text-red-500 hover:bg-red-50 font-medium transition-colors w-full text-left"
          >
            <LogOut className="w-5 h-5" /> Đăng xuất
          </button>
        </nav>
      </div>

      {/* Member Card Component (Giữ nguyên logic cũ) */}
      <MemberCard currentPoints={1240} />
    </div>
  );
};