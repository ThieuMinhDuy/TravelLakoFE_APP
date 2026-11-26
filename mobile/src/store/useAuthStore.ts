import { create } from 'zustand';
import type { User } from '@appTypes';
import { storageHelper } from '@helpers/storageHelper';
import { tokenStorage } from '@helpers/tokenStorage';
import { STORAGE_KEYS } from '@constants/storageKeys';
import { authService } from '@services/auth.service';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isInitialLoading: boolean;
  sessionError: string | null;
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  clearSession: () => Promise<void>;
  updateUser: (user: Partial<User>) => Promise<void>;
  refreshProfile: () => Promise<void>;
  initAuth: () => Promise<void>;
}
export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isInitialLoading: true,
  sessionError: null,
  login: async (token, user) => {
    if (!token.trim() || token === 'bearer_token_placeholder' || !user?._id)
      throw new Error('Thông tin đăng nhập không hợp lệ.');
    await tokenStorage.set(token);
    await storageHelper.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    set({
      token,
      user,
      isAuthenticated: true,
      isInitialLoading: false,
      sessionError: null,
    });
    await storageHelper.setItem(STORAGE_KEYS.USER_DATA, user);
  },
  clearSession: async () => {
    set({
      token: null,
      user: null,
      isAuthenticated: false,
      isInitialLoading: false,
      sessionError: null,
    });
    await Promise.all([
      tokenStorage.clear(),
      storageHelper.removeItem(STORAGE_KEYS.AUTH_TOKEN),
      storageHelper.removeItem(STORAGE_KEYS.USER_DATA),
    ]);
  },
  logout: async () => {
    try {
      await authService.logout();
    } finally {
      await get().clearSession();
    }
  },
  updateUser: async fields => {
    const current = get().user;
    if (!current) return;
    const user = { ...current, ...fields };
    set({ user });
    await storageHelper.setItem(STORAGE_KEYS.USER_DATA, user);
  },
  refreshProfile: async () => {
    const token = get().token;
    const user = await authService.getProfile();
    if (token && get().token === token) await get().updateUser(user);
  },
  initAuth: async () => {
    set({ isInitialLoading: true, sessionError: null });
    try {
      let token = await tokenStorage.get();
      if (!token) {
        const legacy = await storageHelper.getItem<string>(
          STORAGE_KEYS.AUTH_TOKEN,
        );
        if (legacy && legacy !== 'bearer_token_placeholder') {
          await tokenStorage.set(legacy);
          token = legacy;
        }
        await storageHelper.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      }
      if (!token) {
        await get().clearSession();
        return;
      }
      set({ token });
      const user = await authService.getProfile();
      if (get().token !== token) return;
      set({ user, isAuthenticated: true, isInitialLoading: false });
      await storageHelper.setItem(STORAGE_KEYS.USER_DATA, user);
    } catch (error) {
      if ((error as { statusCode?: number }).statusCode === 401) {
        await get().clearSession();
      } else {
        set({
          isInitialLoading: false,
          sessionError:
            'Không thể kiểm tra phiên đăng nhập. Kiểm tra kết nối và thử lại.',
        });
      }
    }
  },
}));
