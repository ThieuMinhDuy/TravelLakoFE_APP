import { apiClient } from './api/apiClient';
import { API_URLS } from '@constants/apiUrls';
import type { AIChatPayload, ChatMessage, GeneratePlanPayload, DaySchedule, ApiResponse } from '@appTypes';

export const aiService = {
  /**
   * Trò chuyện với trợ lý Gemini AI
   */
  async sendMessage(payload: AIChatPayload): Promise<ApiResponse<ChatMessage>> {
    const res = await apiClient.post<ApiResponse<ChatMessage>>(API_URLS.AI.CHAT, payload);
    return res.data;
  },

  /**
   * Sinh lịch trình tự động bằng AI từ số ngày, ngân sách, sở thích
   */
  async generatePlan(payload: GeneratePlanPayload): Promise<ApiResponse<{ title: string; schedule: DaySchedule[] }>> {
    const res = await apiClient.post<ApiResponse<{ title: string; schedule: DaySchedule[] }>>(
      API_URLS.AI.GENERATE_PLAN,
      payload,
    );
    return res.data;
  },

  /**
   * Tối ưu hóa đường đi ngắn nhất giữa các điểm trong ngày
   */
  async optimizeRoute(tripId: string, dayNumber: number): Promise<ApiResponse<DaySchedule>> {
    const res = await apiClient.post<ApiResponse<DaySchedule>>(
      API_URLS.AI.OPTIMIZE_ROUTE,
      { tripId, dayNumber },
    );
    return res.data;
  },
};
