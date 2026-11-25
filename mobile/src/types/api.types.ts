/**
 * Generic API Types & DTO Wrappers
 */

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}

/**
 * Shared Geographic & Destination Primitives
 */
export interface Coordinates {
  lat: number;
  lng: number;
}

export type PlaceType = 'attraction' | 'hotel' | 'restaurant' | 'cafe';
