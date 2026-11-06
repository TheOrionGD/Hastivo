import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import '../../styles/atomic-orbit-nav.css';

/**
 * Hastivo — Atomic Orbit Floating Navigation & Drop Portal
 * 
 * Flow & Interaction:
 * - Positioned as a floating circular FAB at bottom-right of viewport.
 * - Clicking the circular FAB reveals an atomic orbit stage centered on screen.
 * - Center "Drop" Nucleus: Acts as an attractor drop target.
 * - Circular orbit ring: Houses accessible page icons arranged like electrons around a nucleus.
 * - Interactive Drag-and-Drop:
 *     - Dragging any electron page icon and releasing it into the central "Drop" nucleus
 *       instantly triggers transition/navigation to that page.
 *     - Clicking also provides a convenient direct jump.
 * - Listens for global 'k' key (Ctrl+K / Cmd+K) to toggle.
 * - Hidden on Splash and Onboarding screens.
 */
export default function FloatingNav() {
  const { isAuthenticated, isAdmin, role, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const [isDropHovered, setIsDropHovered] = useState(false);
  const [warpActive, setWarpActive] = useState(false);
  const hubRef = useRef(null);

  // Close on Escape or open via Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Hidden on splash and onboarding screens
  if (location.pathname === '/' || location.pathname === '/splash' || location.pathname === '/onboarding') {
    return null;
  }

  // Define full accessible navigation suite based on current user role
  const accessibleItems = isAuthenticated
    ? [
        {
          id: 'dashboard',
          to: '/dashboard',
          label: t('dashboard') || 'Dashboard',
          accent: 'var(--color-blue, #6FA3EF)',
          icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
            </svg>
          ),
        },
        {
          id: 'text-to-sign',
          to: '/text-to-sign',
          label: t('textToSign') || 'Text-to-Sign',
          accent: 'var(--color-coral, #FF6F61)',
          icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          ),
        },
        {
          id: 'sign-to-text',
          to: '/sign-to-text',
          label: t('signToText') || 'Sign-to-Text',
          accent: 'var(--color-blue, #6FA3EF)',
          icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 7l-7 5 7 5V7z" />
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            </svg>
          ),
        },
        {
          id: 'conversation',
          to: '/conversation',
          label: t('conversation') || 'Live Duplex',
          accent: 'var(--color-amber, #FFC107)',
          icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 6.1H3a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2z" />
              <path d="M23 12h-4" />
            </svg>
          ),
        },
        {
          id: 'history',
          to: '/history',
          label: t('history') || 'History',
          accent: 'var(--color-coral, #FF6F61)',
          icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          ),
        },
        {
          id: 'profile',
          to: '/profile',
          label: t('profile') || 'Profile',
          accent: 'var(--color-blue, #6FA3EF)',
          icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          ),
        },
        {
          id: 'settings',
          to: '/settings',
          label: t('settings') || 'Settings',
          accent: 'var(--color-amber, #FFC107)',
          icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          ),
        },
        ...(isAdmin || role === 'admin'
          ? [
              {
                id: 'admin',
                to: '/admin',
                label: 'Admin Hub',
                accent: 'var(--color-coral, #FF6F61)',
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                ),
              },
            ]
          : []),
      ]
    : [
        {
          id: 'landing',
          to: '/landing',
          label: 'Landing',
          accent: 'var(--color-blue, #6FA3EF)',
          icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          ),
        },
        {
          id: 'signin',
          to: '/signin',
          label: 'Sign In',
          accent: 'var(--color-coral, #FF6F61)',
          icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
          ),
        },
        {
          id: 'register',
          to: '/register',
          label: 'Register',
          accent: 'var(--color-amber, #FFC107)',
          icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="8.5" cy="7.5" r="4" />
              <line x1="20" y1="8" x2="20" y2="14" />
              <line x1="23" y1="11" x2="17" y2="11" />
            </svg>
          ),
        },
        {
          id: 'about',
          to: '/about',
          label: 'About',
          accent: 'var(--color-blue, #6FA3EF)',
          icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          ),
        },
      ];

  const handleNavigate = (to) => {
    setWarpActive(true);
    setTimeout(() => {
      setIsOpen(false);
      setWarpActive(false);
      navigate(to);
    }, 220);
  };

  const isCurrentActive = (item) => {
    return location.pathname === item.to || location.pathname.startsWith(item.to + '/');
  };

  return (
    <>
      {/* ── 1. Circular Floating Element (Fixed at Bottom-Right Corner) ── */}
      <button
        type="button"
        className="atomic-nav-fab hastivo-floating-dock"
        onClick={() => setIsOpen(true)}
        aria-label="Open Navigation Orbit"
        title="Open Navigation (Atomic Orbit)"
      >
        <span className="atomic-fab-pulse" />
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {/* Atomic orbit icon */}
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12" opacity="0.4" />
          <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(30 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-30 12 12)" />
        </svg>

        <span className="atomic-fab-tooltip">
          Navigation Orbit (⌘K)
        </span>
      </button>

      {/* Screen Warp Flash on Drop / Selection */}
      {warpActive && <div className="atomic-warp-flash" />}

      {/* ── 2. Fullscreen Atomic Component (Wheel Structure & Orbit) ── */}
      {isOpen && (
        <div
          className="atomic-modal-backdrop circular-remote-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <div className="atomic-orbit-hub" ref={hubRef}>
            {/* Top Command Controls */}
            <div className="atomic-top-bar">
              <button
                type="button"
                className="atomic-control-btn"
                onClick={toggleTheme}
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
              >
                {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
              </button>

              <button
                type="button"
                className="atomic-control-btn close-btn"
                onClick={() => setIsOpen(false)}
                title="Close Navigation"
              >
                ✕ Close
              </button>
            </div>

            {/* Atomic Orbits (Circular concentric wheel outlines) */}
            <div className="atomic-orbit-ring atomic-orbit-ring-outer" />
            <div className="atomic-orbit-ring atomic-orbit-ring-mid" />

            {/* Wheel Spokes (Geometric outline) */}
            <div className="atomic-orbit-spokes">
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                <div
                  key={deg}
                  className="atomic-spoke"
                  style={{ transform: `rotate(${deg}deg)` }}
                />
              ))}
            </div>

            {/* ── Center Nucleus (Drop Target) ── */}
            <div
              className={`atomic-nucleus-dropzone ${isDropHovered ? 'is-drop-active' : ''}`}
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
                if (destination) {
                  handleNavigate(destination);
                }
              }}
              onClick={() => handleNavigate(isAuthenticated ? '/dashboard' : '/landing')}
              title="Drop any page icon here to navigate"
            >
              <span className="nucleus-ring-glow" />
              <div className="nucleus-label">DROP</div>
              <div className="nucleus-subtext">HERE TO WARP</div>
            </div>

            {/* ── Orbiting Electron Page Icons (Draggable) ── */}
            <div className="atomic-orbit-electrons">
              {accessibleItems.map((item, index) => {
                const total = accessibleItems.length;
                // Distribute evenly around 360 degrees starting from top (-90 deg)
                const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
                // Orbit radius calibrated to sit cleanly on the outer orbit ring
                const radius = 175;
                const x = Math.round(Math.cos(angle) * radius);
                const y = Math.round(Math.sin(angle) * radius);
                const active = isCurrentActive(item);

                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`atomic-electron-btn ${active ? 'is-active-route' : ''} ${draggedItem?.id === item.id ? 'is-dragging' : ''}`}
                    style={{
                      transform: `translate(${x}px, ${y}px)`,
                      '--node-accent': item.accent,
                    }}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', item.to);
                      e.dataTransfer.effectAllowed = 'move';
                      setDraggedItem(item);
                    }}
                    onDragEnd={() => {
                      setDraggedItem(null);
                      setIsDropHovered(false);
                    }}
                    onClick={() => handleNavigate(item.to)}
                    title={`Drag to center DROP area or click to open ${item.label}`}
                  >
                    <span className="electron-icon" style={{ color: active ? 'var(--color-coral)' : item.accent }}>
                      {item.icon}
                    </span>
                    <span className="electron-label">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Bottom Instructional Caption */}
            <div className="atomic-instructions-strip">
              <span>⚛ Drag any electron icon into the central <strong>DROP</strong> nucleus</span>
              {isAuthenticated && (
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    if (logout) logout();
                    navigate('/signin');
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--color-coral)',
                    cursor: 'pointer',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    marginLeft: '8px',
                    padding: 0,
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
