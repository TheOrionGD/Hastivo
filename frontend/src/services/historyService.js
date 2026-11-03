/**
 * Hastivo — Conversation History Service
 * Retrieves genuine conversation records from MongoDB backend.
 * Never supplies fake conversations or simulated history.
 */
import config from '../config/env';

export const historyService = {
  isConfigured() {
    return config.isConfigured.api;
  },

  async getHistoryRecords(token) {
    if (!this.isConfigured()) {
      throw new Error('Conversation History service is not configured (missing VITE_API_BASE_URL).');
    }
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${config.apiBaseUrl}/api/v1/conversations/history`, {
      method: 'GET',
      headers,
    });
    if (!res.ok) {
      throw new Error(`Failed to load conversation history: HTTP ${res.status}`);
    }
    return await res.json();
  },
};
