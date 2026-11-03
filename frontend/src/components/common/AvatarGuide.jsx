import React, { useState } from 'react';

export default function AvatarGuide({
  featureName = 'This feature',
  description = 'Welcome to this workspace. Follow the instructions to navigate or convert sign language.',
  pose = 'wave',
}) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div
      role="complementary"
      aria-label="Avatar Guide Companion"
      style={{
        position: 'relative',
        background: 'transparent',
        border: 'none',
        borderBottom: '1px solid var(--border)',
        borderRadius: 0,
        padding: '16px 0',
        margin: '16px 0 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        boxShadow: 'none',
        animation: 'fadeInDown 0.25s ease-out',
      }}
    >
      {/* Robot Avatar Stylized Badge (Swiss Square Minimal Control) */}
      <div
        style={{
          width: '44px',
          height: '44px',
          borderRadius: 'var(--radius-control, 4px)',
          background: 'var(--color-charcoal)',
          border: '1px solid var(--color-blue)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          position: 'relative',
        }}
      >
        {/* Robot Face SVG */}
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--color-grey)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="6" width="18" height="13" rx="3" />
          <circle cx="8.5" cy="11.5" r="1.5" fill="var(--color-coral)" />
          <circle cx="15.5" cy="11.5" r="1.5" fill="var(--color-blue)" />
          <line x1="9" y1="15" x2="15" y2="15" stroke="var(--color-amber)" />
          <line x1="12" y1="2" x2="12" y2="6" stroke="var(--color-blue)" />
        </svg>

        {/* Pose indicator dot */}
        <span
          style={{
            position: 'absolute',
            bottom: '-2px',
            right: '-2px',
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: 'var(--color-amber)',
            border: '2px solid var(--bg-card)',
          }}
          title={`Avatar Pose: ${pose}`}
        />
      </div>

      {/* Guide text */}
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
          <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
            Hastivo Assistant &bull; {featureName}
          </strong>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            (Pose: {pose})
          </span>
        </div>
        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
          {description}
        </p>
      </div>

      {/* Dismiss button */}
      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss guide companion"
        className="btn-ghost"
        style={{
          border: 'none',
          padding: '4px 8px',
          borderRadius: '4px',
          color: 'var(--text-muted)',
          fontSize: '1.1rem',
          lineHeight: 1,
        }}
      >
        &times;
      </button>
    </div>
  );
}
