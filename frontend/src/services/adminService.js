/**
 * Hastivo — Administrator Services Interface
 * 
 * Provides services for:
 * 1. AI Moderation Alerts & Flagged Content Management
 * 2. User Restrictions Management
 * 3. System & Security Audit Records Review
 */

import config from '../config/env';
import { API_ENDPOINTS, apiFetch } from '../config/apiEndpoints';

export const adminService = {
  isConfigured() {
    return !!config.apiBaseUrl;
  },

  /**
   * 1. Reviews AI moderation alerts & queue
   */
  async getModerationQueue(token) {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await apiFetch(API_ENDPOINTS.ADMIN.MODERATION_QUEUE, { headers });
    if (!res.ok) {
      throw new Error(`Failed to load AI moderation alerts: HTTP ${res.status}`);
    }
    return Array.isArray(res.data) ? res.data : [];
  },

  /**
   * 2. Manages flagged content (Approve, Remove, Escalate)
   */
  async resolveFlaggedContent(alertId, action, notes = '', token = null) {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await apiFetch(API_ENDPOINTS.ADMIN.MODERATION_ACTION, {
      method: 'POST',
      headers,
      body: JSON.stringify({ alertId, action, notes }),
    });
    if (!res.ok) {
      throw new Error(res.data?.message || `Failed to update flagged content: HTTP ${res.status}`);
    }
    return res.data;
  },

  /**
   * 3. Manages user restrictions
   */
  async getUsers(token) {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await apiFetch(API_ENDPOINTS.ADMIN.USERS, { headers });
    if (!res.ok) {
      throw new Error(`Failed to load users for restriction management: HTTP ${res.status}`);
    }
    return res.data?.users || [];
  },

  async updateUserRestriction(userId, { status, restriction, reason, incrementWarning, liftRestriction, durationHours }, token = null) {
    const endpoint = API_ENDPOINTS.ADMIN.USER_RESTRICTION(userId);
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await apiFetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({ status, restriction, reason, incrementWarning, liftRestriction, durationHours }),
    });
    if (!res.ok) {
      throw new Error(res.data?.message || `Failed to update user restriction: HTTP ${res.status}`);
    }
    return res.data;
  },

  async applyUserRestriction(userId, payload, token = null) {
    return this.updateUserRestriction(userId, payload, token);
  },

  /**
   * 4. Reviews audit records
   */
  async getAuditRecords(token) {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await apiFetch(API_ENDPOINTS.ADMIN.AUDIT_RECORDS, { headers });
    if (!res.ok) {
      throw new Error(`Failed to load audit records: HTTP ${res.status}`);
    }
    return res.data?.records || [];
  },

  async exportAuditRecords(format = 'csv') {
    const res = await fetch(`${config.apiBaseUrl}/api/v1/admin/audit/export?format=${format}`);
    if (!res.ok) {
      throw new Error(`Failed to export audit report: HTTP ${res.status}`);
    }
    const hash = res.headers.get('X-Audit-Hash-SHA256');
    const content = await res.text();
    return { content, hash, format };
  },
};

export default adminService;
