import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppText, AppIcon } from '@components/common';
import { shadows, fontFamilies } from '@theme';
import { IMAGES } from '@assets';
import { useAuthStore } from '@store/useAuthStore';
import { authService } from '@services';
import type { RootStackParamList } from '@navigation/types';

export interface HomeHeaderProps {
  onNotificationPress?: () => void;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({ onNotificationPress }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user, updateUser } = useAuthStore();
  const [avatarUri, setAvatarUri] = useState<string | null>(user?.avatar || null);
  const [userName, setUserName] = useState<string>(user?.name || 'SheftyDesign');

  // Lấy avatar và thông tin người dùng từ API /auth/profile
  useEffect(() => {
    let isMounted = true;
    const fetchUserProfile = async () => {
      try {
        const profile = await authService.getProfile();
        if (isMounted && profile) {
          if (profile.avatar) {
            setAvatarUri(profile.avatar);
          }
          if (profile.name) {
            setUserName(profile.name);
          }
          updateUser(profile);
        }
      } catch {
        // Giữ fallback từ store
      }
    };

    fetchUserProfile();
    return () => {
      isMounted = false;
    };
  }, [updateUser]);

  const handleSettingsPress = () => {
    try {
      navigation.navigate('SettingsScreen');
    } catch {
      navigation.navigate('ProfileScreen');
    }
  };

  return (
    <View style={styles.container}>
      {/* Left: User Greeting & Avatar */}
      <View style={styles.userInfoWrapper}>
        <View style={styles.avatarBorder}>
          <Image
            source={avatarUri ? { uri: avatarUri } : IMAGES.avatarDefault}
            style={styles.avatar}
            resizeMode="cover"
          />
        </View>
        <View style={styles.textWrapper}>
          <AppText style={styles.greetingText}>
            Hi, {userName}
          </AppText>
        </View>
      </View>

      {/* Right: Actions in exact Figma order: Settings first, then Bell with badge */}
      <View style={styles.actionsWrapper}>
        {/* Settings Button */}
        <TouchableOpacity
          style={styles.iconButton}
          activeOpacity={0.7}
          onPress={handleSettingsPress}
        >
          <AppIcon name="settings" size={17} color="#151111" />
        </TouchableOpacity>

        {/* Notification Button with Blue Badge */}
        <TouchableOpacity
          style={styles.iconButton}
          activeOpacity={0.7}
          onPress={onNotificationPress}
        >
          <AppIcon name="bell" size={17} color="#151111" />
          <View style={styles.notificationBadge}>
            <AppText style={styles.badgeText}>5</AppText>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 6,
  },
  userInfoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarBorder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    ...shadows.sm,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  textWrapper: {
    marginLeft: 12,
    justifyContent: 'center',
  },
  greetingText: {
    fontFamily: fontFamilies.sfProDisplay.semiBold,
    fontSize: 18,
    color: '#151111',
    lineHeight: 24,
  },
  actionsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...shadows.sm,
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 17,
    height: 17,
    borderRadius: 8.5,
    backgroundColor: '#005BBF', // Chuẩn Figma rgba(0, 91, 191, 1)
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    fontSize: 9,
    fontFamily: fontFamilies.sfProText.bold,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 11,
  },
});
