import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Switch,
  Alert,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText, AppTextInput } from '@components/common';
import { colors, spacing, radius } from '@theme';
import { useAuthStore } from '@store/useAuthStore';
import { authService } from '@services/auth.service';
import { useAppNavigation } from '@hooks/useAppNavigation';

export const SettingsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useAppNavigation();
  const logout = useAuthStore((state) => state.logout);

  // Switch toggles
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailPromoEnabled, setEmailPromoEnabled] = useState(false);

  // Change Password Modal State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPass, setIsChangingPass] = useState(false);

  const handleLogout = async () => { await logout(); };

  return (
    <View style={[styles.root, { paddingTop: Math.max(insets.top, 12), paddingBottom: Math.max(insets.bottom, 16) }]}>
      <StatusBar barStyle="dark-content" />

      {/* Top Header Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <AppText style={styles.backArrow}>‹</AppText>
        </TouchableOpacity>
        <AppText variant="h2" color="main" style={styles.headerTitle}>
          Cài đặt
        </AppText>
        <View style={styles.headerRightSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Section 1: Security & Password */}
        <View style={styles.section}>
          <AppText variant="captionMedium" color="muted" style={styles.sectionHeader}>
            BẢO MẬT & TÀI KHOẢN
          </AppText>
          <View style={styles.cardGroup}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setShowPasswordModal(true)}
              style={styles.rowItem}
            >
              <View style={styles.rowLeft}>
                <AppText style={styles.rowIcon}>🔒</AppText>
                <AppText variant="bodyMedium" color="main">
                  Đổi mật khẩu
                </AppText>
              </View>
              <AppText variant="h3" color="muted">
                ›
              </AppText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Section 2: Notifications */}
        <View style={styles.section}>
          <AppText variant="captionMedium" color="muted" style={styles.sectionHeader}>
            THÔNG BÁO
          </AppText>
          <View style={styles.cardGroup}>
            <View style={styles.rowItem}>
              <View style={styles.rowLeft}>
                <AppText style={styles.rowIcon}>🔔</AppText>
                <View>
                  <AppText variant="bodyMedium" color="main">
                    Thông báo đẩy
                  </AppText>
                  <AppText variant="caption" color="sub">
                    Nhắc nhở lịch trình & điểm đến
                  </AppText>
                </View>
              </View>
              <Switch
                value={pushEnabled}
                onValueChange={setPushEnabled}
                trackColor={{ false: colors.border.subtle, true: colors.primary.main }}
                thumbColor={colors.background.surface}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.rowItem}>
              <View style={styles.rowLeft}>
                <AppText style={styles.rowIcon}>✉️</AppText>
                <View>
                  <AppText variant="bodyMedium" color="main">
                    Email khuyến mãi
                  </AppText>
                  <AppText variant="caption" color="sub">
                    Ưu đãi khách sạn & điểm tham quan
                  </AppText>
                </View>
              </View>
              <Switch
                value={emailPromoEnabled}
                onValueChange={setEmailPromoEnabled}
                trackColor={{ false: colors.border.subtle, true: colors.primary.main }}
                thumbColor={colors.background.surface}
              />
            </View>
          </View>
        </View>

        {/* Section 3: Preferences */}
        <View style={styles.section}>
          <AppText variant="captionMedium" color="muted" style={styles.sectionHeader}>
            TUỲ CHỌN HỆ THỐNG
          </AppText>
          <View style={styles.cardGroup}>
            <View style={styles.rowItem}>
              <View style={styles.rowLeft}>
                <AppText style={styles.rowIcon}>🌐</AppText>
                <AppText variant="bodyMedium" color="main">
                  Ngôn ngữ
                </AppText>
              </View>
              <AppText variant="body" color="sub">
                Tiếng Việt (VN)
              </AppText>
            </View>

            <View style={styles.divider} />

            <View style={styles.rowItem}>
              <View style={styles.rowLeft}>
                <AppText style={styles.rowIcon}>💵</AppText>
                <AppText variant="bodyMedium" color="main">
                  Đơn vị tiền tệ
                </AppText>
              </View>
              <AppText variant="body" color="sub">
                VNĐ (₫)
              </AppText>
            </View>
          </View>
        </View>

        {/* Section 4: App Information */}
        <View style={styles.section}>
          <AppText variant="captionMedium" color="muted" style={styles.sectionHeader}>
            VỀ ỨNG DỤNG
          </AppText>
          <View style={styles.cardGroup}>
            <View style={styles.rowItem}>
              <View style={styles.rowLeft}>
                <AppText style={styles.rowIcon}>ℹ️</AppText>
                <AppText variant="bodyMedium" color="main">
                  Phiên bản
                </AppText>
              </View>
              <AppText variant="body" color="sub">
                TravelLako v1.0.0
              </AppText>
            </View>
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

      {/* Change Password Modal */}
      <Modal
        visible={showPasswordModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPasswordModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <AppText variant="h2" color="main" style={styles.modalTitle}>
              Đổi mật khẩu mới
            </AppText>
            <AppText variant="caption" color="sub" style={styles.modalSubtitle}>
              Mật khẩu phải có tối thiểu 6 ký tự để đảm bảo an toàn.
            </AppText>

            <AppTextInput
              label="Mật khẩu mới"
              placeholder="Nhập ít nhất 6 ký tự"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              containerStyle={styles.modalInput}
            />

            <AppTextInput
              label="Xác nhận mật khẩu"
              placeholder="Nhập lại mật khẩu mới"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              containerStyle={styles.modalInput}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setShowPasswordModal(false)}
                style={styles.modalCancelButton}
              >
                <AppText variant="button" color="sub">
                  Hủy
                </AppText>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleChangePassword}
                disabled={isChangingPass}
                style={styles.modalSaveButton}
              >
                <AppText variant="button" style={styles.modalSaveText}>
                  {isChangingPass ? 'Đang lưu...' : 'Xác nhận'}
                </AppText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.background.subtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 28,
    lineHeight: 30,
    color: colors.text.main,
    marginTop: -2,
    marginLeft: -2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  headerRightSpacer: {
    width: 44,
  },
  scrollContent: {
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
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
    fontSize: 20,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border.subtle,
    marginLeft: 52,
  },
  logoutButton: {
    height: 52,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: '#FCA5A5',
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  logoutButtonText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  modalContent: {
    backgroundColor: colors.background.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: spacing.xxs,
  },
  modalSubtitle: {
    marginBottom: spacing.lg,
  },
  modalInput: {
    marginBottom: spacing.md,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  modalCancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: radius.full,
  },
  modalSaveButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: radius.full,
    backgroundColor: colors.primary.main,
  },
  modalSaveText: {
    color: colors.text.inverse,
    fontWeight: '700',
  },
});


