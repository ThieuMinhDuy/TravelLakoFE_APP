import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { storageHelper } from '@helpers/storageHelper';
import { STORAGE_KEYS } from '@constants/storageKeys';
import { useAuthStore } from '@store/useAuthStore';
import type { ApiError } from '@appTypes';

/**
 * Configure standard Axios Request & Response Interceptors
 */
export const setupInterceptors = (axiosInstance: AxiosInstance): void => {
  // 1. Request Interceptor: Attach Bearer Token automatically
  axiosInstance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      try {
        const token = await storageHelper.getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (err) {
        console.warn('[Interceptor] Failed to attach token:', err);
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  // 2. Response Interceptor: Standardize error format and handle 401 Unauthorized
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<{ message?: string; errors?: Record<string, string[]> }>) => {
      const status = error.response?.status;

      // Handle 401: Token expired or invalid -> Log out automatically
      if (status === 401) {
        console.warn('[Interceptor] 401 Unauthorized detected. Logging out user.');
        await useAuthStore.getState().logout();
      }

      // Format a clean, uniform ApiError object
      const formattedError: ApiError = {
        message:
          error.response?.data?.message ||
          error.message ||
          'Đã có lỗi xảy ra. Vui lòng thử lại sau.',
        statusCode: status,
        errors: error.response?.data?.errors,
      };

      return Promise.reject(formattedError);
    },
  );
};
