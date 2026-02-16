import { 
  LayoutDashboard, ShoppingBag, Package, Users, BarChart2, Settings,
  Search, Bell, LogOut, User as UserIcon, Menu, Tag // 1. Thêm icon Tag
} from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Danh sách menu sidebar
  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { label: 'Đơn hàng', icon: ShoppingBag, path: '/admin/orders' },
    { label: 'Sản phẩm', icon: Package, path: '/admin/products' },
    { label: 'Khách hàng', icon: Users, path: '/admin/customers' },
    // 2. Bổ sung mục Khuyến mãi vào trước Thống kê
    { label: 'Khuyến mãi', icon: Tag, path: '/admin/promotions' }, 
    { label: 'Thống kê', icon: BarChart2, path: '/admin/analytics' },
    { label: 'Cài đặt', icon: Settings, path: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-[#F3F4F6] font-sans text-gray-900 flex">
      
      {/* === 1. SIDEBAR (Bên trái) === */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed h-full z-20 hidden lg:flex flex-col">
        {/* Logo */}
        <div className="h-20 flex items-center px-8 border-b border-gray-100">
           <Link to="/admin" className="text-xl font-bold flex items-center gap-2 text-[#3D021E]">
               <div className="w-6 h-6 bg-[#3D021E] rounded-md flex items-center justify-center text-white text-xs">♦</div>
               Glow Aura
           </Link>
        </div>

        {/* Menu Links */}
        <nav className="flex-1 py-6 px-4 space-y-1">
            {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                    <Link 
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all
                            ${isActive 
                                ? 'bg-[#3D021E] text-white shadow-md' 
                                : 'text-gray-500 hover:bg-gray-50 hover:text-[#3D021E]'
                            }
                        `}
                    >
                        <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                        {item.label}
                    </Link>
                );
            })}
        </nav>
      </aside>

      {/* === 2. MAIN CONTENT (Bên phải) === */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        
        {/* TOP BAR (Header) */}
        <header className="h-20 bg-white border-b border-gray-200 sticky top-0 z-10 px-8 flex items-center justify-between">
            
            {/* Search Bar */}
            <div className="w-96 relative hidden md:block">
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Tìm kiếm dữ liệu, đơn hàng..." 
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-lg text-sm focus:bg-white focus:border-[#3D021E] focus:ring-1 focus:ring-[#3D021E] transition-all outline-none"
                />
            </div>

            {/* Mobile Menu Button */}
            <button className="lg:hidden p-2 text-gray-500">
                <Menu className="w-6 h-6" />
            </button>

            {/* User Actions */}
            <div className="flex items-center gap-6">
                <button className="relative p-2 text-gray-400 hover:text-[#3D021E] transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                </button>

                {/* Avatar Dropdown */}
                <div className="relative">
                    <button 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-3 focus:outline-none"
                    >
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-gray-900">{user?.name || 'Admin User'}</p>
                            <p className="text-[10px] text-gray-500 uppercase">Quản trị viên</p>
                        </div>
                        <img 
                            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200" 
                            alt="Admin" 
                            className="w-10 h-10 rounded-full border-2 border-gray-100 object-cover"
                        />
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)}></div>
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-20 py-2 animate-in fade-in zoom-in-95">
                                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                    <UserIcon className="w-4 h-4" /> Hồ sơ
                                </button>
                                <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium">
                                    <LogOut className="w-4 h-4" /> Đăng xuất
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="p-8">
            {children}
        </main>

      </div>
    </div>
  );
};