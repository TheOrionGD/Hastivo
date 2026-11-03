import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { PageContainer, EditorialHeader } from '../../components/cardless/CardlessComponents';

/**
 * Hastivo AI — Administrator User Management Screen (SRS Section 15.5 & 15.6)
 * Display:
 * - User identifier, username, full name, email, account status, registration date
 * - Moderation & restriction history
 * Actions:
 * - Apply Temporary Block (24 hours per SRS 15.6)
 * - Apply Temporary Suspension (7 days per SRS 15.6)
 * - Restore Account
 * - Extend Restriction
 */
export default function AdminUsers() {
  const { token } = useAuth();
  const { notifySuccess, notifyCoralError } = useNotification();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal State for Applying Restriction
  const [targetUser, setTargetUser] = useState(null);
  const [restrictionType, setRestrictionType] = useState('temporary-block'); // 'temporary-block' (24h) | 'temporary-suspension' (7d)
  const [restrictionReason, setRestrictionReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const refreshUsers = async () => {
    setLoading(true);
    try {
      const data = await adminService.getUsers(token);
      setUsers(Array.isArray(data?.users) ? data.users : []);
    } catch {
      notifyCoralError('Failed to load registered users.');
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
          setUsers(Array.isArray(data?.users) ? data.users : []);
        }
      } catch {
        if (isMounted) notifyCoralError('Failed to load registered users.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchUsers();
    return () => {
      isMounted = false;
    };
  }, [token, notifyCoralError]);

  const handleApplyRestriction = async (e) => {
    e.preventDefault();
    if (!targetUser || !restrictionReason.trim()) {
      notifyCoralError('Please provide a reason for the restriction.');
      return;
    }

    setIsSubmitting(true);
    try {
      const status = restrictionType === 'temporary-suspension' ? 'suspended' : 'restricted';
      await adminService.applyUserRestriction(targetUser.id, {
        status,
        restriction: restrictionType,
        reason: restrictionReason.trim(),
        durationHours: restrictionType === 'temporary-suspension' ? 168 : 24, // 7 days vs 24 hours
      });

      notifySuccess(
        `Applied ${restrictionType === 'temporary-suspension' ? '7-Day Suspension' : '24-Hour Block'} to ${targetUser.email}`
      );
      setTargetUser(null);
      setRestrictionReason('');
      await loadUsers();
    } catch (err) {
      notifyCoralError(err.message || 'Failed to update user restriction.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRestoreAccount = async (u) => {
    if (!window.confirm(`Restore account privileges for ${u.email}?`)) return;

    try {
      await adminService.applyUserRestriction(u.id, {
        status: 'active',
        liftRestriction: u.restrictions?.[0] || 'temporary-block',
        reason: 'Restored by administrator review.',
      });
      notifySuccess(`Account active status restored for ${u.email}`);
      await loadUsers();
    } catch {
      notifyCoralError('Failed to restore account.');
    }
  };

  const filteredUsers = users.filter((u) => {
    if (statusFilter !== 'all' && u.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchEmail = u.email?.toLowerCase().includes(q);
      const matchName = u.displayName?.toLowerCase().includes(q);
      const matchUname = u.username?.toLowerCase().includes(q);
      if (!matchEmail && !matchName && !matchUname) return false;
    }
    return true;
  });

  return (
    <div className="page-wrapper">
      <PageContainer maxWidth="1100px">
        {/* Header */}
        <EditorialHeader
          eyebrow="USER MANAGEMENT"
          title="User Account Management"
          subtitle="Review citizen accounts, apply 24-hr blocks or 7-day suspensions, and maintain audit accountability"
          actions={
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <Link to="/admin" style={{ color: 'var(--color-blue)', textDecoration: 'none', fontSize: '0.86rem', fontWeight: 600 }}>
                ← Back to Admin Dashboard
              </Link>
              <button type="button" onClick={loadUsers} className="soft-pill-btn" style={{ fontSize: '0.84rem' }}>
                🔄 Refresh Users
              </button>
            </div>
          }
        />

        {/* Search & Filter Bar */}
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
            placeholder="Search by name, email, or username..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field"
            style={{
              flex: '1 1 240px',
              padding: '10px 14px',
              fontSize: '0.88rem',
              borderRadius: 'var(--radius-control)',
              border: '1px solid var(--border)',
              background: 'var(--background-secondary)',
              color: 'var(--text-primary)',
            }}
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field"
            style={{
              padding: '10px 14px',
              fontSize: '0.85rem',
              borderRadius: 'var(--radius-control)',
              border: '1px solid var(--border)',
              background: 'var(--background-secondary)',
              color: 'var(--text-primary)',
            }}
          >
            <option value="all">All Account Statuses</option>
            <option value="active">Active Accounts</option>
            <option value="warned">Warned Accounts</option>
            <option value="restricted">Restricted (24h Block)</option>
            <option value="suspended">Suspended (7d Suspension)</option>
          </select>
        </div>

        {/* Users Table */}
        <div style={{ overflowX: 'auto', borderBottom: '1px solid var(--border)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '14px 18px', color: 'var(--text-secondary)' }}>User Details</th>
                <th style={{ padding: '14px 18px', color: 'var(--text-secondary)' }}>Role</th>
                <th style={{ padding: '14px 18px', color: 'var(--text-secondary)' }}>Status</th>
                <th style={{ padding: '14px 18px', color: 'var(--text-secondary)' }}>Registered</th>
                <th style={{ padding: '14px 18px', color: 'var(--text-secondary)', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Loading user records...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No users matching search filters.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isRestricted = u.status === 'restricted' || u.status === 'suspended';
                  return (
                    <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{u.displayName}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{u.email} &bull; @{u.username}</div>
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        <span style={{ textTransform: 'capitalize', color: u.role === 'admin' ? 'var(--color-coral)' : 'var(--text-secondary)' }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        <span
                          style={{
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            background:
                              u.status === 'active'
                                ? 'rgba(52, 211, 153, 0.15)'
                                : u.status === 'suspended'
                                ? 'rgba(239, 68, 68, 0.2)'
                                : 'rgba(255, 193, 7, 0.2)',
                            color:
                              u.status === 'active'
                                ? '#34d399'
                                : u.status === 'suspended'
                                ? '#f87171'
                                : 'var(--color-amber)',
                          }}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td style={{ padding: '14px 18px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          {isRestricted ? (
                            <button
                              type="button"
                              onClick={() => handleRestoreAccount(u)}
                              className="soft-pill-btn"
                              style={{ fontSize: '0.78rem', padding: '5px 12px', borderColor: '#34d399', color: '#34d399' }}
                            >
                              Restore Account
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setTargetUser(u)}
                              className="soft-pill-btn"
                              style={{ fontSize: '0.78rem', padding: '5px 12px', borderColor: 'var(--color-coral)', color: 'var(--color-coral)' }}
                            >
                              Apply Restriction
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Restriction Modal Dialog */}
        {targetUser && (
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
                maxWidth: '520px',
                background: 'var(--surface)',
                borderRadius: 'var(--radius-overlay)',
                border: '1px solid var(--border)',
                padding: '32px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
              }}
            >
              <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.4rem', fontFamily: 'Outfit, sans-serif' }}>
                Restrict Account: {targetUser.displayName}
              </h3>
              <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                Target Email: <strong style={{ color: 'var(--text-primary)' }}>{targetUser.email}</strong>
              </p>

              <form onSubmit={handleApplyRestriction} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    Restriction Type (SRS Section 15.6)
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <button
                      type="button"
                      onClick={() => setRestrictionType('temporary-block')}
                      style={{
                        padding: '14px',
                        borderRadius: 'var(--radius-control)',
                        border: restrictionType === 'temporary-block' ? '2px solid var(--brand-yellow)' : '1px solid var(--border)',
                        background: 'var(--background-secondary)',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      <strong style={{ display: 'block', fontSize: '0.92rem', color: 'var(--text-primary)' }}>24-Hour Block</strong>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Temporary access freeze</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRestrictionType('temporary-suspension')}
                      style={{
                        padding: '14px',
                        borderRadius: 'var(--radius-control)',
                        border: restrictionType === 'temporary-suspension' ? '2px solid var(--brand-coral)' : '1px solid var(--border)',
                        background: 'var(--background-secondary)',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      <strong style={{ display: 'block', fontSize: '0.92rem', color: 'var(--text-primary)' }}>7-Day Suspension</strong>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Full platform freeze</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Reason for Restriction (Will be logged in Audit Records)
                  </label>
                  <textarea
                    required
                    value={restrictionReason}
                    onChange={(e) => setRestrictionReason(e.target.value)}
                    placeholder="E.g., Repeated severe non-standard kinematic violations in public room..."
                    rows={3}
                    className="input-field"
                    style={{ width: '100%', padding: '10px', fontSize: '0.88rem' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => setTargetUser(null)}
                    className="soft-pill-btn"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="soft-pill-btn"
                    style={{ background: 'var(--color-coral)', borderColor: 'var(--color-coral)', color: '#ffffff', fontWeight: 700 }}
                  >
                    {isSubmitting ? 'Enforcing...' : 'Enforce Restriction'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </PageContainer>
    </div>
  );
}
