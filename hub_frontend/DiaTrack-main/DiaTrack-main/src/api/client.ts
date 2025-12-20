import { getAuthHeader } from './auth';

// Base URL for all API calls - use environment variable if available, otherwise default
// @ts-ignore
const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL ?? 'http://localhost:8080';

/**
 * Generic request handler for API calls
 * @param path - Endpoint path (e.g., "/api/auth/login") 
 * @param options - Fetch options like method, headers, body
 * @returns Promise with JSON response
 */
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  // Construct the full URL and send request
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
      ...(options.headers || {}),
    },
    // Include credentials for cookies/session if needed
    credentials: 'include',
    ...options,
  });

  // Handle non-2xx responses
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed with status ${res.status}`);
  }

  return res.json();
}

/**
 * Helper for GET requests
 */
export function get<T>(path: string) {
  return request<T>(path);
}

/**
 * Helper for POST requests with JSON body
 */
export function post<T>(path: string, body: unknown, extra?: RequestInit) {
  return request<T>(path, {
    method: 'POST',
    body: JSON.stringify(body),
    ...extra,
  });
}

/**
 * Helper for PUT requests with JSON body
 */
export function put<T>(path: string, body: unknown, extra?: RequestInit) {
  return request<T>(path, {
    method: 'PUT',
    body: JSON.stringify(body),
    ...extra,
  });
}

/**
 * Helper for DELETE requests
 */
export function del<T = void>(path: string, extra?: RequestInit) {
  return request<T>(path, {
    method: 'DELETE',
    ...extra,
  });
}