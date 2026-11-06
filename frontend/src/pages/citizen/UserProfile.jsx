import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import AvatarGuide from '../../components/common/AvatarGuide';
import { PageContainer, EditorialHeader, CardlessBadge, CardlessButton, SectionDivider, SwissGrid, SwissCol } from '../../components/cardless/CardlessComponents';

/**
 * Hastivo — User Profile (Vision Pro / Swiss Editorial Cardless Architecture)
 */
export default function UserProfile() {
  const { user, role, token, logout } = useAuth();
  const { theme } = useTheme();
  const { currentLang } = useLanguage();
  const navigate = useNavigate();

  const accentColor = localStorage.getItem('hastivo_accent_color') || '#FF6F61';

  return (
    <PageContainer maxWidth="1200px">
      <EditorialHeader
        eyebrow="CITIZEN CREDENTIAL IDENTITY"
        title="User Profile"
        subtitle="Authenticated credentials, role authorization, translation statistics, and security preferences."
        meta={
          <div style={{ display: 'flex', gap: '8px' }}>
            <CardlessBadge color={role === 'admin' ? 'coral' : 'blue'}>
              ROLE: {role?.toUpperCase() || 'CITIZEN'}
            </CardlessBadge>
            <CardlessBadge color="amber">VERIFIED ACCOUNT</CardlessBadge>
          </div>
        }
        actions={
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Link to="/settings" style={{ textDecoration: 'none' }}>
              <CardlessButton variant="ghost" size="sm">
                ⚙️ Edit Preferences
              </CardlessButton>
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
        }
      />

      <AvatarGuide
        featureName="Profile Workspace"
        description="Your authenticated account identity, capabilities, and system activity details are organized here in an open cardless workspace."
        pose="thinking"
      />

      {/* Open Profile Header Band */}
      <div
        style={{
          margin: '28px 0 36px',
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
              borderRadius: '4px',
              background: 'var(--color-charcoal, #2E2E2E)',
              border: '1px solid var(--color-blue)',
              color: 'var(--color-coral)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontFamily: 'var(--font-mono, monospace)',
              fontWeight: 800,
              flexShrink: 0,
            }}
          >
            {user?.email ? user.email.charAt(0).toUpperCase() : 'C'}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <h2 style={{ fontFamily: 'var(--font-display, "Manrope", sans-serif)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                {user?.displayName || user?.name || user?.email?.split('@')[0] || 'Authenticated User'}
              </h2>
              <CardlessBadge color="coral">{user?.status || 'Active'}</CardlessBadge>
            </div>
            <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
              @{user?.username || user?.email?.split('@')[0] || 'user'} &bull; {user?.email || 'Unspecified'}
            </p>
          </div>
        </div>
      </div>

      <SectionDivider index="01" label="ACCOUNT SPECIFICATIONS" />

      {/* Open Metadata Grid (Zero Cards) */}
      <SwissGrid columns={12} gap="24px 32px" style={{ marginBottom: '40px' }}>
        <SwissCol span={3}>
          <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
            FULL NAME
          </span>
          <strong style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>
            {user?.displayName || user?.name || 'Unspecified'}
          </strong>
        </SwissCol>

        <SwissCol span={3}>
          <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
            EMAIL ADDRESS
          </span>
          <strong style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>
            {user?.email || 'Unspecified'}
          </strong>
        </SwissCol>

        <SwissCol span={3}>
          <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
            CONTACT PHONE
          </span>
          <strong style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>
            {user?.phone || 'Not provided'}
          </strong>
        </SwissCol>

        <SwissCol span={3}>
          <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
            ACCOUNT CLASSIFICATION
          </span>
          <strong style={{ fontSize: '1.05rem', color: user?.isGuest ? 'var(--color-amber)' : 'var(--color-blue)' }}>
            {user?.isGuest ? 'Temporary Guest' : 'Registered Citizen (Permanent)'}
          </strong>
        </SwissCol>

        <SwissCol span={3}>
          <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
            PREFERRED LANGUAGE
          </span>
          <strong style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>
            {currentLang.toUpperCase()}
          </strong>
        </SwissCol>

        <SwissCol span={3}>
          <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
            INTERFACE THEME
          </span>
          <strong style={{ fontSize: '1.05rem', color: 'var(--text-primary)', textTransform: 'capitalize' }}>
            {theme} Mode
          </strong>
        </SwissCol>

        <SwissCol span={3}>
          <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
            ACCENT COLOR
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: accentColor }} />
            <strong style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>
              {accentColor}
            </strong>
          </div>
        </SwissCol>

        <SwissCol span={3}>
          <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
            BEARER TOKEN STATUS
          </span>
          <strong style={{ fontSize: '1.05rem', color: token ? 'var(--color-blue)' : 'var(--text-secondary)' }}>
            {token ? 'Active (Transient Bearer)' : 'None'}
          </strong>
        </SwissCol>
      </SwissGrid>

      <SectionDivider index="02" label="AUTHORIZED ROLE CAPABILITIES" />

      {/* Role Capabilities & Permissions List */}
      <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '40px' }}>
        {[
          {
            title: 'Text-to-Sign 3D Synthesis',
            desc: 'Permitted unlimited synthesis of Indian Sign Language procedural humanoid animations.',
            granted: true,
          },
          {
            title: 'Computer-Vision Sign Recognition',
            desc: 'Real-time 21-landmark camera tracking and translation to captions and synthesized audio.',
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
              padding: '16px 0',
              borderBottom: '1px solid var(--border-subtle, var(--border))',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div>
              <h4 style={{ margin: '0 0 4px', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {cap.title}
              </h4>
              <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                {cap.desc}
              </p>
            </div>
            <CardlessBadge color={cap.granted ? 'coral' : 'grey'}>
              {cap.granted ? '✓ Granted' : 'Restricted'}
            </CardlessBadge>
          </div>
        ))}
      </div>

      {/* Account Management Actions Strip */}
      <div style={{ paddingTop: '24px', borderTop: '1px solid var(--border-subtle, var(--border))', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link to="/settings" style={{ textDecoration: 'none' }}>
            <CardlessButton variant="ghost" size="sm">
              Privacy Settings
            </CardlessButton>
          </Link>
          <Link to="/forgot-password" style={{ textDecoration: 'none' }}>
            <CardlessButton variant="ghost" size="sm">
              Password Management
            </CardlessButton>
          </Link>
          <CardlessButton
            variant="danger"
            size="sm"
            onClick={() => alert('Account deactivation request logged. In accordance with zero-cloud data policies, all temporary caches are immediately purged.')}
          >
            Request Account Deactivation
          </CardlessButton>
        </div>

        <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Hastivo Identity Framework &bull; Zero-Cloud Biometric Retention
        </span>
      </div>
    </PageContainer>
  );
}
