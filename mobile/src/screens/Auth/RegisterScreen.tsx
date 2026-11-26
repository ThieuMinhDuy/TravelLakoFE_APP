import { AuthBrand } from '@components/common/AuthBrand';
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText, AppTextInput } from '@components/common';
import { spacing, radius } from '@theme';
import { SCREEN_NAMES } from '@constants/screenNames';
import { authService } from '@services/auth.service';
import { useAuthNavigation } from '@hooks/useAuthNavigation';

export const RegisterScreen: React.FC = () => {
  const navigation = useAuthNavigation();
  const insets = useSafeAreaInsets();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const validate = (): boolean => {
    let isValid = true;
    setNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setErrorMessage('');

    if (!name.trim()) {
      setNameError('Vui lòng nhập họ và tên.');
      isValid = false;
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setEmailError('Vui lòng nhập email.');
      isValid = false;
    } else if (!/^[^\s@]+@gmail\.com$/i.test(trimmedEmail)) {
      setEmailError('Vui lòng sử dụng địa chỉ email @gmail.com.');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Vui lòng nhập mật khẩu.');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Mật khẩu phải có ít nhất 6 ký tự.');
      isValid = false;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      setPasswordError('Mật khẩu phải có chữ hoa, chữ thường và số.');
      isValid = false;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError('Mật khẩu xác nhận không khớp.');
      isValid = false;
    }

    return isValid;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    try {
      setIsLoading(true);
      setErrorMessage('');

      await authService.register({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      // Navigate to OTP verification screen
      navigation.navigate(SCREEN_NAMES.VERIFY_OTP, { email: email.trim() });
    } catch (err: any) {
      console.warn('[RegisterScreen] Error:', err);
      setErrorMessage(err.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
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

      {/* Top Header with Circular Back Button */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <AppText style={styles.backArrow}>‹</AppText>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flexOne}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header Typography */}
          <AuthBrand />
          <View style={styles.headerSection}>
            <AppText style={styles.title}>Tạo tài khoản</AppText>
            <AppText style={styles.subtitle}>
              Đăng ký để bắt đầu lên kế hoạch cho những chuyến đi cùng
              TravelLako.
            </AppText>
          </View>

          {/* Error Alert */}
          {errorMessage ? (
            <View style={styles.errorAlert}>
              <AppText style={styles.errorAlertText}>⚠️ {errorMessage}</AppText>
            </View>
          ) : null}

          {/* Form Fields */}
          <View style={styles.formSection}>
            <AppTextInput
              label="Họ và tên"
              placeholder="Nhập họ và tên"
              autoCapitalize="words"
              value={name}
              onChangeText={val => {
                setName(val);
                if (nameError) setNameError('');
              }}
              error={nameError}
              containerStyle={styles.inputSpacing}
            />

            <AppTextInput
              label="Địa chỉ email"
              placeholder="Ví dụ: ban@gmail.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={val => {
                setEmail(val);
                if (emailError) setEmailError('');
              }}
              error={emailError}
              containerStyle={styles.inputSpacing}
            />

            <AppTextInput
              label="Mật khẩu"
              placeholder="Nhập mật khẩu"
              helperText="Ít nhất 6 ký tự, có chữ hoa, chữ thường và số"
              isPassword
              value={password}
              onChangeText={val => {
                setPassword(val);
                if (passwordError) setPasswordError('');
              }}
              error={passwordError}
              containerStyle={styles.inputSpacing}
            />

            <AppTextInput
              label="Xác nhận mật khẩu"
              placeholder="Nhập lại mật khẩu"
              isPassword
              value={confirmPassword}
              onChangeText={val => {
                setConfirmPassword(val);
                if (confirmPasswordError) setConfirmPasswordError('');
              }}
              error={confirmPasswordError}
              containerStyle={styles.inputSpacing}
            />

            {/* Submit Pill Button */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleRegister}
              disabled={isLoading}
              style={[styles.registerBtn, isLoading && styles.btnDisabled]}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <AppText style={styles.registerBtnText}>Đăng ký</AppText>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer Prompt */}
          <View style={styles.footerRow}>
            <AppText style={styles.footerPromptText}>Đã có tài khoản? </AppText>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate(SCREEN_NAMES.LOGIN)}
            >
              <AppText style={styles.footerLinkText}>Đăng nhập</AppText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  flexOne: {
    flex: 1,
  },
  headerBar: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    fontSize: 26,
    fontWeight: '300',
    color: '#0F172A',
    marginTop: -2,
  },
  scrollContent: {
    paddingHorizontal: 36,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl,
  },
  headerSection: {
    marginBottom: spacing.xl,
    marginTop: spacing.xs,
  },
  title: {
    fontSize: 24,
    fontWeight: '500',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: '#64748B',
    marginTop: 6,
  },
  errorAlert: {
    backgroundColor: '#FEE2E2',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  errorAlertText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '500',
  },
  formSection: {
    marginBottom: spacing.lg,
  },
  inputSpacing: {
    marginBottom: spacing.md,
  },
  registerBtn: {
    width: 156,
    alignSelf: 'center',
    height: 48,
    borderRadius: 9999,
    backgroundColor: '#2F5ABD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  btnDisabled: {
    opacity: 0.7,
  },
  registerBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  footerPromptText: {
    fontSize: 14,
    color: '#64748B',
  },
  footerLinkText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2F5ABD',
  },
});
