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
    const res = await apiClient.post<ApiResponse<{ email: string }>>(
      API_URLS.AUTH.REGISTER,
      payload,
    );
    return res.data;
  },

  /**
   * Đăng nhập
   */
  async login(payload: LoginPayload): Promise<ApiResponse<AuthResponse>> {
    const res = await apiClient.post<ApiResponse<AuthResponse>>(
      API_URLS.AUTH.LOGIN,
      payload,
    );
    return res.data;
  },

  /**
   * Xác thực mã OTP kích hoạt tài khoản
   */
  async verifyOtp(payload: VerifyOtpPayload): Promise<ApiResponse<AuthResponse>> {
    const res = await apiClient.post<ApiResponse<AuthResponse>>(
      API_URLS.AUTH.VERIFY_OTP,
      payload,
    );
    return res.data;
  },

  /**
   * Gửi lại mã OTP
   */
  async resendOtp(email: string): Promise<ApiResponse<null>> {
    const res = await apiClient.post<ApiResponse<null>>(
      API_URLS.AUTH.RESEND_OTP,
      { email },
    );
    return res.data;
  },

  /**
   * Lấy thông tin cá nhân hiện tại
   */
  async getProfile(): Promise<ApiResponse<User>> {
    const res = await apiClient.get<ApiResponse<User>>(API_URLS.AUTH.PROFILE);
    return res.data;
  },

  /**
   * Cập nhật thông tin cá nhân
   */
  async updateProfile(payload: UpdateProfilePayload): Promise<ApiResponse<User>> {
    const res = await apiClient.put<ApiResponse<User>>(
      API_URLS.AUTH.PROFILE,
      payload,
    );
    return res.data;
  },

  /**
   * Đăng xuất
   */
  async logout(): Promise<ApiResponse<null>> {
    const res = await apiClient.post<ApiResponse<null>>(API_URLS.AUTH.LOGOUT);
    return res.data;
  },
};
