import { Plus, Edit2, MapPin, Phone, User } from 'lucide-react';
import { MainLayout } from '../components/layout/MainLayout';
import { ProfileSidebar } from '../features/user/components/ProfileSidebar';

// 1. Mock Data (Giữ nguyên)
const savedAddresses = [
  {
    id: 1,
    label: 'Nhà riêng',
    receiver: 'Nguyễn Văn A',
    phone: '(+84) 90 123 4567',
    address: '123 Đường Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=600',
    isDefault: true
  },
  {
    id: 2,
    label: 'Văn phòng',
    receiver: 'Nguyễn Văn A',
    phone: '(+84) 90 123 4567',
    address: 'Tầng 12, Tòa nhà Bitexco, Số 2 Hải Triều, Quận 1, TP. Hồ Chí Minh',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600',
    isDefault: false
  },
  {
    id: 3,
    label: 'Nhà nghỉ dưỡng',
    receiver: 'Gia đình Nguyễn',
    phone: '(+84) 98 765 4321',
    address: 'Biệt thự số 5, Đường Hoa Hồng, Phường 4, TP. Đà Lạt, Lâm Đồng',
    image: 'https://media.sbshouse.vn/wp-content/uploads/2025/01/thiet-ke-biet-thu-nghi-duong-1.jpg',
    isDefault: false
  },
];

export const AddressPage = () => {
  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen py-10 font-sans">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8">Tài khoản của tôi</h1>

          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Sidebar */}
            <ProfileSidebar activePage="address" />

            {/* Main Content */}
            <div className="w-full lg:w-3/4">
              <div className="bg-white rounded-xl shadow-sm p-8 min-h-[500px]">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h2 className="text-2xl font-serif font-bold text-[#3D021E]">Sổ địa chỉ nhận hàng</h2>
                        <p className="text-gray-500 text-sm mt-1">Quản lý danh sách địa chỉ để thanh toán nhanh hơn</p>
                    </div>
                    
                    <button className="flex items-center gap-2 bg-[#FCE4EC] text-[#3D021E] px-5 py-2.5 rounded-sm font-bold text-sm hover:bg-[#3D021E] hover:text-white transition-all shadow-sm">
                        <Plus className="w-4 h-4" />
                        Thêm địa chỉ mới
                    </button>
                </div>

                {/* Danh sách địa chỉ */}
                <div className="space-y-8">
                    {savedAddresses.map((item) => (
                        <div key={item.id} className="group flex flex-col md:flex-row gap-6 border-b border-gray-100 pb-8 last:border-0 last:pb-0 items-stretch">
                            
                            {/* Cột trái: Thông tin Text */}
                            <div className="flex-1 space-y-3 flex flex-col justify-center">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-lg font-bold text-gray-900">{item.label}</h3>
                                    {item.isDefault && (
                                        <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded border border-green-200 uppercase">
                                            Mặc định
                                        </span>
                                    )}
                                </div>

                                <div className="text-sm text-gray-600 space-y-2">
                                    <p className="flex items-center gap-2">
                                        <User className="w-4 h-4 text-gray-400" />
                                        <span className="font-medium text-[#3D021E]">{item.receiver}</span>
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-gray-400" />
                                        {item.phone}
                                    </p>
                                    <p className="flex items-start gap-2 leading-relaxed">
                                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                        {item.address}
                                    </p>
                                </div>

                                {/* Nút Chỉnh sửa */}
                                <div className="pt-2">
                                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-sm text-xs font-bold hover:bg-[#3D021E] hover:text-white transition-colors shadow-sm border border-gray-100">
                                        <Edit2 className="w-3 h-3" /> Chỉnh sửa
                                    </button>
                                </div>
                            </div>

                            {/* === CỘT PHẢI: HÌNH ẢNH (ĐÃ SỬA) === */}
                            {/* Thay đổi quan trọng:
                                - h-48: Chiều cao cố định trên mobile (khoảng 192px)
                                - md:h-52: Chiều cao cố định trên desktop (khoảng 208px) -> Giúp ảnh đều nhau
                                - md:w-2/5: Tăng chiều rộng ảnh lên một chút cho cân đối
                            */}
                            <div className="w-full md:w-2/5 h-48 md:h-52 relative rounded-lg overflow-hidden shadow-sm flex-shrink-0">
                                <img 
                                    src={item.image} 
                                    alt={item.label} 
                                    // object-cover: Đảm bảo ảnh phủ kín khung mà không bị méo
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                            </div>

                        </div>
                    ))}
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};