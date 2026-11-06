import React, { useState } from 'react';
import { useTheme, SupportedLanguage } from '../context/ThemeContext';
import { ScrollStoryElement } from '../animation/ScrollStoryElement';
import { ScrollCardReveal } from '../animation/ScrollCardReveal';

interface LanguageDetail {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  speakers: string;
  region: string;
  islDialect: string;
  sampleText: string;
  sampleGloss: string;
  scriptFamily: string;
  isRtl: boolean;
}

const LANGUAGES_DATA: LanguageDetail[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    speakers: '130+ Million in India (Official)',
    region: 'Pan-India & Global Technical Standard',
    islDialect: 'Standard Academic & Technology Lexicon',
    sampleText: 'Welcome to HASTIVO, bridging voices and signs with neural spatial AI.',
    sampleGloss: '[HASTIVO] [WELCOME] [VOICE] [SIGN] [BRIDGE] [NEURAL-AI]',
    scriptFamily: 'Latin Typography',
    isRtl: false
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    speakers: '550+ Million',
    region: 'Northern & Central India',
    islDialect: 'Northern ISL Regional Lexicon (Delhi, UP, MP)',
    sampleText: 'HASTIVO में आपका स्वागत है, भाषा के रंगों से सशक्त संवाद।',
    sampleGloss: '[HASTIVO] [MEIN] [SWAGATAM] [BHASHA] [RANG] [SAMVAD]',
    scriptFamily: 'Devanagari Script',
    isRtl: false
  },
  {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    speakers: '85+ Million',
    region: 'Tamil Nadu & Southern India',
    islDialect: 'Southern ISL Regional Lexicon (Chennai, Madurai)',
    sampleText: 'HASTIVO-விற்கு நல்வரவு, மொழி வண்ணங்களின் வழியாக துடிப்பான தொடர்புகள்.',
    sampleGloss: '[HASTIVO] [NALVARAVU] [MOZHI] [VANNANGAL] [THODARPU]',
    scriptFamily: 'Classical Dravidian Script',
    isRtl: false
  },
  {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    speakers: '95+ Million',
    region: 'Andhra Pradesh & Telangana',
    islDialect: 'Deccan Regional ISL Lexicon (Hyderabad, Vijayawada)',
    sampleText: 'HASTIVO కు స్వాగతం, భాషా రంగుల ద్వారా శక్తివంతమైన అనుసంధానం.',
    sampleGloss: '[HASTIVO] [SWAGATAM] [BHASHA] [RANGULU] [ANUSANDHANAM]',
    scriptFamily: 'Telugu Script',
    isRtl: false
  },
  {
    code: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    speakers: '50+ Million',
    region: 'Karnataka & Bengaluru Tech Corridor',
    islDialect: 'Karnataka Regional ISL Lexicon (Bengaluru, Mysuru)',
    sampleText: 'HASTIVO ಗೆ ಸುಸ್ವಾಗತ, ಭಾಷಾ ಬಣ್ಣಗಳ ಮೂಲಕ ರೋಮಾಂಚಕ ಸಂಪರ್ಕಗಳು.',
    sampleGloss: '[HASTIVO] [SUSWAGATA] [BHASHA] [BANNA] [SAMPARKA]',
    scriptFamily: 'Kannada Script',
    isRtl: false
  },
  {
    code: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    speakers: '38+ Million',
    region: 'Kerala & Coastal South',
    islDialect: 'Kerala Regional ISL Lexicon (Kochi, Thiruvananthapuram)',
    sampleText: 'HASTIVO-ലേക്ക് സ്വാഗതം, ഭാഷാ വർണ്ണങ്ങളിലൂടെ ഊർജ്ജസ്വലമായ ബന്ധങ്ങൾ.',
    sampleGloss: '[HASTIVO] [SWAGATHAM] [BHASHA] [VARNNANGAL] [BANDHANGAL]',
    scriptFamily: 'Malayalam Script',
    isRtl: false
  },
  {
    code: 'ur',
    name: 'Urdu',
    nativeName: 'اردو',
    speakers: '70+ Million',
    region: 'Pan-India & South Asia',
    islDialect: 'Urdu-Influenced ISL Finger-Spelling & Lexicon',
    sampleText: 'HASTIVO میں خوش آمدید، زبان کے رنگوں کے ذریعے متحرک روابط۔',
    sampleGloss: '[HASTIVO] [KHUSH-AMDEED] [ZUBAN] [RANG] [RAWABIT]',
    scriptFamily: 'Nastaliq / Arabic RTL Script',
    isRtl: true
  }
];

export const LanguageGridSection: React.FC = () => {
  const { language, setLanguage } = useTheme();
  const [selectedLangCode, setSelectedLangCode] = useState<SupportedLanguage>(language);

  const activeLang = LANGUAGES_DATA.find((l) => l.code === selectedLangCode) || LANGUAGES_DATA[0];

  const handleApplyGlobalLanguage = (code: SupportedLanguage) => {
    setSelectedLangCode(code);
    setLanguage(code);
  };

  return (
    <section
      id="languages"
      className="relative w-full py-24 md:py-36 border-t border-[var(--divider)] bg-[var(--background-secondary)] transition-colors"
    >
      <div className="max-w-[1720px] mx-auto px-8 md:px-14">
        {/* Section Header */}
        <div className="grid grid-cols-12 gap-6 mb-16 md:mb-24">
          <div className="col-span-12 md:col-span-1">
            <ScrollStoryElement
              as="span"
              granularity="words"
              start="top 92%"
              end="bottom 70%"
              className="font-mono text-xs uppercase tracking-widest text-[var(--accent)] font-semibold"
            >
              05 / Localization
            </ScrollStoryElement>
          </div>

          <div className="col-span-12 md:col-span-11">
            {/* Title: Character-Level Scroll-Driven Animation */}
            <ScrollStoryElement
              as="h2"
              granularity="chars"
              variant="chromatic-lift"
              start="top 88%"
              end="bottom 55%"
              stagger={0.03}
              className="font-felix text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-[var(--text-primary)] uppercase mb-6 select-none"
            >
              SEVEN LANGUAGES. ZERO BARRIERS.
            </ScrollStoryElement>

            {/* Passage-Level and Word-Level Scrubbing */}
            <ScrollStoryElement
              as="p"
              granularity="words"
              variant="progressive-clarity"
              start="top 85%"
              end="bottom 50%"
              stagger={0.03}
              className="font-exo text-lg sm:text-xl md:text-2xl leading-relaxed text-[var(--text-secondary)] max-w-4xl"
            >
              India is a linguistic continent. HASTIVO delivers native localization across seven major official languages, complete with bidirectional Right-to-Left layout for Urdu and regional dialectal mappings for Indian Sign Language (ISL).
            </ScrollStoryElement>
          </div>
        </div>

        {/* 7-Language Interactive Selector Bar with Card-Level scroll reveals */}
        <ScrollCardReveal
          start="top 90%"
          end="bottom 60%"
          stagger={0.05}
          itemSelector=".lang-pill-item"
          className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-12"
        >
          {LANGUAGES_DATA.map((lang) => {
            const isSelected = selectedLangCode === lang.code;
            const isAppActive = language === lang.code;

            return (
              <button
                key={lang.code}
                onClick={() => handleApplyGlobalLanguage(lang.code)}
                className={`lang-pill-item p-4 text-left border transition-all cursor-pointer flex flex-col justify-between h-28 relative group ${
                  isSelected
                    ? 'border-[var(--primary)] bg-[var(--surface)] shadow-md'
                    : 'border-[var(--border)] bg-[var(--surface-elevated)] hover:border-[var(--primary)]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs uppercase font-bold text-[var(--text-muted)] group-hover:text-[var(--primary)]">
                      {lang.code}
                    </span>
                    {isAppActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-ping" />
                    )}
                  </div>
                  <div className="font-felix text-lg text-[var(--text-primary)] mt-1">
                    {lang.name}
                  </div>
                </div>

                <div className="font-sans text-xs text-[var(--text-muted)] truncate">
                  {lang.nativeName}
                </div>
              </button>
            );
          })}
        </ScrollCardReveal>

        {/* Selected Language Deep-Dive Interactive Matrix Card */}
        <div className="bg-[var(--surface)] border border-[var(--border)] p-8 md:p-12 shadow-sm">
          <div className="grid grid-cols-12 gap-8 items-start">
            {/* Left Column: Script Preview & Live Translation */}
            <div className="col-span-12 lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-[var(--primary)] text-white font-mono text-xs uppercase tracking-widest font-bold">
                  {activeLang.code.toUpperCase()} • {activeLang.name}
                </span>
                <span className="font-mono text-xs text-[var(--text-muted)]">
                  {activeLang.scriptFamily} {activeLang.isRtl ? '(Right-to-Left)' : ''}
                </span>
              </div>

              {/* Sample Native Text with bidirectional support */}
              <div
                dir={activeLang.isRtl ? 'rtl' : 'ltr'}
                className="p-6 bg-[var(--surface-elevated)] border border-[var(--border-subtle)]"
              >
                <div className="text-xs font-mono text-[var(--text-muted)] mb-2 uppercase">
                  Native Script Rendering
                </div>
                <div className="text-xl sm:text-2xl md:text-3xl font-medium text-[var(--text-primary)] leading-relaxed">
                  "{activeLang.sampleText}"
                </div>
              </div>

              {/* Gloss Representation with Points-Level Tokens */}
              <div className="p-4 bg-[var(--surface-elevated)] border border-[var(--border-subtle)] font-mono text-xs">
                <span className="text-[var(--text-muted)] block mb-1 uppercase text-[10px]">
                  Synthesized Sign Gloss Tokens:
                </span>
                <div className="flex flex-wrap gap-2 text-[var(--primary)] font-bold">
                  {activeLang.sampleGloss.split(' ').map((token, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-[var(--surface)] border border-[var(--border)]"
                    >
                      {token}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Linguistic Metadata & Dialect Mapping */}
            <div className="col-span-12 lg:col-span-5 space-y-4">
              <div className="p-4 bg-[var(--surface-elevated)] border border-[var(--border-subtle)]">
                <span className="text-[var(--text-muted)] block text-[10px] font-mono uppercase">
                  Demographic Coverage
                </span>
                <span className="text-[var(--text-primary)] font-mono text-sm font-semibold">
                  {activeLang.speakers}
                </span>
                <span className="text-[var(--text-secondary)] block text-xs mt-1">
                  Primary Region: {activeLang.region}
                </span>
              </div>

              <div className="p-4 bg-[var(--surface-elevated)] border border-[var(--border-subtle)]">
                <span className="text-[var(--text-muted)] block text-[10px] font-mono uppercase">
                  ISL Regional Dialect Anchor
                </span>
                <span className="text-[var(--secondary)] font-mono text-sm font-semibold">
                  {activeLang.islDialect}
                </span>
                <p className="text-[var(--text-secondary)] text-xs mt-1">
                  Includes regional finger-spelling variants and localized colloquial sign tokens.
                </p>
              </div>

              {/* Instant Global Switch Button */}
              <div className="pt-2">
                <button
                  onClick={() => handleApplyGlobalLanguage(activeLang.code)}
                  className="w-full py-3 px-4 bg-[var(--text-primary)] text-[var(--text-inverse)] hover:bg-[var(--primary)] hover:text-white font-mono text-xs uppercase tracking-widest font-semibold transition-all cursor-pointer shadow-sm"
                >
                  Apply {activeLang.name} to Entire UI
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
