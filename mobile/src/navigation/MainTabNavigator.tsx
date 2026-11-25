import React, { useRef, useEffect } from 'react';
import { StyleSheet, Platform, Pressable, Animated, Easing, View } from 'react-native';
import {
  createBottomTabNavigator,
  BottomTabBarButtonProps,
} from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Stop, Circle, Ellipse } from 'react-native-svg';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faClaude } from '@fortawesome/free-brands-svg-icons';
import { SCREEN_NAMES } from '@constants/screenNames';
import { MainTabParamList } from './types';
import { colors, fontFamilies } from '@theme';
import { AppIcon } from '@components/common';

// Màn hình Base Tabs
import { HomeScreen } from '@screens/Home/HomeScreen';
import { DiaryScreen } from '@screens/Diary/DiaryScreen';
import { AIChatScreen } from '@screens/AIChat/AIChatScreen';
import { ScheduleScreen } from '@screens/Schedule/ScheduleScreen';
import { ProfileScreen } from '@screens/Profile/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

const ACTIVE_COLOR = colors.primary.light; // #0284C7
const INACTIVE_COLOR = colors.text.muted;  // #94A3B8

interface TabIconProps {
  focused: boolean;
  color: string;
  size: number;
}

const renderHomeIcon = ({ focused, color, size }: TabIconProps) => (
  <AppIcon
    name="home"
    size={size || 22}
    color={focused ? ACTIVE_COLOR : color}
  />
);

const renderDiaryIcon = ({ focused, color, size }: TabIconProps) => (
  <AppIcon
    name="diary"
    size={size || 22}
    color={focused ? ACTIVE_COLOR : color}
    badge={false}
  />
);

const renderScheduleIcon = ({ focused, color, size }: TabIconProps) => (
  <AppIcon
    name="schedule"
    size={size || 22}
    color={focused ? ACTIVE_COLOR : color}
  />
);

const renderProfileIcon = ({ focused, color, size }: TabIconProps) => (
  <AppIcon
    name="profile"
    size={size || 22}
    color={focused ? ACTIVE_COLOR : color}
  />
);

/**
 * Tab Bar Button chuẩn cho 4 tab xung quanh: không rung lắc, không đổi opacity
 */
const StandardTabBarButton: React.FC<BottomTabBarButtonProps> = (props) => (
  <Pressable
    {...props}
    android_ripple={{ color: 'transparent' }}
    style={({ pressed }) => [
      props.style,
      styles.tabButton,
      pressed && styles.noOpacityChange,
    ]}
  >
    {props.children}
  </Pressable>
);


const AIChatLiquidButton: React.FC<BottomTabBarButtonProps> = (props) => {
  const jumpAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const isFocused = !!props.accessibilityState?.selected;

  const triggerBounce = () => {
    jumpAnim.setValue(0);
    scaleAnim.setValue(1);
    Animated.parallel([
      Animated.sequence([
        Animated.timing(jumpAnim, {
          toValue: -12,
          duration: 140,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(jumpAnim, {
          toValue: 0,
          friction: 3.5,
          tension: 120,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 140,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 3.5,
          tension: 120,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  const handlePress = (e: any) => {
    triggerBounce();
    props.onPress?.(e);
  };

  useEffect(() => {
    if (isFocused) {
      triggerBounce();
    }
  }, [isFocused]);

  return (
    <Pressable
      {...props}
      onPress={handlePress}
      android_ripple={{ color: 'transparent' }}
      style={[props.style, styles.liquidWrapper]}
    >
      <Animated.View
        collapsable={false}
        style={[
          styles.liquidContainer,
          {
            transform: [
              { translateY: jumpAnim },
              { scale: scaleAnim },
            ],
          },
        ]}
      >
        {/* Nền trong suốt kiểu glass kính mờ sạch sẽ (hoàn toàn không có màu xanh) */}
        <Svg
          width={54}
          height={54}
          viewBox="0 0 54 54"
          style={StyleSheet.absoluteFill}
        >
          <Defs>
            <LinearGradient
              id="clearGlassGrad"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <Stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.92} />
              <Stop offset="100%" stopColor="#FFFFFF" stopOpacity={0.72} />
            </LinearGradient>
            <LinearGradient
              id="glossHighlight"
              x1="50%"
              y1="0%"
              x2="50%"
              y2="100%"
            >
              <Stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.85} />
              <Stop offset="100%" stopColor="#FFFFFF" stopOpacity={0.0} />
            </LinearGradient>
          </Defs>

          <Circle
            cx="27"
            cy="27"
            r="26"
            fill="url(#clearGlassGrad)"
          />

          <Ellipse
            cx="27"
            cy="14"
            rx="16"
            ry="7"
            fill="url(#glossHighlight)"
          />
        </Svg>

        {/* Icon Claude Brands */}
        <FontAwesomeIcon
          icon={faClaude}
          size={25}
          color={isFocused ? ACTIVE_COLOR : colors.primary.main}
        />
      </Animated.View>
    </Pressable>
  );
};

export const MainTabNavigator: React.FC = () => {
  const insets = useSafeAreaInsets();

  const bottomInset = Math.max(insets.bottom, 6);
  const tabHeight = Platform.select({
    ios: 54 + bottomInset,
    android: 60 + bottomInset,
    default: 62,
  });

  return (
    <Tab.Navigator
      initialRouteName={SCREEN_NAMES.HOME_TAB as keyof MainTabParamList}
      screenOptions={{
        headerShown: false,
        animation: 'none',
        tabBarActiveTintColor: ACTIVE_COLOR,
        tabBarInactiveTintColor: INACTIVE_COLOR,
        tabBarButton: (props) => <StandardTabBarButton {...props} />,
        tabBarStyle: [
          styles.tabBar,
          {
            height: tabHeight,
            paddingBottom: bottomInset,
          },
        ],
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
      }}
    >
      {/* 1. HOME TAB */}
      <Tab.Screen
        name={SCREEN_NAMES.HOME_TAB as 'HomeTab'}
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: renderHomeIcon,
        }}
      />

      {/* 2. DIARY TAB */}
      <Tab.Screen
        name={SCREEN_NAMES.DIARY_TAB as 'DiaryTab'}
        component={DiaryScreen}
        options={{
          tabBarLabel: 'Diary',
          tabBarIcon: renderDiaryIcon,
        }}
      />

      {/* 3. AI CHAT TAB (Nút tròn trong suốt, icon chatbot, có hiệu ứng nảy) */}
      <Tab.Screen
        name={SCREEN_NAMES.AI_CHAT_TAB as 'AIChatTab'}
        component={AIChatScreen}
        options={{
          tabBarLabel: () => null,
          tabBarIcon: () => null,
          tabBarButton: (props) => <AIChatLiquidButton {...props} />,
        }}
      />

      {/* 4. SCHEDULE TAB */}
      <Tab.Screen
        name={SCREEN_NAMES.SCHEDULE_TAB as 'ScheduleTab'}
        component={ScheduleScreen}
        options={{
          tabBarLabel: 'Schedule',
          tabBarIcon: renderScheduleIcon,
        }}
      />

      {/* 5. PROFILE TAB */}
      <Tab.Screen
        name={SCREEN_NAMES.PROFILE_TAB as 'ProfileTab'}
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: renderProfileIcon,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.background.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border.subtle,
    paddingTop: 8,
    overflow: 'visible',
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noOpacityChange: {
    opacity: 1,
  },
  liquidWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
    zIndex: 10,
  },
  liquidContainer: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -22, // Nổi cao lên trên navbar giống ảnh
    borderWidth: 1.5,
    borderColor: 'rgba(226, 232, 240, 0.95)', // Viền kính thanh lịch cùng màu navbar
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.85)', // Nền trong suốt kiểu glass sạch sẽ, không màu xanh
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  tabBarItem: {
    paddingVertical: 2,
    overflow: 'visible',
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '500',
    fontFamily: fontFamilies.body.medium,
    marginTop: 3,
  },
});
