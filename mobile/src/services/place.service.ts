import { apiClient } from './api/apiClient';
import { API_URLS } from '@constants/apiUrls';
import type { Place, PlaceFilterParams, PlaceType } from '@appTypes';

export interface SearchPlacesParams {
  q?: string;
  city?: string;
}

// Dữ liệu mẫu chuẩn Figma (The Nautilus Maldives, Erin-Ijesha Falls...)
export const FALLBACK_PLACES: Place[] = [
  {
    _id: 'place-1',
    name: 'The Nautilus Maldives',
    description: 'Khu nghỉ dưỡng siêu sang giữa làn nước ngọc bích của Baa Atoll.',
    images: [
      'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&auto=format&fit=crop&q=80',
    ],
    address: 'Baa Atoll, Maldives',
    city: 'city-newyork',
    rating: 4.8,
    numReviews: 240,
    pricePerNight: 8500000,
    category: 'Beach',
    itemType: 'Hotel',
  },
  {
    _id: 'place-2',
    name: 'Erin-Ijesha Falls',
    description: 'Thác nước 7 tầng kỳ vĩ ẩn mình trong rừng nguyên sinh rợp bóng cây.',
    images: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
    ],
    address: 'Ekiti, Nigeria',
    city: 'city-abuja',
    rating: 4.6,
    numReviews: 185,
    admissionFee: 250000,
    category: 'Mountain',
    itemType: 'Attraction',
  },
  {
    _id: 'place-3',
    name: 'Bà Nà Hills & Cầu Vàng',
    description: 'Kỳ quan bàn tay khổng lồ vươn giữa mây trời Đà Nẵng.',
    images: [
      'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80',
    ],
    address: 'Hòa Vang, Đà Nẵng',
    city: 'city-danang',
    rating: 4.9,
    numReviews: 1250,
    admissionFee: 850000,
    category: 'Mountain',
    itemType: 'Attraction',
  },
  {
    _id: 'place-4',
    name: 'Sydney Harbour & Opera House',
    description: 'Nhà hát con sò biểu tượng vươn mình bên bờ vịnh Sydney.',
    images: [
      'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&auto=format&fit=crop&q=80',
    ],
    address: 'Bennelong Point, Sydney',
    city: 'city-sydney',
    rating: 4.9,
    numReviews: 1420,
    admissionFee: 350000,
    category: 'Culture',
    itemType: 'Attraction',
  },
  {
    _id: 'place-5',
    name: 'CN Tower & Waterfront',
    description: 'Tháp truyền hình cao chọc trời nhìn ra hồ Ontario.',
    images: [
      'https://images.unsplash.com/photo-1517090504586-fde19ea6066f?w=800&auto=format&fit=crop&q=80',
    ],
    address: 'Downtown Toronto',
    city: 'city-toronto',
    rating: 4.7,
    numReviews: 890,
    admissionFee: 400000,
    category: 'Culture',
    itemType: 'Attraction',
  },
  {
    _id: 'place-6',
    name: 'Big Ben & London Eye',
    description: 'Biểu tượng lịch sử tráng lệ bên dòng sông Thames nước Anh.',
    images: [
      'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&auto=format&fit=crop&q=80',
    ],
    address: 'Westminster, London',
    city: 'city-london',
    rating: 4.8,
    numReviews: 1780,
    admissionFee: 500000,
    category: 'Culture',
    itemType: 'Attraction',
  },
];

export const placeService = {
  /**
   * Lấy danh sách địa điểm theo loại (attraction, hotel, restaurant, cafe)
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
      return FALLBACK_PLACES;
    } catch {
      return FALLBACK_PLACES;
    }
  },

  /**
   * Tìm kiếm địa điểm toàn cục hoặc lọc theo thành phố qua GET /api/places/search
   * Khớp chuẩn Swagger parameters: { q, city }
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

        const merged = [...attractions, ...hotels, ...restaurants, ...cafes];
        if (merged.length > 0) return merged;
      }

      // Nếu API trả về mảng trực tiếp
      if (Array.isArray(data?.places)) return data.places;
      if (Array.isArray(data?.data)) return data.data;
      if (Array.isArray(data)) return data;

      // Fallback khi offline
      return FALLBACK_PLACES.filter(p => {
        if (params.city && p.city !== params.city) return false;
        if (params.q && !p.name.toLowerCase().includes(params.q.toLowerCase())) return false;
        return true;
      });
    } catch {
      return FALLBACK_PLACES.filter(p => {
        if (params.city && p.city !== params.city) return false;
        if (params.q && !p.name.toLowerCase().includes(params.q.toLowerCase())) return false;
        return true;
      });
    }
  },
};
