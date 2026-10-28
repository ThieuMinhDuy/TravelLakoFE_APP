import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  ScreenWrapper,
  AppHeader,
  AppText,
  AppButton,
  AppCard,
  AppBadge,
} from '@components/common';
import { colors, spacing } from '@theme';
import { useAuthStore } from '@store/useAuthStore';

export const ProfileScreen: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <ScreenWrapper
      scrollable
      header={<AppHeader title="Hồ sơ Cá nhân" />}
      footer={
        <AppButton
          title="Đăng xuất"
          onPress={logout}
          variant="outline"
          size="md"
        />
      }
    >
      <AppCard style={styles.userCard}>
        <View style={styles.avatarCircle}>
          <AppText variant="h1" color="primary">
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </AppText>
        </View>

        <AppText variant="h2" color="main" style={styles.userName}>
          {user?.name || 'Tài khoản Khách'}
        </AppText>

        <AppText variant="body" color="sub" style={styles.userEmail}>
          {user?.email || 'guest@travellako.vn'}
        </AppText>

        <AppBadge
          label={user?.isVerified ? 'Đã xác thực OTP' : 'Chưa xác thực'}
          variant={user?.isVerified ? 'teal' : 'sand'}
          size="sm"
          style={styles.verifiedBadge}
        />
      </AppCard>

      <View style={styles.menuSection}>
        <AppCard style={styles.menuItem}>
          <AppText variant="bodyBold" color="main">
            Sở thích du lịch (AI Personalization)
          </AppText>
          <AppText variant="caption" color="sub">
            Cài đặt loại hình du lịch và ngân sách mong muốn
          </AppText>
        </AppCard>

        <AppCard style={styles.menuItem}>
          <AppText variant="bodyBold" color="main">
            Địa điểm đã lưu (Favorites)
          </AppText>
          <AppText variant="caption" color="sub">
            Xem lại các điểm du lịch bạn đã thả tim
          </AppText>
        </AppCard>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  userCard: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    marginBottom: spacing.lg,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary.soft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  userName: {
    marginBottom: spacing.xxs,
  },
  userEmail: {
    marginBottom: spacing.sm,
  },
  verifiedBadge: {
    marginTop: spacing.xs,
  },
  menuSection: {
    gap: spacing.md,
  },
  menuItem: {
    padding: spacing.md,
  },
});

