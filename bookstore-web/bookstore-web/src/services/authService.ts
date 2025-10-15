// authService.ts - Authentication service for handling login, registration, and user management

import { apiService } from './apiService';

// Define TypeScript interfaces for our data models
export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  token: string;
  user: UserResponse;
  message: string;
}

// Authentication service functions
export const authService = {
  // User login
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    return await apiService.post<AuthResponse>('/auth/login', credentials);
  },

  // User registration
  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    return await apiService.post<AuthResponse>('/auth/register', userData);
  },

  // Get current user information
  getCurrentUser: async (): Promise<UserResponse> => {
    return await apiService.get<UserResponse>('/auth/me');
  },

  // Logout (client-side only - just clears token)
  logout: (): void => {
    localStorage.removeItem('token');
  },

  // Store token in localStorage
  setToken: (token: string): void => {
    localStorage.setItem('token', token);
  },

  // Get token from localStorage
  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const token = authService.getToken();
    return !!token;
  },
};