import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignAvatarScene } from '../three/SignAvatarScene';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const SplashScreen: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTheme();
  const [currentGesture, setCurrentGesture] = useState<'WELCOME' | 'GREETING' | 'LOVE'>('WELCOME');

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between p-6 sm:p-12 z-10">
      {/* Top Status Bar */}
      <div className="flex items-center justify-between hairline-border-b pb-4">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 bg-[var(--brand-coral)] inline-block" />
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--text-tertiary)]">
            SIGNA / SYSTEM AMBASSADOR
          </span>
        </div>
        <span className="font-mono text-xs text-[var(--text-tertiary)]">
          THREE.JS R160+ PBR ENGINE
        </span>
      </div>

      {/* Main Editorial Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto py-8">
        {/* Left Column: Bold Typography & Manifesto (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 border border-[var(--border)] px-3 py-1 text-xs font-mono text-[var(--brand-coral)]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-POWERED ACCESSIBILITY PLATFORM</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] text-[var(--text-primary)]">
            VIBRANT
            <br />
            <span className="text-[var(--brand-coral)]">CONNECTIONS</span>
            <br />
            THROUGH
            <br />
            LANGUAGE.
          </h1>

          <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-xl leading-relaxed">
            Uniting deaf and hearing communication through real-time sign recognition, 3D humanoid avatar glossing, and two-way multimodal AI translation.
          </p>

          {/* Interactive Gestures trigger for the ambassador */}
          <div className="space-y-2 pt-2">
            <span className="font-mono text-xs uppercase tracking-wider text-[var(--text-tertiary)] block">
              Test Ambassador Kinematics:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCurrentGesture('WELCOME')}
                className={`px-3 py-1.5 text-xs font-mono uppercase cursor-pointer border transition-colors ${
                  currentGesture === 'WELCOME'
                    ? 'bg-[var(--brand-coral)] text-white border-[var(--brand-coral)]'
                    : 'bg-[var(--surface)] text-[var(--text-primary)] border-[var(--border)] hover:border-[var(--brand-coral)]'
                }`}
              >
                Welcome
              </button>
              <button
                onClick={() => setCurrentGesture('GREETING')}
                className={`px-3 py-1.5 text-xs font-mono uppercase cursor-pointer border transition-colors ${
                  currentGesture === 'GREETING'
                    ? 'bg-[var(--brand-coral)] text-white border-[var(--brand-coral)]'
                    : 'bg-[var(--surface)] text-[var(--text-primary)] border-[var(--border)] hover:border-[var(--brand-coral)]'
                }`}
              >
                Wave / Hello
              </button>
              <button
                onClick={() => setCurrentGesture('LOVE')}
                className={`px-3 py-1.5 text-xs font-mono uppercase cursor-pointer border transition-colors ${
                  currentGesture === 'LOVE'
                    ? 'bg-[var(--brand-coral)] text-white border-[var(--brand-coral)]'
                    : 'bg-[var(--surface)] text-[var(--text-primary)] border-[var(--border)] hover:border-[var(--brand-coral)]'
                }`}
              >
                I Love You
              </button>
            </div>
          </div>

          {/* Action Navigation Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              onClick={() => navigate('/onboarding')}
              className="px-6 py-3.5 bg-[var(--brand-coral)] text-white font-mono text-xs uppercase tracking-wider font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
            >
              <span>Explore Onboarding</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3.5 bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] font-mono text-xs uppercase tracking-wider hover:border-[var(--brand-coral)] transition-colors cursor-pointer"
            >
              Enter Platform
            </button>
          </div>
        </div>

        {/* Right Column: 3D Robot Ambassador Viewport (5 cols) */}
        <div className="lg:col-span-5 h-[480px] sm:h-[560px] relative hairline-border bg-[var(--surface)]/60">
          <SignAvatarScene
            currentGesture={currentGesture}
            subtitle={`AMBASSADOR / ${currentGesture}`}
            className="w-full h-full"
          />
        </div>
      </div>

      {/* Bottom Architectural Metadata */}
      <div className="pt-6 hairline-border-t flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-[var(--text-tertiary)] gap-2">
        <div>SWISS GRID EDITORIAL PROTOCOL &bull; 7 INTERFACE LANGUAGES</div>
        <div>REAL-TIME COMPUTER VISION &bull; GEMINI MULTIMODAL INTELLIGENCE</div>
      </div>
    </div>
  );
};
