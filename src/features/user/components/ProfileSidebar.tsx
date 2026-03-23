import { useState, useEffect } from 'react';
import { User, Package, Heart, Lock, MapPin, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { MemberCard } from './MemberCard';
import { userService } from '../../../services/userService'; // Import service gọi API

interface ProfileSidebarProps {
  activePage?: 'profile' | 'orders' | 'wishlist' | 'password' | 'address';
}

export const ProfileSidebar = ({ activePage }: ProfileSidebarProps) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  // State lưu số điểm lấy từ API (Mặc định là 0 để tránh lỗi trước khi API load xong)
  const [loyaltyPoints, setLoyaltyPoints] = useState<number>(0);

  // Gọi API lấy điểm tích lũy ngay khi Sidebar hiển thị
  useEffect(() => {
    const fetchLoyaltyPoints = async () => {
      try {
        const points = await userService.getLoyaltyPoints();
        // Kiểm tra xem C# trả về thẳng một con số hay một Object chứa số điểm
        const actualPoints = typeof points === 'number' ? points : (points?.points || points?.totalPoints || 0);
        setLoyaltyPoints(actualPoints);
      } catch (error) {
        console.error("Không lấy được điểm tích lũy:", error);
      }
    };

    fetchLoyaltyPoints();
  }, []);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    logout();
    navigate('/login');
  };

  const getMenuClass = (pageName: string) => {
    const isActive = activePage === pageName;
    return `flex items-center gap-3 px-6 py-4 font-medium transition-colors ${
      isActive 
        ? 'bg-[#3D021E] text-white border-l-4 border-accent' 
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
          
          <Link to="/profile/wishlist" className={getMenuClass('wishlist')}>
            <Heart className="w-5 h-5" /> Danh sách yêu thích
          </Link>
          
          <Link to="/profile/change-password" className={getMenuClass('password')}>
            <Lock className="w-5 h-5" /> Đổi mật khẩu
          </Link>
          
          <Link to="/profile/address" className={getMenuClass('address')}>
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

      {/* Truyền số điểm thật lấy từ API xuống cho thẻ MemberCard */}
      <MemberCard currentPoints={loyaltyPoints} />
    </div>
  );
};