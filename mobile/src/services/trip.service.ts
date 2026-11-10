import { apiClient } from './api/apiClient';
import { API_URLS } from '@constants/apiUrls';
import type { AddPlaceToSchedulePayload, Trip, TripsResponse } from '@appTypes';

export const tripService = {
  /**
   * Lấy danh sách chuyến đi của người dùng hiện tại từ API GET /api/trips
   */
  async getMyTrips(): Promise<TripsResponse> {
    try {
      const res = await apiClient.get<TripsResponse>(API_URLS.TRIPS.BASE);
      const data = res.data;
      return {
        upcoming: Array.isArray(data?.upcoming) ? data.upcoming : [],
        ongoing: Array.isArray(data?.ongoing) ? data.ongoing : [],
        past: Array.isArray(data?.past) ? data.past : [],
      };
    } catch (error) {
      console.warn('Lỗi khi gọi API getMyTrips:', error);
      return { upcoming: [], ongoing: [], past: [] };
    }
  },

  /**
   * Lấy chi tiết chuyến đi từ API GET /api/trips/:id
   */
  async getTripById(tripId: string): Promise<Trip | null> {
    try {
      const res = await apiClient.get<Trip>(API_URLS.TRIPS.DETAIL(tripId));
      return res.data;
    } catch (error) {
      console.warn(`Lỗi khi gọi API getTripById(${tripId}):`, error);
      return null;
    }
  },

  /**
   * Thêm địa điểm vào lịch trình chuyến đi từ API POST /api/trips/:id/schedule/places
   */
  async addPlaceToSchedule(tripId: string, payload: AddPlaceToSchedulePayload): Promise<boolean> {
    try {
      await apiClient.post(API_URLS.TRIPS.ADD_PLACE(tripId), payload);
      return true;
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Không thể thêm địa điểm vào chuyến đi';
      throw new Error(message);
    }
  },
};

