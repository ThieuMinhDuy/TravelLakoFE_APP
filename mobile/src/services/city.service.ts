import { apiClient } from './api/apiClient';
import { API_URLS } from '@constants/apiUrls';
import type { City, ApiResponse } from '@appTypes';

export const cityService = {
  /**
   * Lấy danh sách thành phố (có hỗ trợ tìm kiếm theo tên)
   */
  async getCities(search?: string): Promise<ApiResponse<City[]>> {
    const res = await apiClient.get<ApiResponse<City[]>>(API_URLS.CITIES.BASE, {
      params: search ? { search } : undefined,
    });
    return res.data;
  },

  /**
   * Lấy chi tiết một thành phố
   */
  async getCityById(id: string): Promise<ApiResponse<City>> {
    const res = await apiClient.get<ApiResponse<City>>(API_URLS.CITIES.DETAIL(id));
    return res.data;
  },
};
