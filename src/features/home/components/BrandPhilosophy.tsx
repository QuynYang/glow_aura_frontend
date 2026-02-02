import { Button } from '../../../components/ui/Button';

export const BrandPhilosophy = () => {
  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
          
          {/* Cột trái: Hình ảnh (Chiếm 1/2 trên desktop) */}
          <div className="w-full md:w-1/2 animate-in slide-in-from-left duration-700">
            {/* Sử dụng aspect-ratio để giữ khung ảnh đẹp */}
            <div className="aspect-[4/5] md:aspect-[3/4] relative rounded-sm overflow-hidden shadow-lg">
              <img
                src="https://philosophy.com/cdn/shop/files/best_sellers_hero.jpg?crop=center&height=650&v=1763135438&width=1200"
                alt="Clean Beauty Philosophy"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>

          {/* Cột phải: Nội dung text (Chiếm 1/2 trên desktop) */}
          <div className="w-full md:w-1/2 space-y-8 animate-in slide-in-from-right duration-700 delay-200">
            <div>
              {/* Subtitle nhỏ màu hồng đậm */}
              <h4 className="text-sm font-bold text-accent uppercase tracking-widest mb-3">
                Clean Beauty
              </h4>
              {/* Tiêu đề lớn font Serif sang trọng */}
              <h2 className="text-4xl lg:text-5xl font-serif font-bold text-primary leading-tight">
                We Are Handmade Using Only The Natural Ingredients
              </h2>
            </div>
            
            {/* Đoạn văn mô tả */}
            <p className="text-gray-600 leading-relaxed text-lg">
              At Beautya We Are Committed To Using Only The Highest Quality, Natural Ingredients In Our Products. We Believe That What You Put On Your Skin Should Be Safe, Effective, And Nourishing. That's Why We Never Use Harsh Chemicals, Parabens, Or Synthetic Fragrances.
            </p>

            {/* Nút bấm */}
            <Button className="px-8 py-3 text-sm uppercase tracking-wider">
              Read More About Us
            </Button>
          </div>

        </div>
      </div>
    </section>
  );
};