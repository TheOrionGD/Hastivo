import { RevealText, PerWordCrossfade, FloatInput } from "@/components/ui/smoothui";
import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  Sliders,
  Sparkles,
  Layers,
  Send,
  FastForward,
  AlertTriangle,
} from "lucide-react";
import { GuestLayout } from "@/components/guest/GuestLayout";
import { AvatarStage } from "@/components/three/AvatarStage";

/**
 * 3. GUEST TEXT-TO-SIGN
 * - FETCH: Available sign vocabulary, sign sequences, avatar assets and animation clips.
 * - DISPLAY: 3D avatar, generated sign sequence, current word, playback progress.
 * - INPUT: Text or sentence, playback speed, pause, resume, replay.
 *
 * Implemented in Apple Vision Pro spatial aesthetic with glass overlay,
 * fluid speed step slider, and live current gloss marker.
 */
export default function GuestTextToSignPage() {
  const [inputText, setInputText] = useState("Hello welcome to Hastivo sign platform");
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [glossSequence, setGlossSequence] = useState(["HELLO", "WELCOME", "HASTIVO", "SIGN", "PLATFORM"]);
  const [usageRemaining, setUsageRemaining] = useState(10);
  const [limitReached, setLimitReached] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState("x-bot");

  // FETCH: Guest usage limits
  useEffect(() => {
    let active = true;
    fetch("/api/v1/guest/dashboard")
      .then((r) => (r.ok ? r.json() : null))
      .then((res) => {
        if (active && res?.usageLimits?.textToSign) {
          setUsageRemaining(res.usageLimits.textToSign.remaining);
          if (res.usageLimits.textToSign.remaining <= 0) {
            setLimitReached(true);
          }
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  // Playback timer loop across gloss sequence
  useEffect(() => {
    let interval;
    if (isPlaying && glossSequence.length > 0) {
      const stepDuration = Math.round(900 / playbackSpeed);
      interval = setInterval(() => {
        setCurrentWordIndex((prev) => {
          if (prev >= glossSequence.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, stepDuration);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, glossSequence]);

  const handleSynthesize = async (e) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    if (usageRemaining <= 0) {
      setLimitReached(true);
      return;
    }

    setIsSynthesizing(true);
    try {
      const res = await fetch("/api/v1/translation/text-to-sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });

      if (res.status === 429) {
        setLimitReached(true);
        return;
      }

      if (res.ok) {
        const data = await res.json();
        const glosses = data.islGlossSequence || inputText.toUpperCase().split(/\s+/);
        setGlossSequence(glosses);
        setCurrentWordIndex(0);
        setIsPlaying(true);
        setUsageRemaining((prev) => Math.max(0, prev - 1));
      }
    } catch {
      // Fallback local glossing
      const fallback = inputText.toUpperCase().split(/\s+/);
      setGlossSequence(fallback);
      setCurrentWordIndex(0);
      setIsPlaying(true);
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handleReplay = () => {
    setCurrentWordIndex(0);
    setIsPlaying(true);
  };

  return (
    <GuestLayout
      activeId="text-to-sign"
      title="Guest Text-to-Sign 3D Studio"
      subtitle="3D avatar spatial animation pipeline with Apple Vision Pro visual design aesthetic"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
        {/* Left: 3D Avatar Stage in Apple Vision Pro Floating Glass Canvas */}
        <div className="space-y-4">
          <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-3xl overflow-hidden border border-white/20 bg-gradient-to-b from-neutral-900/80 via-neutral-950 to-black shadow-2xl flex items-center justify-center">
            {/* Ambient Radial Glass Backlight */}
            <div
              className="absolute inset-0 pointer-events-none opacity-40"
              style={{
                background:
                  "radial-gradient(circle at 50% 40%, rgba(111,163,239,0.3) 0%, rgba(255,111,97,0.15) 50%, transparent 80%)",
              }}
            />

            {/* 3D WebGL Avatar Canvas */}
            <div className="relative w-full h-full z-10">
              <AvatarStage className="w-full h-full" modelType={selectedAvatar} />
            </div>

            {/* Avatar Selector Switcher */}
            <div className="absolute top-6 left-6 z-30 hidden sm:flex items-center gap-1.5 p-1 rounded-xl bg-black/60 backdrop-blur-md border border-white/15">
              {[
                { id: "x-bot", label: "X-Bot (F)" },
                { id: "y-bot", label: "Y-Bot (M)" },
              ].map((av) => (
                <button
                  key={av.id}
                  onClick={() => setSelectedAvatar(av.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    selectedAvatar === av.id
                      ? "bg-coral text-white shadow-md shadow-coral/20"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  {av.label}
                </button>
              ))}
            </div>

            {/* Vision Pro Floating Glass Pill: Current Signing Word & Progress */}
            <div className="absolute top-6 inset-x-6 sm:inset-x-12 z-20 flex flex-col items-center">
              <motion.div
                key={glossSequence[currentWordIndex] || "IDLE"}
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="px-6 py-3 rounded-2xl bg-neutral-900/70 backdrop-blur-2xl border border-white/20 shadow-xl flex items-center gap-3 text-white"
              >
                <span className="h-2 w-2 rounded-full bg-coral animate-ping" />
                <span className="text-xs font-mono uppercase tracking-wider text-white/70">Gloss:</span>
                <span className="font-display text-xl sm:text-2xl font-bold tracking-tight text-white">
                  {glossSequence[currentWordIndex] || "READY"}
                </span>
                <span className="text-xs font-mono text-blue ml-2 px-2 py-0.5 rounded-full bg-blue/20 border border-blue/40">
                  {currentWordIndex + 1} / {glossSequence.length}
                </span>
              </motion.div>
            </div>

            {/* Bottom Progress Bar across Sequence */}
            <div className="absolute bottom-4 inset-x-8 z-20 space-y-1.5">
              <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden backdrop-blur-xs">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue via-coral to-yellow rounded-full"
                  animate={{
                    width: `${
                      glossSequence.length > 0 ? ((currentWordIndex + 1) / glossSequence.length) * 100 : 0
                    }%`,
                  }}
                  transition={{ duration: 0.2 }}
                />
              </div>
            </div>
          </div>

          {/* Playback Controls & Speed Stepper */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border border-border/80 bg-foreground/[0.02]">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-5 py-2.5 rounded-xl bg-coral text-charcoal font-medium text-xs sm:text-sm hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer shadow-sm"
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                <span>{isPlaying ? "Pause Avatar" : "Play Sign"}</span>
              </button>

              <button
                type="button"
                onClick={handleReplay}
                className="px-4 py-2.5 rounded-xl border border-border bg-foreground/5 hover:bg-foreground/10 text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw size={14} />
                <span>Replay</span>
              </button>
            </div>

            {/* INPUT: Playback speed */}
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="text-muted-foreground flex items-center gap-1">
                <FastForward size={14} className="text-blue" /> Speed:
              </span>
              {[0.75, 1.0, 1.25, 1.5].map((spd) => (
                <button
                  key={spd}
                  type="button"
                  onClick={() => setPlaybackSpeed(spd)}
                  className={`px-2.5 py-1 rounded-lg border transition-all ${
                    playbackSpeed === spd
                      ? "bg-foreground text-background font-bold border-foreground"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Sentence Input & Sequence Tokens */}
        <div className="space-y-6">
          {/* Sentence Input Form */}
          <form onSubmit={handleSynthesize} className="p-5 rounded-2xl border border-border bg-foreground/[0.02] space-y-4">
            <div>
              <label htmlFor="inputText" className="block text-xs font-mono uppercase text-muted-foreground mb-1.5">
                Input Sentence / Spoken Transcript
              </label>
              <textarea
                id="inputText"
                rows={3}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type or paste words to synthesize 3D signing..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:border-coral text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={isSynthesizing || limitReached}
              className="w-full py-2.5 px-4 rounded-xl bg-coral text-charcoal font-medium text-xs sm:text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-sm"
            >
              <Send size={15} />
              <span>{isSynthesizing ? "Synthesizing ISL..." : "Synthesize 3D Signs"}</span>
            </button>
          </form>

          {/* Generated ISL Sequence Tokens */}
          <div className="p-5 rounded-2xl border border-border bg-foreground/[0.02] space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                Synthesized ISL Gloss Tokens
              </h4>
              <span className="text-[11px] font-mono text-coral">{glossSequence.length} Glosses</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {glossSequence.map((gloss, idx) => {
                const isCurrent = idx === currentWordIndex;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setCurrentWordIndex(idx);
                      setIsPlaying(true);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                      isCurrent
                        ? "bg-coral text-charcoal font-bold scale-105 shadow-sm"
                        : "bg-foreground/5 hover:bg-foreground/10 text-foreground border border-border/80"
                    }`}
                  >
                    {gloss}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Guest Quota Limit Notice */}
          {limitReached && (
            <div className="p-4 rounded-xl border border-coral/40 bg-coral/10 text-xs space-y-2">
              <div className="flex items-center gap-1.5 font-semibold text-coral">
                <AlertTriangle size={15} /> Guest Quota Reached
              </div>
              <p className="text-[11px] text-muted-foreground">
                You have reached your 10 Text-to-Sign guest limit. Upgrade your guest account with Google to unlock
                unlimited avatar synthesis.
              </p>
              <Link
                to="/upgrade-account"
                className="w-full py-2 px-3 rounded-lg bg-coral text-charcoal font-semibold text-xs flex items-center justify-center gap-1.5"
              >
                <Sparkles size={14} /> Upgrade Now
              </Link>
            </div>
          )}
        </div>
      </div>
    </GuestLayout>
  );
}

