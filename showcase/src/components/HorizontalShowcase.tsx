import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import {
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Volume2,
  Sparkles,
  Activity,
  Flame,
  Radio,
  Sliders,
  Check
} from 'lucide-react';

export interface JourneyStepData {
  step: number;
  num: string;
  splitLeft: string;
  splitRight: string;
  ticker: string;
  navLabel: string;
  title: string;
  subtitle: string;
  description: string;
  statBadge: string;
  ctaText: string;
}

interface HandJoint {
  id: number;
  name: string;
  x: string;
  y: string;
  coords: string;
  angle: string;
}

interface HorizontalShowcaseProps {
  steps: JourneyStepData[];
  handJoints: HandJoint[];
  selectedJointIndex: number;
  setSelectedJointIndex: (id: number) => void;
  isSpeaking: boolean;
  speechPitch: number;
  setSpeechPitch: (pitch: number) => void;
  speechRate: number;
  setSpeechRate: (rate: number) => void;
  handleTestSpeech: (text: string) => void;
}

interface ParallaxCardProps {
  stepData: JourneyStepData;
  index: number;
  total: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
  isDark: boolean;
  handJoints: HandJoint[];
  selectedJointIndex: number;
  setSelectedJointIndex: (id: number) => void;
  isSpeaking: boolean;
  speechPitch: number;
  setSpeechPitch: (pitch: number) => void;
  speechRate: number;
  setSpeechRate: (rate: number) => void;
  handleTestSpeech: (text: string) => void;
  onAdvance: () => void;
  scrollToStep: (step: number) => void;
}

const ParallaxShowcaseCard: React.FC<ParallaxCardProps> = ({
  stepData,
  index,
  containerRef,
  isDark,
  handJoints,
  selectedJointIndex,
  setSelectedJointIndex,
  isSpeaking,
  speechPitch,
  setSpeechPitch,
  speechRate,
  setSpeechRate,
  handleTestSpeech,
  onAdvance,
  scrollToStep,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Measure card's horizontal scroll progress relative to the showcase track
  const { scrollXProgress } = useScroll({
    target: cardRef,
    container: containerRef,
    axis: 'x',
    offset: ['start end', 'end start'],
  });

  // Smooth physics spring for organic, buttery 60 FPS interpolation
  const springProgress = useSpring(scrollXProgress, {
    stiffness: 140,
    damping: 24,
    mass: 0.25,
  });

  // Layer 1: Deep Background Giant Typography Parallax ("HAS" / "TIVO")
  // Translates at a slower counter-rate creating authentic spatial depth
  const bgTextLeftX = useTransform(springProgress, [0, 0.5, 1], [-70, 0, 70]);
  const bgTextRightX = useTransform(springProgress, [0, 0.5, 1], [-45, 0, 45]);
  const bgTextOpacity = useTransform(springProgress, [0, 0.5, 1], [0.25, 0.95, 0.25]);

  // Layer 2: Main Frosted Glass Chassis Card Parallax & Perspective
  // Subtle 3D perspective rotation, scale pop at center, and translation dampening
  const cardScale = useTransform(springProgress, [0, 0.5, 1], [0.93, 1.0, 0.93]);
  const cardRotateY = useTransform(springProgress, [0, 0.5, 1], [3.5, 0, -3.5]);
  const cardElevationY = useTransform(springProgress, [0, 0.5, 1], [8, 0, 8]);

  // Layer 3: Foreground Interactive Telemetry & Instrument Parallax
  // Translates with heightened velocity forward to float above the frosted glass
  const fgInstrumentX = useTransform(springProgress, [0, 0.5, 1], [35, 0, -35]);
  const fgBadgeX = useTransform(springProgress, [0, 0.5, 1], [45, 0, -45]);
  const fgHeaderX = useTransform(springProgress, [0, 0.5, 1], [-25, 0, 25]);

  const activeJoint = handJoints.find(j => j.id === selectedJointIndex) || handJoints[2];

  return (
    <motion.div
      ref={cardRef}
      style={{
        scale: cardScale,
        rotateY: cardRotateY,
        y: cardElevationY,
        transformPerspective: 1200,
      }}
      className={`w-[92vw] sm:w-[86vw] lg:w-[1040px] max-w-[1040px] shrink-0 snap-center rounded-3xl sm:rounded-[36px] border backdrop-blur-3xl overflow-hidden transition-colors duration-300 relative shadow-2xl ${
        isDark
          ? 'bg-[#0B0E17]/75 border-white/20 text-white shadow-[0_25px_80px_rgba(0,0,0,0.8)] glow-border-amber'
          : 'bg-white/85 border-slate-300 text-slate-950 shadow-[0_25px_60px_rgba(15,23,42,0.12)]'
      }`}
    >
      {/* Decorative Parallax Accent Sheen */}
      <motion.div
        style={{ x: fgBadgeX }}
        className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#D4AF37]/10 dark:bg-[#D4AF37]/15 blur-3xl pointer-events-none z-0"
      />

      {/* Main Split Grid: Left Frosted Pane & Right Stage Instrument */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px] relative z-10">
        {/* ===================================================================
            LEFT COLUMN: Frosted Glass Panel with Giant 'HAS' & Metadata
            =================================================================== */}
        <div
          className={`lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r backdrop-blur-3xl transition-all relative overflow-hidden ${
            isDark ? 'bg-black/55 border-white/15 text-white' : 'bg-white/80 border-slate-300 text-slate-950'
          }`}
        >
          {/* Deep Parallax Split Typography 'HAS' */}
          <div className="mb-6 lg:mb-10 relative">
            <motion.span
              style={{
                x: bgTextLeftX,
                opacity: bgTextOpacity,
              }}
              className={`font-serif font-black text-6xl sm:text-7xl lg:text-9xl tracking-tighter select-none inline-block ${
                isDark
                  ? 'text-transparent bg-clip-text bg-gradient-to-b from-white/70 via-white/35 to-white/10 drop-shadow-[0_4px_20px_rgba(255,255,255,0.25)]'
                  : 'text-transparent bg-clip-text bg-gradient-to-b from-slate-950/65 via-slate-800/40 to-slate-700/20 drop-shadow-[0_4px_16px_rgba(0,0,0,0.1)]'
              }`}
            >
              {stepData.splitLeft}
            </motion.span>
          </div>

          {/* Bottom Information Block */}
          <motion.div style={{ x: fgHeaderX }} className="space-y-4">
            {/* Step Squircle + Phase Indicator Dots */}
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-11 rounded-2xl border flex items-center justify-center font-serif font-black text-lg shadow-inner ${
                  isDark ? 'border-white/30 bg-white/10 text-white' : 'border-slate-400 bg-black/5 text-slate-950'
                }`}
              >
                {stepData.num}
              </div>

              <div className="flex items-center gap-2">
                {[1, 2, 3, 4].map(stepNum => (
                  <button
                    key={stepNum}
                    onClick={() => scrollToStep(stepNum)}
                    className={`transition-all cursor-pointer ${
                      stepData.step === stepNum
                        ? 'w-3 h-3 rounded-full bg-[#D4AF37] ring-4 ring-[#D4AF37]/30 shadow-[0_0_10px_#D4AF37]'
                        : isDark
                          ? 'w-2 h-2 rounded-full border border-white/50 bg-transparent hover:border-white'
                          : 'w-2 h-2 rounded-full border border-slate-400 bg-transparent hover:border-slate-800'
                    }`}
                    title={`Jump to Phase 0${stepNum}`}
                  />
                ))}
              </div>

              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37] font-bold">
                {stepData.ticker}
              </span>
            </div>

            {/* Stage Title & Subtitle */}
            <div>
              <h4 className="font-serif font-bold text-xl sm:text-2xl tracking-tight leading-tight">
                {stepData.title}
              </h4>
              <p className="text-xs text-[#D4AF37] font-mono mt-1 font-bold">
                {stepData.subtitle}
              </p>
            </div>

            {/* Descriptive Paragraph */}
            <p className={`text-xs sm:text-sm font-sans leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {stepData.description}
            </p>

            {/* Elongated Arrow CTA Link */}
            <button
              onClick={onAdvance}
              className={`group inline-flex items-center gap-3 text-xs sm:text-sm font-sans font-semibold tracking-wider transition-all cursor-pointer pt-2 ${
                isDark ? 'text-white hover:text-[#D4AF37]' : 'text-slate-950 hover:text-amber-700'
              }`}
            >
              <span className="uppercase tracking-widest">{stepData.ctaText}</span>
              <div className="flex items-center">
                <span
                  className={`w-12 sm:w-20 h-[2px] transition-all group-hover:w-24 sm:group-hover:w-28 ${
                    isDark ? 'bg-white group-hover:bg-[#D4AF37]' : 'bg-slate-950 group-hover:bg-amber-700'
                  }`}
                />
                <ChevronRight className="w-4 h-4 -ml-1.5 transition-all" />
              </div>
            </button>
          </motion.div>
        </div>

        {/* ===================================================================
            RIGHT COLUMN: Giant 'TIVO' + Stage Telemetry Instrument (Parallax)
            =================================================================== */}
        <div
          className={`lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between relative z-10 backdrop-blur-md ${
            isDark ? 'bg-black/35' : 'bg-white/45'
          }`}
        >
          {/* Deep Parallax Split Typography 'TIVO' */}
          <div className="mb-4 lg:mb-6 relative">
            <motion.span
              style={{
                x: bgTextRightX,
                opacity: bgTextOpacity,
              }}
              className={`font-serif font-black text-6xl sm:text-7xl lg:text-9xl tracking-tighter select-none inline-block ${
                isDark
                  ? 'text-white drop-shadow-[0_0_35px_rgba(255,255,255,0.45)]'
                  : 'text-slate-950 drop-shadow-[0_0_20px_rgba(0,0,0,0.15)]'
              }`}
            >
              {stepData.splitRight}
            </motion.span>
          </div>

          {/* Interactive Parallax Foreground Instrument Content */}
          <motion.div style={{ x: fgInstrumentX }} className="flex-1 my-2">
            {stepData.step === 1 && (
              <div className="space-y-4">
                <div
                  className={`p-4 rounded-xl border space-y-2 font-mono text-xs ${
                    isDark ? 'bg-black/50 border-white/10' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 uppercase font-bold">ACTIVE PHONETIC TRANSACTION BUFFER:</span>
                    <span className="text-emerald-500 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      EXECUTED
                    </span>
                  </div>
                  <div className="text-base font-bold text-slate-900 dark:text-white">
                    "Hello friend, every gesture deserves to be heard."
                  </div>
                </div>

                {/* Acoustic Volume Profile Histogram */}
                <div
                  className={`p-4 rounded-xl border space-y-2 font-mono text-xs ${
                    isDark ? 'bg-black/40 border-white/10' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase font-bold">
                    <span>ACOUSTIC VOLUME PROFILE (48.0 kHz)</span>
                    <span className="text-emerald-500 font-bold">MAX GAIN: +14 dB &bull; 0% SLIPPAGE</span>
                  </div>
                  <div className="flex items-end justify-between h-20 gap-1.5 pt-2">
                    {[32, 65, 88, 44, 78, 100, 72, 38, 84, 96, 62, 48, 82, 92, 36, 68, 86, 42, 70, 94].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-sm bg-gradient-to-t from-emerald-500 to-[#D4AF37] transition-all duration-300"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>

                {/* Level-1 Ingestion Specs */}
                <div
                  className={`p-3.5 rounded-xl border grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-[11px] ${
                    isDark ? 'bg-black/30 border-white/10' : 'bg-slate-100 border-slate-200'
                  }`}
                >
                  <div>
                    <span className="text-[10px] text-slate-500 block">FREQUENCY</span>
                    <span className="font-bold text-slate-900 dark:text-white">48.0 kHz 24-bit</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">SIGNAL RATIO</span>
                    <span className="font-bold text-emerald-500">-28.4 dB SNR</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">INGESTION DELAY</span>
                    <span className="font-bold text-[#00E5FF]">8.2ms SUB-FRAME</span>
                  </div>
                </div>
              </div>
            )}

            {stepData.step === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                  {/* Flawed Order Book Column (Red / Ask) */}
                  <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-rose-600 dark:text-rose-400 font-bold uppercase flex items-center gap-1">
                        <TrendingDown className="w-3.5 h-3.5" />
                        NAIVE LINEAR (FLAWED COPY)
                      </span>
                      <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-700 dark:text-rose-400 text-[9px] font-bold">
                        REJECTED
                      </span>
                    </div>
                    <div className="font-bold text-sm leading-relaxed text-slate-900 dark:text-white">
                      [WHAT] [TIME] [IS] [OUR] [MEETING] [TODAY]
                    </div>
                    <div className="text-[11px] text-slate-500 space-y-0.5 pt-1">
                      <div>&bull; Flawed linear SVO transfer</div>
                      <div>&bull; Missing spatial locus</div>
                    </div>
                  </div>

                  {/* Authentic Order Book Column (Green / Bid) */}
                  <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold uppercase flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5" />
                        HASTIVO SOV ARBITRAGE
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-800 dark:text-emerald-400 text-[9px] font-bold">
                        100% MATCH
                      </span>
                    </div>
                    <div className="font-black text-sm leading-relaxed text-slate-900 dark:text-white">
                      [TODAY] [MEETING] [START-TIME] [WHAT-whq?]
                    </div>
                    <div className="text-[11px] text-slate-500 space-y-0.5 pt-1">
                      <div>&bull; Topicalized discourse anchor</div>
                      <div>&bull; Non-manual question marker</div>
                    </div>
                  </div>
                </div>

                <div
                  className={`p-3 rounded-xl border flex items-center justify-between font-mono text-xs ${
                    isDark ? 'bg-black/30 border-white/10' : 'bg-slate-100 border-slate-200'
                  }`}
                >
                  <span className="text-slate-400">PARSER MATCH RATE:</span>
                  <span className="text-emerald-500 font-extrabold text-sm">99.4% ZERO COPULA SLIPPAGE</span>
                </div>
              </div>
            )}

            {stepData.step === 3 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center font-mono text-xs">
                  {/* Interactive Hand Mesh */}
                  <div className="sm:col-span-7 relative h-56 rounded-xl border backdrop-blur-md flex items-center justify-center overflow-hidden bg-black/40 border-white/10">
                    <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-[#D4AF37]/50 stroke-2">
                      <line x1="50%" y1="88%" x2="18%" y2="48%" />
                      <line x1="50%" y1="88%" x2="35%" y2="16%" />
                      <line x1="50%" y1="88%" x2="52%" y2="12%" />
                      <line x1="50%" y1="88%" x2="68%" y2="20%" />
                      <line x1="50%" y1="88%" x2="82%" y2="36%" />
                    </svg>

                    {handJoints.map(j => {
                      const isSelected = selectedJointIndex === j.id;
                      return (
                        <button
                          key={j.id}
                          onClick={() => setSelectedJointIndex(j.id)}
                          style={{ left: j.x, top: j.y }}
                          className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full cursor-pointer transition-all ${
                            isSelected
                              ? 'w-6 h-6 bg-[#00E5FF] shadow-[0_0_15px_#00E5FF] z-20 ring-4 ring-white/30'
                              : 'w-4 h-4 bg-[#D4AF37] hover:scale-125 z-10'
                          }`}
                          title={`Inspect ${j.name}`}
                        />
                      );
                    })}

                    <div className="absolute top-2 left-3 text-[10px] text-slate-400">
                      CLICK VERTEX TO INSPECT 3D COORDINATES
                    </div>
                  </div>

                  {/* Node Readout */}
                  <div className="sm:col-span-5 space-y-2.5">
                    <div
                      className={`p-4 rounded-xl border space-y-2 ${
                        isDark ? 'bg-black/40 border-white/10' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="text-[10px] font-bold text-[#D4AF37] uppercase">NODE SPECIFICATION</div>
                      <div className="text-sm font-sans font-bold">{activeJoint.name}</div>
                      <div className="pt-2 border-t border-slate-200 dark:border-white/10 text-[11px] space-y-1">
                        <div>
                          <span className="text-slate-500 block">3D EUCLIDEAN:</span>
                          <span className="font-bold text-[#00E5FF]">{activeJoint.coords}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">FLEXION ANGLE:</span>
                          <span className="font-bold text-emerald-500">{activeJoint.angle}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {stepData.step === 4 && (
              <div className="space-y-4">
                <div
                  className={`p-4 rounded-xl border space-y-2 font-mono text-xs ${
                    isDark ? 'bg-black/40 border-white/10' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <span className="text-[10px] font-bold text-[#FF6F61] uppercase">SYNTHESIZED AUDITORY OUTPUT:</span>
                  <div className="text-base font-bold text-slate-900 dark:text-white">
                    "Yes, I understand completely. Every gesture deserves to be heard."
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center font-mono text-xs">
                  <button
                    onClick={() => handleTestSpeech('Yes, I understand completely. Every gesture deserves to be heard.')}
                    className={`w-full py-3.5 rounded-xl font-sans font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
                      isSpeaking ? 'bg-rose-500 text-white animate-pulse' : 'bg-[#FF6F61] text-white hover:bg-rose-600'
                    }`}
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>{isSpeaking ? 'VOCALIZING AUDIO...' : 'TRIGGER VOICE EXECUTION'}</span>
                  </button>

                  <div
                    className={`p-3 rounded-xl border space-y-2 ${
                      isDark ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span>Speed ({speechRate.toFixed(1)}x)</span>
                      <input
                        type="range"
                        min="0.5"
                        max="1.5"
                        step="0.1"
                        value={speechRate}
                        onChange={e => setSpeechRate(parseFloat(e.target.value))}
                        className="w-24 cursor-pointer accent-[#FF6F61]"
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span>Pitch ({speechPitch.toFixed(1)})</span>
                      <input
                        type="range"
                        min="0.5"
                        max="1.5"
                        step="0.1"
                        value={speechPitch}
                        onChange={e => setSpeechPitch(parseFloat(e.target.value))}
                        className="w-24 cursor-pointer accent-[#D4AF37]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Bottom Quick Instrument Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-300 dark:border-white/10 font-mono text-[11px]">
            <div>
              <span className="text-[9px] text-slate-500 uppercase block font-bold">24H HIGH ACCURACY</span>
              <span className="font-extrabold text-emerald-600 dark:text-emerald-400">99.8% ACC</span>
            </div>
            <div>
              <span className="text-[9px] text-slate-500 uppercase block font-bold">EXECUTION DELAY</span>
              <span className="font-extrabold text-[#00E5FF]">8.2ms SUB-FRAME</span>
            </div>
            <div>
              <span className="text-[9px] text-slate-500 uppercase block font-bold">SLIPPAGE SPREAD</span>
              <span className="font-extrabold text-emerald-600 dark:text-emerald-400">0.00% ZERO</span>
            </div>
            <div>
              <span className="text-[9px] text-slate-500 uppercase block font-bold">ACTIVE PHASE</span>
              <span className="font-extrabold text-amber-500">{stepData.navLabel}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const HorizontalShowcase: React.FC<HorizontalShowcaseProps> = ({
  steps,
  handJoints,
  selectedJointIndex,
  setSelectedJointIndex,
  isSpeaking,
  speechPitch,
  setSpeechPitch,
  speechRate,
  setSpeechRate,
  handleTestSpeech,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const showcaseScrollRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(1);
  const [autoStream, setAutoStream] = useState(false);
  const [isInView, setIsInView] = useState(false);

  // Monitor visibility so auto-stream never runs when the user is viewing other sections or near the footer
  useEffect(() => {
    const el = showcaseScrollRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Synchronize active step with scroll position (read-only, does not trigger page scroll)
  const handleScroll = () => {
    if (!showcaseScrollRef.current) return;
    const { scrollLeft, clientWidth } = showcaseScrollRef.current;
    const cardWidth = clientWidth * 0.85;
    const currentIdx = Math.min(
      steps.length - 1,
      Math.max(0, Math.round(scrollLeft / Math.max(cardWidth, 300)))
    );
    setActiveStep(steps[currentIdx]?.step || 1);
  };

  // Strictly horizontal container scrolling — NEVER calls window/element scrollIntoView
  const scrollToStep = (targetStep: number) => {
    if (!showcaseScrollRef.current) return;
    const targetIdx = steps.findIndex(s => s.step === targetStep);
    if (targetIdx !== -1) {
      const container = showcaseScrollRef.current;
      const targetCard = container.children[targetIdx] as HTMLElement | undefined;
      if (targetCard) {
        // Calculate horizontal offset strictly relative to the internal scroll container
        const targetLeft =
          targetCard.offsetLeft - (container.clientWidth - targetCard.clientWidth) / 2;

        container.scrollTo({
          left: Math.max(0, targetLeft),
          behavior: 'smooth',
        });
        setActiveStep(targetStep);
      }
    }
  };

  const scrollLeft = () => {
    if (!showcaseScrollRef.current) return;
    showcaseScrollRef.current.scrollBy({ left: -420, behavior: 'smooth' });
  };

  const scrollRight = () => {
    if (!showcaseScrollRef.current) return;
    showcaseScrollRef.current.scrollBy({ left: 420, behavior: 'smooth' });
  };

  // Auto-stream playback: ONLY active if explicitly enabled AND currently within viewport
  useEffect(() => {
    if (!autoStream || !isInView) return;
    const interval = setInterval(() => {
      setActiveStep(prev => {
        const next = prev < steps.length ? prev + 1 : 1;
        scrollToStep(next);
        return next;
      });
    }, 6000);
    return () => clearInterval(interval);
  }, [autoStream, isInView, steps.length]);


  return (
    <div className="relative w-full">
      {/* Top Bar: Social / Follow Us & Horizontal Navigation Tabs */}
      <div
        className={`relative z-20 flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 sm:px-8 rounded-3xl border backdrop-blur-2xl mb-6 transition-all ${
          isDark
            ? 'bg-[#0E121B]/80 border-white/15 text-white shadow-lg'
            : 'bg-white/85 border-slate-300 text-slate-950 shadow-md'
        }`}
      >
        {/* Left: Clean Architectural Pipeline Indicator (No Social Icons) */}
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]" />
          <div>
            <span className="font-serif font-bold text-sm sm:text-base tracking-tight block">
              Multimodal Journey
            </span>
            <span className="text-[10px] font-sans text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">
              4-Phase Neural Pipeline
            </span>
          </div>
        </div>

        {/* Center/Right: Phase Links + Parallax Scroll Chevrons + Auto-Stream */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-5 font-sans text-xs">
          {steps.map(s => {
            const active = activeStep === s.step;
            return (
              <button
                key={s.step}
                onClick={() => scrollToStep(s.step)}
                className={`uppercase transition-all cursor-pointer font-bold relative pb-1.5 ${
                  active
                    ? isDark
                      ? 'text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]'
                      : 'text-slate-950 font-black'
                    : isDark
                      ? 'text-slate-400 hover:text-slate-200'
                      : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                {s.navLabel}
                {active && (
                  <motion.span
                    layoutId="activeShowcaseNav"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]"
                  />
                )}
              </button>
            );
          })}

          {/* Quick Scroll Arrow Controls */}
          <div className="flex items-center gap-1 pl-2 border-l border-slate-300 dark:border-white/10">
            <button
              onClick={scrollLeft}
              title="Scroll Showcase Left"
              className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all hover:scale-110 cursor-pointer ${
                isDark
                  ? 'border-white/15 bg-white/5 hover:bg-white/15 text-white'
                  : 'border-slate-300 bg-black/5 hover:bg-black/10 text-slate-900'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={scrollRight}
              title="Scroll Showcase Right"
              className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all hover:scale-110 cursor-pointer ${
                isDark
                  ? 'border-white/15 bg-white/5 hover:bg-white/15 text-white'
                  : 'border-slate-300 bg-black/5 hover:bg-black/10 text-slate-900'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Auto-Stream Toggle Pill */}
          <button
            onClick={() => setAutoStream(!autoStream)}
            title={autoStream ? 'Pause parallax auto-stream' : 'Resume parallax auto-stream'}
            className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
              autoStream
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-600 dark:text-emerald-400'
                : isDark
                  ? 'bg-white/10 border-white/20 text-slate-400 hover:text-white'
                  : 'bg-slate-100 border-slate-300 text-slate-600'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${autoStream ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}
            />
            <span>{autoStream ? 'STREAMING' : 'PAUSED'}</span>
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Showcase Track */}
      <div className="relative group">
        {/* Left Floating Parallax Peek Arrow */}
        <button
          onClick={scrollLeft}
          aria-label="Previous showcase card"
          className={`absolute left-2 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-2xl border backdrop-blur-xl flex items-center justify-center transition-all cursor-pointer shadow-xl opacity-80 group-hover:opacity-100 hover:scale-110 ${
            isDark
              ? 'bg-black/70 border-white/25 text-white hover:bg-black/90'
              : 'bg-white/90 border-slate-300 text-slate-900 hover:bg-white'
          }`}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Right Floating Parallax Peek Arrow */}
        <button
          onClick={scrollRight}
          aria-label="Next showcase card"
          className={`absolute right-2 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-2xl border backdrop-blur-xl flex items-center justify-center transition-all cursor-pointer shadow-xl opacity-80 group-hover:opacity-100 hover:scale-110 ${
            isDark
              ? 'bg-black/70 border-white/25 text-white hover:bg-black/90'
              : 'bg-white/90 border-slate-300 text-slate-900 hover:bg-white'
          }`}
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* The Horizontal Showcase Scroll Container */}
        <div
          ref={showcaseScrollRef}
          onScroll={handleScroll}
          className="flex items-stretch gap-6 sm:gap-8 overflow-x-auto py-4 px-1 sm:px-4 snap-x snap-mandatory scroll-smooth focus:outline-none"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {steps.map((step, idx) => (
            <ParallaxShowcaseCard
              key={step.step}
              stepData={step}
              index={idx}
              total={steps.length}
              containerRef={showcaseScrollRef}
              isDark={isDark}
              handJoints={handJoints}
              selectedJointIndex={selectedJointIndex}
              setSelectedJointIndex={setSelectedJointIndex}
              isSpeaking={isSpeaking}
              speechPitch={speechPitch}
              setSpeechPitch={setSpeechPitch}
              speechRate={speechRate}
              setSpeechRate={setSpeechRate}
              handleTestSpeech={handleTestSpeech}
              onAdvance={() => {
                const nextStep = step.step < steps.length ? step.step + 1 : 1;
                scrollToStep(nextStep);
              }}
              scrollToStep={scrollToStep}
            />
          ))}
        </div>
      </div>

      {/* Horizontal Progress / Status Micro-Ribbon */}
      <div className="mt-4 flex items-center justify-between text-[11px] font-mono px-4 text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
          <span>PARALLAX HORIZONTAL SHOWCASE // SHIFT+SCROLL OR DRAG</span>
        </div>
        <div className="flex items-center gap-3">
          <span>PHASE 0{activeStep} OF 0{steps.length}</span>
          <span>&bull;</span>
          <span className="text-emerald-500 font-bold">60 FPS HARDWARE KINEMATICS</span>
        </div>
      </div>
    </div>
  );
};
