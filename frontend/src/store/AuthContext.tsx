import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { User, RegisterRequest } from '../types/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (emailOrUsername: string, password: string) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<User>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  updateProfile: async () => ({ id: 0, username: '', email: '', role: 'STANDARD_PLANT_OWNER' }),
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // No /auth/me endpoint exists — restore session from localStorage only
    const checkAuthStatus = () => {
      try {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (token && storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Auth restore failed:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (emailOrUsername: string, password: string) => {
    const response = await authService.login(emailOrUsername, password);
    const authData = response.data;
    const token = authData?.token || authData?.accessToken;
    if (token) {
      const userObj = {
        id: authData.userId,
        username: authData.username,
        email: authData.email,
        role: authData.role,
      };
      localStorage.setItem('token', token);
      if (authData.refreshToken) {
        localStorage.setItem('refreshToken', authData.refreshToken);
      }
      localStorage.setItem('user', JSON.stringify(userObj));
      setUser(userObj);
    } else {
      throw new Error('Login failed: no token received');
    }
  };

  const register = async (userData: RegisterRequest) => {
    const response = await authService.register(userData);
    const authData = response.data;
    const token = authData?.token || authData?.accessToken;
    if (token) {
      const userObj = {
        id: authData.userId,
        username: authData.username,
        email: authData.email,
        role: authData.role,
      };
      localStorage.setItem('token', token);
      if (authData.refreshToken) {
        localStorage.setItem('refreshToken', authData.refreshToken);
      }
      localStorage.setItem('user', JSON.stringify(userObj));
      setUser(userObj);
    } else {
      throw new Error('Registration failed: no token received');
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  const updateProfile = async (userData: Partial<User>) => {
    const response = await authService.updateProfile(userData);
    const updated = response.data || ({ ...user, ...userData } as User);
    setUser(updated);
    localStorage.setItem('user', JSON.stringify(updated));
    return updated;
  };

  const contextValue = {
    user,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;
