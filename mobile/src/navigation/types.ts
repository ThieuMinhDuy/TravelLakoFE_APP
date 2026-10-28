import type { NavigatorScreenParams } from '@react-navigation/native';
import type { PlaceType } from '@appTypes';

/**
 * Authentication Stack Param List
 */
export type AuthStackParamList = {
  LoginScreen: undefined;
  RegisterScreen: undefined;
  VerifyOtpScreen: { email: string };
  ForgotPasswordScreen: undefined;
  ResetPasswordScreen: { email: string };
};

/**
 * Main Bottom Tab Param List
 */
export type MainTabParamList = {
  TabHome: undefined;
  TabExplore: undefined;
  TabAiPlanner: undefined;
  TabMyTrips: undefined;
  TabProfile: undefined;
};

/**
 * Trips Flow Param List
 */
export type TripStackParamList = {
  CreateTripScreen?: { cityId?: string };
  TripDetailScreen: { tripId: string };
  TripTimelineScreen: { tripId: string; dayIndex: number };
  CheckInScreen: { tripId: string; placeId: string; placeName: string; targetCoords: { lat: number; lng: number } };
  TripDiaryScreen: { tripId: string };
};

/**
 * Places Flow Param List
 */
export type PlaceStackParamList = {
  SearchPlacesScreen?: { query?: string; cityId?: string };
  PlaceDetailScreen: { placeId: string; type: PlaceType };
  CityDetailScreen: { cityId: string; cityName: string };
  WriteReviewScreen: { placeId: string; placeType: PlaceType; placeName: string };
};

/**
 * Root Stack Param List (Combines all flows)
 */
export type RootStackParamList = {
  RootAuth: NavigatorScreenParams<AuthStackParamList>;
  RootMain: NavigatorScreenParams<MainTabParamList>;
} & TripStackParamList & PlaceStackParamList;
