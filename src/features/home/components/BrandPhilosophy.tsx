import { Button } from '../../../components/ui/Button';

export const BrandPhilosophy = () => {
  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
          
          {/* Cột trái: Hình ảnh */}
          <div className="w-full md:w-1/2 animate-in slide-in-from-left duration-700">
            <div className="aspect-[4/5] md:aspect-[3/4] relative rounded-sm overflow-hidden shadow-lg">
              <img
                src="https://philosophy.com/cdn/shop/files/best_sellers_hero.jpg?crop=center&height=650&v=1763135438&width=1200"
                alt="Clean Beauty Philosophy"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>

          {/* Cột phải: Nội dung text (Đã Việt hóa) */}
          <div className="w-full md:w-1/2 space-y-8 animate-in slide-in-from-right duration-700 delay-200">
            <div>
              {/* Subtitle */}
              <h4 className="text-sm font-bold text-accent uppercase tracking-widest mb-3">
                Vẻ Đẹp Thuần Khiết
              </h4>
              {/* Tiêu đề lớn */}
              <h2 className="text-4xl lg:text-5xl font-serif font-bold text-primary leading-tight">
                Chế tác thủ công từ 100% nguyên liệu thiên nhiên
              </h2>
            </div>
            
            {/* Đoạn văn mô tả */}
            <p className="text-gray-600 leading-relaxed text-lg">
              Tại Glow Aura, chúng tôi cam kết chỉ sử dụng những nguyên liệu tự nhiên có chất lượng cao nhất trong các sản phẩm của mình. Chúng tôi tin rằng những gì bạn thoa lên da cần phải an toàn, hiệu quả và giàu dưỡng chất. Đó chính là lý do chúng tôi tuyệt đối không sử dụng hóa chất độc hại, paraben hay hương liệu tổng hợp.
            </p>

            {/* Nút bấm */}
            <Button className="px-8 py-3 text-sm uppercase tracking-wider">
              Tìm hiểu thêm về chúng tôi
            </Button>
          </div>

        </div>
      </div>
    </section>
  );
};