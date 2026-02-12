import { Bell, Search, LogOut, User as UserIcon } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // 1. Import Auth Context

interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  // 2. Tích hợp logic Auth và State
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      
      {/* 1. Admin Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Logo & Menu */}
          <div className="flex items-center gap-12">
            <Link to="/admin" className="text-xl font-bold flex items-center gap-2">
               <div className="w-3 h-3 bg-black rotate-45"></div> {/* Logo giả lập */}
               Glow Aura Admin
            </Link>
            
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
                <Link to="/admin" className="text-black font-bold">Dashboard</Link>
                <Link to="/admin/products" className="hover:text-black transition-colors">Sản phẩm</Link>
                <Link to="/admin/orders" className="hover:text-black transition-colors">Đơn hàng</Link>
                <Link to="/admin/customers" className="hover:text-black transition-colors">Khách hàng</Link>
                <Link to="/admin/analytics" className="hover:text-black transition-colors">Thống kê</Link>
            </nav>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-6">
             <button className="p-2 text-gray-400 hover:text-black transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
             </button>

             {/* === DROPDOWN MENU (Phần bổ sung) === */}
             <div className="relative">
                <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-3 focus:outline-none group"
                >
                    {/* Hiển thị tên Admin */}
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-gray-900 group-hover:text-[#3D021E] transition-colors">{user?.name || 'Admin'}</p>
                        <p className="text-[10px] text-gray-500 uppercase">Quản trị viên</p>
                    </div>

                    <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 cursor-pointer hover:border-[#3D021E] transition-colors">
                        <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200" alt="Admin Avatar" className="w-full h-full object-cover" />
                    </div>
                </button>

                {/* Menu thả xuống */}
                {isDropdownOpen && (
                    <>
                        {/* Lớp phủ để đóng menu khi click ra ngoài */}
                        <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)}></div>
                        
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-20 py-2 animate-in fade-in zoom-in-95 duration-200">
                            <div className="px-4 py-2 border-b border-gray-100 mb-1">
                                <p className="text-xs text-gray-500">Đang đăng nhập</p>
                                <p className="text-sm font-bold text-[#3D021E] truncate">{user?.email}</p>
                            </div>
                            
                            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#3D021E] flex items-center gap-2 transition-colors">
                                <UserIcon className="w-4 h-4" /> Tài khoản
                            </button>
                            
                            <button 
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center gap-2 transition-colors font-medium"
                            >
                                <LogOut className="w-4 h-4" /> Đăng xuất
                            </button>
                        </div>
                    </>
                )}
             </div>
             {/* === END DROPDOWN === */}

          </div>
        </div>
      </header>

      {/* 2. Main Content */}
      <main className="container mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
};