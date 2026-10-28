import { create } from 'zustand';
import type { User } from '@appTypes';
import { storageHelper } from '@helpers/storageHelper';
import { STORAGE_KEYS } from '@constants/storageKeys';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isInitialLoading: boolean;

  // Actions
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: Partial<User>) => Promise<void>;
  initAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isInitialLoading: true,

  login: async (token: string, user: User) => {
    await storageHelper.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    await storageHelper.setItem(STORAGE_KEYS.USER_DATA, user);
    set({
      token,
      user,
      isAuthenticated: true,
      isInitialLoading: false,
    });
  },

  logout: async () => {
    await storageHelper.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    await storageHelper.removeItem(STORAGE_KEYS.USER_DATA);
    set({
      token: null,
      user: null,
      isAuthenticated: false,
      isInitialLoading: false,
    });
  },

  updateUser: async (updatedFields: Partial<User>) => {
    const currentUser = get().user;
    if (!currentUser) return;

    const newUser = { ...currentUser, ...updatedFields };
    await storageHelper.setItem(STORAGE_KEYS.USER_DATA, newUser);
    set({ user: newUser });
  },

  initAuth: async () => {
    try {
      const [token, user] = await Promise.all([
        storageHelper.getItem<string>(STORAGE_KEYS.AUTH_TOKEN),
        storageHelper.getItem<User>(STORAGE_KEYS.USER_DATA),
      ]);

      if (token && user) {
        set({
          token,
          user,
          isAuthenticated: true,
          isInitialLoading: false,
        });
      } else {
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          isInitialLoading: false,
        });
      }
    } catch {
      set({
        token: null,
        user: null,
        isAuthenticated: false,
        isInitialLoading: false,
      });
    }
  },
}));
