import { AdminLayout } from '../../components/layout/AdminLayout';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line 
} from 'recharts';
import { 
  Wallet, ShoppingCart, Users, PieChart, Download, Calendar, 
  MoreHorizontal, ArrowUpRight, ArrowDownRight 
} from 'lucide-react';

// --- DATA: Biểu đồ Sparkline (Sóng nhỏ trong thẻ) ---
const sparkData1 = [{v: 40}, {v: 30}, {v: 60}, {v: 40}, {v: 70}, {v: 60}, {v: 80}]; // Tăng
const sparkData2 = [{v: 80}, {v: 60}, {v: 50}, {v: 40}, {v: 30}, {v: 40}, {v: 30}]; // Giảm
const sparkData3 = [{v: 20}, {v: 40}, {v: 30}, {v: 50}, {v: 40}, {v: 60}, {v: 70}]; // Tăng mạnh
const sparkData4 = [{v: 40}, {v: 45}, {v: 40}, {v: 50}, {v: 48}, {v: 52}, {v: 55}]; // Ổn định

// --- DATA: Biểu đồ chính ---
const revenueData = [
  { name: '01/09', current: 4000, previous: 2400 },
  { name: '07/09', current: 3000, previous: 1398 },
  { name: '14/09', current: 2000, previous: 3800 },
  { name: '21/09', current: 2780, previous: 3908 },
  { name: '28/09', current: 1890, previous: 4800 },
  { name: '30/09', current: 2390, previous: 3800 },
];

// --- COMPONENT: StatCard (Có biểu đồ sóng) ---
const StatCard = ({ title, value, percent, isIncrease, icon: Icon, colorClass, chartData, chartColor }: any) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-48 relative overflow-hidden group hover:shadow-md transition-all">
        <div className="flex justify-between items-start z-10">
            <div className={`p-3 rounded-xl ${colorClass} bg-opacity-10`}>
                <Icon className={`w-6 h-6 ${colorClass.replace('bg-', 'text-')}`} />
            </div>
            <span className={`px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1 ${isIncrease ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {isIncrease ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {percent}%
            </span>
        </div>
        
        <div className="z-10 mt-4">
            <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
            <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
        </div>

        {/* SPARKLINE CHART (Biểu đồ sóng ở đáy) */}
        <div className="absolute bottom-0 left-0 right-0 h-16 opacity-50">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                    <defs>
                        <linearGradient id={`grad${title}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={chartColor} stopOpacity={0.3}/>
                            <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <Area 
                        type="monotone" 
                        dataKey="v" 
                        stroke={chartColor} 
                        strokeWidth={3} 
                        fill={`url(#grad${title})`} 
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    </div>
);

// --- Dữ liệu bảng & Top Products (Giữ nguyên như cũ) ---
const topProducts = [
    { id: 1, name: "Son Môi Aura Silk", sales: 248, price: 1050000, status: "Còn hàng", image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=200" },
    { id: 2, name: "Serum Phục Hồi Glow", sales: 192, price: 2200000, status: "Còn hàng", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=200" },
    { id: 3, name: "Kem Dưỡng Đêm Midnight", sales: 156, price: 1600000, status: "Sắp hết", image: "https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?q=80&w=200" },
    { id: 4, name: "Bộ Cọ Trang Điểm Precision", sales: 124, price: 3000000, status: "Còn hàng", image: "https://images.unsplash.com/photo-1620917670397-a3313437ef1a?q=80&w=200" }
];

const recentOrders = [
    { id: '#GA-92384', customer: 'Nguyễn Văn A', date: '28 Th09, 2023', amount: 4700000, status: 'Đang giao' },
    { id: '#GA-92381', customer: 'Trần Thị B', date: '27 Th09, 2023', amount: 10500000, status: 'Đang xử lý' },
    { id: '#GA-92379', customer: 'Lê Văn C', date: '27 Th09, 2023', amount: 1600000, status: 'Đã giao' },
    { id: '#GA-92376', customer: 'Phạm Thị D', date: '26 Th09, 2023', amount: 31250000, status: 'Chờ xác nhận' },
];

export const AdminDashboard = () => {
  return (
    <AdminLayout>
      
      {/* HEADER PAGE */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Tổng Quan</h1>
            <p className="text-sm text-gray-500 mt-1">Theo dõi hiệu suất cửa hàng và các chỉ số hàng ngày.</p>
        </div>
        <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                <Calendar className="w-4 h-4" /> 30 ngày qua
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#FF3B30] text-white rounded-lg text-sm font-bold hover:bg-red-600 shadow-sm transition-colors shadow-red-200">
                <Download className="w-4 h-4" /> Xuất Báo Cáo
            </button>
        </div>
      </div>

      {/* 1. STATS CARDS (Đã thêm Sparkline) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
         <StatCard 
            title="Tổng Doanh Thu" 
            value="3.210.000.000đ" 
            percent={12.5} 
            isIncrease={true} 
            icon={Wallet} 
            colorClass="bg-[#3D021E]"
            chartData={sparkData1}
            chartColor="#3D021E"
         />
         <StatCard 
            title="Tổng Đơn Hàng" 
            value="1,240" 
            percent={2.4} 
            isIncrease={false} 
            icon={ShoppingCart} 
            colorClass="bg-yellow-500" 
            chartData={sparkData2}
            chartColor="#EAB308" // Màu vàng
         />
         <StatCard 
            title="Khách Hàng Mới" 
            value="856" 
            percent={18.2} 
            isIncrease={true} 
            icon={Users} 
            colorClass="bg-red-500" 
            chartData={sparkData3}
            chartColor="#EF4444" // Màu đỏ
         />
         <StatCard 
            title="Tỷ Lệ Chuyển Đổi" 
            value="3.2%" 
            percent={0.5} 
            isIncrease={true} 
            icon={PieChart} 
            colorClass="bg-purple-600" 
            chartData={sparkData4}
            chartColor="#9333EA" // Màu tím
         />
      </div>

      {/* 2. MIDDLE SECTION (Chart & Top Products) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
         {/* LEFT: Revenue Chart */}
         <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg text-gray-900">Doanh Thu Theo Thời Gian</h3>
                <div className="flex items-center gap-4 text-xs font-medium">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-[#3D021E]"></span> Kỳ này
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-gray-300"></span> Kỳ trước
                    </div>
                </div>
            </div>
            <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData}>
                        <defs>
                            <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3D021E" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#3D021E" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9CA3AF'}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9CA3AF'}} />
                        <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                            formatter={(value: any) => [`${value.toLocaleString('vi-VN')}đ`, '']}
                        />
                        <Area type="monotone" dataKey="current" stroke="#3D021E" strokeWidth={3} fillOpacity={1} fill="url(#colorCurrent)" />
                        <Area type="monotone" dataKey="previous" stroke="#E5E7EB" strokeWidth={3} fill="transparent" strokeDasharray="5 5" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
         </div>

         {/* RIGHT: Top Selling Products */}
         <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg text-gray-900">Sản Phẩm Bán Chạy</h3>
                <button className="text-xs font-bold text-[#FF3B30] hover:underline">Xem tất cả</button>
            </div>
            <div className="space-y-6">
                {topProducts.map((product) => (
                    <div key={product.id} className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                        <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover bg-gray-100 border border-gray-100" />
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-gray-900 truncate">{product.name}</h4>
                            <p className="text-xs text-gray-500">{product.sales} đơn hàng</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-bold text-gray-900">{product.price.toLocaleString('vi-VN')}đ</p>
                            <span className={`text-[10px] font-bold ${product.status === 'Còn hàng' ? 'text-green-500' : 'text-yellow-500'}`}>
                                {product.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
         </div>
      </div>

      {/* 3. RECENT ORDERS TABLE (Giữ nguyên cấu trúc nhưng bo tròn đẹp hơn) */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
         <div className="p-6 border-b border-gray-100 flex justify-between items-center">
             <h3 className="font-bold text-lg text-gray-900">Đơn Hàng Gần Đây</h3>
             <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                 <MoreHorizontal className="w-5 h-5 text-gray-400" />
             </button>
         </div>
         <div className="overflow-x-auto">
             <table className="w-full text-left text-sm">
                 <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-xs font-bold">
                     <tr>
                         <th className="px-6 py-4">Mã Đơn</th>
                         <th className="px-6 py-4">Khách Hàng</th>
                         <th className="px-6 py-4">Ngày Đặt</th>
                         <th className="px-6 py-4">Tổng Tiền</th>
                         <th className="px-6 py-4">Trạng Thái</th>
                         <th className="px-6 py-4 text-right"></th>
                     </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                     {recentOrders.map((order) => (
                         <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                             <td className="px-6 py-4 font-bold text-[#3D021E]">{order.id}</td>
                             <td className="px-6 py-4">
                                 <div className="flex items-center gap-3">
                                     <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                                         {order.customer.charAt(0)}
                                     </div>
                                     <span className="font-medium text-gray-900">{order.customer}</span>
                                 </div>
                             </td>
                             <td className="px-6 py-4 text-gray-500">{order.date}</td>
                             <td className="px-6 py-4 font-bold text-gray-900">{order.amount.toLocaleString('vi-VN')}đ</td>
                             <td className="px-6 py-4">
                                 <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase
                                    ${order.status === 'Đã giao' ? 'bg-green-100 text-green-700' : ''}
                                    ${order.status === 'Đang giao' ? 'bg-blue-100 text-blue-700' : ''}
                                    ${order.status === 'Đang xử lý' ? 'bg-yellow-100 text-yellow-700' : ''}
                                    ${order.status === 'Chờ xác nhận' ? 'bg-gray-100 text-gray-700' : ''}
                                 `}>
                                     {order.status}
                                 </span>
                             </td>
                             <td className="px-6 py-4 text-right">
                                 <button className="text-gray-400 hover:text-[#3D021E]">
                                     <MoreHorizontal className="w-4 h-4" />
                                 </button>
                             </td>
                         </tr>
                     ))}
                 </tbody>
             </table>
         </div>
      </div>

    </AdminLayout>
  );
};