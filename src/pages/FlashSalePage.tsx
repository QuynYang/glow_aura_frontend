import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Loader2 } from 'lucide-react';
import { MainLayout } from '../components/layout/MainLayout';
import { ProductCard } from '../features/products/components/ProductCard';
import { productService } from '../services/productService';

const CountdownTimer = () => {
  const calculateTimeLeft = () => {
    return { days: '02', hours: '14', minutes: '45', seconds: '32' };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const timeBoxClass =
    'w-16 h-20 md:w-20 md:h-24 bg-[#F9F5F2] rounded-lg border border-[#EBEBEB] flex flex-col items-center justify-center shadow-sm';
  const numberClass = 'text-2xl md:text-3xl font-bold text-[#3D021E]';
  const labelClass = 'text-[10px] uppercase tracking-wider text-gray-500 mt-1';

  return (
    <div className="flex gap-4 mb-10">
      <div className={timeBoxClass}>
        <span className={numberClass}>{timeLeft.days}</span>
        <span className={labelClass}>Ngày</span>
      </div>
      <div className={timeBoxClass}>
        <span className={numberClass}>{timeLeft.hours}</span>
        <span className={labelClass}>Giờ</span>
      </div>
      <div className={timeBoxClass}>
        <span className={numberClass}>{timeLeft.minutes}</span>
        <span className={labelClass}>Phút</span>
      </div>
      <div className={timeBoxClass}>
        <span className={numberClass}>{timeLeft.seconds}</span>
        <span className={labelClass}>Giây</span>
      </div>
    </div>
  );
};

export const FlashSalePage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await productService.getFlashSale();
        const list = Array.isArray(data) ? data : [];
        setProducts(list);
      } catch (e) {
        console.error(e);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };
    load();
    window.scrollTo(0, 0);
  }, []);

  return (
    <MainLayout>
      <div className="bg-white py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-10 bg-white">
            <div className="w-full lg:w-1/2 space-y-6">
              <span className="inline-block bg-[#3D021E] text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest mb-2">
                Ưu đãi giới hạn
              </span>
              <h1
                className="text-5xl md:text-7xl font-serif font-bold text-[#3D021E] leading-tight"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                Đang Sale Sốc
              </h1>
              <p className="text-gray-500 text-lg max-w-md leading-relaxed">
                Sở hữu ngay những sản phẩm dưỡng da cao cấp với mức giá ưu đãi từ API Glow Aura (flash sale đang hoạt động trên hệ
                thống).
              </p>

              <CountdownTimer />

              <a
                href="#flash-grid"
                className="inline-block bg-[#3D021E] hover:bg-[#5c032d] text-white px-10 py-4 rounded-sm font-bold text-sm uppercase tracking-widest transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Mua sắm ngay
              </a>
            </div>

            <div className="w-full lg:w-1/2 relative">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=1000"
                  alt="Flash Sale Hero"
                  className="w-full h-full object-cover"
                />
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#3D021E] rounded-full flex items-center justify-center text-white text-center shadow-2xl z-10 p-4">
                  <div>
                    <p className="text-xs uppercase font-medium mb-1">Lên đến</p>
                    <p className="text-3xl font-bold">Flash</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="flash-grid" className="bg-[#FAFAFA] py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
            <span className="text-xs text-gray-500">
              {isLoading ? 'Đang tải...' : `Hiển thị ${products.length} sản phẩm flash sale`}
            </span>

            <div className="relative group">
              <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-700 hover:text-[#A41C4E]">
                Sắp xếp: Mới nhất <ChevronDown className="w-3 h-3" />
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-[#3D021E]" />
            </div>
          ) : products.length === 0 ? (
            <p className="text-center text-gray-500 py-16">Hiện chưa có sản phẩm flash sale. Vui lòng quay lại sau.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="mt-16 flex justify-center gap-2">
            <button className="w-8 h-8 bg-[#A41C4E] text-white flex items-center justify-center font-medium text-sm rounded-sm">
              1
            </button>
            <button className="w-8 h-8 border border-gray-200 text-gray-600 flex items-center justify-center font-medium text-sm rounded-sm hover:border-[#A41C4E] hover:text-[#A41C4E]">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
