import apiClient from './apiClient';

export const productService = {
  getAll: async () => {
    const response = await apiClient.get('/products');
    return response.data;
  },

  getById: async (id: string | number) => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },

  search: async (keyword: string) => {
    const response = await apiClient.get('/products/search', { params: { keyword } });
    return response.data;
  },

  advancedSearch: async (searchParams: Record<string, unknown>) => {
    const response = await apiClient.post('/products/advanced-search', searchParams);
    return response.data;
  },

  getCategories: async () => {
    const response = await apiClient.get('/products/categories');
    return response.data;
  },

  getBrands: async () => {
    const response = await apiClient.get('/products/brands');
    return response.data;
  },

  getByCategory: async (category: string) => {
    const response = await apiClient.get(`/products/category/${encodeURIComponent(category)}`);
    return response.data;
  },

  getByBrand: async (brand: string) => {
    const response = await apiClient.get(`/products/brand/${encodeURIComponent(brand)}`);
    return response.data;
  },

  getFlashSale: async () => {
    const response = await apiClient.get('/products/flash-sale');
    return response.data;
  },

  getExpiringSoon: async (days = 30) => {
    const response = await apiClient.get('/products/expiring-soon', { params: { days } });
    return response.data;
  },

  getLowStock: async (threshold = 10) => {
    const response = await apiClient.get('/products/low-stock', { params: { threshold } });
    return response.data;
  },

  getOutOfStock: async () => {
    const response = await apiClient.get('/products/out-of-stock');
    return response.data;
  },

  getStats: async () => {
    const response = await apiClient.get('/products/stats');
    return response.data;
  },
};