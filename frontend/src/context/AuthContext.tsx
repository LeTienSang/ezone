import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  phone?: string;
  role: 'ADMIN' | 'TEACHER' | 'STUDENT' | 'GUEST';
  avatar?: string;
  isActive: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (fullName: string, email: string, phone: string, password: string) => Promise<any>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        setToken(savedToken);
        try {
          // Fetch current profile from backend to verify token and get user details
          const res = await api.get<User>('/api/v1/users/me');
          setUser(res.data);
        } catch (error) {
          console.error('Failed to restore authentication session:', error);
          // Token expired or invalid
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    setLoading(true);
    try {
      const res = await api.post<{ token: string; userId: number; fullName: string; role: string }>('/api/v1/auth/login', {
        email,
        password,
      });
      const { token: jwtToken } = res.data;
      
      localStorage.setItem('token', jwtToken);
      setToken(jwtToken);
      
      // Fetch complete user profile for state
      const profileRes = await api.get<User>('/api/v1/users/me');
      const currentUser = profileRes.data;
      
      setUser(currentUser);
      localStorage.setItem('user', JSON.stringify(currentUser));
      return currentUser;
    } catch (error) {
      setLoading(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (fullName: string, email: string, phone: string, password: string): Promise<any> => {
    setLoading(true);
    try {
      const res = await api.post('/api/v1/auth/register', {
        fullName,
        email,
        phone,
        password,
      });
      return res;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      // Best-effort logout call to backend
      await api.post('/api/v1/auth/logout').catch(() => {});
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
      setLoading(false);
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
