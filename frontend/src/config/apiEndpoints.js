/**
 * Signora — Central Backend API Endpoints & Contract Registry
 * 
 * Defines all backend REST & WebSocket routes for:
 * 1. Authentication (Sign In, Registration, Session, SSO, Guest)
 * 2. Onboarding & User Preferences
 * 3. 3D Avatar Kinematics & ISL Lexicon
 * 4. System Health & Telemetry
 */

export const API_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) ||
  'http://localhost:5000';

export const WS_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_WS_URL) ||
  'ws://localhost:5000';

export const API_ENDPOINTS = {
  // ── Authentication Endpoints ──────────────────────────────────────────
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/v1/auth/login`,
    REGISTER: `${API_BASE_URL}/api/v1/auth/register`,
    LOGOUT: `${API_BASE_URL}/api/v1/auth/logout`,
    ME: `${API_BASE_URL}/api/v1/auth/me`,
    REFRESH_TOKEN: `${API_BASE_URL}/api/v1/auth/refresh`,
    GOOGLE_SSO: `${API_BASE_URL}/api/v1/auth/google`,
    ANONYMOUS: `${API_BASE_URL}/api/v1/auth/anonymous`,
  },

  // ── Onboarding & Preferences Endpoints ────────────────────────────────
  ONBOARDING: {
    STATUS: `${API_BASE_URL}/api/v1/onboarding/status`,
    COMPLETE: `${API_BASE_URL}/api/v1/onboarding/complete`,
    PREFERENCES: `${API_BASE_URL}/api/v1/user/preferences`,
  },

  // ── 3D Avatar & Kinematics Endpoints ──────────────────────────────────
  AVATAR: {
    MODELS: `${API_BASE_URL}/api/v1/avatar/models`,
    SIGNS: `${API_BASE_URL}/api/v1/avatar/signs`,
    SYNTHESIZE: `${API_BASE_URL}/api/v1/avatar/synthesize`,
    TELEMETRY: `${API_BASE_URL}/api/v1/avatar/telemetry`,
  },

  // ── Translation & Vision Endpoints ────────────────────────────────────
  TRANSLATION: {
    TEXT_TO_SIGN: `${API_BASE_URL}/api/v1/translation/text-to-sign`,
    SIGN_TO_TEXT: `${API_BASE_URL}/api/v1/translation/sign-to-text`,
    HISTORY: `${API_BASE_URL}/api/v1/conversations/history`,
    REALTIME_WS: `${WS_BASE_URL}/ws/v1/conversation`,
  },

  // ── Conversation Management Endpoints ─────────────────────────────────
  CONVERSATIONS: {
    HISTORY: `${API_BASE_URL}/api/v1/conversations/history`,
    SAVE: `${API_BASE_URL}/api/v1/conversations`,
    DELETE: (id) => `${API_BASE_URL}/api/v1/conversations/${id}`,
    CLEAR: `${API_BASE_URL}/api/v1/conversations/history`,
  },

  // ── User Profile & Preferences Endpoints ──────────────────────────────
  USER: {
    PROFILE: `${API_BASE_URL}/api/v1/user/profile`,
    PREFERENCES: `${API_BASE_URL}/api/v1/user/preferences`,
    THEME: `${API_BASE_URL}/api/v1/user/preferences/theme`,
  },

  // ── Administrator Endpoints ───────────────────────────────────────────
  ADMIN: {
    MODERATION_QUEUE: `${API_BASE_URL}/api/v1/admin/moderation/queue`,
    MODERATION_ALERTS: `${API_BASE_URL}/api/v1/admin/moderation/alerts`,
    MODERATION_ACTION: `${API_BASE_URL}/api/v1/admin/moderation/action`,
    USERS: `${API_BASE_URL}/api/v1/admin/users`,
    USER_RESTRICTION: (id) => `${API_BASE_URL}/api/v1/admin/users/${id}/restriction`,
    AUDIT_RECORDS: `${API_BASE_URL}/api/v1/admin/audit`,
  },

  // ── System Health & Gateway ───────────────────────────────────────────
  SYSTEM: {
    HEALTH: `${API_BASE_URL}/api/v1/health`,
    CONFIG: `${API_BASE_URL}/api/v1/config`,
    METRICS: `${API_BASE_URL}/api/v1/telemetry/metrics`,
  },
};

/**
 * Universal API Fetch Client
 * Handles Authorization headers, timeout aborts, and standard JSON responses.
 * 
 * @param {string} endpoint - Full URL or endpoint path
 * @param {RequestInit} [options] - Fetch options
 * @returns {Promise<{ ok: boolean, status: number, data: any, error?: string }>}
 */
export async function apiFetch(endpoint, options = {}) {
  const token = typeof sessionStorage !== 'undefined'
    ? sessionStorage.getItem('signora_auth_token')
    : null;

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const controller = new AbortController();
  const timeoutMs = options.timeout || 6000;
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(endpoint, {
      ...options,
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const data = isJson ? await response.json() : await response.text();

    return {
      ok: response.ok,
      status: response.status,
      data,
    };
  } catch (err) {
    clearTimeout(timeoutId);
    return {
      ok: false,
      status: 0,
      data: null,
      error: err.name === 'AbortError' ? 'Connection timed out' : (err.message || 'Network connection failed'),
    };
  }
}

export default API_ENDPOINTS;
