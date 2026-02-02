import { AdminLayout } from '../../components/layout/AdminLayout';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

// --- Mock Data cho Biểu đồ (Đã sửa thành T1, T2 cho gọn trục X) ---
const data = [
  { name: 'T1', value: 4000 },
  { name: 'T2', value: 3000 },
  { name: 'T3', value: 5000 },
  { name: 'T4', value: 2780 },
  { name: 'T5', value: 1890 },
  { name: 'T6', value: 2390 },
  { name: 'T7', value: 3490 },
];

// --- Mock Data cho Bảng đơn hàng (Đã Việt hóa trạng thái) ---
const recentOrders = [
    { id: '#1001', user: 'Sophia Clark', date: '2024-07-20', status: 'Đang giao', total: '$75.00' },
    { id: '#1002', user: 'Liam Carter', date: '2024-07-19', status: 'Hoàn tất', total: '$120.00' },
    { id: '#1003', user: 'Olivia Bennett', date: '2024-07-18', status: 'Đang xử lý', total: '$55.00' },
    { id: '#1004', user: 'Noah Turner', date: '2024-07-17', status: 'Đang giao', total: '$90.00' },
    { id: '#1005', user: 'Ava Harper', date: '2024-07-16', status: 'Hoàn tất', total: '$150.00' },
];

export const AdminDashboard = () => {
  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-8">Bảng Điều Khiển</h1>

      {/* 1. Stats Cards (4 ô vuông trên cùng) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
         {/* Card 1 */}
         <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Tổng Doanh Thu</h3>
            <div className="text-2xl font-bold mb-1">$125,450</div>
            <span className="text-green-500 text-xs font-bold">+15%</span>
         </div>
         {/* Card 2 */}
         <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Tổng Đơn Hàng</h3>
            <div className="text-2xl font-bold mb-1">3,200</div>
            <span className="text-green-500 text-xs font-bold">+10%</span>
         </div>
         {/* Card 3 */}
         <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Khách Hàng Mới</h3>
            <div className="text-2xl font-bold mb-1">850</div>
            <span className="text-green-500 text-xs font-bold">+8%</span>
         </div>
         {/* Card 4 */}
         <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Tỷ Lệ Chuyển Đổi</h3>
            <div className="text-2xl font-bold mb-1">4.5%</div>
            <span className="text-green-500 text-xs font-bold">+5%</span>
         </div>
      </div>

      {/* 2. Charts Section (2 Biểu đồ sóng) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
         {/* Chart Trái: Revenue Trend */}
         <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
            <div className="mb-6">
                <h3 className="text-gray-500 text-sm font-medium">Xu Hướng Doanh Thu</h3>
                <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold">$125,450</span>
                    <span className="text-gray-400 text-xs mb-1">30 ngày qua <span className="text-green-500 font-bold">+15%</span></span>
                </div>
            </div>
            <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#884d58" stopOpacity={0.1}/> {/* Màu đỏ rượu nhạt */}
                                <stop offset="95%" stopColor="#884d58" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <Tooltip />
                        <Area type="monotone" dataKey="value" stroke="#884d58" strokeWidth={2} fillOpacity={1} fill="url(#colorVal)" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#999'}} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
         </div>

         {/* Chart Phải: Orders Trend */}
         <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
            <div className="mb-6">
                <h3 className="text-gray-500 text-sm font-medium">Xu Hướng Đơn Hàng</h3>
                <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold">3,200</span>
                    <span className="text-gray-400 text-xs mb-1">30 ngày qua <span className="text-green-500 font-bold">+10%</span></span>
                </div>
            </div>
            <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                         <defs>
                            <linearGradient id="colorOrd" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#884d58" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#884d58" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <Tooltip />
                        <Area type="monotone" dataKey="value" stroke="#884d58" strokeWidth={2} fillOpacity={1} fill="url(#colorOrd)" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#999'}} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
         </div>
      </div>

      {/* 3. Recent Orders Table */}
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
         <div className="p-6 border-b border-gray-100">
             <h3 className="font-bold text-lg">Đơn Hàng Gần Đây</h3>
         </div>
         <div className="overflow-x-auto">
             <table className="w-full text-left text-sm">
                 <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-xs">
                     <tr>
                         <th className="px-6 py-4 font-medium">Mã Đơn</th>
                         <th className="px-6 py-4 font-medium">Khách Hàng</th>
                         <th className="px-6 py-4 font-medium">Ngày Đặt</th>
                         <th className="px-6 py-4 font-medium">Trạng Thái</th>
                         <th className="px-6 py-4 font-medium">Tổng Tiền</th>
                     </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                     {recentOrders.map((order) => (
                         <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                             <td className="px-6 py-4 text-primary font-medium">{order.id}</td>
                             <td className="px-6 py-4 text-gray-700">{order.user}</td>
                             <td className="px-6 py-4 text-gray-500 text-xs">{order.date}</td>
                             <td className="px-6 py-4">
                                 {/* Cập nhật logic kiểm tra status tiếng Việt */}
                                 <span className={`px-3 py-1 rounded-full text-xs font-bold 
                                    ${order.status === 'Hoàn tất' ? 'bg-green-100 text-green-700' : ''}
                                    ${order.status === 'Đang giao' ? 'bg-blue-100 text-blue-700' : ''}
                                    ${order.status === 'Đang xử lý' ? 'bg-yellow-100 text-yellow-700' : ''}
                                 `}>
                                     {order.status}
                                 </span>
                             </td>
                             <td className="px-6 py-4 text-gray-700">{order.total}</td>
                         </tr>
                     ))}
                 </tbody>
             </table>
         </div>
      </div>

    </AdminLayout>
  );
};