import { apiClient } from './api/apiClient';
import { API_URLS } from '@constants/apiUrls';

export interface CreateTripPayload {
  title: string;
  city: string;
  startDate: string;
  endDate: string;
  budget: number;
  schedule?: any[];
}

export const tripService = {
  /**
   * POST /api/trips
   * Tạo chuyến đi mới
   */
  async createTrip(payload: CreateTripPayload): Promise<any> {
    const res = await apiClient.post<any>(API_URLS.TRIPS.BASE, payload);
    return res.data?.data || res.data;
  },

  /**
   * GET /api/trips
   * Lấy danh sách chuyến đi của tôi
   */
  async getMyTrips(): Promise<any[]> {
    const res = await apiClient.get<any>(API_URLS.TRIPS.BASE);
    const data = res.data;
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    return [];
  },
};

