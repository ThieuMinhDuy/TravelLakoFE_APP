import React, { useState } from 'react';
import {
  View,
  Image,
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
import { launchImageLibrary } from 'react-native-image-picker';
import { isBirthDate } from '@utils/authValidation';
import type { User } from '@appTypes';
import { useAppNavigation } from '@hooks/useAppNavigation';

export const EditProfileScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useAppNavigation();
  const user = useAuthStore(state => state.user);
  const updateUser = useAuthStore(state => state.updateUser);

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [gender, setGender] = useState<'Nam' | 'Nữ' | 'Khác' | ''>(
    user?.gender || '',
  );
  const [dateOfBirth, setDateOfBirth] = useState(
    user?.dateOfBirth?.slice(0, 10) || '',
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [pickedImage, setPickedImage] = useState<{
    uri: string;
    type: string;
    name: string;
  } | null>(null);
  const [preferences, setPreferences] = useState(user?.travelPreferences || []);
  const [budget, setBudget] = useState<User['favoriteBudget']>(
    user?.favoriteBudget || '',
  );
  const pickAvatar = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1,
      });
      if (result.didCancel) return;
      const image = result.assets?.[0];
      if (result.errorCode || !image?.uri)
        throw new Error(
          'Không thể chọn ảnh. Vui lòng kiểm tra quyền truy cập ảnh và thử lại.',
        );
      if (
        !['image/jpeg', 'image/png', 'image/webp'].includes(image.type || '') ||
        (image.fileSize || 0) > 5 * 1024 * 1024
      )
        throw new Error('Chọn ảnh JPG, PNG hoặc WebP không quá 5 MB.');
      setAvatar(image.uri);
      setPickedImage({
        uri: image.uri,
        type: image.type!,
        name: image.fileName || 'avatar.jpg',
      });
    } catch (error) {
      Alert.alert('Chọn ảnh', (error as Error).message);
    }
  };
  const handleSave = async () => {
    if (isSubmitting) return;
    if (dateOfBirth && !isBirthDate(dateOfBirth)) {
      Alert.alert(
        'Lỗi',
        'Ngày sinh phải hợp lệ, theo YYYY-MM-DD và không ở tương lai.',
      );
      return;
    }
    if (phone && !/^\+?[0-9\s()-]{8,15}$/.test(phone)) {
      Alert.alert('Lỗi', 'Số điện thoại không hợp lệ.');
      return;
    }
    if (!name.trim()) {
      Alert.alert('Lỗi', 'Họ và tên không được để trống.');
      return;
    }

    try {
      setIsSubmitting(true);
      const avatarUrl = pickedImage
        ? await authService.uploadAvatar(pickedImage)
        : avatar;
      const updated = await authService.updateProfile({
        avatar: avatarUrl,
        travelPreferences: preferences,
        favoriteBudget: budget,
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
      Alert.alert(
        'Lỗi cập nhật',
        error?.message || 'Không thể cập nhật hồ sơ lúc này.',
      );
    } finally {
      setIsSubmitting(false);
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
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatarCircle} />
          ) : (
            <View style={styles.avatarCircle}>
              <AppText variant="h1" color="primary">
                {name ? name[0].toUpperCase() : 'U'}
              </AppText>
            </View>
          )}
          <TouchableOpacity onPress={pickAvatar} disabled={isSubmitting}>
            <AppText color="primary">Chọn ảnh đại diện</AppText>
          </TouchableOpacity>
          <AppText variant="caption" color="sub" style={styles.avatarHint}>
            JPG, PNG hoặc WebP · Tối đa 5 MB
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
            label="Địa chỉ email"
            placeholder="Email tài khoản"
            value={user?.email || ''}
            editable={false}
            helperText="Email là định danh tài khoản và không thể thay đổi."
          />

          <AppTextInput
            label="Số điện thoại"
            placeholder="Nhập số điện thoại"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <AppTextInput
            label="Ngày sinh (năm-tháng-ngày)"
            placeholder="Ví dụ: 2000-01-01"
            value={dateOfBirth}
            onChangeText={setDateOfBirth}
          />

          <AppText variant="bodyMedium">Sở thích du lịch</AppText>
          <View style={styles.preferenceChips}>
            {['Biển', 'Núi', 'Văn hóa', 'Ẩm thực', 'Cafe', 'Khám phá'].map(
              item => (
                <TouchableOpacity
                  key={item}
                  onPress={() =>
                    setPreferences(prev =>
                      prev.includes(item)
                        ? prev.filter(x => x !== item)
                        : [...prev, item],
                    )
                  }
                  style={[
                    styles.genderChip,
                    preferences.includes(item) && styles.genderChipActive,
                  ]}
                >
                  <AppText
                    color={preferences.includes(item) ? 'primary' : 'sub'}
                  >
                    {item}
                  </AppText>
                </TouchableOpacity>
              ),
            )}
          </View>
          <AppText variant="bodyMedium">Ngân sách mong muốn</AppText>
          <View style={styles.preferenceChips}>
            {(['Tiết kiệm', 'Trung bình', 'Cao cấp'] as const).map(item => (
              <TouchableOpacity
                key={item}
                onPress={() => setBudget(item)}
                style={[
                  styles.genderChip,
                  budget === item && styles.genderChipActive,
                ]}
              >
                <AppText color={budget === item ? 'primary' : 'sub'}>
                  {item}
                </AppText>
              </TouchableOpacity>
            ))}
          </View>
          {/* Gender Selector Chips */}
          <View style={styles.genderContainer}>
            <AppText
              variant="captionMedium"
              color="sub"
              style={styles.genderLabel}
            >
              Giới tính
            </AppText>
            <View style={styles.genderChipsRow}>
              {(['Nam', 'Nữ', 'Khác'] as const).map(g => {
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
  preferenceChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 12,
  },
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
