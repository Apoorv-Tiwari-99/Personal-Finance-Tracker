'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthContextType, User } from '@/types';
import { authService } from '@/services/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

 // Update the useEffect to verify token
useEffect(() => {
  const initAuth = async () => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          // Verify token is still valid
          const userData = await authService.getMe(storedToken);
          setUser(userData);
          setToken(storedToken);
        } catch (error) {
          // Token is invalid, clear storage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
        }
      }
    }
    setLoading(false);
  };

  initAuth();
}, []);

  const login = async (email: string, password: string) => {
    try {
      const { user: userData, token: userToken } = await authService.login(email, password);
      
      setUser(userData);
      setToken(userToken);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', userToken);
        localStorage.setItem('user', JSON.stringify(userData));
      }
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  };
  
  const register = async (name: string, email: string, password: string) => {
    try {
      const { user: userData, token: userToken } = await authService.register(name, email, password);
      
      setUser(userData);
      setToken(userToken);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', userToken);
        localStorage.setItem('user', JSON.stringify(userData));
      }
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};