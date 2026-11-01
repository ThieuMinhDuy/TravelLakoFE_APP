import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './types';
import { SCREEN_NAMES } from '@constants/screenNames';
import { OnboardingScreen } from '@screens/Auth/OnboardingScreen';
import { LoginScreen } from '@screens/Auth/LoginScreen';
import { RegisterScreen } from '@screens/Auth/RegisterScreen';
import { VerifyOtpScreen } from '@screens/Auth/VerifyOtpScreen';
import { ForgotPasswordScreen } from '@screens/Auth/ForgotPasswordScreen';
import { ResetPasswordScreen } from '@screens/Auth/ResetPasswordScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName={SCREEN_NAMES.ONBOARDING as 'OnboardingScreen'}
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name={SCREEN_NAMES.ONBOARDING as 'OnboardingScreen'}
        component={OnboardingScreen}
      />
      <Stack.Screen
        name={SCREEN_NAMES.LOGIN as 'LoginScreen'}
        component={LoginScreen}
      />
      <Stack.Screen
        name={SCREEN_NAMES.REGISTER as 'RegisterScreen'}
        component={RegisterScreen}
      />
      <Stack.Screen
        name={SCREEN_NAMES.VERIFY_OTP as 'VerifyOtpScreen'}
        component={VerifyOtpScreen as any}
      />
      <Stack.Screen
        name={SCREEN_NAMES.FORGOT_PASSWORD as 'ForgotPasswordScreen'}
        component={ForgotPasswordScreen}
      />
      <Stack.Screen
        name={SCREEN_NAMES.RESET_PASSWORD as 'ResetPasswordScreen'}
        component={ResetPasswordScreen as any}
      />
    </Stack.Navigator>
  );
};
