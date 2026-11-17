/**
 * Centralized API URLs for TravelLako
 * Maps 1-1 with docs/04_API_Reference.md and api.md
 * Lưu ý:
 * - Các endpoint AI có tiền tố '/api' ở đầu: '/api/ai/...'
 * - Các endpoint khác (trips, upload...) không có tiền tố '/api'
 */

export const API_URLS = {
  // Authentication (/auth)
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    VERIFY_OTP: '/auth/verify-otp',
    RESEND_OTP: '/auth/resend-otp',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    PROFILE: '/auth/profile',
  },

  // Cities (/cities)
  CITIES: {
    BASE: '/cities',
    DETAIL: (id: string) => `/cities/${id}`,
  },

  // Places (/places)
  PLACES: {
    GLOBAL_SEARCH: '/places/search',
    BY_TYPE: (type: string) => `/places/${type}`,
    DETAIL: (type: string, id: string) => `/places/${type}/${id}`,
  },

  // Reviews (/reviews)
  REVIEWS: {
    CREATE: '/reviews',
    BY_PLACE: (placeId: string) => `/reviews/place/${placeId}`,
  },

  // Favorites (/favorites)
  FAVORITES: {
    BASE: '/favorites',
    TOGGLE: (placeId: string) => `/favorites/${placeId}`,
  },

  // Trips (/trips)
  TRIPS: {
    BASE: '/trips',
    DETAIL: (id: string) => `/trips/${id}`,
    DELETE: (id: string) => `/trips/${id}`,
    ADD_PLACE: (id: string) => `/trips/${id}/schedule/places`,
    DELETE_PLACE: (tripId: string, subId: string) => `/trips/${tripId}/schedule/places/${subId}`,
    REORDER_SCHEDULE: (id: string) => `/trips/${id}/schedule/reorder`,
    CHECK_IN_PLACE: (tripId: string, subId: string) =>
      `/trips/${tripId}/schedule/places/${subId}/check-in`,
    DIARY: (id: string) => `/trips/${id}/diary`,
  },

  // Upload (/upload)
  UPLOAD: '/upload',

  // Gemini AI (/api/ai)
  AI: {
    CHAT: '/ai/chat',
    SUGGEST: '/ai/suggest',
    OPTIMIZE: (tripId: string) => `/ai/optimize/${tripId}`,
    GENERATE_PLAN: '/ai/generate-plan',
    PARSE_ITINERARY: '/ai/parse-itinerary',
    OPTIMIZE_ROUTE: '/ai/optimize-route',
  },
} as const;
