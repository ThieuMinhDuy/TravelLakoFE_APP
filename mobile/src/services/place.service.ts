import { apiClient } from './api/apiClient';
import { API_URLS } from '@constants/apiUrls';
import type { Place, PlaceFilterParams, PlaceType } from '@appTypes';

export interface SearchPlacesParams {
  q?: string;
  city?: string;
}

export interface CategorizedPlaces {
  attractions: Place[];
  hotels: Place[];
  restaurants: Place[];
  cafes: Place[];
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
          itemType: p.itemType || (type === 'attraction' ? 'Attraction' : type === 'hotel' ? 'Hotel' : type === 'restaurant' ? 'Restaurant' : 'Cafe'),
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
   * Lấy danh sách khách sạn & resort từ API GET /api/places/hotel
   */
  async getHotels(params?: PlaceFilterParams): Promise<Place[]> {
    return this.getPlaces('hotel', params);
  },

  /**
   * Lấy danh sách nhà hàng ẩm thực từ API GET /api/places/restaurant
   */
  async getRestaurants(params?: PlaceFilterParams): Promise<Place[]> {
    return this.getPlaces('restaurant', params);
  },

  /**
   * Lấy danh sách quán cafe từ API GET /api/places/cafe
   */
  async getCafes(params?: PlaceFilterParams): Promise<Place[]> {
    return this.getPlaces('cafe', params);
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

  /**
   * Tìm kiếm địa điểm toàn cục hoặc theo thành phố và trả về phân loại riêng biệt
   * (attractions, hotels, restaurants, cafes)
   */
  async searchPlacesCategorized(paramsOrQuery?: string | SearchPlacesParams): Promise<CategorizedPlaces> {
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

      if (data && (data.attractions || data.hotels || data.restaurants || data.cafes)) {
        return {
          attractions: (data.attractions || []).map((item: any) => ({
            ...item,
            itemType: 'Attraction' as const,
            city: typeof item.city === 'object' ? item.city?._id : item.city,
          })),
          hotels: (data.hotels || []).map((item: any) => ({
            ...item,
            itemType: 'Hotel' as const,
            city: typeof item.city === 'object' ? item.city?._id : item.city,
          })),
          restaurants: (data.restaurants || []).map((item: any) => ({
            ...item,
            itemType: 'Restaurant' as const,
            city: typeof item.city === 'object' ? item.city?._id : item.city,
          })),
          cafes: (data.cafes || []).map((item: any) => ({
            ...item,
            itemType: 'Cafe' as const,
            city: typeof item.city === 'object' ? item.city?._id : item.city,
          })),
        };
      }

      return { attractions: [], hotels: [], restaurants: [], cafes: [] };
    } catch (error) {
      console.warn('Lỗi khi gọi API searchPlacesCategorized:', error);
      return { attractions: [], hotels: [], restaurants: [], cafes: [] };
    }
  },

  /**
   * Xem thông tin chi tiết một địa điểm theo loại và ID từ API GET /api/places/:type/:id
   */
  async getPlaceById(type: string, id: string): Promise<Place | null> {
    try {
      const typeLower = type.toLowerCase();
      const res = await apiClient.get<any>(API_URLS.PLACES.DETAIL(typeLower, id));
      const data = res.data;
      if (data && data._id) {
        return {
          ...data,
          itemType:
            data.itemType ||
            (typeLower === 'attraction'
              ? 'Attraction'
              : typeLower === 'hotel'
              ? 'Hotel'
              : typeLower === 'restaurant'
              ? 'Restaurant'
              : 'Cafe'),
          city: typeof data.city === 'object' ? data.city?._id : data.city,
        };
      }
      return null;
    } catch (error) {
      console.warn(`Lỗi khi gọi API getPlaceById(${type}, ${id}):`, error);
      return null;
    }
  },
};
