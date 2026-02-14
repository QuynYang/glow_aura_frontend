import { AdminLayout } from '../../components/layout/AdminLayout';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

// --- Mock Data cho Biểu đồ ---
const data = [
  { name: 'T1', value: 4000 },
  { name: 'T2', value: 3000 },
  { name: 'T3', value: 5000 },
  { name: 'T4', value: 2780 },
  { name: 'T5', value: 1890 },
  { name: 'T6', value: 2390 },
  { name: 'T7', value: 3490 },
];

// --- Mock Data cho Bảng đơn hàng ---
const recentOrders = [
    { id: '#1001', user: 'Sophia Clark', date: '2024-07-20', status: 'Đang giao', total: 750000 },
    { id: '#1002', user: 'Liam Carter', date: '2024-07-19', status: 'Hoàn tất', total: 1200000 },
    { id: '#1003', user: 'Olivia Bennett', date: '2024-07-18', status: 'Đang xử lý', total: 550000 },
    { id: '#1004', user: 'Noah Turner', date: '2024-07-17', status: 'Đang giao', total: 900000 },
    { id: '#1005', user: 'Ava Harper', date: '2024-07-16', status: 'Hoàn tất', total: 1500000 },
];

export const AdminDashboard = () => {
  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-8">Bảng Điều Khiển</h1>

      {/* 1. Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
         <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Tổng Doanh Thu</h3>
            <div className="text-2xl font-bold mb-1">{(125450000).toLocaleString('vi-VN')}đ</div>
            <span className="text-green-500 text-xs font-bold">+15%</span>
         </div>
         <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Tổng Đơn Hàng</h3>
            <div className="text-2xl font-bold mb-1">{(3200).toLocaleString('vi-VN')}</div>
            <span className="text-green-500 text-xs font-bold">+10%</span>
         </div>
         <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Khách Hàng Mới</h3>
            <div className="text-2xl font-bold mb-1">850</div>
            <span className="text-green-500 text-xs font-bold">+8%</span>
         </div>
         <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Tỷ Lệ Chuyển Đổi</h3>
            <div className="text-2xl font-bold mb-1">4.5%</div>
            <span className="text-green-500 text-xs font-bold">+5%</span>
         </div>
      </div>

      {/* 2. Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
         {/* Chart Trái: Xu Hướng Doanh Thu */}
         <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
            <div className="mb-6">
                <h3 className="text-gray-500 text-sm font-medium">Xu Hướng Doanh Thu</h3>
                <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold">{(125450000).toLocaleString('vi-VN')}đ</span>
                    <span className="text-gray-400 text-xs mb-1">30 ngày qua <span className="text-green-500 font-bold">+15%</span></span>
                </div>
            </div>
            <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3D021E" stopOpacity={0.1}/> 
                                <stop offset="95%" stopColor="#3D021E" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        {/* ĐÃ SỬA LỖI TẠI ĐÂY: Dùng (value: any) */}
                        <Tooltip formatter={(value: any) => [`${value.toLocaleString('vi-VN')}đ`, 'Doanh thu']} />
                        <Area type="monotone" dataKey="value" stroke="#3D021E" strokeWidth={2} fillOpacity={1} fill="url(#colorVal)" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#999'}} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
         </div>

         {/* Chart Phải: Xu Hướng Đơn Hàng */}
         <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
            <div className="mb-6">
                <h3 className="text-gray-500 text-sm font-medium">Xu Hướng Đơn Hàng</h3>
                <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold">{(3200).toLocaleString('vi-VN')}</span>
                    <span className="text-gray-400 text-xs mb-1">30 ngày qua <span className="text-green-500 font-bold">+10%</span></span>
                </div>
            </div>
            <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                         <defs>
                            <linearGradient id="colorOrd" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3D021E" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#3D021E" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        {/* ĐÃ SỬA LỖI TẠI ĐÂY: Dùng (value: any) */}
                        <Tooltip formatter={(value: any) => [value, 'Đơn hàng']} />
                        <Area type="monotone" dataKey="value" stroke="#3D021E" strokeWidth={2} fillOpacity={1} fill="url(#colorOrd)" />
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
                                 <span className={`px-3 py-1 rounded-full text-xs font-bold 
                                    ${order.status === 'Hoàn tất' ? 'bg-green-100 text-green-700' : ''}
                                    ${order.status === 'Đang giao' ? 'bg-blue-100 text-blue-700' : ''}
                                    ${order.status === 'Đang xử lý' ? 'bg-yellow-100 text-yellow-700' : ''}
                                 `}>
                                     {order.status}
                                 </span>
                             </td>
                             <td className="px-6 py-4 text-gray-700 font-medium">
                                 {order.total.toLocaleString('vi-VN')}đ
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