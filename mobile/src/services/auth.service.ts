import { parseAuthResponse, parseUser } from './authResponse';
import { apiClient } from './api/apiClient';
import { API_URLS } from '@constants/apiUrls';
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  UpdateProfilePayload,
  User,
  VerifyOtpPayload,
} from '@appTypes';

export const authService = {
  /**
   * Đăng ký tài khoản mới (nhận OTP qua email)
   */
  async register(payload: RegisterPayload): Promise<void> {
    await apiClient.post(API_URLS.AUTH.REGISTER, payload);
  },

  /**
   * Đăng nhập (Hỗ trợ bọc hoặc trả trực tiếp { user, token })
   */
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const res = await apiClient.post<any>(API_URLS.AUTH.LOGIN, payload);
    return parseAuthResponse(res.data);
  },

  /**
   * Xác thực mã OTP kích hoạt tài khoản
   */
  async verifyOtp(payload: VerifyOtpPayload): Promise<AuthResponse> {
    const res = await apiClient.post<any>(API_URLS.AUTH.VERIFY_OTP, payload);
    return parseAuthResponse(res.data);
  },

  /**
   * Gửi lại mã OTP
   */
  async resendOtp(email: string): Promise<void> {
    await apiClient.post(API_URLS.AUTH.RESEND_OTP, { email });
  },

  /**
   * Quên mật khẩu - gửi mã OTP xác nhận về email
   */
  async forgotPassword(email: string): Promise<void> {
    await apiClient.post(API_URLS.AUTH.FORGOT_PASSWORD, {
      email,
    });
  },

  /**
   * Đặt lại mật khẩu bằng mã OTP
   */
  async resetPassword(payload: {
    email: string;
    otp: string;
    newPassword: string;
  }): Promise<void> {
    await apiClient.post(API_URLS.AUTH.RESET_PASSWORD, payload);
  },

  /**
   * Lấy thông tin cá nhân hiện tại
   */
  async getProfile(): Promise<User> {
    const res = await apiClient.get<any>(API_URLS.AUTH.PROFILE);
    return parseUser(res.data);
  },

  /**
   * Cập nhật thông tin cá nhân
   */
  async updateProfile(payload: UpdateProfilePayload): Promise<User> {
    const res = await apiClient.put<any>(API_URLS.AUTH.PROFILE, payload);
    return parseUser(res.data);
  },

  /**
   * Đăng xuất
   */
  async changePassword(payload: {
    currentPassword?: string;
    newPassword: string;
  }): Promise<void> {
    await apiClient.put(API_URLS.AUTH.CHANGE_PASSWORD, payload);
  },

  async uploadAvatar(image: {
    uri: string;
    type: string;
    name: string;
  }): Promise<string> {
    const form = new FormData();
    form.append('image', image as unknown as Blob);
    const res = await apiClient.post(API_URLS.UPLOAD, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    if (typeof res.data?.url !== 'string')
      throw new Error('Máy chủ chưa trả URL ảnh.');
    return res.data.url;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post<any>(API_URLS.AUTH.LOGOUT);
    } catch {
      // Ignored if network is offline
    }
  },
};
