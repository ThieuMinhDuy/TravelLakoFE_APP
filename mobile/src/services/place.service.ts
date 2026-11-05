import { apiClient } from './api/apiClient';
import { API_URLS } from '@constants/apiUrls';
import type { Place, PlaceFilterParams, PlaceType } from '@appTypes';

export interface SearchPlacesParams {
  q?: string;
  city?: string;
}

export const placeService = {
  /**
   * Lấy danh sách địa điểm theo loại (attraction, hotel, restaurant, cafe) từ API GET /api/places/:type
   */
  async getPlaces(type: PlaceType = 'attraction', params?: PlaceFilterParams): Promise<Place[]> {
    try {
      const res = await apiClient.get<any>(API_URLS.PLACES.BY_TYPE(type), { params });
      const data = res.data;
      if (Array.isArray(data?.places)) {
        return data.places.map((p: any) => ({
          ...p,
          itemType: p.itemType || (type === 'attraction' ? 'Attraction' : type === 'hotel' ? 'Hotel' : 'Attraction'),
          city: typeof p.city === 'object' ? p.city?._id : p.city,
        }));
      }
      if (Array.isArray(data?.data)) {
        return data.data;
      }
      if (Array.isArray(data)) {
        return data;
      }
      return [];
    } catch (error) {
      console.warn(`Lỗi khi gọi API getPlaces(${type}):`, error);
      return [];
    }
  },

  /**
   * Tìm kiếm địa điểm toàn cục hoặc lọc theo thành phố từ API GET /api/places/search
   * Swagger parameters: { q, city }
   */
  async searchPlaces(paramsOrQuery?: string | SearchPlacesParams): Promise<Place[]> {
    const params: SearchPlacesParams =
      typeof paramsOrQuery === 'string'
        ? { q: paramsOrQuery }
        : paramsOrQuery || {};

    try {
      const res = await apiClient.get<any>(API_URLS.PLACES.GLOBAL_SEARCH, {
        params: {
          q: params.q || undefined,
          city: params.city || undefined,
        },
      });
      const data = res.data;

      // Chuẩn hóa kết quả trả về từ globalSearch của Backend: { attractions, hotels, restaurants, cafes }
      if (data && (data.attractions || data.hotels || data.restaurants || data.cafes)) {
        const attractions: Place[] = (data.attractions || []).map((item: any) => ({
          ...item,
          itemType: 'Attraction' as const,
          city: typeof item.city === 'object' ? item.city?._id : item.city,
        }));

        const hotels: Place[] = (data.hotels || []).map((item: any) => ({
          ...item,
          itemType: 'Hotel' as const,
          city: typeof item.city === 'object' ? item.city?._id : item.city,
        }));

        const restaurants: Place[] = (data.restaurants || []).map((item: any) => ({
          ...item,
          itemType: 'Restaurant' as const,
          city: typeof item.city === 'object' ? item.city?._id : item.city,
        }));

        const cafes: Place[] = (data.cafes || []).map((item: any) => ({
          ...item,
          itemType: 'Cafe' as const,
          city: typeof item.city === 'object' ? item.city?._id : item.city,
        }));

        return [...attractions, ...hotels, ...restaurants, ...cafes];
      }

      if (Array.isArray(data?.places)) return data.places;
      if (Array.isArray(data?.data)) return data.data;
      if (Array.isArray(data)) return data;

      return [];
    } catch (error) {
      console.warn('Lỗi khi gọi API searchPlaces:', error);
      return [];
    }
  },
};
