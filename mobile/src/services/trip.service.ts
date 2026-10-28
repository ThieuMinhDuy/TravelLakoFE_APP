import { apiClient } from './api/apiClient';
import { API_URLS } from '@constants/apiUrls';
import type { CreateTripPayload, Trip, UpdateSchedulePayload, ApiResponse } from '@appTypes';

export const tripService = {
  /**
   * Lấy danh sách các chuyến đi của tôi
   */
  async getMyTrips(): Promise<ApiResponse<Trip[]>> {
    const res = await apiClient.get<ApiResponse<Trip[]>>(API_URLS.TRIPS.BASE);
    return res.data;
  },

  /**
   * Lấy chi tiết một chuyến đi
   */
  async getTripById(id: string): Promise<ApiResponse<Trip>> {
    const res = await apiClient.get<ApiResponse<Trip>>(API_URLS.TRIPS.DETAIL(id));
    return res.data;
  },

  /**
   * Tạo chuyến đi mới
   */
  async createTrip(payload: CreateTripPayload): Promise<ApiResponse<Trip>> {
    const res = await apiClient.post<ApiResponse<Trip>>(API_URLS.TRIPS.BASE, payload);
    return res.data;
  },

  /**
   * Cập nhật danh sách địa điểm theo ngày
   */
  async updateSchedule(tripId: string, payload: UpdateSchedulePayload): Promise<ApiResponse<Trip>> {
    const res = await apiClient.put<ApiResponse<Trip>>(
      API_URLS.TRIPS.UPDATE_SCHEDULE(tripId),
      payload,
    );
    return res.data;
  },

  /**
   * Thay đổi thứ tự (Reorder) các điểm trong ngày bằng kéo thả Timeline
   */
  async reorderSchedule(
    tripId: string,
    dayNumber: number,
    placesOrder: { placeId: string; order: number }[],
  ): Promise<ApiResponse<Trip>> {
    const res = await apiClient.put<ApiResponse<Trip>>(
      API_URLS.TRIPS.REORDER_SCHEDULE(tripId),
      { dayNumber, placesOrder },
    );
    return res.data;
  },

  /**
   * Check-in địa điểm theo GPS
   */
  async checkInPlace(
    tripId: string,
    placeId: string,
    userLocation: { lat: number; lng: number },
  ): Promise<ApiResponse<{ visited: boolean; checkInTime: string }>> {
    const res = await apiClient.post<ApiResponse<{ visited: boolean; checkInTime: string }>>(
      API_URLS.TRIPS.CHECK_IN(tripId),
      { placeId, coordinates: userLocation },
    );
    return res.data;
  },

  /**
   * Thêm/cập nhật nhật ký chuyến đi kèm danh sách ảnh
   */
  async updateDiary(
    tripId: string,
    notes: string,
    photos: string[],
  ): Promise<ApiResponse<Trip>> {
    const res = await apiClient.post<ApiResponse<Trip>>(API_URLS.TRIPS.DIARY(tripId), {
      notes,
      photos,
    });
    return res.data;
  },
};
