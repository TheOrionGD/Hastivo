import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AvatarGuide from '../../components/common/AvatarGuide';
import UnavailableState from '../../components/common/UnavailableState';
import { adminService } from '../../services/adminService';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { PageContainer, EditorialHeader } from '../../components/cardless/CardlessComponents';

export default function AdminUserRestrictions() {
  const { token } = useAuth();
  const { notifySuccess, notifyCoralError } = useNotification();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionReason, setActionReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const refreshUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getUsers(token);
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const loadUsers = refreshUsers;

  useEffect(() => {
    let isMounted = true;
    const fetchUsers = async () => {
      try {
        const data = await adminService.getUsers(token);
        if (isMounted) {
          setUsers(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchUsers();
    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleUpdateRestriction = async (userId, payload) => {
    setSubmitting(true);
    try {
      await adminService.updateUserRestriction(userId, {
        ...payload,
        reason: actionReason || payload.reason || 'Administrator manual policy enforcement',
      });
      notifySuccess('User restriction updated successfully.');
      setActionReason('');
      setSelectedUser(null);
      await loadUsers();
    } catch (err) {
      notifyCoralError(err.message || 'Failed to update user restriction');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      u.email?.toLowerCase().includes(q) ||
      u.displayName?.toLowerCase().includes(q) ||
      u.username?.toLowerCase().includes(q) ||
      u.id?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="page-wrapper">
      <PageContainer maxWidth="1200px">
        <EditorialHeader
          kicker="User Access & Policy Enforcement"
          title="User Restrictions & Safety Controls"
          subtitle="Manage citizen privileges, apply translation limits, issue safety warning strikes, or suspend abusive accounts."
          actions={
            <div style={{ display: 'flex', gap: '10px' }}>
              <Link to="/admin/moderation" className="btn btn-secondary btn-sm" style={{ borderRadius: 'var(--radius-control)' }}>
                ← AI Moderation Queue
              </Link>
              <Link to="/admin/audit" className="btn btn-ghost btn-sm" style={{ borderRadius: 'var(--radius-control)' }}>
                Audit Records →
              </Link>
            </div>
          }
        />

        <AvatarGuide
          featureName="User Restrictions Management"
          description="Enforce platform safety by issuing warning strikes, restricting translation streaming, or suspending accounts. Every restriction change is permanently logged to the system audit records."
          pose="present"
        />

        {/* Search & Actions Bar */}
        <div
          style={{
            padding: '16px 0',
            marginBottom: '24px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          <div style={{ flex: '1', minWidth: '260px' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search user by email, name, or ID..."
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--input-radius)',
                border: '1px solid var(--border)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Total Users: <strong>{filteredUsers.length}</strong>
            </span>
            <button
              onClick={loadUsers}
              className="btn btn-ghost btn-xs"
              disabled={loading}
            >
              ↻ Refresh
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ padding: '20px 0', borderBottom: '1px solid var(--border)' }}>
                <div className="skeleton" style={{ width: '35%', height: '20px', marginBottom: '10px' }} />
                <div className="skeleton" style={{ width: '60%', height: '14px' }} />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <UnavailableState
            title="User Restrictions Service Unavailable"
            message={error}
            actionLabel="Retry Loading Users"
            onAction={loadUsers}
            iconType="error"
          />
        )}

        {/* Users Table / List */}
        {!loading && !error && filteredUsers.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {filteredUsers.map((u) => {
              const isRestricted = u.status === 'restricted';
              const isSuspended = u.status === 'suspended';
              const isWarned = u.status === 'warned';

              const statusBadge = isSuspended
                ? 'badge-coral'
                : isRestricted
                ? 'badge-coral'
                : isWarned
                ? 'badge-amber'
                : 'badge-blue';

              return (
                <div
                  key={u.id}
                  style={{
                    padding: '24px 0',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                      marginBottom: '12px',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                        <strong style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                          {u.displayName || u.username}
                        </strong>
                        <span className={`badge ${statusBadge}`} style={{ textTransform: 'uppercase' }}>
                          {u.status}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          Role: {u.role?.toUpperCase()}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                        {u.email} &bull; ID: <code>{u.id}</code>
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          padding: '4px 10px',
                          borderRadius: '8px',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          background: u.warningCount > 0 ? 'rgba(255, 193, 7, 0.15)' : 'var(--bg-secondary)',
                          color: u.warningCount > 0 ? 'var(--color-amber)' : 'var(--text-muted)',
                          border: '1px solid var(--border)',
                        }}
                      >
                        Strikes: {u.warningCount || 0} / 3
                      </span>
                    </div>
                  </div>

                  {/* Active Restrictions Tags */}
                  <div style={{ marginBottom: '16px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                      Active Restrictions:
                    </span>
                    {u.restrictions && u.restrictions.length > 0 ? (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {u.restrictions.map((r) => (
                          <span
                            key={r}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '4px 10px',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              background: 'rgba(255, 111, 97, 0.15)',
                              color: 'var(--color-coral)',
                              border: '1px solid var(--color-coral)',
                            }}
                          >
                            <span>🚫 {r.replace(/_/g, ' ')}</span>
                            <button
                              onClick={() => handleUpdateRestriction(u.id, { liftRestriction: r })}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--color-coral)',
                                cursor: 'pointer',
                                fontWeight: 800,
                                padding: 0,
                              }}
                              title="Lift this restriction"
                            >
                              ✕
                            </button>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        None (Unrestricted citizen access)
                      </span>
                    )}
                  </div>

                  {/* Restriction Controls Buttons */}
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      gap: '8px',
                      borderTop: '1px solid var(--border)',
                      paddingTop: '14px',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedUser(selectedUser?.id === u.id ? null : u);
                        setActionReason('');
                      }}
                      className="btn btn-ghost btn-xs"
                      style={{ color: 'var(--color-blue)' }}
                      title="Attach audit reason note to restriction"
                    >
                      📝 {selectedUser?.id === u.id ? 'Hide Note' : 'Add Note'}
                    </button>

                    <button
                      onClick={() => handleUpdateRestriction(u.id, { incrementWarning: true, status: 'warned' })}
                      disabled={submitting}
                      className="btn btn-ghost btn-xs"
                      style={{ color: 'var(--color-amber)' }}
                      title="Issue official community guidelines warning strike"
                    >
                      ⚠️ Issue Warning Strike
                    </button>

                    {!u.restrictions?.includes('translation_blocked') ? (
                      <button
                        onClick={() =>
                          handleUpdateRestriction(u.id, {
                            restriction: 'translation_blocked',
                            status: 'restricted',
                          })
                        }
                        disabled={submitting}
                        className="btn btn-secondary btn-xs"
                        style={{ color: 'var(--color-coral)' }}
                        title="Block live sign-to-text and text-to-sign access"
                      >
                        🚫 Block Translation
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          handleUpdateRestriction(u.id, {
                            liftRestriction: 'translation_blocked',
                          })
                        }
                        disabled={submitting}
                        className="btn btn-ghost btn-xs"
                        style={{ color: 'var(--color-blue)' }}
                      >
                        ✓ Unblock Translation
                      </button>
                    )}

                    {u.status !== 'suspended' ? (
                      <button
                        onClick={() =>
                          handleUpdateRestriction(u.id, {
                            status: 'suspended',
                            reason: 'Administrator suspended user account for severe violation',
                          })
                        }
                        disabled={submitting}
                        className="btn btn-primary btn-xs"
                        title="Fully suspend citizen account from logging in"
                      >
                        ⛔ Suspend Account
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          handleUpdateRestriction(u.id, {
                            status: 'active',
                            reason: 'Administrator lifted suspension',
                          })
                        }
                        disabled={submitting}
                        className="btn btn-ghost btn-xs"
                        style={{ color: 'var(--color-blue)' }}
                      >
                        ✓ Lift Suspension
                      </button>
                    )}

                    {u.status !== 'active' && (
                      <button
                        onClick={() =>
                          handleUpdateRestriction(u.id, {
                            status: 'active',
                            reason: 'Reset all strikes and restrictions to active',
                          })
                        }
                        disabled={submitting}
                        className="btn btn-ghost btn-xs"
                      >
                        Reset to Active
                      </button>
                    )}
                  </div>

                  {selectedUser?.id === u.id && (
                    <div
                      style={{
                        marginTop: '12px',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        background: 'var(--surface-elevated, var(--bg-secondary))',
                        border: '1px solid var(--border)',
                      }}
                    >
                      <label style={{ fontSize: '0.80rem', fontWeight: 600, display: 'block', marginBottom: '6px', color: 'var(--text-secondary)' }}>
                        Audit Note for {u.displayName || u.username}:
                      </label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                          type="text"
                          value={actionReason}
                          onChange={(e) => setActionReason(e.target.value)}
                          placeholder="Type specific policy reason before clicking restriction actions..."
                          style={{
                            flex: 1,
                            padding: '6px 12px',
                            fontSize: '0.84rem',
                            borderRadius: '6px',
                            border: '1px solid var(--border)',
                            background: 'var(--bg-primary)',
                            color: 'var(--text-primary)',
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setSelectedUser(null)}
                          className="btn btn-ghost btn-xs"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </PageContainer>
    </div>
  );
}
