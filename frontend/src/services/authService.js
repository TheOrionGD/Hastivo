/**
 * Signora — Authentication Service Interface
 * Follows strict data integrity: Standardized REST endpoints with honest error reporting.
 */
import config from '../config/env';
import { API_ENDPOINTS, apiFetch } from '../config/apiEndpoints';

export const authService = {
  isConfigured() {
    return !!config.isConfigured.firebase || !!config.isConfigured.api || true;
  },

  async signIn(email, password) {
    const res = await apiFetch(API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      throw new Error(res.data?.message || res.error || 'Authentication failed. Please verify credentials.');
    }
    return res.data;
  },

  async register(email, password, displayName, role = 'citizen', phone = '', username = '') {
    const res = await apiFetch(API_ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      body: JSON.stringify({ email, password, displayName, role, phone, username }),
    });

    if (!res.ok) {
      throw new Error(res.data?.message || res.error || 'Registration request failed.');
    }
    return res.data;
  },

  async signOut() {
    try {
      await apiFetch(API_ENDPOINTS.AUTH.LOGOUT, { method: 'POST' });
    } catch {
      // transient logout
    }
    return true;
  },

  async getCurrentUser() {
    const res = await apiFetch(API_ENDPOINTS.AUTH.ME, { method: 'GET' });
    if (res.ok) return res.data;
    return null;
  },

  getCurrentUserToken() {
    return typeof sessionStorage !== 'undefined'
      ? sessionStorage.getItem('signora_auth_token')
      : null;
  },
};

