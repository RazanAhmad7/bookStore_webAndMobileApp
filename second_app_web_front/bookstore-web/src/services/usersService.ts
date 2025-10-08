// usersService.ts - Service for managing user data

import type { UserResponse } from './authService';
import { apiService } from './apiService';

// Users service functions
export const usersService = {
  // Get all users
  getAllUsers: async (): Promise<UserResponse[]> => {
    return await apiService.get<UserResponse[]>('/users');
  },

  // Get user by ID
  getUserById: async (id: number): Promise<UserResponse> => {
    return await apiService.get<UserResponse>(`/users/${id}`);
  },

  // Create a new user
  createUser: async (userData: Partial<UserResponse>): Promise<UserResponse> => {
    return await apiService.post<UserResponse>('/users', userData);
  },

  // Update user by ID
  updateUser: async (id: number, userData: Partial<UserResponse>): Promise<void> => {
    await apiService.put<void>(`/users/${id}`, userData);
  },

  // Delete user by ID
  deleteUser: async (id: number): Promise<void> => {
    await apiService.delete<void>(`/users/${id}`);
  },
};