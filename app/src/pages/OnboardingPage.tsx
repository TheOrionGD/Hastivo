import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  X,
  Globe,
  Sparkles,
  MessageSquare,
  Video,
  Volume2,
  Shield,
  Layers,
  Compass,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { useTheme, SupportedLanguage, LANGUAGE_METADATA } from '../context/ThemeContext';
import {
  PerCharacterRise,
  PerWordCrossfade,
  ShineText,
  ScrambleHover,
  RevealText,
} from '../components/ui/smoothui';

interface OnboardingStepData {
  id: number;
  title: string;
  tagline: string;
  category: string;
  description: string;
  highlights: string[];
  features: { label: string; detail: string }[];
  illustrationTheme: {
    accent: string;
    badge: string;
    visualVariant: 'swiss-grid' | 'neural-flow' | 'camera-vision' | 'kinematics' | 'duplex-chat' | 'vault-security' | 'launch-pad';
  };
}

const ONBOARDING_STORAGE_KEY = 'hastivo_onboarding_completed';

const FETCHED_ONBOARDING_CONTENT: OnboardingStepData[] = [
  {
    id: 1,
    title: 'Welcome to Hastivo',
    tagline: 'Bridging Sign Language & Spoken Words',
    category: 'Getting Started',
    description:
      'Hastivo is a friendly, accessible platform created to make conversations effortless between Deaf, hard-of-hearing, and hearing individuals. Everything is designed to be clear, comfortable, and easy to use.',
    highlights: [
      'Simple, card-free layout that keeps text and signing front and center',
      'High-contrast, easy-to-read colors designed for all eyes and lighting',
      'Instant two-way translation between everyday speech, text, and sign language'
    ],
    features: [
      { label: 'Clean & Easy Reading', detail: 'Spacious, readable lettering designed so you never feel lost or overwhelmed' },
      { label: 'Gentle on the Eyes', detail: 'Thoughtfully tested colors that stay comfortable in dark or bright rooms' },
      { label: 'Instant Responses', detail: 'Translates signs and words smoothly in real time without lag' }
    ],
    illustrationTheme: {
      accent: 'var(--brand-coral, #FF6F61)',
      badge: 'GUIDE 01 / WELCOME OVERVIEW',
      visualVariant: 'swiss-grid'
    }
  },
  {
    id: 2,
    title: 'Turn Words into Real Sign Language',
    tagline: 'Natural Sentence Structure, Not Word-for-Word',
    category: 'Text to Sign',
    description:
      'Type or speak what you want to say, and Hastivo converts it into authentic sign language. Natural sign languages use their own grammar and word order, so we arrange phrases properly so Deaf signers feel completely at home.',
    highlights: [
      'Arranges words into natural sign grammar (Topic first, then detail)',
      'Highlights and explains any rare words clearly on screen',
      'Supports Indian Sign Language (ISL), American (ASL), and British (BSL)'
    ],
    features: [
      { label: 'Natural Grammar', detail: 'Reorders spoken sentences into the natural flow used by Deaf communities' },
      { label: 'Clear Hand Directions', detail: 'Makes sure gestures point in the right directions for people and places' },
      { label: 'Smooth Pacing', detail: 'Times each gesture naturally so signs are comfortable to follow' }
    ],
    illustrationTheme: {
      accent: 'var(--brand-blue, #6FA3EF)',
      badge: 'GUIDE 02 / WORDS TO SIGNS',
      visualVariant: 'neural-flow'
    }
  },
  {
    id: 3,
    title: 'Translate Signs Using Any Webcam',
    tagline: 'No Special Gloves or Costly Equipment',
    category: 'Sign to Text & Speech',
    description:
      'Simply stand or sit in front of your regular phone or computer webcam. As you sign with your hands, Hastivo recognizes the gestures and immediately turns them into written text and clear spoken voice.',
    highlights: [
      'Works with standard built-in cameras on laptops, phones, or tablets',
      'Accurately follows hand, finger, and wrist movements as you move',
      'Speaks the translation aloud so hearing partners can listen with ease'
    ],
    features: [
      { label: 'Finger & Hand Tracking', detail: 'Tracks all fingertips and joints accurately in regular room lighting' },
      { label: 'Steady & Reliable', detail: 'Prevents flickering or jumping even if your hands move quickly' },
      { label: 'Reads Aloud Clearly', detail: 'Speaks the translated sentences naturally through your speakers' }
    ],
    illustrationTheme: {
      accent: 'var(--brand-yellow, #FFC107)',
      badge: 'GUIDE 03 / WEBCAM TRANSLATION',
      visualVariant: 'camera-vision'
    }
  },
  {
    id: 4,
    title: 'Expressive Digital Signing Partner',
    tagline: 'Life-Like Hand Movements & Facial Expressions',
    category: 'Signing Character',
    description:
      'In sign language, facial expressions and head tilts are just as important as hands—they ask questions and show emotion. Our digital signer moves with natural, lifelike gestures and friendly facial expressions.',
    highlights: [
      'Fluid, human-like motion without robotic or stiff stops',
      'Raises eyebrows for questions and shows friendly, natural expressions',
      'Adjust the signing speed anytime (slower to learn, faster for fluency)'
    ],
    features: [
      { label: 'Lifelike Movement', detail: 'Hands and arms transition smoothly from one sign to the next' },
      { label: 'Facial Expressions', detail: 'Shows questions, surprise, and emphasis using authentic facial cues' },
      { label: 'Speed Controls', detail: 'Slow down animations whenever you want to learn a gesture step-by-step' }
    ],
    illustrationTheme: {
      accent: 'var(--brand-coral, #FF6F61)',
      badge: 'GUIDE 04 / DIGITAL SIGNER',
      visualVariant: 'kinematics'
    }
  },
  {
    id: 5,
    title: 'Have Live, Real-Time Conversations',
    tagline: 'Speak and Sign Back and Forth Naturally',
    category: 'Two-Way Chat',
    description:
      'Talk with friends, colleagues, or family without taking turns pausing. One person can speak into the microphone while the other signs on camera—both see and hear the translation instantly.',
    highlights: [
      'Both people can communicate at the same time without waiting',
      'Live written chat history so neither person misses a word',
      'Easily start a conversation with a quick link or room code'
    ],
    features: [
      { label: 'Continuous Flow', detail: 'Keeps going smoothly without interrupting the call or losing your place' },
      { label: 'Clear Conversation Log', detail: 'Saves a neat transcript showing who said or signed what' },
      { label: 'Simple Pairing', detail: 'Share a quick invite code to connect two devices in seconds' }
    ],
    illustrationTheme: {
      accent: 'var(--brand-blue, #6FA3EF)',
      badge: 'GUIDE 05 / TWO-WAY CONVERSATION',
      visualVariant: 'duplex-chat'
    }
  },
  {
    id: 6,
    title: 'Your Privacy Always Comes First',
    tagline: 'Your Camera and Conversations Belong to You',
    category: 'Safety & Privacy',
    description:
      'We never save or upload your raw camera videos anywhere. Your camera simply helps detect gestures right on your device, and you have complete freedom to export or erase your history at any moment.',
    highlights: [
      'Camera video stays on your own screen and is never stored on servers',
      'Download your conversation history anytime as simple text or notes',
      'Built-in safety protections and a one-click button to delete all history'
    ],
    features: [
      { label: 'Private Video Feed', detail: 'Webcam images are checked locally and discarded immediately' },
      { label: 'You Own Your Data', detail: 'Only you can view, download, or review your conversation records' },
      { label: 'One-Click Clear', detail: 'Permanently remove your history whenever you decide' }
    ],
    illustrationTheme: {
      accent: 'var(--brand-yellow, #FFC107)',
      badge: 'GUIDE 06 / PRIVACY & CONTROL',
      visualVariant: 'vault-security'
    }
  },
  {
    id: 7,
    title: 'You Are All Set to Start Signing!',
    tagline: 'Explore Workspaces in Your Preferred Language',
    category: 'Ready to Go',
    description:
      'You are ready to experience seamless sign language translation. Pick your preferred everyday language, test the live camera, or start exploring right away.',
    highlights: [
      'Works smoothly on smartphones, tablets, laptops, and desktop computers',
      'Available in 7 languages including Hindi, Tamil, Telugu, and Urdu',
      'Start exploring immediately—no credit card or complicated setup needed'
    ],
    features: [
      { label: 'Instant Access', detail: 'Jump straight into translation or learning workspaces without delay' },
      { label: '7 Native Languages', detail: 'Switch between English, Hindi, Tamil, Telugu, Kannada, Malayalam, and Urdu' },
      { label: 'Saves Your Progress', detail: 'Remembers your language choice and completed guide status automatically' }
    ],
    illustrationTheme: {
      accent: 'var(--brand-coral, #FF6F61)',
      badge: 'GUIDE 07 / READY TO COMMUNICATE',
      visualVariant: 'launch-pad'
    }
  }
];

// Architectural Graphic Illustration Component
const OnboardingGraphicIllustration: React.FC<{
  variant: OnboardingStepData['illustrationTheme']['visualVariant'];
  accent: string;
  badge: string;
  stepId: number;
}> = ({ variant, accent, badge, stepId }) => {
  return (
    <div className="w-full h-full min-h-[380px] lg:min-h-[460px] relative p-6 sm:p-8 flex flex-col justify-between overflow-hidden bg-[var(--surface-elevated,#f8f9fa)] border border-[var(--border,#D1CFCF)]">
      {/* Background Architectural Grid Lines */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}
      />

      {/* Top Graphic Meta Tag */}
      <div className="relative z-10 flex items-center justify-between border-b border-[var(--border,#D1CFCF)] pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accent }} />
          <span className="font-mono text-[11px] tracking-wider uppercase text-[var(--text-muted,#4B5563)] font-semibold">
            {badge}
          </span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted,#4B5563)]">
          STEP 0{stepId}
        </span>
      </div>

      {/* Central Conceptual Graphic / Diagram */}
      <div className="relative z-10 my-auto py-6 flex items-center justify-center">
        {variant === 'swiss-grid' && (
          <div className="w-full max-w-sm space-y-3 font-sans">
            <div className="border border-[var(--border,#D1CFCF)] p-4 bg-[var(--surface,#ffffff)] shadow-sm">
              <div className="flex items-center justify-between pb-2 border-b border-[var(--border,#D1CFCF)]">
                <span className="font-serif text-sm font-bold text-[var(--text-primary)]">HASTIVO AT A GLANCE</span>
                <span className="font-mono text-[10px] text-emerald-600 font-bold">READY TO USE</span>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-3">
                <div className="h-16 border border-dashed border-[var(--border)] flex flex-col justify-between p-2 bg-[var(--surface-elevated)]">
                  <span className="font-mono text-[10px] text-[var(--brand-coral,#FF6F61)] font-bold">SPEAK / TYPE</span>
                  <span className="text-[10px] text-[var(--text-secondary)] font-sans leading-tight">Your Words</span>
                </div>
                <div className="h-16 border border-dashed border-[var(--border)] flex flex-col justify-between p-2 bg-[var(--surface-elevated)]">
                  <span className="font-mono text-[10px] text-[var(--brand-blue,#6FA3EF)] font-bold">TRANSLATE</span>
                  <span className="text-[10px] text-[var(--text-secondary)] font-sans leading-tight">Smart Bridge</span>
                </div>
                <div className="h-16 border border-dashed border-[var(--border)] flex flex-col justify-between p-2 bg-[var(--surface-elevated)]">
                  <span className="font-mono text-[10px] text-[var(--brand-yellow,#FFC107)] font-bold">SIGN ALIVE</span>
                  <span className="text-[10px] text-[var(--text-secondary)] font-sans leading-tight">Clear Gestures</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between font-mono text-[10px] text-[var(--text-secondary)] px-1">
              <span>DESIGNED FOR EVERYONE</span>
              <span>SIMPLE & ACCESSIBLE</span>
            </div>
          </div>
        )}

        {variant === 'neural-flow' && (
          <div className="w-full max-w-sm space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1 p-2.5 border border-[var(--border)] bg-[var(--surface)] text-center">
                <span className="font-mono text-[9px] uppercase text-[var(--text-muted)] block font-semibold">1. Spoken Word</span>
                <span className="font-serif text-xs font-semibold text-[var(--text-primary)]">"I am going home"</span>
              </div>
              <ArrowRight className="w-4 h-4 text-[var(--brand-blue,#6FA3EF)] shrink-0" />
              <div className="flex-1 p-2.5 border border-[var(--brand-blue,#6FA3EF)] bg-[var(--surface)] text-center shadow-sm">
                <span className="font-mono text-[9px] uppercase text-[var(--brand-blue,#6FA3EF)] font-bold block">2. Smart Reorder</span>
                <span className="font-serif text-xs font-bold text-[var(--text-primary)]">Sign Grammar</span>
              </div>
              <ArrowRight className="w-4 h-4 text-[var(--brand-blue,#6FA3EF)] shrink-0" />
              <div className="flex-1 p-2.5 border border-[var(--border)] bg-[var(--surface)] text-center">
                <span className="font-mono text-[9px] uppercase text-[var(--text-muted)] block font-semibold">3. Animated Sign</span>
                <span className="font-serif text-xs font-semibold text-[var(--text-primary)]">[HOME] [ME] [GO]</span>
              </div>
            </div>
            <div className="p-3 border border-[var(--border)] bg-[var(--surface)]/80 text-[11px] font-sans text-[var(--text-secondary)] space-y-1">
              <div className="flex justify-between font-mono text-[10px]">
                <span className="text-[var(--text-muted)]">EXAMPLE CONVERSION:</span>
                <span className="text-emerald-600 font-bold">ACCURATE & NATURAL</span>
              </div>
              <p className="text-xs text-[var(--text-primary)]">
                Words are automatically reordered into natural sign grammar so Deaf signers understand instantly.
              </p>
            </div>
          </div>
        )}

        {variant === 'camera-vision' && (
          <div className="w-full max-w-sm space-y-3">
            <div className="relative aspect-video border border-[var(--border)] bg-[var(--surface)] overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 grid grid-cols-4 grid-rows-3 opacity-20 pointer-events-none">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="border border-[var(--border)]" />
                ))}
              </div>
              {/* Landmark Node Wireframe */}
              <div className="relative w-28 h-28 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full border border-dashed border-[var(--brand-yellow,#FFC107)] animate-pulse" />
                <div className="absolute w-2 h-2 rounded-full bg-[var(--brand-yellow,#FFC107)] top-2 left-6" />
                <div className="absolute w-2 h-2 rounded-full bg-[var(--brand-yellow,#FFC107)] top-10 right-4" />
                <div className="absolute w-2.5 h-2.5 rounded-full bg-[var(--brand-coral,#FF6F61)] center" />
                <div className="absolute w-2 h-2 rounded-full bg-[var(--brand-blue,#6FA3EF)] bottom-4 left-8" />
                <div className="absolute w-2 h-2 rounded-full bg-[var(--brand-yellow,#FFC107)] bottom-2 right-8" />
                <span className="font-mono text-[10px] font-bold text-[var(--text-primary)] bg-[var(--surface)] px-2 py-0.5 border border-[var(--border)] shadow-xs">
                  LIVE CAMERA
                </span>
              </div>
              <div className="absolute bottom-2 left-3 right-3 flex justify-between font-mono text-[9px] text-[var(--text-muted)]">
                <span>RECOGNIZING HAND SIGNS</span>
                <span className="text-emerald-600 font-bold">READY TO TRANSLATE</span>
              </div>
            </div>
            <div className="flex items-center justify-between font-mono text-[10px] text-[var(--text-secondary)]">
              <span>USES STANDARD WEBCAMS</span>
              <span>NO SPECIAL EQUIPMENT NEEDED</span>
            </div>
          </div>
        )}

        {variant === 'kinematics' && (
          <div className="w-full max-w-sm space-y-3">
            <div className="p-4 border border-[var(--border)] bg-[var(--surface)] space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[var(--border)] font-mono text-[10px]">
                <span className="text-[var(--text-secondary)]">SIGNING CHARACTER DETAILS</span>
                <span className="text-[var(--brand-coral,#FF6F61)] font-bold">NATURAL MOTION</span>
              </div>
              <div className="space-y-2.5 font-sans">
                <div>
                  <div className="flex justify-between text-[11px] text-[var(--text-muted)] mb-1">
                    <span>Smooth Hand Gestures</span>
                    <span className="font-semibold text-emerald-600">Gentle & Clear</span>
                  </div>
                  <div className="w-full h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--brand-coral,#FF6F61)] w-4/5" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] text-[var(--text-muted)] mb-1">
                    <span>Facial Expressions (Smiles & Questions)</span>
                    <span className="font-semibold text-[var(--brand-blue,#6FA3EF)]">Active</span>
                  </div>
                  <div className="w-full h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--brand-blue,#6FA3EF)] w-full" />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between font-mono text-[10px] text-[var(--text-muted)]">
              <span>HUMAN-LIKE MOVEMENT</span>
              <span>ADJUSTABLE SPEED (SLOW TO FAST)</span>
            </div>
          </div>
        )}

        {variant === 'duplex-chat' && (
          <div className="w-full max-w-sm space-y-2.5">
            <div className="border border-[var(--border)] p-3 bg-[var(--surface)] flex items-start gap-2.5 shadow-xs">
              <div className="w-6 h-6 rounded-full bg-[var(--brand-coral,#FF6F61)] text-white flex items-center justify-center font-mono text-[10px] shrink-0 font-bold">
                A
              </div>
              <div className="space-y-0.5 flex-1">
                <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--text-muted)] block font-semibold">Hearing Person Speaks:</span>
                <p className="text-xs font-sans text-[var(--text-primary)]">"Good morning! How are you doing today?"</p>
                <span className="font-mono text-[9px] text-[var(--brand-coral,#FF6F61)] block font-medium">&rarr; Signs appear on screen instantly</span>
              </div>
            </div>
            <div className="border border-[var(--border)] p-3 bg-[var(--surface)] flex items-start gap-2.5 shadow-xs">
              <div className="w-6 h-6 rounded-full bg-[var(--brand-blue,#6FA3EF)] text-white flex items-center justify-center font-mono text-[10px] shrink-0 font-bold">
                B
              </div>
              <div className="space-y-0.5 flex-1">
                <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--text-muted)] block font-semibold">Deaf Person Signs:</span>
                <p className="text-xs font-sans text-[var(--text-primary)]">[GOOD] [FEEL-HAPPY] [THANK-YOU]</p>
                <span className="font-mono text-[9px] text-[var(--brand-blue,#6FA3EF)] block font-medium">&rarr; Read aloud as speech clearly</span>
              </div>
            </div>
          </div>
        )}

        {variant === 'vault-security' && (
          <div className="w-full max-w-sm space-y-3">
            <div className="p-4 border border-[var(--border)] bg-[var(--surface)] space-y-3 text-center">
              <div className="w-12 h-12 rounded-full border border-[var(--brand-yellow,#FFC107)] bg-[var(--brand-yellow,#FFC107)]/10 flex items-center justify-center mx-auto text-[var(--brand-yellow,#FFC107)]">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif text-sm font-bold text-[var(--text-primary)]">YOUR PRIVACY IS PROTECTED</h4>
                <p className="font-sans text-[11px] text-[var(--text-secondary)] mt-1">
                  Your webcam video stays strictly on your device. We never record your room or save private footage.
                </p>
              </div>
              <div className="pt-2 border-t border-[var(--border)] flex justify-between font-mono text-[9px] text-[var(--text-muted)]">
                <span className="text-emerald-600 font-bold">NO VIDEO UPLOADED</span>
                <span>CLEAR HISTORY ANYTIME</span>
              </div>
            </div>
          </div>
        )}

        {variant === 'launch-pad' && (
          <div className="w-full max-w-sm space-y-3">
            <div className="p-5 border border-[var(--brand-coral,#FF6F61)] bg-[var(--surface)] text-center space-y-3 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-[var(--brand-coral,#FF6F61)] text-white flex items-center justify-center mx-auto shadow-md">
                <Check className="w-6 h-6" />
              </div>
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--brand-coral,#FF6F61)] font-bold block">
                  EVERYTHING IS READY
                </span>
                <h4 className="font-serif text-base font-bold text-[var(--text-primary)] mt-1">
                  Start Connecting Without Boundaries
                </h4>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[var(--border)] font-mono text-[9px] text-[var(--text-secondary)]">
                <div className="p-1 border border-[var(--border)]">7 LANGUAGES</div>
                <div className="p-1 border border-[var(--border)]">FREE WEBCAM</div>
                <div className="p-1 border border-[var(--border)]">EASY TO USE</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Technical Calibration Bar */}
      <div className="relative z-10 pt-3 border-t border-[var(--border,#D1CFCF)] flex items-center justify-between font-mono text-[10px] text-[var(--text-muted,#4B5563)]">
        <span>HASTIVO GUIDE</span>
        <span>EASY & ACCESSIBLE</span>
      </div>
    </div>
  );
};

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { language, setLanguage } = useTheme();

  // Local state for fetched content, current step index, and completion status
  const [steps] = useState<OnboardingStepData[]>(FETCHED_ONBOARDING_CONTENT);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [hasCompletedBefore, setHasCompletedBefore] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);

  // FETCH: Check onboarding completion status from persistent storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(ONBOARDING_STORAGE_KEY);
      if (stored === 'true') {
        setHasCompletedBefore(true);
      }
    } catch {
      // Storage unavailable or blocked
    }
  }, []);

  const totalSteps = steps.length;
  const currentStep = steps[currentStepIndex];
  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === totalSteps - 1;
  const completionPercentage = Math.round(((currentStepIndex + 1) / totalSteps) * 100);

  // INPUT: Completion Action (sets status and navigates to main workspace)
  const handleComplete = () => {
    try {
      localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
    } catch {
      // ignore storage error
    }
    setHasCompletedBefore(true);
    navigate('/');
  };

  // INPUT: Skip Action
  const handleSkip = () => {
    handleComplete();
  };

  // INPUT: Next Action
  const handleNext = () => {
    if (!isLast) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  // INPUT: Previous Action
  const handlePrevious = () => {
    if (!isFirst) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  // Keyboard Navigation: Left / Right arrows
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        if (!isLast) setCurrentStepIndex(prev => prev + 1);
      } else if (e.key === 'ArrowLeft') {
        if (!isFirst) setCurrentStepIndex(prev => prev - 1);
      } else if (e.key === 'Escape') {
        navigate('/');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFirst, isLast, navigate]);

  return (
    <div
      className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between p-6 sm:p-12 z-10 bg-[var(--background,#ffffff)] text-[var(--text-primary,#111827)] transition-colors"
      style={{ fontFamily: "'Lato', sans-serif" }}
    >
      {/* TOP HEADER: Progress Indicator, Status, Language Selection & Skip Controls */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[var(--border,#D1CFCF)] pb-4 gap-4">
        {/* Left: Step counter & status */}
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--brand-coral,#FF6F61)] font-bold">
            STEP {currentStep.id} OF {totalSteps}
          </span>
          <span className="hidden sm:inline-block font-mono text-xs text-[var(--text-muted,#4B5563)] border-l border-[var(--border,#D1CFCF)] pl-3">
            {completionPercentage}% COMPLETED
          </span>
          {hasCompletedBefore && (
            <span className="hidden md:inline-flex items-center gap-1 font-mono text-[10px] text-emerald-600 border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-none font-semibold">
              <CheckCircle2 className="w-3 h-3" />
              STATUS: PREVIOUSLY COMPLETED
            </span>
          )}
        </div>

        {/* Right: Language selection input & Skip control */}
        <div className="flex items-center gap-4">
          {/* INPUT: Language Selection Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsLanguageMenuOpen(prev => !prev)}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-[var(--border,#D1CFCF)] text-xs font-mono uppercase tracking-wider text-[var(--text-secondary,#374151)] hover:border-[var(--brand-coral,#FF6F61)] transition-colors cursor-pointer bg-[var(--surface,#ffffff)]"
              aria-label="Select Onboarding Language"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-[var(--brand-blue,#6FA3EF)]" />
              <span className="font-bold">{language.toUpperCase()}</span>
              <span className="text-[10px] text-[var(--text-muted,#4B5563)]">
                ({LANGUAGE_METADATA[language]?.label})
              </span>
            </button>

            {isLanguageMenuOpen && (
              <div className="absolute right-0 mt-1 w-48 border border-[var(--border,#D1CFCF)] bg-[var(--surface,#ffffff)] shadow-lg z-50 py-1">
                <div className="px-3 py-1 text-[10px] font-mono uppercase text-[var(--text-muted,#4B5563)] border-b border-[var(--border,#D1CFCF)]">
                  Supported Languages
                </div>
                {(Object.keys(LANGUAGE_METADATA) as SupportedLanguage[]).map(code => (
                  <button
                    key={code}
                    onClick={() => {
                      setLanguage(code);
                      setIsLanguageMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs font-mono flex items-center justify-between hover:bg-[var(--surface-elevated,#f5f6f8)] cursor-pointer ${
                      language === code ? 'text-[var(--brand-coral,#FF6F61)] font-bold' : 'text-[var(--text-secondary,#374151)]'
                    }`}
                  >
                    <span>{LANGUAGE_METADATA[code].label}</span>
                    <span className="text-[11px] font-sans opacity-70">{LANGUAGE_METADATA[code].nativeName}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* INPUT: Skip button */}
          <button
            onClick={handleSkip}
            className="flex items-center gap-1 text-xs font-mono text-[var(--text-secondary,#374151)] hover:text-[var(--brand-coral,#FF6F61)] transition-colors cursor-pointer"
            title="Skip Onboarding"
          >
            <span>Skip Guide</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* DISPLAY: Progress Indicator Bar (Interactive Segmented Timeline) */}
      <div className="my-5">
        <div className="grid grid-cols-7 gap-1.5">
          {steps.map((s, idx) => {
            const isCurrent = idx === currentStepIndex;
            const isPast = idx < currentStepIndex;
            return (
              <button
                key={s.id}
                onClick={() => setCurrentStepIndex(idx)}
                className={`h-2 transition-all cursor-pointer relative group ${
                  isCurrent
                    ? 'bg-[var(--brand-coral,#FF6F61)]'
                    : isPast
                    ? 'bg-[var(--text-primary,#111827)]'
                    : 'bg-[var(--border,#D1CFCF)]'
                }`}
                title={`Step ${s.id}: ${s.title}`}
              >
                <span className="sr-only">Step {s.id}</span>
              </button>
            );
          })}
        </div>
        <div className="flex justify-between items-center mt-2 font-mono text-[10px] text-[var(--text-muted,#4B5563)] uppercase tracking-wider">
          <span>01 / WELCOME</span>
          <span>04 / CHARACTER</span>
          <span>07 / READY</span>
        </div>
      </div>

      {/* MAIN CONTENT SPLIT GRID: Left (Introduction & Explanations) vs Right (Illustration) */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch my-auto py-4">
        {/* LEFT COLUMN: Introduction Text, Typography & Feature Explanations (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
          {/* Category & Tagline Badge */}
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: currentStep.illustrationTheme.accent }} />
            <span className="font-mono text-xs uppercase tracking-widest text-[var(--text-muted,#4B5563)] font-semibold">
              {currentStep.category} &mdash; {currentStep.tagline}
            </span>
          </div>

          {/* Heading with Cormorant Garamond */}
          <h1
            className="text-3xl sm:text-5xl font-semibold tracking-tight text-[var(--text-primary,#111827)] leading-[1.15]"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            <PerWordCrossfade key={`title-${currentStep.id}`} delay={50} stagger={40}>
              {currentStep.title}
            </PerWordCrossfade>
          </h1>

          {/* Introduction Text with Lato Body */}
          <div
            className="text-base sm:text-lg text-[var(--text-secondary,#374151)] leading-relaxed max-w-xl font-normal"
            style={{ fontFamily: "'Lato', sans-serif" }}
          >
            <PerWordCrossfade key={`desc-${currentStep.id}`} delay={120} stagger={25}>
              {currentStep.description}
            </PerWordCrossfade>
          </div>

          {/* DISPLAY: Feature Explanations Grid */}
          <div className="pt-2 border-t border-[var(--border,#D1CFCF)] space-y-3">
            <span className="font-mono text-xs uppercase tracking-wider text-[var(--text-muted,#4B5563)] font-bold block">
              What This Means For You:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {currentStep.features.map((feat, idx) => (
                <div
                  key={idx}
                  className="p-3 border border-[var(--border,#D1CFCF)] bg-[var(--surface-elevated,#f9fafb)] space-y-1"
                >
                  <span className="font-mono text-[11px] font-bold text-[var(--text-primary,#111827)] block">
                    {feat.label}
                  </span>
                  <p className="text-xs text-[var(--text-secondary,#374151)] leading-snug">
                    {feat.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Highlights Checklist */}
          <div className="space-y-2 pt-1">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--text-muted,#4B5563)] block font-semibold">
              Key Highlights:
            </span>
            <ul className="space-y-1.5">
              {currentStep.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[var(--text-primary,#111827)]">
                  <span
                    className="w-1.5 h-1.5 rounded-full mt-2 shrink-0"
                    style={{ backgroundColor: currentStep.illustrationTheme.accent }}
                  />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* RIGHT COLUMN: Graphic Illustration System (Replacing 3D Avatar) (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <OnboardingGraphicIllustration
            variant={currentStep.illustrationTheme.visualVariant}
            accent={currentStep.illustrationTheme.accent}
            badge={currentStep.illustrationTheme.badge}
            stepId={currentStep.id}
          />
        </div>
      </main>

      {/* BOTTOM CONTROLS BAR: Previous, Next, Completion, and Step Summary */}
      <footer className="pt-6 border-t border-[var(--border,#D1CFCF)] flex items-center justify-between gap-4 mt-auto">
        {/* INPUT: Previous Button */}
        <button
          onClick={handlePrevious}
          disabled={isFirst}
          className={`flex items-center gap-2 px-5 py-2.5 text-xs font-mono uppercase tracking-wider border border-[var(--border,#D1CFCF)] transition-colors cursor-pointer ${
            isFirst
              ? 'opacity-30 cursor-not-allowed text-[var(--text-muted,#4B5563)] bg-transparent'
              : 'text-[var(--text-primary,#111827)] hover:border-[var(--brand-coral,#FF6F61)] bg-[var(--surface,#ffffff)]'
          }`}
          aria-label="Previous step"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        {/* Keyboard hint */}
        <span className="hidden sm:inline-block font-mono text-[11px] text-[var(--text-muted,#4B5563)]">
          Navigate with &larr; &rarr; Arrow Keys
        </span>

        {/* INPUT: Next or Complete Button */}
        <div className="flex items-center gap-3">
          {isLast ? (
            <button
              onClick={handleComplete}
              className="px-6 py-2.5 bg-[var(--brand-coral,#FF6F61)] text-white font-mono text-xs uppercase tracking-wider font-semibold flex items-center gap-2 hover:opacity-95 cursor-pointer shadow-sm"
              aria-label="Complete onboarding and start using Hastivo"
            >
              <span>Get Started</span>
              <Check className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-2.5 bg-[var(--text-primary,#111827)] text-[var(--background,#ffffff)] font-mono text-xs uppercase tracking-wider font-semibold flex items-center gap-2 hover:opacity-90 cursor-pointer shadow-sm"
              aria-label="Next step"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </footer>
    </div>
  );
};
