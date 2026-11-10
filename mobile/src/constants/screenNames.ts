/**
 * Centralized Screen Names
 * Eliminates magic strings in navigation.navigate(...)
 */

export const SCREEN_NAMES = {
  // Root Navigators
  ROOT_AUTH: 'RootAuth',
  MAIN_TAB: 'MainTabNavigator',

  // Bottom Tabs
  HOME_TAB: 'HomeTab',
  DIARY_TAB: 'DiaryTab',
  AI_CHAT_TAB: 'AIChatTab',
  SCHEDULE_TAB: 'ScheduleTab',
  PROFILE_TAB: 'ProfileTab',

  // Auth Flow
  ONBOARDING: 'OnboardingScreen',
  LOGIN: 'LoginScreen',
  REGISTER: 'RegisterScreen',
  VERIFY_OTP: 'VerifyOtpScreen',
  FORGOT_PASSWORD: 'ForgotPasswordScreen',
  RESET_PASSWORD: 'ResetPasswordScreen',

  // Profile / Account Flow
  PROFILE: 'ProfileScreen',
  EDIT_PROFILE: 'EditProfileScreen',
  SETTINGS: 'SettingsScreen',

  // Home / Discovery Flow
  FILTER: 'FilterScreen',
  SELECT_ACTIVITIES: 'SelectActivitiesScreen',
  PLACE_DETAIL: 'PlaceDetailScreen',
} as const;

export type ScreenNameValue = typeof SCREEN_NAMES[keyof typeof SCREEN_NAMES];
