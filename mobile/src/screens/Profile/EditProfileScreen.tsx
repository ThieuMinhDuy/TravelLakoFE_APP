import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText, AppTextInput } from '@components/common';
import { colors, spacing, radius } from '@theme';
import { useAuthStore } from '@store/useAuthStore';
import { authService } from '@services/auth.service';
import { useAppNavigation } from '@hooks/useAppNavigation';

export const EditProfileScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useAppNavigation();
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [gender, setGender] = useState<'Nam' | 'Nữ' | 'Khác' | ''>(user?.gender || '');
  const [dateOfBirth, setDateOfBirth] = useState(user?.dateOfBirth || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Lỗi', 'Họ và tên không được để trống.');
      return;
    }

    try {
      setIsSubmitting(true);
      const updated = await authService.updateProfile({
        name: name.trim(),
        phone: phone.trim(),
        gender,
        dateOfBirth: dateOfBirth.trim() || undefined,
      });

      await updateUser(updated);
      Alert.alert('Thành công', 'Thông tin cá nhân đã được cập nhật!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      Alert.alert('Lỗi cập nhật', error?.message || 'Không thể cập nhật hồ sơ lúc này.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
          Chỉnh sửa hồ sơ
        </AppText>
        <View style={styles.headerRightSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar Preview */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarCircle}>
            <AppText variant="h1" color="primary">
              {name ? name[0].toUpperCase() : 'U'}
            </AppText>
          </View>
          <AppText variant="caption" color="sub" style={styles.avatarHint}>
            Ảnh đại diện hiển thị theo tài khoản
          </AppText>
        </View>

        {/* Form Inputs */}
        <View style={styles.formSection}>
          <AppTextInput
            label="Họ và tên"
            placeholder="Nhập họ và tên đầy đủ"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

          <AppTextInput
            label="Địa chỉ Email"
            placeholder="email@example.com"
            value={user?.email || ''}
            editable={false}
            helperText="Email là định danh tài khoản và không thể thay đổi."
          />

          <AppTextInput
            label="Số điện thoại"
            placeholder="0987 654 321"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <AppTextInput
            label="Ngày sinh (YYYY-MM-DD)"
            placeholder="2000-01-01"
            value={dateOfBirth}
            onChangeText={setDateOfBirth}
          />

          {/* Gender Selector Chips */}
          <View style={styles.genderContainer}>
            <AppText variant="captionMedium" color="sub" style={styles.genderLabel}>
              Giới tính
            </AppText>
            <View style={styles.genderChipsRow}>
              {(['Nam', 'Nữ', 'Khác'] as const).map((g) => {
                const isSelected = gender === g;
                return (
                  <TouchableOpacity
                    key={g}
                    activeOpacity={0.8}
                    onPress={() => setGender(g)}
                    style={[
                      styles.genderChip,
                      isSelected && styles.genderChipActive,
                    ]}
                  >
                    <AppText
                      variant="bodyMedium"
                      style={[
                        styles.genderChipText,
                        isSelected && styles.genderChipTextActive,
                      ]}
                    >
                      {g}
                    </AppText>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleSave}
          disabled={isSubmitting}
          style={[styles.saveButton, isSubmitting && styles.saveButtonDisabled]}
        >
          {isSubmitting ? (
            <ActivityIndicator color={colors.text.inverse} size="small" />
          ) : (
            <AppText variant="button" style={styles.saveButtonText}>
              Lưu thay đổi
            </AppText>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background.surface,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
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
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  avatarSection: {
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  avatarCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.primary.soft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.primary.border,
    marginBottom: spacing.xs,
  },
  avatarHint: {
    marginTop: spacing.xxs,
  },
  formSection: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  genderContainer: {
    marginTop: spacing.xs,
  },
  genderLabel: {
    marginBottom: spacing.xs,
  },
  genderChipsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  genderChip: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: radius.full,
    borderWidth: 1.2,
    borderColor: colors.border.subtle,
    backgroundColor: colors.background.subtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  genderChipActive: {
    borderColor: colors.primary.main,
    backgroundColor: colors.primary.soft,
  },
  genderChipText: {
    color: colors.text.sub,
    fontWeight: '500',
  },
  genderChipTextActive: {
    color: colors.primary.main,
    fontWeight: '700',
  },
  saveButton: {
    height: 52,
    borderRadius: radius.full,
    backgroundColor: colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: colors.text.inverse,
    fontSize: 16,
    fontWeight: '700',
  },
});

