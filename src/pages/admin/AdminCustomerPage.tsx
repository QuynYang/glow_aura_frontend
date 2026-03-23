import { useState, useEffect } from 'react';
import { 
  Search, Filter, Download, UserPlus, Mail, Phone, Lock, Unlock, Edit, Trash2, 
  ChevronLeft, ChevronRight, Loader2
} from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../services/apiClient';

// Component Thẻ Thống Kê
const StatCard = ({ label, value, subValue, colorClass }: any) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex-1">
        <h4 className="text-gray-500 text-sm font-medium mb-2">{label}</h4>
        <div className="flex items-end justify-between">
            <div className="text-3xl font-bold text-gray-900">{value}</div>
            <span className={`text-xs font-bold px-2 py-1 rounded-lg ${colorClass}`}>
                {subValue}
            </span>
        </div>
    </div>
);

export const AdminCustomerPage = () => {
  const navigate = useNavigate(); 
  
  // States Quản lý Dữ liệu
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, active: 0, newToday: 0, blocked: 0 });

  // States Quản lý UI (Lọc, Tìm kiếm, Phân trang)
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Tất cả');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // 1. GỌI API LẤY DANH SÁCH USER
  useEffect(() => {
      const fetchUsers = async () => {
          setIsLoading(true);
          try {
              const response = await apiClient.get('/User');
              
              // Bóc tách mảng dữ liệu an toàn
              let usersList = [];
              if (response.data && Array.isArray(response.data)) usersList = response.data;
              else if (response.data?.data && Array.isArray(response.data.data)) usersList = response.data.data;
              else if (response.data?.items && Array.isArray(response.data.items)) usersList = response.data.items;

              const today = new Date().toLocaleDateString('vi-VN');
              let activeCount = 0;
              let newCount = 0;
              let blockedCount = 0;

              const formattedUsers = usersList.map((u: any) => {
                  // Cấu trúc lại data dựa trên thuộc tính phổ biến của C# Identity
                  const name = u.fullName || u.userName || 'Khách hàng';
                  const email = u.email || 'Không có email';
                  const joinDateObj = new Date(u.createdAt || u.dateCreated || Date.now());
                  const joinDate = joinDateObj.toLocaleDateString('vi-VN', { day: '2-digit', month: 'short', year: 'numeric' });
                  const isBlocked = u.isBlocked || u.status === 'Blocked' || u.isActive === false;
                  const status = isBlocked ? 'Bị chặn' : 'Hoạt động';
                  const role = u.role || (u.roles && u.roles.length > 0 ? u.roles[0] : 'Thành viên');

                  // Tính toán thống kê
                  if (status === 'Hoạt động') activeCount++;
                  if (status === 'Bị chặn') blockedCount++;
                  if (joinDateObj.toLocaleDateString('vi-VN') === today) newCount++;

                  return {
                      id: u.id,
                      name: name,
                      email: email,
                      phone: u.phoneNumber || u.phone || 'Chưa cập nhật',
                      avatar: u.avatarUrl || u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
                      joinDate: joinDate,
                      status: status,
                      role: role
                  };
              });

              setCustomers(formattedUsers);
              setStats({
                  total: formattedUsers.length,
                  active: activeCount,
                  newToday: newCount,
                  blocked: blockedCount
              });

          } catch (error) {
              console.error("Lỗi khi tải danh sách Khách hàng:", error);
          } finally {
              setIsLoading(false);
          }
      };

      fetchUsers();
  }, []);

  // --- LOGIC LỌC & TÌM KIẾM ---
  const filteredCustomers = customers.filter(customer => {
      const matchesStatus = filterStatus === 'Tất cả' || customer.status === filterStatus;
      
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
          customer.name.toLowerCase().includes(searchLower) ||
          customer.email.toLowerCase().includes(searchLower) ||
          customer.phone.includes(searchTerm);

      return matchesStatus && matchesSearch;
  });

  // --- LOGIC PHÂN TRANG ---
  const totalPages = Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE);
  const currentCustomers = filteredCustomers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  useEffect(() => { setCurrentPage(1); }, [searchTerm, filterStatus]);

  // --- LOGIC ACTION BUTTONS ---
  const handleToggleStatus = async (id: number | string, currentStatus: string) => {
      const isCurrentlyBlocked = currentStatus === 'Bị chặn';
      const actionText = isCurrentlyBlocked ? 'mở khóa' : 'khóa';
      
      if (!window.confirm(`Bạn có chắc chắn muốn ${actionText} tài khoản này?`)) return;

      try {
          // Gọi API C# (Giả định payload, bạn cần chỉnh sửa cho khớp với API của bạn)
          await apiClient.patch(`/User/${id}/status`); 
          
          // Cập nhật state trực tiếp trên Frontend cho nhanh
          setCustomers(prev => prev.map(c => 
              c.id === id ? { ...c, status: isCurrentlyBlocked ? 'Hoạt động' : 'Bị chặn' } : c
          ));
          alert(`Đã ${actionText} tài khoản thành công!`);
      } catch (error) {
          alert(`Lỗi khi ${actionText} tài khoản.`);
          console.error(error);
      }
  };

  const handleDelete = async (id: number | string) => {
      if (!window.confirm('CẢNH BÁO: Bạn có chắc chắn muốn xóa vĩnh viễn khách hàng này không?')) return;

      try {
          await apiClient.delete(`/User/${id}`);
          setCustomers(prev => prev.filter(c => c.id !== id));
          alert('Đã xóa khách hàng thành công!');
      } catch (error) {
          alert('Lỗi khi xóa khách hàng.');
          console.error(error);
      }
  };

  return (
    <AdminLayout>
      
      {/* 1. HEADER & STATS */}
      <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Quản Lý Khách Hàng</h1>
              <button 
                  onClick={() => navigate('/admin/customers/add')}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#3D021E] text-white rounded-lg text-sm font-bold hover:bg-[#5a032d] transition-all shadow-lg shadow-pink-900/10 transform hover:-translate-y-1"
              >
                  <UserPlus className="w-4 h-4" /> Thêm Khách Hàng
              </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatCard label="Tổng Khách Hàng" value={stats.total.toLocaleString('vi-VN')} subValue="Hệ thống" colorClass="bg-gray-100 text-gray-700" />
              <StatCard label="Đang Hoạt Động" value={stats.active.toLocaleString('vi-VN')} subValue="Realtime" colorClass="bg-green-100 text-green-700" />
              <StatCard label="Khách Hàng Mới" value={stats.newToday} subValue="Hôm nay" colorClass="bg-purple-100 text-purple-700" />
              <StatCard label="Bị Chặn / Xóa" value={stats.blocked} subValue="Cần xử lý" colorClass="bg-red-100 text-red-700" />
          </div>
      </div>

      {/* 2. CUSTOMER LIST CARD */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
         
         {/* Toolbar */}
         <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
             {/* Search */}
             <div className="relative w-full md:w-96">
                 <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                 <input 
                    type="text" 
                    placeholder="Tìm kiếm theo tên, email, sđt..." 
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#3D021E] focus:ring-1 focus:ring-[#3D021E] transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                 />
             </div>

             {/* Actions */}
             <div className="flex gap-3">
                 <div className="relative">
                     <select 
                        className="appearance-none pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none hover:bg-gray-50 cursor-pointer"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                     >
                         <option value="Tất cả">Tất cả trạng thái</option>
                         <option value="Hoạt động">Hoạt động</option>
                         <option value="Bị chặn">Bị chặn</option>
                     </select>
                     <Filter className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                 </div>
                 
                 <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                     <Download className="w-4 h-4" /> Xuất Excel
                 </button>
             </div>
         </div>

         {/* Data Table */}
         <div className="overflow-x-auto min-h-[400px]">
             <table className="w-full text-left text-sm">
                 <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-xs font-bold">
                     <tr>
                         <th className="px-6 py-4">Khách Hàng</th>
                         <th className="px-6 py-4">Liên Hệ</th>
                         <th className="px-6 py-4">Ngày Tham Gia</th>
                         <th className="px-6 py-4">Quyền / Hạng</th>
                         <th className="px-6 py-4">Trạng Thái</th>
                         <th className="px-6 py-4 text-right">Hành Động</th>
                     </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                     {isLoading ? (
                         <tr>
                             <td colSpan={6} className="px-6 py-12 text-center">
                                 <Loader2 className="w-8 h-8 animate-spin text-[#3D021E] mx-auto mb-2" />
                                 <span className="text-gray-500 font-medium">Đang tải dữ liệu khách hàng...</span>
                             </td>
                         </tr>
                     ) : currentCustomers.length > 0 ? (
                         currentCustomers.map((customer) => (
                             <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                                 
                                 {/* Info */}
                                 <td className="px-6 py-4">
                                     <div className="flex items-center gap-3">
                                         <img 
                                            src={customer.avatar} 
                                            alt={customer.name} 
                                            className="w-10 h-10 rounded-full object-cover border border-gray-200 bg-white" 
                                         />
                                         <div>
                                             <h4 className="font-bold text-gray-900">{customer.name}</h4>
                                             <p className="text-xs text-gray-500">{customer.email}</p>
                                         </div>
                                     </div>
                                 </td>

                                 {/* Contact */}
                                 <td className="px-6 py-4 text-gray-600">
                                     <div className="flex flex-col gap-1">
                                         <span className="flex items-center gap-1 text-xs"><Phone className="w-3 h-3" /> {customer.phone}</span>
                                     </div>
                                 </td>

                                 {/* Date */}
                                 <td className="px-6 py-4 text-gray-600 font-medium">
                                     {customer.joinDate}
                                 </td>

                                 {/* Role */}
                                 <td className="px-6 py-4">
                                     <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase
                                        ${customer.role.toLowerCase().includes('admin') ? 'bg-red-50 text-red-700 border-red-200' : 
                                          customer.role.toLowerCase().includes('staff') ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                          'bg-gray-50 text-gray-600 border-gray-200'}
                                     `}>
                                         {customer.role}
                                     </span>
                                 </td>

                                 {/* Status */}
                                 <td className="px-6 py-4">
                                     <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold
                                        ${customer.status === 'Hoạt động' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
                                     `}>
                                         <span className={`w-1.5 h-1.5 rounded-full ${customer.status === 'Hoạt động' ? 'bg-green-600' : 'bg-red-600'}`}></span>
                                         {customer.status}
                                     </span>
                                 </td>

                                 {/* Actions */}
                                 <td className="px-6 py-4 text-right">
                                     <div className="flex items-center justify-end gap-2">
                                         <button 
                                            onClick={() => navigate(`/admin/customers/edit/${customer.id}`)}
                                            className="p-2 text-gray-400 hover:text-[#3D021E] hover:bg-purple-50 rounded-lg transition-colors" title="Chỉnh sửa"
                                         >
                                             <Edit className="w-4 h-4" />
                                         </button>
                                         <button 
                                            onClick={() => handleToggleStatus(customer.id, customer.status)}
                                            className={`p-2 rounded-lg transition-colors ${customer.status === 'Hoạt động' ? 'text-gray-400 hover:text-orange-500 hover:bg-orange-50' : 'text-orange-500 bg-orange-50'}`} 
                                            title={customer.status === 'Hoạt động' ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                                         >
                                             {customer.status === 'Hoạt động' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                                         </button>
                                         <button 
                                            onClick={() => handleDelete(customer.id)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Xóa vĩnh viễn"
                                         >
                                             <Trash2 className="w-4 h-4" />
                                         </button>
                                     </div>
                                 </td>
                             </tr>
                         ))
                     ) : (
                         <tr>
                             <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                 Không tìm thấy khách hàng nào phù hợp với bộ lọc.
                             </td>
                         </tr>
                     )}
                 </tbody>
             </table>
         </div>

         {/* Footer Pagination */}
         {totalPages > 0 && (
             <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                 <span>Hiển thị {currentCustomers.length} trên tổng {filteredCustomers.length} kết quả</span>
                 <div className="flex items-center gap-2">
                     <button 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 transition-colors"
                     >
                        <ChevronLeft className="w-4 h-4" />
                     </button>
                     
                     {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button 
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-8 h-8 flex items-center justify-center font-bold rounded-lg transition-all
                                ${currentPage === page 
                                    ? 'bg-[#3D021E] text-white shadow-md shadow-pink-200' 
                                    : 'border border-transparent hover:bg-gray-50 text-gray-700'}
                            `}
                        >
                            {page}
                        </button>
                     ))}

                     <button 
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 transition-colors"
                     >
                        <ChevronRight className="w-4 h-4" />
                     </button>
                 </div>
             </div>
         )}
      </div>

    </AdminLayout>
  );
};