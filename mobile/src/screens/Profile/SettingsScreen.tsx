import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText, AppTextInput } from '@components/common';
import { colors, spacing, radius } from '@theme';
import { useAuthStore } from '@store/useAuthStore';
import { authService } from '@services/auth.service';
import { isStrongPassword } from '@utils/authValidation';
import { useAppNavigation } from '@hooks/useAppNavigation';

export const SettingsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useAppNavigation();
  const logout = useAuthStore(state => state.logout);

  const user = useAuthStore(state => state.user);
  const refreshProfile = useAuthStore(state => state.refreshProfile);
  const [currentPassword, setCurrentPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  // Change Password Modal State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPass, setIsChangingPass] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      Alert.alert(
        'Đăng xuất',
        'Không thể xóa phiên trên thiết bị. Vui lòng thử lại.',
      );
    }
  };

  const handleChangePassword = async () => {
    if (isChangingPass) return;
    if (user?.hasPassword !== false && !currentPassword) {
      setPasswordError('Nhập mật khẩu hiện tại.');
      return;
    }
    if (!isStrongPassword(newPassword)) {
      setPasswordError(
        'Mật khẩu cần ít nhất 6 ký tự, có chữ hoa, chữ thường và số.',
      );
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Mật khẩu xác nhận không khớp.');
      return;
    }
    try {
      setIsChangingPass(true);
      setPasswordError('');
      await authService.changePassword({
        currentPassword:
          user?.hasPassword === false ? undefined : currentPassword,
        newPassword,
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordModal(false);
      Alert.alert('Thành công', 'Mật khẩu đã được cập nhật.');
      await refreshProfile().catch(() => undefined);
    } catch (error) {
      setPasswordError((error as Error).message || 'Không thể đổi mật khẩu.');
    } finally {
      setIsChangingPass(false);
    }
  };

  return (
    <View
      style={[
        styles.root,
        {
          paddingTop: Math.max(insets.top, 12),
          paddingBottom: Math.max(insets.bottom, 16),
        },
      ]}
    >
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
          <AppText
            variant="captionMedium"
            color="muted"
            style={styles.sectionHeader}
          >
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
                  {user?.hasPassword === false
                    ? 'Tạo mật khẩu'
                    : 'Đổi mật khẩu'}
                </AppText>
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

      {/* Change Password Modal */}
      <Modal
        visible={showPasswordModal}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (!isChangingPass) setShowPasswordModal(false);
        }}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView keyboardShouldPersistTaps="handled">
            <View style={styles.modalContent}>
              <AppText variant="h2" color="main" style={styles.modalTitle}>
                Đổi mật khẩu mới
              </AppText>
              <AppText
                variant="caption"
                color="sub"
                style={styles.modalSubtitle}
              >
                Mật khẩu cần ít nhất 6 ký tự, có chữ hoa, chữ thường và số.
              </AppText>

              {user?.hasPassword !== false && (
                <AppTextInput
                  label="Mật khẩu hiện tại"
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  isPassword
                  editable={!isChangingPass}
                />
              )}
              {passwordError ? (
                <AppText color="danger">{passwordError}</AppText>
              ) : null}
              <AppTextInput
                label="Mật khẩu mới"
                placeholder="Nhập ít nhất 6 ký tự"
                value={newPassword}
                onChangeText={setNewPassword}
                isPassword
                editable={!isChangingPass}
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
                  disabled={isChangingPass}
                  onPress={() => {
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                    setPasswordError('');
                    setShowPasswordModal(false);
                  }}
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
          </ScrollView>
        </KeyboardAvoidingView>
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
    backgroundColor: 'transparent',
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
    borderRadius: 0,
    padding: spacing.md,
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
    borderColor: 'transparent',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  logoutButtonText: {
    color: colors.primary.main,
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
