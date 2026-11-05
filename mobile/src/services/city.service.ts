import { apiClient } from './api/apiClient';
import { API_URLS } from '@constants/apiUrls';
import type { City } from '@appTypes';

// Dữ liệu mẫu chuẩn Figma (Abuja, NewYork, Sydney, Toronto, London...)
export const FALLBACK_CITIES: City[] = [
  {
    _id: 'city-abuja',
    name: 'Abuja',
    description: 'Thủ đô hiện đại của Nigeria với cảnh quan ấn tượng.',
    image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=600&auto=format&fit=crop&q=80',
    country: 'Nigeria',
  },
  {
    _id: 'city-newyork',
    name: 'NewYork',
    description: 'Thành phố không ngủ hoa lệ của nước Mỹ.',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&auto=format&fit=crop&q=80',
    country: 'USA',
  },
  {
    _id: 'city-sydney',
    name: 'Sydney',
    description: 'Thành phố cảng nổi tiếng với Nhà hát Opera biểu tượng.',
    image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=600&auto=format&fit=crop&q=80',
    country: 'Australia',
  },
  {
    _id: 'city-toronto',
    name: 'Toronto',
    description: 'Trung tâm tài chính sầm uất và đa văn hóa của Canada.',
    image: 'https://images.unsplash.com/photo-1517090504586-fde19ea6066f?w=600&auto=format&fit=crop&q=80',
    country: 'Canada',
  },
  {
    _id: 'city-london',
    name: 'London',
    description: 'Thủ đô cổ kính với tháp Big Ben và dòng sông Thames thơ mộng.',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&auto=format&fit=crop&q=80',
    country: 'UK',
  },
  {
    _id: 'city-danang',
    name: 'Đà Nẵng',
    description: 'Thành phố đáng sống với biển Mỹ Khê và Cầu Rồng tráng lệ.',
    image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=600&auto=format&fit=crop&q=80',
    country: 'Việt Nam',
  },
];

export const cityService = {
  /**
   * Lấy danh sách toàn bộ thành phố
   */
  async getCities(): Promise<City[]> {
    try {
      const res = await apiClient.get<any>(API_URLS.CITIES.BASE);
      const data = res.data;
      if (Array.isArray(data?.cities) && data.cities.length > 0) {
        return data.cities;
      }
      if (Array.isArray(data?.data) && data.data.length > 0) {
        return data.data;
      }
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
      return FALLBACK_CITIES;
    } catch {
      return FALLBACK_CITIES;
    }
  },

  /**
   * Lấy chi tiết một thành phố theo ID
   */
  async getCityDetail(id: string): Promise<City> {
    try {
      const res = await apiClient.get<any>(API_URLS.CITIES.DETAIL(id));
      return res.data?.data || res.data;
    } catch {
      const found = FALLBACK_CITIES.find(c => c._id === id);
      if (found) return found;
      throw new Error('City not found');
    }
  },
};
