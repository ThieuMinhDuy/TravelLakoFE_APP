import { apiClient } from './api/apiClient';
import { API_URLS } from '@constants/apiUrls';
import type { City } from '@appTypes';

export const cityService = {
  /**
   * Lấy danh sách toàn bộ thành phố từ API GET /api/cities
   */
  async getCities(): Promise<City[]> {
    try {
      const res = await apiClient.get<any>(API_URLS.CITIES.BASE);
      const data = res.data;
      if (Array.isArray(data?.cities)) {
        return data.cities;
      }
      if (Array.isArray(data?.data)) {
        return data.data;
      }
      if (Array.isArray(data)) {
        return data;
      }
      return [];
    } catch (error) {
      console.warn('Lỗi khi gọi API getCities:', error);
      return [];
    }
  },

  /**
   * Lấy chi tiết một thành phố theo ID từ API GET /api/cities/:id
   */
  async getCityDetail(id: string): Promise<City | null> {
    try {
      const res = await apiClient.get<any>(API_URLS.CITIES.DETAIL(id));
      return res.data?.data || res.data || null;
    } catch (error) {
      console.warn(`Lỗi khi gọi API getCityDetail(${id}):`, error);
      return null;
    }
  },
};
