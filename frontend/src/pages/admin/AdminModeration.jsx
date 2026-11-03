import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import AvatarGuide from '../../components/common/AvatarGuide';
import UnavailableState from '../../components/common/UnavailableState';
import { adminService } from '../../services/adminService';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { PageContainer, EditorialHeader, CardlessBadge } from '../../components/cardless/CardlessComponents';

export default function AdminModeration() {
  const { token } = useAuth();
  const { notifySuccess, notifyCoralError } = useNotification();
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [processingId, setProcessingId] = useState(null);

  const loadQueue = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const items = await adminService.getModerationQueue(token);
      setQueue(Array.isArray(items) ? items : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    let isMounted = true;
    adminService.getModerationQueue(token)
      .then((items) => {
        if (isMounted) {
          setQueue(Array.isArray(items) ? items : []);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleAction = async (alertId, action) => {
    setProcessingId(alertId);
    try {
      await adminService.resolveFlaggedContent(alertId, action, `Admin marked as ${action}`);
      notifySuccess(`Flagged item ${alertId} updated: [${action.toUpperCase()}]`);
      await loadQueue();
    } catch (err) {
      notifyCoralError(err.message || `Failed to perform action '${action}'`);
    } finally {
      setProcessingId(null);
    }
  };

  const filteredQueue = queue.filter((item) => {
    if (filterSeverity !== 'all' && item.severity !== filterSeverity) return false;
    if (filterStatus !== 'all' && item.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="page-wrapper">
      <PageContainer maxWidth="1050px">
        <EditorialHeader
          eyebrow="MODERATION QUEUE"
          title="AI Moderation Alerts &amp; Flagged Content"
          subtitle="Review automated AI safety alerts, inspect flagged sign gestures and text, and enforce platform guidelines."
          actions={
            <div style={{ display: 'flex', gap: '10px' }}>
              <Link to="/admin/restrictions" className="btn btn-secondary btn-sm">
                User Restrictions &rarr;
              </Link>
              <Link to="/admin" className="btn btn-ghost btn-sm">
                Admin Portal
              </Link>
            </div>
          }
        />

        <AvatarGuide
          featureName="AI Safety Moderation Engine"
          description="The AI moderation engine analyzes MediaPipe sign kinematics and Groq conversation streams. Flagged content triggers alerts with confidence scores and recommended actions."
          pose="thinking"
        />

        {/* Filter Toolbar (Cardless) */}
        <div
          style={{
            padding: '16px 0',
            marginBottom: '28px',
            borderBottom: '1px solid var(--border-subtle, var(--border))',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-secondary)' }}>
              Severity:
            </span>
            {['all', 'high', 'medium', 'low'].map((sev) => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`btn btn-xs ${filterSeverity === sev ? 'btn-primary' : 'btn-ghost'}`}
                style={{ textTransform: 'capitalize', borderRadius: 'var(--radius-control)' }}
              >
                {sev}
              </button>
            ))}

            <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-secondary)', marginLeft: '12px' }}>
              Status:
            </span>
            {['all', 'pending', 'approved', 'removed'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`btn btn-xs ${filterStatus === st ? 'btn-secondary' : 'btn-ghost'}`}
                style={{ textTransform: 'capitalize', borderRadius: 'var(--radius-control)' }}
              >
                {st}
              </button>
            ))}
          </div>

          <button
            onClick={loadQueue}
            className="btn btn-ghost btn-xs"
            disabled={loading}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', borderRadius: 'var(--radius-control)' }}
          >
            <span>↻</span> Refresh Alerts
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ padding: '24px 0', borderBottom: '1px solid var(--border)' }}>
                <div className="skeleton" style={{ width: '40%', height: '22px', marginBottom: '12px' }} />
                <div className="skeleton" style={{ width: '90%', height: '14px', marginBottom: '8px' }} />
                <div className="skeleton" style={{ width: '60%', height: '14px' }} />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <UnavailableState
            title="Moderation Service Unavailable"
            message={error}
            actionLabel="Retry Loading Queue"
            onAction={loadQueue}
            iconType="error"
          />
        )}

        {/* Empty State */}
        {!loading && !error && filteredQueue.length === 0 && (
          <div style={{ padding: '48px 0', textAlign: 'center', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🛡️</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
              Moderation Queue is Clear
            </h3>
            <p style={{ fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto' }}>
              No items match your active filters. The backend reports zero pending flagged content violations.
            </p>
          </div>
        )}

        {/* Real Queue Items */}
        {!loading && !error && filteredQueue.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {filteredQueue.map((item, idx) => {
              const isHighSeverity = item.severity === 'high';
              const isMediumSeverity = item.severity === 'medium';
              const badgeColor = isHighSeverity
                ? 'var(--color-coral)'
                : isMediumSeverity
                ? 'var(--color-amber)'
                : 'var(--color-blue)';
              const isPending = !item.status || item.status === 'pending';
              const isProcessing = processingId === item.id;

              return (
                <div
                  key={item.id || idx}
                  style={{
                    padding: '24px 0',
                    borderBottom: '1px solid var(--border)',
                    background: 'transparent',
                  }}
                >
                  {/* Top Bar */}
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                      marginBottom: '14px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span
                        style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          background: badgeColor,
                          boxShadow: `0 0 8px ${badgeColor}`,
                        }}
                      />
                      <strong style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                        Alert {item.id}
                      </strong>
                      <span
                        style={{
                          padding: '2px 8px',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          background: 'var(--bg-secondary)',
                          color: 'var(--text-secondary)',
                          border: '1px solid var(--border)',
                        }}
                      >
                        {item.category || 'Content Safety'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {item.aiConfidence && (
                        <span
                          style={{
                            padding: '3px 8px',
                            borderRadius: '99px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            background: 'rgba(255, 255, 255, 0.05)',
                            color: 'var(--text-muted)',
                            border: '1px solid var(--border)',
                          }}
                        >
                          AI Confidence: {Math.round(item.aiConfidence * 100)}%
                        </span>
                      )}

                      <CardlessBadge
                        color={isHighSeverity ? 'coral' : isMediumSeverity ? 'amber' : 'blue'}
                      >
                        {item.severity} Severity
                      </CardlessBadge>

                      <CardlessBadge
                        color={
                          item.status === 'approved'
                            ? 'blue'
                            : item.status === 'removed'
                            ? 'coral'
                            : 'amber'
                        }
                      >
                        {item.status || 'pending'}
                      </CardlessBadge>
                    </div>
                  </div>

                  {/* Flagged Content Box */}
                  <div
                    style={{
                      background: 'var(--bg-secondary)',
                      borderRadius: 'var(--input-radius)',
                      padding: '14px 18px',
                      marginBottom: '14px',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: 'var(--text-muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        display: 'block',
                        marginBottom: '4px',
                      }}
                    >
                      Flagged Interaction / Token Stream
                    </span>
                    <p
                      style={{
                        margin: 0,
                        fontSize: '0.95rem',
                        color: 'var(--text-primary)',
                        fontFamily: 'monospace',
                        fontWeight: 500,
                      }}
                    >
                      {item.content || 'Non-verbal landmark posture violation.'}
                    </p>
                  </div>

                  {/* AI Rationale & Metadata */}
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px', lineHeight: 1.5 }}>
                    <strong>AI Safety Rationale:</strong> {item.details || 'Detected violation of platform sign guidelines.'}
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '16px',
                      borderTop: '1px solid var(--border)',
                      paddingTop: '16px',
                    }}
                  >
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      <span>User ID: <strong>{item.userId || 'usr_unknown'}</strong></span>
                      {item.userEmail && <span> &bull; {item.userEmail}</span>}
                      <span> &bull; {item.timestamp ? new Date(item.timestamp).toLocaleString() : 'N/A'}</span>
                    </div>

                    {/* Content Management Action Buttons */}
                    {isPending ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          onClick={() => handleAction(item.id, 'approve')}
                          disabled={isProcessing}
                          className="btn btn-ghost btn-xs"
                          style={{ color: 'var(--color-blue)', borderColor: 'var(--color-blue)' }}
                          title="Mark content as safe and dismiss alert"
                        >
                          ✓ Approve (Mark Safe)
                        </button>

                        <button
                          onClick={() => handleAction(item.id, 'remove')}
                          disabled={isProcessing}
                          className="btn btn-secondary btn-xs"
                          style={{ color: 'var(--color-coral)' }}
                          title="Remove or redact content from platform"
                        >
                          ✕ Remove Content
                        </button>

                        <button
                          onClick={() => handleAction(item.id, 'escalate')}
                          disabled={isProcessing}
                          className="btn btn-primary btn-xs"
                          title="Escalate to senior review"
                        >
                          ! Escalate
                        </button>

                        <Link
                          to="/admin/restrictions"
                          className="btn btn-ghost btn-xs"
                          title="Manage user restrictions"
                        >
                          Restrict User &rarr;
                        </Link>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.80rem', fontWeight: 600, color: 'var(--color-blue)' }}>
                          Status: {(item.status || 'Resolved').toUpperCase()}
                        </span>
                        <Link
                          to="/admin/restrictions"
                          className="btn btn-ghost btn-xs"
                          title="Manage user restrictions"
                        >
                          Manage Restrictions &rarr;
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </PageContainer>
    </div>
  );
}
