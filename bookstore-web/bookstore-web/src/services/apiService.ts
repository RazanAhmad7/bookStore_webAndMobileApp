// apiService.ts - Centralized API service for handling HTTP requests

// Base URL for the backend API
const API_BASE_URL = 'http://localhost:5070/api'; // Updated to match Flutter config

// Generic fetch function with error handling
async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Default headers
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  // Merge default headers with any provided headers
  const headers = {
    ...defaultHeaders,
    ...options.headers,
  };

  // Create the full options object
  const config: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    
    // Handle different response status codes
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    // Parse JSON response
    const data: T = await response.json();
    return data;
  } catch (error) {
    // Re-throw the error for the caller to handle
    throw error;
  }
}

// API service functions
export const apiService = {
  // GET request
  get: <T>(endpoint: string) => fetchApi<T>(endpoint, { method: 'GET' }),
  
  // POST request
  post: <T>(endpoint: string, body: unknown) => 
    fetchApi<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  
  // PUT request
  put: <T>(endpoint: string, body: unknown) => 
    fetchApi<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),
  
  // DELETE request
  delete: <T>(endpoint: string) => fetchApi<T>(endpoint, { method: 'DELETE' }),
};