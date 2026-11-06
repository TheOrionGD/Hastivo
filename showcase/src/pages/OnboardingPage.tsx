import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignAvatarScene, GestureType } from '../three/SignAvatarScene';
import { ArrowLeft, ArrowRight, Check, X, Shield, Sparkles, MessageSquare, Video, Volume2 } from 'lucide-react';

interface OnboardingStep {
  id: number;
  title: string;
  tagline: string;
  description: string;
  gesture: GestureType;
  icon: React.ReactNode;
  highlights: string[];
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 1,
    title: 'Platform Introduction',
    tagline: 'Vibrant Connections Through Language Colors',
    description:
      'Signa is an editorial, Swiss Grid-designed platform engineered to eliminate communication barriers between Deaf and hearing individuals using authentic linguistic models.',
    gesture: 'WELCOME',
    icon: <Sparkles className="w-5 h-5 text-[var(--brand-coral)]" />,
    highlights: [
      'Cardless, typography-driven Swiss architecture',
      'Immutable brand palette respecting high accessibility standards',
      'Real-time bi-directional translation pipeline',
    ],
  },
  {
    id: 2,
    title: 'Text-to-Sign Translation',
    tagline: 'Grammatically Authentic Sign Sequencing',
    description:
      'Transform spoken or typed text into canonical sign language glosses. Unlike naive word-for-word translation, Signa restructures sentences to follow authentic Topic-Comment and SOV grammar.',
    gesture: 'GREETING',
    icon: <MessageSquare className="w-5 h-5 text-[var(--brand-blue)]" />,
    highlights: [
      'Token-level duration & spatial locus mapping',
      'Honest identification of unsupported vocabulary',
      'Support for Indian Sign Language (ISL), ASL, and BSL',
    ],
  },
  {
    id: 3,
    title: 'Sign-to-Text Recognition',
    tagline: 'Computer-Vision Landmark Tracking',
    description:
      'Use any standard webcam to translate live physical signs into coherent text and natural synthesized speech, without proprietary sensor gloves.',
    gesture: 'POINT_YOU',
    icon: <Video className="w-5 h-5 text-[var(--brand-yellow)]" />,
    highlights: [
      'Real-time hand and posture skeletal tracking',
      'Sequential sign token buffering',
      'Integrated voice synthesis with male/female pitch controls',
    ],
  },
  {
    id: 4,
    title: '3D Humanoid Avatar',
    tagline: 'Procedural Kinematics & Studio PBR',
    description:
      'Meet your 3D digital ambassador: an articulated 12-part procedural robot with studio PBR reflections, responsive lighting, and ergonomic non-obstructive controls.',
    gesture: 'LOVE',
    icon: <Sparkles className="w-5 h-5 text-[var(--brand-coral)]" />,
    highlights: [
      'Fluid joint articulation with exponential damping',
      'Zero external texture dependencies (100% procedural)',
      'Adjustable speed multipliers (0.75x to 1.25x) and camera angles',
    ],
  },
  {
    id: 5,
    title: 'Real-Time Conversation',
    tagline: 'Dual-Participant Synchronous Dialogue',
    description:
      'Engage in continuous dialogue where Participant A speaks and generates sign animation, while Participant B signs and generates spoken audio simultaneously.',
    gesture: 'COMMUNICATE',
    icon: <Volume2 className="w-5 h-5 text-[var(--brand-blue)]" />,
    highlights: [
      'Independent, non-blocking input/output workflows',
      'Live continuation without accidental session termination',
      'Chronological transcript log with participant tagging',
    ],
  },
  {
    id: 6,
    title: 'History & Privacy First',
    tagline: 'Transparent User-Owned Archive',
    description:
      'All translation sessions, speech transcripts, and sign sequences remain strictly under your control. Search, replay in 3D, export, or permanently delete anytime.',
    gesture: 'HELP',
    icon: <Shield className="w-5 h-5 text-[var(--brand-yellow)]" />,
    highlights: [
      'Full export to structured JSON or clean text formats',
      'Automated content moderation protecting community safety',
      'Strict zero-fake data policy—only real user records are stored',
    ],
  },
  {
    id: 7,
    title: 'Getting Started',
    tagline: 'Ready to Experience Seamless Communication?',
    description:
      'You are all set. You can create an account, log in with Google, or explore all workspaces instantly as a guest collaborator.',
    gesture: 'YES_AFFIRM',
    icon: <Check className="w-5 h-5 text-[var(--brand-coral)]" />,
    highlights: [
      'Accessible across mobile, tablet, and wide desktop',
      'Supports 7 interface languages including Urdu with RTL layout',
      'Instant access to all workspaces and live camera pipelines',
    ],
  },
];

export const OnboardingPage: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const navigate = useNavigate();

  const step = ONBOARDING_STEPS[currentStepIndex];
  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === ONBOARDING_STEPS.length - 1;

  // Keyboard navigation (ArrowLeft / ArrowRight)
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
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between p-6 sm:p-12 z-10">
      {/* Top Header: Step Indicator & Skip */}
      <div className="flex items-center justify-between hairline-border-b pb-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--brand-coral)] font-bold">
            STEP {step.id} OF 7
          </span>
          <span className="hidden sm:inline-block font-mono text-xs text-[var(--text-tertiary)] border-l border-[var(--border)] pl-3">
            Use &larr; &rarr; Arrow Keys
          </span>
        </div>

        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1 text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--brand-coral)] cursor-pointer"
        >
          <span>Skip Guide</span>
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Progress Bar (Exactly 7 Steps) */}
      <div className="grid grid-cols-7 gap-1 my-4">
        {ONBOARDING_STEPS.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => setCurrentStepIndex(idx)}
            className={`h-1.5 transition-all cursor-pointer ${
              idx === currentStepIndex
                ? 'bg-[var(--brand-coral)]'
                : idx < currentStepIndex
                ? 'bg-[var(--text-primary)]'
                : 'bg-[var(--border)]'
            }`}
            title={`Go to step ${s.id}: ${s.title}`}
          />
        ))}
      </div>

      {/* Main Content Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto py-6">
        {/* Left Information (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center gap-2">
            {step.icon}
            <span className="font-mono text-xs uppercase tracking-widest text-[var(--text-secondary)]">
              {step.tagline}
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[var(--text-primary)]">
            {step.title}
          </h2>

          <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-xl">
            {step.description}
          </p>

          {/* Highlights checklist */}
          <div className="space-y-2.5 pt-2">
            <span className="font-mono text-xs uppercase tracking-wider text-[var(--text-tertiary)] block">
              Architectural Pillars:
            </span>
            <ul className="space-y-2">
              {step.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-[var(--text-primary)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-coral)] mt-2 shrink-0" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right 3D Avatar Demonstration (5 cols) */}
        <div className="lg:col-span-5 h-[420px] sm:h-[480px] relative hairline-border bg-[var(--surface)]/70">
          <SignAvatarScene
            currentGesture={step.gesture}
            subtitle={`STEP ${step.id} / ${step.gesture}`}
            className="w-full h-full"
          />
        </div>
      </div>

      {/* Bottom Controls Bar */}
      <div className="pt-6 hairline-border-t flex items-center justify-between">
        <button
          onClick={() => setCurrentStepIndex(prev => prev - 1)}
          disabled={isFirst}
          className={`flex items-center gap-2 px-5 py-2.5 text-xs font-mono uppercase tracking-wider border border-[var(--border)] transition-colors cursor-pointer ${
            isFirst
              ? 'opacity-30 cursor-not-allowed text-[var(--text-tertiary)]'
              : 'text-[var(--text-primary)] hover:border-[var(--brand-coral)]'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <div className="flex items-center gap-3">
          {isLast ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-2.5 bg-[var(--brand-coral)] text-white font-mono text-xs uppercase tracking-wider font-semibold flex items-center gap-2 hover:opacity-90 cursor-pointer shadow-sm"
            >
              <span>Launch Workspace</span>
              <Check className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setCurrentStepIndex(prev => prev + 1)}
              className="px-6 py-2.5 bg-[var(--text-primary)] text-[var(--background)] font-mono text-xs uppercase tracking-wider font-semibold flex items-center gap-2 hover:opacity-90 cursor-pointer"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
