import React, { useState } from 'react';
import { useTheme, SupportedLanguage, LANGUAGE_METADATA } from '../context/ThemeContext';
import { Languages, Sun, Moon, Sparkles, ChevronDown, Check, HandMetal } from 'lucide-react';

export const FrostedLanguageCornerToggle: React.FC = () => {
  const {
    theme,
    toggleTheme,
    terminologyMode,
    toggleTerminologyMode,
    language,
    setLanguage
  } = useTheme();

  const [isOpenLangDropdown, setIsOpenLangDropdown] = useState(false);

  const isDark = theme === 'dark';
  const isGloss = terminologyMode === 'sign-gloss';

  return (
    <aside
      aria-label="Language and Terminology Controls"
      className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 flex items-center gap-2 select-none"
    >
      {/* Discreet Frosted Glass Capsule Bar */}
      <div className="flex items-center gap-1.5 p-1 sm:p-1.5 rounded-full backdrop-blur-2xl bg-white/80 dark:bg-[#10131B]/80 border border-black/15 dark:border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.15)] dark:shadow-[0_15px_35px_rgba(0,0,0,0.6)] text-slate-900 dark:text-white transition-all">
        {/* Terminology Toggle Button: English vs Sign Gloss */}
        <button
          onClick={toggleTerminologyMode}
          title={isGloss ? "Current: Sign Language Gloss terminology. Click for Standard English" : "Current: Standard English. Click for Sign Language Gloss terminology"}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 cursor-pointer ${
            isGloss
              ? 'bg-[#FFC107]/25 text-[#B27D00] dark:text-[#FFD54F] border border-[#FFC107]/60 shadow-[0_0_12px_rgba(255,193,7,0.3)]'
              : 'bg-black/5 dark:bg-white/10 text-slate-800 dark:text-slate-200 hover:bg-black/10 dark:hover:bg-white/15 border border-transparent'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 shrink-0 text-[#FFC107]" />
          <span className="hidden sm:inline font-mono text-[11px] uppercase tracking-wider">Mode:</span>
          <span className="font-semibold text-xs">
            {isGloss ? 'Sign Gloss' : 'English'}
          </span>
          <span className="text-[9px] px-1 py-0.2 rounded bg-black/10 dark:bg-white/15 font-mono">
            {isGloss ? 'SOV' : 'SVO'}
          </span>
        </button>

        {/* Separator */}
        <div className="w-[1px] h-4 bg-black/10 dark:bg-white/15" />

        {/* Spoken Dialect Selector Trigger */}
        <div className="relative">
          <button
            onClick={() => setIsOpenLangDropdown(prev => !prev)}
            title="Switch spoken language dialect"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/10 transition-all cursor-pointer text-slate-800 dark:text-slate-200"
          >
            <Languages className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
            <span className="font-mono text-xs uppercase">{language}</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${isOpenLangDropdown ? 'rotate-180' : ''}`} />
          </button>

          {/* Frosted Dropdown Menu */}
          {isOpenLangDropdown && (
            <div
              className="absolute right-0 mt-2 w-44 rounded-2xl p-1.5 backdrop-blur-3xl bg-white/95 dark:bg-[#121622]/95 border border-black/15 dark:border-white/20 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150"
              onClick={() => setIsOpenLangDropdown(false)}
            >
              <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-black/10 dark:border-white/10 mb-1">
                Regional Dialect
              </div>
              {(Object.keys(LANGUAGE_METADATA) as SupportedLanguage[]).map(langKey => {
                const meta = LANGUAGE_METADATA[langKey];
                const active = language === langKey;
                return (
                  <button
                    key={langKey}
                    onClick={() => {
                      setLanguage(langKey);
                      setIsOpenLangDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                      active
                        ? 'bg-amber-500/15 text-amber-900 dark:text-amber-300 font-semibold'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-black/5 dark:hover:bg-white/10'
                    }`}
                  >
                    <span>{meta.label}</span>
                    <span className="font-mono text-[11px] text-slate-400">{meta.nativeName}</span>
                    {active && <Check className="w-3 h-3 text-[#FFC107] ml-1" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Separator */}
        <div className="w-[1px] h-4 bg-black/10 dark:bg-white/15" />

        {/* Theme Toggle Button (Sun / Moon) */}
        <button
          onClick={toggleTheme}
          title={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
          className="w-7 h-7 rounded-full flex items-center justify-center text-slate-700 dark:text-amber-300 hover:bg-black/5 dark:hover:bg-white/10 transition-all cursor-pointer"
        >
          {isDark ? <Sun className="w-3.5 h-3.5 text-[#FFC107]" /> : <Moon className="w-3.5 h-3.5 text-slate-800" />}
        </button>
      </div>
    </aside>
  );
};
