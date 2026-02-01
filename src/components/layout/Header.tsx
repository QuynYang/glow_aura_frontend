import { Search, ShoppingCart, User } from 'lucide-react'; // Đảm bảo đã chạy: npm install lucide-react



export const Header = () => {

  const navItems = ["Mới", "BEST-SELLERS", "MÔI", "MẶT", "MẮT", "DA", "ALL", "ĐANG SALE SỐC"];



  return (

    <header className="sticky top-0 z-50 bg-white shadow-sm">

      <div className="container mx-auto px-4 h-20 flex items-center justify-between">

        {/* Logo */}

        <div className="text-2xl font-serif font-bold tracking-tighter">

          Glow Aura

        </div>



        {/* Menu chính */}

        <nav className="hidden md:flex space-x-8">

          {navItems.map((item) => (

            <a key={item} href="#" className="text-sm font-medium text-gray-700 hover:text-primary transition-colors uppercase tracking-wide">

              {item}

            </a>

          ))}

        </nav>



        {/* Icons bên phải */}

        <div className="flex items-center space-x-6">

          <Search className="w-5 h-5 cursor-pointer hover:text-primary" />

          <User className="w-5 h-5 cursor-pointer hover:text-primary" />

          <div className="relative">

            <ShoppingCart className="w-5 h-5 cursor-pointer hover:text-primary" />

            <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">

              0

            </span>

          </div>

        </div>

      </div>

    </header>

  );

};