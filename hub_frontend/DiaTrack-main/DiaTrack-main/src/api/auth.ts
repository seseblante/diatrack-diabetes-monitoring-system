import { post } from './client';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

/**
 * Login a user with email and password
 * @param email User email
 * @param password User password
 * @returns Response containing user details and JWT token
 */
export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await post<AuthResponse>('/api/auth/login', { email, password });
  if (response.token) {
    localStorage.setItem('authToken', response.token);
    localStorage.setItem('currentUser', JSON.stringify(response.user));
  }
  return response;
}

/**
 * Register a new user
 * @param userData User registration data
 * @returns Response containing the created user
 */
export async function register(userData: {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  role: string;
  isConsentGiven: boolean;
}): Promise<User> {
  return await post<User>('/api/auth/register', userData);
}

/**
 * Get the current authentication token
 * @returns The JWT token or null if not authenticated
 */
export function getAuthToken(): string | null {
  return localStorage.getItem('authToken');
}

/**
 * Get HTTP headers with authentication token for API requests
 * @returns Headers object with Authorization if token exists
 */
export function getAuthHeader(): Record<string, string> {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Get the current user from localStorage
 * @returns The current user or null if not logged in
 */
export function getCurrentUser(): User | null {
  const userStr = localStorage.getItem('currentUser');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr) as User;
  } catch {
    return null;
  }
}

/**
 * Log out the current user
 */
export function logout(): void {
  localStorage.removeItem('authToken');
  localStorage.removeItem('currentUser');
}

/**
 * Check if user is authenticated
 * @returns true if user has an auth token
 */
export function isAuthenticated(): boolean {
  return !!getAuthToken();
}
