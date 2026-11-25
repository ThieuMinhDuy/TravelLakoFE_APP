import axios from 'axios';
import { setupInterceptors } from './interceptors';

export const API_BASE_URL = 'https://travellako-backend.onrender.com/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, 
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Setup token injection and error interception
setupInterceptors(apiClient);
