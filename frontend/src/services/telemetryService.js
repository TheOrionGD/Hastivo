/**
 * Signora — Admin Telemetry Service
 * Returns real system telemetry from backend.
 * Never invents fake traffic numbers, uptime, or error graphs.
 */
import config from '../config/env';

export const telemetryService = {
  isConfigured() {
    return config.isConfigured.api;
  },

  async getTelemetryMetrics(token) {
    if (!this.isConfigured()) {
      throw new Error('Telemetry service is not configured (missing VITE_API_BASE_URL).');
    }
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${config.apiBaseUrl}/api/v1/admin/telemetry`, {
      method: 'GET',
      headers,
    });
    if (!res.ok) {
      throw new Error(`Failed to retrieve telemetry metrics: HTTP ${res.status}`);
    }
    return await res.json();
  },
};
