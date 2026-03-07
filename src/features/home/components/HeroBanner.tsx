import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button'; // Import Button gốc của bạn

// 1. Data chứa 3 slide, hỗ trợ thẻ <br/> trong Title để xuống dòng chuẩn như code gốc
const BANNERS = [
  {
    id: 1,
    image: "https://es.lorealparisusa.com/-/media/project/loreal/brand-sites/oap/americas/us/beauty-magazine/articles/korean-skin-care-routine-steps/loreal-paris-bmag-article-your-10-step-korean-skin-care-routine-d.jpg?cx=0.49&cy=0.54&cw=2000&ch=815&hash=5CE5855BD95CAD838855E67AAB67C751",
    title: <>Khám phá <br className="hidden md:block" /> vẻ đẹp tự nhiên của bạn</>,
    btnText: "Tìm hiểu thêm",
    link: "/best-sellers"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1920",
    title: <>Dưỡng da chuyên sâu <br className="hidden md:block" /> với AI cá nhân hóa</>,
    btnText: "Khám phá ngay",
    link: "/skin-quiz"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1556228720-1987bb7b0033?q=80&w=1920",
    title: <>Tỏa sáng rạng ngời <br className="hidden md:block" /> cùng Glow Aura</>,
    btnText: "Mua sắm ưu đãi",
    link: "/sale"
  }
];

export const HeroBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // 2. Logic chuyển slide an toàn
  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === BANNERS.length - 1 ? 0 : prev + 1));
  }, []);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? BANNERS.length - 1 : prev - 1));
  };

  // 3. Auto-play 3 giây (3000ms)
  useEffect(() => {
    const timer = setInterval(nextSlide, 3000);
    // Cleanup: Reset timer nếu người dùng tự click mũi tên
    return () => clearInterval(timer);
  }, [nextSlide, currentIndex]);

  return (
    <div className="relative h-[600px] w-full overflow-hidden group">
      
      {/* Vòng lặp render Ảnh nền để tạo hiệu ứng Fade-in mượt mà */}
      {BANNERS.map((banner, index) => (
        <div 
          key={banner.id}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out
            ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}
          `}
          style={{ backgroundImage: `url('${banner.image}')` }}
        >
          {/* Overlay gốc của bạn: Pha trộn màu đen và màu đỏ rượu (primary) */}
          <div className="absolute inset-0 bg-black/30 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />
        </div>
      ))}

      {/* Container chứa Content, Căn giữa toàn bộ theo code gốc */}
      {/* pointer-events-none để không chặn click chuột vào ảnh nền (nếu cần), phần tử con sẽ bật lại pointer-events-auto */}
      <div className="absolute inset-0 container mx-auto px-4 flex flex-col justify-center items-center text-center text-white z-20 pointer-events-none">
        
        {/* Nút điều hướng TRÁI (Ẩn đi, chỉ hiện khi hover chuột vào banner) */}
        <div 
          onClick={prevSlide}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-all pointer-events-auto opacity-0 group-hover:opacity-100 duration-300"
        >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
        </div>
        
        {/* Nút điều hướng PHẢI */}
        <div 
          onClick={nextSlide}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-all pointer-events-auto opacity-0 group-hover:opacity-100 duration-300"
        >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
        </div>

        {/* Nội dung chính (Tiêu đề + Nút) */}
        {/* Dùng key={currentIndex} ép React tạo lại thẻ này để chạy hiệu ứng animation mỗi khi đổi slide */}
        <div key={currentIndex} className="animate-in fade-in zoom-in-95 duration-700 flex flex-col items-center pointer-events-auto">
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 drop-shadow-lg">
              {BANNERS[currentIndex].title}
            </h1>
            
            {/* Nút bấm chuẩn thiết kế của bạn bọc trong thẻ Link */}
            <div className="mt-4">
              <Link to={BANNERS[currentIndex].link}>
                <Button variant="white" className="px-10 py-3 text-base">
                    {BANNERS[currentIndex].btnText}
                </Button>
              </Link>
            </div>
        </div>

        {/* Dấu chấm trang (Pagination pills) gốc của bạn, có gắn sự kiện onClick */}
        <div className="absolute bottom-8 flex gap-2 pointer-events-auto">
            {BANNERS.map((_, idx) => (
              <div 
                key={idx} 
                onClick={() => setCurrentIndex(idx)}
                className={`w-8 h-1 rounded-full cursor-pointer transition-colors duration-300
                  ${idx === currentIndex ? 'bg-accent' : 'bg-white/50 hover:bg-white/80'}
                `}
              ></div>
            ))}
        </div>

      </div>
    </div>
  );
};