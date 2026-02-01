import { Button } from '../../../components/ui/Button';

export const FeaturedCollection = () => {
  return (
    // Sử dụng bg-secondary (màu hồng phấn nhạt) làm nền
    <section className="bg-secondary py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col-reverse md:flex-row items-center gap-12 md:gap-16">
          
          {/* --- Cột Trái: Nội dung Text (Chiếm 1/2 trên desktop) --- */}
          <div className="w-full md:w-1/2 space-y-6 md:pr-12 text-center md:text-left">
            
            {/* Dòng chữ nhỏ trên cùng */}
            <span className="text-sm uppercase tracking-[0.2em] text-gray-500 font-medium block mb-2">
              The new 2023 collection
            </span>
            
            {/* Tiêu đề chính */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-primary leading-tight">
              Discover Our <br />
              {/* Xử lý chữ Autumn: màu accent, in nghiêng, font serif */}
              <span className="text-accent italic font-serif relative pr-2">
                Autumn
                {/* (Tùy chọn) Thêm một nét gạch chân trang trí nhẹ nếu muốn */}
                {/* <span className="absolute bottom-1 left-0 w-full h-px bg-accent opacity-30"></span> */}
              </span> 
              Skincare
            </h2>
            
            {/* Đoạn văn mô tả */}
            <p className="text-gray-600 leading-relaxed max-w-md mx-auto md:mx-0">
              We Believe That Beauty Thrives In Diversity And Discovery. Our Purpose Is To Expand The Way The World Sees Beauty. Discover The New Collection.
            </p>
            
            {/* Nút bấm */}
            <div className="pt-4">
              <Button className="px-8 py-3 text-sm tracking-wider">
                Explore More
              </Button>
            </div>
          </div>

          {/* --- Cột Phải: Hình ảnh (Chiếm 1/2 trên desktop) --- */}
          <div className="w-full md:w-1/2">
            {/* Tạo khung ảnh có bo góc nhẹ và bóng đổ tinh tế */}
            <div className="relative aspect-square md:aspect-[4/3] rounded-lg overflow-hidden shadow-xl ring-1 ring-black/5">
              <img 
                // Ảnh placeholder chất lượng cao giống mẫu (sản phẩm trên bục trưng bày)
                src="https://images.unsplash.com/photo-1616167417384-254979638977?q=80&w=1000" 
                alt="Autumn Skincare Collection" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};