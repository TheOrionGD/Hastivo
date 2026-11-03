/**
 * Hastivo — Admin Moderation Service
 * Connects to genuine moderation queue endpoint.
 * Never creates dummy flagged items or simulated severity reviews.
 */
import config from '../config/env';

export const moderationService = {
  isConfigured() {
    return config.isConfigured.api;
  },

  async getModerationQueue(token) {
    if (!this.isConfigured()) {
      throw new Error('Moderation service is not configured (missing VITE_API_BASE_URL).');
    }
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${config.apiBaseUrl}/api/v1/admin/moderation/queue`, {
      method: 'GET',
      headers,
    });
    if (!res.ok) {
      throw new Error(`Failed to load moderation queue: HTTP ${res.status}`);
    }
    return await res.json();
  },

  async resolveFlaggedContent(alertId, action, notes = '', token) {
    if (!this.isConfigured()) {
      throw new Error('Moderation service is not configured.');
    }
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${config.apiBaseUrl}/api/v1/admin/moderation/action`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ alertId, action, notes }),
    });
    if (!res.ok) {
      throw new Error(`Failed to resolve flagged content: HTTP ${res.status}`);
    }
    return await res.json();
  },
};
