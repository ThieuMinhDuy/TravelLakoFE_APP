import { apiClient } from './api/apiClient';
import { API_URLS } from '@constants/apiUrls';
import type { CreateReviewPayload, Review, ReviewsResponse } from '@appTypes';

export const reviewService = {
  /**
   * Lấy danh sách đánh giá của một địa điểm cụ thể từ API GET /api/reviews/:itemType/:itemId
   */
  async getPlaceReviews(itemType: string, itemId: string): Promise<ReviewsResponse> {
    try {
      const res = await apiClient.get<ReviewsResponse>(
        API_URLS.REVIEWS.BY_PLACE(itemType, itemId)
      );
      const data = res.data;
      if (Array.isArray(data?.reviews)) {
        return {
          total: data.total ?? data.reviews.length,
          reviews: data.reviews,
        };
      }
      if (Array.isArray(data)) {
        return {
          total: data.length,
          reviews: data,
        };
      }
      return { total: 0, reviews: [] };
    } catch (error) {
      console.warn(`Lỗi khi gọi API getPlaceReviews(${itemType}, ${itemId}):`, error);
      return { total: 0, reviews: [] };
    }
  },

  /**
   * Gửi đánh giá mới cho địa điểm từ API POST /api/reviews (Yêu cầu đăng nhập)
   */
  async createReview(payload: CreateReviewPayload): Promise<Review | null> {
    try {
      const res = await apiClient.post<any>(API_URLS.REVIEWS.CREATE, payload);
      const data = res.data;
      return (data?.review || data) as Review;
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Không thể gửi đánh giá. Vui lòng thử lại.';
      throw new Error(message);
    }
  },

  /**
   * Xóa đánh giá của chính mình từ API DELETE /api/reviews/:id
   */
  async deleteReview(reviewId: string): Promise<boolean> {
    try {
      await apiClient.delete(API_URLS.REVIEWS.DELETE(reviewId));
      return true;
    } catch (error) {
      console.warn(`Lỗi khi xóa đánh giá ${reviewId}:`, error);
      return false;
    }
  },
};

