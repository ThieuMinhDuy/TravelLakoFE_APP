import { apiClient } from './api/apiClient';
import { API_URLS } from '@constants/apiUrls';
import type { AnyPlace, PlaceType, ApiResponse } from '@appTypes';

export interface PlaceFilterParams {
  city?: string;
  search?: string;
  stars?: number;
  minPrice?: number;
  maxPrice?: number;
}

export const placeService = {
  /**
   * Tìm kiếm tổng hợp toàn bộ các nhóm địa điểm (Global Search)
   */
  async searchPlaces(query: string, cityId?: string): Promise<ApiResponse<AnyPlace[]>> {
    const res = await apiClient.get<ApiResponse<AnyPlace[]>>(API_URLS.PLACES.GLOBAL_SEARCH, {
      params: { q: query, city: cityId },
    });
    return res.data;
  },

  /**
   * Lấy danh sách địa điểm theo phân loại (attraction, hotel, restaurant, cafe)
   */
  async getPlacesByType(type: PlaceType, filters?: PlaceFilterParams): Promise<ApiResponse<AnyPlace[]>> {
    const res = await apiClient.get<ApiResponse<AnyPlace[]>>(API_URLS.PLACES.BY_TYPE(type), {
      params: filters,
    });
    return res.data;
  },

  /**
   * Lấy chi tiết một địa điểm
   */
  async getPlaceDetail(type: PlaceType, id: string): Promise<ApiResponse<AnyPlace>> {
    const res = await apiClient.get<ApiResponse<AnyPlace>>(API_URLS.PLACES.DETAIL(type, id));
    return res.data;
  },
};
