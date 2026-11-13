import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Play, XCircle } from "lucide-react";
import { BrandMark } from "@/components/common/BrandMark";
import { ThemeSwitch } from "@/components/navigation/Nav";
import {
  LoadingScreen,
  SkeletonDisplay,
  AvatarThinkingState,
} from "@/components/common/LoadingScreen.jsx";

export const Route = createFileRoute("/loading")({
  head: () => ({
    meta: [
      { title: "Loading Experience & Skeletons — Hastivo" },
      {
        name: "description",
        content:
          "Hastivo loading screen showcase: skeletons, progress indicators, and avatar thinking states.",
      },
    ],
  }),
  component: LoadingShowcasePage,
});

/**
 * 13. LOADING SCREENS SHOWCASE / PREVIEW
 * - FETCH: No separate business data; reflect the pending operation and its actual loading state.
 * - DISPLAY: Skeletons, progress indicators, avatar thinking state.
 * - INPUT: Cancel or retry where the operation supports it.
 */
function LoadingShowcasePage() {
  const [activeSimulation, setActiveSimulation] = useState<"fullscreen" | "progress" | null>(null);
  const [progressVal, setProgressVal] = useState(0);
  const [operationCancelled, setOperationCancelled] = useState(false);

  // Simulated pending progress loop
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    if (activeSimulation === "fullscreen" || activeSimulation === "progress") {
      setProgressVal(12);
      setOperationCancelled(false);
      timer = setInterval(() => {
        setProgressVal((prev) => {
          if (prev >= 100) {
            if (timer) clearInterval(timer);
            setTimeout(() => setActiveSimulation(null), 800);
            return 100;
          }
          return prev + 15;
        });
      }, 500);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [activeSimulation]);

  const handleCancel = () => {
    setActiveSimulation(null);
    setOperationCancelled(true);
  };

  const handleRetry = () => {
    setOperationCancelled(false);
    setActiveSimulation("fullscreen");
  };

  return (
    <div className="min-h-[100svh] bg-background text-foreground flex flex-col justify-between selection:bg-coral selection:text-charcoal">
      {/* Top Header */}
      <header className="border-b border-border/80 px-5 py-4 sm:px-10 flex items-center justify-between sticky top-0 bg-background/85 backdrop-blur-md z-30">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors mr-2"
          >
            <ArrowLeft size={16} />
            <span>Home</span>
          </Link>
          <Link to="/" className="flex items-center gap-3">
            <BrandMark size={28} />
            <span className="font-display text-lg font-medium tracking-tight">Hastivo</span>
          </Link>
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 text-[11px] font-mono border border-coral/40 text-coral rounded-full bg-coral/5">
            Loading System
          </span>
        </div>
        <ThemeSwitch />
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-5 py-8 sm:px-10 space-y-12">
        <div className="border-b border-border pb-6">
          <h1 className="font-display text-3xl sm:text-4xl font-medium tracking-tight">
            Dynamic Loading Screens & States
          </h1>
          <p className="mt-2 text-text-2 text-sm sm:text-base max-w-2xl">
            Clean visual feedback reflecting real asynchronous pipeline phases: skeleton shimmers,
            live progress bars, and neural avatar thinking feedback with cancel/retry capabilities.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveSimulation("fullscreen")}
              className="px-4 py-2 rounded-lg bg-coral text-charcoal font-medium text-xs sm:text-sm hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Play size={15} />
              Simulate Fullscreen Pipeline Loading
            </button>
            <button
              type="button"
              onClick={() => setActiveSimulation("progress")}
              className="px-4 py-2 rounded-lg border border-border bg-foreground/5 hover:bg-foreground/10 text-xs sm:text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Play size={15} />
              Simulate Inline Progress Bar
            </button>
            {operationCancelled && (
              <span className="text-xs font-mono text-coral flex items-center gap-1.5 px-3 py-1 bg-coral/10 rounded-md border border-coral/20">
                <XCircle size={14} /> Operation was cancelled by user
              </span>
            )}
          </div>
        </div>

        {/* Section 1: Avatar Thinking State */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-medium">Avatar Thinking State</h2>
              <p className="text-xs text-muted-foreground">
                Displayed during neural grammatical conversion and 3D skeletal motion planning
              </p>
            </div>
          </div>
          <div className="max-w-xl">
            <AvatarThinkingState
              statusText="Computing Spatial Bi-Directional Gloss..."
              subtext="Translating spoken Hindi / English phonemes to ISL bone poses"
            />
          </div>
        </section>

        {/* Section 2: Skeleton Display Variations */}
        <section className="space-y-4">
          <div>
            <h2 className="font-display text-xl font-medium">Skeleton Loading States</h2>
            <p className="text-xs text-muted-foreground">
              Responsive content placeholders rendered while fetching feed data or conversation
              transcripts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl border border-border bg-foreground/[0.01] space-y-4">
              <span className="text-xs font-mono uppercase text-muted-foreground block">
                Card Skeleton Grid
              </span>
              <SkeletonDisplay count={2} type="card" />
            </div>

            <div className="p-5 rounded-2xl border border-border bg-foreground/[0.01] space-y-4">
              <span className="text-xs font-mono uppercase text-muted-foreground block">
                Text & Transcript Skeleton
              </span>
              <SkeletonDisplay type="text" />
              <div className="pt-4 border-t border-border">
                <SkeletonDisplay type="text" />
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-border bg-foreground/[0.01] space-y-4">
              <span className="text-xs font-mono uppercase text-muted-foreground block">
                Avatar & User Profile Skeleton
              </span>
              <SkeletonDisplay type="avatar" />
              <div className="pt-4 border-t border-border">
                <SkeletonDisplay type="avatar" />
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Inline Progress Demonstration */}
        {activeSimulation === "progress" && (
          <section className="p-6 rounded-2xl border border-blue/40 bg-blue/5 max-w-xl">
            <LoadingScreen
              isLoading={true}
              progress={progressVal}
              title="Transcribing Real-Time Video Landmarks"
              description="Processing MediaPipe hand landmarks (21 per hand) into ISL grammatical gloss"
              avatarThinking={false}
              fullScreen={false}
              onCancel={handleCancel}
              onRetry={handleRetry}
            />
          </section>
        )}
      </main>

      {/* Fullscreen Loading Modal */}
      {activeSimulation === "fullscreen" && (
        <LoadingScreen
          isLoading={true}
          progress={progressVal}
          title="Synthesizing ISL Spatial Kinematics"
          description="Connecting to Hastivo AI language service & 3D WebGL renderer"
          avatarThinking={true}
          fullScreen={true}
          onCancel={handleCancel}
          onRetry={handleRetry}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-border/80 px-5 py-4 text-center text-xs text-muted-foreground font-mono">
        Hastivo Asynchronous Task Architecture &bull; Non-blocking UX
      </footer>
    </div>
  );
}
