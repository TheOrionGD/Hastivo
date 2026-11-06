import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SignAvatarScene, GestureType } from '../three/SignAvatarScene';
import { SAMPLE_TRANSLATION_PROMPTS } from '../data/hastivoData';
import { Sparkles, Play, RefreshCw, Send, Sliders, Volume2, ShieldCheck, Check } from 'lucide-react';
import { ScrollStoryElement } from '../animation/ScrollStoryElement';
import { ScrollCardReveal } from '../animation/ScrollCardReveal';
import { AnimatedBadge } from '../animation/AnimatedBadge';
import { MagneticButton } from '../animation/MagneticButton';

export const LiveAvatarSimulatorSection: React.FC = () => {
  const [selectedPromptIndex, setSelectedPromptIndex] = useState(0);
  const [customInput, setCustomInput] = useState('');
  const [activeGesture, setActiveGesture] = useState<GestureType>('GREETING');
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [activeLang, setActiveLang] = useState<'en' | 'hi' | 'ta'>('en');

  const currentPrompt = SAMPLE_TRANSLATION_PROMPTS[selectedPromptIndex];

  const handleSelectPrompt = (index: number) => {
    setSelectedPromptIndex(index);
    const item = SAMPLE_TRANSLATION_PROMPTS[index];
    setActiveGesture(item.gesture as GestureType);
    setCustomInput('');
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;

    const lower = customInput.toLowerCase();
    if (lower.includes('thank')) {
      setActiveGesture('THANK_YOU');
    } else if (lower.includes('help')) {
      setActiveGesture('HELP');
    } else if (lower.includes('name')) {
      setActiveGesture('NAME');
    } else if (lower.includes('time') || lower.includes('when')) {
      setActiveGesture('TIME');
    } else if (lower.includes('love') || lower.includes('heart')) {
      setActiveGesture('LOVE');
    } else if (lower.includes('yes') || lower.includes('agree')) {
      setActiveGesture('YES_AFFIRM');
    } else if (lower.includes('no') || lower.includes('not')) {
      setActiveGesture('NO_NEGATE');
    } else if (lower.includes('communicate') || lower.includes('together')) {
      setActiveGesture('COMMUNICATE');
    } else if (lower.includes('question') || lower.includes('what') || lower.includes('how')) {
      setActiveGesture('QUESTION');
    } else {
      setActiveGesture('GREETING');
    }
  };

  return (
    <section
      id="simulator"
      className="relative w-full py-24 md:py-36 border-t border-[var(--divider)] bg-[var(--background-secondary)] transition-colors"
    >
      <div className="max-w-[1720px] mx-auto px-8 md:px-14">
        {/* Section Header */}
        <div className="grid grid-cols-12 gap-6 mb-12 md:mb-16">
          <div className="col-span-12 md:col-span-1">
            <ScrollStoryElement
              as="span"
              granularity="words"
              start="top 92%"
              end="bottom 70%"
              className="font-mono text-xs uppercase tracking-widest text-[var(--primary)] font-semibold"
            >
              02 / Kinematics
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
              stagger={0.04}
              className="font-felix text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-[var(--text-primary)] uppercase mb-6 select-none"
            >
              3D AVATAR SIMULATOR.
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
              Procedural WebGL inverse kinematics executing natural sign language expressions. Experience how spoken phrases translate into structured Subject-Object-Verb gloss tokens, facial non-manual markers, and spatial signing locus coordinates in real time.
            </ScrollStoryElement>
          </div>
        </div>

        {/* Workspace Grid: Cards reveal progressively */}
        <ScrollCardReveal
          start="top 85%"
          end="bottom 50%"
          itemSelector=".simulator-card-item"
          className="grid grid-cols-12 gap-8 items-start"
        >
          {/* Left Column: 3D WebGL Avatar Viewport */}
          <div className="simulator-card-item col-span-12 lg:col-span-7 bg-[var(--surface)] border border-[var(--border)] relative overflow-hidden shadow-sm">
            {/* Viewport Top Header */}
            <div className="px-5 py-3 border-b border-[var(--divider)] flex items-center justify-between text-xs font-mono bg-[var(--surface-elevated)]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-semibold text-[var(--text-primary)]">
                  KINEMATICS VIEWPORT
                </span>
                <span className="text-[var(--text-muted)]">|</span>
                <span className="text-[var(--text-muted)]">60 FPS WebGL</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[var(--primary)] font-semibold uppercase">{activeGesture}</span>
                <span className="text-[var(--border)]">|</span>
                <span className="text-[var(--text-muted)]">{playbackSpeed}x SPEED</span>
              </div>
            </div>

            {/* 3D Scene Container */}
            <div className="relative w-full h-[450px] sm:h-[520px] md:h-[580px] bg-neutral-900 overflow-hidden">
              <SignAvatarScene
                currentGesture={activeGesture}
                speed={playbackSpeed}
                interactive={true}
                className="w-full h-full"
                subtitle={
                  customInput
                    ? `Input: "${customInput}" → Synthesizing [${activeGesture}]`
                    : currentPrompt[activeLang]
                }
              />

              {/* Viewport Floating HUD Overlays */}
              <div className="absolute top-4 left-4 pointer-events-none space-y-1.5 font-mono text-[11px] text-white/90 drop-shadow-md">
                <div className="bg-black/60 backdrop-blur-xs px-2.5 py-1 border border-white/10 inline-block">
                  <span className="text-[var(--primary)] font-bold">Locus: </span>
                  <span>{currentPrompt.spatialLocus}</span>
                </div>
                <br />
                <div className="bg-black/60 backdrop-blur-xs px-2.5 py-1 border border-white/10 inline-block">
                  <span className="text-[var(--secondary)] font-bold">Non-Manual: </span>
                  <span>{currentPrompt.facialMarker}</span>
                </div>
              </div>

              {/* Viewport Floating Quick Speed Controls */}
              <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-black/70 backdrop-blur-xs p-1.5 border border-white/15 z-10">
                <span className="text-[10px] font-mono text-white/70 px-1 uppercase">Speed</span>
                {[0.5, 1.0, 1.5].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setPlaybackSpeed(spd)}
                    className={`px-2 py-0.5 text-xs font-mono transition-colors cursor-pointer ${
                      playbackSpeed === spd
                        ? 'bg-[var(--primary)] text-white font-bold'
                        : 'text-white/80 hover:bg-white/20'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>

            {/* Viewport Bottom Telemetry Footer */}
            <div className="px-5 py-3 border-t border-[var(--divider)] flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[var(--text-muted)] bg-[var(--surface-elevated)]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Zero Latency WebGL Pipeline (11.2ms)</span>
              </div>
              <div className="flex items-center gap-4">
                <span>Joint Bones: 48</span>
                <span>•</span>
                <span>Morph Targets: 24</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Prompting & Linguistic Decomposition */}
          <div className="simulator-card-item col-span-12 lg:col-span-5 flex flex-col space-y-6">
            {/* Language Switcher for Samples */}
            <div className="bg-[var(--surface)] p-5 border border-[var(--border)]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-mono text-xs uppercase tracking-widest text-[var(--text-primary)] font-semibold flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[var(--primary)]" />
                  Interactive Sign Prompts
                </h3>
                <div className="flex items-center gap-1">
                  {(['en', 'hi', 'ta'] as const).map((lng) => (
                    <button
                      key={lng}
                      onClick={() => setActiveLang(lng)}
                      className={`px-2.5 py-0.5 text-[11px] font-mono uppercase cursor-pointer transition-colors ${
                        activeLang === lng
                          ? 'bg-[var(--primary)] text-white font-bold'
                          : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      {lng}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sample Prompts List with Card/Point-level scroll entrance */}
              <ScrollCardReveal
                start="top 90%"
                end="bottom 60%"
                stagger={0.06}
                itemSelector=".prompt-point-card"
                className="space-y-2"
              >
                {SAMPLE_TRANSLATION_PROMPTS.map((prompt, idx) => {
                  const isSelected = selectedPromptIndex === idx && !customInput;
                  return (
                    <button
                      key={prompt.id}
                      onClick={() => handleSelectPrompt(idx)}
                      className={`prompt-point-card w-full p-3 text-left border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                        isSelected
                          ? 'border-[var(--primary)] bg-[var(--primary)]/5 shadow-xs'
                          : 'border-[var(--border-subtle)] hover:border-[var(--border)] bg-[var(--surface-elevated)]'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-medium text-[var(--text-primary)] line-clamp-1">
                          "{prompt[activeLang]}"
                        </div>
                        <div className="text-[11px] font-mono text-[var(--primary)] mt-1 font-semibold">
                          Gloss: {prompt.gloss}
                        </div>
                      </div>
                      <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 bg-[var(--surface)] text-[var(--text-muted)] border border-[var(--border-subtle)] shrink-0">
                        {prompt.gesture}
                      </span>
                    </button>
                  );
                })}
              </ScrollCardReveal>
            </div>

            {/* Custom Natural Language Input */}
            <div className="bg-[var(--surface)] p-5 border border-[var(--border)]">
              <h3 className="font-mono text-xs uppercase tracking-widest text-[var(--text-primary)] font-semibold mb-3 flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5 text-[var(--secondary)]" />
                Custom Sentence Input
              </h3>
              <form onSubmit={handleCustomSubmit} className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder="Try typing: 'Thank you for your help' or 'Hello friends'..."
                    className="w-full px-4 py-3 bg-[var(--surface-elevated)] border border-[var(--border-input)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-focus)] transition-colors"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[var(--primary)] text-white text-[11px] font-mono uppercase tracking-wider hover:bg-[var(--primary-hover)] transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>Sign</span>
                    <Send className="w-3 h-3" />
                  </button>
                </div>
                <ScrollStoryElement
                  as="p"
                  granularity="words"
                  start="top 95%"
                  end="bottom 75%"
                  className="text-[11px] font-mono text-[var(--text-muted)]"
                >
                  Parses SVO natural language into SOV gloss tokens and executes avatar kinematics.
                </ScrollStoryElement>
              </form>
            </div>

            {/* Linguistic Token Breakdown Points Card */}
            <div className="bg-[var(--surface)] p-5 border border-[var(--border)]">
              <h3 className="font-mono text-xs uppercase tracking-widest text-[var(--text-primary)] font-semibold mb-3">
                Spatial Token Decomposition
              </h3>
              <div className="p-3 bg-[var(--surface-elevated)] border border-[var(--border-subtle)] font-mono text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-muted)]">SOV Sequence:</span>
                  <span className="text-[var(--primary)] font-bold">{currentPrompt.gloss}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-muted)]">Locus Coordinates:</span>
                  <span className="text-[var(--secondary)] font-bold">{currentPrompt.spatialLocus}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-muted)]">Facial Marker:</span>
                  <span className="text-emerald-500 font-bold">{currentPrompt.facialMarker}</span>
                </div>
              </div>
            </div>
          </div>
        </ScrollCardReveal>
      </div>
    </section>
  );
};
