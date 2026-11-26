import type { AxiosError } from 'axios';

export function apiErrorMessage(
  error: AxiosError<{ message?: string }>,
): string {
  const message = error.response?.data?.message;
  // Preserve the backend's specific Vietnamese validation messages.
  if (typeof message === 'string' && /[À-ỹĐđ]/u.test(message)) return message;
  if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
    return 'Máy chủ phản hồi quá lâu. Vui lòng thử lại.';
  }
  if (!error.response)
    return 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra mạng và thử lại.';
  switch (error.response.status) {
    case 400:
    case 422:
      return 'Thông tin chưa hợp lệ. Vui lòng kiểm tra và thử lại.';
    case 401:
      return error.config?.url === '/auth/login'
        ? 'Email hoặc mật khẩu không đúng.'
        : 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.';
    case 403:
      return 'Bạn không có quyền thực hiện thao tác này.';
    case 404:
      return 'Không tìm thấy thông tin được yêu cầu.';
    case 409:
      return 'Thông tin đã tồn tại. Vui lòng kiểm tra lại.';
    case 413:
      return 'Tệp tải lên vượt quá dung lượng cho phép.';
    case 429:
      return 'Bạn đã thử quá nhiều lần. Vui lòng đợi và thử lại sau.';
    default:
      return 'Đã có lỗi xảy ra từ máy chủ. Vui lòng thử lại sau.';
  }
}
