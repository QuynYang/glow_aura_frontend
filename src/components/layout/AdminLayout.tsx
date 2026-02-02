
import { Bell, Search } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
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
                <Link to="#" className="hover:text-black transition-colors">Sản phẩm</Link>
                <Link to="#" className="hover:text-black transition-colors">Đơn hàng</Link>
                <Link to="#" className="hover:text-black transition-colors">Khách hàng</Link>
                <Link to="#" className="hover:text-black transition-colors">Thống kê</Link>
            </nav>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-6">
             <button className="p-2 text-gray-400 hover:text-black transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
             </button>
             <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 cursor-pointer">
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200" alt="Admin" />
             </div>
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