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

export const ForgotPasswordScreen: React.FC = () => {
  const navigation = useAuthNavigation();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSend = async () => {
    const trimmed = email.trim();
    if (!trimmed) {
      setEmailError('Vui lòng nhập email.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setEmailError('Email không hợp lệ (ví dụ: ban@gmail.com).');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage('');
      await authService.forgotPassword(trimmed);
      navigation.navigate(SCREEN_NAMES.RESET_PASSWORD, { email: trimmed });
    } catch (err: any) {
      setErrorMessage(
        err.message || 'Không thể gửi mã đặt lại mật khẩu. Vui lòng thử lại.',
      );
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
          <AuthBrand />
          <View style={styles.headerSection}>
            <AppText style={styles.title}>Quên mật khẩu</AppText>
            <AppText style={styles.subtitle}>
              Nhập email đã đăng ký để nhận mã đặt lại mật khẩu.
            </AppText>
          </View>

          {errorMessage ? (
            <View style={styles.errorAlert}>
              <AppText style={styles.errorAlertText}>⚠️ {errorMessage}</AppText>
            </View>
          ) : null}

          <View style={styles.formSection}>
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

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleSend}
              disabled={isLoading}
              style={[styles.submitBtn, isLoading && styles.btnDisabled]}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <AppText style={styles.submitBtnText}>Gửi mã xác thực</AppText>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.footerRow}>
            <AppText style={styles.footerPromptText}>Đã nhớ mật khẩu? </AppText>
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
    marginBottom: spacing.xxl,
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
    marginTop: 8,
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
    marginBottom: spacing.xl,
  },
  inputSpacing: {
    marginBottom: spacing.lg,
  },
  submitBtn: {
    width: 156,
    alignSelf: 'center',
    height: 48,
    borderRadius: 9999,
    backgroundColor: '#2F5ABD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnDisabled: {
    opacity: 0.7,
  },
  submitBtnText: {
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
