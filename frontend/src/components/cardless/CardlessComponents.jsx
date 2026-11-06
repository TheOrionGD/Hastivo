import React from 'react';

/**
 * Hastivo — Global Editorial / Swiss Grid Design System Components
 * 
 * Philosophy:
 * - Minimal, structured, and professional.
 * - Typography-driven rather than container-driven.
 * - Spacious with intentional negative space.
 * - Asymmetric but mathematically aligned (12-column grid desktop, 8 tablet, 4 mobile).
 * - Thin 1px separators and open content sections.
 * - Oversized typography (48–72px) and numerical statistics (48–64px).
 * - Small uppercase monospace labels (JetBrains Mono).
 * - Strictly NO conventional cards, floating panels, heavy shadows, or glassmorphism.
 */

// 1. PageContainer
export function PageContainer({
  children,
  maxWidth = 'var(--content-width)',
  className = '',
  style = {},
  ...props
}) {
  return (
    <div
      className={`cardless-page-container ${className}`}
      style={{
        width: '100%',
        maxWidth,
        margin: '0 auto',
        padding: 'clamp(32px, 5vw, 64px) clamp(20px, 4vw, 48px) clamp(100px, 12vh, 140px)',
        boxSizing: 'border-box',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

// 2. SwissGrid (12-column desktop, 8 tablet, 4 mobile)
export function SwissGrid({
  children,
  gap = 'clamp(16px, 2.5vw, 32px)',
  columns = 12,
  className = '',
  style = {},
  ...props
}) {
  return (
    <div
      className={`swiss-grid ${className}`}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap,
        width: '100%',
        boxSizing: 'border-box',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

// 3. SwissCol (Column span with optional tablet/mobile spans)
export function SwissCol({
  children,
  span = 12,
  tabSpan,
  _mobSpan = 4,
  className = '',
  style = {},
  ...props
}) {
  return (
    <div
      className={`swiss-col-${span} ${tabSpan ? `swiss-tab-col-${tabSpan}` : ''} ${className}`}
      style={{
        gridColumn: `span ${span} / span ${span}`,
        boxSizing: 'border-box',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

// 4. SectionDivider (Thin 1px razor-sharp horizontal divider)
export function SectionDivider({
  label,
  kicker,
  index,
  className = '',
  style = {},
  margin = 'clamp(28px, 4vw, 52px) 0',
}) {
  return (
    <div
      className={`swiss-divider-wrapper ${className}`}
      style={{
        margin,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        width: '100%',
        ...style,
      }}
    >
      <div
        style={{
          flex: 1,
          height: '1px',
          background: 'var(--border-subtle, var(--border))',
        }}
      />
      {(index || kicker || label) && (
        <span
          style={{
            fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)',
            fontSize: 'var(--text-eyebrow, 11px)',
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--text-secondary)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap',
          }}
        >
          {index && <span style={{ color: 'var(--color-coral)' }}>{index}</span>}
          {kicker && <span style={{ color: 'var(--color-coral)' }}>{kicker}</span>}
          {label}
        </span>
      )}
      {(index || kicker || label) && (
        <div
          style={{
            flex: 1,
            height: '1px',
            background: 'var(--border-subtle, var(--border))',
          }}
        />
      )}
    </div>
  );
}

// 5. EditorialHeader (Large typography, eyebrow, subtext, actions)
export function EditorialHeader({
  eyebrow,
  title,
  subtitle,
  actions,
  meta,
  className = '',
  style = {},
}) {
  return (
    <header
      className={`cardless-hero-header ${className}`}
      style={{
        marginBottom: 'clamp(32px, 5vw, 56px)',
        position: 'relative',
        ...style,
      }}
    >
      {(eyebrow || meta) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            marginBottom: '12px',
          }}
        >
          {eyebrow && (
            <span
              style={{
                fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)',
                fontSize: 'var(--text-eyebrow, 11px)',
                fontWeight: 600,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--color-coral)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: 'var(--color-coral)',
                }}
              />
              {eyebrow}
            </span>
          )}
          {meta && (
            <span
              style={{
                fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)',
                fontSize: 'var(--text-meta, 12px)',
                color: 'var(--text-muted)',
              }}
            >
              {meta}
            </span>
          )}
        </div>
      )}

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: '20px',
        }}
      >
        <div style={{ flex: '1 1 560px', maxWidth: '820px' }}>
          <h1 className="cardless-title">{title}</h1>
          {subtitle && <p className="cardless-subtitle">{subtitle}</p>}
        </div>
        {actions && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flexWrap: 'wrap',
              flexShrink: 0,
            }}
          >
            {actions}
          </div>
        )}
      </div>
    </header>
  );
}

// 6. OpenContentSection (Open Swiss section with thin bottom divider)
export function OpenContentSection({
  kicker,
  title,
  subtitle,
  actions,
  children,
  className = '',
  style = {},
  noBorder = false,
  ...props
}) {
  return (
    <section
      className={`cardless-open-section ${className}`}
      style={{
        padding: 'clamp(28px, 4vw, 56px) 0',
        borderBottom: noBorder ? 'none' : '1px solid var(--border-subtle, var(--border))',
        position: 'relative',
        ...style,
      }}
      {...props}
    >
      {(kicker || title || subtitle || actions) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '28px',
          }}
        >
          <div>
            {kicker && (
              <div
                style={{
                  fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)',
                  fontSize: 'var(--text-eyebrow, 11px)',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--color-coral)',
                  marginBottom: '8px',
                }}
              >
                {kicker}
              </div>
            )}
            {title && <h2 className="cardless-section-title">{title}</h2>}
            {subtitle && (
              <p
                style={{
                  fontSize: '0.95rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                  maxWidth: '740px',
                  margin: '6px 0 0',
                }}
              >
                {subtitle}
              </p>
            )}
          </div>
          {actions && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
              {actions}
            </div>
          )}
        </div>
      )}
      {children}
    </section>
  );
}

// 7. CardlessButton (Square or minimally rounded editorial button)
export function CardlessButton({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'ghost' | 'danger'
  size = 'md', // 'sm' | 'md' | 'lg'
  icon,
  className = '',
  style = {},
  disabled = false,
  onClick,
  ...props
}) {
  const sizeStyles = {
    sm: { padding: '6px 14px', fontSize: '0.82rem', gap: '6px' },
    md: { padding: '10px 18px', fontSize: '0.9rem', gap: '8px' },
    lg: { padding: '14px 28px', fontSize: '1rem', gap: '10px' },
  }[size] || { padding: '10px 18px', fontSize: '0.9rem', gap: '8px' };

  const variantStyles = {
    primary: {
      background: 'var(--color-coral)',
      color: '#ffffff',
      border: '1px solid var(--color-coral)',
    },
    secondary: {
      background: 'var(--color-blue)',
      color: 'var(--color-charcoal, #2E2E2E)',
      border: '1px solid var(--color-blue)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-primary)',
      border: '1px solid var(--border)',
    },
    danger: {
      background: 'rgba(255, 111, 97, 0.12)',
      color: 'var(--color-coral)',
      border: '1px solid var(--color-coral)',
    },
  }[variant] || {
    background: 'var(--color-coral)',
    color: '#ffffff',
    border: '1px solid var(--color-coral)',
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`cardless-btn cardless-btn-${variant} ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'inherit',
        fontWeight: 600,
        borderRadius: 'var(--btn-radius, 4px)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        transition: 'all var(--duration-fast, 150ms) ease',
        whiteSpace: 'nowrap',
        textDecoration: 'none',
        boxShadow: 'none',
        ...sizeStyles,
        ...variantStyles,
        ...style,
      }}
      {...props}
    >
      {icon && <span style={{ display: 'inline-flex', alignItems: 'center' }}>{icon}</span>}
      {children}
    </button>
  );
}

// 8. CardlessBadge (Compact monospace badge with thin 1px border)
export function CardlessBadge({
  children,
  color = 'coral', // 'coral' | 'blue' | 'amber' | 'grey'
  icon,
  style = {},
  className = '',
}) {
  const colorMap = {
    coral: {
      bg: 'rgba(255, 111, 97, 0.10)',
      text: 'var(--color-coral)',
      border: 'var(--color-coral)',
    },
    blue: {
      bg: 'rgba(111, 163, 239, 0.10)',
      text: 'var(--color-blue)',
      border: 'var(--color-blue)',
    },
    amber: {
      bg: 'rgba(255, 193, 7, 0.10)',
      text: 'var(--color-amber)',
      border: 'var(--color-amber)',
    },
    grey: {
      bg: 'transparent',
      text: 'var(--text-secondary)',
      border: 'var(--border)',
    },
  }[color] || {
    bg: 'rgba(111, 163, 239, 0.10)',
    text: 'var(--color-blue)',
    border: 'var(--color-blue)',
  };

  return (
    <span
      className={`cardless-badge ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '3px 8px',
        borderRadius: 'var(--radius-control, 4px)',
        fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)',
        fontSize: 'var(--text-eyebrow, 11px)',
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        background: colorMap.bg,
        color: colorMap.text,
        border: `1px solid ${colorMap.border}`,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {icon && <span style={{ display: 'inline-flex', alignItems: 'center' }}>{icon}</span>}
      {children}
    </span>
  );
}

// 9. CardlessStatsRow / SwissMetricGrid (Oversized figures with monospace labels)
export function CardlessStatsRow({ stats = [], style = {} }) {
  return (
    <div
      className="cardless-stats-grid"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fit, minmax(200px, 1fr))`,
        gap: 'clamp(20px, 3vw, 40px)',
        padding: 'clamp(24px, 3.5vw, 40px) 0',
        borderTop: '1px solid var(--border-subtle, var(--border))',
        borderBottom: '1px solid var(--border-subtle, var(--border))',
        margin: '24px 0',
        ...style,
      }}
    >
      {stats.map((stat, i) => (
        <div key={i} className="swiss-metric-block" style={{ borderLeft: i > 0 ? '1px solid var(--border-subtle, transparent)' : 'none', paddingLeft: i > 0 ? 'clamp(12px, 2vw, 24px)' : '0' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
            <span
              className="swiss-metric-value"
              style={{
                color: stat.color || 'var(--text-primary)',
              }}
            >
              {stat.value}
            </span>
            {stat.badge && (
              <span
                style={{
                  fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)',
                  fontSize: '10px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  padding: '2px 6px',
                  borderRadius: '2px',
                  background: 'rgba(111, 163, 239, 0.15)',
                  color: 'var(--color-blue)',
                  border: '1px solid var(--color-blue)',
                }}
              >
                {stat.badge}
              </span>
            )}
          </div>
          <span className="swiss-metric-label">
            {stat.label}
          </span>
          {stat.subtext && (
            <span className="swiss-metric-subtext">
              {stat.subtext}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

// 10. EditorialModuleDirectory & Item (Numbered 01, 02..., large title, concise description, thin separators, small arrows)
export function EditorialModuleDirectory({ children, className = '', style = {} }) {
  return (
    <div
      className={`swiss-directory ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        borderTop: '1px solid var(--border-subtle, var(--border))',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function EditorialModuleItem({
  number,
  title,
  subtitle,
  description,
  to,
  accent = 'var(--color-coral)',
  badge,
  icon,
  onClick,
  className = '',
  style = {},
}) {
  const Component = to ? 'a' : 'div';
  return (
    <Component
      href={to}
      onClick={onClick}
      className={`swiss-directory-item ${className}`}
      style={{
        display: 'grid',
        gridTemplateColumns: '52px 1.4fr 2fr 40px',
        gap: 'clamp(16px, 2.5vw, 32px)',
        alignItems: 'baseline',
        padding: 'clamp(20px, 3vw, 28px) 0',
        borderBottom: '1px solid var(--border-subtle, var(--border))',
        textDecoration: 'none',
        color: 'inherit',
        transition: 'padding-left var(--duration-fast, 150ms) ease',
        ...style,
      }}
    >
      <span
        className="swiss-directory-num"
        style={{
          fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)',
          fontSize: '0.85rem',
          fontWeight: 700,
          color: accent,
          letterSpacing: '0.05em',
        }}
      >
        {number}
      </span>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          {icon && <span style={{ color: accent, display: 'inline-flex' }}>{icon}</span>}
          <h3 className="swiss-directory-title">{title}</h3>
        </div>
        {subtitle && (
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            {subtitle}
          </span>
        )}
      </div>
      <p className="swiss-directory-desc">{description}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
        {badge && (
          <span
            style={{
              fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)',
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: accent,
            }}
          >
            {badge}
          </span>
        )}
        <span
          className="swiss-directory-arrow"
          style={{
            fontSize: '1.2rem',
            color: accent,
          }}
        >
          &rarr;
        </span>
      </div>
    </Component>
  );
}

// 11. SwissTable (Data-dense table with 1px horizontal borders)
export function SwissTable({ headers = [], children, className = '', style = {} }) {
  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <table className={`swiss-table ${className}`} style={{ width: '100%', ...style }}>
        {headers.length > 0 && (
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th key={i}>{h}</th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

// 12. SpatialFloatingPill (Apple Vision Pro-style contextual floating pill)
export function SpatialFloatingPill({
  children,
  className = '',
  style = {},
  ...props
}) {
  return (
    <div
      className={`spatial-floating-pill ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 14px',
        background: 'var(--surface-elevated, rgba(30, 34, 41, 0.9))',
        border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.15))',
        borderRadius: '24px',
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-sans)',
        fontSize: '0.85rem',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

// 13. HorizontalDataBand (Full-width minimal band for high-impact metric presentation)
export function HorizontalDataBand({
  kicker,
  title,
  value,
  subtext,
  action,
  accent = 'var(--color-blue)',
  style = {},
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '24px',
        padding: 'clamp(20px, 3vw, 36px) 0',
        borderBottom: '1px solid var(--border-subtle, var(--border))',
        ...style,
      }}
    >
      <div>
        {kicker && (
          <span
            style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '0.6875rem',
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: accent,
              display: 'block',
              marginBottom: '6px',
            }}
          >
            [ {kicker} ]
          </span>
        )}
        <h4 style={{ margin: 0, fontSize: 'clamp(1.2rem, 1.8vw, 1.6rem)', fontWeight: 700, color: 'var(--text-primary)' }}>
          {title}
        </h4>
        {subtext && <p style={{ margin: '4px 0 0', fontSize: '0.875rem', color: 'var(--text-muted)' }}>{subtext}</p>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {value && (
          <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 'clamp(1.8rem, 2.8vw, 2.4rem)', fontWeight: 800, color: accent }}>
            {value}
          </span>
        )}
        {action}
      </div>
    </div>
  );
}
