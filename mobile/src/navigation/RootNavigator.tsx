import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { SCREEN_NAMES } from '@constants/screenNames';
import { AuthNavigator } from './AuthNavigator';
import { MainTabNavigator } from './MainTabNavigator';
import { EditProfileScreen } from '@screens/Profile/EditProfileScreen';
import { SettingsScreen } from '@screens/Profile/SettingsScreen';
import { FilterScreen } from '@screens/Home/FilterScreen';
import { SelectActivitiesScreen } from '@screens/Home/SelectActivitiesScreen';
import { PlaceDetailScreen } from '@screens/Place/PlaceDetailScreen';
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
            name={SCREEN_NAMES.MAIN_TAB as 'MainTabNavigator'}
            component={MainTabNavigator}
          />
          <Stack.Screen
            name={SCREEN_NAMES.EDIT_PROFILE as 'EditProfileScreen'}
            component={EditProfileScreen}
          />
          <Stack.Screen
            name={SCREEN_NAMES.SETTINGS as 'SettingsScreen'}
            component={SettingsScreen}
          />
          <Stack.Screen
            name={SCREEN_NAMES.FILTER as 'FilterScreen'}
            component={FilterScreen}
            options={{ animation: 'slide_from_bottom' }}
          />
          <Stack.Screen
            name={SCREEN_NAMES.SELECT_ACTIVITIES as 'SelectActivitiesScreen'}
            component={SelectActivitiesScreen}
          />
          <Stack.Screen
            name={SCREEN_NAMES.PLACE_DETAIL as 'PlaceDetailScreen'}
            component={PlaceDetailScreen}
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
