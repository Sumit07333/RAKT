// RaktNavi Central API Client & Service Gateway
// Encapsulates Fetch requests, response handling, error standardization, and Demo Mode switching.

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
export const IS_DEMO_MODE = import.meta.env.VITE_DEMO_MODE !== 'false';

/**
 * Standardized API request wrapper
 */
export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(options.headers || {})
  };

  const token = localStorage.getItem('raktnavi_operator_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
    
    const response = await fetch(url, {
      ...config,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      const errorMessage = data?.error?.message || data?.detail || `API error (${response.status})`;
      const error = new Error(errorMessage);
      error.status = response.status;
      error.details = data;
      throw error;
    }

    return data;
  } catch (err) {
    if (err.name === 'AbortError') {
      const timeoutError = new Error('Backend request timed out. Please check network connection.');
      timeoutError.isTimeout = true;
      throw timeoutError;
    }
    throw err;
  }
}
