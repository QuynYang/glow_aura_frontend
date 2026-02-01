import { Button } from '@/components/ui/Button';

export const HeroBanner = () => {
  return (
    <div className="relative h-[600px] w-full bg-cover bg-center" 
         // Tôi đổi sang link ảnh nhóm người mẫu cho giống thiết kế
         style={{ backgroundImage: "url('https://es.lorealparisusa.com/-/media/project/loreal/brand-sites/oap/americas/us/beauty-magazine/articles/korean-skin-care-routine-steps/loreal-paris-bmag-article-your-10-step-korean-skin-care-routine-d.jpg?cx=0.49&cy=0.54&cw=2000&ch=815&hash=5CE5855BD95CAD838855E67AAB67C751')" }}>
      
      {/* 1. Overlay: Pha trộn màu đen và màu đỏ rượu (primary) để ảnh sang hơn */}
      <div className="absolute inset-0 bg-black/30 mix-blend-multiply" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />

      {/* 2. Container: Đổi justify-center và items-center để CĂN GIỮA toàn bộ */}
      <div className="absolute inset-0 container mx-auto px-4 flex flex-col justify-center items-center text-center text-white z-10">
        
        {/* Các mũi tên điều hướng giả lập (nếu muốn giống slider) */}
        <div className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
        </div>
        <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
        </div>

        {/* Nội dung chính */}
        <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 drop-shadow-lg">
          Unlock Your <br className="hidden md:block" /> Natural Glow
        </h1>
        
        {/* Nút bấm chuẩn thiết kế (Know More) */}
        <div className="mt-4">
            <Button variant="white" className="px-10 py-3 text-base">
                Know More
            </Button>
        </div>

        {/* Dấu chấm trang (Pagination dots) - Giả lập Slider */}
        <div className="absolute bottom-8 flex gap-2">
            <div className="w-8 h-1 bg-accent rounded-full"></div>
            <div className="w-8 h-1 bg-white/50 rounded-full"></div>
            <div className="w-8 h-1 bg-white/50 rounded-full"></div>
        </div>

      </div>
    </div>
  );
};