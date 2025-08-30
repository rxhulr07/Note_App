import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authAPI } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  isEmailVerified: boolean;
  lastLogin?: string;
  authMethod?: 'email' | 'google';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signup: (name: string, email: string, dateOfBirth: string) => Promise<void>;
  getOTP: (email: string) => Promise<void>;
  verifyOTP: (email: string, otp: string) => Promise<void>;
  googleSignIn: (googleToken: string) => Promise<void>;
  googleSignUp: (googleToken: string, dateOfBirth: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
          const response = await authAPI.getCurrentUser();
          if (response.success) {
            setUser(response.data.user);
            setToken(storedToken);
          } else {
            localStorage.removeItem('token');
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const signup = async (name: string, email: string, dateOfBirth: string) => {
    try {
      const response = await authAPI.signup({ name, email, dateOfBirth });
      
      if (!response.success) {
        throw new Error(response.message || 'Signup failed');
      }
      
      // Don't automatically log in after signup - user needs to verify OTP
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Signup failed');
    }
  };

  const getOTP = async (email: string) => {
    try {
      setIsLoading(true);
      const response = await authAPI.getOTP({ email });
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to send OTP');
      }
      
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (email: string, otp: string) => {
    try {
      setIsLoading(true);
      const response = await authAPI.verifyOTP({ email, otp });
      
      if (response.success) {
        setUser(response.data.user);
        setToken(response.data.token);
        localStorage.setItem('token', response.data.token);
      } else {
        throw new Error(response.message || 'OTP verification failed');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'OTP verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const googleSignIn = async (googleToken: string) => {
    try {
      setIsLoading(true);
      const response = await authAPI.googleSignIn(googleToken);
      
      if (response.success) {
        setUser(response.data.user);
        setToken(response.data.token);
        localStorage.setItem('token', response.data.token);
      } else {
        throw new Error(response.message || 'Google sign in failed');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Google sign in failed');
    } finally {
      setIsLoading(false);
    }
  };

  const googleSignUp = async (googleToken: string, dateOfBirth: string) => {
    try {
      setIsLoading(true);
      const response = await authAPI.googleSignUp(googleToken, dateOfBirth);
      
      if (response.success) {
        setUser(response.data.user);
        setToken(response.data.token);
        localStorage.setItem('token', response.data.token);
      } else {
        throw new Error(response.message || 'Google sign up failed');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Google sign up failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token,
    signup,
    getOTP,
    verifyOTP,
    googleSignIn,
    googleSignUp,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
