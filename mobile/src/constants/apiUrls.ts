/**
 * Centralized API URLs for TravelLako
 * Paths are relative to /api. Keep these aligned with the backend Swagger.
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
    CHANGE_PASSWORD: '/auth/change-password',
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
    MINE: '/reviews/me',
    BY_PLACE: (itemType: string, itemId: string) =>
      `/reviews/${itemType}/${itemId}`,
    DETAIL: (id: string) => `/reviews/${id}`,
  },

  // Favorites (/api/favorites)
  FAVORITES: {
    BASE: '/favorites',
    DETAIL: (id: string) => `/favorites/${id}`,
  },

  // Trips (/api/trips)
  TRIPS: {
    BASE: '/trips',
    DETAIL: (id: string) => `/trips/${id}`,
    ADD_PLACE: (id: string) => `/trips/${id}/schedule/places`,
    REMOVE_PLACE: (id: string, subId: string) =>
      `/trips/${id}/schedule/places/${subId}`,
    REORDER_SCHEDULE: (id: string) => `/trips/${id}/schedule/reorder`,
    CHECK_IN: (id: string, subId: string) =>
      `/trips/${id}/schedule/places/${subId}/check-in`,
    DIARY: (id: string) => `/trips/${id}/diary`,
  },

  // Gemini AI (/api/ai)
  AI: {
    CHAT: '/ai/chat',
    SUGGEST: '/ai/suggest', // Parsing an itinerary uses this same route with isParse in the body.
    OPTIMIZE_ROUTE: (tripId: string) => `/ai/optimize/${tripId}`,
  },
  UPLOAD: '/upload',
} as const;
