/**
 * Centralized Query Keys for TanStack React Query
 * Prevents key collision and enables predictable cache invalidation
 */

export const QUERY_KEYS = {
  // Cities
  CITIES_LIST: 'cities_list',
  CITY_DETAIL: (id: string) => ['city_detail', id],

  // Places
  PLACES_SEARCH: (query: string, cityId?: string) => ['places_search', query, cityId],
  PLACES_BY_TYPE: (type: string, cityId?: string) => ['places_by_type', type, cityId],
  PLACE_DETAIL: (type: string, id: string) => ['place_detail', type, id],

  // Trips
  USER_TRIPS: 'user_trips',
  TRIP_DETAIL: (id: string) => ['trip_detail', id],

  // User & Profile
  USER_PROFILE: 'user_profile',
  USER_FAVORITES: 'user_favorites',

  // Reviews
  PLACE_REVIEWS: (placeId: string) => ['place_reviews', placeId],

  // AI Chat History
  AI_CHAT_HISTORY: 'ai_chat_history',
} as const;

