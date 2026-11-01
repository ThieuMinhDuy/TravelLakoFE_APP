import { apiClient } from './api/apiClient';
import { API_URLS } from '@constants/apiUrls';
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  UpdateProfilePayload,
  User,
  VerifyOtpPayload,
  ApiResponse,
} from '@appTypes';

export const authService = {
  /**
   * Đăng ký tài khoản mới (nhận OTP qua email)
   */
  async register(payload: RegisterPayload): Promise<ApiResponse<{ email: string }>> {
    const res = await apiClient.post<any>(
      API_URLS.AUTH.REGISTER,
      payload,
    );
    return res.data;
  },

  /**
   * Đăng nhập (Hỗ trợ bọc hoặc trả trực tiếp { user, token })
   */
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const res = await apiClient.post<any>(
      API_URLS.AUTH.LOGIN,
      payload,
    );
    const data = res.data;

    // Normalize standard response structures
    if (data?.data?.user && data?.data?.token) {
      return { user: data.data.user, token: data.data.token };
    }
    if (data?.user && data?.token) {
      return { user: data.user, token: data.token };
    }
    if (data?.token) {
      const { token, ...userData } = data;
      return { user: userData as User, token };
    }
    return { user: (data?.data || data) as User, token: '' };
  },

  /**
   * Xác thực mã OTP kích hoạt tài khoản
   */
  async verifyOtp(payload: VerifyOtpPayload): Promise<AuthResponse> {
    const res = await apiClient.post<any>(
      API_URLS.AUTH.VERIFY_OTP,
      payload,
    );
    const data = res.data;

    if (data?.data?.user && data?.data?.token) {
      return { user: data.data.user, token: data.data.token };
    }
    if (data?.user && data?.token) {
      return { user: data.user, token: data.token };
    }
    if (data?.token) {
      const { token, ...userData } = data;
      return { user: userData as User, token };
    }
    return { user: (data?.data || data) as User, token: '' };
  },

  /**
   * Gửi lại mã OTP
   */
  async resendOtp(email: string): Promise<ApiResponse<null>> {
    const res = await apiClient.post<any>(
      API_URLS.AUTH.RESEND_OTP,
      { email },
    );
    return res.data;
  },

  /**
   * Quên mật khẩu - gửi mã OTP xác nhận về email
   */
  async forgotPassword(email: string): Promise<ApiResponse<null>> {
    const res = await apiClient.post<any>(
      API_URLS.AUTH.FORGOT_PASSWORD,
      { email },
    );
    return res.data;
  },

  /**
   * Đặt lại mật khẩu bằng mã OTP
   */
  async resetPassword(payload: { email: string; otp: string; newPassword: string }): Promise<ApiResponse<null>> {
    const res = await apiClient.post<any>(
      API_URLS.AUTH.RESET_PASSWORD,
      payload,
    );
    return res.data;
  },

  /**
   * Lấy thông tin cá nhân hiện tại
   */
  async getProfile(): Promise<User> {
    const res = await apiClient.get<any>(API_URLS.AUTH.PROFILE);
    return res.data?.data || res.data;
  },

  /**
   * Cập nhật thông tin cá nhân
   */
  async updateProfile(payload: UpdateProfilePayload): Promise<User> {
    const res = await apiClient.put<any>(
      API_URLS.AUTH.PROFILE,
      payload,
    );
    return res.data?.data || res.data;
  },

  /**
   * Đăng xuất
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post<any>(API_URLS.AUTH.LOGOUT);
    } catch {
      // Ignored if network is offline
    }
  },
};
