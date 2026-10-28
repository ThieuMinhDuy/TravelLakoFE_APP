import type { Coordinates } from '@appTypes';

/**
 * ============================================================================
 * PURE UTILITY FUNCTIONS - TravelLako Mobile
 * ============================================================================
 */

// ----------------------------------------------------------------------------
// 1. TIỀN TỆ (Currency)
// ----------------------------------------------------------------------------
/**
 * Định dạng số tiền sang định dạng tiền tệ Việt Nam (VNĐ)
 * @param amount Số tiền
 * @param freeLabel Nhãn hiển thị khi số tiền = 0 (mặc định: "Miễn phí")
 */
export const formatCurrency = (amount: number, freeLabel = 'Miễn phí'): string => {
  if (amount === 0) return freeLabel;
  return `${amount.toLocaleString('vi-VN')} ₫`;
};

// ----------------------------------------------------------------------------
// 2. NGÀY THÁNG (Date & Time)
// ----------------------------------------------------------------------------
/**
 * Định dạng chuỗi ngày tháng ISO sang định dạng dd/MM/yyyy
 */
export const formatDate = (isoString?: string | null): string => {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return '';

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

// ----------------------------------------------------------------------------
// 3. ĐỊA LÝ & GPS (Geofence & Distance)
// ----------------------------------------------------------------------------
/**
 * Tính khoảng cách giữa hai tọa độ địa lý theo công thức Haversine (đơn vị: mét)
 * Dùng cho tính năng Check-in GPS trên mobile (yêu cầu khoảng cách < 200m)
 */
export const calculateDistanceInMeters = (
  coord1: Coordinates,
  coord2: Coordinates,
): number => {
  const R = 6371e3; // Bán kính trái đất tính bằng mét
  const phi1 = (coord1.lat * Math.PI) / 180;
  const phi2 = (coord2.lat * Math.PI) / 180;
  const deltaPhi = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const deltaLambda = ((coord2.lng - coord1.lng) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) *
      Math.cos(phi2) *
      Math.sin(deltaLambda / 2) *
      Math.sin(deltaLambda / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
};

/**
 * Kiểm tra xem vị trí người dùng có nằm trong phạm vi check-in cho phép hay không
 * @param userCoords Tọa độ GPS hiện tại của người dùng
 * @param placeCoords Tọa độ địa điểm
 * @param thresholdMeters Bán kính cho phép (mặc định 200m theo đặc tả)
 */
export const isWithinCheckInRadius = (
  userCoords: Coordinates,
  placeCoords: Coordinates,
  thresholdMeters = 200,
): boolean => {
  const distance = calculateDistanceInMeters(userCoords, placeCoords);
  return distance <= thresholdMeters;
};
