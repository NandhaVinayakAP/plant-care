import axios from 'axios';
import { ApiResponse } from '../types/api';
import { User, RegisterRequest, AuthResponse } from '../types/auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Clear auth data on 401 (no /auth/refresh endpoint exists in backend)
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (emailOrUsername: string, password: string) => {
    const response = await api.post<ApiResponse<AuthResponse>>(
      '/auth/login',
      { username: emailOrUsername, password }
    );
    return response.data;
  },
  
  register: async (userData: RegisterRequest) => {
    const response = await api.post<ApiResponse<AuthResponse>>(
      '/auth/register',
      userData
    );
    return response.data;
  },
  
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.warn('Logout API failed:', e);
    }
  },
  
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<ApiResponse<User>>('/auth/me');
    return response.data?.data || (response.data as any);
  },
  
  updateProfile: async (userData: Partial<User>) => {
    const response = await api.put<ApiResponse<User>>('/auth/profile', userData);
    return response.data;
  },
};

export { api };
export default authService;
