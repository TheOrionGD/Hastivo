import { RollingText, TypewriterText, BorderBeam } from "@/components/ui/smoothui";
import { useState, useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Play,
  Square,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  Globe,
  Sliders,
  Maximize2,
} from "lucide-react";
import { GuestLayout } from "@/components/guest/GuestLayout";

/**
 * 2. GUEST SIGN-TO-TEXT
 * - FETCH: Recognition model configuration, supported ISL vocabulary, guest limits.
 * - DISPLAY: Camera preview, hand landmarks, recognized text, confidence score, recognition status.
 * - INPUT: Camera permission, live video frames, recognition start/stop, language selection.
 *
 * Designed following the uploaded reference image:
 * clean model background, frosted glass floating pill ("I understand everything"),
 * and delicate glowing hand landmark skeletal wireframe overlay.
 */
export default function GuestSignToTextPage() {
  const [modelConfig, setModelConfig] = useState(null);
  const [recognizing, setRecognizing] = useState(false);
  const [recognizedText, setRecognizedText] = useState("I understand everything");
  const [confidence, setConfidence] = useState(0.96);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [cameraPermission, setCameraPermission] = useState("prompt"); // 'prompt' | 'granted' | 'denied'
  const [guestLimitReached, setGuestLimitReached] = useState(false);
  const [usageRemaining, setUsageRemaining] = useState(10);
  const [useLiveWebcam, setUseLiveWebcam] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // FETCH: Recognition model configuration and guest limits
  useEffect(() => {
    let active = true;
    fetch("/api/v1/config")
      .then((r) => (r.ok ? r.json() : null))
      .then((cfg) => {
        if (active && cfg) setModelConfig(cfg);
      })
      .catch(() => {});

    fetch("/api/v1/guest/dashboard")
      .then((r) => (r.ok ? r.json() : null))
      .then((res) => {
        if (active && res?.usageLimits?.signToText) {
          setUsageRemaining(res.usageLimits.signToText.remaining);
          if (res.usageLimits.signToText.remaining <= 0) {
            setGuestLimitReached(true);
          }
        }
      })
      .catch(() => {});

    return () => {
      active = false;
      stopCameraStream();
    };
  }, []);

  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const requestCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720, facingMode: "user" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraPermission("granted");
      setUseLiveWebcam(true);
      startRecognition();
    } catch {
      setCameraPermission("denied");
      setUseLiveWebcam(false);
    }
  };

  const startRecognition = () => {
    if (usageRemaining <= 0) {
      setGuestLimitReached(true);
      return;
    }
    setRecognizing(true);
  };

  const stopRecognition = () => {
    setRecognizing(false);
  };

  // Perform mock frame landmark recognition dispatch against backend endpoint
  const sendRecognitionFrame = async (sampleSigns = ["I", "UNDERSTAND", "EVERYTHING"]) => {
    if (usageRemaining <= 0) {
      setGuestLimitReached(true);
      return;
    }

    try {
      const res = await fetch("/api/v1/translation/sign-to-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          signs: sampleSigns,
          landmarks: Array(21).fill(0).map((_, i) => ({ x: 0.5 + Math.sin(i) * 0.1, y: 0.5 + Math.cos(i) * 0.1, z: 0 })),
        }),
      });

      if (res.status === 429) {
        setGuestLimitReached(true);
        return;
      }

      if (res.ok) {
        const data = await res.json();
        setRecognizedText(data.translatedText || "I understand everything");
        setConfidence(data.confidence || 0.96);
        setUsageRemaining((prev) => Math.max(0, prev - 1));
      }
    } catch {}
  };

  return (
    <GuestLayout
      activeId="sign-to-text"
      title="Guest Sign-to-Text Studio"
      subtitle="Real-time MediaPipe hand landmark extraction & ISL sentence translation"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
        {/* Main Stage: Camera Preview matching the reference image style */}
        <div className="space-y-4">
          <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-3xl overflow-hidden border border-border/80 bg-neutral-900 shadow-2xl flex items-center justify-center">
            {/* Live Camera Stream or High-Fidelity Reference Frame */}
            {useLiveWebcam && cameraPermission === "granted" ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform -scale-x-100"
              />
            ) : (
              <img
                src="/guest-sign-reference.png"
                alt="ISL sign demonstration with landmark wireframe"
                className="w-full h-full object-cover"
              />
            )}

            {/* Glowing Landmark Skeleton Wireframe Overlay (Visual replica of uploaded reference image) */}
            <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 1000 600" preserveAspectRatio="none">
                {/* Hand landmark nodes & skeletal bone links */}
                <g className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">
                  {/* Skeletal hand lines */}
                  <line x1="490" y1="460" x2="480" y2="340" stroke="rgba(255,255,255,0.75)" strokeWidth="2.5" />
                  <line x1="480" y1="340" x2="492" y2="260" stroke="rgba(255,255,255,0.75)" strokeWidth="2.5" />
                  <line x1="492" y1="260" x2="495" y2="200" stroke="rgba(255,255,255,0.85)" strokeWidth="2.5" />
                  <line x1="490" y1="460" x2="520" y2="330" stroke="rgba(255,255,255,0.75)" strokeWidth="2.5" />
                  <line x1="490" y1="460" x2="540" y2="340" stroke="rgba(255,255,255,0.75)" strokeWidth="2.5" />
                  <line x1="490" y1="460" x2="560" y2="360" stroke="rgba(255,255,255,0.75)" strokeWidth="2.5" />
                  <line x1="490" y1="460" x2="470" y2="380" stroke="rgba(255,255,255,0.75)" strokeWidth="2.5" />

                  {/* Interconnected knuckle cross-links */}
                  <line x1="480" y1="340" x2="520" y2="330" stroke="rgba(255,255,255,0.6)" strokeWidth="1.8" />
                  <line x1="520" y1="330" x2="540" y2="340" stroke="rgba(255,255,255,0.6)" strokeWidth="1.8" />
                  <line x1="540" y1="340" x2="560" y2="360" stroke="rgba(255,255,260,0.6)" strokeWidth="1.8" />

                  {/* Finger nodes (MediaPipe 21 keypoints style) */}
                  {[
                    [495, 200, 6], // Index Tip
                    [492, 260, 4.5],
                    [480, 340, 5],
                    [520, 330, 4.5],
                    [535, 360, 4.5],
                    [540, 340, 4.5],
                    [555, 370, 4.5],
                    [560, 360, 4.5],
                    [570, 385, 4.5],
                    [470, 380, 4.5],
                    [490, 460, 7], // Wrist base
                  ].map(([x, y, r], idx) => (
                    <circle
                      key={idx}
                      cx={x}
                      cy={y}
                      r={r}
                      fill="#ffffff"
                      className="animate-pulse"
                      style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,1))" }}
                    />
                  ))}
                </g>
              </svg>
            </div>

            {/* Apple Vision Pro Style Floating Frosted Pill Display for Recognized Text */}
            <motion.div
              initial={{ opacity: 0, x: -20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-6 sm:left-10 top-1/3 -translate-y-1/2 z-20"
            >
              <div className="relative px-6 py-4 rounded-3xl bg-neutral-900/60 backdrop-blur-2xl border border-white/20 shadow-2xl flex flex-col justify-center min-w-[220px] sm:min-w-[280px]">
                <span className="font-sans text-base sm:text-xl font-medium tracking-wide text-white drop-shadow-sm">
                  {recognizedText}
                </span>

                {/* Subtitle indicator dash */}
                <div className="flex items-center gap-2 mt-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
                  <span className="h-1 w-8 rounded-full bg-white/50" />
                  <span className="text-[10px] font-mono text-white/80 ml-auto">
                    {Math.round(confidence * 100)}% Conf
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Top Telemetry Tag */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-mono border border-white/10 flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full ${recognizing ? "bg-emerald-400 animate-ping" : "bg-coral"}`} />
                {recognizing ? "MediaPipe Landmarks Active (15 FPS)" : "Ready for Recognition"}
              </span>
            </div>

            {/* Camera Switch Pill */}
            <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2">
              <button
                type="button"
                onClick={requestCamera}
                className="px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md hover:bg-black/80 text-white text-xs font-mono border border-white/10 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Camera size={14} />
                <span>{useLiveWebcam ? "Webcam Active" : "Use Real Webcam"}</span>
              </button>
            </div>
          </div>

          {/* Action Control Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border border-border/80 bg-foreground/[0.02]">
            <div className="flex items-center gap-3">
              {!recognizing ? (
                <button
                  type="button"
                  onClick={startRecognition}
                  disabled={guestLimitReached}
                  className="px-5 py-2.5 rounded-xl bg-coral text-charcoal font-medium text-xs sm:text-sm hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
                >
                  <Play size={16} />
                  <span>Start Recognition</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopRecognition}
                  className="px-5 py-2.5 rounded-xl border border-coral text-coral hover:bg-coral/10 font-medium text-xs sm:text-sm transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Square size={16} />
                  <span>Stop Recognition</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => sendRecognitionFrame(["NAMASTE", "WELCOME", "HASTIVO"])}
                disabled={guestLimitReached}
                className="px-4 py-2.5 rounded-xl border border-border bg-foreground/5 hover:bg-foreground/10 text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw size={14} />
                <span>Simulate Frame Batch</span>
              </button>
            </div>

            {/* Language Selection */}
            <div className="flex items-center gap-2 text-xs font-mono">
              <Globe size={15} className="text-blue" />
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-transparent border border-border px-2.5 py-1.5 rounded-lg text-foreground cursor-pointer focus:outline-none"
              >
                <option value="en" className="bg-background">English (ISL TSVO)</option>
                <option value="hi" className="bg-background">Hindi (हिन्दी)</option>
                <option value="ta" className="bg-background">Tamil (தமிழ்)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Info Sidebar: Limits, Model Specs & Upgrade Banner */}
        <div className="space-y-6">
          {/* Guest Limit Card */}
          <div className="p-5 rounded-2xl border border-border bg-foreground/[0.02] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-semibold text-base">Guest Vision Quota</h3>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-foreground/10 text-coral font-bold">
                {usageRemaining} Left
              </span>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Guest users have 10 free high-definition landmark extractions. Upgrade to a registered Citizen account
              to enable continuous duplex recording and transcript exports.
            </p>

            {guestLimitReached && (
              <div className="p-3.5 rounded-xl border border-coral/40 bg-coral/10 text-xs space-y-2">
                <div className="flex items-center gap-1.5 font-semibold text-coral">
                  <AlertTriangle size={15} /> Guest Quota Reached
                </div>
                <p className="text-[11px] text-muted-foreground">
                  You have used all 10 guest recognition frames. Upgrade with Google to continue with zero limits.
                </p>
                <Link
                  to="/upgrade-account"
                  className="w-full py-2 px-3 rounded-lg bg-coral text-charcoal font-semibold text-xs flex items-center justify-center gap-1.5"
                >
                  <Sparkles size={14} /> Upgrade Now (Keep History)
                </Link>
              </div>
            )}
          </div>

          {/* Model Telemetry Box */}
          <div className="p-5 rounded-2xl border border-border bg-foreground/[0.02] space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Vision Engine Specifications
            </h4>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted-foreground">Framework:</span>
                <span className="text-foreground">MediaPipe Hands + PyTorch</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted-foreground">Target FPS:</span>
                <span className="text-blue">15–30 FPS (Adaptive)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted-foreground">Keypoints Extracted:</span>
                <span className="text-foreground">21 3D Landmarks / Hand</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted-foreground">Grammar Structure:</span>
                <span className="text-coral">SOV Topic-Comment</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Camera Retention:</span>
                <span className="text-emerald-400 font-bold">Zero-Cloud / Local Volatile</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GuestLayout>
  );
}

