import { apiClient } from './api/apiClient';
import { API_URLS } from '@constants/apiUrls';
import type {
  Trip,
  TripsGroupedResponse,
  CreateTripPayload,
  AddPlacePayload,
  ReorderSchedulePayload,
  CheckInPlacePayload,
  UpdateDiaryPayload,
  UploadImageResponse,
} from '@appTypes';

export const tripService = {
  /**
   * GET /trips
   * Lấy danh sách chuyến đi của người dùng, phân theo 3 nhóm: upcoming, ongoing, past
   */
  async getMyTrips(): Promise<TripsGroupedResponse> {
    const res = await apiClient.get<any>(API_URLS.TRIPS.BASE);
    const data = res.data?.data || res.data;

    if (data && typeof data === 'object') {
      return {
        upcoming: Array.isArray(data.upcoming) ? data.upcoming : [],
        ongoing: Array.isArray(data.ongoing) ? data.ongoing : [],
        past: Array.isArray(data.past) ? data.past : [],
      };
    }

    return {
      upcoming: [],
      ongoing: [],
      past: [],
    };
  },

  /**
   * GET /trips/:id
   * Lấy chi tiết chuyến đi (city và places đã được populate đầy đủ)
   */
  async getTripDetail(tripId: string): Promise<Trip> {
    const res = await apiClient.get<any>(API_URLS.TRIPS.DETAIL(tripId));
    return res.data?.data || res.data;
  },

  /**
   * POST /trips
   * Tạo chuyến đi mới
   */
  async createTrip(payload: CreateTripPayload): Promise<Trip> {
    const res = await apiClient.post<any>(API_URLS.TRIPS.BASE, payload);
    return res.data?.data || res.data;
  },

  /**
   * DELETE /trips/:id
   * Xóa chuyến đi
   */
  async deleteTrip(tripId: string): Promise<void> {
    await apiClient.delete<any>(API_URLS.TRIPS.DELETE(tripId));
  },

  /**
   * POST /trips/:id/schedule/places
   * Thêm một địa điểm vào ngày cụ thể trong lịch trình
   */
  async addPlace(tripId: string, payload: AddPlacePayload): Promise<Trip> {
    const res = await apiClient.post<any>(API_URLS.TRIPS.ADD_PLACE(tripId), payload);
    return res.data?.data || res.data;
  },

  /**
   * DELETE /trips/:id/schedule/places/:subId
   * Xóa địa điểm khỏi ngày (subId là _id của phần tử trong mảng places)
   */
  async deletePlace(tripId: string, subId: string): Promise<Trip> {
    const res = await apiClient.delete<any>(API_URLS.TRIPS.DELETE_PLACE(tripId, subId));
    return res.data?.data || res.data;
  },

  /**
   * PUT /trips/:id/schedule/reorder
   * Sắp xếp lại thứ tự điểm đi trong ngày (placesOrder là mảng các subId)
   */
  async reorderSchedule(tripId: string, payload: ReorderSchedulePayload): Promise<Trip> {
    const res = await apiClient.put<any>(API_URLS.TRIPS.REORDER_SCHEDULE(tripId), payload);
    return res.data?.data || res.data;
  },

  /**
   * PATCH /trips/:id/schedule/places/:subId/check-in
   * Đánh dấu đã tham quan / Check-in địa điểm GPS (< 200m)
   */
  async checkInPlace(
    tripId: string,
    subId: string,
    visited = true,
  ): Promise<Trip> {
    const payload: CheckInPlacePayload = { visited };
    const res = await apiClient.patch<any>(
      API_URLS.TRIPS.CHECK_IN_PLACE(tripId, subId),
      payload,
    );
    return res.data?.data || res.data;
  },

  /**
   * PUT /trips/:id/diary
   * Cập nhật nhật ký hành trình và danh sách link ảnh
   */
  async updateDiary(tripId: string, payload: UpdateDiaryPayload): Promise<Trip> {
    const res = await apiClient.put<any>(API_URLS.TRIPS.DIARY(tripId), payload);
    return res.data?.data || res.data;
  },

  /**
   * POST /upload
   * Tải ảnh lên server (Cloudinary/fallback)
   */
  async uploadImage(file: { uri: string; name: string; type: string }): Promise<UploadImageResponse> {
    const formData = new FormData();
    formData.append('image', file as any);

    const res = await apiClient.post<UploadImageResponse>(API_URLS.UPLOAD, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },
};
