import { useState } from 'react';
import { 
  Search, Filter, Download, MoreHorizontal, 
  UserPlus, Mail, Phone, Lock, Unlock, Edit, Trash2, 
  ChevronLeft, ChevronRight 
} from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';

// --- 1. MOCK DATA (Dữ liệu Khách hàng) ---
const customers = [
  {
    id: 1,
    name: "Nguyễn Văn An",
    email: "an.nguyen@example.com",
    phone: "0901234567",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100",
    joinDate: "24 Th10, 2023",
    status: "Hoạt động",
    totalOrders: 12,
    role: "Thành viên Vàng"
  },
  {
    id: 2,
    name: "Trần Thị Bình",
    email: "binh.tran@example.com",
    phone: "0912345678",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100",
    joinDate: "12 Th09, 2023",
    status: "Hoạt động",
    totalOrders: 5,
    role: "Thành viên Bạc"
  },
  {
    id: 3,
    name: "Lê Minh Cường",
    email: "cuong.le@example.com",
    phone: "0987654321",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100",
    joinDate: "05 Th11, 2023",
    status: "Bị chặn",
    totalOrders: 0,
    role: "Mới"
  },
  {
    id: 4,
    name: "Phạm Thu Dung",
    email: "dung.pham@example.com",
    phone: "0933445566",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=100",
    joinDate: "20 Th10, 2023",
    status: "Hoạt động",
    totalOrders: 24,
    role: "Thành viên Kim Cương"
  },
  {
    id: 5,
    name: "Hoàng Văn Em",
    email: "em.hoang@example.com",
    phone: "0977889900",
    avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=100",
    joinDate: "01 Th12, 2023",
    status: "Hoạt động",
    totalOrders: 2,
    role: "Mới"
  },
];

// Component Thẻ Thống Kê (Giống ảnh mẫu)
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
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Tất cả');

  // --- LOGIC LỌC & TÌM KIẾM ---
  const filteredCustomers = customers.filter(customer => {
      // 1. Lọc theo trạng thái
      const matchesStatus = filterStatus === 'Tất cả' || customer.status === filterStatus;
      
      // 2. Tìm kiếm (Tên, Email hoặc SĐT)
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
          customer.name.toLowerCase().includes(searchLower) ||
          customer.email.toLowerCase().includes(searchLower) ||
          customer.phone.includes(searchTerm);

      return matchesStatus && matchesSearch;
  });

  return (
    <AdminLayout>
      
      {/* 1. HEADER & STATS */}
      <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Quản Lý Khách Hàng</h1>
              <button className="flex items-center gap-2 px-6 py-2.5 bg-[#3D021E] text-white rounded-lg text-sm font-bold hover:bg-[#5a032d] transition-all shadow-lg shadow-purple-900/10">
                  <UserPlus className="w-4 h-4" /> Thêm Khách Hàng
              </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatCard label="Tổng Khách Hàng" value="1,240" subValue="+12%" colorClass="bg-green-100 text-green-700" />
              <StatCard label="Đang Hoạt Động" value="1,180" subValue="Realtime" colorClass="bg-blue-100 text-blue-700" />
              <StatCard label="Khách Hàng Mới" value="45" subValue="Hôm nay" colorClass="bg-purple-100 text-purple-700" />
              <StatCard label="Bị Chặn / Xóa" value="15" subValue="-2%" colorClass="bg-red-100 text-red-700" />
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
         <div className="overflow-x-auto">
             <table className="w-full text-left text-sm">
                 <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-xs font-bold">
                     <tr>
                         <th className="px-6 py-4">Khách Hàng</th>
                         <th className="px-6 py-4">Liên Hệ</th>
                         <th className="px-6 py-4">Ngày Tham Gia</th>
                         <th className="px-6 py-4">Hạng Hội Viên</th>
                         <th className="px-6 py-4">Trạng Thái</th>
                         <th className="px-6 py-4 text-right">Hành Động</th>
                     </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                     {filteredCustomers.map((customer) => (
                         <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                             
                             {/* Info */}
                             <td className="px-6 py-4">
                                 <div className="flex items-center gap-3">
                                     <img 
                                        src={customer.avatar} 
                                        alt={customer.name} 
                                        className="w-10 h-10 rounded-full object-cover border border-gray-200" 
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
                                     <span className="flex items-center gap-1 text-xs"><Mail className="w-3 h-3" /> Email</span>
                                 </div>
                             </td>

                             {/* Date */}
                             <td className="px-6 py-4 text-gray-600 font-medium">
                                 {customer.joinDate}
                             </td>

                             {/* Role */}
                             <td className="px-6 py-4">
                                 <span className={`px-3 py-1 rounded-full text-[10px] font-bold border
                                    ${customer.role.includes('Vàng') ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 
                                      customer.role.includes('Kim Cương') ? 'bg-blue-50 text-blue-700 border-blue-200' :
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
                                     <button className="p-2 text-gray-400 hover:text-[#3D021E] hover:bg-purple-50 rounded-lg transition-colors" title="Chỉnh sửa">
                                         <Edit className="w-4 h-4" />
                                     </button>
                                     <button className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors" title="Khóa/Mở khóa">
                                         {customer.status === 'Hoạt động' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                                     </button>
                                     <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Xóa">
                                         <Trash2 className="w-4 h-4" />
                                     </button>
                                 </div>
                             </td>
                         </tr>
                     ))}
                 </tbody>
             </table>
         </div>

         {/* Footer Pagination */}
         <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
             <span>Hiển thị {filteredCustomers.length} kết quả</span>
             <div className="flex items-center gap-2">
                 <button className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"><ChevronLeft className="w-4 h-4" /></button>
                 <button className="w-8 h-8 flex items-center justify-center bg-[#3D021E] text-white font-bold rounded-lg">1</button>
                 <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg">2</button>
                 <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg">3</button>
                 <button className="p-2 hover:bg-gray-100 rounded-lg"><ChevronRight className="w-4 h-4" /></button>
             </div>
         </div>
      </div>

    </AdminLayout>
  );
};