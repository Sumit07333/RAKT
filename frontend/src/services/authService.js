// RaktNavi Authentication Service Layer
// Manages operator session in demo mode or future JWT exchange via FastAPI.

import { apiRequest, IS_DEMO_MODE } from './apiClient';

const TOKEN_KEY = 'raktnavi_operator_token';
const USER_KEY = 'raktnavi_operator_user';

export async function loginOperator({ email, password }) {
  if (IS_DEMO_MODE) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    // In demo mode, accept any non-empty credentials for evaluation
    const demoUser = {
      id: 'demo-op-01',
      name: 'Demonstration Operator',
      email: email.trim(),
      role: 'Blood Bank Operator',
      facilityId: 'fac-patna-01',
      facilityName: 'Patna Central Red Cross Blood Center',
      isDemoSession: true
    };

    const demoToken = `demo_jwt_${Date.now()}`;
    localStorage.setItem(TOKEN_KEY, demoToken);
    localStorage.setItem(USER_KEY, JSON.stringify(demoUser));

    return {
      success: true,
      token: demoToken,
      user: demoUser
    };
  }

  // API Mode
  const response = await apiRequest('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });

  if (response.token) {
    localStorage.setItem(TOKEN_KEY, response.token);
    localStorage.setItem(USER_KEY, JSON.stringify(response.user));
  }

  return response;
}

export function logoutOperator() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getCurrentOperator() {
  const userJson = localStorage.getItem(USER_KEY);
  if (!userJson) return null;
  try {
    return JSON.parse(userJson);
  } catch {
    return null;
  }
}

export function isOperatorAuthenticated() {
  return !!localStorage.getItem(TOKEN_KEY);
}
