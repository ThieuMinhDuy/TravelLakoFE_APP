import axios from 'axios';
import { Platform } from 'react-native';
import { setupInterceptors } from './interceptors';

/**
 * Default API Base URL
 * - Android Emulator uses 10.0.2.2 to reach host machine
 * - iOS Simulator uses localhost
 */
const DEFAULT_BASE_URL = Platform.select({
  android: 'http://10.0.2.2:5000/api',
  default: 'http://localhost:5000/api',
});

export const apiClient = axios.create({
  baseURL: DEFAULT_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Setup token injection and error interception
setupInterceptors(apiClient);

