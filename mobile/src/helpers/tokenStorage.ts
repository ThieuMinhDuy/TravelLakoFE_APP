import * as Keychain from 'react-native-keychain';
const options = { service: 'travellako.auth' };
export const tokenStorage = {
  async get(): Promise<string | null> {
    const credentials = await Keychain.getGenericPassword(options);
    return credentials ? credentials.password : null;
  },
  async set(token: string): Promise<void> {
    try {
      const saved = await Keychain.setGenericPassword('jwt', token, options);
      if (!saved) throw new Error();
    } catch {
      throw new Error(
        'Không thể lưu phiên đăng nhập an toàn. Vui lòng thử lại.',
      );
    }
  },
  async clear(): Promise<void> {
    await Keychain.resetGenericPassword(options);
  },
};
