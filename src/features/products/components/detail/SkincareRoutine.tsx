import { ProductCard } from '../ProductCard';
import { products } from '../../../../data/mockData'; // Tái sử dụng list sản phẩm
import { SectionHeading } from '../../../../components/ui/SectionHeading';

export const SkincareRoutine = () => {
  // Lấy 4 sản phẩm bất kỳ làm Routine
  const routineItems = products.slice(0, 4);

  return (
    <section className="bg-[#FAF9F6] py-20"> {/* Nền màu kem nhạt giống ảnh */}
      <div className="container mx-auto px-4">
        {/* Tiêu đề & Pagination giả */}
        <div className="text-center mb-10">
            <h2 className="text-2xl font-serif font-bold mb-4">Đề xuất lộ trình Skincare</h2>
            <div className="flex justify-center gap-4 text-sm font-medium text-gray-400">
                <span className="text-black border-b border-black cursor-pointer">1</span>
                <span className="cursor-pointer hover:text-black">2</span>
                <span className="cursor-pointer hover:text-black">3</span>
            </div>
        </div>

        {/* Grid Sản Phẩm */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {routineItems.map((item) => (
                <div key={item.id} className="bg-white p-4"> {/* Thêm nền trắng cho card nổi bật */}
                    <ProductCard product={item} />
                </div>
            ))}
        </div>
      </div>
    </section>
  );
};