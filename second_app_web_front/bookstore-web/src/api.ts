// api.ts - Simple API service to connect to the backend

// Base URL for the backend API
const API_BASE_URL = 'http://localhost:5070/api';

// Function to fetch all users from the backend
export const fetchUsers = async (): Promise<any[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const users = await response.json();
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};