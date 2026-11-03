import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNotification } from '../../contexts/NotificationContext';
import { useAuth } from '../../contexts/AuthContext';
import { PageContainer, CardlessBadge, CardlessButton, SectionDivider } from '../../components/cardless/CardlessComponents';
import config from '../../config/env';

/**
 * Signora AI — Settings Screen (Cardless Redesign)
 * Master Specification Section 4.11:
 * - Clear open sections with whitespace & subtle dividers.
 * - 1. Language (7 languages: English, Tamil, Telugu, Kannada, Urdu RTL, Malayalam, Hindi).
 * - 2. Appearance (Light / Dark theme, 7 accent colors, immutable brand colors).
 * - 3. Accessibility (Text size, motion preferences, contrast, keyboard nav, screen reader).
 * - 4. Voice & Translation (Voice type, speed, volume, avatar playback preferences).
 * - 5. Device Permissions (Camera & Microphone).
 * - 6. Privacy & Security (Session overview, password management).
 * - 7. Support & Documentation (Privacy, Terms, Help, About, Logout).
 */
export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { currentLang, setLanguage, t, availableLanguages, isRTL } = useLanguage();
  const { notifySuccess, notifyCoralError } = useNotification();
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('language');

  // 7 Selectable Accent Colors (SRS 13.3)
  const [accentColor, setAccentColor] = useState(() => localStorage.getItem('signora_accent_color') || '#FF6F61');
  const ACCENT_COLORS = [
    { name: 'Signora Coral', hex: '#FF6F61' },
    { name: 'Sky Blue', hex: '#6FA3EF' },
    { name: 'Amber Glow', hex: '#FFC107' },
    { name: 'Emerald', hex: '#10B981' },
    { name: 'Violet', hex: '#8B5CF6' },
    { name: 'Rose', hex: '#F43F5E' },
    { name: 'Cyan', hex: '#06B6D4' },
  ];

  // Voice Settings
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [speechRate, setSpeechRate] = useState(1.0);
  const [speechVolume, setSpeechVolume] = useState(1.0);

  // Accessibility Settings
  const [fontSizeRatio, setFontSizeRatio] = useState(100);
  const [highContrast, setHighContrast] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  // Avatar Settings
  const [avatarSpeed, setAvatarSpeed] = useState(1.0);
  const [targetSignLanguage, setTargetSignLanguage] = useState('ISL');

  // Device Permissions
  const [cameraPermission, setCameraPermission] = useState('prompt');
  const [micPermission, setMicPermission] = useState('prompt');

  useEffect(() => {
    if ('speechSynthesis' in window) {
      const updateVoices = () => {
        const vList = window.speechSynthesis.getVoices();
        setVoices(vList);
        if (vList.length > 0 && !selectedVoice) {
          setSelectedVoice(vList[0].name);
        }
      };
      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }

    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'camera' }).then((p) => setCameraPermission(p.state)).catch(() => {});
      navigator.permissions.query({ name: 'microphone' }).then((p) => setMicPermission(p.state)).catch(() => {});
    }
  }, [selectedVoice]);

  const handleAccentChange = (hex) => {
    setAccentColor(hex);
    localStorage.setItem('signora_accent_color', hex);
    document.documentElement.style.setProperty('--color-coral', hex);
    notifySuccess('Accent Color Applied', `Theme accent set to ${hex}`);
  };

  const handleTestVoice = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance('Welcome to Signora AI. Voice output is functioning smoothly.');
      utterance.rate = speechRate;
      utterance.volume = speechVolume;
      if (selectedVoice) {
        const found = voices.find((v) => v.name === selectedVoice);
        if (found) utterance.voice = found;
      }
      window.speechSynthesis.speak(utterance);
      notifySuccess('Playing Voice Test', 'Voice sample audio playback active.');
    } else {
      notifyCoralError('Speech Error', 'Speech synthesis is not supported on this browser.');
    }
  };

  const TABS = [
    { id: 'language', label: 'Language', icon: '🌐' },
    { id: 'appearance', label: 'Appearance', icon: '🎨' },
    { id: 'accessibility', label: 'Accessibility', icon: '♿' },
    { id: 'voice', label: 'Voice & Speech', icon: '🔊' },
    { id: 'translation', label: 'Translation & Avatar', icon: '🤖' },
    { id: 'devices', label: 'Permissions', icon: '📹' },
    { id: 'privacy', label: 'Security & Account', icon: '🛡️' },
    { id: 'support', label: 'Support & Legal', icon: 'ℹ️' },
  ];

  return (
    <div className="page-wrapper" dir={isRTL ? 'rtl' : 'ltr'}>
      <PageContainer maxWidth="1160px">
        {/* Workspace Title & Metadata */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
          <div>
            <div className="cardless-kicker">Preferences & Configuration</div>
            <h1 className="cardless-title" style={{ margin: 0 }}>
              {t('settings') || 'Settings & Preferences'}
            </h1>
            <p className="cardless-subtitle" style={{ marginTop: '8px' }}>
              Configure interface languages, appearance themes, accessibility controls, voice engines, and security.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CardlessBadge color="coral">{theme.toUpperCase()} THEME</CardlessBadge>
            <CardlessBadge color="blue">{currentLang.toUpperCase()}</CardlessBadge>
          </div>
        </div>

        {/* ── Flat Underline Tab Navigation (Editorial / Swiss Grid) ── */}
        <div
          role="tablist"
          style={{
            display: 'flex',
            overflowX: 'auto',
            borderBottom: '1px solid var(--border)',
            marginBottom: '32px',
          }}
        >
          {TABS.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={active}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '10px 16px',
                  borderBottom: active ? '2px solid var(--color-coral)' : '2px solid transparent',
                  color: active ? 'var(--color-coral)' : 'var(--text-secondary)',
                  fontFamily: 'var(--font-mono, JetBrains Mono, monospace)',
                  fontSize: '0.78rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ══════════════════════════════════════════════════════════════
            1. LANGUAGE SECTION (7 Supported Languages)
            ══════════════════════════════════════════════════════════════ */}
        {activeTab === 'language' && (
          <section style={{ animation: 'fadeIn 0.2s ease-out' }}>
            <div style={{ marginBottom: '24px' }}>
              <h2 className="cardless-section-title">Interface Language (7 Supported Languages)</h2>
              <p style={{ fontSize: '0.90rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                Select your preferred interface language. Urdu activates automatic Right-to-Left (RTL) reading order.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              {availableLanguages.map((lang) => {
                const isSelected = currentLang === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      setLanguage(lang.code);
                      notifySuccess('Language Updated', `Active language set to ${lang.name}`);
                    }}
                    style={{
                      padding: '18px 20px',
                      borderRadius: '4px',
                      background: isSelected ? 'rgba(111, 163, 239, 0.12)' : 'var(--surface-elevated, var(--bg-secondary))',
                      border: `1px solid ${isSelected ? 'var(--color-blue)' : 'var(--border-subtle, var(--border))'}`,
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      transition: 'all 0.18s ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {lang.nativeName}
                      </span>
                      {isSelected && (
                        <span style={{ color: 'var(--color-blue)', fontSize: '0.80rem', fontWeight: 800 }}>
                          ✓ Active
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      {lang.name} {lang.dir === 'rtl' ? '(RTL Layout)' : '(LTR)'}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════════════════════════
            2. APPEARANCE SECTION (Light / Dark Theme & 7 Accent Colors)
            ══════════════════════════════════════════════════════════════ */}
        {activeTab === 'appearance' && (
          <section style={{ animation: 'fadeIn 0.2s ease-out' }}>
            <div style={{ marginBottom: '24px' }}>
              <h2 className="cardless-section-title">Theme & Color Palette</h2>
              <p style={{ fontSize: '0.90rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                Toggle between light and dark themes. The 5 original brand colors remain immutable throughout.
              </p>
            </div>

            {/* Theme Mode Selector */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '36px' }}>
              <button
                type="button"
                onClick={() => { if (theme !== 'light') toggleTheme(); }}
                style={{
                  flex: '1',
                  minWidth: '200px',
                  padding: '20px',
                  borderRadius: 'var(--radius-control)',
                  background: theme === 'light' ? 'rgba(111, 163, 239, 0.12)' : 'var(--surface-elevated, var(--bg-secondary))',
                  border: `1.5px solid ${theme === 'light' ? 'var(--color-blue)' : 'var(--border)'}`,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{ fontSize: '1.4rem', marginBottom: '8px' }}>☀️</div>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
                  Light Theme
                </div>
                <span style={{ fontSize: '0.80rem', color: 'var(--text-secondary)' }}>
                  Clean, open contrast with #FFFFFF canvas
                </span>
              </button>

              <button
                type="button"
                onClick={() => { if (theme !== 'dark') toggleTheme(); }}
                style={{
                  flex: '1',
                  minWidth: '200px',
                  padding: '20px',
                  borderRadius: 'var(--radius-control)',
                  background: theme === 'dark' ? 'rgba(111, 163, 239, 0.12)' : 'var(--surface-elevated, var(--bg-secondary))',
                  border: `1.5px solid ${theme === 'dark' ? 'var(--color-blue)' : 'var(--border)'}`,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{ fontSize: '1.4rem', marginBottom: '8px' }}>🌙</div>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
                  Dark Theme (Cinematic)
                </div>
                <span style={{ fontSize: '0.80rem', color: 'var(--text-secondary)' }}>
                  Deep #17191E backdrop with vivid glow accents
                </span>
              </button>
            </div>

            <SectionDivider label="Brand Accents" kicker="7 Defined Colors" />

            {/* 7 Selectable Accent Colors */}
            <div style={{ marginTop: '24px' }}>
              <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>
                Selectable Dynamic Accent Color:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
                {ACCENT_COLORS.map((col) => {
                  const isSelected = accentColor.toLowerCase() === col.hex.toLowerCase();
                  return (
                    <button
                      key={col.hex}
                      type="button"
                      onClick={() => handleAccentChange(col.hex)}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 'var(--radius-control)',
                        background: isSelected ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                        border: `1.5px solid ${isSelected ? col.hex : 'var(--border)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        cursor: 'pointer',
                      }}
                    >
                      <span
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          background: col.hex,
                          boxShadow: `0 0 8px ${col.hex}`,
                        }}
                      />
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {col.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════════════════════════
            3. ACCESSIBILITY SECTION
            ══════════════════════════════════════════════════════════════ */}
        {activeTab === 'accessibility' && (
          <section style={{ animation: 'fadeIn 0.2s ease-out' }}>
            <div style={{ marginBottom: '24px' }}>
              <h2 className="cardless-section-title">Accessibility & Inclusion Controls</h2>
              <p style={{ fontSize: '0.90rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                Adjust motion, contrast, typography scaling, and screen-reader optimizations.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Text Scaling Slider */}
              <div style={{ paddingBottom: '20px', borderBottom: '1px solid var(--border-subtle, var(--border))' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label style={{ fontSize: '0.90rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Text Font Scale: {fontSizeRatio}%
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setFontSizeRatio(100);
                      document.documentElement.style.fontSize = '16px';
                    }}
                    style={{ background: 'transparent', border: 'none', color: 'var(--color-blue)', fontSize: '0.80rem', cursor: 'pointer' }}
                  >
                    Reset Default (100%)
                  </button>
                </div>
                <input
                  type="range"
                  min="90"
                  max="130"
                  step="5"
                  value={fontSizeRatio}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    setFontSizeRatio(val);
                    document.documentElement.style.fontSize = `${16 * (val / 100)}px`;
                  }}
                  style={{ width: '100%', accentColor: 'var(--color-coral)' }}
                />
              </div>

              {/* Reduced Motion Toggle */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '20px', borderBottom: '1px solid var(--border-subtle, var(--border))' }}>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.92rem' }}>
                    Reduce Motion & Parallax
                  </div>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    Minimizes 3D scene rotations and particle animations for vestibular comfort
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={reduceMotion}
                  onChange={(e) => setReduceMotion(e.target.checked)}
                  style={{ width: '20px', height: '20px', accentColor: 'var(--color-coral)' }}
                />
              </div>

              {/* High Contrast Toggle */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '20px', borderBottom: '1px solid var(--border-subtle, var(--border))' }}>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.92rem' }}>
                    High-Contrast Border Dividers
                  </div>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    Amplifies boundary definitions for low-vision readability
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={highContrast}
                  onChange={(e) => {
                    setHighContrast(e.target.checked);
                    document.documentElement.style.setProperty('--border-subtle', e.target.checked ? 'var(--text-primary)' : '');
                  }}
                  style={{ width: '20px', height: '20px', accentColor: 'var(--color-blue)' }}
                />
              </div>
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════════════════════════
            4. VOICE & TRANSLATION SECTION
            ══════════════════════════════════════════════════════════════ */}
        {activeTab === 'voice' && (
          <section style={{ animation: 'fadeIn 0.2s ease-out' }}>
            <div style={{ marginBottom: '24px' }}>
              <h2 className="cardless-section-title">Voice Output & Speech Synthesis</h2>
              <p style={{ fontSize: '0.90rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                Tune speech rate, volume, and voice profile for Sign-to-Text spoken audio playback.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '28px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '8px' }}>
                  Speech Voice Model
                </label>
                <select
                  value={selectedVoice}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-control)',
                    background: 'var(--surface-elevated, var(--bg-secondary))',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                    fontSize: '0.90rem',
                  }}
                >
                  {voices.map((v) => (
                    <option key={v.name} value={v.name}>
                      {v.name} ({v.lang})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '8px' }}>
                  Speech Speed Rate: {speechRate}x
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="1.75"
                  step="0.25"
                  value={speechRate}
                  onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--color-coral)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '8px' }}>
                  Speech Output Volume: {Math.round(speechVolume * 100)}%
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={speechVolume}
                  onChange={(e) => setSpeechVolume(parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--color-blue)' }}
                />
              </div>
            </div>

            <CardlessButton variant="secondary" size="md" onClick={handleTestVoice}>
              🔊 Test Speech Sample Audio
            </CardlessButton>
          </section>
        )}

        {/* ══════════════════════════════════════════════════════════════
            5. TRANSLATION & AVATAR SETTINGS
            ══════════════════════════════════════════════════════════════ */}
        {activeTab === 'translation' && (
          <section style={{ animation: 'fadeIn 0.2s ease-out' }}>
            <div style={{ marginBottom: '24px' }}>
              <h2 className="cardless-section-title">Translation & Avatar Preferences</h2>
              <p style={{ fontSize: '0.90rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                Control 3D avatar gesture speeds and sign language grammar models.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '8px' }}>
                  Default Sign Language System
                </label>
                <select
                  value={targetSignLanguage}
                  onChange={(e) => setTargetSignLanguage(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-control)',
                    background: 'var(--surface-elevated, var(--bg-secondary))',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                    fontSize: '0.90rem',
                  }}
                >
                  <option value="ISL">Indian Sign Language (ISL - Standard)</option>
                  <option value="ASL">American Sign Language (ASL - Secondary)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '8px' }}>
                  3D Avatar Default Gesture Speed: {avatarSpeed}x
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.25"
                  value={avatarSpeed}
                  onChange={(e) => setAvatarSpeed(parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--color-blue)' }}
                />
              </div>
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════════════════════════
            6. DEVICE PERMISSIONS
            ══════════════════════════════════════════════════════════════ */}
        {activeTab === 'devices' && (
          <section style={{ animation: 'fadeIn 0.2s ease-out' }}>
            <div style={{ marginBottom: '24px' }}>
              <h2 className="cardless-section-title">Camera & Microphone Device Permissions</h2>
              <p style={{ fontSize: '0.90rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                Review active hardware permissions for real-time vision tracking and voice input.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid var(--border-subtle, var(--border))' }}>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                    Camera Access (Sign Recognition)
                  </div>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    Status: <strong>{cameraPermission.toUpperCase()}</strong>
                  </span>
                </div>
                <Link to="/camera-permission" className="btn btn-ghost btn-sm">
                  Test Camera &rarr;
                </Link>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid var(--border-subtle, var(--border))' }}>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                    Microphone Access (Voice Dictation)
                  </div>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    Status: <strong>{micPermission.toUpperCase()}</strong>
                  </span>
                </div>
                <Link to="/microphone-permission" className="btn btn-ghost btn-sm">
                  Test Microphone &rarr;
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════════════════════════
            7. SECURITY & ACCOUNT
            ══════════════════════════════════════════════════════════════ */}
        {activeTab === 'privacy' && (
          <section style={{ animation: 'fadeIn 0.2s ease-out' }}>
            <div style={{ marginBottom: '24px' }}>
              <h2 className="cardless-section-title">Security & Account Privacy</h2>
              <p style={{ fontSize: '0.90rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                Manage authentication credentials and active browser sessions.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ paddingBottom: '16px', borderBottom: '1px solid var(--border-subtle, var(--border))' }}>
                <span style={{ fontSize: '0.80rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Authenticated Account
                </span>
                <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>
                  {user?.email || 'Citizen User'}
                </strong>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid var(--border-subtle, var(--border))' }}>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.92rem' }}>
                    Password Management
                  </div>
                  <span style={{ fontSize: '0.80rem', color: 'var(--text-secondary)' }}>
                    Update your account password or trigger security reset instructions
                  </span>
                </div>
                <Link to="/forgot-password" className="btn btn-ghost btn-sm">
                  Change Password &rarr;
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════════════════════════
            8. SUPPORT & LEGAL
            ══════════════════════════════════════════════════════════════ */}
        {activeTab === 'support' && (
          <section style={{ animation: 'fadeIn 0.2s ease-out' }}>
            <div style={{ marginBottom: '24px' }}>
              <h2 className="cardless-section-title">Support, Legal & System Links</h2>
              <p style={{ fontSize: '0.90rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                Access platform documentation, legal governance terms, and session management.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
              <Link to="/privacy" style={{ padding: '16px 0', borderBottom: '1px solid var(--border)', textDecoration: 'none', color: 'inherit' }}>
                <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>Privacy Policy &rarr;</strong>
                <span style={{ fontSize: '0.80rem', color: 'var(--text-secondary)' }}>Review zero-cloud data policies</span>
              </Link>

              <Link to="/terms" style={{ padding: '16px 0', borderBottom: '1px solid var(--border)', textDecoration: 'none', color: 'inherit' }}>
                <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>Terms & Conditions &rarr;</strong>
                <span style={{ fontSize: '0.80rem', color: 'var(--text-secondary)' }}>Acceptable platform use standards</span>
              </Link>

              <Link to="/help" style={{ padding: '16px 0', borderBottom: '1px solid var(--border)', textDecoration: 'none', color: 'inherit' }}>
                <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>Help & Accessibility &rarr;</strong>
                <span style={{ fontSize: '0.80rem', color: 'var(--text-secondary)' }}>Navigation guides & FAQs</span>
              </Link>

              <Link to="/about" style={{ padding: '16px 0', borderBottom: '1px solid var(--border)', textDecoration: 'none', color: 'inherit' }}>
                <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>About Signora &rarr;</strong>
                <span style={{ fontSize: '0.80rem', color: 'var(--text-secondary)' }}>Architecture & Mission info</span>
              </Link>
            </div>

            <div style={{ padding: '14px 0', borderTop: '1px solid var(--border-subtle, var(--border))', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              <span>Connected Backend API Gateway: </span>
              <code style={{ color: 'var(--color-blue)', fontFamily: 'monospace' }}>{config.apiBaseUrl}</code>
            </div>

            <div style={{ paddingTop: '20px', borderTop: '1px solid var(--border-subtle, var(--border))' }}>
              <CardlessButton
                variant="danger"
                size="md"
                onClick={async () => {
                  if (logout) await logout();
                  navigate('/signin');
                }}
              >
                Log Out of Active Session
              </CardlessButton>
            </div>
          </section>
        )}
      </PageContainer>
    </div>
  );
}
