import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme, SupportedLanguage, LANGUAGE_METADATA } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Sun, Moon, Globe, User, ShieldAlert, Menu, X, ArrowUpRight } from 'lucide-react';

export const Navigation: React.FC = () => {
  const { theme, toggleTheme, language, setLanguage, t } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', label: t('navHome') },
    { to: '/text-to-sign', label: t('navTextToSign') },
    { to: '/sign-to-text', label: t('navSignToText') },
    { to: '/conversation', label: t('navConversation') },
    { to: '/dashboard', label: t('navDashboard') },
    { to: '/history', label: t('navHistory') },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[var(--background)]/90 backdrop-blur-md hairline-border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Mark */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="w-3.5 h-3.5 bg-[var(--brand-coral)] inline-block transition-transform duration-300 group-hover:scale-110" />
              <span className="font-display text-xl font-bold tracking-tight text-[var(--text-primary)]">
                SIGNA
              </span>
              <span className="hidden sm:inline-block font-mono text-[10px] tracking-widest text-[var(--text-tertiary)] border-l border-[var(--border)] pl-2 uppercase">
                AI / ISL / ASL
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1" aria-label="Main Navigation">
              {navLinks.map(link => {
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`px-3 py-1.5 text-xs font-mono tracking-wider uppercase transition-colors duration-150 ${
                      isActive
                        ? 'text-[var(--brand-coral)] font-semibold border-b-2 border-[var(--brand-coral)]'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Action Tools */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Moderation Link for Admins */}
            {user?.role === 'admin' && (
              <Link
                to="/admin/moderation"
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono text-[var(--brand-yellow)] border border-[var(--border)] hover:border-[var(--brand-yellow)]"
                title="Moderation Console"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>MOD</span>
              </Link>
            )}

            {/* 7 Languages Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border)] cursor-pointer"
                title="Switch Interface Language"
              >
                <Globe className="w-3.5 h-3.5 text-[var(--brand-blue)]" />
                <span>{LANGUAGE_METADATA[language].nativeName}</span>
              </button>

              {langMenuOpen && (
                <div
                  className="absolute right-0 mt-1 w-44 bg-[var(--surface)] border border-[var(--border)] py-1 shadow-lg z-50 text-xs"
                  onMouseLeave={() => setLangMenuOpen(false)}
                >
                  {(Object.keys(LANGUAGE_METADATA) as SupportedLanguage[]).map(key => (
                    <button
                      key={key}
                      onClick={() => {
                        setLanguage(key);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 flex items-center justify-between cursor-pointer hover:bg-[var(--surface-secondary)] ${
                        language === key ? 'text-[var(--brand-coral)] font-bold' : 'text-[var(--text-primary)]'
                      }`}
                    >
                      <span>{LANGUAGE_METADATA[key].nativeName}</span>
                      <span className="font-mono text-[10px] text-[var(--text-tertiary)] uppercase">{key}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Switcher Toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border)] cursor-pointer"
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Theme`}
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5 text-[var(--brand-yellow)]" />}
            </button>

            {/* Auth / Profile Link */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/profile"
                  className="flex items-center gap-1.5 px-3 py-1 text-xs font-mono text-[var(--text-primary)] border border-[var(--border)] hover:border-[var(--brand-coral)]"
                >
                  <User className="w-3.5 h-3.5 text-[var(--brand-coral)]" />
                  <span className="truncate max-w-[100px]">{user?.username}</span>
                </Link>
                <button
                  onClick={logout}
                  className="text-xs font-mono text-[var(--text-tertiary)] hover:text-[var(--brand-coral)] cursor-pointer px-1"
                  title="Sign Out"
                >
                  [OUT]
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1 text-xs font-mono uppercase tracking-wider text-[var(--text-primary)] hover:text-[var(--brand-coral)] border border-[var(--border)] hover:border-[var(--brand-coral)]"
                >
                  {t('signIn')}
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1 text-xs font-mono uppercase tracking-wider text-white bg-[var(--brand-coral)] hover:opacity-90 flex items-center gap-1"
                >
                  <span>{t('register')}</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-1.5 text-[var(--text-secondary)] border border-[var(--border)]"
            >
              {theme === 'light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-[var(--text-primary)] border border-[var(--border)]"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[var(--background)] hairline-border-b px-4 py-4 space-y-3">
          <div className="flex flex-col space-y-2">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-1 text-sm font-mono uppercase ${
                  location.pathname === link.to
                    ? 'text-[var(--brand-coral)] font-bold'
                    : 'text-[var(--text-secondary)]'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/settings"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-sm font-mono uppercase text-[var(--text-secondary)]"
            >
              {t('navSettings')}
            </Link>
          </div>

          <div className="pt-3 hairline-border-t flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[var(--text-tertiary)]">LANG:</span>
              <select
                value={language}
                onChange={e => setLanguage(e.target.value as SupportedLanguage)}
                className="text-xs bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] px-2 py-1 font-mono"
              >
                {(Object.keys(LANGUAGE_METADATA) as SupportedLanguage[]).map(k => (
                  <option key={k} value={k}>
                    {LANGUAGE_METADATA[k].nativeName}
                  </option>
                ))}
              </select>
            </div>

            {isAuthenticated ? (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="text-xs font-mono text-[var(--brand-coral)]"
              >
                SIGN OUT
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-mono uppercase text-[var(--brand-coral)]"
              >
                SIGN IN
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
