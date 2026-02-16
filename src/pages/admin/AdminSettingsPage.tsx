import { useState } from 'react';
import { 
  Save, X, Upload, CreditCard, Truck, Shield, AlertCircle, CheckCircle2 
} from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';

export const AdminSettingsPage = () => {
  // --- STATE QUẢN LÝ FORM ---
  const [siteName, setSiteName] = useState('Glow Aura Store');
  const [supportEmail, setSupportEmail] = useState('support@glowaura.com');
  const [siteDesc, setSiteDesc] = useState('Nền tảng mua sắm mỹ phẩm cao cấp hàng đầu Việt Nam.');
  
  // State cổng thanh toán
  const [gateways, setGateways] = useState({
    stripe: true,
    paypal: false
  });

  // State vận chuyển
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(500000);
  const [shippingMethods, setShippingMethods] = useState({
    standard: true,
    express: true,
    international: false
  });

  // Mock Data: Bảng phân quyền
  const permissions = [
    { module: 'Doanh thu & Hóa đơn', admin: true, manager: true, editor: false, viewer: false },
    { module: 'Quản lý người dùng', admin: true, manager: false, editor: false, viewer: false },
    { module: 'Vận chuyển & Kho vận', admin: true, manager: true, editor: true, viewer: true },
  ];

  return (
    <AdminLayout>
      
      {/* 1. HEADER PAGE */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Cài Đặt Chung</h1>
            <p className="text-sm text-gray-500 mt-1">Quản lý thông tin cốt lõi và nhận diện thương hiệu của nền tảng.</p>
        </div>
        <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                Hủy thay đổi
            </button>
            <button className="flex items-center gap-2 px-6 py-2 bg-[#F97316] text-white rounded-lg text-sm font-bold hover:bg-orange-600 shadow-lg shadow-orange-100 transition-all">
                <Save className="w-4 h-4" /> Lưu Cấu Hình
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* === LEFT COLUMN (2/3 width) === */}
          <div className="lg:col-span-2 space-y-8">
              
              {/* SECTION: Platform Identity */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-orange-50 rounded-lg text-[#F97316]">
                          <Shield className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">Thông Tin Nền Tảng</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Tên Cửa Hàng</label>
                          <input 
                              type="text" 
                              value={siteName}
                              onChange={(e) => setSiteName(e.target.value)}
                              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]"
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Email Hỗ Trợ</label>
                          <input 
                              type="email" 
                              value={supportEmail}
                              onChange={(e) => setSupportEmail(e.target.value)}
                              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]"
                          />
                      </div>
                  </div>
                  
                  <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Mô Tả Cửa Hàng (Meta Description)</label>
                      <textarea 
                          rows={3}
                          value={siteDesc}
                          onChange={(e) => setSiteDesc(e.target.value)}
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]"
                      ></textarea>
                  </div>
              </div>

              {/* SECTION: Active Gateways */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                              <CreditCard className="w-5 h-5" />
                          </div>
                          <h3 className="text-lg font-bold text-gray-900">Cổng Thanh Toán</h3>
                      </div>
                      <button className="text-sm font-bold text-[#F97316] hover:underline">+ Thêm Mới</button>
                  </div>

                  <div className="space-y-4">
                      {/* Stripe */}
                      <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-[#635BFF] text-white rounded-lg flex items-center justify-center font-bold text-xs">S</div>
                              <div>
                                  <h4 className="font-bold text-gray-900">Stripe Connect</h4>
                                  <p className="text-xs text-gray-500">Đã kết nối từ tháng 1/2024</p>
                              </div>
                          </div>
                          <div className="flex items-center gap-3">
                              <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded uppercase">Active</span>
                              <div 
                                onClick={() => setGateways({...gateways, stripe: !gateways.stripe})}
                                className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${gateways.stripe ? 'bg-[#F97316]' : 'bg-gray-300'}`}
                              >
                                  <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${gateways.stripe ? 'translate-x-6' : ''}`}></div>
                              </div>
                          </div>
                      </div>

                      {/* PayPal */}
                      <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-[#00457C] text-white rounded-lg flex items-center justify-center font-bold text-xs">P</div>
                              <div>
                                  <h4 className="font-bold text-gray-900">PayPal Business</h4>
                                  <p className="text-xs text-gray-500">Đang chờ cấu hình</p>
                              </div>
                          </div>
                          <div className="flex items-center gap-3">
                              <span className="bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-1 rounded uppercase">Setup Req</span>
                              <div 
                                onClick={() => setGateways({...gateways, paypal: !gateways.paypal})}
                                className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${gateways.paypal ? 'bg-[#F97316]' : 'bg-gray-300'}`}
                              >
                                  <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${gateways.paypal ? 'translate-x-6' : ''}`}></div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>

              {/* SECTION: Permissions Overview */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                          <Shield className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">Phân Quyền Hệ Thống</h3>
                  </div>

                  <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                          <thead>
                              <tr className="text-gray-400 text-xs font-bold uppercase border-b border-gray-100">
                                  <th className="pb-3 pl-2">Module / Vai Trò</th>
                                  <th className="pb-3 text-center">Admin</th>
                                  <th className="pb-3 text-center">Manager</th>
                                  <th className="pb-3 text-center">Editor</th>
                                  <th className="pb-3 text-center">Viewer</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                              {permissions.map((perm, idx) => (
                                  <tr key={idx}>
                                      <td className="py-4 pl-2 font-bold text-gray-700">{perm.module}</td>
                                      <td className="py-4 text-center"><CheckCircle2 className={`w-5 h-5 mx-auto ${perm.admin ? 'text-green-500' : 'text-gray-200'}`} /></td>
                                      <td className="py-4 text-center"><CheckCircle2 className={`w-5 h-5 mx-auto ${perm.manager ? 'text-green-500' : 'text-gray-200'}`} /></td>
                                      <td className="py-4 text-center"><CheckCircle2 className={`w-5 h-5 mx-auto ${perm.editor ? 'text-green-500' : 'text-gray-200'}`} /></td>
                                      <td className="py-4 text-center"><CheckCircle2 className={`w-5 h-5 mx-auto ${perm.viewer ? 'text-green-500' : 'text-gray-200'}`} /></td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              </div>

          </div>

          {/* === RIGHT COLUMN (1/3 width) === */}
          <div className="space-y-8">
              
              {/* SECTION: Brand Assets */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-pink-50 rounded-lg text-pink-600">
                          <AlertCircle className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">Nhận Diện Thương Hiệu</h3>
                  </div>
                  
                  <p className="text-xs text-gray-500 mb-4">Tải lên logo độ phân giải cao cho trang admin và trang bán hàng.</p>
                  
                  <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:border-[#F97316] hover:bg-orange-50 transition-colors cursor-pointer group">
                      <div className="w-12 h-12 bg-orange-100 text-[#F97316] rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                          <Upload className="w-5 h-5" />
                      </div>
                      <p className="text-sm font-bold text-gray-900">Logo Chính</p>
                      <p className="text-xs text-gray-400 mt-1">SVG, PNG hoặc JPG (tối đa 2MB)</p>
                  </div>

                  <div className="mt-4 flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                      <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center">
                             <div className="w-4 h-4 bg-gray-400 rounded-sm"></div>
                          </div>
                          <div>
                              <p className="text-xs font-bold text-gray-900">current_logo.svg</p>
                              <p className="text-[10px] text-gray-400">Đã tải lên 12 ngày trước</p>
                          </div>
                      </div>
                      <button className="text-red-500 hover:text-red-700"><X className="w-4 h-4" /></button>
                  </div>
              </div>

              {/* SECTION: Shipping Logic */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-yellow-50 rounded-lg text-yellow-600">
                          <Truck className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">Cấu Hình Vận Chuyển</h3>
                  </div>

                  <div className="bg-orange-50 rounded-xl p-4 mb-6 border border-orange-100">
                      <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Ngưỡng Miễn Phí Vận Chuyển</label>
                      <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₫</span>
                          <input 
                              type="number" 
                              value={freeShippingThreshold}
                              onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
                              className="w-full pl-8 pr-4 py-2 bg-white border border-gray-200 rounded-lg font-bold text-gray-900 focus:outline-none focus:border-[#F97316]"
                          />
                      </div>
                      <p className="text-[10px] text-gray-500 mt-2 italic">Áp dụng tự động cho tất cả khu vực.</p>
                  </div>

                  <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={shippingMethods.standard}
                            onChange={() => setShippingMethods({...shippingMethods, standard: !shippingMethods.standard})}
                            className="w-4 h-4 rounded text-[#F97316] focus:ring-[#F97316]" 
                          />
                          <span className="text-sm font-medium text-gray-700">Giao hàng Tiêu chuẩn (3-5 ngày)</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={shippingMethods.express}
                            onChange={() => setShippingMethods({...shippingMethods, express: !shippingMethods.express})}
                            className="w-4 h-4 rounded text-[#F97316] focus:ring-[#F97316]" 
                          />
                          <span className="text-sm font-medium text-gray-700">Giao hàng Hỏa tốc (Trong ngày)</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={shippingMethods.international}
                            onChange={() => setShippingMethods({...shippingMethods, international: !shippingMethods.international})}
                            className="w-4 h-4 rounded text-[#F97316] focus:ring-[#F97316]" 
                          />
                          <span className="text-sm font-medium text-gray-700">Vận chuyển Quốc tế</span>
                      </label>
                  </div>
              </div>

              {/* SECTION: Pro Banner (Automation Engine) */}
              <div className="bg-[#F97316] p-6 rounded-2xl text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-white/20 text-[10px] font-bold px-2 py-1 rounded-bl-lg">PRO FEATURE</div>
                  <div className="mb-4">
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mb-2">
                          <AlertCircle className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="font-bold text-lg">Automation Engine</h3>
                  </div>
                  <p className="text-xs text-white/90 mb-6 leading-relaxed">
                      Thiết lập quy trình làm việc tự động để quản lý kho hàng và nhật ký vận chuyển mà không cần can thiệp thủ công.
                  </p>
                  <button className="w-full py-2.5 bg-white text-[#F97316] font-bold text-sm rounded-lg hover:bg-orange-50 transition-colors">
                      Cấu Hình Workflow
                  </button>
              </div>

          </div>
      </div>

    </AdminLayout>
  );
};