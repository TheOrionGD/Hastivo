import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export const FloatingThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="fixed top-6 right-6 z-50">
      <button
        onClick={toggleTheme}
        className="w-11 h-11 rounded-full flex items-center justify-center bg-[var(--surface-overlay)] border border-[var(--border)] text-[var(--text-primary)] hover:text-[var(--primary)] hover:border-[var(--primary)] backdrop-blur-md shadow-lg transition-all hover:scale-110 active:scale-95 cursor-pointer"
        title={`Toggle Theme (Current: ${theme})`}
        aria-label="Toggle Theme"
      >
        {theme === 'dark' ? (
          <Sun className="w-4 h-4 text-[var(--accent)] animate-pulse" />
        ) : (
          <Moon className="w-4 h-4 text-[var(--text-primary)]" />
        )}
      </button>
    </div>
  );
};
