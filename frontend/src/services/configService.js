/**
 * Signora — Service Configuration Interface
 * Manages service endpoint inspection and connectivity testing.
 * Distinguishes Electron desktop runtime from Web browser runtime.
 */
import config from '../config/env';

export const configService = {
  isElectron() {
    return (
      typeof window !== 'undefined' &&
      typeof window.process === 'object' &&
      window.process?.type === 'renderer'
    );
  },

  getCurrentApiAddress() {
    return config.apiBaseUrl || '';
  },

  async testConnection(targetUrl) {
    if (!targetUrl || !targetUrl.trim()) {
      return { status: 'NOT_CONFIGURED', message: 'No service address provided.' };
    }
    const cleanUrl = targetUrl.trim();
    try {
      new URL(cleanUrl);
    } catch {
      return { status: 'INVALID_ADDRESS', message: 'Supplied service address is not a valid URL.' };
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(`${cleanUrl}/api/health`, {
        method: 'GET',
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        return { status: 'REACHABLE', message: `Service reachable (HTTP ${res.status}).` };
      }
      return {
        status: 'ERROR',
        message: `Service responded with error HTTP ${res.status} ${res.statusText}`,
      };
    } catch (err) {
      if (err.name === 'AbortError') {
        return { status: 'TIMEOUT', message: 'Connection test timed out after 5000ms.' };
      }
      return {
        status: 'CONNECTION_REFUSED',
        message: `Connection failed: ${err.message || 'Network unreachable'}`,
      };
    }
  },
};
