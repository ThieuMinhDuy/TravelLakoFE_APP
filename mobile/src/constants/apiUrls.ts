/**
 * Centralized API URLs for TravelLako
 * Maps 1-1 with docs/04_API_Reference.md
 */

export const API_URLS = {
  // Authentication (/api/auth)
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

  // Cities (/api/cities)
  CITIES: {
    BASE: '/cities',
    DETAIL: (id: string) => `/cities/${id}`,
  },

  // Places (/api/places)
  PLACES: {
    GLOBAL_SEARCH: '/places/search',
    BY_TYPE: (type: string) => `/places/${type}`,
    DETAIL: (type: string, id: string) => `/places/${type}/${id}`,
  },

  // Reviews (/api/reviews)
  REVIEWS: {
    CREATE: '/reviews',
    BY_PLACE: (placeId: string) => `/reviews/place/${placeId}`,
  },

  // Favorites (/api/favorites)
  FAVORITES: {
    BASE: '/favorites',
    TOGGLE: (placeId: string) => `/favorites/${placeId}`,
  },

  // Trips (/api/trips)
  TRIPS: {
    BASE: '/trips',
    DETAIL: (id: string) => `/trips/${id}`,
    UPDATE_SCHEDULE: (id: string) => `/trips/${id}/schedule`,
    REORDER_SCHEDULE: (id: string) => `/trips/${id}/schedule/reorder`,
    CHECK_IN: (id: string) => `/trips/${id}/checkin`,
    DIARY: (id: string) => `/trips/${id}/diary`,
  },

  // Gemini AI (/api/ai)
  AI: {
    CHAT: '/ai/chat',
    GENERATE_PLAN: '/ai/generate-plan',
    PARSE_ITINERARY: '/ai/parse-itinerary',
    OPTIMIZE_ROUTE: '/ai/optimize-route',
  },
} as const;

