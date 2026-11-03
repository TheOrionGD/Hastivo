import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import '../../styles/circular-remote-nav.css';

/**
 * Hastivo — Minimal Cardless Floating Navigation Bar
 * Master Specification Section 2.A:
 * - Floating, position-aware, visually lightweight.
 * - Transparent / subtly translucent background adapting to light and dark themes.
 * - No heavy card-like container or bulky borders.
 * - Smooth hover and active states with brand accent colors (#FF6F61, #6FA3EF, #FFC107).
 * - Icon and label support with mobile responsiveness.
 * - Direct access to:
 *   1. Home Dashboard (/dashboard)
 *   2. Text-to-Sign (/text-to-sign)
 *   3. Sign-to-Text (/sign-to-text)
 *   4. Real-Time Conversation (/conversation)
 *   5. Conversation History (/history)
 *   6. Settings (/settings)
 *   7. Profile (/profile)
 *   (+ Admin Console if role === admin)
 * - Hidden on Splash and Onboarding screens.
 */
export default function FloatingNav() {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const [isDropHovered, setIsDropHovered] = useState(false);
  const [warpActive, setWarpActive] = useState(false);
  const hubRef = useRef(null);

  // Close remote dial on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Hidden on splash and onboarding screens per specification
  if (location.pathname === '/' || location.pathname === '/splash' || location.pathname === '/onboarding') {
    return null;
  }

  // Primary destinations exactly per Master Prompt Section 2.A
  const primaryNavItems = isAuthenticated
    ? [
        {
          to: '/dashboard',
          aliases: ['/dashboard', '/app/dashboard'],
          label: t('dashboard') || 'Dashboard',
          icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
            </svg>
          ),
          accent: 'var(--color-blue)',
        },
        {
          to: '/text-to-sign',
          aliases: ['/text-to-sign', '/app/text-to-sign'],
          label: t('textToSign') || 'Text-to-Sign',
          icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          ),
          accent: 'var(--color-coral)',
        },
        {
          to: '/sign-to-text',
          aliases: ['/sign-to-text', '/app/sign-to-text'],
          label: t('signToText') || 'Sign-to-Text',
          icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 7l-7 5 7 5V7z" />
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            </svg>
          ),
          accent: 'var(--color-amber)',
        },
        {
          to: '/conversation',
          aliases: ['/conversation', '/app/real-time-conversation'],
          label: t('realTime') || 'Real-Time',
          icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 6.1H3a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2z" />
              <path d="M23 12h-4" />
            </svg>
          ),
          accent: 'var(--color-coral)',
        },
        {
          to: '/history',
          aliases: ['/history', '/app/history'],
          label: t('history') || 'History',
          icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          ),
          accent: 'var(--color-blue)',
        },
        {
          to: '/settings',
          aliases: ['/settings', '/app/settings'],
          label: t('settings') || 'Settings',
          icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          ),
          accent: 'var(--color-coral)',
        },
        {
          to: '/profile',
          aliases: ['/profile', '/app/profile'],
          label: t('profile') || 'Profile',
          icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          ),
          accent: 'var(--color-amber)',
        },
        ...(isAdmin
          ? [
              {
                to: '/admin',
                aliases: ['/admin', '/admin/dashboard', '/admin/moderation', '/admin/users', '/admin/restrictions', '/admin/audit', '/admin/audit-logs'],
                label: t('admin') || 'Admin',
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                ),
                accent: 'var(--color-coral)',
              },
            ]
          : []),
      ]
    : [
        {
          to: '/landing',
          aliases: ['/landing', '/home'],
          label: 'Overview',
          icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          ),
          accent: 'var(--color-blue)',
        },
        {
          to: '/signin',
          aliases: ['/signin', '/login'],
          label: t('signIn') || 'Sign In',
          icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
          ),
          accent: 'var(--color-coral)',
        },
        {
          to: '/register',
          aliases: ['/register'],
          label: t('register') || 'Register',
          icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="8.5" cy="7.5" r="4" />
              <line x1="20" y1="8" x2="20" y2="14" />
              <line x1="23" y1="11" x2="17" y2="11" />
            </svg>
          ),
          accent: 'var(--color-amber)',
        },
      ];

  const handleNavigate = (to) => {
    setWarpActive(true);
    setTimeout(() => {
      setIsOpen(false);
      setWarpActive(false);
      navigate(to);
    }, 180);
  };

  const isCurrentActive = (item) => {
    return item.aliases.some((alias) => location.pathname === alias || location.pathname.startsWith(alias + '/'));
  };

  return (
    <>
      {/* ── Minimalist Swiss Floating Navigation Dock ── */}
      <nav
        className="hastivo-floating-dock cardless-floating-dock swiss-floating-dock"
        aria-label="Floating Navigation Bar"
        style={{
          position: 'fixed',
          bottom: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9990,
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '4px 8px',
          background: 'var(--surface-elevated, var(--bg-secondary))',
          borderRadius: 'var(--radius-control, 4px)',
          border: '1px solid var(--border)',
          boxShadow: 'none',
          transition: 'border-color var(--duration-fast, 150ms) ease',
          maxWidth: 'calc(100vw - 24px)',
          overflowX: 'auto',
        }}
      >
        {/* Brand Square Emblem */}
        <Link
          to={isAuthenticated ? '/dashboard' : '/landing'}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '24px',
            height: '24px',
            borderRadius: 'var(--radius-control, 2px)',
            background: 'var(--color-coral)',
            color: '#fff',
            textDecoration: 'none',
            fontSize: '0.70rem',
            fontWeight: 900,
            marginRight: '4px',
            flexShrink: 0,
          }}
          title="Hastivo"
        >
          S
        </Link>

        {/* Primary Screen Destinations */}
        {primaryNavItems.map((item) => {
          const active = isCurrentActive(item);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`cardless-dock-item ${active ? 'is-active' : ''}`}
              title={item.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 10px',
                borderRadius: 'var(--radius-control, 2px)',
                color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                background: 'transparent',
                borderBottom: active ? `2px solid ${item.accent}` : '2px solid transparent',
                textDecoration: 'none',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.82rem',
                fontWeight: active ? 700 : 500,
                transition: 'all var(--duration-fast, 150ms) ease',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  color: active ? item.accent : 'currentColor',
                  transition: 'color var(--duration-fast, 150ms) ease',
                }}
              >
                {item.icon}
              </span>
              <span className="dock-link-text">{item.label}</span>
            </Link>
          );
        })}

        {/* Subtle Separator */}
        <div
          style={{
            width: '1px',
            height: '18px',
            background: 'var(--border-subtle, var(--border))',
            margin: '0 4px',
            flexShrink: 0,
          }}
        />

        {/* Command Palette Trigger (⌘K) */}
        <button
          type="button"
          onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))}
          title="Command Palette (Ctrl+K / ⌘K)"
          aria-label="Open Command Palette"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 8px',
            borderRadius: 'var(--radius-control, 2px)',
            background: 'transparent',
            border: '1px solid var(--border-subtle, var(--border))',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            fontSize: '0.78rem',
            fontWeight: 600,
            transition: 'border-color var(--duration-fast, 150ms) ease',
            flexShrink: 0,
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <kbd
            style={{
              fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)',
              fontSize: '0.68rem',
              color: 'var(--text-secondary)',
            }}
          >
            ⌘K
          </kbd>
        </button>

        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          aria-label="Toggle Theme"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '28px',
            height: '28px',
            borderRadius: 'var(--radius-control, 2px)',
            background: 'transparent',
            border: '1px solid var(--border-subtle, var(--border))',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            fontSize: '0.80rem',
            transition: 'border-color var(--duration-fast, 150ms) ease',
            flexShrink: 0,
          }}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </nav>

      {/* Screen Transition Flash */}
      {warpActive && <div className="remote-warp-flash" />}

      {/* Circular Navigation Modal Layer */}
      {isOpen && (
        <div
          className="circular-remote-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <div className="circular-remote-hub" ref={hubRef}>
            <div className="remote-top-bar">
              <button
                type="button"
                className="remote-action-btn"
                onClick={toggleTheme}
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
              >
                {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
              </button>

              <button
                type="button"
                className="remote-action-btn"
                onClick={() => {
                  setIsOpen(false);
                  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
                }}
                title="Open Command Palette (Ctrl+K)"
              >
                🔍 ⌘K
              </button>

              <button
                type="button"
                className="remote-action-btn close-btn"
                onClick={() => setIsOpen(false)}
                title="Close Navigation"
              >
                ✕
              </button>
            </div>

            <div className="remote-orbit-stage">
              <div
                className={`remote-center-portal ${isDropHovered ? 'drop-active' : ''}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDropHovered(true);
                }}
                onDragLeave={() => setIsDropHovered(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  const destination = e.dataTransfer.getData('text/plain') || draggedItem?.to;
                  setIsDropHovered(false);
                  setDraggedItem(null);
                  if (destination) handleNavigate(destination);
                }}
                onClick={() => handleNavigate(isAuthenticated ? '/dashboard' : '/landing')}
                title="Click or Drop icon here to warp"
              >
                <div className="portal-iris" />
                <div className="portal-label">
                  <span className="portal-glow-text">HASTIVO</span>
                  <span className="portal-sub">PORTAL</span>
                </div>
              </div>

              {primaryNavItems.map((item, index) => {
                const total = primaryNavItems.length;
                const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
                const radius = 135;
                const x = Math.round(Math.cos(angle) * radius);
                const y = Math.round(Math.sin(angle) * radius);

                return (
                  <button
                    key={item.to}
                    type="button"
                    className="orbit-satellite-node"
                    style={{
                      transform: `translate(${x}px, ${y}px)`,
                      '--node-accent': item.accent,
                    }}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', item.to);
                      setDraggedItem(item);
                    }}
                    onDragEnd={() => setDraggedItem(null)}
                    onClick={() => handleNavigate(item.to)}
                    title={`Go to ${item.label}`}
                  >
                    <span className="node-icon">{item.icon}</span>
                    <span className="node-caption">{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="remote-bottom-help" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px' }}>
              <span>✦ Click any destination to jump</span>
              {isAuthenticated && (
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    logout();
                    navigate('/');
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--color-coral)',
                    cursor: 'pointer',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                  }}
                >
                  Sign Out
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
