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
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText, AppTextInput } from '@components/common';
import { colors, spacing, radius } from '@theme';
import { SCREEN_NAMES } from '@constants/screenNames';
import { STORAGE_KEYS } from '@constants/storageKeys';
import { storageHelper } from '@helpers/storageHelper';
import { useAuthStore } from '@store/useAuthStore';
import { authService } from '@services/auth.service';
import { useAppNavigation } from '@hooks/useAppNavigation';

export const LoginScreen: React.FC = () => {
  const navigation = useAppNavigation();
  const insets = useSafeAreaInsets();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Status states
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const login = useAuthStore((state) => state.login);

  // Load saved credentials
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

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setEmailError('Please enter your email');
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setEmailError('Invalid email format (e.g. user@gmail.com)');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Please enter your password');
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

      if (rememberMe) {
        await storageHelper.setItem(STORAGE_KEYS.SAVED_CREDENTIALS, { email: email.trim() });
      } else {
        await storageHelper.removeItem(STORAGE_KEYS.SAVED_CREDENTIALS);
      }

      if (res?.user) {
        await login(res.token || 'bearer_token_placeholder', res.user);
      } else {
        throw new Error('Authentication data not received from server');
      }
    } catch (err: any) {
      console.warn('[LoginScreen] Error:', err);
      setErrorMessage(
        err.message || 'Login failed. Please check your credentials and try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate(SCREEN_NAMES.ONBOARDING as any);
    }
  };

  return (
    <View style={[styles.root, { paddingTop: Math.max(insets.top, 12), paddingBottom: Math.max(insets.bottom, 16) }]}>
      <StatusBar barStyle="dark-content" />

      {/* Top Header with Circular Back Button */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleBack}
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
          <View style={styles.headerSection}>
            <AppText style={styles.welcomeTitle}>Welcome Back! 👋</AppText>
            <AppText style={styles.welcomeSubtitle}>
              Sign in to your account to explore destinations and manage your dream trips.
            </AppText>
          </View>

          {/* Error Alert Banner */}
          {errorMessage ? (
            <View style={styles.errorAlert}>
              <AppText style={styles.errorAlertText}>⚠️ {errorMessage}</AppText>
            </View>
          ) : null}

          {/* Form Fields Section */}
          <View style={styles.formSection}>
            {/* Email Field */}
            <AppTextInput
              label="Email Address"
              placeholder="e.g. traveler@gmail.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={(val) => {
                setEmail(val);
                if (emailError) setEmailError('');
              }}
              error={emailError}
              containerStyle={styles.inputSpacing}
            />

            {/* Password Field */}
            <AppTextInput
              label="Password"
              placeholder="Enter your password"
              isPassword
              value={password}
              onChangeText={(val) => {
                setPassword(val);
                if (passwordError) setPasswordError('');
              }}
              error={passwordError}
              containerStyle={styles.inputSpacing}
            />

            {/* Options Row: Remember Me & Forgot Password */}
            <View style={styles.optionsRow}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.rememberMeRow}
                onPress={() => setRememberMe((prev) => !prev)}
              >
                <View style={[styles.checkbox, rememberMe && styles.checkboxActive]}>
                  {rememberMe && <AppText style={styles.checkmark}>✓</AppText>}
                </View>
                <AppText style={styles.rememberMeText}>Remember me</AppText>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigation.navigate(SCREEN_NAMES.FORGOT_PASSWORD as any)}
              >
                <AppText style={styles.forgotPasswordText}>Forgot Password?</AppText>
              </TouchableOpacity>
            </View>

            {/* Submit Pill Button */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleLogin}
              disabled={isLoading}
              style={[styles.loginBtn, isLoading && styles.btnDisabled]}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <AppText style={styles.loginBtnText}>Log In</AppText>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <AppText style={styles.dividerText}>OR CONTINUE WITH</AppText>
              <View style={styles.dividerLine} />
            </View>

            {/* Modern Social Login Buttons */}
            <View style={styles.socialRow}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.socialBtn}
                onPress={() => setErrorMessage('Google Sign-In is coming soon.')}
              >
                <AppText style={styles.socialIconG}>G</AppText>
                <AppText style={styles.socialBtnLabel}>Google</AppText>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.socialBtn}
                onPress={() => setErrorMessage('Apple Sign-In is coming soon.')}
              >
                <AppText style={styles.socialIconApple}></AppText>
                <AppText style={styles.socialBtnLabel}>Apple</AppText>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer Prompt */}
          <View style={styles.footerRow}>
            <AppText style={styles.footerPromptText}>Don't have an account? </AppText>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate(SCREEN_NAMES.REGISTER as any)}
            >
              <AppText style={styles.footerLinkText}>Create Account</AppText>
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
    marginBottom: spacing.xl,
    marginTop: spacing.xs,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  welcomeSubtitle: {
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
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
  },
  rememberMeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  checkboxActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  rememberMeText: {
    fontSize: 14,
    color: '#475569',
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
  },
  loginBtn: {
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
    marginBottom: spacing.xl,
  },
  btnDisabled: {
    opacity: 0.7,
  },
  loginBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    marginHorizontal: spacing.md,
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
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
    height: 50,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  socialIconG: {
    fontSize: 18,
    fontWeight: '700',
    color: '#EA4335',
    marginRight: spacing.sm,
  },
  socialIconApple: {
    fontSize: 20,
    color: '#0F172A',
    marginRight: spacing.sm,
  },
  socialBtnLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
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
    color: '#2563EB',
  },
});
