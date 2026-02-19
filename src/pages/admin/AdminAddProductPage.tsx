import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, ArrowLeft, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';

export const AdminAddProductPage = () => {
  const navigate = useNavigate();

  // --- FORM STATES ---
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    brand: '',
    price: '',
    discountPrice: ''
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Xử lý thay đổi input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Giả lập upload ảnh
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Tạo URL preview ảnh tạm thời (Local)
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    }
  };

  // Xử lý submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Giả lập call API lưu dữ liệu
    setTimeout(() => {
      console.log('Dữ liệu sản phẩm mới:', { ...formData, image: imagePreview });
      setIsSubmitting(false);
      alert('Đã thêm sản phẩm thành công!');
      navigate('/admin/products'); // Quay về trang danh sách
    }, 1000);
  };

  return (
    <AdminLayout>
      
      {/* Nút quay lại */}
      <button 
        onClick={() => navigate('/admin/products')}
        className="flex items-center gap-2 text-gray-500 hover:text-[#3D021E] transition-colors mb-6 text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4" /> Quay lại danh sách
      </button>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 max-w-4xl mx-auto">
        
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Thêm Sản Phẩm Mới</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Tên sản phẩm */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tên sản phẩm <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              name="name"
              required
              placeholder="Nhập tên sản phẩm..."
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#3D021E] focus:ring-1 focus:ring-[#3D021E] transition-colors"
            />
          </div>

          {/* Mô tả */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả sản phẩm</label>
            <textarea 
              name="description"
              rows={4}
              placeholder="Nhập mô tả chi tiết về sản phẩm..."
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#3D021E] focus:ring-1 focus:ring-[#3D021E] transition-colors resize-none"
            ></textarea>
          </div>

          {/* Danh mục & Thương hiệu (Chia 2 cột trên Desktop) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục <span className="text-red-500">*</span></label>
              <select 
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#3D021E] focus:ring-1 focus:ring-[#3D021E] transition-colors appearance-none cursor-pointer"
              >
                <option value="">-- Chọn danh mục --</option>
                <option value="Trang điểm">Trang điểm</option>
                <option value="Chăm sóc da">Chăm sóc da</option>
                <option value="Nước hoa">Nước hoa</option>
                <option value="Phụ kiện">Phụ kiện</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Thương hiệu</label>
              <select 
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#3D021E] focus:ring-1 focus:ring-[#3D021E] transition-colors appearance-none cursor-pointer"
              >
                <option value="">-- Chọn thương hiệu --</option>
                <option value="Aura Luxe">Aura Luxe</option>
                <option value="Glow Bloom">Glow Bloom</option>
                <option value="Silk Touch">Silk Touch</option>
              </select>
            </div>
          </div>

          {/* Giá bán & Giá KM (Chia 2 cột) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Giá bán (VNĐ) <span className="text-red-500">*</span></label>
              <input 
                type="number" 
                name="price"
                required
                placeholder="Ví dụ: 500000"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#3D021E] focus:ring-1 focus:ring-[#3D021E] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Giá khuyến mãi (Tùy chọn)</label>
              <input 
                type="number" 
                name="discountPrice"
                placeholder="Ví dụ: 450000"
                value={formData.discountPrice}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#3D021E] focus:ring-1 focus:ring-[#3D021E] transition-colors"
              />
            </div>
          </div>

          {/* Upload Ảnh (Kéo thả) */}
          <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hình ảnh sản phẩm</label>
              <div className="mt-1 flex justify-center px-6 pt-10 pb-12 border-2 border-gray-300 border-dashed rounded-xl hover:border-[#3D021E] hover:bg-pink-50/30 transition-all group relative cursor-pointer">
                  
                  {/* File Input Ẩn */}
                  <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />

                  <div className="space-y-2 text-center z-10 pointer-events-none">
                      {imagePreview ? (
                          <div className="relative w-32 h-32 mx-auto rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <span className="text-white text-xs font-bold">Đổi ảnh</span>
                              </div>
                          </div>
                      ) : (
                          <>
                              <Upload className="mx-auto h-10 w-10 text-gray-400 group-hover:text-[#3D021E] transition-colors" />
                              <div className="text-sm text-gray-600">
                                  <span className="font-bold text-[#3D021E]">Tải ảnh lên</span> hoặc kéo thả vào đây
                              </div>
                              <p className="text-xs text-gray-500">PNG, JPG, GIF tối đa 5MB</p>
                          </>
                      )}
                  </div>
              </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 border-t border-gray-100 flex justify-end gap-4">
              <button 
                type="button"
                onClick={() => navigate('/admin/products')}
                className="px-6 py-2.5 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                  Hủy bỏ
              </button>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-8 py-2.5 bg-[#E11D48] text-white font-bold rounded-lg hover:bg-[#BE123C] shadow-md shadow-red-200 transition-all text-sm disabled:opacity-70"
              >
                  {isSubmitting ? 'Đang lưu...' : (
                      <>
                        <CheckCircle2 className="w-4 h-4" /> Lưu Sản Phẩm
                      </>
                  )}
              </button>
          </div>

        </form>
      </div>
    </AdminLayout>
  );
};