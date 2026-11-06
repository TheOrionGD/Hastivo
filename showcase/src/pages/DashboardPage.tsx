import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  ArrowRight,
  ArrowUpRight,
  MessageSquare,
  Camera,
  Users,
  Clock,
  User,
  Settings as SettingsIcon,
  ShieldAlert,
  Activity,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { t } = useTheme();

  // Load real user records from local storage
  const [historyItems, setHistoryItems] = useState<any[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('signa_conversation_records');
      if (stored) {
        setHistoryItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error fetching history:', e);
    }
  }, []);

  const totalSessions = historyItems.length;
  const lastActive = historyItems.length > 0 ? historyItems[0].timestamp : null;

  return (
    <div className="relative min-h-[calc(100vh-4rem)] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 z-10 space-y-12">
      {/* Top Editorial Header */}
      <div className="space-y-4 hairline-border-b pb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="font-mono text-xs uppercase tracking-widest text-[var(--brand-coral)] font-bold">
              WORKSPACE / CENTRAL CONSOLE
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[var(--text-primary)]">
              Welcome, {user ? user.fullName || user.username : 'Guest Collaborator'}.
            </h1>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-[var(--text-tertiary)]">
            <Activity className="w-4 h-4 text-[var(--brand-coral)]" />
            <span>SESSION: {isAuthenticated ? 'AUTHENTICATED' : 'ANONYMOUS GUEST'}</span>
          </div>
        </div>

        <p className="text-sm text-[var(--text-secondary)] max-w-2xl leading-relaxed">
          Select an interactive communication module below. All workspaces operate with authentic linguistic processing and zero synthetic translations.
        </p>
      </div>

      {/* SWISS GRID CARDLESS WORKSPACE ROUTING (Architectural alignment, not generic KPI cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 hairline-border divide-y md:divide-y-0 md:divide-x divide-[var(--border)] bg-[var(--surface)]">
        {/* Module 1: Text to Sign */}
        <div className="p-8 flex flex-col justify-between space-y-6 hover:bg-[var(--surface-secondary)]/40 transition-colors group">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-[var(--brand-coral)] font-bold uppercase">01 / LINGUISTICS</span>
              <MessageSquare className="w-5 h-5 text-[var(--brand-coral)]" />
            </div>
            <h2 className="font-display text-2xl font-bold text-[var(--text-primary)]">
              Text to Sign
            </h2>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Convert written text or spoken voice into authentic ISL/ASL gloss sequences performed by the 3D humanoid avatar.
            </p>
          </div>

          <Link
            to="/text-to-sign"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[var(--brand-coral)] font-semibold group-hover:translate-x-1 transition-transform"
          >
            <span>Launch Engine</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Module 2: Sign to Text */}
        <div className="p-8 flex flex-col justify-between space-y-6 hover:bg-[var(--surface-secondary)]/40 transition-colors group">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-[var(--brand-blue)] font-bold uppercase">02 / VISION</span>
              <Camera className="w-5 h-5 text-[var(--brand-blue)]" />
            </div>
            <h2 className="font-display text-2xl font-bold text-[var(--text-primary)]">
              Sign to Text
            </h2>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Real-time 60fps computer-vision landmark tracking translating physical hand gestures into text and natural voice synthesis.
            </p>
          </div>

          <Link
            to="/sign-to-text"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[var(--brand-blue)] font-semibold group-hover:translate-x-1 transition-transform"
          >
            <span>Launch Vision</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Module 3: Real-Time Conversation */}
        <div className="p-8 flex flex-col justify-between space-y-6 hover:bg-[var(--surface-secondary)]/40 transition-colors group">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-[var(--brand-yellow)] font-bold uppercase">03 / SYNCHRONOUS</span>
              <Users className="w-5 h-5 text-[var(--brand-yellow)]" />
            </div>
            <h2 className="font-display text-2xl font-bold text-[var(--text-primary)]">
              Real-Time
            </h2>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Two-participant split-workspace supporting simultaneous speech-to-sign and sign-to-speech with independent non-blocking loops.
            </p>
          </div>

          <Link
            to="/conversation"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[var(--brand-yellow)] font-semibold group-hover:translate-x-1 transition-transform"
          >
            <span>Open Dialogue</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Secondary Row: Quick Nav & Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
        <Link
          to="/history"
          className="p-5 bg-[var(--surface)] hairline-border flex items-center justify-between hover:border-[var(--brand-coral)] transition-colors"
        >
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-[var(--text-tertiary)]" />
            <span className="text-[var(--text-primary)]">Conversation Archive ({totalSessions})</span>
          </div>
          <ArrowUpRight className="w-4 h-4 text-[var(--text-tertiary)]" />
        </Link>

        <Link
          to="/profile"
          className="p-5 bg-[var(--surface)] hairline-border flex items-center justify-between hover:border-[var(--brand-coral)] transition-colors"
        >
          <div className="flex items-center gap-3">
            <User className="w-4 h-4 text-[var(--text-tertiary)]" />
            <span className="text-[var(--text-primary)]">Account Profile & Security</span>
          </div>
          <ArrowUpRight className="w-4 h-4 text-[var(--text-tertiary)]" />
        </Link>

        <Link
          to="/settings"
          className="p-5 bg-[var(--surface)] hairline-border flex items-center justify-between hover:border-[var(--brand-coral)] transition-colors"
        >
          <div className="flex items-center gap-3">
            <SettingsIcon className="w-4 h-4 text-[var(--text-tertiary)]" />
            <span className="text-[var(--text-primary)]">System & Speech Settings</span>
          </div>
          <ArrowUpRight className="w-4 h-4 text-[var(--text-tertiary)]" />
        </Link>
      </div>

      {/* REAL ACTIVITY TIMELINE (No fake records: only actual sessions stored by user) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between hairline-border-b pb-3">
          <h3 className="font-display text-xl font-bold text-[var(--text-primary)]">
            Verified Activity Log
          </h3>
          <span className="font-mono text-xs text-[var(--text-tertiary)]">
            {totalSessions === 0 ? 'NO RECORDS YET' : `${totalSessions} SESSIONS LOGGED`}
          </span>
        </div>

        {historyItems.length === 0 ? (
          <div className="p-8 text-center bg-[var(--surface)] hairline-border space-y-3">
            <p className="text-sm text-[var(--text-secondary)]">
              No previous conversation records found. Use Text-to-Sign, Sign-to-Text, or Real-Time to begin recording communication sessions.
            </p>
            <Link
              to="/text-to-sign"
              className="inline-block px-4 py-2 bg-[var(--brand-coral)] text-white font-mono text-xs uppercase"
            >
              Start First Translation
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-[var(--border)] bg-[var(--surface)] hairline-border">
            {historyItems.slice(0, 5).map((item, idx) => (
              <div key={item.id || idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[var(--brand-coral)] font-bold uppercase">[{item.category || 'TRANSLATION'}]</span>
                    <span className="text-[var(--text-tertiary)]">{new Date(item.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="text-sm font-sans text-[var(--text-primary)] line-clamp-1">
                    {item.summary || item.text || 'Dialogue session'}
                  </p>
                </div>
                <Link
                  to="/history"
                  className="text-[var(--text-secondary)] hover:text-[var(--brand-coral)] shrink-0"
                >
                  View Details &rarr;
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
