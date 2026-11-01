import type { NavigatorScreenParams } from '@react-navigation/native';

/**
 * Authentication Stack Param List
 */
export type AuthStackParamList = {
  OnboardingScreen: undefined;
  LoginScreen: undefined;
  RegisterScreen: undefined;
  VerifyOtpScreen: { email: string };
  ForgotPasswordScreen: undefined;
  ResetPasswordScreen: { email: string };
};

/**
 * Root Stack Param List (Phân hệ Auth, Hồ sơ & Cài đặt)
 */
export type RootStackParamList = {
  RootAuth: NavigatorScreenParams<AuthStackParamList>;
  ProfileScreen: undefined;
  EditProfileScreen: undefined;
  SettingsScreen: undefined;
};
