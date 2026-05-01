import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Tag, Ticket, Percent, 
  DollarSign, CalendarClock, Settings, CheckCircle2, 
  Wand2, Loader2
} from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
// import apiClient from '../../services/apiClient'; // Mở comment này khi có API thật

export const AdminAddPromotionPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form States
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    discountType: 'percentage', // 'percentage' | 'fixed' | 'shipping'
    discountValue: '',
    minPurchase: '',
    usageLimit: '',
    startDate: '',
    endDate: '',
    status: 'active'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Tự động in hoa và bỏ khoảng trắng cho Mã Code
    if (name === 'code') {
        setFormData(prev => ({ ...prev, [name]: value.toUpperCase().replace(/\s/g, '') }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // tạo mã ngẫu nhiên
  const handleGenerateCode = () => {
    const randomCode = 'GLOW' + Math.random().toString(36).substring(2, 8).toUpperCase();
    setFormData(prev => ({ ...prev, code: randomCode }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. VALIDATION CƠ BẢN
    if (formData.discountType === 'percentage' && Number(formData.discountValue) > 100) {
        return alert('Mức giảm theo phần trăm không được vượt quá 100%');
    }
    if (formData.discountType !== 'shipping' && Number(formData.discountValue) <= 0) {
        return alert('Mức giảm giá phải lớn hơn 0');
    }
    if (formData.startDate && formData.endDate) {
        if (new Date(formData.endDate) <= new Date(formData.startDate)) {
            return alert('Thời gian kết thúc phải diễn ra sau thời gian bắt đầu!');
        }
    }

    setIsSubmitting(true);
    
    // 2. CHUẨN BỊ PAYLOAD CHO API C#
    const payload = {
        name: formData.name,
        code: formData.code,
        description: formData.description,
        discountType: formData.discountType === 'percentage' ? 1 : (formData.discountType === 'fixed' ? 2 : 3),
        discountValue: formData.discountType === 'shipping' ? 0 : Number(formData.discountValue),
        minOrderValue: formData.minPurchase ? Number(formData.minPurchase) : null,
        maxUses: formData.usageLimit ? Number(formData.usageLimit) : null,
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
        isActive: formData.status === 'active'
    };

    try {
        console.log("Chuẩn bị gửi dữ liệu Khuyến mãi:", payload);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        alert('Đã lưu mã khuyến mãi thành công!');
        navigate('/admin/promotions');
    } catch (error: any) {
        console.error("Lỗi khi tạo khuyến mãi:", error);
        alert(error.response?.data?.message || 'Có lỗi xảy ra khi lưu Khuyến mãi!');
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto font-sans text-gray-900">
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
                <button 
                  onClick={() => navigate('/admin/promotions')}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Thêm Khuyến Mãi Mới</h1>
                    <p className="text-sm text-gray-500 mt-1">Tạo mã giảm giá và các chương trình tự động</p>
                </div>
            </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* === LEFT COLUMN (Details & Rules) === */}
            <div className="lg:col-span-2 space-y-6">
                
                {/* 1. Promotion Details */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h2 className="text-lg font-bold mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
                        <Tag className="w-5 h-5 text-[#3D021E]" /> Chi Tiết Khuyến Mãi
                    </h2>
                    
                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tên Chương Trình <span className="text-red-500">*</span></label>
                            <input required type="text" name="name" placeholder="VD: Siêu Sale Mùa Hè 2024" 
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:border-[#3D021E] outline-none transition-colors"
                                value={formData.name} onChange={handleChange}
                            />
                            <p className="text-xs text-gray-500 mt-1.5">Tên này chỉ dùng trong quản lý nội bộ và không hiển thị cho khách hàng.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Mã Giảm Giá <span className="text-red-500">*</span></label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input required type="text" name="code" placeholder="VD: SUMMER20" 
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:border-[#3D021E] outline-none transition-colors uppercase font-mono"
                                        value={formData.code} onChange={handleChange}
                                    />
                                </div>
                                <button type="button" onClick={handleGenerateCode} className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                                    <Wand2 className="w-4 h-4" /> Tạo mã ngẫu nhiên
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Mô tả (Tùy chọn)</label>
                            <textarea rows={3} name="description" placeholder="Ghi chú nội dung chi tiết về chương trình này..." 
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:border-[#3D021E] outline-none resize-none transition-colors"
                                value={formData.description} onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>

                {/* 2. Discount Rules */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h2 className="text-lg font-bold mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
                        <Settings className="w-5 h-5 text-[#3D021E]" /> Quy Tắc Giảm Giá
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Loại Giảm Giá</label>
                            <select name="discountType" 
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:border-[#3D021E] outline-none transition-colors appearance-none"
                                value={formData.discountType} onChange={handleChange}
                            >
                                <option value="percentage">Phần trăm (%)</option>
                                <option value="fixed">Số tiền cố định (đ)</option>
                                <option value="shipping">Miễn phí vận chuyển</option>
                            </select>
                        </div>
                        
                        {formData.discountType !== 'shipping' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Mức Giảm <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    {formData.discountType === 'percentage' ? (
                                        <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    ) : (
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    )}
                                    <input required type="number" name="discountValue" placeholder="0" min="1"
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:border-[#3D021E] outline-none transition-colors"
                                        value={formData.discountValue} onChange={handleChange}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Giá Trị Đơn Tối Thiểu</label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input type="number" name="minPurchase" placeholder="0 (Không áp dụng)" min="0"
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:border-[#3D021E] outline-none transition-colors"
                                    value={formData.minPurchase} onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Giới Hạn Số Lần Sử Dụng</label>
                            <input type="number" name="usageLimit" placeholder="Để trống nếu không giới hạn" min="1"
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:border-[#3D021E] outline-none transition-colors"
                                value={formData.usageLimit} onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>

            </div>

            {/* === RIGHT COLUMN (Schedule & Status) === */}
            <div className="lg:col-span-1 space-y-6">
                
                {/* 1. Schedule */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h2 className="text-lg font-bold mb-6 text-left flex items-center gap-2 border-b border-gray-100 pb-4">
                        <CalendarClock className="w-5 h-5 text-[#3D021E]" /> Thời Gian Áp Dụng
                    </h2>
                    
                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Thời Gian Bắt Đầu <span className="text-red-500">*</span></label>
                            <input required type="datetime-local" name="startDate" 
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:border-[#3D021E] outline-none transition-colors text-gray-600"
                                value={formData.startDate} onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Thời Gian Kết Thúc</label>
                            <input type="datetime-local" name="endDate" 
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:border-[#3D021E] outline-none transition-colors text-gray-600"
                                value={formData.endDate} onChange={handleChange}
                            />
                            <p className="text-xs text-gray-500 mt-1.5">Để trống ngày kết thúc nếu đây là khuyến mãi vĩnh viễn.</p>
                        </div>
                    </div>
                </div>

                {/* 2. Status & Submit */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
                    <h2 className="text-lg font-bold mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
                        <Tag className="w-5 h-5 text-[#3D021E]" /> Trạng Thái
                    </h2>
                    
                    <div className="space-y-4 mb-8">
                        <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                            <input type="radio" name="status" value="active" 
                                checked={formData.status === 'active'} onChange={handleChange}
                                className="w-4 h-4 mt-0.5 text-green-600 focus:ring-green-600"
                            />
                            <div>
                                <span className="block text-sm font-bold text-gray-900">Đang hoạt động</span>
                                <span className="block text-xs text-gray-500">Khuyến mãi sẽ chạy ngay khi đến giờ bắt đầu</span>
                            </div>
                        </label>
                        <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                            <input type="radio" name="status" value="draft" 
                                checked={formData.status === 'draft'} onChange={handleChange}
                                className="w-4 h-4 mt-0.5 text-gray-600 focus:ring-gray-600"
                            />
                            <div>
                                <span className="block text-sm font-bold text-gray-900">Lưu bản nháp</span>
                                <span className="block text-xs text-gray-500">Lưu lại để chỉnh sửa sau, chưa khả dụng</span>
                            </div>
                        </label>
                    </div>

                    <div className="space-y-3">
                        <button 
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-[#3D021E] text-white font-bold rounded-xl hover:bg-[#5a032d] shadow-lg shadow-pink-200 transition-all disabled:opacity-70"
                        >
                            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                            {isSubmitting ? 'Đang lưu...' : 'Lưu Khuyến Mãi'}
                        </button>
                        <button 
                            type="button"
                            onClick={() => navigate('/admin/promotions')}
                            className="w-full py-3 bg-white text-gray-700 font-bold border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            Hủy bỏ
                        </button>
                    </div>
                </div>

            </div>
        </form>
      </div>
    </AdminLayout>
  );
};