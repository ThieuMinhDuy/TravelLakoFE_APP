/**
 * Centralized Storage Keys
 * Used for MMKV / AsyncStorage key-value persistence
 */

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'travellako_auth_token',
  USER_DATA: 'travellako_user_data',
  SAVED_CREDENTIALS: 'travellako_saved_credentials',
  APP_SETTINGS: 'travellako_app_settings',
  RECENT_SEARCHES: 'travellako_recent_searches',
  HAS_SEEN_ONBOARDING: 'travellako_has_seen_onboarding',
} as const;

