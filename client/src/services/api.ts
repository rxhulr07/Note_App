import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
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

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  // Signup
  signup: async (data: {
    name: string;
    email: string;
    dateOfBirth: string;
  }) => {
    const response = await api.post('/auth/signup', data);
    return response.data;
  },

  // Get OTP
  getOTP: async (data: { email: string }) => {
    const response = await api.post('/auth/get-otp', data);
    return response.data;
  },

  // Verify OTP
  verifyOTP: async (data: { email: string; otp: string }) => {
    const response = await api.post('/auth/verify-otp', data);
    return response.data;
  },

  // Google OAuth
  googleSignIn: async (googleToken: string) => {
    const response = await api.post('/auth/google/signin', { googleToken });
    return response.data;
  },

  googleSignUp: async (googleToken: string, dateOfBirth: string) => {
    const response = await api.post('/auth/google/signup', { googleToken, dateOfBirth });
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// User API calls
export const userAPI = {
  // Get profile
  getProfile: async () => {
    const response = await api.get('/user/profile');
    return response.data;
  },

  // Update profile
  updateProfile: async (data: { name?: string; dateOfBirth?: string }) => {
    const response = await api.put('/user/profile', data);
    return response.data;
  },

  // Delete profile
  deleteProfile: async () => {
    const response = await api.delete('/user/profile');
    return response.data;
  },
};

export default api;
