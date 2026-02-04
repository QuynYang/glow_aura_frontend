import { X } from 'lucide-react'; // Dùng icon X để xóa
import { MainLayout } from '../components/layout/MainLayout';
import { ProfileSidebar } from '../features/user/components/ProfileSidebar';
import { Button } from '../components/ui/Button';
import { ProductCard } from '../features/products/components/ProductCard'; 

// Mock Data (Cần khớp cấu trúc với ProductCard của bạn)
const wishlistItems = [
  {
    id: 1,
    brand: 'Dior',
    name: 'Radiant Glow Serum',
    price: 1150000,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600',
    tag: 'New'
  },
  {
    id: 2,
    brand: 'Estee Lauder',
    name: 'Hydrating Rose Toner',
    price: 720000,
    image: 'https://images.unsplash.com/photo-1601049676869-702ea24cfd58?q=80&w=600',
  },
  {
    id: 3,
    brand: 'Clinique',
    name: 'Velvet Matte Lipstick',
    price: 560000,
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=600',
    tag: 'Hot'
  },
  {
    id: 4,
    brand: 'Laneige',
    name: 'Soothing Aloe Mask',
    price: 450000,
    image: 'https://amc.apglobal.com/image/384224417642/image_oqp7fvafs979f33d4nvctlsn4q/-FJPG/cica_sleeping_mask_test_vn_240311.jpg',
  },
];

export const WishlistPage = () => {
  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen py-10 font-sans">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8">Danh sách yêu thích</h1>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar (Active tab: wishlist) */}
            <ProfileSidebar activePage="wishlist" />

            {/* Main Content */}
            <div className="w-full lg:w-3/4">
              {wishlistItems.length > 0 ? (
                // Sử dụng Grid giống hệt trang Product List
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {wishlistItems.map((item) => (
                    // Bọc trong div relative để đặt nút Xóa
                    <div key={item.id} className="relative group">
                      
                      {/* 2. TÁI SỬ DỤNG PRODUCT CARD CŨ */}
                      <ProductCard product={item} />

                      {/* 3. Nút Xóa (Đè lên góc phải trên của ảnh) */}
                      <button 
                        className="absolute top-2 right-2 z-20 bg-white/80 backdrop-blur-sm p-1.5 rounded-full text-gray-400 hover:text-red-500 hover:bg-white shadow-sm transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300"
                        title="Xóa khỏi danh sách yêu thích"
                        onClick={(e) => {
                            e.preventDefault(); // Chặn click vào thẻ sản phẩm
                            alert('Đã xóa sản phẩm khỏi yêu thích');
                        }}
                      >
                        <X className="w-4 h-4" />
                      </button>

                    </div>
                  ))}
                </div>
              ) : (
                // Giao diện khi danh sách trống
                <div className="bg-white rounded-xl p-12 text-center shadow-sm">
                    <p className="text-gray-500 mb-4">Danh sách yêu thích của bạn đang trống.</p>
                    <Button variant="outline">Tiếp tục mua sắm</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};