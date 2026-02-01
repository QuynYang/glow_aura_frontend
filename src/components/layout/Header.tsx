import { Search, ShoppingCart, User } from 'lucide-react';

// 1. Dữ liệu Menu (Như đã khai báo ở trên)
const megaMenuData = {
  columns: [
    {
      title: "New",
      items: ["Best Sellers", "Travel Size", "Professional Treatments", "Daily Defense", "Virtual Skincare Analysis"]
    },
    {
      title: "By Category",
      items: ["Cleansers", "Exfoliators", "Toners", "Retinols", "Peels And Masques", "Moisturizer", "Night Cream", "Facial Oil", "Sunscreen", "Eye Care"]
    },
    {
      title: "By Skin Condition",
      items: ["Brightening", "Hydration", "Acne", "Anti-Ageing", "Redness", "Sensitive Skin", "Sun Protection"]
    },
    {
      title: "Collection",
      items: ["Beautya Cleansing", "Beautya Prestige", "Beautya Light -In -White", "Capture Totale", "Capture Youth", "Capture Dreamskin", "One Essential", "Professional Solution", "Beautya Hydra Life"]
    }
  ],
  featured: {
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600",
    name: "capture totale super potent rich cream",
    description: "Global Age-Defying Rich Cream - Intense Nourishment & Revitalization"
  }
};

const navItems = [
  { label: "Mới", hasMegaMenu: false },
  { label: "BEST-SELLERS", hasMegaMenu: false },
  { label: "MÔI", hasMegaMenu: false },
  { label: "MẶT", hasMegaMenu: false },
  { label: "MẮT", hasMegaMenu: false },
  { label: "DA", hasMegaMenu: false },
  { label: "ALL", hasMegaMenu: true }, // Chỉ mục này có Mega Menu
  { label: "ĐANG SALE SỐC", hasMegaMenu: false }
];

export const Header = () => {
  return (
    // Thêm relative vào header cha để làm điểm neo cho Mega Menu
    <header className="sticky top-0 z-50 bg-white shadow-sm font-sans relative">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <div className="text-2xl font-serif font-bold tracking-tighter">
          Glow Aura
        </div>

        {/* Navigation Menu */}
        <nav className="hidden md:flex space-x-8 h-full items-center">
          {navItems.map((item) => (
            <div key={item.label} className="group h-full flex items-center">
              {/* Menu Item Link */}
              <a 
                href="#" 
                className={`text-sm font-medium tracking-wide uppercase px-2 py-1 transition-colors
                  ${item.label === 'ALL' 
                    ? 'bg-accent text-white hover:bg-primary' // Style riêng cho nút ALL giống mẫu
                    : 'text-gray-700 hover:text-primary relative group-hover:text-primary'
                  }`}
              >
                {item.label}
                {/* Gạch chân animation cho các mục thường */}
                {item.label !== 'ALL' && (
                   <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                )}
              </a>

              {/* === MEGA MENU IMPLEMENTATION === */}
              {item.hasMegaMenu && (
                <div className="absolute left-0 top-full w-full bg-white shadow-xl border-t border-gray-100 hidden group-hover:block transition-all duration-300 ease-in-out">
                  <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-5 gap-8">
                      
                      {/* 4 Cột Danh Mục */}
                      {megaMenuData.columns.map((col, index) => (
                        <div key={index}>
                          <h4 className="font-bold text-gray-900 mb-4 text-sm">{col.title}</h4>
                          <ul className="space-y-2">
                            {col.items.map((subItem) => (
                              <li key={subItem}>
                                <a href="#" className="text-sm text-gray-500 hover:text-accent transition-colors block">
                                  {subItem}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}

                      {/* 1 Cột Hình Ảnh (Featured Product) */}
                      <div className="col-span-1">
                        <div className="aspect-[4/5] overflow-hidden mb-3 bg-gray-100">
                          <img 
                            src={megaMenuData.featured.image} 
                            alt="Featured" 
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <h5 className="font-bold text-sm uppercase mb-1">{megaMenuData.featured.name}</h5>
                        <p className="text-xs text-gray-500 leading-relaxed">{megaMenuData.featured.description}</p>
                      </div>

                    </div>
                  </div>
                </div>
              )}
              {/* === END MEGA MENU === */}
            </div>
          ))}
        </nav>

        {/* Icons */}
        <div className="flex items-center space-x-6">
          <Search className="w-5 h-5 cursor-pointer hover:text-primary transition-colors" />
          <User className="w-5 h-5 cursor-pointer hover:text-primary transition-colors" />
          <div className="relative group cursor-pointer">
            <ShoppingCart className="w-5 h-5 group-hover:text-primary transition-colors" />
            <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
              0
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};