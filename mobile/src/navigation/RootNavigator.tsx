import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { SCREEN_NAMES } from '@constants/screenNames';
import { AuthNavigator } from './AuthNavigator';
import { ProfileScreen } from '@screens/Profile/ProfileScreen';
import { EditProfileScreen } from '@screens/Profile/EditProfileScreen';
import { SettingsScreen } from '@screens/Profile/SettingsScreen';
import { useAuthStore } from '@store/useAuthStore';
import { colors } from '@theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitialLoading = useAuthStore((state) => state.isInitialLoading);
  const initAuth = useAuthStore((state) => state.initAuth);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  if (isInitialLoading) {
    return (
      <View style={styles.splashContainer}>
        <ActivityIndicator size="large" color={colors.primary.main} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      {isAuthenticated ? (
        <>
          <Stack.Screen
            name={SCREEN_NAMES.PROFILE as 'ProfileScreen'}
            component={ProfileScreen}
          />
          <Stack.Screen
            name={SCREEN_NAMES.EDIT_PROFILE as 'EditProfileScreen'}
            component={EditProfileScreen}
          />
          <Stack.Screen
            name={SCREEN_NAMES.SETTINGS as 'SettingsScreen'}
            component={SettingsScreen}
          />
        </>
      ) : (
        <Stack.Screen
          name={SCREEN_NAMES.ROOT_AUTH as 'RootAuth'}
          component={AuthNavigator}
        />
      )}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: colors.background.app,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
