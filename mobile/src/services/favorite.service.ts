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
   */
  async addFavorite(itemType: 'Attraction' | 'Hotel' | 'Restaurant' | 'Cafe', itemId: string): Promise<boolean> {
    try {
      await apiClient.post<any>(API_URLS.FAVORITES.BASE, {
        itemType,
        itemId,
      });
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Xóa địa điểm khỏi danh sách yêu thích theo ID
   */
  async removeFavorite(favoriteId: string): Promise<boolean> {
    try {
      await apiClient.delete<any>(API_URLS.FAVORITES.TOGGLE(favoriteId));
      return true;
    } catch {
      return false;
    }
  },
};

