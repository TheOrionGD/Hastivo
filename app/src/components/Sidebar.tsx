import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Globe, Sun, Moon, Command, Sparkles } from 'lucide-react';
import { LANGUAGE_METADATA, SupportedLanguage } from '../context/ThemeContext';

interface SidebarProps {
  onOpenContact: () => void;
  onOpenCommandPalette?: () => void;
  onTriggerAvatarDemo?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onOpenContact: _onOpenContact,
  onOpenCommandPalette,
  onTriggerAvatarDemo,
}) => {
  const { theme, toggleTheme, language, setLanguage } = useTheme();
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  return (
    <>
      {/* Left fixed hairline divider line */}
      <div
        className="fixed top-0 left-0 w-[90px] max-md:w-[50px] max-sm:hidden h-full border-r border-[var(--divider)] bg-[var(--surface)]/30 z-30 pointer-events-none transition-colors"
        aria-hidden="true"
      />

      {/* Left fixed sidebar rail */}
      <aside
        className="fixed top-0 left-0 w-[90px] max-md:w-[50px] max-sm:hidden h-full z-40 flex flex-col justify-between items-center bg-[var(--surface-overlay)] backdrop-blur-md transition-colors"
        aria-label="Sidebar navigation"
      >
        {/* Top Black Box with Dots Logo */}
        <a
          href="#top"
          className="w-[90px] h-[100px] max-md:w-[50px] max-md:h-[60px] bg-black flex items-center justify-center transition-all hover:bg-[var(--primary)] group"
          title="HASTIVO — Vibrant Connections Through Language Colors"
        >
          <img
            src="./assets/dots.svg"
            alt="HASTIVO logo dots"
            className="w-full h-full p-2 object-contain group-hover:scale-110 transition-transform invert dark:invert-0"
          />
        </a>

        {/* Center Utilities: Language, Theme, Command Palette */}
        <div className="flex flex-col items-center gap-5 py-6 my-auto">
          {/* Quick Language Selector */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="w-10 h-10 max-md:w-8 max-md:h-8 rounded-full flex flex-col items-center justify-center text-xs font-mono font-semibold text-[var(--text-primary)] hover:text-[var(--primary)] border border-[var(--border)] hover:border-[var(--primary)] transition-all bg-[var(--surface)] shadow-xs cursor-pointer"
              title={`Switch UI Language (Current: ${LANGUAGE_METADATA[language].label})`}
              aria-label="Switch UI Language"
            >
              <span className="text-[10px] uppercase font-bold leading-none">{language}</span>
              <Globe className="w-2.5 h-2.5 opacity-60 mt-0.5" />
            </button>

            {/* Language Dropdown Menu */}
            {langMenuOpen && (
              <div
                className="absolute left-full ml-3 top-1/2 -translate-y-1/2 w-48 bg-[var(--surface)] border border-[var(--border)] shadow-2xl py-2 z-50 rounded-none text-left"
                onMouseLeave={() => setLangMenuOpen(false)}
              >
                <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border-subtle)] mb-1">
                  7 UI Languages
                </div>
                {(Object.keys(LANGUAGE_METADATA) as SupportedLanguage[]).map((key) => {
                  const meta = LANGUAGE_METADATA[key];
                  const isActive = language === key;
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        setLanguage(key);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-xs flex items-center justify-between text-left hover:bg-[var(--primary)]/10 hover:text-[var(--primary)] transition-colors cursor-pointer ${
                        isActive
                          ? 'font-bold text-[var(--primary)] bg-[var(--primary)]/5'
                          : 'text-[var(--text-primary)]'
                      }`}
                    >
                      <span>{meta.label}</span>
                      <span className="font-mono text-[11px] opacity-70">{meta.nativeName}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Theme Toggle (Light / Dark) */}
          <button
            onClick={toggleTheme}
            className="w-10 h-10 max-md:w-8 max-md:h-8 rounded-full flex items-center justify-center text-[var(--text-primary)] hover:text-[var(--primary)] border border-[var(--border)] hover:border-[var(--primary)] transition-all bg-[var(--surface)] shadow-xs cursor-pointer"
            title={`Toggle Theme (Current: ${theme})`}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-[var(--accent)] animate-pulse" />
            ) : (
              <Moon className="w-4 h-4 text-[var(--text-primary)]" />
            )}
          </button>

          {/* Command Palette Trigger */}
          {onOpenCommandPalette && (
            <button
              onClick={onOpenCommandPalette}
              className="w-10 h-10 max-md:w-8 max-md:h-8 rounded-full flex items-center justify-center text-[var(--text-primary)] hover:text-[var(--primary)] border border-[var(--border)] hover:border-[var(--primary)] transition-all bg-[var(--surface)] shadow-xs cursor-pointer group"
              title="Global Command Palette (Ctrl+K or Cmd+K)"
              aria-label="Open Command Palette"
            >
              <Command className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </button>
          )}

          {/* Avatar Demo Fast Trigger */}
          {onTriggerAvatarDemo && (
            <button
              onClick={onTriggerAvatarDemo}
              className="w-10 h-10 max-md:w-8 max-md:h-8 rounded-full flex items-center justify-center text-[var(--text-primary)] hover:text-[var(--secondary)] border border-[var(--border)] hover:border-[var(--secondary)] transition-all bg-[var(--surface)] shadow-xs cursor-pointer group"
              title="Jump to 3D Kinematics Avatar"
              aria-label="3D Avatar Simulator"
            >
              <Sparkles className="w-4 h-4 text-[var(--secondary)] group-hover:rotate-45 transition-transform" />
            </button>
          )}

          {/* Social / Research Link */}
          <div className="pt-2 flex flex-col gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-5 h-5 text-[var(--text-primary)] hover:text-[var(--primary)] transition-colors flex items-center justify-center group"
              title="HASTIVO Research & Code Repository"
              aria-label="GitHub"
            >
              <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Bottom vertical indicator */}
        <div className="py-6 text-[10px] font-mono tracking-widest text-[var(--text-muted)] select-none uppercase -rotate-90 origin-center whitespace-nowrap">
          v2.4
        </div>
      </aside>
    </>
  );
};
