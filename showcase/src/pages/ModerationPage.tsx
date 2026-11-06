import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Clock,
  UserX,
  CheckCircle,
  FileText,
  Search,
  Filter,
  X,
  Mail,
  History,
} from 'lucide-react';

interface FlaggedItem {
  id: string;
  sourceType: 'Manual Text' | 'Speech Transcript' | 'Recognized Signs' | 'Generated Sentence';
  category: 'HARASSMENT' | 'HATE_SPEECH' | 'INAPPROPRIATE' | 'SPAM' | 'SECURITY';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  timestamp: string;
  userRef: string;
  evidence: string;
  confidence: number;
  status: 'PENDING_REVIEW' | 'RESOLVED_SAFE' | 'SUSPENDED_24H' | 'SUSPENDED_7D';
  notes?: string;
}

interface AuditLogEntry {
  id: string;
  timestamp: string;
  moderator: string;
  targetUser: string;
  action: string;
  reason: string;
  expiresAt?: string;
}

export const ModerationPage: React.FC = () => {
  const { user } = useAuth();

  const [flaggedItems, setFlaggedItems] = useState<FlaggedItem[]>([
    {
      id: 'flg_101',
      sourceType: 'Recognized Signs',
      category: 'INAPPROPRIATE',
      severity: 'MEDIUM',
      timestamp: '2026-11-03T18:42:10Z',
      userRef: 'usr_guest_412',
      evidence: 'Raw gesture stream contained repeated aggressive physical pointing with hostile non-manual facial markers.',
      confidence: 0.88,
      status: 'PENDING_REVIEW',
    },
    {
      id: 'flg_102',
      sourceType: 'Speech Transcript',
      category: 'HARASSMENT',
      severity: 'HIGH',
      timestamp: '2026-11-03T19:15:30Z',
      userRef: 'usr_guest_891',
      evidence: 'Transcribed speech contained targeted verbal abuse aimed at dialogue partner.',
      confidence: 0.94,
      status: 'PENDING_REVIEW',
    },
    {
      id: 'flg_103',
      sourceType: 'Manual Text',
      category: 'SPAM',
      severity: 'LOW',
      timestamp: '2026-11-04T00:10:00Z',
      userRef: 'usr_test_104',
      evidence: 'Repeated non-linguistic character repetitions flooding gloss token buffer.',
      confidence: 0.97,
      status: 'RESOLVED_SAFE',
    },
  ]);

  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([
    {
      id: 'log_01',
      timestamp: '2026-11-02T14:00:00Z',
      moderator: 'admin@signa.org',
      targetUser: 'usr_violator_09',
      action: '24-Hour Temporary Block',
      reason: 'Repeated inappropriate gestures detected during video session',
      expiresAt: '2026-11-03T14:00:00Z',
    },
  ]);

  const [selectedItem, setSelectedItem] = useState<FlaggedItem | null>(null);
  const [actionReason, setActionReason] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Administrative actions
  const applyAction = (actionType: 'SUSPEND_24H' | 'SUSPEND_7D' | 'MARK_SAFE') => {
    if (!selectedItem) return;

    if (actionType === 'MARK_SAFE') {
      const updated = flaggedItems.map(f =>
        f.id === selectedItem.id ? { ...f, status: 'RESOLVED_SAFE' as const } : f
      );
      setFlaggedItems(updated);
      setActionSuccessMsg(`Item ${selectedItem.id} marked as safe and dismissed.`);
    } else {
      const durationHours = actionType === 'SUSPEND_24H' ? 24 : 168;
      const expiry = new Date(Date.now() + durationHours * 3600 * 1000).toISOString();
      const newStatus = actionType === 'SUSPEND_24H' ? ('SUSPENDED_24H' as const) : ('SUSPENDED_7D' as const);

      const updated = flaggedItems.map(f =>
        f.id === selectedItem.id ? { ...f, status: newStatus } : f
      );
      setFlaggedItems(updated);

      // Record in audit log
      const newLog: AuditLogEntry = {
        id: 'log_' + Date.now(),
        timestamp: new Date().toISOString(),
        moderator: user?.email || 'admin@signa.org',
        targetUser: selectedItem.userRef,
        action: actionType === 'SUSPEND_24H' ? 'Temporary 24h Block' : 'Temporary 7-Day Suspension',
        reason: actionReason || 'Violation of community communication guidelines',
        expiresAt: expiry,
      };
      setAuditLog([newLog, ...auditLog]);

      setActionSuccessMsg(
        `User ${selectedItem.userRef} placed on ${
          actionType === 'SUSPEND_24H' ? '24-hour' : '7-day'
        } temporary restriction. Expiry: ${new Date(expiry).toLocaleString()}. Email notice queued.`
      );
    }

    setTimeout(() => {
      setSelectedItem(null);
      setActionReason('');
      setActionSuccessMsg(null);
    }, 3000);
  };

  const filteredItems = flaggedItems.filter(f => {
    if (filterSeverity === 'ALL') return true;
    return f.severity === filterSeverity;
  });

  return (
    <div className="relative min-h-[calc(100vh-4rem)] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 z-10 space-y-10">
      {/* Top Header */}
      <div className="space-y-4 hairline-border-b pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="font-mono text-xs uppercase tracking-widest text-[var(--brand-yellow)] font-bold">
              ADMINISTRATION &bull; CONTENT MODERATION CONSOLE
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
              Safety & Moderation Review
            </h1>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-[var(--text-tertiary)]">
            <ShieldAlert className="w-4 h-4 text-[var(--brand-yellow)]" />
            <span>HUMAN-IN-THE-LOOP AUDIT</span>
          </div>
        </div>

        <p className="text-xs text-[var(--text-secondary)] max-w-2xl leading-relaxed">
          Review automated safety signals generated during sign-to-text, speech recognition, and real-time dialogue. Automated flags are signals requiring human assessment before temporary protective restrictions are applied.
        </p>
      </div>

      {actionSuccessMsg && (
        <div className="p-4 bg-[var(--brand-blue)]/10 border border-[var(--brand-blue)] text-xs font-mono text-[var(--brand-blue)] flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex items-center justify-between font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="text-[var(--text-tertiary)]">FILTER SEVERITY:</span>
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(sev => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-2.5 py-1 cursor-pointer border transition-colors ${
                filterSeverity === sev
                  ? 'bg-[var(--text-primary)] text-[var(--background)] font-bold border-[var(--text-primary)]'
                  : 'bg-[var(--surface)] text-[var(--text-secondary)] border-[var(--border)]'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        <span className="text-[var(--text-tertiary)]">
          {filteredItems.length} ITEMS PENDING / RESOLVED
        </span>
      </div>

      {/* Main Review Table (Swiss Grid aligned list) */}
      <div className="divide-y divide-[var(--border)] bg-[var(--surface)] hairline-border">
        {filteredItems.map(item => (
          <div
            key={item.id}
            className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[var(--surface-secondary)]/40 transition-colors"
          >
            <div className="space-y-1.5 flex-1 pr-4">
              <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
                <span className="text-[var(--text-primary)] font-bold">{item.id}</span>
                <span className="text-[var(--text-tertiary)]">&bull;</span>
                <span className="text-[var(--brand-blue)] font-bold">{item.sourceType}</span>
                <span className="text-[var(--text-tertiary)]">&bull;</span>
                <span
                  className={`font-bold uppercase ${
                    item.severity === 'CRITICAL' || item.severity === 'HIGH'
                      ? 'text-[var(--brand-coral)]'
                      : 'text-[var(--brand-yellow)]'
                  }`}
                >
                  [{item.category} / {item.severity}]
                </span>
                <span className="text-[var(--text-tertiary)]">&bull;</span>
                <span className="text-[var(--text-tertiary)]">User: {item.userRef}</span>
              </div>

              <p className="text-sm font-sans text-[var(--text-primary)] leading-relaxed">
                "{item.evidence}"
              </p>

              <div className="flex items-center gap-4 font-mono text-[11px] text-[var(--text-tertiary)]">
                <span>Confidence: {(item.confidence * 100).toFixed(0)}%</span>
                <span>Time: {new Date(item.timestamp).toLocaleString()}</span>
                <span
                  className={
                    item.status === 'PENDING_REVIEW'
                      ? 'text-[var(--brand-yellow)] font-bold'
                      : 'text-[var(--brand-blue)]'
                  }
                >
                  Status: {item.status}
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedItem(item)}
              className="px-4 py-2 bg-[var(--background)] border border-[var(--border)] hover:border-[var(--brand-coral)] text-xs font-mono uppercase text-[var(--text-primary)] cursor-pointer shrink-0"
            >
              Review Case
            </button>
          </div>
        ))}
      </div>

      {/* Case Review Modal with Administrative Actions */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-[var(--surface)] hairline-border p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between hairline-border-b pb-4">
              <div className="space-y-1">
                <span className="font-mono text-xs text-[var(--brand-yellow)] font-bold uppercase">
                  MODERATION ACTION PANEL &bull; CASE {selectedItem.id}
                </span>
                <div className="font-mono text-xs text-[var(--text-tertiary)]">
                  Subject Ref: {selectedItem.userRef} &bull; Channel: {selectedItem.sourceType}
                </div>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer border border-[var(--border)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <span className="font-mono text-xs uppercase tracking-wider text-[var(--text-tertiary)] block">
                Reported Evidence:
              </span>
              <p className="p-4 bg-[var(--background)] border border-[var(--border)] text-sm font-sans text-[var(--text-primary)] leading-relaxed">
                "{selectedItem.evidence}"
              </p>
            </div>

            <div className="space-y-2 font-mono text-xs">
              <label className="text-[var(--text-secondary)] uppercase block">
                Administrative Justification / Reason:
              </label>
              <textarea
                rows={2}
                value={actionReason}
                onChange={e => setActionReason(e.target.value)}
                placeholder="Detail the rationale for restriction or dismissal..."
                className="w-full bg-[var(--background)] text-[var(--text-primary)] border border-[var(--border)] p-3 focus:outline-none focus:border-[var(--brand-coral)]"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-2 hairline-border-t flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
              <button
                onClick={() => applyAction('MARK_SAFE')}
                className="px-4 py-2 bg-[var(--background)] border border-[var(--border)] hover:border-[var(--brand-blue)] text-[var(--text-primary)] cursor-pointer"
              >
                Dismiss / Mark Safe
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => applyAction('SUSPEND_24H')}
                  className="px-4 py-2 bg-[var(--brand-yellow)] text-black font-semibold hover:opacity-90 cursor-pointer"
                >
                  Temporary 24h Block
                </button>
                <button
                  onClick={() => applyAction('SUSPEND_7D')}
                  className="px-4 py-2 bg-[var(--brand-coral)] text-white font-semibold hover:opacity-90 cursor-pointer"
                >
                  7-Day Suspension
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Administrative Audit Log */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 hairline-border-b pb-3">
          <History className="w-4 h-4 text-[var(--text-tertiary)]" />
          <h3 className="font-display text-lg font-bold text-[var(--text-primary)]">
            Audit Log (Enforcement Records)
          </h3>
        </div>

        <div className="divide-y divide-[var(--border)] bg-[var(--surface)] hairline-border text-xs font-mono">
          {auditLog.map(log => (
            <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[var(--brand-coral)] font-bold">{log.action}</span>
                  <span className="text-[var(--text-tertiary)]">&bull; Target: {log.targetUser}</span>
                  <span className="text-[var(--text-tertiary)]">&bull; Mod: {log.moderator}</span>
                </div>
                <div className="text-[var(--text-secondary)] font-sans">Reason: {log.reason}</div>
              </div>
              <div className="text-[var(--text-tertiary)] text-[11px] shrink-0">
                {new Date(log.timestamp).toLocaleString()}
                {log.expiresAt && ` &bull; Exp: ${new Date(log.expiresAt).toLocaleDateString()}`}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
