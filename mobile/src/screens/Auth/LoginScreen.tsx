import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  ScreenWrapper,
  AppText,
  AppButton,
  AppTextInput,
  AppCard,
} from '@components/common';
import { colors, spacing, radius, shadows } from '@theme';
import { IMAGES } from '@assets';
import { SCREEN_NAMES } from '@constants/screenNames';
import { STORAGE_KEYS } from '@constants/storageKeys';
import { storageHelper } from '@helpers/storageHelper';
import { useAuthStore } from '@store/useAuthStore';
import { authService } from '@services/auth.service';
import { useAppNavigation } from '@hooks/useAppNavigation';

export const LoginScreen: React.FC = () => {
  const navigation = useAppNavigation();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Status & Validation states
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const login = useAuthStore((state) => state.login);

  // Load saved email if previously remembered
  useEffect(() => {
    const loadSavedEmail = async () => {
      try {
        const saved = await storageHelper.getItem<{ email: string }>(STORAGE_KEYS.SAVED_CREDENTIALS);
        if (saved?.email) {
          setEmail(saved.email);
          setRememberMe(true);
        }
      } catch {
        // Ignored
      }
    };
    loadSavedEmail();
  }, []);

  const validateForm = (): boolean => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');
    setErrorMessage('');

    // Email validation
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setEmailError('Vui lòng nhập địa chỉ email');
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setEmailError('Định dạng email không hợp lệ (VD: user@gmail.com)');
      isValid = false;
    }

    // Password validation
    if (!password) {
      setPasswordError('Vui lòng nhập mật khẩu');
      isValid = false;
    }

    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      setErrorMessage('');

      const res = await authService.login({
        email: email.trim(),
        password,
      });

      // Save email for remember me feature
      if (rememberMe) {
        await storageHelper.setItem(STORAGE_KEYS.SAVED_CREDENTIALS, { email: email.trim() });
      } else {
        await storageHelper.removeItem(STORAGE_KEYS.SAVED_CREDENTIALS);
      }

      // Store credentials into Zustand state & MMKV/AsyncStorage
      if (res?.user) {
        await login(res.token || 'bearer_token_placeholder', res.user);
      } else {
        throw new Error('Không nhận được dữ liệu xác thực từ server');
      }
    } catch (err: any) {
      console.warn('[LoginScreen] Error:', err);
      setErrorMessage(
        err.message || 'Đăng nhập không thành công. Vui lòng kiểm tra lại email và mật khẩu.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenWrapper scrollable withKeyboardAvoiding safeAreaEdges={['top', 'bottom']}>
      {/* 1. Header Banner & Branding (Figma TravelSafe style) */}
      <View style={styles.heroSection}>
        <Image
          source={IMAGES.logo}
          style={styles.logoImage}
          resizeMode="contain"
        />

        <View style={styles.heroTextContainer}>
          <AppText variant="h1" color="main" style={styles.title}>
            Chào mừng trở lại! 👋
          </AppText>
          <AppText variant="body" color="sub" style={styles.subtitle}>
            Đăng nhập để khám phá các địa điểm du lịch và quản lý lịch trình chuyến đi của bạn.
          </AppText>
        </View>
      </View>

      {/* 2. Main Login Form Card */}
      <AppCard style={styles.formCard}>
        {/* Error notification banner if any */}
        {errorMessage ? (
          <View style={styles.errorAlert}>
            <AppText variant="captionMedium" color="danger">
              ⚠️ {errorMessage}
            </AppText>
          </View>
        ) : null}

        {/* Email Field */}
        <AppTextInput
          label="Địa chỉ Email"
          placeholder="tenban@gmail.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={(val) => {
            setEmail(val);
            if (emailError) setEmailError('');
          }}
          error={emailError}
          leftIcon={<AppText variant="body" color="muted">✉</AppText>}
        />

        {/* Password Field */}
        <AppTextInput
          label="Mật khẩu"
          placeholder="Nhập mật khẩu"
          isPassword
          value={password}
          onChangeText={(val) => {
            setPassword(val);
            if (passwordError) setPasswordError('');
          }}
          error={passwordError}
          leftIcon={<AppText variant="body" color="muted">🔒</AppText>}
        />

        {/* Options Row: Remember Me & Forgot Password */}
        <View style={styles.optionsRow}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setRememberMe((prev) => !prev)}
            style={styles.rememberMeContainer}
          >
            <View style={[styles.checkbox, rememberMe && styles.checkboxActive]}>
              {rememberMe && (
                <AppText variant="tiny" color="white" style={styles.checkmark}>
                  ✓
                </AppText>
              )}
            </View>
            <AppText variant="caption" color="sub">
              Ghi nhớ tôi
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate(SCREEN_NAMES.FORGOT_PASSWORD as any)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <AppText variant="captionMedium" color="primary">
              Quên mật khẩu?
            </AppText>
          </TouchableOpacity>
        </View>

        {/* Submit Login Button */}
        <AppButton
          title="Đăng nhập"
          onPress={handleLogin}
          isLoading={isLoading}
          variant="primary"
          size="lg"
          style={styles.loginBtn}
        />

        {/* Divider: Or continue with */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <AppText variant="tiny" color="muted" style={styles.dividerText}>
            HOẶC TIẾP TỤC VỚI
          </AppText>
          <View style={styles.dividerLine} />
        </View>

        {/* Social Quick Options (TravelSafe Community Look) */}
        <View style={styles.socialRow}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.socialBtn}
            onPress={() => setErrorMessage('Tính năng đăng nhập Google đang được hoàn thiện.')}
          >
            <AppText variant="bodyBold" color="main">
              G
            </AppText>
            <AppText variant="captionMedium" color="main" style={styles.socialBtnText}>
              Google
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.socialBtn}
            onPress={() => setErrorMessage('Tính năng đăng nhập Apple đang được hoàn thiện.')}
          >
            <AppText variant="bodyBold" color="main">
              
            </AppText>
            <AppText variant="captionMedium" color="main" style={styles.socialBtnText}>
              Apple
            </AppText>
          </TouchableOpacity>
        </View>
      </AppCard>

      {/* 3. Footer Prompt */}
      <View style={styles.footerRow}>
        <AppText variant="body" color="sub">
          Chưa có tài khoản?{' '}
        </AppText>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate(SCREEN_NAMES.REGISTER as any)}
        >
          <AppText variant="bodyBold" color="primary">
            Đăng ký ngay
          </AppText>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  heroSection: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    alignItems: 'center',
  },
  logoImage: {
    width: 72,
    height: 72,
    marginBottom: spacing.md,
  },
  heroTextContainer: {
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
  },
  title: {
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: 20,
  },
  formCard: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    padding: spacing.lg,
    borderRadius: radius.xl,
    backgroundColor: colors.background.surface,
    ...shadows.card,
  },
  errorAlert: {
    backgroundColor: colors.status.errorBg,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.border.subtle,
    backgroundColor: colors.background.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.xs + 2,
  },
  checkboxActive: {
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.main,
  },
  checkmark: {
    fontSize: 12,
    lineHeight: 14,
    fontWeight: 'bold',
  },
  loginBtn: {
    marginBottom: spacing.lg,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border.subtle,
  },
  dividerText: {
    marginHorizontal: spacing.md,
    letterSpacing: 0.5,
  },
  socialRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  socialBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    backgroundColor: colors.background.subtle,
  },
  socialBtnText: {
    marginLeft: spacing.sm,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
});
