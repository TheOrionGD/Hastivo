import React, { createContext, useContext, useState, useEffect } from 'react';
import config from '../config/env';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('hastivo_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return 'light'; // Default to Light theme per Master Swiss Editorial Specification
  });

  const [backendSyncStatus, setBackendSyncStatus] = useState('LOCAL_ONLY');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('hastivo_theme', theme);

    let active = true;
    // Sync to backend MongoDB user preferences if configured
    if (config.isConfigured.api) {
      fetch(`${config.apiBaseUrl}/api/v1/user/preferences/theme`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme }),
      })
        .then((res) => {
          if (!active) return;
          if (res.ok) setBackendSyncStatus('SYNCED');
          else setBackendSyncStatus('FAILED');
        })
        .catch(() => {
          if (active) setBackendSyncStatus('UNREACHABLE');
        });
    }
    return () => {
      active = false;
    };
  }, [theme]);

  const toggleTheme = (e) => {
    // Circular reveal transition if supported and user has no reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const nextTheme = theme === 'light' ? 'dark' : 'light';

    if (!document.startViewTransition || prefersReducedMotion || !e) {
      setTheme(nextTheme);
      return;
    }

    const x = e.clientX ?? window.innerWidth / 2;
    const y = e.clientY ?? 0;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = document.startViewTransition(() => {
      setTheme(nextTheme);
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 350,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          pseudoElement: '::view-transition-new(root)',
        }
      );
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, backendSyncStatus }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
