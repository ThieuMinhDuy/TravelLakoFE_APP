import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from './types';
import { SCREEN_NAMES } from '@constants/screenNames';
import { HomeScreen } from '@screens/Home/HomeScreen';
import { ExploreScreen } from '@screens/Explore/ExploreScreen';
import { AIChatScreen } from '@screens/AIChat/AIChatScreen';
import { MyTripsScreen } from '@screens/TripPlanner/MyTripsScreen';
import { ProfileScreen } from '@screens/Profile/ProfileScreen';
import { colors, typography } from '@theme';
import { AppText } from '@components/common';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary.main,
        tabBarInactiveTintColor: colors.text.muted,
        tabBarStyle: {
          backgroundColor: colors.background.surface,
          borderTopColor: colors.border.subtle,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          ...typography.tiny,
        },
      }}
    >
      <Tab.Screen
        name={SCREEN_NAMES.TAB_HOME as 'TabHome'}
        component={HomeScreen}
        options={{
          tabBarLabel: 'Trang chủ',
          tabBarIcon: ({ color }) => (
            <AppText variant="h3" style={{ color, lineHeight: 22 }}>
              ⌂
            </AppText>
          ),
        }}
      />
      <Tab.Screen
        name={SCREEN_NAMES.TAB_EXPLORE as 'TabExplore'}
        component={ExploreScreen}
        options={{
          tabBarLabel: 'Khám phá',
          tabBarIcon: ({ color }) => (
            <AppText variant="h3" style={{ color, lineHeight: 22 }}>
              ◎
            </AppText>
          ),
        }}
      />
      <Tab.Screen
        name={SCREEN_NAMES.TAB_AI_PLANNER as 'TabAiPlanner'}
        component={AIChatScreen}
        options={{
          tabBarLabel: 'AI Planner',
          tabBarIcon: ({ color }) => (
            <AppText variant="h3" style={{ color, lineHeight: 22 }}>
              ✦
            </AppText>
          ),
        }}
      />
      <Tab.Screen
        name={SCREEN_NAMES.TAB_MY_TRIPS as 'TabMyTrips'}
        component={MyTripsScreen}
        options={{
          tabBarLabel: 'Chuyến đi',
          tabBarIcon: ({ color }) => (
            <AppText variant="h3" style={{ color, lineHeight: 22 }}>
              ☖
            </AppText>
          ),
        }}
      />
      <Tab.Screen
        name={SCREEN_NAMES.TAB_PROFILE as 'TabProfile'}
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Cá nhân',
          tabBarIcon: ({ color }) => (
            <AppText variant="h3" style={{ color, lineHeight: 22 }}>
              ☺
            </AppText>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

