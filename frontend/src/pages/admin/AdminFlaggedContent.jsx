import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { PageContainer, EditorialHeader } from '../../components/cardless/CardlessComponents';

/**
 * Hastivo — Flagged Content Screen (SRS Section 15.4)
 * UI:
 * - Flagged content list
 * - Search by content/user
 * - Filter by category & severity
 * - Review status (pending, approved, rejected, resolved)
 * - Detection reason & AI explanation
 * - Actions: View Content, Review Original Input, Approve, Reject Flag, Mark Resolved, Add Review Notes
 */
export default function AdminFlaggedContent() {
  const { token } = useAuth();
  const { notifySuccess, notifyCoralError } = useNotification();

  const [flags, setFlags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const [selectedFlag, setSelectedFlag] = useState(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadFlags = useCallback(async () => {
    setLoading(true);
    try {
      const items = await adminService.getModerationQueue(token);
      setFlags(Array.isArray(items) ? items : []);
    } catch (err) {
      notifyCoralError(`Failed to retrieve moderation alerts: ${err.message || 'Network error'}`);
    } finally {
      setLoading(false);
    }
  }, [token, notifyCoralError]);

  useEffect(() => {
    let isMounted = true;
    adminService.getModerationQueue(token)
      .then((items) => {
        if (isMounted) {
          setFlags(Array.isArray(items) ? items : []);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          notifyCoralError(`Failed to retrieve moderation alerts: ${err.message || 'Network error'}`);
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, [token, notifyCoralError]);

  const handleResolve = async (action) => {
    if (!selectedFlag) return;
    setIsSubmitting(true);
    try {
      await adminService.resolveFlaggedContent(selectedFlag.id, action, reviewNotes || `Admin marked as ${action}`);
      notifySuccess(`Flag #${selectedFlag.id} marked as [${action.toUpperCase()}]`);
      setSelectedFlag(null);
      setReviewNotes('');
      await loadFlags();
    } catch (err) {
      notifyCoralError(err.message || 'Action failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredFlags = flags.filter((f) => {
    if (filterSeverity !== 'all' && f.severity !== filterSeverity) return false;
    if (filterCategory !== 'all' && f.category !== filterCategory) return false;
    if (filterStatus !== 'all' && f.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchContent = f.content?.toLowerCase().includes(q);
      const matchUser = f.userEmail?.toLowerCase().includes(q) || f.userId?.toLowerCase().includes(q);
      const matchCat = f.category?.toLowerCase().includes(q);
      if (!matchContent && !matchUser && !matchCat) return false;
    }
    return true;
  });

  return (
    <div className="page-wrapper">
      <PageContainer maxWidth="1200px">
        <EditorialHeader
          kicker="AI Safety Signals"
          title="Flagged Content Review"
          subtitle="Review AI moderation detections across text, speech, and sign-language streams"
          actions={
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" onClick={loadFlags} className="btn btn-secondary btn-sm" style={{ borderRadius: 'var(--radius-control)' }}>
                🔄 Refresh Queue
              </button>
              <Link to="/admin" className="btn btn-ghost btn-sm" style={{ borderRadius: 'var(--radius-control)' }}>
                Admin Dashboard
              </Link>
            </div>
          }
        />

        {/* Filters & Search Toolbar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            alignItems: 'center',
            padding: '16px 0',
            borderBottom: '1px solid var(--border)',
            marginBottom: '24px',
          }}
        >
          <input
            type="text"
            placeholder="Search flagged content or user email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field"
            style={{ flex: '1 1 240px', padding: '9px 14px', fontSize: '0.88rem' }}
          />

          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="input-field"
            style={{ padding: '9px 12px', fontSize: '0.85rem' }}
          >
            <option value="all">All Severities</option>
            <option value="high">High Severity</option>
            <option value="medium">Medium Severity</option>
            <option value="low">Low Severity</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="input-field"
            style={{ padding: '9px 12px', fontSize: '0.85rem' }}
          >
            <option value="all">All Categories</option>
            <option value="gesture">Gestures & Poses</option>
            <option value="text">Text & Captions</option>
            <option value="speech">Voice & Audio</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input-field"
            style={{ padding: '9px 12px', fontSize: '0.85rem' }}
          >
            <option value="all">All Review Statuses</option>
            <option value="pending">Pending Review</option>
            <option value="approved">Approved (Safe)</option>
            <option value="removed">Removed / Restricted</option>
          </select>
        </div>

        {/* List of Flags */}
        {loading ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>Loading flagged records...</p>
        ) : filteredFlags.length === 0 ? (
          <div style={{ padding: '48px 0', textAlign: 'center', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontSize: '2.4rem', marginBottom: '8px' }}>🛡️</div>
            <h3 style={{ color: 'var(--text-primary)', margin: '0 0 6px', fontFamily: 'Outfit, sans-serif' }}>No Flagged Content Matching Filters</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0 }}>
              All community interaction streams and kinematic poses are within normal safe guidelines.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {filteredFlags.map((flag) => {
              const severityColor =
                flag.severity === 'high' ? 'var(--brand-coral)' : flag.severity === 'medium' ? 'var(--brand-yellow)' : 'var(--brand-blue)';
              return (
                <div
                  key={flag.id}
                  style={{
                    padding: '24px 0',
                    borderBottom: '1px solid var(--border)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span
                        style={{
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: `${severityColor}20`,
                          color: severityColor,
                        }}
                      >
                        {flag.severity}
                      </span>
                      <strong style={{ color: 'var(--text-primary)', fontSize: '0.96rem' }}>{flag.category}</strong>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>ID: {flag.id}</span>
                    </div>

                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {new Date(flag.timestamp).toLocaleString()}
                    </span>
                  </div>

                  {/* Flag Content Snippet */}
                  <div
                    style={{
                      padding: '12px 14px',
                      borderRadius: '8px',
                      background: 'rgba(0, 0, 0, 0.25)',
                      fontSize: '0.9rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.5,
                    }}
                  >
                    <strong>Captured Signal:</strong> "{flag.content}"
                  </div>

                  {/* AI Explanation & Detection Reason */}
                  <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                    <strong>Detection Reason:</strong> {flag.details || 'Confidence threshold exceeded by AI safety filter.'}
                  </div>

                  {/* Footer Bar & Actions */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '10px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      User: <strong style={{ color: 'var(--text-primary)' }}>{flag.userEmail || flag.userId}</strong>
                    </span>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => setSelectedFlag(flag)}
                        className="soft-pill-btn"
                        style={{ fontSize: '0.82rem', padding: '6px 14px' }}
                      >
                        Review & Take Action
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Action Modal */}
        {selectedFlag && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 99999,
              background: 'rgba(0, 0, 0, 0.75)',
              backdropFilter: 'blur(6px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
            }}
          >
            <div
              style={{
                width: '100%',
                maxWidth: '560px',
                background: 'var(--surface)',
                borderRadius: 'var(--radius-overlay)',
                border: '1px solid var(--border)',
                padding: '32px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
              }}
            >
              <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.3rem' }}>
                Moderation Action: #{selectedFlag.id}
              </h3>
              <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                Category: <strong>{selectedFlag.category}</strong> &bull; User: {selectedFlag.userEmail}
              </p>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Admin Review Notes
                </label>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Record explanation for this action..."
                  rows={3}
                  className="input-field"
                  style={{ width: '100%', padding: '10px', fontSize: '0.88rem' }}
                />
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setSelectedFlag(null)}
                  className="soft-pill-btn"
                  style={{ fontSize: '0.84rem' }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleResolve('approve')}
                  className="soft-pill-btn"
                  style={{ fontSize: '0.84rem', borderColor: '#34d399', color: '#34d399' }}
                >
                  ✓ Approve (Dismiss Flag)
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleResolve('remove')}
                  className="soft-pill-btn"
                  style={{ fontSize: '0.84rem', background: 'var(--color-coral)', borderColor: 'var(--color-coral)', color: '#ffffff' }}
                >
                  ✗ Reject & Restrict
                </button>
              </div>
            </div>
          </div>
        )}
      </PageContainer>
    </div>
  );
}
