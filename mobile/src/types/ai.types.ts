import type { DaySchedule } from './trip.types';

/**
 * AI Assistant Models (Gemini Integration)
 */

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedPlaces?: {
    name: string;
    price?: number;
    type?: string;
  }[];
  generatedItinerary?: DaySchedule[];
}

export interface AIChatPayload {
  message: string;
  cityId?: string;
  conversationHistory?: {
    role: 'user' | 'model';
    parts: string;
  }[];
}

export interface GeneratePlanPayload {
  cityId: string;
  days: number;
  budgetPreference: 'Tiết kiệm' | 'Trung bình' | 'Cao cấp';
  interests: string[];
}
