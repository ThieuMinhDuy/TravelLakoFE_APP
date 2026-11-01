/**
 * Centralized Screen Names
 * Eliminates magic strings in navigation.navigate(...)
 */

export const SCREEN_NAMES = {
  // Root Navigators
  ROOT_AUTH: 'RootAuth',

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
} as const;

export type ScreenNameValue = typeof SCREEN_NAMES[keyof typeof SCREEN_NAMES];
