import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import {
  ScreenWrapper,
  AppHeader,
  AppText,
  AppButton,
  AppTextInput,
  AppCard,
} from '@components/common';
import { spacing } from '@theme';
import { SCREEN_NAMES } from '@constants/screenNames';
import { authService } from '@services/auth.service';

export interface RegisterScreenProps {
  navigation: any;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      setErrorMessage('Vui lòng điền đầy đủ tất cả các trường');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage('');
      await authService.register({ name, email, password });
      // Redirect to OTP verification screen
      navigation.navigate(SCREEN_NAMES.VERIFY_OTP, { email });
    } catch (err: any) {
      setErrorMessage(err.message || 'Đăng ký không thành công');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenWrapper
      scrollable
      header={
        <AppHeader
          title="Tạo tài khoản"
          showBack
          onBack={() => navigation.goBack()}
        />
      }
    >
      <AppCard style={styles.card}>
        <AppText variant="h2" color="main" style={styles.title}>
          Đăng ký thành viên
        </AppText>
        <AppText variant="body" color="sub" style={styles.subtitle}>
          Mã OTP kích hoạt sẽ được gửi tới hòm thư email của bạn.
        </AppText>

        {errorMessage ? (
          <AppText variant="caption" color="danger" style={styles.errorText}>
            {errorMessage}
          </AppText>
        ) : null}

        <AppTextInput
          label="Họ và tên"
          placeholder="Nguyễn Văn A"
          value={name}
          onChangeText={setName}
        />

        <AppTextInput
          label="Địa chỉ Email"
          placeholder="example@gmail.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <AppTextInput
          label="Mật khẩu"
          placeholder="Tối thiểu 6 ký tự"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <AppButton
          title="Đăng ký & Nhận mã OTP"
          onPress={handleRegister}
          isLoading={isLoading}
          variant="primary"
          size="lg"
          style={styles.submitButton}
        />

        <View style={styles.footerRow}>
          <AppText variant="caption" color="sub">
            Đã có tài khoản?{' '}
          </AppText>
          <TouchableOpacity onPress={() => navigation.navigate(SCREEN_NAMES.LOGIN)}>
            <AppText variant="captionMedium" color="primary">
              Đăng nhập
            </AppText>
          </TouchableOpacity>
        </View>
      </AppCard>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  card: {
    marginTop: spacing.md,
  },
  title: {
    marginBottom: spacing.xs,
  },
  subtitle: {
    marginBottom: spacing.lg,
  },
  errorText: {
    marginBottom: spacing.md,
  },
  submitButton: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

