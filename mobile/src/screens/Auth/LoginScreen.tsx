import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import {
  ScreenWrapper,
  AppText,
  AppButton,
  AppTextInput,
  AppCard,
} from '@components/common';
import { colors, spacing } from '@theme';
import { SCREEN_NAMES } from '@constants/screenNames';
import { useAuthStore } from '@store/useAuthStore';
import { authService } from '@services/auth.service';

export interface LoginScreenProps {
  navigation: any;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const login = useAuthStore((state) => state.login);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Vui lòng nhập đầy đủ email và mật khẩu');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage('');
      const res = await authService.login({ email, password });
      if (res.data) {
        await login(res.data.token, res.data.user);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Đăng nhập không thành công');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenWrapper scrollable withKeyboardAvoiding>
      <View style={styles.headerArea}>
        <AppText variant="h1" color="primary" style={styles.brandTitle}>
          TravelLako
        </AppText>
        <AppText variant="body" color="sub" style={styles.brandSubtitle}>
          Khám phá và tối ưu hóa lịch trình du lịch thông minh
        </AppText>
      </View>

      <AppCard style={styles.formCard}>
        <AppText variant="h2" color="main" style={styles.formTitle}>
          Đăng nhập
        </AppText>

        {errorMessage ? (
          <AppText variant="caption" color="danger" style={styles.errorText}>
            {errorMessage}
          </AppText>
        ) : null}

        <AppTextInput
          label="Email"
          placeholder="example@gmail.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <AppTextInput
          label="Mật khẩu"
          placeholder="••••••••"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={styles.forgotPasswordButton}
          onPress={() => navigation.navigate(SCREEN_NAMES.FORGOT_PASSWORD)}
        >
          <AppText variant="captionMedium" color="primary">
            Quên mật khẩu?
          </AppText>
        </TouchableOpacity>

        <AppButton
          title="Đăng nhập"
          onPress={handleLogin}
          isLoading={isLoading}
          variant="primary"
          size="lg"
          style={styles.loginButton}
        />

        <View style={styles.footerRow}>
          <AppText variant="caption" color="sub">
            Chưa có tài khoản?{' '}
          </AppText>
          <TouchableOpacity
            onPress={() => navigation.navigate(SCREEN_NAMES.REGISTER)}
          >
            <AppText variant="captionMedium" color="primary">
              Đăng ký ngay
            </AppText>
          </TouchableOpacity>
        </View>
      </AppCard>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  headerArea: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  brandTitle: {
    marginBottom: spacing.xs,
  },
  brandSubtitle: {
    textAlign: 'center',
    paddingHorizontal: spacing.md,
  },
  formCard: {
    marginTop: spacing.md,
  },
  formTitle: {
    marginBottom: spacing.lg,
  },
  errorText: {
    marginBottom: spacing.md,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: spacing.lg,
  },
  loginButton: {
    marginBottom: spacing.lg,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: spacing.xs,
  },
});

