import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Search, Loader2 } from 'lucide-react'; // Thêm icon
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix lỗi icon mặc định của Leaflet
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

export const AddressMapPicker: React.FC<AddressMapPickerProps> = ({ onAddressChange }) => {
  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);

  const [selectedProv, setSelectedProv] = useState({ code: '', name: '' });
  const [selectedDist, setSelectedDist] = useState({ code: '', name: '' });
  const [selectedWard, setSelectedWard] = useState({ code: '', name: '' });
  const [street, setStreet] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Tọa độ mặc định: Dinh Độc Lập, TPHCM
  const [position, setPosition] = useState<[number, number]>([10.7769, 106.6951]);
  const markerRef = useRef<any>(null);

  // 1. Fetch Tỉnh/Thành
  useEffect(() => {
    fetch('https://provinces.open-api.vn/api/p/')
      .then(res => res.json())
      .then(data => setProvinces(data));
  }, []);

  // 2. Fetch Quận/Huyện
  useEffect(() => {
    if (selectedProv.code) {
      fetch(`https://provinces.open-api.vn/api/p/${selectedProv.code}?depth=2`)
        .then(res => res.json())
        .then(data => {
          setDistricts(data.districts || []);
          setWards([]);
          setSelectedDist({ code: '', name: '' });
          setSelectedWard({ code: '', name: '' });
        });
    }
  }, [selectedProv.code]);

  // 3. Fetch Phường/Xã
  useEffect(() => {
    if (selectedDist.code) {
      fetch(`https://provinces.open-api.vn/api/d/${selectedDist.code}?depth=2`)
        .then(res => res.json())
        .then(data => {
          setWards(data.wards || []);
          setSelectedWard({ code: '', name: '' });
        });
    }
  }, [selectedDist.code]);

  // 4. Update string địa chỉ về Form cha
  useEffect(() => {
    const fullAddress = [street, selectedWard.name, selectedDist.name, selectedProv.name, 'Việt Nam']
      .filter(Boolean)
      .join(', ');
    
    if (selectedWard.name || street) {
        onAddressChange(fullAddress);
    }
  }, [selectedProv, selectedDist, selectedWard, street, onAddressChange]);

  // 5. CHIỀU 1: GÕ ĐỊA CHỈ -> CẬP NHẬT MAP
  const handleSearchAddress = async () => {
    if (!street && !selectedWard.name) return;
    setIsSearching(true);
    const fullSearchText = [street, selectedWard.name, selectedDist.name, selectedProv.name, 'Việt Nam'].filter(Boolean).join(', ');

    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullSearchText)}`);
      const data = await res.json();
      
      if (data && data.length > 0) {
          setPosition([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
      } else {
          alert("Không tìm thấy vị trí chính xác. Vui lòng di chuyển ghim đỏ thủ công đến đúng nhà của bạn!");
      }
    } catch (error) {
       console.error("Lỗi:", error);
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

  // 6. CHIỀU 2: KÉO GHIM MAP -> CẬP NHẬT ĐỊA CHỈ (REVERSE GEOCODING)
  const eventHandlers = useMemo(
    () => ({
      async dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const newPos = marker.getLatLng();
          setPosition([newPos.lat, newPos.lng]);

          // Lấy địa chỉ từ tọa độ
          setIsSearching(true);
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${newPos.lat}&lon=${newPos.lng}&zoom=18&addressdetails=1`);
            const data = await res.json();
            if (data && data.display_name) {
                // Lọc bỏ chữ "Việt Nam" ở cuối cho gọn
                const cleanAddress = data.display_name.replace(/,\s*Việt Nam$/i, '');
                setStreet(cleanAddress);
            }
          } catch (error) {
            console.error("Lỗi lấy địa chỉ:", error);
          } finally {
            setIsSearching(false);
          }
        }
      },
    }),
    []
  );

  return (
    <div className="space-y-4">
      {/* Dropdown Tỉnh/Quận/Phường */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <select
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#3D021E]"
          value={selectedProv.code}
          onChange={(e) => {
            const name = e.target.options[e.target.selectedIndex].text;
            setSelectedProv({ code: e.target.value, name });
          }}
        >
          <option value="">Chọn Tỉnh/Thành phố</option>
          {provinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
        </select>

        <select
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#3D021E]"
          value={selectedDist.code}
          onChange={(e) => {
            const name = e.target.options[e.target.selectedIndex].text;
            setSelectedDist({ code: e.target.value, name });
          }}
          disabled={!selectedProv.code}
        >
          <option value="">Chọn Quận/Huyện</option>
          {districts.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
        </select>

        <select
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#3D021E]"
          value={selectedWard.code}
          onChange={(e) => {
            const name = e.target.options[e.target.selectedIndex].text;
            setSelectedWard({ code: e.target.value, name });
          }}
          disabled={!selectedDist.code}
        >
          <option value="">Chọn Phường/Xã</option>
          {wards.map(w => <option key={w.code} value={w.code}>{w.name}</option>)}
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
              <TileLayer
                attribution='&copy; OpenStreetMap'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapFlyTo center={position} />
              <Marker 
                  draggable={true}
                  eventHandlers={eventHandlers}
                  position={position}
                  ref={markerRef}
              >
                <Popup>Nhà tôi ở đây!</Popup>
              </Marker>
            </MapContainer>
          </div>
      </div>
    </div>
  );
};