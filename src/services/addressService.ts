import apiClient from './apiClient';

export type DivisionItem = {
  code: string;
  name: string;
};

export type GeocodeAddressParts = {
  houseNumber?: string | null;
  road?: string | null;
  suburb?: string | null;
  quarter?: string | null;
  village?: string | null;
  town?: string | null;
  cityDistrict?: string | null;
  hamlet?: string | null;
  state?: string | null;
  city?: string | null;
};

export type GeocodeResult = {
  lat: number;
  lon: number;
  displayName: string;
  address?: GeocodeAddressParts | null;
};

function mapDivision(raw: { code?: string | number; name?: string }): DivisionItem {
  return {
    code: String(raw.code ?? ''),
    name: String(raw.name ?? ''),
  };
}

function mapGeocode(raw: Record<string, unknown>): GeocodeResult {
  const addr = raw.address as Record<string, unknown> | null | undefined;
  return {
    lat: Number(raw.lat),
    lon: Number(raw.lon),
    displayName: String(raw.displayName ?? ''),
    address: addr
      ? {
          houseNumber: addr.houseNumber as string | undefined,
          road: addr.road as string | undefined,
          suburb: addr.suburb as string | undefined,
          quarter: addr.quarter as string | undefined,
          village: addr.village as string | undefined,
          town: addr.town as string | undefined,
          cityDistrict: addr.cityDistrict as string | undefined,
          hamlet: addr.hamlet as string | undefined,
          state: addr.state as string | undefined,
          city: addr.city as string | undefined,
        }
      : null,
  };
}

export const addressService = {
  getProvinces: async (): Promise<DivisionItem[]> => {
    const response = await apiClient.get('/address/provinces');
    const data = response.data;
    return Array.isArray(data) ? data.map(mapDivision) : [];
  },

  getWards: async (provinceCode: string): Promise<DivisionItem[]> => {
    const response = await apiClient.get(`/address/provinces/${encodeURIComponent(provinceCode)}/wards`);
    const data = response.data;
    return Array.isArray(data) ? data.map(mapDivision) : [];
  },

  getGeocodingProvider: async (): Promise<'Nominatim' | 'Google'> => {
    try {
      const response = await apiClient.get('/address/geocode/provider');
      const provider = String(response.data?.provider ?? 'Nominatim');
      return provider === 'Google' ? 'Google' : 'Nominatim';
    } catch {
      return 'Nominatim';
    }
  },

  searchGeocode: async (query: string): Promise<GeocodeResult[]> => {
    const response = await apiClient.get('/address/geocode/search', { params: { q: query } });
    const data = response.data;
    return Array.isArray(data) ? data.map((item) => mapGeocode(item as Record<string, unknown>)) : [];
  },

  reverseGeocode: async (lat: number, lon: number): Promise<GeocodeResult | null> => {
    try {
      const response = await apiClient.get('/address/geocode/reverse', { params: { lat, lon } });
      return mapGeocode(response.data as Record<string, unknown>);
    } catch {
      return null;
    }
  },
};
