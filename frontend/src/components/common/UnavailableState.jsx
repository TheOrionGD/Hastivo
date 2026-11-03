import React from 'react';

export default function UnavailableState({
  title = 'Service Unavailable',
  message = 'This service is currently unconfigured or unreachable. No mock data is presented.',
  actionLabel,
  onAction,
  iconType = 'warning',
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        textAlign: 'center',
        background: 'transparent',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        maxWidth: '640px',
        margin: '32px auto',
      }}
    >
      <div
        style={{
          width: '52px',
          height: '52px',
          borderRadius: 'var(--radius-control, 4px)',
          background:
            iconType === 'error'
              ? 'rgba(255,111,97,0.12)'
              : 'rgba(255,193,7,0.12)',
          border: `1px solid ${iconType === 'error' ? 'var(--color-coral)' : 'var(--color-amber)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px',
        }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke={iconType === 'error' ? 'var(--color-coral)' : 'var(--color-amber)'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>

      <h3
        style={{
          fontSize: '1.2rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: '8px',
        }}
      >
        {title}
      </h3>

      <p
        style={{
          fontSize: '0.9rem',
          color: 'var(--text-muted)',
          maxWidth: '420px',
          lineHeight: 1.5,
          marginBottom: actionLabel ? '20px' : '0',
        }}
      >
        {message}
      </p>

      {actionLabel && (
        <button
          onClick={onAction}
          className="btn btn-ghost btn-sm"
          style={{ marginTop: '8px' }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
