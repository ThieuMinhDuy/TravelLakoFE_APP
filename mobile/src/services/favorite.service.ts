import { apiClient } from './api/apiClient';
import { API_URLS } from '@constants/apiUrls';
import type { FavoriteItem } from '@appTypes';

export const favoriteService = {
  /**
   * Lấy danh sách yêu thích của người dùng hiện tại
   */
  async getFavorites(): Promise<FavoriteItem[]> {
    try {
      const res = await apiClient.get<any>(API_URLS.FAVORITES.BASE);
      const data = res.data;
      if (Array.isArray(data?.favorites)) return data.favorites;
      if (Array.isArray(data?.data)) return data.data;
      if (Array.isArray(data)) return data;
      return [];
    } catch {
      return [];
    }
  },

  /**
   * Thêm địa điểm vào danh sách yêu thích
   * Backend trả về { message, favorite } -> trả về _id của bản ghi favorite (dùng để xóa), hoặc null nếu lỗi
   */
  async addFavorite(itemType: 'Attraction' | 'Hotel' | 'Restaurant' | 'Cafe', itemId: string): Promise<string | null> {
    try {
      const res = await apiClient.post<any>(API_URLS.FAVORITES.BASE, {
        itemType,
        itemId,
      });
      const data = res.data;
      return data?.favorite?._id || data?.data?._id || data?._id || null;
    } catch {
      return null;
    }
  },

  /**
   * Xóa địa điểm khỏi danh sách yêu thích
   * @param favoriteId _id của BẢN GHI favorite (không phải _id của địa điểm) - theo DELETE /api/favorites/:id
   */
  async removeFavorite(favoriteId: string): Promise<boolean> {
    try {
      await apiClient.delete<any>(API_URLS.FAVORITES.REMOVE(favoriteId));
      return true;
    } catch {
      return false;
    }
  },
};

