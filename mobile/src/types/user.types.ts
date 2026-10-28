/**
 * User & Authentication Models
 * Ref: docs/02_Data_Models.md
 */

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  phone: string;
  gender: 'Nam' | 'Nữ' | 'Khác' | '';
  dateOfBirth: string | null;
  travelPreferences: string[];
  favoriteBudget: 'Tiết kiệm' | 'Trung bình' | 'Cao cấp' | '';
  isVerified: boolean;
  isAdmin: boolean;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export interface UpdateProfilePayload {
  name?: string;
  avatar?: string;
  phone?: string;
  gender?: 'Nam' | 'Nữ' | 'Khác' | '';
  dateOfBirth?: string;
  travelPreferences?: string[];
  favoriteBudget?: 'Tiết kiệm' | 'Trung bình' | 'Cao cấp' | '';
  password?: string;
}

