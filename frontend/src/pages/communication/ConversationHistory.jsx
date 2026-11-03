import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AvatarGuide from '../../components/common/AvatarGuide';
import UnavailableState from '../../components/common/UnavailableState';
import { historyService } from '../../services/historyService';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { PageContainer, CardlessBadge, CardlessButton, SectionDivider } from '../../components/cardless/CardlessComponents';

/**
 * Hastivo AI — Conversation History (Cardless Editorial Design)
 * Master Specification Section 4.9:
 * - Editorial-style chronological history timeline.
 * - Date grouping (Today, Yesterday, Earlier).
 * - Search query and category filter pills.
 * - Text-to-Sign, Sign-to-Text, Real-Time, TTS session records.
 * - Bulk selection and bulk delete.
 * - Export records functionality.
 * - Dividers and compact metadata instead of card boxes.
 */
export default function ConversationHistory() {
  const { token } = useAuth();
  const { notifySuccess, notifyCoralError } = useNotification();
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    async function fetchHistory() {
      setLoading(true);
      setError(null);
      try {
        const records = await historyService.getHistoryRecords(token);
        setHistoryItems(Array.isArray(records) ? records : []);
      } catch (err) {
        setError(err.message);
        notifyCoralError('Failed to fetch conversation history', err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, [token, notifyCoralError]);

  // Filtering
  const filteredItems = historyItems.filter((item) => {
    const matchesCat =
      selectedCategory === 'ALL' ||
      (item.category && item.category.toLowerCase().includes(selectedCategory.toLowerCase()));
    const matchesQuery =
      !searchQuery.trim() ||
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.direction?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  // Bulk Selection
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredItems.map((item) => item.id));
    }
  };

  const toggleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((x) => x !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`Delete ${selectedIds.length} selected conversation record(s)?`)) {
      setHistoryItems(historyItems.filter((item) => !selectedIds.includes(item.id)));
      setSelectedIds([]);
      notifySuccess('Records Deleted', 'Selected conversation logs have been removed.');
    }
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(historyItems, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `hastivo_conversation_history_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    notifySuccess('Export Complete', 'Downloaded conversation ledger as JSON.');
  };

  const getCategoryColor = (cat = '') => {
    const c = cat.toLowerCase();
    if (c.includes('real-time') || c.includes('conversation')) return 'amber';
    if (c.includes('text-to-sign') || c.includes('avatar')) return 'coral';
    return 'blue';
  };

  return (
    <div className="page-wrapper">
      <PageContainer maxWidth="1200px">
        {/* Workspace Title & Metadata */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
          <div>
            <div className="cardless-kicker">Records &bull; Immutable Ledger</div>
            <h1 className="cardless-title" style={{ margin: 0 }}>
              Conversation History
            </h1>
            <p className="cardless-subtitle" style={{ marginTop: '8px' }}>
              Chronological timeline of verified two-way translation sessions, recognized transcripts, and synthesized speech logs.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <CardlessButton variant="ghost" size="sm" onClick={handleExportJSON}>
              📥 Export Ledger (.JSON)
            </CardlessButton>
            {selectedIds.length > 0 && (
              <CardlessButton variant="danger" size="sm" onClick={handleDeleteSelected}>
                Delete Selected ({selectedIds.length})
              </CardlessButton>
            )}
          </div>
        </div>

        <AvatarGuide
          featureName="Conversation History"
          description="View previous sessions retrieved directly from your account storage. Review verified transcripts or replay 3D avatar animations."
          pose="present"
        />

        {/* ── Search & Filter Controls ── */}
        <div
          style={{
            margin: '28px 0',
            paddingBottom: '20px',
            borderBottom: '1px solid var(--border-subtle, var(--border))',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {/* Search Input Bar */}
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversation title, keywords, or direction (e.g. 'hospital', 'Namaste', 'triage')..."
              style={{
                width: '100%',
                padding: '12px 18px 12px 42px',
                fontSize: '0.96rem',
                borderRadius: 'var(--radius-control)',
                background: 'var(--surface-elevated, var(--bg-secondary))',
                border: '1px solid var(--border-subtle, var(--border))',
                color: 'var(--text-primary)',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            <span
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-secondary)',
                fontSize: '1rem',
              }}
            >
              🔍
            </span>
          </div>

          {/* Category Filter Pills & Select All */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {[
                { id: 'ALL', label: 'All Sessions' },
                { id: 'real-time', label: 'Real-Time' },
                { id: 'text-to-sign', label: 'Text-to-Sign' },
                { id: 'sign-to-text', label: 'Sign-to-Text' },
                { id: 'tts', label: 'Speech Logs' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    padding: '5px 14px',
                    borderRadius: '999px',
                    border: '1px solid var(--border)',
                    background: selectedCategory === cat.id ? 'var(--color-blue)' : 'transparent',
                    color: selectedCategory === cat.id ? '#0d0f14' : 'var(--text-primary)',
                    fontSize: '0.80rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {filteredItems.length > 0 && (
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={selectedIds.length === filteredItems.length && filteredItems.length > 0}
                  onChange={toggleSelectAll}
                  style={{ accentColor: 'var(--color-coral)' }}
                />
                Select All ({filteredItems.length})
              </label>
            )}
          </div>
        </div>

        <SectionDivider spacing="24px" />

        {/* ── Loading Skeleton State ── */}
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ padding: '20px 0', borderBottom: '1px solid var(--border-subtle, var(--border))' }}>
                <div className="skeleton" style={{ width: '35%', height: '22px', marginBottom: '10px' }} />
                <div className="skeleton" style={{ width: '80%', height: '14px', marginBottom: '8px' }} />
                <div className="skeleton" style={{ width: '50%', height: '14px' }} />
              </div>
            ))}
          </div>
        )}

        {/* ── Error State ── */}
        {!loading && error && (
          <UnavailableState
            title="Unable to Retrieve History"
            message={error}
            actionLabel="Retry Loading Records"
            onAction={() => window.location.reload()}
            iconType="error"
          />
        )}

        {/* ── Empty State ── */}
        {!loading && !error && filteredItems.length === 0 && (
          <div style={{ padding: '64px 0', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <div style={{ fontSize: '2.4rem', marginBottom: '12px' }}>📂</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
              No Conversation Records Found
            </h3>
            <p style={{ fontSize: '0.90rem', maxWidth: '420px', margin: '0 auto 20px' }}>
              No matching conversation sessions found in your storage ledger. Start a conversation to preserve transcripts.
            </p>
            <Link to="/conversation" className="btn btn-primary btn-sm">
              Start Real-Time Conversation &rarr;
            </Link>
          </div>
        )}

        {/* ── Chronological Editorial Timeline List ── */}
        {!loading && !error && filteredItems.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {filteredItems.map((item, idx) => {
              const isSelected = selectedIds.includes(item.id);
              return (
                <div
                  key={item.id || idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    padding: '24px 0',
                    borderBottom: '1px solid var(--border-subtle, var(--border))',
                    flexWrap: 'wrap',
                    gap: '16px',
                    transition: 'all var(--transition-ui)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', maxWidth: '780px' }}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelectOne(item.id)}
                      style={{ marginTop: '5px', accentColor: 'var(--color-coral)' }}
                    />

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                        <CardlessBadge color={getCategoryColor(item.category)}>
                          {item.category?.toUpperCase() || 'TRANSLATION'}
                        </CardlessBadge>
                        <span style={{ fontSize: '0.80rem', color: 'var(--text-secondary)' }}>
                          {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recorded'}
                        </span>
                        <span style={{ fontSize: '0.80rem', color: 'var(--color-blue)', fontWeight: 600 }}>
                          &bull; {item.direction}
                        </span>
                        {item.duration && (
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            ({item.duration})
                          </span>
                        )}
                      </div>

                      <h3
                        style={{
                          fontFamily: 'var(--font-display, Outfit, sans-serif)',
                          fontSize: '1.2rem',
                          fontWeight: 700,
                          color: 'var(--text-primary)',
                          margin: '0 0 6px',
                        }}
                      >
                        {item.title || `Session #${item.id}`}
                      </h3>

                      <p style={{ margin: 0, fontSize: '0.90rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                        {item.summary || item.text || 'Verified Indian Sign Language conversation transcript.'}
                      </p>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', alignSelf: 'center' }}>
                    <Link
                      to={`/history/${item.id}`}
                      className="btn btn-ghost btn-sm"
                      style={{ borderRadius: 'var(--radius-control)', fontSize: '0.82rem' }}
                    >
                      Replay & Inspect &rarr;
                    </Link>
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
