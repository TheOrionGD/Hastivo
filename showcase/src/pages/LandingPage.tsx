import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HorizontalShowcase } from '../components/HorizontalShowcase';
import { SpatialAvatarContainer } from '../components/SpatialAvatarContainer';
import { useTheme, SupportedLanguage } from '../context/ThemeContext';
import {
  Sparkles,
  Camera,
  Search,
  Sliders,
  Globe,
  Activity,
  Volume2,
  Mic,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Zap,
  Layers,
  Compass,
  CheckCircle2,
  Sun,
  Moon,
  ChevronDown,
  Check,
  Radio,
  Eye,
  SlidersHorizontal,
  Flame,
  ArrowUpRight,
  HandMetal,
  Cpu,
  Layers3,
  TrendingUp,
  TrendingDown,
  BarChart3,
  LineChart,
  DollarSign,
  Percent,
  Clock,
  Terminal,
  ArrowRightLeft,
  Play,
  Pause
} from 'lucide-react';

export type ShowcaseTileId = 'tile1' | 'tile2' | 'tile3' | 'tile4' | 'center';

interface ShowcaseTileInfo {
  id: ShowcaseTileId;
  title: string;
  tagline: string;
  subtitle: string;
  badge: string;
  description: string;
  metrics: { label: string; value: string }[];
}

const TILE_DATA: Record<ShowcaseTileId, ShowcaseTileInfo> = {
  center: {
    id: 'center',
    title: 'HASTIVO',
    tagline: '“Every Gesture Deserves to Be Heard.”',
    subtitle: 'Future linguistics — effortless multimodal clarity in real time',
    badge: 'CORE ENGINE v3.4',
    description: 'Neural spatial linguistic platform fusing real-time gloss synthesis, sensorless camera tracking, and natural voice articulation into an intuitive, organic interface.',
    metrics: [
      { label: 'Latency', value: '12.4ms' },
      { label: 'Tracking', value: '21 Joints' },
      { label: 'Dialects', value: '7 Languages' },
    ]
  },
  tile1: {
    id: 'tile1',
    title: 'Speech-to-Sign Engine',
    tagline: 'Spoken dialogue &rarr; authentic spatial gloss syntax',
    subtitle: 'Frosted Glass Slate &bull; Champagne Wave',
    badge: 'TEXT &rarr; GLOSS',
    description: 'Translates natural spoken dialogue into structured sign gloss sequences with authentic spatial locus and non-manual facial markers.',
    metrics: [
      { label: 'Parser', value: 'Neural SOV' },
      { label: 'Gloss Acc.', value: '98.6%' },
      { label: 'Speed', value: '< 15ms' },
    ]
  },
  tile2: {
    id: 'tile2',
    title: '60 FPS Vision Tracking',
    tagline: 'Sub-pixel kinematic hand extraction with standard webcams',
    subtitle: 'Precision Slate &bull; Glittering Spline',
    badge: 'CAMERA &rarr; SPEECH',
    description: 'Extracts 21 geometric skeletal landmarks per hand using standard RGB webcams without sensor gloves or infrared depth cameras.',
    metrics: [
      { label: 'Frame Rate', value: '60 FPS' },
      { label: 'Confidence', value: '99.2%' },
      { label: 'Hardware', value: 'Standard Cam' },
    ]
  },
  tile3: {
    id: 'tile3',
    title: 'Terrazzo Spatial Model',
    tagline: 'Topic-comment discourse structure with directional verbs',
    subtitle: 'Speckled Stone Slate &bull; Gold Inlay',
    badge: 'SPATIAL GRAMMAR',
    description: 'Replaces naive word-for-word string substitution with authentic topic-comment discourse grammar and directional verb inflection.',
    metrics: [
      { label: 'Syntax', value: 'Topic-Comment' },
      { label: 'Lexicon', value: 'ISL / ASL' },
      { label: 'Standard', value: 'WCAG 2.2 AA' },
    ]
  },
  tile4: {
    id: 'tile4',
    title: 'Synchronous Dialogue Bridge',
    tagline: 'Two-way duplex channels for hearing and deaf participants',
    subtitle: 'Porcelain Ribbed Slate &bull; Diagonal Spline',
    badge: 'DUAL PIPELINE',
    description: 'Dedicated asynchronous pipelines enabling deaf signers and hearing participants to converse simultaneously with zero interruption.',
    metrics: [
      { label: 'Channels', value: 'Independent 2x' },
      { label: 'Vocalization', value: 'Web Speech' },
      { label: 'Sync Delay', value: '< 15ms' },
    ]
  }
};

// Split Frosted Glass Horizontal Journey Steps Data (Matching image_cc243a35.png reference design)
export const JOURNEY_STEPS_INFO = [
  {
    step: 1,
    num: '01',
    splitLeft: 'HAS',
    splitRight: 'TIVO',
    ticker: 'INGEST',
    navLabel: '01. INGESTION',
    title: 'DISCOVER SPEECH INGESTION',
    subtitle: 'Continuous Acoustic Waveform → Phonetic Tokens',
    description: 'Continuous speech audio captured from standard hardware is deconstructed in real time. Continuous waveforms are segmented into discrete phonetic tokens while background noise and acoustic clutter are eliminated.',
    statBadge: 'SAMPLE: 48.0 kHz',
    ctaText: 'ADVANCE TO SOV PARSER',
  },
  {
    step: 2,
    num: '02',
    splitLeft: 'HAS',
    splitRight: 'TIVO',
    ticker: 'PARSER',
    navLabel: '02. SOV PARSER',
    title: 'DISCOVER SOV TOPIC PARSER',
    subtitle: 'SVO → SOV Topic-Comment Spatial Transformation',
    description: 'Sign languages use topic-comment grammar rather than linear English S-V-O format. HASTIVO eliminates copula filler words, moves question markers to the terminal locus, and inflects directional verbs in 3D signing space.',
    statBadge: 'PARSER ACCURACY: 99.4%',
    ctaText: 'ADVANCE TO 21-JOINT KINEMATICS',
  },
  {
    step: 3,
    num: '03',
    splitLeft: 'HAS',
    splitRight: 'TIVO',
    ticker: 'KINEMATICS',
    navLabel: '03. KINEMATICS',
    title: 'DISCOVER 21-JOINT KINEMATICS',
    subtitle: 'Sub-Pixel Geometric Hand Tracking & Coordinates',
    description: 'Extracts 21 skeletal landmarks per hand at 60 FPS using standard RGB webcams without sensor gloves or infrared depth cameras. Euclidean coordinates map directly to spatial signing corridors.',
    statBadge: 'STREAM: 60 FPS ZERO SENSOR',
    ctaText: 'ADVANCE TO DUPLEX VOCALIZER',
  },
  {
    step: 4,
    num: '04',
    splitLeft: 'HAS',
    splitRight: 'TIVO',
    ticker: 'VOCALIZER',
    navLabel: '04. VOCALIZER',
    title: 'DISCOVER FULL-DUPLEX VOCALIZER',
    subtitle: 'Camera Kinematic Gestures → Fluent Natural Audio',
    description: 'When the deaf participant signs, HASTIVO parses kinematics into grammatical morphology and articulates fluent vocal speech for the hearing partner in real time, supporting natural two-way conversation.',
    statBadge: 'SETTLEMENT: CONFIRMED',
    ctaText: 'CYCLE BACK TO PHASE 01',
  },
];

// Framer Motion staggered entrance variants
const heroContainerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

const heroItemVariants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: 'easeOut' as const,
    },
  },
};

// Swiss Grid Architectural Staggered Scroll-Reveal Variants
const swissSectionVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.75,
      ease: [0.16, 1, 0.3, 1] as const,
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const swissItemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};


export const LandingPage: React.FC = () => {
  const { theme, toggleTheme, language, setLanguage, terminologyMode } = useTheme();

  const isDark = theme === 'dark';
  const isGloss = terminologyMode === 'sign-gloss';

  // Active Tile Selection in Hero
  const [activeTile, setActiveTile] = useState<ShowcaseTileId>('center');

  // Interactive Stage 3 Hand Joint Selection
  const [selectedJointIndex, setSelectedJointIndex] = useState(8); // Index Finger Tip

  // Interactive Stage 4 Web Speech Synthesis state
  const [speechPitch, setSpeechPitch] = useState(1.0);
  const [speechRate, setSpeechRate] = useState(1.0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Section: Text-to-Sign interactive demo state
  const [textInput, setTextInput] = useState('Hello friend, nice to meet you');
  const [selectedGlossIndex, setSelectedGlossIndex] = useState(0);

  // Section: Computer-Vision interactive landmark simulator
  const [cvConfidence, setCvConfidence] = useState(99.2);
  const [cvActiveToken, setCvActiveToken] = useState('THANK_YOU');
  const [cvAudioPlaying, setCvAudioPlaying] = useState(false);

  // Section: Real-time dialogue simulation step
  const [dialogueStep, setDialogueStep] = useState(0);

  // Waitlist form state (Above Footer section)
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistJoined, setWaitlistJoined] = useState(false);

  // Smooth scroll helper
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const activeTileInfo = TILE_DATA[activeTile];

  // Dynamic Glosses based on text input
  const generatedGlosses = useMemo(() => {
    const words = textInput.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) {
      return [
        { token: 'READY', spatial: 'Chest Neutral', duration: '0.8s', nonManual: 'Attentive', type: 'State', rule: 'Default resting clause' }
      ];
    }

    return words.map((w, idx) => {
      const clean = w.toUpperCase().replace(/[^A-Z]/g, '');
      const durations = ['0.9s', '1.1s', '1.4s', '1.2s', '0.8s'];
      const loci = ['Chest Space', 'Chin Downward', 'Neutral Center', 'Outward Radial', 'Temple Proximal'];
      const nonManuals = ['Affirmative Nod', 'Friendly Smile', 'Inquiry Brow', 'Topic Focus', 'Neutral Gaze'];
      const types = ['Noun', 'Verb', 'Topic Marker', 'Modifier', 'Question Marker'];
      const rules = [
        'Locus set at midline; topicalized noun phrase',
        'Directional verb inflecting subject to object',
        'Spatial anchor establishing discourse referent',
        'Temporal aspect modifying root velocity',
        'Terminal non-manual marker with furrowed brow'
      ];

      return {
        token: clean || 'TOKEN',
        spatial: loci[idx % loci.length],
        duration: durations[idx % durations.length],
        nonManual: nonManuals[idx % nonManuals.length],
        type: types[idx % types.length],
        rule: rules[idx % rules.length],
      };
    });
  }, [textInput]);

  const activeGloss = generatedGlosses[selectedGlossIndex % generatedGlosses.length] || generatedGlosses[0];

  // Map active gloss token to authentic 3D Avatar gesture
  const avatarGesture = useMemo(() => {
    const t = (activeGloss?.token || '').toUpperCase();
    if (t.includes('HELLO') || t.includes('HI') || t.includes('GREET')) return 'GREETING';
    if (t.includes('THANK')) return 'THANK_YOU';
    if (t.includes('WHAT') || t.includes('CAN') || t.includes('?') || t.includes('TIME')) return 'QUESTION';
    if (t.includes('WELCOME')) return 'WELCOME';
    if (t.includes('YES') || t.includes('AFFIRM')) return 'YES_AFFIRM';
    if (t.includes('NO') || t.includes('NOT') || t.includes('NEG')) return 'NO_NEGATE';
    if (t.includes('YOU')) return 'POINT_YOU';
    if (t.includes('LOVE')) return 'LOVE';
    if (t.includes('HELP')) return 'HELP';
    if (t.includes('MEET') || t.includes('FRIEND') || t.includes('GESTURE') || t.includes('PROJECT')) return 'COMMUNICATE';
    return 'WELCOME';
  }, [activeGloss]);

  // Dialogue simulation steps
  const conversationDialogue = [
    { speaker: 'A', role: 'Hearing Participant', modality: 'Speech Input', text: 'Good morning! Can we review the accessibility project roadmap?', gloss: '[MORNING] [GOOD] [PROJECT] [ROADMAP] [REVIEW] [CAN?]' },
    { speaker: 'B', role: 'Signer Participant', modality: 'Camera Gesture', text: 'Yes, I am ready. I verified the ISL gloss sequences.', gloss: '[YES] [READY] [ISL] [GLOSS] [CHECK_DONE]' },
    { speaker: 'A', role: 'Hearing Participant', modality: 'Speech Input', text: 'Excellent! The landmark latency is under 15ms.', gloss: '[EXCELLENT] [CAMERA] [SPEED] [FAST] [GOOD]' },
    { speaker: 'B', role: 'Signer Participant', modality: 'Camera Gesture', text: 'The natural grammar representation is completely authentic.', gloss: '[NATURAL] [GRAMMAR] [TRUE] [PERFECT]' },
  ];

  const handleNextDialogueStep = () => {
    setDialogueStep(prev => (prev + 1) % conversationDialogue.length);
  };

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (waitlistEmail.trim() && waitlistEmail.includes('@')) {
      setWaitlistJoined(true);
    }
  };

  // Play real voice articulation using Web Speech API
  const handleTestSpeech = (phrase: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(phrase);
      utterance.rate = speechRate;
      utterance.pitch = speechPitch;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsSpeaking(true);
      setTimeout(() => setIsSpeaking(false), 1500);
    }
  };

  // Hand Landmark Nodes Data for Stage 3
  const HAND_JOINTS = [
    { id: 0, name: 'Wrist / Root', x: '50%', y: '88%', coords: '0.00, 0.00, 0.00', angle: '0°' },
    { id: 4, name: 'Thumb Tip', x: '18%', y: '48%', coords: '-0.38, 0.42, 0.15', angle: '34°' },
    { id: 8, name: 'Index Tip', x: '35%', y: '16%', coords: '-0.14, 0.82, 0.02', angle: '78°' },
    { id: 12, name: 'Middle Tip', x: '52%', y: '12%', coords: '0.04, 0.89, 0.01', angle: '84°' },
    { id: 16, name: 'Ring Tip', x: '68%', y: '20%', coords: '0.22, 0.81, -0.05', angle: '72°' },
    { id: 20, name: 'Pinky Tip', x: '82%', y: '36%', coords: '0.36, 0.61, -0.12', angle: '55°' },
  ];

  // Auto-Cycle Animations for Mobile and Hands-Free Experience
  const [autoAnimateDialogue, setAutoAnimateDialogue] = useState(true);
  const [autoAnimateTokens, setAutoAnimateTokens] = useState(true);

  // Live Auto-Streaming HFT Detections
  const [liveGestures, setLiveGestures] = useState([
    { time: '14:22:04.12', token: 'THANK_YOU', conf: '99.2%', delta: '+0.08%', buy: true },
    { time: '14:22:03.45', token: 'PLEASE', conf: '97.8%', delta: '+0.12%', buy: true },
    { time: '14:22:02.18', token: 'WELCOME', conf: '98.4%', delta: '-0.02%', buy: false },
    { time: '14:22:01.02', token: 'HELP_ME', conf: '99.1%', delta: '+0.15%', buy: true },
    { time: '14:21:59.88', token: 'GOOD_JOB', conf: '96.5%', delta: '+0.04%', buy: true },
  ]);

  // Auto-Cycle Dialogue Stream (every 4.2 seconds)
  React.useEffect(() => {
    if (!autoAnimateDialogue) return;
    const timer = setInterval(() => {
      setDialogueStep(prev => (prev + 1) % conversationDialogue.length);
    }, 4200);
    return () => clearInterval(timer);
  }, [autoAnimateDialogue, conversationDialogue.length]);

  // Auto-Cycle Token inspection in Order Book (every 3.2 seconds)
  React.useEffect(() => {
    if (!autoAnimateTokens || generatedGlosses.length <= 1) return;
    const timer = setInterval(() => {
      setSelectedGlossIndex(prev => (prev + 1) % generatedGlosses.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [autoAnimateTokens, generatedGlosses.length]);

  // Live Auto-Streaming HFT Landmark Detections (every 3.5 seconds)
  React.useEffect(() => {
    const GESTURE_POOL = [
      { token: 'THANK_YOU', conf: '99.4%' },
      { token: 'PLEASE', conf: '98.2%' },
      { token: 'WELCOME', conf: '98.9%' },
      { token: 'HELP_ME', conf: '99.1%' },
      { token: 'GOOD_JOB', conf: '97.6%' },
      { token: 'HELLO_FRIEND', conf: '99.5%' },
    ];
    let idx = 0;
    const timer = setInterval(() => {
      idx = (idx + 1) % GESTURE_POOL.length;
      const g = GESTURE_POOL[idx];
      const now = new Date();
      const ms = Math.floor(Math.random() * 89 + 10);
      const timeStr = `${now.toTimeString().split(' ')[0]}.${ms}`;
      setLiveGestures(prev => [
        { time: timeStr, token: g.token, conf: g.conf, delta: '+0.08%', buy: true },
        ...prev.slice(0, 4)
      ]);
      setCvActiveToken(g.token);
      setCvConfidence(parseFloat(g.conf));
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative z-10 w-full min-h-screen font-vision antialiased bg-transparent transition-colors duration-500">
      {/* =========================================================================
          FLOATING NEO-APPLE GLASS NAVIGATION BAR
          ========================================================================= */}
      <header className="sticky top-4 z-40 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav
          className={`neo-glass rounded-2xl sm:rounded-3xl px-5 sm:px-8 py-3.5 flex items-center justify-between gap-4 transition-all duration-300 shadow-xl ${
            isDark ? 'border-white/20' : 'border-slate-300 shadow-sm'
          }`}
          aria-label="HASTIVO Navigation"
        >
          {/* Brand Mark (HASTIVO with PACT Media Bold Modern Serif) */}
          <div className="flex items-center gap-2.5">
            <span className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#FDE8D7] shadow-[0_0_12px_rgba(212,175,55,0.7)] inline-block" />
            <span className={`font-serif font-black text-xl sm:text-2xl tracking-tight ${
              isDark ? 'text-white' : 'text-slate-950'
            }`}>
              HASTIVO
            </span>
            <span className={`hidden md:inline-block text-[10px] font-sans font-semibold border-l pl-2.5 uppercase tracking-wider ${
              isDark ? 'border-white/20 text-[#D4AF37]' : 'border-slate-300 text-amber-800'
            }`}>
              {isGloss ? '[SPATIAL LINGUISTICS]' : 'Spatial Linguistics'}
            </span>
          </div>

          {/* Center Links with Clean Sans Typography */}
          <div className={`hidden lg:flex items-center gap-7 text-xs font-sans font-medium tracking-wide ${
            isDark ? 'text-[#C5BAAC]' : 'text-slate-700'
          }`}>
            <button
              onClick={() => scrollTo('hero')}
              className={`hover:scale-105 transition-all cursor-pointer ${
                isDark ? 'hover:text-white' : 'hover:text-slate-950'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => scrollTo('horizontal-journey')}
              className="hover:scale-105 transition-all cursor-pointer flex items-center gap-1.5 text-[#D4AF37] font-semibold"
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Horizontal Journey</span>
            </button>
            <button
              onClick={() => scrollTo('text-to-sign')}
              className={`hover:scale-105 transition-all cursor-pointer ${
                isDark ? 'hover:text-white' : 'hover:text-slate-950'
              }`}
            >
              Gloss Engine
            </button>
            <button
              onClick={() => scrollTo('vision-pipeline')}
              className={`hover:scale-105 transition-all cursor-pointer ${
                isDark ? 'hover:text-white' : 'hover:text-slate-950'
              }`}
            >
              Vision 60FPS
            </button>
            <button
              onClick={() => scrollTo('dialogue-bridge')}
              className={`hover:scale-105 transition-all cursor-pointer ${
                isDark ? 'hover:text-white' : 'hover:text-slate-950'
              }`}
            >
              Dialogue
            </button>
            <button
              onClick={() => scrollTo('waitlist')}
              className={`hover:scale-105 transition-all cursor-pointer ${
                isDark ? 'hover:text-white' : 'hover:text-slate-950'
              }`}
            >
              Waitlist
            </button>
          </div>

          {/* Right Action Tools - Matching user attachment image_de15e0a3.png */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            <button
              onClick={() => scrollTo('text-to-sign')}
              className={`p-2 rounded-full transition-colors cursor-pointer ${
                isDark ? 'text-neutral-300 hover:text-white hover:bg-white/10' : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
              }`}
              title="Search Lexicon"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollTo('vision-pipeline')}
              className={`p-2 rounded-full transition-colors cursor-pointer ${
                isDark ? 'text-neutral-300 hover:text-white hover:bg-white/10' : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
              }`}
              title="Filter Settings"
              aria-label="Filters"
            >
              <Sliders className="w-4 h-4" />
            </button>
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-colors cursor-pointer ${
                isDark ? 'text-amber-300 hover:text-white hover:bg-white/10' : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
              }`}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Clean White Rounded Pill Button WAITLIST -> matching image_de15e0a3.png */}
            <button
              onClick={() => scrollTo('waitlist')}
              className="text-xs font-sans font-semibold tracking-wider px-5 sm:px-6 py-2.5 rounded-full cursor-pointer flex items-center gap-2 bg-white text-slate-950 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all"
            >
              <span>WAITLIST</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </nav>
      </header>

      {/* =========================================================================
          HERO STAGE: NEO-APPLE 3D ORGANIC COMPOSITION WITH LIVE BACKGROUND VIDEO
          Features Framer Motion staggered entrance animation and defined edges.
          ========================================================================= */}
      <section id="hero" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
        <div
          className={`relative w-full rounded-3xl sm:rounded-[36px] overflow-hidden shadow-2xl backdrop-blur-2xl min-h-[620px] sm:min-h-[720px] flex items-center justify-center p-4 sm:p-8 transition-all ${
            isDark
              ? 'bg-[#10141D]/75 border border-white/20 glow-border-amber text-white'
              : 'bg-white/80 border border-slate-300 text-slate-950 shadow-[0_20px_60px_rgba(0,0,0,0.08)]'
          }`}
        >
          {/* Background Video Layer for the Hero Container */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className={`w-full h-full object-cover transition-opacity duration-1000 scale-[1.02] ${
                isDark ? 'opacity-80' : 'opacity-70'
              }`}
            >
              <source src="https://res.cloudinary.com/b4qngi2o/video/upload/v1793781030/bg.mp4" type="video/mp4" />
            </video>
            {/* Theme-Adaptive Soft Vignette */}
            <div className={`absolute inset-0 pointer-events-none ${
              isDark
                ? 'bg-gradient-to-t from-black/80 via-transparent to-black/30'
                : 'bg-gradient-to-t from-white/70 via-transparent to-white/40'
            }`} />
          </div>

          {/* Interactive Floating Slates with defined edges and gold waves (hidden on mobile, visible on sm+) */}
          {/* Slate 1: Top-Left Card */}
          <button
            onClick={() => setActiveTile('tile1')}
            className={`hidden sm:block absolute z-20 top-[18%] left-[8%] sm:left-[14%] w-32 sm:w-48 h-18 sm:h-24 rounded-2xl backdrop-blur-2xl border transition-all duration-300 cursor-pointer overflow-hidden ${
              activeTile === 'tile1'
                ? 'glow-border-amber scale-105 shadow-2xl bg-white/90 dark:bg-black/60'
                : 'hover:scale-102 hover:shadow-lg bg-white/70 dark:bg-black/40 border-slate-300 dark:border-white/20'
            }`}
            title="Speech-to-Sign Engine"
          >
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#FFC107]/20 border border-[#FFC107]/40 text-[9px] font-mono text-amber-900 dark:text-[#FFD54F] font-bold">
              GLOSS 98.6%
            </div>
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] font-sans font-semibold">
              <span className={isDark ? 'text-white' : 'text-slate-950'}>Text &rarr; Sign</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            </div>
          </button>

          {/* Slate 2: Top-Right Card */}
          <button
            onClick={() => setActiveTile('tile2')}
            className={`hidden sm:block absolute z-20 top-[16%] right-[8%] sm:right-[18%] w-32 sm:w-48 h-18 sm:h-24 rounded-2xl backdrop-blur-2xl border transition-all duration-300 cursor-pointer overflow-hidden ${
              activeTile === 'tile2'
                ? 'glow-border-cyan scale-105 shadow-2xl bg-white/90 dark:bg-black/60'
                : 'hover:scale-102 hover:shadow-lg bg-white/70 dark:bg-black/40 border-slate-300 dark:border-white/20'
            }`}
            title="60 FPS Vision Tracking"
          >
            <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-[9px] font-mono text-cyan-900 dark:text-[#00E5FF] font-bold">
              60 FPS CV
            </div>
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] font-sans font-semibold">
              <span className={isDark ? 'text-white' : 'text-slate-950'}>Vision Tracking</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]" />
            </div>
          </button>

          {/* Slate 3: Bottom-Left Card (Terrazzo) */}
          <button
            onClick={() => setActiveTile('tile3')}
            className={`hidden sm:block absolute z-20 bottom-[16%] left-[10%] sm:left-[18%] w-36 sm:w-52 h-20 sm:h-28 rounded-2xl backdrop-blur-2xl border transition-all duration-300 cursor-pointer overflow-hidden ${
              activeTile === 'tile3'
                ? 'glow-border-amber scale-105 shadow-2xl bg-white/90 dark:bg-black/60'
                : 'hover:scale-102 hover:shadow-lg bg-white/70 dark:bg-black/40 border-slate-300 dark:border-white/20'
            }`}
            title="Terrazzo Spatial Model"
          >
            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-[9px] font-mono text-amber-900 dark:text-[#FFD54F] font-bold">
              SOV SYNTAX
            </div>
            <div className={`absolute top-2 left-2 right-2 text-[11px] font-sans font-semibold ${
              isDark ? 'text-white' : 'text-slate-950'
            }`}>
              <span>Spatial Grammar</span>
            </div>
          </button>

          {/* Slate 4: Bottom-Right Card (Ribbed Porcelain) */}
          <button
            onClick={() => setActiveTile('tile4')}
            className={`hidden sm:block absolute z-20 bottom-[14%] right-[10%] sm:right-[20%] w-36 sm:w-52 h-20 sm:h-28 rounded-2xl backdrop-blur-2xl border transition-all duration-300 cursor-pointer overflow-hidden ${
              activeTile === 'tile4'
                ? 'glow-border-coral scale-105 shadow-2xl bg-white/90 dark:bg-black/60'
                : 'hover:scale-102 hover:shadow-lg bg-white/70 dark:bg-black/40 border-slate-300 dark:border-white/20'
            }`}
            title="Synchronous Dialogue Bridge"
          >
            <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-[9px] font-mono text-rose-900 dark:text-rose-300 font-bold">
              2-WAY SYNC
            </div>
            <div className={`absolute top-2 left-2 right-2 text-[11px] font-sans font-semibold ${
              isDark ? 'text-white' : 'text-slate-950'
            }`}>
              <span>Dialogue Bridge</span>
            </div>
          </button>

          {/* Central Frosted Glass Hero Card with Staggered Framer Motion Entrance */}
          <motion.div
            variants={heroContainerVariants}
            initial="hidden"
            animate="show"
            className={`relative z-30 max-w-md sm:max-w-xl w-full rounded-3xl p-6 sm:p-10 text-center shadow-2xl backdrop-blur-3xl overflow-hidden border transition-all duration-500 ${
              isDark
                ? 'bg-[#121622]/85 border-white/25 glow-border-amber text-white shadow-[0_25px_60px_rgba(0,0,0,0.7)]'
                : 'bg-white/90 border-slate-300 text-slate-950 shadow-[0_25px_50px_rgba(0,0,0,0.1)]'
            }`}
          >
            {/* Top Indicator Badge */}
            <motion.div variants={heroItemVariants} className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full mb-3 shadow-sm border backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
              <span className={`text-[11px] font-sans font-semibold tracking-wide ${
                isDark ? 'text-amber-300' : 'text-amber-800'
              }`}>
                {isGloss ? `[${activeTileInfo.badge}]` : activeTileInfo.badge}
              </span>
            </motion.div>

            {/* Headline: STRICTLY HASTIVO WITH PACT MEDIA EDITORIAL SERIF */}
            <motion.h1
              variants={heroItemVariants}
              className={`text-5xl sm:text-7xl md:text-8xl font-serif font-black tracking-tight leading-none drop-shadow-md ${
                isDark ? 'text-white' : 'text-slate-950'
              }`}
            >
              {activeTile === 'center' ? 'HASTIVO' : activeTileInfo.title}
            </motion.h1>

            {/* MANDATORY PROMINENT TAGLINE WITH ELEGANT EDITORIAL SERIF ITALIC */}
            <motion.div
              variants={heroItemVariants}
              className={`mt-4 font-serif italic font-medium text-lg sm:text-2xl tracking-tight ${
                isDark ? 'text-[#FDE8D7]' : 'text-amber-900'
              }`}
            >
              {isGloss ? (
                <div>
                  <span className="block font-mono not-italic text-sm sm:text-base text-[#D4AF37]">[GESTURE_ALL] [DESERVE] [HEARD_VOICE]</span>
                  <span className={`text-base sm:text-xl font-serif italic block mt-1 ${
                    isDark ? 'text-[#FDE8D7]' : 'text-amber-900'
                  }`}>
                    “Every Gesture Deserves to Be Heard.”
                  </span>
                </div>
              ) : (
                '“Every Gesture Deserves to Be Heard.”'
              )}
            </motion.div>

            {/* Subtitle with High Contrast */}
            <motion.p
              variants={heroItemVariants}
              className={`mt-3 text-xs sm:text-sm font-sans font-normal max-w-md mx-auto leading-relaxed ${
                isDark ? 'text-neutral-200' : 'text-slate-700'
              }`}
            >
              {activeTileInfo.subtitle}
            </motion.p>

            {/* Metric Chips Row */}
            <motion.div
              variants={heroItemVariants}
              className={`mt-5 grid grid-cols-3 gap-2 py-3 border-y text-center ${
                isDark ? 'border-white/15' : 'border-slate-300'
              }`}
            >
              {activeTileInfo.metrics.map(m => (
                <div key={m.label} className="space-y-0.5">
                  <span className={`block text-[10px] font-mono font-bold uppercase ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    {m.label}
                  </span>
                  <span className={`block text-xs sm:text-sm font-sans font-bold ${
                    isDark ? 'text-white' : 'text-slate-950'
                  }`}>
                    {m.value}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={heroItemVariants} className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => scrollTo('horizontal-journey')}
                className={`text-xs font-sans font-semibold tracking-wider px-8 py-3.5 rounded-full cursor-pointer flex items-center justify-center gap-2 w-full sm:w-auto shadow-lg transition-all ${
                  isDark
                    ? 'bg-white text-black shadow-[0_0_25px_rgba(255,255,255,0.7)] hover:shadow-[0_0_35px_rgba(255,255,255,0.95)] hover:scale-105'
                    : 'bg-slate-950 text-white shadow-[0_4px_16px_rgba(15,23,42,0.3)] hover:bg-slate-800 hover:scale-105'
                }`}
              >
                <span>EXPLORE HORIZONTAL JOURNEY</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => scrollTo('text-to-sign')}
                className={`text-xs font-sans font-semibold tracking-wider px-6 py-3.5 rounded-full cursor-pointer flex items-center justify-center gap-2 w-full sm:w-auto border transition-all ${
                  isDark
                    ? 'border-white/20 bg-white/5 hover:bg-white/15 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                    : 'border-slate-300 bg-black/5 hover:bg-black/10 text-slate-900 shadow-sm'
                }`}
              >
                <span>3D SPATIAL AVATAR</span>
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              </button>

              {activeTile !== 'center' && (
                <button
                  onClick={() => setActiveTile('center')}
                  className={`px-4 py-2 text-xs font-sans font-semibold cursor-pointer ${
                    isDark ? 'text-[#C5BAAC] hover:text-white' : 'text-slate-700 hover:text-slate-950'
                  }`}
                >
                  RESET VIEW
                </button>
              )}
            </motion.div>
          </motion.div>
        </div>

        {/* Feature Selector Strip beneath the Hero Stage */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { id: 'tile1', label: '1. Gloss Engine', desc: 'Speech to sign sequences' },
            { id: 'tile2', label: '2. 60 FPS Vision', desc: 'Landmark camera tracking' },
            { id: 'tile3', label: '3. Spatial SOV', desc: 'Grammatical discourse model' },
            { id: 'tile4', label: '4. Two-Way Sync', desc: 'Bidirectional audio/sign' }
          ].map(tile => (
            <button
              key={tile.id}
              onClick={() => setActiveTile(tile.id as ShowcaseTileId)}
              className={`p-4 rounded-2xl text-left transition-all cursor-pointer backdrop-blur-2xl border ${
                activeTile === tile.id
                  ? 'glow-border-amber bg-white dark:bg-white/20 scale-[1.02] border-[#D4AF37]'
                  : isDark
                    ? 'bg-[#121622]/70 border-white/10 hover:bg-white/10'
                    : 'bg-white/80 border-slate-300 hover:bg-white'
              }`}
            >
              <span className={`block text-xs font-sans font-bold ${
                isDark ? 'text-white' : 'text-slate-950'
              }`}>
                {tile.label}
              </span>
              <span className={`block text-[11px] font-sans font-medium mt-0.5 ${
                isDark ? 'text-[#A0988E]' : 'text-slate-700'
              }`}>
                {tile.desc}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* =========================================================================
          FINANCIAL MARKET TICKER TAPE (Bridging Hero to Intermediate Sections)
          Continuous share market ticker with live prices, percentage deltas,
          and trading volume.
          ========================================================================= */}
      {/* =========================================================================
          FINANCIAL MARKET TICKER TAPE (Bridging Hero to Intermediate Sections)
          Continuous share market ticker with live prices, percentage deltas,
          and trading volume.
          ========================================================================= */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={swissSectionVariants}
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-2 mb-8"
      >
        <motion.div
          variants={swissItemVariants}
          className={`rounded-2xl p-2.5 sm:p-3 backdrop-blur-2xl border flex items-center justify-between gap-4 overflow-x-auto shadow-lg transition-all ${
            isDark
              ? 'bg-[#0B0E14]/85 border-white/15 text-white shadow-[0_10px_30px_rgba(0,0,0,0.6)]'
              : 'bg-white/90 border-slate-300 text-slate-950 shadow-md'
          }`}
        >
          {/* Market Status Indicator */}
          <div className="flex items-center gap-2 shrink-0 pr-3 border-r border-slate-300 dark:border-white/10">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-sans font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              MARKET OPEN &bull; REAL-TIME FEED
            </span>
          </div>

          {/* Scrolling Tickers */}
          <div className="flex items-center gap-6 shrink-0 font-mono text-xs">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-500 dark:text-slate-400">HSTV/INDEX</span>
              <span className="font-extrabold">99.42%</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center text-[11px]">
                <TrendingUp className="w-3 h-3 mr-0.5" /> +2.48%
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-500 dark:text-slate-400">LATENCY/HFT</span>
              <span className="font-extrabold">8.2ms</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center text-[11px]">
                <TrendingDown className="w-3 h-3 mr-0.5" /> -1.6ms
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-500 dark:text-slate-400">FPS/CAM</span>
              <span className="font-extrabold text-[#00E5FF]">60.00</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                STABLE
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-500 dark:text-slate-400">SOV/PARSER</span>
              <span className="font-extrabold">99.4%</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                BUY
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-500 dark:text-slate-400">LANDMARK/21J</span>
              <span className="font-extrabold text-[#D4AF37]">21/21</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                LOCKED
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-500 dark:text-slate-400">24H VOLUME</span>
              <span className="font-extrabold text-amber-500">2.84M TOKENS</span>
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* =========================================================================
          SECTION 1: THE HASTIVO HORIZONTAL JOURNEY
          Faithfully implemented matching the uploaded reference design (image_cc243a35.png):
          - Top header: FOLLOW US with social icons on the left, horizontal phase nav links on the right
          - Split centerpiece: Giant typographic boundary (frosted glass 'HAS' on left, crisp white 'TIVO' on right)
          - Left frosted pane: 01 squircle, horizontal dot pagination (● ○ ○ ○), DISCOVER [STAGE] title, description,
            and elongated horizontal arrow CTA link (VIEW ALL TRIPS ──────→ style)
          - Right clear pane: Continues 'TIVO', embeds interactive live instrument terminal (frequency histogram,
            SOV arbitrage comparison, 21-joint mesh, or speech vocalizer)
          - Bottom telemetry ticker bar with 24H execution stats
          - Frosted glass with defined edges over background video only
          ========================================================================= */}
      <motion.section
        id="horizontal-journey"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.12 }}
        variants={swissSectionVariants}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        {/* Swiss Grid Modular Header Marker */}
        <motion.div
          variants={swissItemVariants}
          className="flex items-center justify-between pb-3 text-[10px] font-sf-compact font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 border-b border-black/10 dark:border-white/10 mb-6"
        >
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#D4AF37]" />
            <span>SWISS GRID: 12-COL // MODULAR BASELINE</span>
          </div>
          <span>SEC_01 &bull; MULTIMODAL HORIZONTAL JOURNEY</span>
        </motion.div>

        <motion.div variants={swissItemVariants} className="w-full">
          <HorizontalShowcase
            steps={JOURNEY_STEPS_INFO}
            handJoints={HAND_JOINTS}
            selectedJointIndex={selectedJointIndex}
            setSelectedJointIndex={setSelectedJointIndex}
            isSpeaking={isSpeaking}
            speechPitch={speechPitch}
            setSpeechPitch={setSpeechPitch}
            speechRate={speechRate}
            setSpeechRate={setSpeechRate}
            handleTestSpeech={handleTestSpeech}
          />
        </motion.div>
      </motion.section>

      {/* =========================================================================
          SECTION 2: TEXT-TO-SIGN ENGINE
          Styled as an Interactive Syntactic Order Book & Execution Terminal
          ========================================================================= */}
      <motion.section
        id="text-to-sign"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.12 }}
        variants={swissSectionVariants}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        {/* Swiss Grid Modular Header Marker */}
        <motion.div
          variants={swissItemVariants}
          className="flex items-center justify-between pb-3 text-[10px] font-sf-compact font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 border-b border-black/10 dark:border-white/10 mb-6"
        >
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#D4AF37]" />
            <span>SWISS GRID: 12-COL // MODULAR BASELINE</span>
          </div>
          <span>SEC_02 &bull; SYNTACTIC ORDER BOOK</span>
        </motion.div>

        <motion.div
          variants={swissItemVariants}
          className={`rounded-2xl p-6 sm:p-8 backdrop-blur-3xl border shadow-xl space-y-6 transition-all ${
            isDark ? 'bg-[#0E121B]/85 border-white/15 text-white' : 'bg-white/95 border-slate-300 text-slate-950 shadow-md'
          }`}
        >
          {/* Order Book Terminal Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-300 dark:border-white/10 font-mono text-xs">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded bg-[#D4AF37]/20 text-[#D4AF37] font-bold uppercase">
                BOOK: HSTV/GLOSS
              </span>
              <span className="font-serif font-bold text-lg sm:text-xl uppercase tracking-tight">
                SYNTACTIC ORDER BOOK &amp; LEVEL-2 DEPTH
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-slate-400">MATCH ENGINE:</span>
              <span className="text-emerald-500 font-bold">&lt; 15ms SUB-FRAME</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-mono text-xs">
            {/* Left: Rapid Order Entry, Order Book Table & Token Summary (6 cols) */}
            <div className="lg:col-span-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  ORDER INPUT (SPEECH / TEXT DATA STREAM):
                </label>
                <input
                  type="text"
                  value={textInput}
                  onChange={e => {
                    setTextInput(e.target.value);
                    setSelectedGlossIndex(0);
                  }}
                  placeholder="Enter order text..."
                  className={`w-full border px-4 py-3 rounded-xl font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] shadow-sm font-semibold transition-all ${
                    isDark
                      ? 'bg-black/50 border-white/15 text-white placeholder-slate-500'
                      : 'bg-white border-slate-300 text-slate-950 placeholder-slate-400'
                  }`}
                />
              </div>

              {/* Quick Preset Order Pills */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Hello friend, nice to meet you',
                  'Every gesture deserves to be heard',
                  'What time does our meeting begin?',
                  'Thank you for supporting accessibility'
                ].map(phrase => (
                  <button
                    key={phrase}
                    onClick={() => {
                      setTextInput(phrase);
                      setSelectedGlossIndex(0);
                    }}
                    className={`text-[10px] font-mono px-3 py-1 rounded-md border cursor-pointer transition-colors ${
                      isDark
                        ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/15'
                        : 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200'
                    }`}
                  >
                    "{phrase}"
                  </button>
                ))}
              </div>

              {/* Order Book Table (Styled like Level-2 Financial Order Ledger) */}
              <div className={`rounded-xl border overflow-hidden ${
                isDark ? 'bg-black/40 border-white/10' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between p-2.5 bg-black/10 dark:bg-white/5 text-[10px] font-bold text-slate-400 uppercase border-b border-slate-200 dark:border-white/10">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>LEVEL-2 DISCOURSE BOOK</span>
                  </div>
                  <button
                    onClick={() => setAutoAnimateTokens(!autoAnimateTokens)}
                    className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                      autoAnimateTokens
                        ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                        : 'bg-black/10 dark:bg-white/10 text-slate-400'
                    }`}
                  >
                    {autoAnimateTokens ? (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>AUTO-INSPECT ON</span>
                      </>
                    ) : (
                      <span>AUTO-INSPECT OFF</span>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-12 p-2.5 bg-black/5 dark:bg-white/[0.02] text-[10px] font-bold text-slate-400 uppercase border-b border-slate-200 dark:border-white/10">
                  <div className="col-span-6 sm:col-span-3">TOKEN [TICKER]</div>
                  <div className="hidden sm:block sm:col-span-3">SPATIAL LOCUS</div>
                  <div className="hidden md:block md:col-span-3">ROLE [CLASS]</div>
                  <div className="col-span-6 sm:col-span-6 md:col-span-3 text-right">SIZE [TIMING]</div>
                </div>

                <div className="divide-y divide-slate-200 dark:divide-white/5 max-h-48 overflow-y-auto">
                  {generatedGlosses.map((item, idx) => {
                    const isSelected = selectedGlossIndex === idx;
                    return (
                      <button
                        key={`${item.token}-${idx}`}
                        onClick={() => setSelectedGlossIndex(idx)}
                        className={`w-full grid grid-cols-12 p-2.5 text-left items-center cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-amber-500/20 text-[#D4AF37] font-bold'
                            : 'hover:bg-black/5 dark:hover:bg-white/5'
                        }`}
                      >
                        <div className="col-span-6 sm:col-span-3 font-mono font-bold text-[#D4AF37]">
                          [{item.token}]
                        </div>
                        <div className="hidden sm:block sm:col-span-3 text-slate-600 dark:text-slate-300 truncate">
                          {item.spatial}
                        </div>
                        <div className="hidden md:block md:col-span-3 text-slate-500">
                          {item.type}
                        </div>
                        <div className="col-span-6 sm:col-span-6 md:col-span-3 text-right text-emerald-600 dark:text-emerald-400 font-bold">
                          {item.duration}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Inspected Token Micro-Strip */}
              <div className={`p-3.5 rounded-xl border flex flex-wrap items-center justify-between gap-3 text-xs ${
                isDark ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'
              }`}>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">ACTIVE DISCOURSE REFERENT</span>
                  <span className="font-mono font-bold text-sm text-[#D4AF37]">[{activeGloss.token}]</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">SPATIAL LOCUS</span>
                  <span className="font-bold">{activeGloss.spatial}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">SYNTACTIC FILL</span>
                  <span className="text-emerald-500 font-bold">99.4% MATCH</span>
                </div>
              </div>
            </div>

            {/* Right: 3D Spatial Avatar Container with Mouse Movement Parallax (6 cols) */}
            <div className="lg:col-span-6">
              <SpatialAvatarContainer
                currentGesture={avatarGesture}
                activeToken={activeGloss.token}
                spatialLocus={activeGloss.spatial}
                syntacticRole={activeGloss.type}
              />
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* =========================================================================
          SECTION 3: 60 FPS VISION RECOGNITION
          Styled as an HFT Quantitative Landmark Telemetry Terminal
          ========================================================================= */}
      <motion.section
        id="vision-pipeline"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.12 }}
        variants={swissSectionVariants}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        {/* Swiss Grid Modular Header Marker */}
        <motion.div
          variants={swissItemVariants}
          className="flex items-center justify-between pb-3 text-[10px] font-sf-compact font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 border-b border-black/10 dark:border-white/10 mb-6"
        >
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#00E5FF]" />
            <span>SWISS GRID: 12-COL // MODULAR BASELINE</span>
          </div>
          <span>SEC_03 &bull; 60 FPS VISION TELEMETRY</span>
        </motion.div>

        <motion.div
          variants={swissItemVariants}
          className={`rounded-2xl p-6 sm:p-8 backdrop-blur-3xl border shadow-xl space-y-6 transition-all ${
            isDark ? 'bg-[#0E121B]/85 border-white/15 text-white' : 'bg-white/95 border-slate-300 text-slate-950 shadow-md'
          }`}
        >
          {/* HFT Terminal Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-300 dark:border-white/10 font-mono text-xs">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded bg-cyan-500/20 text-[#00E5FF] font-bold uppercase">
                SENSOR: RGB-CAM01
              </span>
              <span className="font-serif font-bold text-lg sm:text-xl uppercase tracking-tight">
                HFT LANDMARK EXTRACTION TERMINAL
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-emerald-500 font-bold">FEED: 60.00 FPS NATIVE</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-mono text-xs">
            {/* Time & Sales Live Trade Stream */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase font-bold px-1">
                <span>TIME &amp; SALES (LIVE GESTURE TICKER STREAM)</span>
                <span>STATUS: EXECUTING</span>
              </div>

              <div className={`rounded-xl border overflow-hidden ${
                isDark ? 'bg-black/40 border-white/10' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="grid grid-cols-12 p-2.5 bg-black/10 dark:bg-white/5 text-[10px] font-bold text-slate-400 uppercase border-b border-slate-200 dark:border-white/10">
                  <div className="col-span-3">TIMESTAMP</div>
                  <div className="col-span-4">TOKEN [GESTURE]</div>
                  <div className="col-span-3">CONFIDENCE</div>
                  <div className="col-span-2 text-right">ACTION</div>
                </div>

                <div className="divide-y divide-slate-200 dark:divide-white/5">
                  {liveGestures.map((row, idx) => (
                    <div key={`${row.time}-${idx}`} className="grid grid-cols-12 p-2.5 items-center">
                      <div className="col-span-3 text-slate-500">{row.time}</div>
                      <div className="col-span-4 font-mono font-bold text-[#D4AF37]">
                        [{row.token}]
                      </div>
                      <div className="col-span-3 flex items-center gap-1 font-bold">
                        <span>{row.conf}</span>
                        <span className={`text-[10px] ${row.buy ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {row.delta}
                        </span>
                      </div>
                      <div className="col-span-2 text-right">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                          FILLED
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Instant Algorithmic Execution Pad */}
            <div className="lg:col-span-5 space-y-4">
              <div className={`p-4 rounded-xl border space-y-3 ${
                isDark ? 'bg-black/40 border-white/10' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="text-[10px] text-slate-400 uppercase font-bold">INSTANT EXECUTION PAD</div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { token: 'THANK_YOU', conf: 99.2 },
                    { token: 'PLEASE', conf: 97.8 },
                    { token: 'WELCOME', conf: 98.4 },
                    { token: 'HELP_ME', conf: 99.1 },
                  ].map(g => (
                    <button
                      key={g.token}
                      onClick={() => {
                        setCvActiveToken(g.token);
                        setCvConfidence(g.conf);
                        handleTestSpeech(g.token.replace(/_/g, ' '));
                      }}
                      className={`p-3 rounded-lg border text-left font-mono font-bold transition-all cursor-pointer ${
                        cvActiveToken === g.token
                          ? 'bg-[#00E5FF]/20 text-[#00E5FF] border-[#00E5FF]'
                          : isDark
                            ? 'bg-white/5 border-white/10 hover:bg-white/10'
                            : 'bg-white border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      <div className="text-[11px] font-mono font-bold">[{g.token}]</div>
                      <div className="text-[10px] text-emerald-500 font-normal mt-0.5">BUY &bull; {g.conf}%</div>
                    </button>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
                  <span className="text-slate-500">Latency:</span>
                  <span className="text-[#00E5FF] font-bold">12.4ms (TENSOR RT)</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* =========================================================================
          SECTION 4: SYNCHRONOUS DIALOGUE BRIDGE
          Styled as a Bilateral Clearing House & Cross-Swap Settlement Terminal
          ========================================================================= */}
      <motion.section
        id="dialogue-bridge"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.12 }}
        variants={swissSectionVariants}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        {/* Swiss Grid Modular Header Marker */}
        <motion.div
          variants={swissItemVariants}
          className="flex items-center justify-between pb-3 text-[10px] font-sf-compact font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 border-b border-black/10 dark:border-white/10 mb-6"
        >
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#FF6F61]" />
            <span>SWISS GRID: 12-COL // MODULAR BASELINE</span>
          </div>
          <span>SEC_04 &bull; BILATERAL CLEARING MATRIX</span>
        </motion.div>

        <motion.div
          variants={swissItemVariants}
          className={`rounded-2xl p-6 sm:p-8 backdrop-blur-3xl border shadow-xl space-y-6 transition-all ${
            isDark ? 'bg-[#0E121B]/85 border-white/15 text-white' : 'bg-white/95 border-slate-300 text-slate-950 shadow-md'
          }`}
        >
          {/* Clearing House Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-300 dark:border-white/10 font-mono text-xs">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded bg-rose-500/20 text-[#FF6F61] font-bold uppercase">
                CLEARING: DUPLEX 2-WAY
              </span>
              <span className="font-serif font-bold text-lg sm:text-xl uppercase tracking-tight">
                BILATERAL SETTLEMENT &amp; CROSS-SWAP MATRIX
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setAutoAnimateDialogue(!autoAnimateDialogue)}
                className={`px-3 py-2 rounded-xl border text-xs font-sans font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  autoAnimateDialogue
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-600 dark:text-emerald-400'
                    : isDark
                      ? 'bg-white/10 border-white/20 text-slate-400 hover:text-white'
                      : 'bg-slate-100 border-slate-300 text-slate-600'
                }`}
              >
                {autoAnimateDialogue ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <Pause className="w-3.5 h-3.5" />
                    <span>AUTO-ADVANCING</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>PAUSED</span>
                  </>
                )}
              </button>
              <button
                onClick={handleNextDialogueStep}
                className={`px-3 sm:px-4 py-2 rounded-xl border text-xs font-sans font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isDark ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>BLOCK {dialogueStep + 1}/4</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
            {/* Channel A Ledger */}
            <div className={`p-5 rounded-xl border space-y-3 ${
              isDark ? 'bg-black/40 border-white/10' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-[#FF6F61] font-mono font-bold">CHANNEL A &bull; VOICE INGESTION</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-500 text-[10px] font-bold">
                  MATCHED
                </span>
              </div>
              <div className="p-3 rounded bg-black/10 dark:bg-black/30 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase block">Speech Input String:</span>
                <p className="text-sm font-sans font-bold">"{conversationDialogue[dialogueStep].text}"</p>
              </div>
              <div className="p-3 rounded bg-black/10 dark:bg-black/30 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase block">Synthesized Gloss Order:</span>
                <p className="text-xs font-bold text-[#D4AF37]">{conversationDialogue[dialogueStep].gloss}</p>
              </div>
            </div>

            {/* Channel B Ledger */}
            <div className={`p-5 rounded-xl border space-y-3 ${
              isDark ? 'bg-black/40 border-white/10' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-[#00E5FF] font-mono font-bold">CHANNEL B &bull; KINEMATIC CAMERA</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-500 text-[10px] font-bold">
                  SETTLED
                </span>
              </div>
              <div className="p-3 rounded bg-black/10 dark:bg-black/30 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase block">Camera Kinematic Gesture:</span>
                <p className="text-xs font-bold text-cyan-400">{conversationDialogue[dialogueStep].gloss}</p>
              </div>
              <div className="p-3 rounded bg-black/10 dark:bg-black/30 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase block">Audio Vocal Output:</span>
                <p className="text-sm font-sans font-bold text-emerald-600 dark:text-emerald-400">"{conversationDialogue[dialogueStep].text}"</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* =========================================================================
          SECTION 5: 7-LANGUAGE GLOBAL ACCESSIBILITY GRID
          Styled as a Global FX Currency Exchange Board
          ========================================================================= */}
      <motion.section
        id="accessibility"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.12 }}
        variants={swissSectionVariants}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        {/* Swiss Grid Modular Header Marker */}
        <motion.div
          variants={swissItemVariants}
          className="flex items-center justify-between pb-3 text-[10px] font-sf-compact font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 border-b border-black/10 dark:border-white/10 mb-6"
        >
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#D4AF37]" />
            <span>SWISS GRID: 12-COL // MODULAR BASELINE</span>
          </div>
          <span>SEC_05 &bull; GLOBAL FX EXCHANGE BOARD</span>
        </motion.div>

        <motion.div
          variants={swissItemVariants}
          className={`rounded-2xl p-6 sm:p-8 backdrop-blur-3xl border shadow-xl space-y-6 transition-all ${
            isDark ? 'bg-[#0E121B]/85 border-white/15 text-white' : 'bg-white/95 border-slate-300 text-slate-950 shadow-md'
          }`}
        >
          {/* FX Board Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-300 dark:border-white/10 font-mono text-xs">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded bg-[#D4AF37]/20 text-[#D4AF37] font-bold uppercase">
                GLOBAL FX INDICES
              </span>
              <span className="font-serif font-bold text-lg sm:text-xl uppercase tracking-tight">
                MULTI-LINGUAL CURRENCY EXCHANGE BOARD
              </span>
            </div>
            <span className="text-slate-400 font-bold">
              WCAG 2.2 AA &bull; RTL COMPLIANT
            </span>
          </div>

          {/* 7 Currency Quote Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 font-mono text-xs">
            {[
              { code: 'en', pair: 'EN/USD', lang: 'English', native: 'English', delta: '+0.2%' },
              { code: 'hi', pair: 'HI/INR', lang: 'Hindi', native: 'हिन्दी', delta: '+0.5%' },
              { code: 'ta', pair: 'TA/INR', lang: 'Tamil', native: 'தமிழ்', delta: '+0.3%' },
              { code: 'te', pair: 'TE/INR', lang: 'Telugu', native: 'తెలుగు', delta: '+0.4%' },
              { code: 'kn', pair: 'KN/INR', lang: 'Kannada', native: 'ಕನ್ನಡ', delta: '+0.2%' },
              { code: 'ml', pair: 'ML/INR', lang: 'Malayalam', native: 'മലയാളം', delta: '+0.3%' },
              { code: 'ur', pair: 'UR/PKR', lang: 'Urdu', native: 'اردو', delta: '+0.6%' },
            ].map(item => {
              const isSelected = language === item.code;
              return (
                <button
                  key={item.lang}
                  onClick={() => setLanguage(item.code as SupportedLanguage)}
                  className={`p-3.5 rounded-xl text-left transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-amber-500/20 border-[#D4AF37] shadow-lg scale-102'
                      : isDark
                        ? 'bg-black/30 border-white/10 hover:bg-white/5'
                        : 'bg-slate-50 border-slate-200 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400">{item.pair}</span>
                    <span className="text-[10px] text-emerald-500 font-bold">{item.delta}</span>
                  </div>
                  <div className="font-display font-extrabold text-sm sm:text-base text-slate-950 dark:text-white mt-1">
                    {item.native}
                  </div>
                  <div className="text-[10px] font-bold text-[#D4AF37] mt-0.5">{item.lang}</div>
                </button>
              );
            })}
          </div>
        </motion.div>
      </motion.section>


      {/* =========================================================================
          ABOVE THE FOOTER: WAITLIST / COMING SOON SECTION
          Uses ONLY FROSTED GLASS with defined edges with background video only!
          ========================================================================= */}
      <motion.section
        id="waitlist"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.12 }}
        variants={swissSectionVariants}
        className="relative w-full py-28 overflow-hidden"
      >
        {/* Amber Radiant Glow Trail over Background Video */}
        <div className="absolute top-[25%] left-1/2 -translate-x-1/2 w-[520px] h-[320px] bg-gradient-to-tr from-[#FF6F3C]/35 via-[#FF9A3C]/25 to-transparent rounded-full filter blur-[75px] pointer-events-none opacity-80 animate-pulse" />

        {/* Swiss Grid Modular Header Marker */}
        <motion.div
          variants={swissItemVariants}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-6"
        >
          <div className="flex items-center justify-between pb-3 text-[10px] font-sf-compact font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 border-b border-black/10 dark:border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#FF9A3C]" />
              <span>SWISS GRID: 12-COL // MODULAR BASELINE</span>
            </div>
            <span>SEC_06 &bull; PRIORITY ACCESS LEDGER</span>
          </div>
        </motion.div>

        {/* Content Container */}
        <motion.div variants={swissItemVariants} className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Top Waitlist Pill */}
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full backdrop-blur-xl border text-xs font-sans font-semibold shadow-lg ${
            isDark ? 'bg-white/[0.08] border-white/20 text-neutral-200' : 'bg-white/80 border-slate-300 text-slate-800'
          }`}>
            <span className="w-2 h-2 rounded-full bg-[#FF9A3C]" />
            <span>Waitlist</span>
          </div>

          {/* Massive Display Title */}
          <h2 className={`text-5xl sm:text-7xl md:text-8xl font-serif font-black tracking-tight leading-none drop-shadow-md ${
            isDark ? 'text-white' : 'text-slate-950'
          }`}>
            Coming soon!
          </h2>

          {/* Central Frosted Glass Card with Defined Edges */}
          <div className={`relative max-w-xl mx-auto rounded-3xl p-8 sm:p-12 text-center backdrop-blur-3xl border shadow-2xl space-y-6 glow-border-amber ${
            isDark
              ? 'bg-[#121622]/80 border-white/20 text-white shadow-[0_25px_60px_rgba(0,0,0,0.6)]'
              : 'bg-white/90 border-slate-300 text-slate-950 shadow-[0_25px_50px_rgba(0,0,0,0.12)]'
          }`}>
            <div className="space-y-2">
              <h3 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">
                Join our waitlist!
              </h3>
              <p className={`text-xs sm:text-sm font-sans font-medium max-w-sm mx-auto leading-relaxed ${
                isDark ? 'text-neutral-200' : 'text-slate-700'
              }`}>
                Sign up for our newsletter to receive the latest updates and insights straight to your inbox.
              </p>
            </div>

            {/* Email Form */}
            {!waitlistJoined ? (
              <form onSubmit={handleWaitlistSubmit} className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <input
                  type="email"
                  required
                  value={waitlistEmail}
                  onChange={e => setWaitlistEmail(e.target.value)}
                  placeholder="Enter email"
                  className={`w-full sm:flex-1 rounded-full border px-5 py-3.5 text-xs focus:outline-none backdrop-blur-sm transition-all font-mono font-medium ${
                    isDark
                      ? 'bg-black/50 border-white/25 text-white placeholder-neutral-400 focus:border-white/60'
                      : 'bg-white border-slate-300 text-slate-950 placeholder-slate-400 focus:border-amber-500'
                  }`}
                />
                <button
                  type="submit"
                  className={`w-full sm:w-auto rounded-full font-sans font-semibold tracking-wider text-xs px-7 py-3.5 transition-all cursor-pointer whitespace-nowrap shadow-md hover:scale-105 ${
                    isDark
                      ? 'bg-white text-black shadow-[0_0_25px_rgba(255,255,255,0.7)] hover:shadow-[0_0_35px_rgba(255,255,255,0.95)]'
                      : 'bg-slate-950 text-white shadow-[0_4px_16px_rgba(15,23,42,0.3)] hover:bg-slate-800'
                  }`}
                >
                  Join Waitlist
                </button>
              </form>
            ) : (
              <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-800 dark:text-emerald-300 text-xs font-mono flex items-center justify-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>You are on the HASTIVO priority access list!</span>
              </div>
            )}
          </div>

          {/* Large Hollow Watermark Typography (Strictly "HASTIVO" with PACT Media Serif) */}
          <div className="relative pt-10 pb-4 select-none pointer-events-none">
            <div className={`font-serif font-black text-6xl sm:text-8xl md:text-9xl lg:text-[140px] tracking-tight text-stroke-hollow leading-none ${
              isDark ? 'opacity-30' : 'opacity-20'
            }`}>
              HASTIVO
            </div>
          </div>

          {/* Clean Unboxed Footer Ribbon (No card container) */}
          <div className={`pt-6 border-t flex flex-col sm:flex-row items-center justify-between text-[11px] font-sans gap-3 ${
            isDark ? 'border-white/10 text-neutral-400' : 'border-slate-300 text-slate-600'
          }`}>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
              <span>&copy; 2026 HASTIVO &bull; “Every Gesture Deserves to Be Heard.”</span>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-sans font-medium">
              <button
                onClick={() => scrollTo('hero')}
                className="hover:text-amber-500 transition-colors cursor-pointer"
              >
                TOP
              </button>
              <span>&bull;</span>
              <span>ISL / ASL / BSL</span>
              <span>&bull;</span>
              <span>60 FPS ZERO-SENSOR</span>
              <span>&bull;</span>
              <span>WCAG 2.2 AA</span>
            </div>
          </div>
        </motion.div>
      </motion.section>
    </div>
  );
};
