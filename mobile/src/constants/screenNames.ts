/**
 * Centralized Screen Names
 * Eliminates magic strings in navigation.navigate(...)
 */

export const SCREEN_NAMES = {
  // Root Navigators
  ROOT_AUTH: 'RootAuth',
  ROOT_MAIN: 'RootMain',

  // Auth Flow
  LOGIN: 'LoginScreen',
  REGISTER: 'RegisterScreen',
  VERIFY_OTP: 'VerifyOtpScreen',
  FORGOT_PASSWORD: 'ForgotPasswordScreen',
  RESET_PASSWORD: 'ResetPasswordScreen',

  // Main Bottom Tabs
  TAB_HOME: 'TabHome',
  TAB_EXPLORE: 'TabExplore',
  TAB_AI_PLANNER: 'TabAiPlanner',
  TAB_MY_TRIPS: 'TabMyTrips',
  TAB_PROFILE: 'TabProfile',

  // Places & Explore Flow
  SEARCH_PLACES: 'SearchPlacesScreen',
  PLACE_DETAIL: 'PlaceDetailScreen',
  CITY_DETAIL: 'CityDetailScreen',
  WRITE_REVIEW: 'WriteReviewScreen',

  // Trips Flow
  CREATE_TRIP: 'CreateTripScreen',
  TRIP_DETAIL: 'TripDetailScreen',
  TRIP_TIMELINE: 'TripTimelineScreen',
  CHECK_IN: 'CheckInScreen',
  TRIP_DIARY: 'TripDiaryScreen',

  // Profile Flow
  EDIT_PROFILE: 'EditProfileScreen',
  TRAVEL_PREFERENCES: 'TravelPreferencesScreen',
  FAVORITES: 'FavoritesScreen',
} as const;

export type ScreenNameValue = typeof SCREEN_NAMES[keyof typeof SCREEN_NAMES];

