import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { getRoutesForRole } from '../../navigation/routeRegistry';

/**
 * Hastivo AI — Global Cardless Command Palette
 * Master Specification Section 2.B:
 * - Triggered via Ctrl+K / Cmd+K or visible search trigger.
 * - Search all accessible destinations + actions.
 * - Arrow navigation, Enter to execute, Escape to close.
 * - Quick Actions:
 *   - Open Dashboard
 *   - Start Text-to-Sign
 *   - Open Sign-to-Text
 *   - Start Real-Time Conversation
 *   - View Conversation History
 *   - Change Language
 *   - Switch Theme
 *   - Open Profile
 *   - Open Settings
 *   - Logout
 * - Recently accessed destinations.
 * - Theme-aware cardless aesthetic: sleek translucent surface, 1px subtle border, no heavy card shadows.
 */
export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recents, setRecents] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem('hastivo_recent_commands') || '[]');
    } catch {
      return [];
    }
  });

  const { role, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  // Global Actions List
  const quickActions = [
    {
      id: 'action-dashboard',
      label: 'Open Dashboard',
      description: 'Navigate to Citizen central hub and translation metrics',
      category: 'Navigation',
      icon: '🏠',
      action: () => navigate('/dashboard'),
    },
    {
      id: 'action-text-to-sign',
      label: 'Start Text-to-Sign',
      description: 'Convert text or speech into 3D sign language avatar signs',
      category: 'Translation',
      icon: '🤖',
      action: () => navigate('/text-to-sign'),
    },
    {
      id: 'action-sign-to-text',
      label: 'Open Sign-to-Text',
      description: 'Computer-vision camera recognition translating hand gestures to captions',
      category: 'Translation',
      icon: '📹',
      action: () => navigate('/sign-to-text'),
    },
    {
      id: 'action-conversation',
      label: 'Start Real-Time Conversation',
      description: 'Simultaneous two-way speech-to-sign and sign-to-speech interaction',
      category: 'Communication',
      icon: '🔄',
      action: () => navigate('/conversation'),
    },
    {
      id: 'action-history',
      label: 'View Conversation History',
      description: 'Review saved translation logs and verified conversation records',
      category: 'Communication',
      icon: '📜',
      action: () => navigate('/history'),
    },
    {
      id: 'action-theme',
      label: `Switch Theme to ${theme === 'light' ? 'Dark' : 'Light'}`,
      description: `Toggle active visual theme (currently ${theme})`,
      category: 'Preferences',
      icon: theme === 'light' ? '🌙' : '☀️',
      action: () => toggleTheme(),
    },
    {
      id: 'action-settings',
      label: 'Open Settings',
      description: 'Configure interface language, appearance, voice, and privacy preferences',
      category: 'Account',
      icon: '⚙️',
      action: () => navigate('/settings'),
    },
    {
      id: 'action-profile',
      label: 'Open Profile',
      description: 'View authenticated account identity and permissions',
      category: 'Account',
      icon: '👤',
      action: () => navigate('/profile'),
    },
    {
      id: 'action-language',
      label: 'Change Language',
      description: 'Cycle through the 7 supported languages (English, Tamil, Telugu, Hindi, etc.)',
      category: 'Preferences',
      icon: '🌐',
      action: () => navigate('/settings'),
    },
    ...(isAuthenticated
      ? [
          {
            id: 'action-logout',
            label: 'Logout',
            description: 'Safely end active session and return to sign in',
            category: 'Account',
            icon: '🚪',
            action: async () => {
              if (logout) await logout();
              navigate('/signin');
            },
          },
        ]
      : []),
  ];

  // Accessible Routes based on user role
  const accessibleRoutes = getRoutesForRole(role)
    .filter((r) => r.inPalette)
    .map((r) => ({
      id: `route-${r.id}`,
      label: r.label,
      description: r.description,
      category: r.category,
      icon: '📍',
      action: () => navigate(r.path),
    }));

  // Combined List: Actions first, then routes
  const allCommands = [...quickActions, ...accessibleRoutes];

  // Filtering
  const filteredCommands = allCommands.filter((cmd) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      cmd.label.toLowerCase().includes(q) ||
      cmd.description?.toLowerCase().includes(q) ||
      cmd.category?.toLowerCase().includes(q)
    );
  });

  // Global hotkey Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => {
          if (!prev) {
            setQuery('');
            setSelectedIndex(0);
          }
          return !prev;
        });
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 40);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleExecute = (cmd) => {
    // Save to recents
    const updated = [cmd.label, ...recents.filter((r) => r !== cmd.label)].slice(0, 5);
    setRecents(updated);
    try {
      sessionStorage.setItem('hastivo_recent_commands', JSON.stringify(updated));
    } catch {}

    setIsOpen(false);
    if (cmd.action) cmd.action();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredCommands.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % (filteredCommands.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        handleExecute(filteredCommands[selectedIndex]);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Navigation & Command Palette"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: theme === 'light' ? 'rgba(0, 0, 0, 0.40)' : 'rgba(0, 0, 0, 0.70)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '10vh 16px 20px',
      }}
      onClick={() => setIsOpen(false)}
    >
      {/* Cardless Palette Modal Surface */}
      <div
        style={{
          width: '100%',
          maxWidth: '620px',
          background: 'var(--surface, var(--bg-primary))',
          borderRadius: 'var(--radius-control, 4px)',
          border: '1px solid var(--border)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'none',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-subtle, var(--border))',
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--color-blue)"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or screen... (e.g. 'Text-to-Sign', 'Switch Theme')"
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '1rem',
              color: 'var(--text-primary)',
              fontFamily: 'inherit',
            }}
          />
          <kbd
            style={{
              fontSize: '0.72rem',
              fontWeight: 600,
              padding: '2px 6px',
              borderRadius: '4px',
              background: 'transparent',
              border: '1px solid var(--border)',
              color: 'var(--text-secondary)',
            }}
          >
            ESC
          </kbd>
        </div>

        {/* Recently Used Chips (when not searching) */}
        {!query.trim() && recents.length > 0 && (
          <div
            style={{
              padding: '10px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              overflowX: 'auto',
              borderBottom: '1px solid var(--border-subtle, var(--border))',
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
            }}
          >
            <span style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Recent:</span>
            {recents.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  const match = allCommands.find((c) => c.label === item);
                  if (match) handleExecute(match);
                }}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--border)',
                  borderRadius: '999px',
                  padding: '2px 10px',
                  fontSize: '0.74rem',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {item}
              </button>
            ))}
          </div>
        )}

        {/* Commands Results List */}
        <div style={{ maxHeight: '380px', overflowY: 'auto', padding: '6px 0' }}>
          {filteredCommands.length === 0 ? (
            <div style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.90rem' }}>
              No matching commands or destinations found.
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={cmd.id}
                  onClick={() => handleExecute(cmd)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  style={{
                    padding: '11px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    cursor: 'pointer',
                    background: isSelected
                      ? theme === 'light'
                        ? 'rgba(111, 163, 239, 0.12)'
                        : 'rgba(111, 163, 239, 0.18)'
                      : 'transparent',
                    borderLeft: isSelected ? '3px solid var(--color-coral)' : '3px solid transparent',
                    transition: 'all 0.1s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '1.1rem', width: '22px', textAlign: 'center' }}>
                      {cmd.icon}
                    </span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                        {cmd.label}
                      </div>
                      {cmd.description && (
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          {cmd.description}
                        </div>
                      )}
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: 'transparent',
                      color: 'var(--color-blue)',
                      border: '1px solid var(--border)',
                      flexShrink: 0,
                    }}
                  >
                    {cmd.category}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Hints */}
        <div
          style={{
            padding: '10px 20px',
            borderTop: '1px solid var(--border-subtle, var(--border))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.74rem',
            color: 'var(--text-secondary)',
          }}
        >
          <div style={{ display: 'flex', gap: '14px' }}>
            <span>↑↓ Navigate</span>
            <span>↵ Execute</span>
            <span>Esc Close</span>
          </div>
          <span>Role: <strong>{role ? role.toUpperCase() : 'CITIZEN'}</strong></span>
        </div>
      </div>
    </div>
  );
}
