import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types/auth';
import authService from '../services/authService';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await authService.login(email, password);
      localStorage.setItem('token', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      setUser(response.data.user);
      navigate('/');
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const register = useCallback(async (userData: any) => {
    try {
      setLoading(true);
      const response = await authService.register(userData);
      localStorage.setItem('token', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      setUser(response.data.user);
      navigate('/');
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      setUser(null);
      navigate('/login');
    }
  }, [navigate]);

  const updateProfile = useCallback(async (userData: Partial<User>) => {
    try {
      const response = await authService.updateProfile(userData);
      setUser(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }, []);


  return {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
  };
};

export default useAuth;