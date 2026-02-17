import { useState } from 'react';
import { 
  Search, Download, Bell, Calendar, ChevronDown, 
  MoreHorizontal, Wallet, ShoppingCart, Activity, Package 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { AdminLayout } from '../../components/layout/AdminLayout';

// --- 1. MOCK DATA ---

// Dữ liệu Biểu đồ (Doanh thu & Lợi nhuận)
const revenueData = [
  { name: 'Thg 1', revenue: 4000, profit: 2400 },
  { name: 'Thg 2', revenue: 3000, profit: 1398 },
  { name: 'Thg 3', revenue: 2000, profit: 9800 },
  { name: 'Thg 4', revenue: 2780, profit: 3908 },
  { name: 'Thg 5', revenue: 1890, profit: 4800 },
  { name: 'Thg 6', revenue: 2390, profit: 3800 },
  { name: 'Thg 7', revenue: 3490, profit: 4300 },
  { name: 'Thg 8', revenue: 4200, profit: 5100 },
];

// Dữ liệu Danh mục (Bên phải)
const categoryData = [
  { name: "Trang điểm (Makeup)", value: 42900, max: 60000, color: "bg-[#3D021E]" }, // Màu brand đậm
  { name: "Chăm sóc da (Skincare)", value: 31200, max: 60000, color: "bg-[#3D021E]" }, // Màu đỏ tươi
  { name: "Nước hoa (Fragrance)", value: 24500, max: 60000, color: "bg-[#FDA4AF]" }, // Màu hồng nhạt
  { name: "Phụ kiện (Accessories)", value: 18830, max: 60000, color: "bg-gray-400" },
];

// Dữ liệu Giao dịch gần đây
const transactions = [
  { id: "#ORD-90210", customer: "Nguyễn Văn An", email: "an.nguyen@example.com", date: "24 Th10, 2023", amount: 1240000, status: "Hoàn tất" },
  { id: "#ORD-90211", customer: "Trần Thị Bích", email: "bich.tran@example.com", date: "24 Th10, 2023", amount: 850000, status: "Đang xử lý" },
  { id: "#ORD-90212", customer: "Lê Hoàng C", email: "cuong.le@example.com", date: "23 Th10, 2023", amount: 2100000, status: "Hoàn tất" },
  { id: "#ORD-90213", customer: "Phạm Thu D", email: "dung.pham@example.com", date: "23 Th10, 2023", amount: 450000, status: "Đã hủy" },
  { id: "#ORD-90214", customer: "Hoàng Văn E", email: "em.hoang@example.com", date: "22 Th10, 2023", amount: 3200000, status: "Hoàn tất" },
];

// --- 2. COMPONENTS CON ---

// Thẻ Stat Card (Giống ảnh mẫu)
const StatCard = ({ title, value, percent, isIncrease, icon: Icon, barColor }: any) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-44">
        <div className="flex justify-between items-start">
            <div className={`p-3 rounded-xl bg-gray-50 text-[#3D021E]`}>
                <Icon className="w-6 h-6" />
            </div>
            <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md ${isIncrease ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {isIncrease ? '+' : ''}{percent}%
            </span>
        </div>
        <div>
            <p className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        </div>
        {/* Progress Bar ở đáy thẻ */}
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mt-2">
            <div className={`h-full rounded-full ${barColor}`} style={{ width: '60%' }}></div>
        </div>
    </div>
);

// --- 3. MAIN PAGE ---

export const AdminAnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState('12 Tháng');
  const [searchTerm, setSearchTerm] = useState('');

  // Logic tìm kiếm giao dịch
  const filteredTransactions = transactions.filter(t => 
    t.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      
      {/* HEADER: Title & Actions */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-8">
          <div>
              <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-gray-900">Tổng Quan Thống Kê</h1>
                  <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded uppercase">Trực tuyến</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">Theo dõi hiệu suất cửa hàng và các chỉ số kinh doanh.</p>
          </div>

          <div className="flex flex-col md:flex-row gap-3 w-full xl:w-auto">
              {/* Search Bar */}
              <div className="relative flex-1 md:w-80">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                      type="text" 
                      placeholder="Tìm kiếm dữ liệu phân tích..." 
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#3D021E] focus:ring-1 focus:ring-[#3D021E]"
                  />
              </div>
              <button className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-500">
                  <Bell className="w-5 h-5" />
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-[#3D021E] text-white rounded-xl text-sm font-bold hover:bg-red-600 shadow-lg shadow-red-200">
                  <Download className="w-4 h-4" /> Xuất Báo Cáo
              </button>
          </div>
      </div>

      {/* TIME FILTER TABS */}
      <div className="flex justify-end mb-6">
          <div className="bg-white p-1 rounded-xl border border-gray-100 inline-flex">
              {['12 Tháng', '30 Ngày', '7 Ngày', 'Tùy chọn'].map((tab) => (
                  <button 
                    key={tab}
                    onClick={() => setTimeRange(tab)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors
                        ${timeRange === tab ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900'}
                    `}
                  >
                      {tab}
                  </button>
              ))}
          </div>
      </div>

      {/* 1. STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Tổng Doanh Thu" value="128.430.000đ" percent={12.5} isIncrease={true} icon={Wallet} barColor="bg-green-500" />
          <StatCard title="Giá Trị Đơn TB" value="842.000đ" percent={0.0} isIncrease={true} icon={ShoppingCart} barColor="bg-yellow-400" />
          <StatCard title="Tỷ Lệ Chuyển Đổi" value="3.42%" percent={0.8} isIncrease={false} icon={Activity} barColor="bg-[#3D021E]" />
          <StatCard title="Tổng Đơn Hàng" value="1,524" percent={5.4} isIncrease={true} icon={Package} barColor="bg-blue-500" />
      </div>

      {/* 2. CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          {/* Main Chart: Revenue & Growth Trend */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                  <div>
                      <h3 className="font-bold text-lg text-gray-900">Xu Hướng Doanh Thu & Tăng Trưởng</h3>
                      <p className="text-xs text-gray-500">Phân tích doanh thu so với lợi nhuận ròng hàng tháng</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-bold">
                      <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#3D021E]"></span> Doanh thu</div>
                      <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#FCA5A5]"></span> Lợi nhuận</div>
                  </div>
              </div>
              
              <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={revenueData} barSize={32}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9CA3AF'}} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9CA3AF'}} />
                          <Tooltip 
                              cursor={{fill: 'transparent'}}
                              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                              formatter={(value: any) => [`${value.toLocaleString()}đ`]}
                          />
                          {/* Stacked Bars mô phỏng như ảnh */}
                          <Bar dataKey="profit" stackId="a" fill="#FEE2E2" radius={[0, 0, 4, 4]} /> {/* Màu hồng nhạt dưới */}
                          <Bar dataKey="revenue" stackId="a" fill="#3D021E" radius={[4, 4, 0, 0]} /> {/* Màu đỏ trên */}
                      </BarChart>
                  </ResponsiveContainer>
              </div>
          </div>

          {/* Side Chart: Sales by Category */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-lg text-gray-900 mb-1">Doanh Số Theo Danh Mục</h3>
              <p className="text-xs text-gray-500 mb-6">Phân bổ trên các dòng sản phẩm</p>

              <div className="space-y-6">
                  {categoryData.map((cat, index) => (
                      <div key={index}>
                          <div className="flex justify-between text-xs font-bold mb-2">
                              <span className="text-gray-700 uppercase">{cat.name}</span>
                              <span className="text-gray-900">{cat.value.toLocaleString()}đ</span>
                          </div>
                          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${cat.color}`} 
                                style={{ width: `${(cat.value / cat.max) * 100}%` }}
                              ></div>
                          </div>
                      </div>
                  ))}
              </div>

              <div className="mt-8 p-4 bg-gray-50 rounded-xl flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#3D021E] shadow-sm">
                      <Package className="w-5 h-5" />
                  </div>
                  <div>
                      <p className="text-xs text-gray-500">Danh mục dẫn đầu</p>
                      <p className="text-sm font-bold text-gray-900">Trang điểm chiếm 34% thị phần</p>
                  </div>
              </div>
          </div>
      </div>

      {/* 3. RECENT TRANSACTIONS (Table with Search Logic) */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                  <h3 className="font-bold text-lg text-gray-900">Giao Dịch Gần Đây</h3>
                  <p className="text-xs text-gray-500">Cập nhật trực tiếp các đơn đặt hàng toàn cầu</p>
              </div>
              
              {/* Table Search Logic */}
              <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                      type="text" 
                      placeholder="Tìm theo mã đơn, tên..." 
                      className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#3D021E] focus:ring-1 focus:ring-[#3D021E] w-64"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                  />
              </div>
          </div>

          <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-xs font-bold">
                      <tr>
                          <th className="px-6 py-4">Khách Hàng</th>
                          <th className="px-6 py-4">Mã Đơn</th>
                          <th className="px-6 py-4">Ngày</th>
                          <th className="px-6 py-4">Số Tiền</th>
                          <th className="px-6 py-4">Trạng Thái</th>
                          <th className="px-6 py-4 text-right"></th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                      {filteredTransactions.length > 0 ? (
                          filteredTransactions.map((t, i) => (
                              <tr key={i} className="hover:bg-gray-50 transition-colors">
                                  <td className="px-6 py-4">
                                      <div className="flex items-center gap-3">
                                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-xs text-gray-600">
                                              {t.customer.charAt(0)}
                                          </div>
                                          <div>
                                              <p className="font-bold text-gray-900">{t.customer}</p>
                                              <p className="text-xs text-gray-500">{t.email}</p>
                                          </div>
                                      </div>
                                  </td>
                                  <td className="px-6 py-4 text-gray-500 font-mono">{t.id}</td>
                                  <td className="px-6 py-4 text-gray-500">{t.date}</td>
                                  <td className="px-6 py-4 font-bold text-gray-900">{t.amount.toLocaleString()}đ</td>
                                  <td className="px-6 py-4">
                                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase
                                          ${t.status === 'Hoàn tất' ? 'bg-green-100 text-green-700' : ''}
                                          ${t.status === 'Đang xử lý' ? 'bg-yellow-100 text-yellow-700' : ''}
                                          ${t.status === 'Đã hủy' ? 'bg-red-100 text-red-700' : ''}
                                      `}>
                                          {t.status}
                                      </span>
                                  </td>
                                  <td className="px-6 py-4 text-right">
                                      <button className="text-gray-400 hover:text-gray-600">
                                          <MoreHorizontal className="w-4 h-4" />
                                      </button>
                                  </td>
                              </tr>
                          ))
                      ) : (
                          <tr>
                              <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                  Không tìm thấy giao dịch nào.
                              </td>
                          </tr>
                      )}
                  </tbody>
              </table>
          </div>
          
          <div className="p-4 border-t border-gray-100 flex justify-center">
              <button className="text-xs font-bold text-gray-500 hover:text-[#3D021E] flex items-center gap-1 transition-colors">
                  Xem tất cả giao dịch <ChevronDown className="w-3 h-3" />
              </button>
          </div>
      </div>

    </AdminLayout>
  );
};