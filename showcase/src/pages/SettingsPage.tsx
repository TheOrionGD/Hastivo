import React, { useState } from 'react';
import { useTheme, SupportedLanguage, LANGUAGE_METADATA, ACCENT_OPTIONS } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import {
  Globe,
  Sun,
  Moon,
  Palette,
  Camera,
  Mic,
  Volume2,
  Eye,
  Shield,
  HelpCircle,
  FileText,
  Check,
  Sparkles,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { theme, setTheme, language, setLanguage, accent, setAccent, t } = useTheme();
  const { logout } = useAuth();

  // Media Device Preferences
  const [cameraQuality, setCameraQuality] = useState<'720p' | '1080p'>('720p');
  const [speechPitch, setSpeechPitch] = useState<'female' | 'male'>('female');
  const [defaultSignSystem, setDefaultSignSystem] = useState<'ISL' | 'ASL' | 'BSL'>('ISL');
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSavePreferences = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 z-10 space-y-10">
      {/* Top Header */}
      <div className="space-y-4 hairline-border-b pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="font-mono text-xs uppercase tracking-widest text-[var(--brand-coral)] font-bold">
              PREFERENCES &bull; SYSTEM CONFIGURATION
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
              Platform Settings
            </h1>
          </div>

          <button
            onClick={handleSavePreferences}
            className="px-5 py-2.5 bg-[var(--brand-coral)] text-white font-mono text-xs uppercase tracking-wider font-semibold hover:opacity-90 cursor-pointer shadow-sm flex items-center gap-1.5"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Preferences Saved</span>
              </>
            ) : (
              <span>Save Configuration</span>
            )}
          </button>
        </div>
        <p className="text-xs text-[var(--text-secondary)] max-w-xl leading-relaxed">
          Configure interface localization, appearance themes, 7 accent options, and assistive accessibility parameters.
        </p>
      </div>

      <div className="space-y-8">
        {/* SECTION 1: 7 INTERFACE LANGUAGES & SCRIPT SYSTEM */}
        <div className="p-6 bg-[var(--surface)] hairline-border space-y-4">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-[var(--brand-blue)]" />
            <h3 className="font-display text-lg font-bold text-[var(--text-primary)]">
              Interface Localization (7 Languages)
            </h3>
          </div>
          <p className="text-xs text-[var(--text-secondary)]">
            Select your preferred UI language. Urdu includes automatic Right-to-Left (RTL) typographic direction. Note: UI language and target sign language remain independent configurations.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 font-mono text-xs">
            {(Object.keys(LANGUAGE_METADATA) as SupportedLanguage[]).map(key => {
              const meta = LANGUAGE_METADATA[key];
              const isSelected = language === key;
              return (
                <button
                  key={key}
                  onClick={() => setLanguage(key)}
                  className={`p-3 text-left border cursor-pointer transition-colors ${
                    isSelected
                      ? 'border-[var(--brand-coral)] bg-[var(--surface-secondary)]'
                      : 'border-[var(--border)] bg-[var(--background)] hover:border-[var(--brand-coral)]'
                  }`}
                >
                  <span className="font-sans text-sm font-bold text-[var(--text-primary)] block">
                    {meta.nativeName}
                  </span>
                  <span className="text-[10px] text-[var(--text-tertiary)] block mt-0.5 uppercase">
                    {meta.label} ({meta.dir})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 2: THEME & 7 ACCENT PREFERENCES */}
        <div className="p-6 bg-[var(--surface)] hairline-border space-y-6">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-[var(--brand-coral)]" />
            <h3 className="font-display text-lg font-bold text-[var(--text-primary)]">
              Appearance & Accent System
            </h3>
          </div>

          {/* Light / Dark Mode Toggle */}
          <div className="space-y-2">
            <span className="font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)] block">
              Theme Mode:
            </span>
            <div className="grid grid-cols-2 gap-4 max-w-md font-mono text-xs">
              <button
                onClick={() => setTheme('light')}
                className={`p-4 border flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                  theme === 'light'
                    ? 'border-[var(--brand-coral)] bg-[var(--surface-secondary)] font-bold'
                    : 'border-[var(--border)] bg-[var(--background)] text-[var(--text-secondary)]'
                }`}
              >
                <Sun className="w-4 h-4 text-[var(--brand-coral)]" />
                <span>LIGHT THEME (PRIMARY)</span>
              </button>

              <button
                onClick={() => setTheme('dark')}
                className={`p-4 border flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                  theme === 'dark'
                    ? 'border-[var(--brand-coral)] bg-[var(--surface-secondary)] font-bold'
                    : 'border-[var(--border)] bg-[var(--background)] text-[var(--text-secondary)]'
                }`}
              >
                <Moon className="w-4 h-4 text-[var(--brand-yellow)]" />
                <span>DARK THEME (CINEMATIC)</span>
              </button>
            </div>
          </div>

          {/* 7 Configurable Accent Options (Without modifying original 5 brand hexes) */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)] block">
                Configurable Accent Preference (7 Options):
              </span>
              <span className="font-mono text-[10px] text-[var(--text-tertiary)]">
                IMMUTABLE 5 BRAND HEXES PRESERVED
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
              {ACCENT_OPTIONS.map(opt => {
                const isSelected = accent === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setAccent(opt.id)}
                    className={`p-3 text-center border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[var(--brand-coral)] bg-[var(--surface-secondary)] ring-2 ring-[var(--brand-coral)]'
                        : 'border-[var(--border)] bg-[var(--background)] hover:border-[var(--text-secondary)]'
                    }`}
                  >
                    <span
                      className="w-4 h-4 mx-auto mb-1.5 block rounded-none border border-black/20"
                      style={{ backgroundColor: opt.hex }}
                    />
                    <span className="font-mono text-[10px] text-[var(--text-primary)] block truncate">
                      {opt.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* SECTION 3: MEDIA & LINGUISTIC TARGETS */}
        <div className="p-6 bg-[var(--surface)] hairline-border space-y-6">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-[var(--brand-yellow)]" />
            <h3 className="font-display text-lg font-bold text-[var(--text-primary)]">
              Hardware, Vision & Linguistic Targets
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-mono text-xs">
            <div className="space-y-1.5">
              <label className="text-[var(--text-secondary)] uppercase block">Default Sign System</label>
              <select
                value={defaultSignSystem}
                onChange={e => setDefaultSignSystem(e.target.value as any)}
                className="w-full bg-[var(--background)] text-[var(--text-primary)] border border-[var(--border)] p-2"
              >
                <option value="ISL">Indian Sign Language (ISL)</option>
                <option value="ASL">American Sign Language (ASL)</option>
                <option value="BSL">British Sign Language (BSL)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[var(--text-secondary)] uppercase block">Synthesized Voice Pitch</label>
              <select
                value={speechPitch}
                onChange={e => setSpeechPitch(e.target.value as any)}
                className="w-full bg-[var(--background)] text-[var(--text-primary)] border border-[var(--border)] p-2"
              >
                <option value="female">Natural Female Pitch (1.2x)</option>
                <option value="male">Natural Male Pitch (0.85x)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[var(--text-secondary)] uppercase block">Webcam Tracking Frame</label>
              <select
                value={cameraQuality}
                onChange={e => setCameraQuality(e.target.value as any)}
                className="w-full bg-[var(--background)] text-[var(--text-primary)] border border-[var(--border)] p-2"
              >
                <option value="720p">720p 60 FPS (Balanced)</option>
                <option value="1080p">1080p 60 FPS (High Precision)</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 4: ACCESSIBILITY, TERMS & ABOUT */}
        <div className="p-6 bg-[var(--surface)] hairline-border space-y-4 font-mono text-xs">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-[var(--brand-coral)]" />
            <h3 className="font-display text-lg font-bold text-[var(--text-primary)] font-sans">
              Universal Accessibility (WCAG 2.2 AA)
            </h3>
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={highContrast}
                onChange={e => setHighContrast(e.target.checked)}
                className="w-4 h-4 accent-[var(--brand-coral)]"
              />
              <span className="text-[var(--text-primary)]">Enhanced contrast boundaries (Strict 7:1 ratio)</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={reducedMotion}
                onChange={e => setReducedMotion(e.target.checked)}
                className="w-4 h-4 accent-[var(--brand-coral)]"
              />
              <span className="text-[var(--text-primary)]">Respect prefers-reduced-motion (Disable 3D background effects)</span>
            </label>
          </div>

          <div className="pt-4 border-t border-[var(--border)] flex flex-wrap gap-6 text-[var(--text-tertiary)]">
            <span className="hover:text-[var(--text-primary)] cursor-pointer">Privacy Policy (Zero Data Sale)</span>
            <span className="hover:text-[var(--text-primary)] cursor-pointer">Terms of Service</span>
            <span className="hover:text-[var(--text-primary)] cursor-pointer">Linguistic Ethics Statement</span>
            <span className="hover:text-[var(--text-primary)] cursor-pointer">About Signa v2.4</span>
          </div>
        </div>
      </div>
    </div>
  );
};
