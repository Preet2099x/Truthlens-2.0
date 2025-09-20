// API configuration and utility functions for Truthlens backend
const API_BASE_URL = 'http://localhost:3000/api';

// Utility function to get auth token
export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Utility function to create headers with auth token
export const createAuthHeaders = (): Record<string, string> => {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return headers;
};

// Generic API call function with error handling
export const apiCall = async (
  endpoint: string, 
  options: RequestInit = {}
): Promise<any> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: createAuthHeaders(),
    ...options,
  };
  
  // If body is FormData, remove Content-Type header to let browser set it
  if (options.body instanceof FormData) {
    const headers = config.headers as Record<string, string>;
    delete headers['Content-Type'];
  }
  
  const response = await fetch(url, config);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP Error: ${response.status}`);
  }
  
  return response.json();
};

// Authentication API calls
export const authAPI = {
  signup: (userData: { name: string; email: string; password: string }) =>
    apiCall('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
    
  login: (credentials: { email: string; password: string }) =>
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
    
  me: () =>
    apiCall('/auth/me', {
      method: 'GET',
    }),
};

// Content verification API calls
export const verifyAPI = {
  text: (claim: string) =>
    apiCall('/verify', {
      method: 'POST',
      body: JSON.stringify({ claim }),
    }),
    
  image: (imageFile: File) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    return apiCall('/ocr', {
      method: 'POST',
      body: formData,
    });
  },
  
  url: (url: string) =>
    apiCall('/crawler', {
      method: 'POST',
      body: JSON.stringify({ url }),
    }),
};

export default {
  authAPI,
  verifyAPI,
  apiCall,
  getAuthToken,
  createAuthHeaders,
};