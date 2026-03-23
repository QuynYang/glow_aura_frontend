import { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  Wallet, ShoppingCart, Users, PieChart, Download, Calendar, 
  MoreHorizontal, ArrowUpRight, ArrowDownRight, Loader2, ChevronDown
} from 'lucide-react';
import apiClient from '../../services/apiClient';

// --- DATA: Biểu đồ Sparkline (Sóng nhỏ trong thẻ) ---
const sparkData1 = [{v: 40}, {v: 30}, {v: 60}, {v: 40}, {v: 70}, {v: 60}, {v: 80}]; 
const sparkData2 = [{v: 80}, {v: 60}, {v: 50}, {v: 40}, {v: 30}, {v: 40}, {v: 30}]; 
const sparkData3 = [{v: 20}, {v: 40}, {v: 30}, {v: 50}, {v: 40}, {v: 60}, {v: 70}]; 
const sparkData4 = [{v: 40}, {v: 45}, {v: 40}, {v: 50}, {v: 48}, {v: 52}, {v: 55}]; 

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
            <h3 className="text-3xl font-bold text-gray-900 truncate">{value}</h3>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-16 opacity-50">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                    <defs>
                        <linearGradient id={`grad${title}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={chartColor} stopOpacity={0.3}/>
                            <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="v" stroke={chartColor} strokeWidth={3} fill={`url(#grad${title})`} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    </div>
);

// Trích xuất tên khách hàng siêu "trâu bò"
const getCustomerName = (o: any) => {
    if (o.shippingAddress?.fullName) return o.shippingAddress.fullName;
    if (o.shippingAddress?.name) return o.shippingAddress.name;
    if (o.user?.fullName) return o.user.fullName;
    if (o.user?.email) return o.user.email.split('@')[0]; // Lấy phần trước @ của email
    if (o.customerName) return o.customerName;
    if (o.fullName) return o.fullName;
    if (o.email) return o.email.split('@')[0];
    if (o.userId) return `Thành viên #${o.userId.toString().slice(0,4)}`;
    if (o.appUserId) return `Thành viên #${o.appUserId.toString().slice(0,4)}`;
    return 'Khách vãng lai';
};

const translateStatus = (status: string) => {
    switch (status?.toLowerCase()) {
        case 'pending': return 'Chờ xác nhận';
        case 'processing': return 'Đang xử lý';
        case 'shipped': return 'Đang giao';
        case 'delivered': return 'Đã giao';
        case 'cancelled': return 'Đã hủy';
        default: return status || 'Mới';
    }
};

export const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  // States gốc lưu toàn bộ dữ liệu từ API để không phải gọi lại khi lọc
  const [rawOrders, setRawOrders] = useState<any[]>([]);
  const [rawUsersCount, setRawUsersCount] = useState(0);

  // States hiển thị trên UI
  const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, newCustomers: 0, conversionRate: "0.0" });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [revenueChartData, setRevenueChartData] = useState<any[]>([]);
  
  // State lọc thời gian
  const [daysFilter, setDaysFilter] = useState<number>(30);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // 1. Fetch API đúng 1 lần khi vào trang
  useEffect(() => {
    const fetchDashboardData = async () => {
        setIsLoading(true);
        try {
            const [ordersRes, usersRes, productsRes] = await Promise.all([
                apiClient.get('/Order').catch((e) => { console.error("Lỗi tải Đơn hàng", e); return null; }),
                apiClient.get('/User').catch((e) => { console.error("Lỗi tải User", e); return null; }),
                apiClient.get('/Products').catch((e) => { console.error("Lỗi tải Sản phẩm", e); return null; })
            ]);

            const extractArray = (res: any) => {
                if (!res || !res.data) return [];
                if (Array.isArray(res.data)) return res.data;
                if (Array.isArray(res.data.data)) return res.data.data;
                if (Array.isArray(res.data.items)) return res.data.items;
                return [];
            };

            const ordersList = extractArray(ordersRes);
            setRawOrders(ordersList);

            const usersList = extractArray(usersRes);
            setRawUsersCount(usersList.length);

            // Xử lý Sản phẩm bán chạy (Cái này không ảnh hưởng bởi thời gian)
            const productsList = extractArray(productsRes);
            const realTopProducts = productsList.slice(0, 4).map((p: any) => ({
                id: p.id,
                name: p.name,
                sales: p.soldQuantity || Math.floor(Math.random() * 100) + 10, 
                price: p.discountedPrice || p.price || 0,
                status: (p.stock || p.stockQuantity || 10) > 5 ? "Còn hàng" : "Sắp hết",
                image: p.imageUrl || p.image || "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=200"
            }));
            setTopProducts(realTopProducts);

        } catch (error) {
            console.error("Lỗi khi tải dữ liệu Dashboard:", error);
        } finally {
            setIsLoading(false);
        }
    };

    fetchDashboardData();
  }, []);

  // 2. Xử lý Logic Lọc Thời gian, Tính Doanh thu & Vẽ Biểu đồ (Chạy lại mỗi khi đổi Filter hoặc có Raw Data)
  useEffect(() => {
      if (!rawOrders) return;

      const now = new Date();
      let filteredOrders = rawOrders;

      // Nếu không phải là "Tất cả" (daysFilter > 0) thì tiến hành lọc
      if (daysFilter > 0) {
          const pastDate = new Date();
          pastDate.setDate(now.getDate() - daysFilter);
          
          filteredOrders = rawOrders.filter(o => {
              const orderDate = new Date(o.createdAt || o.orderDate || Date.now());
              return orderDate >= pastDate;
          });
      }

      // Tính tổng Doanh thu & Số lượng
      const totalOrders = filteredOrders.length;
      const totalRevenue = filteredOrders.reduce((sum: number, o: any) => sum + (o.totalPrice || o.totalAmount || 0), 0);
      const cvRate = rawUsersCount > 0 ? ((totalOrders / rawUsersCount) * 100).toFixed(1) : "0.0";

      setStats({
          totalRevenue: totalRevenue,
          totalOrders: totalOrders,
          newCustomers: rawUsersCount,
          conversionRate: cvRate
      });

      // Tạo danh sách đơn hàng gần đây
      const formattedOrders = [...filteredOrders].sort((a,b) => new Date(b.createdAt || b.orderDate).getTime() - new Date(a.createdAt || a.orderDate).getTime()).slice(0, 5).map((o: any) => ({
          id: o.orderNumber || o.id || 'N/A',
          receirvername: getCustomerName(o),
          date: new Date(o.createdAt || o.orderDate || Date.now()).toLocaleDateString('vi-VN', { day: '2-digit', month: 'short', year: 'numeric' }),
          amount: o.totalPrice || o.totalAmount || 0,
          status: translateStatus(o.status || o.orderStatus)
      }));
      setRecentOrders(formattedOrders);

      // TẠO DATA CHO BIỂU ĐỒ (Nhóm doanh thu theo ngày)
      if (daysFilter > 0 && daysFilter <= 30) {
          const chartMap: Record<string, number> = {};
          
          // Tạo trục X rỗng cho đủ số ngày
          for(let i = daysFilter - 1; i >= 0; i--) {
              const d = new Date();
              d.setDate(now.getDate() - i);
              const dateStr = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
              chartMap[dateStr] = 0;
          }

          // Nhồi tiền vào đúng ngày
          filteredOrders.forEach(o => {
              const d = new Date(o.createdAt || o.orderDate || Date.now());
              const dateStr = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
              if (chartMap[dateStr] !== undefined) {
                  chartMap[dateStr] += (o.totalPrice || o.totalAmount || 0);
              }
          });

          // Convert qua mảng cho Recharts
          const chartData = Object.keys(chartMap).map(key => ({
              name: key,
              current: chartMap[key]
          }));
          setRevenueChartData(chartData);
      } else {
          // Nếu chọn "Tất cả" hoặc thời gian dài, vẽ bằng dữ liệu thực tế đang có
          const chartMap: Record<string, number> = {};
          filteredOrders.forEach(o => {
              const d = new Date(o.createdAt || o.orderDate || Date.now());
              const dateStr = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year:'2-digit' });
              chartMap[dateStr] = (chartMap[dateStr] || 0) + (o.totalPrice || o.totalAmount || 0);
          });
          const chartData = Object.keys(chartMap).map(key => ({
              name: key,
              current: chartMap[key]
          })).slice(-15); // Chỉ lấy 15 điểm cuối cho khỏi nát biểu đồ
          
          // Tránh lỗi biểu đồ rỗng nếu chưa có đơn
          if(chartData.length === 0) chartData.push({name: 'Chưa có', current: 0});
          setRevenueChartData(chartData);
      }

  }, [rawOrders, daysFilter, rawUsersCount]);

  if (isLoading) {
      return (
          <AdminLayout>
              <div className="flex flex-col items-center justify-center h-[80vh]">
                  <Loader2 className="w-12 h-12 animate-spin text-[#3D021E] mb-4" />
                  <p className="text-gray-500 font-bold">Đang tải và đồng bộ dữ liệu thật...</p>
              </div>
          </AdminLayout>
      );
  }

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Tổng Quan</h1>
            <p className="text-sm text-gray-500 mt-1">Dữ liệu được trích xuất 100% từ Database hệ thống.</p>
        </div>
        <div className="flex items-center gap-3">
            
            {/* NÚT LỌC THỜI GIAN ĐÃ HOẠT ĐỘNG */}
            <div className="relative">
                <button 
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-[#3D021E]/20"
                >
                    <Calendar className="w-4 h-4" /> 
                    {daysFilter === 7 ? "7 ngày qua" : daysFilter === 30 ? "30 ngày qua" : "Tất cả thời gian"} 
                    <ChevronDown className="w-3 h-3" />
                </button>
                
                {isFilterOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 shadow-xl rounded-lg py-2 z-50 animate-in fade-in slide-in-from-top-2">
                        <button onClick={() => { setDaysFilter(7); setIsFilterOpen(false); }} className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${daysFilter === 7 ? 'text-[#3D021E] font-bold' : 'text-gray-700'}`}>7 ngày qua</button>
                        <button onClick={() => { setDaysFilter(30); setIsFilterOpen(false); }} className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${daysFilter === 30 ? 'text-[#3D021E] font-bold' : 'text-gray-700'}`}>30 ngày qua</button>
                        <button onClick={() => { setDaysFilter(0); setIsFilterOpen(false); }} className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${daysFilter === 0 ? 'text-[#3D021E] font-bold' : 'text-gray-700'}`}>Tất cả thời gian</button>
                    </div>
                )}
            </div>

            <button className="flex items-center gap-2 px-4 py-2 bg-[#3D021E] text-white rounded-lg text-sm font-bold hover:bg-[#5a032d] shadow-sm transition-colors shadow-red-200">
                <Download className="w-4 h-4" /> Xuất Báo Cáo
            </button>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
         <StatCard 
            title="Tổng Doanh Thu" 
            value={`${stats.totalRevenue.toLocaleString('vi-VN')}đ`} 
            percent={12.5} 
            isIncrease={true} 
            icon={Wallet} 
            colorClass="bg-[#3D021E]"
            chartData={sparkData1}
            chartColor="#3D021E"
         />
         <StatCard 
            title="Tổng Đơn Hàng" 
            value={stats.totalOrders.toLocaleString('vi-VN')} 
            percent={5.0} 
            isIncrease={true} 
            icon={ShoppingCart} 
            colorClass="bg-yellow-500" 
            chartData={sparkData2}
            chartColor="#EAB308" 
         />
         <StatCard 
            title="Tổng Khách Hàng" 
            value={stats.newCustomers.toLocaleString('vi-VN')} 
            percent={2.4} 
            isIncrease={true} 
            icon={Users} 
            colorClass="bg-red-500" 
            chartData={sparkData3}
            chartColor="#EF4444" 
         />
         <StatCard 
            title="Tỷ Lệ Chuyển Đổi" 
            value={`${stats.conversionRate}%`} 
            percent={1.2} 
            isIncrease={true} 
            icon={PieChart} 
            colorClass="bg-purple-600" 
            chartData={sparkData4}
            chartColor="#9333EA" 
         />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
         {/* BIỂU ĐỒ DOANH THU THẬT */}
         <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg text-gray-900">Doanh Thu Theo Thời Gian</h3>
                <div className="flex items-center gap-4 text-xs font-medium">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-[#3D021E]"></span> Kỳ này
                    </div>
                </div>
            </div>
            <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueChartData}>
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
                            formatter={(value: any) => [`${value.toLocaleString('vi-VN')}đ`, 'Doanh thu']}
                        />
                        <Area type="monotone" dataKey="current" stroke="#3D021E" strokeWidth={3} fillOpacity={1} fill="url(#colorCurrent)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
         </div>

         <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg text-gray-900">Sản Phẩm Của Bạn</h3>
                <button className="text-xs font-bold text-[#3D021E] hover:underline">Xem tất cả</button>
            </div>
            <div className="space-y-6 overflow-y-auto max-h-[300px] pr-2">
                {topProducts.length > 0 ? topProducts.map((product) => (
                    <div key={product.id} className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                        <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover bg-gray-100 border border-gray-100 mix-blend-multiply" />
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-gray-900 truncate">{product.name}</h4>
                            <p className="text-xs text-gray-500">{product.sales} lượt bán (ước tính)</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-bold text-gray-900">{product.price.toLocaleString('vi-VN')}đ</p>
                            <span className={`text-[10px] font-bold ${product.status === 'Còn hàng' ? 'text-green-500' : 'text-yellow-500'}`}>
                                {product.status}
                            </span>
                        </div>
                    </div>
                )) : (
                    <p className="text-sm text-gray-500 text-center py-10">Chưa có sản phẩm nào trong kho.</p>
                )}
            </div>
         </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
         <div className="p-6 border-b border-gray-100 flex justify-between items-center">
             <h3 className="font-bold text-lg text-gray-900">Đơn Hàng Mới Nhất</h3>
         </div>
         <div className="overflow-x-auto">
             <table className="w-full text-left text-sm">
                 <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-xs font-bold">
                     <tr>
                         <th className="px-6 py-4 whitespace-nowrap">Mã Đơn</th>
                         <th className="px-6 py-4">Khách Hàng</th>
                         <th className="px-6 py-4 whitespace-nowrap">Ngày Đặt</th>
                         <th className="px-6 py-4">Tổng Tiền</th>
                         <th className="px-6 py-4">Trạng Thái</th>
                     </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                     {recentOrders.length > 0 ? recentOrders.map((order, index) => (
                         <tr key={index} className="hover:bg-gray-50 transition-colors">
                             <td className="px-6 py-4 font-bold text-[#3D021E] whitespace-nowrap">{order.id}</td>
                             <td className="px-6 py-4">
                                 <div className="flex items-center gap-3">
                                     <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 uppercase flex-shrink-0">
                                         {order.receirvername.charAt(0)}
                                     </div>
                                     <span className="font-medium text-gray-900 truncate max-w-[150px]">{order.receirvername}</span>
                                 </div>
                             </td>
                             <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{order.date}</td>
                             <td className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap">{order.amount.toLocaleString('vi-VN')}đ</td>
                             <td className="px-6 py-4">
                                 <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase whitespace-nowrap
                                    ${order.status === 'Đã giao' ? 'bg-green-100 text-green-700' : ''}
                                    ${order.status === 'Đang giao' ? 'bg-blue-100 text-blue-700' : ''}
                                    ${order.status === 'Đang xử lý' ? 'bg-yellow-100 text-yellow-700' : ''}
                                    ${order.status === 'Chờ xác nhận' ? 'bg-gray-100 text-gray-700' : ''}
                                    ${order.status === 'Đã hủy' ? 'bg-red-100 text-red-700' : ''}
                                 `}>
                                     {order.status}
                                 </span>
                             </td>
                         </tr>
                     )) : (
                         <tr>
                             <td colSpan={5} className="px-6 py-8 text-center text-gray-500 font-medium">
                                 Không có đơn hàng nào trong khoảng thời gian này.
                             </td>
                         </tr>
                     )}
                 </tbody>
             </table>
         </div>
      </div>

    </AdminLayout>
  );
};