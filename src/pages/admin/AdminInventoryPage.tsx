import { useEffect, useState } from 'react';
import { AlertTriangle, Boxes, CalendarClock } from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { productService } from '../../services/productService';
import { useNavigate } from 'react-router-dom';

export const AdminInventoryPage = () => {
  const navigate = useNavigate();
  const [expiringSoon, setExpiringSoon] = useState<any[]>([]);
  const [lowStock, setLowStock] = useState<any[]>([]);
  const [outOfStock, setOutOfStock] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const [exp, low, out] = await Promise.all([
          productService.getExpiringSoon(30),
          productService.getLowStock(10),
          productService.getOutOfStock(),
        ]);
        setExpiringSoon(Array.isArray(exp) ? exp : []);
        setLowStock(Array.isArray(low) ? low : []);
        setOutOfStock(Array.isArray(out) ? out : []);
      } finally {
        setIsLoading(false);
      }
    };
    void load();
  }, []);

  const listItem = (p: any) => (
    <button
      key={p.id}
      onClick={() => navigate(`/admin/products/edit/${p.id}`)}
      className="w-full text-left p-3 rounded-lg border border-gray-100 hover:border-[#3D021E] hover:bg-gray-50"
    >
      <p className="font-bold text-sm text-gray-900">{p.name}</p>
      <p className="text-xs text-gray-500 mt-1">
        Stock: {p.stock} {p.daysUntilExpiry != null ? `• Còn ${p.daysUntilExpiry} ngày hết hạn` : ''}
      </p>
    </button>
  );

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#3D021E]">Inventory & Expiry Management</h1>
        <p className="text-sm text-gray-500 mt-1">Theo dõi tồn kho và sản phẩm cận date để chủ động Flash Sale.</p>
      </div>

      {isLoading ? (
        <p className="text-gray-500">Đang tải dữ liệu tồn kho...</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="bg-white rounded-2xl border border-gray-100 p-5">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CalendarClock className="w-5 h-5 text-orange-600" /> Sắp hết hạn (30 ngày)
            </h2>
            <div className="space-y-3">{expiringSoon.slice(0, 20).map(listItem)}</div>
          </section>

          <section className="bg-white rounded-2xl border border-gray-100 p-5">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" /> Sắp hết hàng
            </h2>
            <div className="space-y-3">{lowStock.slice(0, 20).map(listItem)}</div>
          </section>

          <section className="bg-white rounded-2xl border border-gray-100 p-5">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Boxes className="w-5 h-5 text-red-600" /> Hết hàng
            </h2>
            <div className="space-y-3">{outOfStock.slice(0, 20).map(listItem)}</div>
          </section>
        </div>
      )}
    </AdminLayout>
  );
};
