import type { Coordinates } from './api.types';

/**
 * Phân loại địa điểm trong lịch trình
 */
export type TripPlaceType = 'Attraction' | 'Hotel' | 'Restaurant' | 'Cafe' | string;

/**
 * Thông tin chi tiết địa điểm khi đã được backend populate
 */
export interface PlacePopulated {
  _id: string;
  name: string;
  type?: string;
  address?: string;
  image?: string;
  images?: string[];
  coordinates?: Coordinates;
  price?: number;
  stars?: number;
  rating?: number;
}

/**
 * Một địa điểm nằm trong lịch trình ngày
 */
export interface PlaceInSchedule {
  _id: string; // subId dùng cho xóa, check-in, reorder
  placeType: TripPlaceType;
  placeId: string | PlacePopulated; // Object khi populate (GET /trips/:id), string ID khi chưa populate
  order: number;
  note?: string;
  visited?: boolean;
  checkInTime?: string | null;
}

/**
 * Lịch trình theo từng ngày của chuyến đi
 */
export interface DaySchedule {
  _id?: string;
  day: number;
  date?: string;
  places: PlaceInSchedule[];
}

/**
 * Nhật ký và ảnh kỷ niệm của chuyến đi
 */
export interface TripDiary {
  notes?: string;
  photos?: string[];
}

/**
 * Thông tin thành phố khi được backend populate trong chuyến đi
 */
export interface TripCity {
  _id: string;
  name: string;
  image?: string;
  coordinates?: Coordinates;
}

/**
 * Cấu trúc đối tượng chuyến đi (Trip)
 */
export interface Trip {
  _id: string;
  user: string;
  title: string;
  city: string | TripCity; // string ID trong danh sách, object khi populate ở màn chi tiết
  startDate: string;
  endDate: string;
  budget: number;
  schedule: DaySchedule[];
  diary?: TripDiary;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Dữ liệu trả về từ GET /trips phân theo 3 trạng thái
 */
export interface TripsGroupedResponse {
  upcoming: Trip[];
  ongoing: Trip[];
  past: Trip[];
}

/**
 * Payload tạo chuyến đi mới: POST /trips
 */
export interface CreateTripPayload {
  title: string;
  city: string; // City ID
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  budget: number;
  schedule?: DaySchedule[];
}

/**
 * Payload thêm địa điểm vào ngày: POST /trips/:id/schedule/places
 */
export interface AddPlacePayload {
  day: number;
  placeType: TripPlaceType;
  placeId: string;
  note?: string;
}

/**
 * Payload sắp xếp lại thứ tự điểm trong ngày: PUT /trips/:id/schedule/reorder
 */
export interface ReorderSchedulePayload {
  day: number;
  placesOrder: string[]; // Mảng các subId (_id của place trong places) theo thứ tự mới
}

/**
 * Payload check-in địa điểm: PATCH /trips/:id/schedule/places/:subId/check-in
 */
export interface CheckInPlacePayload {
  visited: boolean;
}

/**
 * Payload cập nhật nhật ký & ảnh: PUT /trips/:id/diary
 */
export interface UpdateDiaryPayload {
  notes?: string;
  photos?: string[];
}

/**
 * Kết quả trả về khi tải ảnh lên server: POST /upload
 */
export interface UploadImageResponse {
  message: string;
  url: string;
}

