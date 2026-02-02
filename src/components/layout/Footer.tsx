import { Facebook, Instagram, Twitter, Rabbit, Leaf, Wheat, Recycle, ArrowUp } from 'lucide-react';

export const Footer = () => {
  // Hàm cuộn lên đầu trang
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer>
      {/* 1. Dải cam kết */}
      <div className="bg-[#F9F1F0] py-8 border-t border-gray-100">
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="flex flex-col items-center gap-2 group">
            <Rabbit className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" strokeWidth={1.5} />
            <span className="text-sm text-primary font-medium">Không thử nghiệm trên động vật</span>
          </div>
          <div className="flex flex-col items-center gap-2 group">
            <Leaf className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" strokeWidth={1.5} />
            <span className="text-sm text-primary font-medium">Không chứa thành phần có nguồn gốc từ động vật</span>
          </div>
          <div className="flex flex-col items-center gap-2 group">
            <Wheat className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" strokeWidth={1.5} />
            <span className="text-sm text-primary font-medium">Không chứa Gluten hoặc các sản phẩm phụ từ Gluten</span>
          </div>
          <div className="flex flex-col items-center gap-2 group">
            <Recycle className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" strokeWidth={1.5} />
            <span className="text-sm text-primary font-medium">Bao bì có thể tái chế</span>
          </div>
        </div>
      </div>

      {/* 2. Main Footer */}
      <div className="bg-primary text-white pt-16 pb-8">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          
          {/* Cột 1: Help */}
          <div>
            <h3 className="font-serif text-xl font-bold mb-6">Chúng tôi có thể giúp gì cho bạn?</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Các chi nhánh</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Liên hệ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Brand của chúng tôi</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
            </ul>
          </div>

          {/* Cột 2: Products */}
          <div>
            <h3 className="font-serif text-xl font-bold mb-6">Sản phẩm</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Đồ trang điểm</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Đồ Skincare</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Gifts & Sets</a></li>
            </ul>
          </div>

          {/* Cột 3: Newsletter */}
          <div>
            <h3 className="font-serif text-xl font-bold mb-6">Hãy giữ liên lạc Glow Aura</h3>
            <p className="text-sm text-gray-300 mb-4">
              Đăng ký nhận bản tin Glow Aura để là người đầu tiên biết về tin tức, ưu đãi và lời khuyên chăm sóc da
            </p>
            <div className="flex gap-2 mb-4">
              <input 
                type="email" 
                placeholder="Địa chỉ Email" 
                className="bg-transparent border-b border-gray-500 w-full py-2 text-white placeholder-gray-400 focus:outline-none focus:border-white transition-colors"
              />
              <button className="text-sm uppercase font-bold border border-white/30 px-6 py-2 hover:bg-white hover:text-primary transition-all">
                Đặt ngay
              </button>
            </div>
            <div className="flex items-start gap-2 text-xs text-gray-400">
              <input type="checkbox" className="mt-1 accent-primary" />
              <p>Bằng cách gửi email của bạn, bạn đồng ý nhận email quảng cáo từ Glow Aura</p>
            </div>
          </div>
        </div>

        {/* 3. Bottom Footer */}
        <div className="container mx-auto px-4 border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-300">
            <h4 className="font-bold uppercase mb-2 tracking-wider text-white">Liên hệ</h4>
            <p className="mb-1">Gmail: vungocquynhgiang0408@gmail.com</p>
            <p className="mb-4">SDT: 0123456789</p>
            
            <div className="flex gap-4">
                <a href="#" className="hover:text-accent transition-colors"><Facebook className="w-5 h-5" /></a>
                <a href="#" className="hover:text-accent transition-colors"><Instagram className="w-5 h-5" /></a>
                <a href="#" className="hover:text-accent transition-colors"><Twitter className="w-5 h-5" /></a>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <button 
                onClick={scrollToTop}
                className="p-2 bg-white text-primary rounded-sm hover:bg-gray-200 transition-colors"
                title="Back to top"
             >
                <ArrowUp className="w-5 h-5" />
             </button>
          </div>
        </div>
        
        <div className="container mx-auto px-4 mt-8 text-xs text-gray-500 flex flex-col md:flex-row justify-between items-center gap-2">
            <p>© 2026 Glow Aura</p>
            <div className="flex gap-4">
                <a href="#" className="hover:text-white transition-colors">Điều khoản và điều kiện</a>
                <a href="#" className="hover:text-white transition-colors">Chính sách bảo mật</a>
            </div>
        </div>
      </div>
    </footer>
  );
};