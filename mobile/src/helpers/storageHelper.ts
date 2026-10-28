import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Storage Helper
 * Standardized abstraction over key-value persistence
 */
export const storageHelper = {
  /**
   * Save a string or object to storage
   */
  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      const serialized = typeof value === 'string' ? value : JSON.stringify(value);
      await AsyncStorage.setItem(key, serialized);
    } catch (error) {
      console.error(`[storageHelper] Error setting item for key ${key}:`, error);
    }
  },

  /**
   * Retrieve an item from storage
   */
  async getItem<T = string>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value === null) return null;

      try {
        return JSON.parse(value) as T;
      } catch {
        return value as unknown as T;
      }
    } catch (error) {
      console.error(`[storageHelper] Error getting item for key ${key}:`, error);
      return null;
    }
  },

  /**
   * Remove an item from storage
   */
  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`[storageHelper] Error removing item for key ${key}:`, error);
    }
  },

  /**
   * Clear all stored items
   */
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('[storageHelper] Error clearing storage:', error);
    }
  },
};

