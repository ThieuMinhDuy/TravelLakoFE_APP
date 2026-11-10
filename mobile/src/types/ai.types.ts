/**
 * AI Chat & Recommendation Types
 * Ref: API Endpoints provided by backend
 */

export type AIChatRole = 'user' | 'model';

export interface AIChatPart {
  text: string;
}

export interface AIChatHistoryItem {
  _id?: string;
  role: AIChatRole;
  parts: AIChatPart[];
  createdAt?: string;
}

/**
 * Client UI Message Model
 */
export interface AIChatMessageUI {
  id: string;
  role: AIChatRole;
  text: string;
  createdAt: string;
  status?: 'sending' | 'sent' | 'error';
  isItinerary?: boolean;
}

/**
 * Payload to send a chat message (POST /api/ai/chat)
 */
export interface SendChatPayload {
  message: string;
  history?: Array<{
    role: AIChatRole;
    parts: Array<{ text: string }>;
  }>;
}

export interface SendChatResponse {
  reply: string;
  success?: boolean;
  message?: string;
}

/**
 * AI Suggest Place in Schedule
 */
export interface AISuggestPlace {
  placeType: 'Hotel' | 'Attraction' | 'Restaurant' | 'Cafe' | string;
  placeId: string;
  order: number;
  note?: string;
  timeSlot?: string;
  name?: string;
  price?: number;
  address?: string;
  image?: string;
}

export interface AISuggestDay {
  day: number;
  places: AISuggestPlace[];
}

export interface AISuggestCity {
  _id: string;
  name: string;
  image?: string;
}

/**
 * Response for POST /api/ai/suggest
 */
export interface AISuggestResponse {
  success: boolean;
  city: AISuggestCity;
  suggestedTitle: string;
  estimatedTotalCost: number;
  schedule: AISuggestDay[];
}

/**
 * Request payload for POST /api/ai/suggest
 */
export interface AISuggestPayload {
  cityId?: string;
  startDate?: string;
  endDate?: string;
  budget?: string;
  preferences?: string;
  notes?: string;
  isParse?: boolean;
}

/**
 * Payload for POST /api/ai/optimize/{tripId}
 */
export interface AIOptimizePayload {
  notes?: string;
  preview?: boolean;
  optimizedSchedule?: any[];
}

