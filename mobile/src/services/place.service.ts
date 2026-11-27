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

type PlaceItemType = NonNullable<Place['itemType']>;

const TYPE_TO_ITEM_TYPE: Record<string, PlaceItemType> = {
  attraction: 'Attraction',
  hotel: 'Hotel',
  restaurant: 'Restaurant',
  cafe: 'Cafe',
};

const toItemType = (type: string): PlaceItemType =>
  TYPE_TO_ITEM_TYPE[type.toLowerCase()] || 'Cafe';

/**
 * Chuẩn hoá 1 địa điểm từ backend:
 * - Gắn itemType nếu backend không trả về
 * - city: backend populate thành object { _id, name } -> tách thành city (ID) + cityName
 */
const normalizePlace = (item: any, fallbackType: PlaceItemType): Place => {
  const cityObj = item?.city && typeof item.city === 'object' ? item.city : null;
  return {
    ...item,
    itemType: item?.itemType || fallbackType,
    city: cityObj ? cityObj._id : item?.city,
    cityName: cityObj?.name || item?.cityName,
  };
};

const normalizeList = (list: any, fallbackType: PlaceItemType): Place[] =>
  Array.isArray(list) ? list.map((item) => normalizePlace(item, fallbackType)) : [];

const EMPTY_CATEGORIZED: CategorizedPlaces = {
  attractions: [],
  hotels: [],
  restaurants: [],
  cafes: [],
};

export const placeService = {
  /**
   * Lấy danh sách địa điểm theo loại (attraction, hotel, restaurant, cafe) từ API GET /api/places/:type
   */
  async getPlaces(type: PlaceType = 'attraction', params?: PlaceFilterParams): Promise<Place[]> {
    try {
      const res = await apiClient.get<any>(API_URLS.PLACES.BY_TYPE(type), { params });
      const data = res.data;
      const itemType = toItemType(type);
      if (Array.isArray(data?.places)) return normalizeList(data.places, itemType);
      if (Array.isArray(data?.data)) return normalizeList(data.data, itemType);
      if (Array.isArray(data)) return normalizeList(data, itemType);
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
   * Trả về 1 mảng gộp (attractions + hotels + restaurants + cafes)
   */
  async searchPlaces(paramsOrQuery?: string | SearchPlacesParams): Promise<Place[]> {
    const c = await this.searchPlacesCategorized(paramsOrQuery);
    return [...c.attractions, ...c.hotels, ...c.restaurants, ...c.cafes];
  },

  /**
   * Tìm kiếm địa điểm toàn cục hoặc theo thành phố và trả về phân loại riêng biệt
   * Swagger parameters: { q, city } -> Backend trả về { attractions, hotels, restaurants, cafes }
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
          attractions: normalizeList(data.attractions, 'Attraction'),
          hotels: normalizeList(data.hotels, 'Hotel'),
          restaurants: normalizeList(data.restaurants, 'Restaurant'),
          cafes: normalizeList(data.cafes, 'Cafe'),
        };
      }

      return EMPTY_CATEGORIZED;
    } catch (error) {
      console.warn('Lỗi khi gọi API searchPlacesCategorized:', error);
      return EMPTY_CATEGORIZED;
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
        return normalizePlace(data, toItemType(typeLower));
      }
      return null;
    } catch (error) {
      console.warn(`Lỗi khi gọi API getPlaceById(${type}, ${id}):`, error);
      return null;
    }
  },
};
