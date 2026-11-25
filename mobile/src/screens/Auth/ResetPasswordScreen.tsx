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
import { colors, spacing, radius } from '@theme';
import { SCREEN_NAMES } from '@constants/screenNames';
import { authService } from '@services/auth.service';
import { useAppNavigation } from '@hooks/useAppNavigation';

export interface ResetPasswordScreenProps {
  route: {
    params: {
      email: string;
    };
  };
}

export const ResetPasswordScreen: React.FC<ResetPasswordScreenProps> = ({ route }) => {
  const email = route?.params?.email || '';
  const navigation = useAppNavigation();
  const insets = useSafeAreaInsets();

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

    if (!otp.trim()) {
      setOtpError('Please enter the reset code');
      isValid = false;
    }

    if (!newPassword) {
      setNewPasswordError('Please enter your new password');
      isValid = false;
    } else if (newPassword.length < 6) {
      setNewPasswordError('Password must be at least 6 characters');
      isValid = false;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      setNewPasswordError('Must contain uppercase, lowercase letter, and number');
      isValid = false;
    }

    if (newPassword !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    }

    return isValid;
  };

  const handleReset = async () => {
    if (!validate()) return;

    try {
      setIsLoading(true);
      setErrorMessage('');
      await authService.resetPassword({
        email,
        otp: otp.trim(),
        newPassword,
      });

      // Redirect to Login Screen
      navigation.navigate(SCREEN_NAMES.LOGIN as any);
    } catch (err: any) {
      setErrorMessage(err.message || 'Password reset failed. Please check your code.');
    } finally {
      setIsLoading(false);
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
            <AppText style={styles.title}>Reset Password 🔒</AppText>
            <AppText style={styles.subtitle}>
              Enter the reset code sent to{' '}
              <AppText style={styles.emailHighlight}>{email}</AppText> and choose a new password.
            </AppText>
          </View>

          {errorMessage ? (
            <View style={styles.errorAlert}>
              <AppText style={styles.errorAlertText}>⚠️ {errorMessage}</AppText>
            </View>
          ) : null}

          <View style={styles.formSection}>
            <AppTextInput
              label="Reset Code (OTP)"
              placeholder="e.g. 123456"
              keyboardType="number-pad"
              value={otp}
              onChangeText={(val) => {
                setOtp(val);
                if (otpError) setOtpError('');
              }}
              error={otpError}
              containerStyle={styles.inputSpacing}
            />

            <AppTextInput
              label="New Password"
              placeholder="Min 6 characters (1 upper, 1 lower, 1 digit)"
              isPassword
              value={newPassword}
              onChangeText={(val) => {
                setNewPassword(val);
                if (newPasswordError) setNewPasswordError('');
              }}
              error={newPasswordError}
              containerStyle={styles.inputSpacing}
            />

            <AppTextInput
              label="Confirm New Password"
              placeholder="Re-enter new password"
              isPassword
              value={confirmPassword}
              onChangeText={(val) => {
                setConfirmPassword(val);
                if (confirmPasswordError) setConfirmPasswordError('');
              }}
              error={confirmPasswordError}
              containerStyle={styles.inputSpacing}
            />

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleReset}
              disabled={isLoading}
              style={[styles.submitBtn, isLoading && styles.btnDisabled]}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <AppText style={styles.submitBtnText}>Save New Password</AppText>
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
  formSection: {
    marginBottom: spacing.xl,
  },
  inputSpacing: {
    marginBottom: spacing.md,
  },
  submitBtn: {
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

