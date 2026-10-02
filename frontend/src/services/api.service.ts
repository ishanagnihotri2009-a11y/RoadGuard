import { auth } from '../lib/firebase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export class ApiError extends Error {
  status?: number;
  data?: any;
  constructor(message: string, status?: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

interface FetchOptions extends RequestInit {
  timeoutMs?: number;
}

export const apiService = {
  async request<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { timeoutMs = 10000, ...fetchOptions } = options;
    const url = API_URL + endpoint;
    
    // Authorization header
    const headers = new Headers(fetchOptions.headers || {});
    if (auth.currentUser) {
      try {
        const token = await auth.currentUser.getIdToken();
        headers.set('Authorization', 'Bearer ' + token);
      } catch (err) {
        console.warn('Failed to get Firebase token', err);
      }
    }
    
    if (!headers.has('Content-Type') && !(fetchOptions.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }

    // Timeout handling
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
        signal: controller.signal
      });
      
      clearTimeout(id);

      // JSON error handling
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = null;
        }
        throw new ApiError(
          errorData?.message || errorData?.error || 'API Error', 
          response.status, 
          errorData
        );
      }

      return await response.json() as T;
    } catch (err: any) {
      clearTimeout(id);
      
      // Network failure / timeout handling
      if (err.name === 'AbortError') {
        throw new ApiError('Request timed out', 408);
      }
      if (err.message === 'Failed to fetch' || err instanceof TypeError) {
        throw new ApiError('Network connection failed. Backend might be unavailable.', 0);
      }
      
      throw err;
    }
  },

  get<T>(endpoint: string, options?: FetchOptions) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  },

  post<T>(endpoint: string, data?: any, options?: FetchOptions) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }
};




