import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText, AppBadge } from '@components/common';
import { colors, spacing, radius } from '@theme';
import { useAuthStore } from '@store/useAuthStore';
import { useAppNavigation } from '@hooks/useAppNavigation';
import { SCREEN_NAMES } from '@constants/screenNames';

export const ProfileScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useAppNavigation();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <View style={[styles.root, { paddingTop: Math.max(insets.top, 12), paddingBottom: Math.max(insets.bottom, 16) }]}>
      <StatusBar barStyle="dark-content" />

      {/* Top Header Bar */}
      <View style={styles.headerBar}>
        <AppText variant="h2" color="main" style={styles.headerTitle}>
          Hồ sơ cá nhân
        </AppText>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate(SCREEN_NAMES.SETTINGS as any)}
          style={styles.settingsButton}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <AppText style={styles.settingsIcon}>⚙️</AppText>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarCircle}>
              <AppText variant="h1" color="primary">
                {user?.name ? user.name[0].toUpperCase() : 'U'}
              </AppText>
            </View>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate(SCREEN_NAMES.EDIT_PROFILE as any)}
              style={styles.editBadge}
            >
              <AppText style={styles.editBadgeIcon}>✎</AppText>
            </TouchableOpacity>
          </View>

          <AppText variant="h2" color="main" style={styles.userName}>
            {user?.name || 'Tài khoản Khách'}
          </AppText>

          <AppText variant="body" color="sub" style={styles.userEmail}>
            {user?.email || 'guest@travellako.vn'}
          </AppText>

          <AppBadge
            label={user?.isVerified ? '✓ Đã xác thực OTP' : 'Chưa xác thực OTP'}
            variant={user?.isVerified ? 'teal' : 'sand'}
            size="sm"
            style={styles.verifiedBadge}
          />
        </View>

        {/* Section: Account Actions */}
        <View style={styles.section}>
          <AppText variant="captionMedium" color="muted" style={styles.sectionHeader}>
            TÀI KHOẢN
          </AppText>
          <View style={styles.cardGroup}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate(SCREEN_NAMES.EDIT_PROFILE as any)}
              style={styles.rowItem}
            >
              <View style={styles.rowLeft}>
                <AppText style={styles.rowIcon}>👤</AppText>
                <View>
                  <AppText variant="bodyMedium" color="main">
                    Chỉnh sửa thông tin cá nhân
                  </AppText>
                  <AppText variant="caption" color="sub">
                    Họ tên, số điện thoại, ngày sinh
                  </AppText>
                </View>
              </View>
              <AppText variant="h3" color="muted">
                ›
              </AppText>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate(SCREEN_NAMES.SETTINGS as any)}
              style={styles.rowItem}
            >
              <View style={styles.rowLeft}>
                <AppText style={styles.rowIcon}>⚙️</AppText>
                <View>
                  <AppText variant="bodyMedium" color="main">
                    Cài đặt ứng dụng & Bảo mật
                  </AppText>
                  <AppText variant="caption" color="sub">
                    Đổi mật khẩu, thông báo, ngôn ngữ
                  </AppText>
                </View>
              </View>
              <AppText variant="h3" color="muted">
                ›
              </AppText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleLogout}
          style={styles.logoutButton}
        >
          <AppText variant="button" style={styles.logoutButtonText}>
            Đăng xuất
          </AppText>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background.app,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    backgroundColor: colors.background.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.subtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsIcon: {
    fontSize: 18,
  },
  scrollContent: {
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  profileCard: {
    backgroundColor: colors.background.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing.sm,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary.soft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.primary.border,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.background.surface,
  },
  editBadgeIcon: {
    color: colors.text.inverse,
    fontSize: 14,
    fontWeight: '700',
    marginTop: -2,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  userEmail: {
    marginBottom: spacing.sm,
  },
  verifiedBadge: {
    marginTop: spacing.xxs,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.8,
    marginBottom: spacing.xs,
    marginLeft: spacing.xs,
  },
  cardGroup: {
    backgroundColor: colors.background.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    overflow: 'hidden',
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  rowIcon: {
    fontSize: 22,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border.subtle,
    marginLeft: 54,
  },
  logoutButton: {
    height: 52,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: '#FCA5A5',
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  logoutButtonText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: '700',
  },
});
