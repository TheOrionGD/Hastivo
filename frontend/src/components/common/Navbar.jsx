import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

export default function Navbar() {
  const { isAuthenticated, isAdmin, user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <header
      style={{
        background: 'var(--bg-primary)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        transition: 'background-color 0.3s ease',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '64px',
        }}
      >
        {/* Brand Logo */}
        <Link
          to={isAuthenticated ? '/dashboard' : '/'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
          }}
        >
          <img
            src="/logo.png"
            alt="Hastivo Logo"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-control, 4px)',
              objectFit: 'cover',
              boxShadow: 'none',
              border: '1px solid var(--border)',
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-display, "Manrope", sans-serif)',
              fontSize: '1.25rem',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
            }}
          >
            Hasti<span style={{ color: 'var(--color-coral)' }}>vo</span>
          </span>
        </Link>

        {/* Center / Right Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Command Palette shortcut trigger */}
          <button
            onClick={() => {
              window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
            }}
            className="btn btn-ghost btn-sm"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              fontSize: '0.8rem',
            }}
            title="Open Command Palette (Ctrl+K)"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <span className="hidden-mobile">Search</span>
            <kbd style={{ fontSize: '0.7rem', padding: '1px 5px', background: 'var(--bg-tertiary)', borderRadius: '3px', border: '1px solid var(--border)' }}>
              Ctrl+K
            </kbd>
          </button>

          {/* Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            className="btn btn-ghost btn-sm"
            style={{ padding: '8px', borderRadius: 'var(--radius-control, 4px)', border: '1px solid var(--border)' }}
          >
            {theme === 'light' ? (
              // Moon Icon
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              </svg>
            ) : (
              // Sun Icon
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-amber)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
              </svg>
            )}
          </button>

          {/* Authenticated user actions or Public sign-in */}
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link
                to="/user-profile"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  textDecoration: 'none',
                }}
                title={user?.email || 'User Profile'}
              >
                <span className={`badge ${isAdmin ? 'badge-coral' : 'badge-blue'}`}>
                  {isAdmin ? 'Admin' : (user?.displayName || user?.email?.split('@')[0] || 'Citizen')}
                </span>
              </Link>
              <button
                onClick={() => {
                  signOut();
                  navigate('/signin');
                }}
                className="btn btn-ghost btn-sm"
                style={{ fontSize: '0.8rem' }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link to="/signin" className="btn btn-ghost btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
