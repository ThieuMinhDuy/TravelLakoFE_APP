import { isOtp } from '@utils/authValidation';
import { AuthBrand } from '@components/common/AuthBrand';
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText, AppTextInput } from '@components/common';
import { spacing, radius } from '@theme';
import { SCREEN_NAMES } from '@constants/screenNames';
import { authService } from '@services/auth.service';
import { useAuthNavigation } from '@hooks/useAuthNavigation';

export interface ResetPasswordScreenProps {
  route: {
    params: {
      email: string;
    };
  };
}

export const ResetPasswordScreen: React.FC<ResetPasswordScreenProps> = ({
  route,
}) => {
  const email = route?.params?.email || '';
  const navigation = useAuthNavigation();
  const insets = useSafeAreaInsets();

  const [deadline, setDeadline] = useState(Date.now() + 300000);
  const [resendAt, setResendAt] = useState(Date.now() + 60000);
  const [seconds, setSeconds] = useState(300);
  const [cooldown, setCooldown] = useState(60);
  const [resending, setResending] = useState(false);
  useEffect(() => {
    const tick = () => {
      setSeconds(Math.max(0, Math.ceil((deadline - Date.now()) / 1000)));
      setCooldown(Math.max(0, Math.ceil((resendAt - Date.now()) / 1000)));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [deadline, resendAt]);
  const resend = async () => {
    if (cooldown || resending || isLoading) return;
    try {
      setResending(true);
      setErrorMessage('');
      await authService.forgotPassword(email);
      setOtp('');
      setDeadline(Date.now() + 300000);
      setResendAt(Date.now() + 60000);
    } catch (error) {
      setErrorMessage((error as Error).message);
    } finally {
      setResending(false);
    }
  };
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const validate = (): boolean => {
    let isValid = true;
    setOtpError('');
    setNewPasswordError('');
    setConfirmPasswordError('');
    setErrorMessage('');

    if (!isOtp(otp.trim())) {
      setOtpError('Vui lòng nhập mã xác thực gồm 6 chữ số.');
      isValid = false;
    }

    if (!newPassword) {
      setNewPasswordError('Vui lòng nhập mật khẩu mới.');
      isValid = false;
    } else if (newPassword.length < 6) {
      setNewPasswordError('Mật khẩu phải có ít nhất 6 ký tự.');
      isValid = false;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      setNewPasswordError('Mật khẩu phải có chữ hoa, chữ thường và số.');
      isValid = false;
    }

    if (newPassword !== confirmPassword) {
      setConfirmPasswordError('Mật khẩu xác nhận không khớp.');
      isValid = false;
    }

    return isValid;
  };

  const handleReset = async () => {
    if (isLoading || resending) return;
    if (!seconds) {
      setErrorMessage('Mã đã hết hạn. Vui lòng gửi lại mã.');
      return;
    }
    if (!validate()) return;

    try {
      setIsLoading(true);
      setErrorMessage('');
      await authService.resetPassword({
        email,
        otp: otp.trim(),
        newPassword,
      });

      Alert.alert(
        'Thành công',
        'Mật khẩu đã được đặt lại. Hãy đăng nhập bằng mật khẩu mới.',
      );
      // Redirect to Login Screen
      navigation.navigate(SCREEN_NAMES.LOGIN);
    } catch (err: any) {
      setErrorMessage(
        err.message ||
          'Không thể đặt lại mật khẩu. Vui lòng kiểm tra mã xác thực.',
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
            <AppText style={styles.title}>Đặt lại mật khẩu</AppText>
            <AppText style={styles.subtitle}>
              Nhập mã xác thực đã gửi đến{' '}
              <AppText style={styles.emailHighlight}>{email}</AppText> và tạo
              mật khẩu mới.
            </AppText>
          </View>

          {errorMessage ? (
            <View style={styles.errorAlert}>
              <AppText style={styles.errorAlertText}>⚠️ {errorMessage}</AppText>
            </View>
          ) : null}

          <AppText>
            Mã hết hạn sau {Math.floor(seconds / 60)}:
            {String(seconds % 60).padStart(2, '0')}
          </AppText>
          <TouchableOpacity
            disabled={!!cooldown || resending || isLoading}
            onPress={resend}
          >
            <AppText color="primary">
              {resending
                ? 'Đang gửi...'
                : cooldown
                ? `Gửi lại sau ${cooldown} giây`
                : 'Gửi lại mã'}
            </AppText>
          </TouchableOpacity>
          <View style={styles.formSection}>
            <AppTextInput
              label="Mã xác thực (OTP)"
              placeholder="Nhập 6 chữ số"
              keyboardType="number-pad"
              maxLength={6}
              value={otp}
              onChangeText={val => {
                setOtp(val.replace(/\D/g, ''));
                if (otpError) setOtpError('');
              }}
              error={otpError}
              containerStyle={styles.inputSpacing}
            />

            <AppTextInput
              label="Mật khẩu mới"
              placeholder="Nhập mật khẩu mới"
              helperText="Ít nhất 6 ký tự, có chữ hoa, chữ thường và số"
              isPassword
              value={newPassword}
              onChangeText={val => {
                setNewPassword(val);
                if (newPasswordError) setNewPasswordError('');
              }}
              error={newPasswordError}
              containerStyle={styles.inputSpacing}
            />

            <AppTextInput
              label="Xác nhận mật khẩu mới"
              placeholder="Nhập lại mật khẩu mới"
              isPassword
              value={confirmPassword}
              onChangeText={val => {
                setConfirmPassword(val);
                if (confirmPasswordError) setConfirmPasswordError('');
              }}
              error={confirmPasswordError}
              containerStyle={styles.inputSpacing}
            />

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleReset}
              disabled={isLoading || resending}
              style={[styles.submitBtn, isLoading && styles.btnDisabled]}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <AppText style={styles.submitBtnText}>Lưu mật khẩu</AppText>
              )}
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
  emailHighlight: {
    fontWeight: '700',
    color: '#0F172A',
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
    marginBottom: spacing.md,
  },
  submitBtn: {
    width: 156,
    alignSelf: 'center',
    height: 48,
    borderRadius: 9999,
    backgroundColor: '#2F5ABD',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  btnDisabled: {
    opacity: 0.7,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
