import axios from 'axios';
import { useAuthStore } from '../auth/auth.store';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor - attach auth token
axiosClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    
    if (response?.status === 401) {
      // Token expired or invalid - logout user
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    
    // Extract error message
    const message = response?.data?.message || error.message || 'An error occurred';
    
    return Promise.reject({
      status: response?.status,
      message,
      data: response?.data,
    });
  }
);

export default axiosClient;
