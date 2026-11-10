import { apiClient } from './api/apiClient';
import { API_URLS } from '@constants/apiUrls';
import type {
  AIChatHistoryItem,
  SendChatPayload,
  SendChatResponse,
  AISuggestPayload,
  AISuggestResponse,
  AIOptimizePayload,
} from '@appTypes';

export const aiService = {
  /**
   * GET /api/ai/chat
   * Lấy lịch sử trò chuyện của user hiện tại
   */
  async getChatHistory(): Promise<AIChatHistoryItem[]> {
    const res = await apiClient.get<any>(API_URLS.AI.CHAT);
    const data = res.data;

    if (Array.isArray(data)) {
      return data;
    }
    if (Array.isArray(data?.data)) {
      return data.data;
    }
    if (Array.isArray(data?.messages)) {
      return data.messages;
    }
    return [];
  },

  /**
   * POST /api/ai/chat
   * Gửi tin nhắn đến Gemini AI
   */
  async sendMessage(payload: SendChatPayload): Promise<SendChatResponse> {
    const res = await apiClient.post<any>(API_URLS.AI.CHAT, payload);
    const data = res.data;

    if (typeof data?.reply === 'string') {
      return { reply: data.reply, success: true };
    }
    if (typeof data?.data?.reply === 'string') {
      return { reply: data.data.reply, success: true };
    }
    if (typeof data?.message === 'string') {
      return { reply: data.message, success: true };
    }

    return {
      reply: typeof data === 'string' ? data : 'Rất tiếc, AI tạm thời không thể phản hồi.',
      success: true,
    };
  },

  /**
   * DELETE /api/ai/chat
   * Xóa toàn bộ lịch sử trò chuyện
   */
  async clearChatHistory(): Promise<{ message: string }> {
    const res = await apiClient.delete<any>(API_URLS.AI.CHAT);
    const data = res.data;
    return {
      message: data?.message || data?.data?.message || 'Đã xóa lịch sử trò chuyện thành công.',
    };
  },

  /**
   * POST /api/ai/suggest
   * Bóc tách hoặc gợi ý lịch trình thông minh dạng JSON
   */
  async suggestItinerary(payload: AISuggestPayload): Promise<AISuggestResponse> {
    const res = await apiClient.post<any>(API_URLS.AI.SUGGEST, payload);
    const data = res.data;

    if (data?.data?.schedule) {
      return data.data as AISuggestResponse;
    }
    return data as AISuggestResponse;
  },

  /**
   * POST /api/ai/optimize/{tripId}
   * Tối ưu hóa thứ tự di chuyển của chuyến đi
   */
  async optimizeTrip(tripId: string, payload: AIOptimizePayload): Promise<any> {
    const res = await apiClient.post<any>(API_URLS.AI.OPTIMIZE(tripId), payload);
    return res.data;
  },
};

