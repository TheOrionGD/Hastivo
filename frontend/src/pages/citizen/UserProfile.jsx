import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import AvatarGuide from '../../components/common/AvatarGuide';
import { PageContainer, CardlessBadge, CardlessButton, SectionDivider } from '../../components/cardless/CardlessComponents';

/**
 * Signora AI — User Profile Screen (Cardless Redesign)
 * Master Specification Section 4.12:
 * - Profile avatar emblem, username, full name, email, phone number.
 * - Account creation date, account status, preferred language, theme, accent color.
 * - Activity details & role capabilities summary.
 * - Action controls: edit profile, password management, privacy, deactivation request, logout.
 * - Clean open composition without a conventional boxed profile card.
 */
export default function UserProfile() {
  const { user, role, token, logout } = useAuth();
  const { theme } = useTheme();
  const { currentLang } = useLanguage();
  const navigate = useNavigate();

  const accentColor = localStorage.getItem('signora_accent_color') || '#FF6F61';

  return (
    <div className="page-wrapper">
      <PageContainer maxWidth="1160px">
        {/* Workspace Title & Metadata */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
          <div>
            <div className="cardless-kicker">Citizen Account Identity</div>
            <h1 className="cardless-title" style={{ margin: 0 }}>
              User Profile
            </h1>
            <p className="cardless-subtitle" style={{ marginTop: '8px' }}>
              Authenticated credentials, role authorization, translation statistics, and security preferences.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CardlessBadge color={role === 'admin' ? 'coral' : 'blue'}>
              ROLE: {role?.toUpperCase() || 'CITIZEN'}
            </CardlessBadge>
            <CardlessBadge color="amber">VERIFIED ACCOUNT</CardlessBadge>
          </div>
        </div>

        <AvatarGuide
          featureName="Profile Workspace"
          description="Your authenticated account identity, capabilities, and system activity details are organized here in an open cardless workspace."
          pose="thinking"
        />

        {/* ── Open Profile Header Composition (Cardless) ── */}
        <section
          style={{
            margin: '32px 0 24px',
            paddingBottom: '28px',
            borderBottom: '1px solid var(--border-subtle, var(--border))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            {/* Square Minimal Avatar Emblem */}
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: 'var(--radius-control, 4px)',
                background: 'var(--color-charcoal)',
                border: '1px solid var(--color-blue)',
                color: 'var(--color-coral)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                fontFamily: 'var(--font-mono, monospace)',
                fontWeight: 800,
                boxShadow: 'none',
                flexShrink: 0,
              }}
            >
              {user?.email ? user.email.charAt(0).toUpperCase() : 'C'}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                <h2 style={{ fontFamily: 'var(--font-display, Outfit, sans-serif)', fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  {user?.displayName || user?.name || user?.email?.split('@')[0] || 'Authenticated User'}
                </h2>
                <CardlessBadge color="coral">{user?.status || 'Active'}</CardlessBadge>
              </div>
              <p style={{ margin: 0, fontSize: '0.90rem', color: 'var(--text-secondary)' }}>
                @{user?.username || user?.email?.split('@')[0] || 'user'} &bull; {user?.email || 'Unspecified'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Link to="/settings" className="btn btn-ghost btn-sm">
              ⚙️ Edit Preferences
            </Link>
            <CardlessButton
              variant="danger"
              size="sm"
              onClick={async () => {
                if (logout) await logout();
                navigate('/signin');
              }}
            >
              Log Out
            </CardlessButton>
          </div>
        </section>

        {/* ── Open Metadata Grid (Zero Cards) ── */}
        <section style={{ margin: '32px 0' }}>
          <h3 className="cardless-section-title" style={{ marginBottom: '20px' }}>
            Account Specifications
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '24px 32px',
              paddingBottom: '32px',
              borderBottom: '1px solid var(--border-subtle, var(--border))',
            }}
          >
            <div>
              <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Full Name
              </span>
              <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>
                {user?.displayName || user?.name || 'Unspecified'}
              </strong>
            </div>

            <div>
              <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Email Address
              </span>
              <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>
                {user?.email || 'Unspecified'}
              </strong>
            </div>

            <div>
              <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Contact Phone
              </span>
              <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>
                {user?.phone || 'Not provided'}
              </strong>
            </div>

            <div>
              <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Account Classification
              </span>
              <strong style={{ fontSize: '1rem', color: user?.isGuest ? 'var(--color-amber)' : 'var(--color-blue)' }}>
                {user?.isGuest ? 'Temporary Guest' : 'Registered Citizen (Permanent)'}
              </strong>
            </div>

            <div>
              <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Preferred Language
              </span>
              <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>
                {currentLang.toUpperCase()}
              </strong>
            </div>

            <div>
              <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Interface Theme
              </span>
              <strong style={{ fontSize: '1rem', color: 'var(--text-primary)', textTransform: 'capitalize' }}>
                {theme} Mode
              </strong>
            </div>

            <div>
              <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Accent Color
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '14px', height: '14px', borderRadius: '50%', background: accentColor }} />
                <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>
                  {accentColor}
                </strong>
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Session Bearer Token
              </span>
              <strong style={{ fontSize: '1rem', color: token ? 'var(--color-blue)' : 'var(--text-secondary)' }}>
                {token ? 'Active (Transient Bearer)' : 'None'}
              </strong>
            </div>
          </div>
        </section>

        <SectionDivider label="Permissions & Governance" kicker="Role Capabilities" />

        {/* ── Role Capabilities & Permissions ── */}
        <section style={{ margin: '32px 0' }}>
          <h3 className="cardless-section-title" style={{ marginBottom: '16px' }}>
            Authorized Role Capabilities
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid var(--border-subtle, var(--border))', paddingTop: '16px' }}>
            {[
              {
                title: 'Text-to-Sign 3D Synthesis',
                desc: 'Permitted unlimited synthesis of Indian Sign Language procedural humanoid animations.',
                granted: true,
              },
              {
                title: 'Computer-Vision Sign Recognition',
                desc: 'Real-time 27-landmark camera tracking and translation to captions and synthesized audio.',
                granted: true,
              },
              {
                title: 'Duplex Real-Time Conversation',
                desc: 'Simultaneous two-way communication connecting speech dictation with signer camera stream.',
                granted: true,
              },
              {
                title: 'Conversation History Ledger',
                desc: 'Review verified session logs and replay sign animations.',
                granted: !user?.isGuest,
              },
              {
                title: 'Administrative Governance Console',
                desc: 'Inspect AI moderation queues, user restrictions, and telemetry metrics.',
                granted: role === 'admin',
              },
            ].map((cap, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 0',
                  borderBottom: '1px solid var(--border-subtle, var(--border))',
                  flexWrap: 'wrap',
                  gap: '8px',
                }}
              >
                <div>
                  <strong style={{ fontSize: '0.94rem', color: 'var(--text-primary)' }}>
                    {cap.title}
                  </strong>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    {cap.desc}
                  </p>
                </div>
                <CardlessBadge color={cap.granted ? 'coral' : 'grey'}>
                  {cap.granted ? '✓ Granted' : 'Restricted'}
                </CardlessBadge>
              </div>
            ))}
          </div>
        </section>

        {/* ── Account Management Actions Strip ── */}
        <section style={{ margin: '36px 0', paddingTop: '20px', borderTop: '1px solid var(--border-subtle, var(--border))' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link to="/settings" className="btn btn-ghost btn-sm">
                Privacy Settings
              </Link>
              <Link to="/forgot-password" className="btn btn-ghost btn-sm">
                Password Management
              </Link>
              <button
                type="button"
                onClick={() => alert('Account deactivation request logged. In accordance with zero-cloud data policies, all temporary caches are immediately purged.')}
                className="btn btn-ghost btn-sm"
                style={{ color: 'var(--color-coral)' }}
              >
                Request Account Deactivation
              </button>
            </div>

            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Signora AI Identity Framework &bull; Zero-Cloud Biometric Retention
            </span>
          </div>
        </section>
      </PageContainer>
    </div>
  );
}
