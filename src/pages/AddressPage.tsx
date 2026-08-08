import { useCallback, useEffect, useState } from 'react';
import { Plus, Edit2, MapPin, Phone, User, X, Star, Loader2 } from 'lucide-react';
import { MainLayout } from '../components/layout/MainLayout';
import { ProfileSidebar } from '../features/user/components/ProfileSidebar';
import { AddressMapPicker, type AddressSelection } from '../components/ui/AddressMapPicker';
import { useAuth } from '../context/AuthContext';

export type SavedAddress = {
  id: string;
  label: string;
  receiver: string;
  phone: string;
  address: string;
  street?: string;
  provinceCode?: string;
  wardCode?: string;
  lat?: number;
  lng?: number;
  isDefault: boolean;
};

const STORAGE_KEY = 'glow_saved_addresses';

function loadAddresses(userId?: string | number): SavedAddress[] {
  try {
    const key = userId ? `${STORAGE_KEY}_${userId}` : STORAGE_KEY;
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistAddresses(userId: string | number | undefined, items: SavedAddress[]) {
  const key = userId ? `${STORAGE_KEY}_${userId}` : STORAGE_KEY;
  localStorage.setItem(key, JSON.stringify(items));
}

export const AddressPage = () => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState({
    label: 'Nhà riêng',
    receiver: user?.fullName || '',
    phone: user?.phoneNumber || '',
    address: '',
    street: '',
    provinceCode: '',
    wardCode: '',
    lat: 10.7769,
    lng: 106.6951,
  });

  useEffect(() => {
    setAddresses(loadAddresses(user?.id));
  }, [user?.id]);

  const openCreate = () => {
    setEditingId(null);
    setForm({
      label: 'Nhà riêng',
      receiver: user?.fullName || '',
      phone: user?.phoneNumber || '',
      address: '',
      street: '',
      provinceCode: '',
      wardCode: '',
      lat: 10.7769,
      lng: 106.6951,
    });
    setIsModalOpen(true);
  };

  const openEdit = (item: SavedAddress) => {
    setEditingId(item.id);
    setForm({
      label: item.label,
      receiver: item.receiver,
      phone: item.phone,
      address: item.address,
      street: item.street || '',
      provinceCode: item.provinceCode || '',
      wardCode: item.wardCode || '',
      lat: item.lat ?? 10.7769,
      lng: item.lng ?? 106.6951,
    });
    setIsModalOpen(true);
  };

  const handleAddressChange = useCallback((fullAddress: string) => {
    setForm((prev) => (prev.address === fullAddress ? prev : { ...prev, address: fullAddress }));
  }, []);

  const handleSelectionChange = useCallback((selection: AddressSelection) => {
    setForm((prev) => ({
      ...prev,
      address: selection.fullAddress,
      street: selection.street,
      provinceCode: selection.provinceCode,
      wardCode: selection.wardCode,
      lat: selection.lat,
      lng: selection.lng,
    }));
  }, []);

  const handleSave = () => {
    if (!form.receiver.trim() || !form.phone.trim() || !form.address.trim()) {
      alert('Vui lòng điền đủ họ tên, SĐT và chọn địa chỉ trên bản đồ.');
      return;
    }
    if (!form.provinceCode || !form.wardCode) {
      alert('Vui lòng chọn Tỉnh/Thành phố và Phường/Xã (đơn vị hành chính v2).');
      return;
    }

    setIsSaving(true);
    try {
      let next = [...addresses];
      const payload: SavedAddress = {
        id: editingId ?? crypto.randomUUID(),
        label: form.label.trim() || 'Địa chỉ',
        receiver: form.receiver.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        street: form.street,
        provinceCode: form.provinceCode,
        wardCode: form.wardCode,
        lat: form.lat,
        lng: form.lng,
        isDefault: editingId ? addresses.find((a) => a.id === editingId)?.isDefault ?? false : addresses.length === 0,
      };

      if (editingId) {
        next = next.map((a) => (a.id === editingId ? payload : a));
      } else {
        next.push(payload);
      }

      setAddresses(next);
      persistAddresses(user?.id, next);
      setIsModalOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  const setDefault = (id: string) => {
    const next = addresses.map((a) => ({ ...a, isDefault: a.id === id }));
    setAddresses(next);
    persistAddresses(user?.id, next);
  };

  const removeAddress = (id: string) => {
    if (!confirm('Xóa địa chỉ này?')) return;
    const next = addresses.filter((a) => a.id !== id);
    if (next.length > 0 && !next.some((a) => a.isDefault)) {
      next[0].isDefault = true;
    }
    setAddresses(next);
    persistAddresses(user?.id, next);
  };

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen py-10 font-sans">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8">Tài khoản của tôi</h1>

          <div className="flex flex-col lg:flex-row gap-8">
            <ProfileSidebar activePage="address" />

            <div className="w-full lg:w-3/4">
              <div className="bg-white rounded-xl shadow-sm p-8 min-h-[500px]">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                  <div>
                    <h2 className="text-2xl font-serif font-bold text-[#3D021E]">Sổ địa chỉ nhận hàng</h2>
                    <p className="text-gray-500 text-sm mt-1">
                      Chọn địa chỉ theo đơn vị hành chính 2 cấp (API v2) · Geocoding qua server
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={openCreate}
                    className="flex items-center gap-2 bg-[#FCE4EC] text-[#3D021E] px-5 py-2.5 rounded-sm font-bold text-sm hover:bg-[#3D021E] hover:text-white transition-all shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Thêm địa chỉ mới
                  </button>
                </div>

                {addresses.length === 0 ? (
                  <div className="text-center py-16 text-gray-500">
                    <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Chưa có địa chỉ nào. Thêm địa chỉ để thanh toán nhanh hơn.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {addresses.map((item) => (
                      <div
                        key={item.id}
                        className="group flex flex-col md:flex-row gap-6 border border-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="text-lg font-bold text-gray-900">{item.label}</h3>
                            {item.isDefault && (
                              <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded border border-green-200 uppercase">
                                Mặc định
                              </span>
                            )}
                          </div>

                          <div className="text-sm text-gray-600 space-y-2">
                            <p className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-400" />
                              <span className="font-medium text-[#3D021E]">{item.receiver}</span>
                            </p>
                            <p className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-gray-400" />
                              {item.phone}
                            </p>
                            <p className="flex items-start gap-2 leading-relaxed">
                              <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                              {item.address}
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-2 pt-2">
                            {!item.isDefault && (
                              <button
                                type="button"
                                onClick={() => setDefault(item.id)}
                                className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold border border-gray-200 rounded hover:bg-yellow-50 text-yellow-700"
                              >
                                <Star className="w-3 h-3" /> Đặt mặc định
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => openEdit(item)}
                              className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-sm text-xs font-bold hover:bg-[#3D021E] hover:text-white transition-colors"
                            >
                              <Edit2 className="w-3 h-3" /> Chỉnh sửa
                            </button>
                            <button
                              type="button"
                              onClick={() => removeAddress(item.id)}
                              className="px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-sm"
                            >
                              Xóa
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#3D021E]">
                {editingId ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
              </h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Nhãn</label>
                <input
                  className="w-full mt-1 px-4 py-2.5 border rounded-lg"
                  value={form.label}
                  onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                  placeholder="Nhà riêng, Văn phòng..."
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Người nhận</label>
                <input
                  className="w-full mt-1 px-4 py-2.5 border rounded-lg"
                  value={form.receiver}
                  onChange={(e) => setForm((f) => ({ ...f, receiver: e.target.value }))}
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Số điện thoại</label>
                <input
                  className="w-full mt-1 px-4 py-2.5 border rounded-lg"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                />
              </div>
            </div>

            <AddressMapPicker
              onAddressChange={handleAddressChange}
              onSelectionChange={handleSelectionChange}
              initialStreet={form.street}
              initialProvinceCode={form.provinceCode}
              initialWardCode={form.wardCode}
              initialPosition={[form.lat, form.lng]}
            />

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 border rounded-lg text-sm font-bold"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="px-5 py-2.5 bg-[#3D021E] text-white rounded-lg text-sm font-bold flex items-center gap-2 disabled:opacity-60"
              >
                {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                Lưu địa chỉ
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export { loadAddresses };
