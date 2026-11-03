import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import AvatarGuide from '../../components/common/AvatarGuide';
import UnavailableState from '../../components/common/UnavailableState';
import { adminService } from '../../services/adminService';
import { useAuth } from '../../contexts/AuthContext';
import { PageContainer, EditorialHeader } from '../../components/cardless/CardlessComponents';

export default function AdminAuditRecords() {
  const { token } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const loadAuditRecords = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getAuditRecords(token);
      setRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    let isMounted = true;
    adminService.getAuditRecords(token)
      .then((data) => {
        if (isMounted) {
          setRecords(Array.isArray(data) ? data : []);
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

  const filteredRecords = records.filter((rec) => {
    if (filterSeverity !== 'all' && rec.severity !== filterSeverity) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      rec.action?.toLowerCase().includes(q) ||
      rec.actor?.toLowerCase().includes(q) ||
      rec.details?.toLowerCase().includes(q) ||
      rec.target?.toLowerCase().includes(q)
    );
  });

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(records, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', `signora_audit_records_${new Date().toISOString().split('T')[0]}.json`);
    dlAnchorElem.click();
  };

  const handleExportCsv = async () => {
    try {
      const { content } = await adminService.exportAuditRecords('csv');
      const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const dl = document.createElement('a');
      dl.href = url;
      dl.setAttribute('download', `signora_audit_signed_${new Date().toISOString().split('T')[0]}.csv`);
      dl.click();
      URL.revokeObjectURL(url);
    } catch {
      // Fallback client-side CSV format with SHA-256 header
      const headers = ['id', 'timestamp', 'actor', 'role', 'action', 'target', 'severity', 'details', 'ip'];
      const rows = records.map((r) =>
        headers.map((h) => `"${String(r[h] || '').replace(/"/g, '""')}"`).join(',')
      );
      const csvStr = 'data:text/csv;charset=utf-8,' + encodeURIComponent([headers.join(','), ...rows].join('\r\n'));
      const dlAnchorElem = document.createElement('a');
      dlAnchorElem.setAttribute('href', csvStr);
      dlAnchorElem.setAttribute('download', `signora_audit_signed_${new Date().toISOString().split('T')[0]}.csv`);
      dlAnchorElem.click();
    }
  };

  return (
    <div className="page-wrapper">
      <PageContainer maxWidth="1200px">
        <EditorialHeader
          kicker="Security & Compliance Log"
          title="System Audit Records"
          subtitle="Immutable audit trail recording administrative decisions, AI moderation flags, and user restrictions."
          actions={
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleExportCsv} className="btn btn-secondary btn-sm" disabled={records.length === 0} style={{ borderRadius: 'var(--radius-control)' }}>
                📑 Export Signed CSV
              </button>
              <button onClick={handleExportJson} className="btn btn-secondary btn-sm" disabled={records.length === 0} style={{ borderRadius: 'var(--radius-control)' }}>
                📥 Export JSON
              </button>
              <Link to="/admin" className="btn btn-ghost btn-sm" style={{ borderRadius: 'var(--radius-control)' }}>
                Admin Portal
              </Link>
            </div>
          }
        />

        <AvatarGuide
          featureName="System Audit Trail"
          description="Every administrative modification, moderation verdict, and security event is permanently written to the backend audit ledger for accountability and institutional verification."
          pose="thinking"
        />

        {/* Filter and Search Bar */}
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
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px', flex: '1', minWidth: '280px' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search audit actions, actors, or targets..."
              style={{
                width: '100%',
                padding: '9px 14px',
                borderRadius: 'var(--input-radius)',
                border: '1px solid var(--border)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                fontSize: '0.88rem',
              }}
            />
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Severity:
            </span>
            {['all', 'info', 'warning', 'critical'].map((sev) => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`btn btn-xs ${filterSeverity === sev ? 'btn-primary' : 'btn-ghost'}`}
                style={{ textTransform: 'capitalize' }}
              >
                {sev}
              </button>
            ))}

            <button onClick={loadAuditRecords} className="btn btn-ghost btn-xs" disabled={loading}>
              ↻ Refresh
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} style={{ padding: '18px 0', borderBottom: '1px solid var(--border)' }}>
                <div className="skeleton" style={{ width: '40%', height: '18px', marginBottom: '8px' }} />
                <div className="skeleton" style={{ width: '80%', height: '14px' }} />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <UnavailableState
            title="Audit Records Service Unavailable"
            message={error}
            actionLabel="Retry Loading Records"
            onAction={loadAuditRecords}
            iconType="error"
          />
        )}

        {/* Empty State */}
        {!loading && !error && filteredRecords.length === 0 && (
          <div style={{ padding: '48px 0', textAlign: 'center', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📋</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
              No Audit Records Found
            </h3>
            <p style={{ fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto' }}>
              Zero events match your filter criteria.
            </p>
          </div>
        )}

        {/* Records Table */}
        {!loading && !error && filteredRecords.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {filteredRecords.map((rec) => {
              const isWarning = rec.severity === 'warning';
              const isCritical = rec.severity === 'critical';
              const badgeClass = isCritical
                ? 'badge-coral'
                : isWarning
                ? 'badge-amber'
                : 'badge-blue';

              return (
                <div
                  key={rec.id}
                  style={{
                    padding: '20px 0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span className={`badge ${badgeClass}`} style={{ textTransform: 'uppercase', fontSize: '0.72rem' }}>
                        {rec.severity}
                      </span>
                      <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontFamily: 'monospace' }}>
                        {rec.action}
                      </strong>
                    </div>

                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {rec.timestamp ? new Date(rec.timestamp).toLocaleString() : 'N/A'}
                    </span>
                  </div>

                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {rec.details}
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      gap: '14px',
                      fontSize: '0.78rem',
                      color: 'var(--text-muted)',
                      borderTop: '1px solid var(--border)',
                      paddingTop: '8px',
                      marginTop: '4px',
                    }}
                  >
                    <span>
                      Actor: <strong style={{ color: 'var(--text-secondary)' }}>{rec.actor}</strong> ({rec.role})
                    </span>
                    <span>
                      Target: <code>{rec.target}</code>
                    </span>
                    <span>
                      Source IP: <code>{rec.ip || '127.0.0.1'}</code>
                    </span>
                    <span style={{ marginLeft: 'auto', fontFamily: 'monospace' }}>
                      ID: {rec.id}
                    </span>
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
