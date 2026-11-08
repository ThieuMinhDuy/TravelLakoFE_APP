export interface FilterState {
  type: 'all' | 'attraction' | 'hotel' | 'restaurant' | 'cafe';
  city: string | null;
  search?: string;
  stars: number | null;
  minPrice: number;
  maxPrice: number;
  cuisineType: string | null;
}

export const DEFAULT_FILTER_STATE: FilterState = {
  type: 'all',
  city: null,
  search: '',
  stars: null,
  minPrice: 0,
  maxPrice: 10000000,
  cuisineType: null,
};

export const POPULAR_CUISINE_TYPES = [
  'Hải sản tươi sống',
  'Ẩm thực Việt ba miền',
  'Đặc sản địa phương',
  'Đặc sản miền Trung',
  'Bún chả Hà Nội',
  'Bánh mì đặc sản',
  'Lẩu gà đặc sản',
  'Nem nướng đặc sản',
  'Món ăn gia đình',
];

export interface ActivityItem {
  id: string;
  name: string;
  emoji: string;
}

export const TOURISM_ACTIVITIES: ActivityItem[] = [
  { id: 'beach', name: 'Biển đảo & Nghỉ dưỡng', emoji: '🏖️' },
  { id: 'trekking', name: 'Leo núi & Trekking', emoji: '⛰️' },
  { id: 'food_tour', name: 'Khám phá ẩm thực & Street food', emoji: '🍜' },
  { id: 'heritage', name: 'Di tích lịch sử & Văn hóa', emoji: '🏛️' },
  { id: 'camping', name: 'Cắm trại & Dã ngoại ngoài trời', emoji: '⛺' },
  { id: 'cafe_chill', name: 'Cafe sống ảo & Check-in view đẹp', emoji: '☕' },
  { id: 'nightlife', name: 'Giải trí về đêm & Phố đi bộ', emoji: '🌃' },
  { id: 'water_sport', name: 'Chèo thuyền SUP & Thuyền thúng', emoji: '🚣' },
  { id: 'cycling', name: 'Đạp xe & Thể thao ngoài trời', emoji: '🚴' },
  { id: 'shopping', name: 'Mua sắm đặc sản & Chợ đêm', emoji: '🛍️' },
  { id: 'photo_hunting', name: 'Tour săn mây & Nhiếp ảnh cảnh đẹp', emoji: '📸' },
  { id: 'spa_wellness', name: 'Nghỉ dưỡng Spa & Tắm khoáng nóng', emoji: '💆' },
];
