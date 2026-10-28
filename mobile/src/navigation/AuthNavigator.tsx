import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './types';
import { SCREEN_NAMES } from '@constants/screenNames';
import { LoginScreen } from '@screens/Auth/LoginScreen';
import { RegisterScreen } from '@screens/Auth/RegisterScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name={SCREEN_NAMES.LOGIN as 'LoginScreen'}
        component={LoginScreen}
      />
      <Stack.Screen
        name={SCREEN_NAMES.REGISTER as 'RegisterScreen'}
        component={RegisterScreen}
      />
    </Stack.Navigator>
  );
};

