/**
 * Hastivo Client Local Session Manager
 * Stores JWT authentication tokens, active user profile, and session state
 * backed by localStorage for standard local/MongoDB backend architecture.
 */

const TOKEN_KEY = "hastivo_auth_token";
const USER_KEY = "hastivo_auth_user";

type AuthListener = (user: any | null) => void;
const listeners = new Set<AuthListener>();

export const sessionManager = {
  getToken(): string | null {
    if (typeof window === "undefined") return null;
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },

  setSession(token: string, user: any) {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      listeners.forEach((fn) => fn(user));
    } catch {}
  },

  getUser(): any | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  clearSession() {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      listeners.forEach((fn) => fn(null));
    } catch {}
  },

  subscribe(callback: AuthListener) {
    listeners.add(callback);
    return () => {
      listeners.delete(callback);
    };
  },
};
