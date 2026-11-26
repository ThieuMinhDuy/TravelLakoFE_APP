import type { AuthResponse, User } from '@appTypes';

export function parseUser(body: unknown): User {
  const wrapped = body as { data?: unknown; user?: unknown } | null;
  const data = (wrapped?.data ?? wrapped) as { user?: unknown } | null;
  const user = (data?.user ?? data) as User | null;
  if (!user || typeof user._id !== 'string' || typeof user.email !== 'string') {
    throw new Error('Máy chủ trả về hồ sơ không hợp lệ.');
  }
  // Flattened auth responses include a token beside user fields. Never copy
  // that token into USER_DATA, which is persisted outside secure storage.
  const safeUser = { ...user } as User & {
    token?: unknown;
    password?: unknown;
  };
  delete safeUser.token;
  delete safeUser.password;
  return safeUser;
}

export function parseAuthResponse(body: unknown): AuthResponse {
  const wrapped = body as { data?: unknown } | null;
  const data = (wrapped?.data ?? wrapped) as { token?: unknown } | null;
  if (
    typeof data?.token !== 'string' ||
    !data.token.trim() ||
    data.token === 'bearer_token_placeholder'
  ) {
    throw new Error(
      'Không thể xác thực phiên đăng nhập. Vui lòng thử lại hoặc liên hệ hỗ trợ.',
    );
  }
  return { token: data.token, user: parseUser(data) };
}
