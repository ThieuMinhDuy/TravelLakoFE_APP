import type { NavigatorScreenParams } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { FilterState } from '@appTypes';

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
 * Main Bottom Tab Param List
 * 5 tabs: Home, Diary, AI Chat, Schedule, Profile
 */
export type MainTabParamList = {
  HomeTab: undefined;
  DiaryTab: undefined;
  AIChatTab: undefined;
  ScheduleTab: undefined;
  ProfileTab: undefined;
};

/**
 * Root Stack Param List (Phân hệ Auth, Main Tabs, Hồ sơ & Cài đặt)
 */
export type RootStackParamList = {
  RootAuth: NavigatorScreenParams<AuthStackParamList>;
  MainTabNavigator: NavigatorScreenParams<MainTabParamList> | undefined;
  ProfileScreen: undefined;
  EditProfileScreen: undefined;
  SettingsScreen: undefined;
  FilterScreen: {
    currentFilters?: FilterState;
    onApply?: (filters: FilterState) => void;
  } | undefined;
  SelectActivitiesScreen: {
    selectedActivities?: string[];
    onSelect?: (activities: string[]) => void;
  } | undefined;
};

export type MainTabScreenProps<T extends keyof MainTabParamList> =
  BottomTabScreenProps<MainTabParamList, T>;

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;
