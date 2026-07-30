import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Search, Loader2 } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const MapFlyTo = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 16, { animate: true });
  }, [center, map]);
  return null;
};

interface AddressMapPickerProps {
  onAddressChange: (fullAddress: string) => void;
}

interface DivisionItem {
  code: number | string;
  name: string;
}

// Bỏ dấu tiếng Việt + hạ chữ thường + bỏ tiền tố hành chính để so khớp gần đúng
// giữa tên trả về từ Nominatim (OSM) và tên trong danh sách Tỉnh/Phường của mình.
const normalize = (str: string = ''): string =>
  str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()
    .replace(/^(thanh pho|tinh|phuong|xa|thi tran|quan|huyen)\s+/g, '')
    .trim();

function findBestMatch<T extends DivisionItem>(
  list: T[],
  candidates: Array<string | undefined>
): T | null {
  for (const raw of candidates) {
    if (!raw) continue;
    const target = normalize(raw);
    if (!target) continue;
    const exact = list.find((item) => normalize(item.name) === target);
    if (exact) return exact;
  }
  // Nếu không có khớp tuyệt đối, thử khớp gần đúng (bao hàm chuỗi)
  for (const raw of candidates) {
    if (!raw) continue;
    const target = normalize(raw);
    if (!target) continue;
    const fuzzy = list.find(
      (item) => normalize(item.name).includes(target) || target.includes(normalize(item.name))
    );
    if (fuzzy) return fuzzy;
  }
  return null;
}

export const AddressMapPicker: React.FC<AddressMapPickerProps> = ({ onAddressChange }) => {
  // Từ 01/07/2025, Việt Nam chỉ còn 2 cấp hành chính: Tỉnh/Thành phố -> Phường/Xã
  // (bỏ cấp Quận/Huyện). Vì vậy component chỉ còn 2 danh sách provinces/wards,
  // dùng API v2 của provinces.open-api.vn (v1 vẫn trả dữ liệu CŨ trước sáp nhập).
  const [provinces, setProvinces] = useState<DivisionItem[]>([]);
  const [wards, setWards] = useState<DivisionItem[]>([]);

  const [selectedProv, setSelectedProv] = useState({ code: '', name: '' });
  const [selectedWard, setSelectedWard] = useState({ code: '', name: '' });
  const [street, setStreet] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Tọa độ mặc định: Dinh Độc Lập, TPHCM
  const [position, setPosition] = useState<[number, number]>([10.7769, 106.6951]);
  const markerRef = useRef<any>(null);

  // Fetch Tỉnh/Thành phố (API v2 - sau sáp nhập)
  useEffect(() => {
    fetch('https://provinces.open-api.vn/api/v2/p/')
      .then((res) => res.json())
      .then((data) => setProvinces(data || []))
      .catch((err) => console.error('Lỗi tải danh sách Tỉnh/Thành:', err));
  }, []);

  // Fetch Phường/Xã của Tỉnh đã chọn (API v2 trả "wards" trực tiếp dưới tỉnh)
  useEffect(() => {
    if (selectedProv.code) {
      fetch(`https://provinces.open-api.vn/api/v2/p/${selectedProv.code}?depth=2`)
        .then((res) => res.json())
        .then((data) => {
          setWards(data.wards || []);
        })
        .catch((err) => console.error('Lỗi tải danh sách Phường/Xã:', err));
    } else {
      setWards([]);
    }
  }, [selectedProv.code]);

  // Cập nhật chuỗi địa chỉ đầy đủ về Form cha
  useEffect(() => {
    const fullAddress = [street, selectedWard.name, selectedProv.name, 'Việt Nam']
      .filter(Boolean)
      .join(', ');

    if (selectedWard.name || street) {
      onAddressChange(fullAddress);
    }
  }, [selectedProv, selectedWard, street, onAddressChange]);

  // GÕ ĐỊA CHỈ -> TÌM & GHIM TRÊN MAP
  const handleSearchAddress = async () => {
    if (!street && !selectedWard.name) return;
    setIsSearching(true);
    const fullSearchText = [street, selectedWard.name, selectedProv.name, 'Việt Nam']
      .filter(Boolean)
      .join(', ');

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&countrycodes=vn&limit=1&q=${encodeURIComponent(
          fullSearchText
        )}`,
        { headers: { 'Accept-Language': 'vi' } }
      );
      const data = await res.json();

      if (data && data.length > 0) {
        setPosition([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
      } else if (selectedWard.name) {
        // Nominatim không có số nhà "Vũ Ngọc Quỳnh Giang..." trong dữ liệu bản đồ ->
        // thử lùi lại tìm theo Phường/Xã + Tỉnh để ít nhất ghim đúng khu vực,
        // thay vì báo lỗi trắng và không làm gì cả như code cũ.
        const fallbackText = [selectedWard.name, selectedProv.name, 'Việt Nam']
          .filter(Boolean)
          .join(', ');
        const fallbackRes = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&countrycodes=vn&limit=1&q=${encodeURIComponent(
            fallbackText
          )}`,
          { headers: { 'Accept-Language': 'vi' } }
        );
        const fallbackData = await fallbackRes.json();
        if (fallbackData && fallbackData.length > 0) {
          setPosition([parseFloat(fallbackData[0].lat), parseFloat(fallbackData[0].lon)]);
          alert(
            'Không tìm thấy chính xác số nhà/tên đường. Ghim đang trỏ tới khu vực Phường/Xã bạn chọn, vui lòng kéo ghim đỏ đến đúng vị trí nhà bạn.'
          );
        } else {
          alert('Không tìm thấy vị trí. Vui lòng kiểm tra lại địa chỉ hoặc di chuyển ghim đỏ thủ công.');
        }
      } else {
        alert('Không tìm thấy vị trí chính xác. Vui lòng di chuyển ghim đỏ thủ công đến đúng nhà của bạn!');
      }
    } catch (error) {
      console.error('Lỗi:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearchAddress();
    }
  };

  // KÉO GHIM MAP -> REVERSE GEOCODING -> CẬP NHẬT SỐ NHÀ/ĐƯỜNG + TỰ ĐỘNG CHỌN TỈNH/PHƯỜNG
  const eventHandlers = useMemo(
    () => ({
      async dragend() {
        const marker = markerRef.current;
        if (marker == null) return;

        const newPos = marker.getLatLng();
        setPosition([newPos.lat, newPos.lng]);

        setIsSearching(true);
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${newPos.lat}&lon=${newPos.lng}&zoom=18&addressdetails=1`,
            { headers: { 'Accept-Language': 'vi' } }
          );
          const data = await res.json();
          if (!data || !data.address) return;

          const addr = data.address;

          // (1) Chỉ lấy số nhà + tên đường cho ô "street".
          // Code cũ nhét nguyên display_name (đã bao gồm cả Phường/Tỉnh) vào street,
          // khiến địa chỉ cuối cùng bị lặp lại Phường/Tỉnh 2 lần khi ghép chuỗi.
          const houseAndRoad = [addr.house_number, addr.road].filter(Boolean).join(' ');
          setStreet(houseAndRoad || addr.suburb || addr.neighbourhood || '');

          // (2) Tự động tìm & chọn Tỉnh/Thành phố khớp với kết quả reverse geocode
          const matchedProv = findBestMatch(provinces, [addr.state, addr.city]);
          if (!matchedProv) return;

          let wardList = wards;
          if (String(matchedProv.code) !== String(selectedProv.code)) {
            setSelectedProv({ code: String(matchedProv.code), name: matchedProv.name });
            const wardRes = await fetch(
              `https://provinces.open-api.vn/api/v2/p/${matchedProv.code}?depth=2`
            );
            const wardData = await wardRes.json();
            wardList = wardData.wards || [];
            setWards(wardList);
          }

          // (3) Tự động tìm & chọn Phường/Xã khớp
          const matchedWard = findBestMatch(wardList, [
            addr.suburb,
            addr.quarter,
            addr.village,
            addr.town,
            addr.city_district,
            addr.hamlet,
          ]);
          setSelectedWard(matchedWard ? { code: String(matchedWard.code), name: matchedWard.name } : { code: '', name: '' });
        } catch (error) {
          console.error('Lỗi lấy địa chỉ:', error);
        } finally {
          setIsSearching(false);
        }
      },
    }),
    [provinces, wards, selectedProv.code]
  );

  return (
    <div className="space-y-4">
      {/* Dropdown Tỉnh/Phường - chỉ còn 2 cấp theo đơn vị hành chính mới */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <select
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#3D021E]"
          value={selectedProv.code}
          onChange={(e) => {
            const name = e.target.options[e.target.selectedIndex].text;
            setSelectedProv({ code: e.target.value, name });
            setSelectedWard({ code: '', name: '' });
          }}
        >
          <option value="">Chọn Tỉnh/Thành phố</option>
          {provinces.map((p) => (
            <option key={p.code} value={p.code}>
              {p.name}
            </option>
          ))}
        </select>

        <select
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#3D021E]"
          value={selectedWard.code}
          onChange={(e) => {
            const name = e.target.options[e.target.selectedIndex].text;
            setSelectedWard({ code: e.target.value, name });
          }}
          disabled={!selectedProv.code}
        >
          <option value="">Chọn Phường/Xã</option>
          {wards.map((w) => (
            <option key={w.code} value={w.code}>
              {w.name}
            </option>
          ))}
        </select>
      </div>

      {/* Input Số nhà + Nút Tìm */}
      <div className="relative flex items-center">
        <input
          type="text"
          placeholder="Số nhà, Tên đường... (Nhập xong nhấn Enter hoặc Cầm ghim đỏ kéo)"
          value={street}
          onChange={(e) => setStreet(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full pl-4 pr-14 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#3D021E]"
        />
        <button
          type="button"
          onClick={handleSearchAddress}
          className="absolute right-2 p-2 bg-[#3D021E] text-white rounded-lg hover:bg-[#5a032d] transition-colors"
          title="Tìm trên bản đồ"
        >
          {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
        </button>
      </div>

      {/* Bản đồ */}
      <div className="relative">
        <div className="absolute top-2 left-2 z-[400] bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm border border-gray-200 text-xs font-medium text-gray-700 pointer-events-none">
          💡 Mẹo: Kéo thả ghim đỏ để hệ thống tự động điền địa chỉ
        </div>
        <div className="w-full h-72 rounded-xl overflow-hidden border border-gray-200 shadow-sm relative z-0">
          <MapContainer center={position} zoom={16} style={{ width: '100%', height: '100%' }}>
            <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapFlyTo center={position} />
            <Marker draggable={true} eventHandlers={eventHandlers} position={position} ref={markerRef}>
              <Popup>Nhà tôi ở đây!</Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </div>
  );
};