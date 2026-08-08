import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Search, Loader2 } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

import { addressService, type DivisionItem, type GeocodeResult } from '../../services/addressService';
import { buildFullAddress, findBestDivisionMatch } from '../../utils/addressNormalize';

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

export type AddressSelection = {
  fullAddress: string;
  street: string;
  provinceCode: string;
  provinceName: string;
  wardCode: string;
  wardName: string;
  lat: number;
  lng: number;
};

interface AddressMapPickerProps {
  onAddressChange: (fullAddress: string) => void;
  onSelectionChange?: (selection: AddressSelection) => void;
  initialStreet?: string;
  initialProvinceCode?: string;
  initialWardCode?: string;
  initialPosition?: [number, number];
}

async function applyGeocodeToForm(
  data: GeocodeResult,
  provinces: DivisionItem[],
  selectedProvCode: string,
  wards: DivisionItem[],
  setters: {
    setStreet: (v: string) => void;
    setSelectedProv: (v: { code: string; name: string }) => void;
    setSelectedWard: (v: { code: string; name: string }) => void;
    setWards: (v: DivisionItem[]) => void;
  }
) {
  const addr = data.address;
  const houseAndRoad = [addr?.houseNumber, addr?.road].filter(Boolean).join(' ');
  setters.setStreet(houseAndRoad || addr?.suburb || '');

  const matchedProv = findBestDivisionMatch(provinces, [addr?.state, addr?.city]);
  if (!matchedProv) return;

  let wardList = wards;
  if (String(matchedProv.code) !== String(selectedProvCode)) {
    setters.setSelectedProv({ code: String(matchedProv.code), name: matchedProv.name });
    wardList = await addressService.getWards(String(matchedProv.code));
    setters.setWards(wardList);
  }

  const matchedWard = findBestDivisionMatch(wardList, [
    addr?.suburb,
    addr?.quarter,
    addr?.village,
    addr?.town,
    addr?.cityDistrict,
    addr?.hamlet,
  ]);
  setters.setSelectedWard(
    matchedWard
      ? { code: String(matchedWard.code), name: matchedWard.name }
      : { code: '', name: '' }
  );
}

export const AddressMapPicker: React.FC<AddressMapPickerProps> = ({
  onAddressChange,
  onSelectionChange,
  initialStreet = '',
  initialProvinceCode = '',
  initialWardCode = '',
  initialPosition,
}) => {
  const [provinces, setProvinces] = useState<DivisionItem[]>([]);
  const [wards, setWards] = useState<DivisionItem[]>([]);
  const [geocodingProvider, setGeocodingProvider] = useState<'Nominatim' | 'Google'>('Nominatim');

  const [selectedProv, setSelectedProv] = useState({ code: initialProvinceCode, name: '' });
  const [selectedWard, setSelectedWard] = useState({ code: initialWardCode, name: '' });
  const [street, setStreet] = useState(initialStreet);
  const [isSearching, setIsSearching] = useState(false);

  const [position, setPosition] = useState<[number, number]>(initialPosition ?? [10.7769, 106.6951]);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    addressService.getProvinces().then(setProvinces).catch(console.error);
    addressService.getGeocodingProvider().then(setGeocodingProvider).catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!initialProvinceCode || provinces.length === 0) return;
    const prov = provinces.find((p) => String(p.code) === String(initialProvinceCode));
    if (prov) setSelectedProv({ code: String(prov.code), name: prov.name });
  }, [initialProvinceCode, provinces]);

  useEffect(() => {
    if (!selectedProv.code) {
      setWards([]);
      return;
    }
    addressService
      .getWards(selectedProv.code)
      .then((list) => {
        setWards(list);
        if (initialWardCode) {
          const ward = list.find((w) => String(w.code) === String(initialWardCode));
          if (ward) setSelectedWard({ code: String(ward.code), name: ward.name });
        }
      })
      .catch(console.error);
  }, [selectedProv.code, initialWardCode]);

  useEffect(() => {
    const fullAddress = buildFullAddress({
      street,
      wardName: selectedWard.name,
      provinceName: selectedProv.name,
    });

    if (selectedWard.name || street) {
      onAddressChange(fullAddress);
      onSelectionChange?.({
        fullAddress,
        street,
        provinceCode: selectedProv.code,
        provinceName: selectedProv.name,
        wardCode: selectedWard.code,
        wardName: selectedWard.name,
        lat: position[0],
        lng: position[1],
      });
    }
  }, [selectedProv, selectedWard, street, position, onAddressChange, onSelectionChange]);

  const handleSearchAddress = async () => {
    if (!street && !selectedWard.name) return;
    setIsSearching(true);

    const fullSearchText = buildFullAddress({
      street,
      wardName: selectedWard.name,
      provinceName: selectedProv.name,
    });

    try {
      let results = await addressService.searchGeocode(fullSearchText);

      if (results.length === 0 && selectedWard.name) {
        const fallbackText = buildFullAddress({
          wardName: selectedWard.name,
          provinceName: selectedProv.name,
        });
        results = await addressService.searchGeocode(fallbackText);
        if (results.length > 0) {
          alert(
            'Không tìm thấy chính xác số nhà/tên đường. Ghim đang trỏ tới khu vực Phường/Xã bạn chọn — vui lòng kéo ghim đỏ đến đúng vị trí.'
          );
        } else {
          alert('Không tìm thấy vị trí. Vui lòng kiểm tra lại địa chỉ hoặc di chuyển ghim đỏ thủ công.');
        }
      } else if (results.length === 0) {
        alert('Không tìm thấy vị trí chính xác. Vui lòng di chuyển ghim đỏ thủ công đến đúng nhà của bạn!');
      }

      if (results.length > 0) {
        const first = results[0];
        setPosition([first.lat, first.lon]);
      }
    } catch (error) {
      console.error('Geocode search error:', error);
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

  const eventHandlers = useMemo(
    () => ({
      async dragend() {
        const marker = markerRef.current;
        if (marker == null) return;

        const newPos = marker.getLatLng();
        setPosition([newPos.lat, newPos.lng]);

        setIsSearching(true);
        try {
          const data = await addressService.reverseGeocode(newPos.lat, newPos.lng);
          if (!data) return;

          await applyGeocodeToForm(data, provinces, selectedProv.code, wards, {
            setStreet,
            setSelectedProv,
            setSelectedWard,
            setWards,
          });
        } catch (error) {
          console.error('Reverse geocode error:', error);
        } finally {
          setIsSearching(false);
        }
      },
    }),
    [provinces, wards, selectedProv.code]
  );

  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-500">
        Đơn vị hành chính <strong>2 cấp (API v2)</strong> · Geocoding qua BE (
        {geocodingProvider === 'Google' ? 'Google Places' : 'Nominatim'})
      </p>

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

      <div className="relative flex items-center">
        <input
          type="text"
          placeholder="Số nhà, Tên đường... (Nhập xong nhấn Enter hoặc kéo ghim đỏ)"
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

      <div className="relative">
        <div className="absolute top-2 left-2 z-[400] bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm border border-gray-200 text-xs font-medium text-gray-700 pointer-events-none">
          💡 Kéo thả ghim đỏ để hệ thống tự động điền địa chỉ
        </div>
        <div className="w-full h-72 rounded-xl overflow-hidden border border-gray-200 shadow-sm relative z-0">
          <MapContainer center={position} zoom={16} style={{ width: '100%', height: '100%' }}>
            <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapFlyTo center={position} />
            <Marker draggable eventHandlers={eventHandlers} position={position} ref={markerRef}>
              <Popup>Nhà tôi ở đây!</Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </div>
  );
};
