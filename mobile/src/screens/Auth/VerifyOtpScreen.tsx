import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '@components/common';
import { colors, spacing, radius } from '@theme';
import { SCREEN_NAMES } from '@constants/screenNames';
import { authService } from '@services/auth.service';
import { useAuthStore } from '@store/useAuthStore';
import { useAppNavigation } from '@hooks/useAppNavigation';

export interface VerifyOtpScreenProps {
  route: {
    params: {
      email: string;
    };
  };
}

export const VerifyOtpScreen: React.FC<VerifyOtpScreenProps> = ({ route }) => {
  const email = route?.params?.email || 'your-email@example.com';
  const navigation = useAppNavigation();
  const insets = useSafeAreaInsets();
  const login = useAuthStore((state) => state.login);

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const inputRefs = useRef<any[]>([]);

  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setErrorMessage('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const fullOtp = otp.join('');
    if (fullOtp.length < 6) {
      setErrorMessage('Please enter all 6 digits of the verification code');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage('');
      const res = await authService.verifyOtp({ email, otp: fullOtp });
      if (res?.user && res?.token) {
        await login(res.token, res.user);
      } else {
        navigation.navigate(SCREEN_NAMES.LOGIN as any);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid or expired verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || isResending) return;

    try {
      setIsResending(true);
      setErrorMessage('');
      setSuccessMessage('');
      await authService.resendOtp(email);
      setSuccessMessage('A new verification code has been sent to your inbox.');
      setTimer(60);
      setCanResend(false);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to resend code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <View style={[styles.root, { paddingTop: Math.max(insets.top, 12), paddingBottom: Math.max(insets.bottom, 16) }]}>
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
          <View style={styles.headerSection}>
            <AppText style={styles.title}>Verify Email ✉️</AppText>
            <AppText style={styles.subtitle}>
              We sent a 6-digit confirmation code to{'\n'}
              <AppText style={styles.emailHighlight}>{email}</AppText>
            </AppText>
          </View>

          {errorMessage ? (
            <View style={styles.errorAlert}>
              <AppText style={styles.errorAlertText}>⚠️ {errorMessage}</AppText>
            </View>
          ) : null}

          {successMessage ? (
            <View style={styles.successAlert}>
              <AppText style={styles.successAlertText}>✓ {successMessage}</AppText>
            </View>
          ) : null}

          {/* 6 Digit OTP Input Boxes */}
          <View style={styles.otpContainer}>
            {otp.map((digit, idx) => (
              <TextInput
                key={idx}
                ref={(ref) => {
                  inputRefs.current[idx] = ref;
                }}
                style={[
                  styles.otpBox,
                  digit ? styles.otpBoxFilled : null,
                ]}
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onChangeText={(val) => handleOtpChange(val, idx)}
                onKeyPress={(e) => handleKeyPress(e, idx)}
                selectTextOnFocus
              />
            ))}
          </View>

          {/* Resend Section */}
          <View style={styles.resendRow}>
            {canResend ? (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleResend}
                disabled={isResending}
              >
                <AppText style={styles.resendLink}>
                  {isResending ? 'Sending...' : 'Resend Code'}
                </AppText>
              </TouchableOpacity>
            ) : (
              <AppText style={styles.timerText}>
                Resend code in <AppText style={styles.timerBold}>{timer}s</AppText>
              </AppText>
            )}
          </View>

          {/* Primary Pill Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleVerify}
            disabled={isLoading}
            style={[styles.verifyBtn, isLoading && styles.btnDisabled]}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <AppText style={styles.verifyBtnText}>Verify & Continue</AppText>
            )}
          </TouchableOpacity>
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
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
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
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl,
  },
  headerSection: {
    marginBottom: spacing.xxl,
    marginTop: spacing.xs,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
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
  successAlert: {
    backgroundColor: '#DCFCE7',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  successAlertText: {
    color: '#15803D',
    fontSize: 13,
    fontWeight: '500',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  otpBox: {
    width: 48,
    height: 56,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
  },
  otpBoxFilled: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  resendRow: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  resendLink: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2563EB',
  },
  timerText: {
    fontSize: 14,
    color: '#64748B',
  },
  timerBold: {
    fontWeight: '700',
    color: '#0F172A',
  },
  verifyBtn: {
    width: '100%',
    height: 52,
    borderRadius: 9999,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  btnDisabled: {
    opacity: 0.7,
  },
  verifyBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
