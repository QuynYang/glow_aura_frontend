import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, ArrowLeft, CheckCircle2, Loader2, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import apiClient from '../../services/apiClient';

export const AdminAddProductPage = () => {
  const navigate = useNavigate();

  // --- FORM STATES ---
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    brand: '',
    price: '',
    discountPrice: '',
    stockQuantity: '10' 
  });

  const [categories, setCategories] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // States Ảnh
  const [imageMode, setImageMode] = useState<'upload' | 'url'>('upload');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. TẢI DANH MỤC CÓ SẴN TỪ DATABASE
  useEffect(() => {
      const fetchCategories = async () => {
          try {
              const response = await apiClient.get('/Products/categories');
              if (response.data && Array.isArray(response.data)) {
                  setCategories(response.data);
              }
          } catch (error) {
              console.error("Lỗi lấy danh mục:", error);
              // Fallback tạm thời nếu API /categories chưa có
              setCategories(['Trang điểm', 'Chăm sóc da', 'Nước hoa', 'Phụ kiện', 'Sữa rửa mặt', 'Chống nắng', 'Serum']);
          }
      };
      fetchCategories();
  }, []);

  // Xử lý thay đổi text input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- XỬ LÝ ẢNH ---
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
          return alert('Kích thước ảnh quá lớn! Vui lòng chọn ảnh dưới 5MB.');
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const url = e.target.value;
      setImageUrlInput(url);
      setImagePreview(url); // Cập nhật preview bằng Link trực tiếp
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
      e.stopPropagation(); 
      setImageFile(null);
      setImageUrlInput('');
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // --- XỬ LÝ LƯU SẢN PHẨM ---
  // Xử lý submit form gọi API (BẢN VÁ LỖI 415)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const priceNum = Number(formData.price);
    const discountNum = Number(formData.discountPrice);

    if (priceNum <= 0) return alert('Giá bán phải lớn hơn 0đ!');
    if (discountNum > 0 && discountNum >= priceNum) {
        return alert('Giá khuyến mãi phải nhỏ hơn Giá bán gốc!');
    }

    setIsSubmitting(true);

    try {
        // Gửi chuỗi JSON chuẩn mực để khớp với [FromBody] của C#
        const payload = {
            name: formData.name,
            description: formData.description,
            category: formData.category,
            brand: formData.brand,
            price: priceNum,
            stock: Number(formData.stockQuantity),
            // Nếu người dùng nhập link thì lấy link, nếu tải ảnh từ máy thì tạm thời dùng link ảnh giả định vì BE chưa hỗ trợ lưu file
            imageUrl: imageMode === 'url' ? imageUrlInput : "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=200", 
            skinType: 0 // 0 = SkinType.All (Mặc định)
        };

        // Gửi POST request dạng JSON (Mặc định của axios là application/json)
        await apiClient.post('/Products', payload);

        alert('Thêm sản phẩm thành công!');
        navigate('/admin/products'); 
    } catch (error: any) {
        console.error("Lỗi thêm sản phẩm:", error);
        const errorMsg = error.response?.data?.message || error.response?.data || 'Có lỗi xảy ra khi lưu sản phẩm!';
        alert(typeof errorMsg === 'string' ? errorMsg : "Lỗi không xác định từ server.");
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
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
              placeholder="VD: Son Kem Lì Aura Velvet..."
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:outline-none focus:border-[#3D021E] focus:ring-1 focus:ring-[#3D021E] transition-colors"
            />
          </div>

          {/* Mô tả */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả sản phẩm</label>
            <textarea 
              name="description"
              rows={4}
              placeholder="Nhập mô tả chi tiết về công dụng, thành phần của sản phẩm..."
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:outline-none focus:border-[#3D021E] focus:ring-1 focus:ring-[#3D021E] transition-colors resize-none"
            ></textarea>
          </div>

          {/* Danh mục & Thương hiệu */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục <span className="text-red-500">*</span></label>
              {/* Sử dụng Datalist để vừa chọn được, vừa gõ chữ thêm mới được */}
              <input 
                type="text"
                name="category"
                required
                list="category-list"
                placeholder="Chọn hoặc nhập danh mục mới..."
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:outline-none focus:border-[#3D021E] focus:ring-1 focus:ring-[#3D021E] transition-colors"
              />
              <datalist id="category-list">
                  {categories.map((cat, idx) => (
                      <option key={idx} value={cat} />
                  ))}
              </datalist>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Thương hiệu</label>
              <input 
                  type="text" 
                  name="brand"
                  placeholder="VD: Glow Aura, Dior, Kiehl's..."
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:outline-none focus:border-[#3D021E] focus:ring-1 focus:ring-[#3D021E] transition-colors"
              />
            </div>
          </div>

          {/* Giá bán, Giá KM & Tồn kho */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Giá gốc (VNĐ) <span className="text-red-500">*</span></label>
              <input 
                type="number" 
                name="price"
                required min="1000"
                placeholder="Ví dụ: 500000"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:outline-none focus:border-[#3D021E] focus:ring-1 focus:ring-[#3D021E] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Giá khuyến mãi (VNĐ)</label>
              <input 
                type="number" 
                name="discountPrice"
                placeholder="Ví dụ: 450000"
                min="1000"
                value={formData.discountPrice}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:outline-none focus:border-[#3D021E] focus:ring-1 focus:ring-[#3D021E] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Số lượng tồn kho <span className="text-red-500">*</span></label>
              <input 
                type="number" 
                name="stockQuantity"
                required min="0"
                placeholder="0"
                value={formData.stockQuantity}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:outline-none focus:border-[#3D021E] focus:ring-1 focus:ring-[#3D021E] transition-colors"
              />
            </div>
          </div>

          {/* Upload Ảnh */}
          <div>
              <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Hình ảnh sản phẩm</label>
                  
                  {/* Công tắc chọn chế độ ảnh */}
                  <div className="flex items-center gap-4 bg-gray-100 p-1 rounded-lg">
                      <button 
                          type="button"
                          onClick={() => { setImageMode('upload'); setImageUrlInput(''); setImagePreview(imageFile ? URL.createObjectURL(imageFile) : null); }}
                          className={`text-xs font-bold px-3 py-1.5 rounded-md transition-colors ${imageMode === 'upload' ? 'bg-white text-[#3D021E] shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                      >
                          Tải ảnh từ máy
                      </button>
                      <button 
                          type="button"
                          onClick={() => { setImageMode('url'); setImageFile(null); setImagePreview(imageUrlInput || null); }}
                          className={`text-xs font-bold px-3 py-1.5 rounded-md transition-colors ${imageMode === 'url' ? 'bg-white text-[#3D021E] shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                      >
                          Nhập Link ảnh
                      </button>
                  </div>
              </div>

              {/* UI CHẾ ĐỘ NHẬP LINK URL */}
              {imageMode === 'url' && (
                  <div className="mb-4 relative">
                      <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                          type="url" 
                          placeholder="Dán đường dẫn ảnh (URL) vào đây..."
                          value={imageUrlInput}
                          onChange={handleImageUrlChange}
                          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:outline-none focus:border-[#3D021E] focus:ring-1 focus:ring-[#3D021E] transition-colors"
                      />
                  </div>
              )}

              {/* Khung Hiển Thị / Kéo Thả */}
              <div 
                className={`flex justify-center px-6 py-8 border-2 border-dashed rounded-xl transition-all relative
                    ${imagePreview ? 'border-gray-200 bg-white' : 'border-gray-300 hover:border-[#3D021E] hover:bg-pink-50/30'}
                    ${imageMode === 'upload' && !imagePreview ? 'cursor-pointer' : ''}
                `}
                onClick={() => imageMode === 'upload' && !imagePreview && fileInputRef.current?.click()}
              >
                  {/* File Input Ẩn */}
                  <input 
                      type="file" 
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      className="hidden"
                  />

                  <div className="space-y-2 text-center z-10 w-full">
                      {imagePreview ? (
                          <div className="relative w-40 h-40 mx-auto rounded-lg overflow-hidden border border-gray-200 shadow-sm group">
                              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" 
                                  onError={(e) => {
                                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Lỗi+URL+Ảnh';
                                  }}
                              />
                              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-2">
                                  {imageMode === 'upload' && (
                                      <button 
                                          type="button"
                                          onClick={() => fileInputRef.current?.click()}
                                          className="px-3 py-1 bg-white text-gray-900 text-xs font-bold rounded hover:bg-gray-100"
                                      >
                                          Đổi ảnh khác
                                      </button>
                                  )}
                                  <button 
                                      type="button"
                                      onClick={handleRemoveImage}
                                      className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded hover:bg-red-600"
                                  >
                                      Xóa ảnh
                                  </button>
                              </div>
                          </div>
                      ) : (
                          <>
                              {imageMode === 'upload' ? (
                                  <>
                                      <Upload className="mx-auto h-10 w-10 text-gray-400 group-hover:text-[#3D021E] transition-colors mb-3" />
                                      <div className="text-sm text-gray-600">
                                          <span className="font-bold text-[#3D021E]">Tải ảnh lên</span> hoặc kéo thả vào đây
                                      </div>
                                      <p className="text-xs text-gray-500 mt-1">PNG, JPG, JPEG (Tối đa 5MB)</p>
                                  </>
                              ) : (
                                  <div className="py-4 text-sm text-gray-400">
                                      <ImageIcon className="mx-auto h-10 w-10 text-gray-300 mb-3" />
                                      Hãy dán link ảnh vào ô phía trên để xem trước
                                  </div>
                              )}
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
                className="px-6 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                  Hủy bỏ
              </button>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-8 py-2.5 bg-[#E11D48] text-white font-bold rounded-lg hover:bg-[#BE123C] shadow-md shadow-red-200 transition-all text-sm disabled:opacity-70"
              >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  {isSubmitting ? 'Đang lưu...' : 'Lưu Sản Phẩm'}
              </button>
          </div>

        </form>
      </div>
    </AdminLayout>
  );
};