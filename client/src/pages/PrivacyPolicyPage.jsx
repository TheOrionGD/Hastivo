import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { Shield, ArrowLeft, Check, Globe } from "lucide-react";
import { BrandMark } from "@/components/common/BrandMark";
import { ThemeSwitch } from "@/components/navigation/Nav";
import ScrollProgress from "@/components/ui/smoothui/scroll-progress";

const EASE = [0.22, 1, 0.36, 1];

const FALLBACK_POLICY = {
  version: "2026.3.0",
  effectiveDate: "January 15, 2026",
  revisionDate: "November 12, 2026",
  requiresAcknowledgement: true,
  sections: [
    {
      id: "camera_telemetry",
      title: "1. Camera Feeds & Gesture Telemetry",
      content:
        "Hastivo processes video frames strictly in volatile device memory to extract skeletal landmarks. No raw webcam footage is uploaded, stored, recorded, or transmitted to remote servers.",
    },
    {
      id: "conversation_history",
      title: "2. User-Owned Conversation Transcripts",
      content:
        "Transcripts and sign gloss sequences are encrypted and remain under your strict sovereignty. You can inspect, export, or permanently erase your dialogue records at any moment.",
    },
    {
      id: "voice_audio",
      title: "3. Voice & Audio Data",
      content:
        "Audio recorded for spoken translation is converted into phonetic tokens and instantly synthesized into sign animations. Audio clips are never used for commercial profiling.",
    },
    {
      id: "third_party",
      title: "4. Third-Party Sharing & Compliance",
      content:
        "Hastivo adheres to strict privacy-by-design standards and does not sell, trade, or monetize personal identification data.",
    },
  ],
};

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी (Hindi)" },
  { code: "ta", label: "தமிழ் (Tamil)" },
  { code: "te", label: "తెలుగు (Telugu)" },
  { code: "ur", label: "اردو (Urdu)" },
];

/**
 * 9. PRIVACY POLICY
 * - FETCH: Published privacy policy and its version.
 * - DISPLAY: Policy text, effective date, revision date.
 * - INPUT: Scroll, language selection, acknowledgement if required.
 */
export default function PrivacyPolicyPage() {
  const reduce = useReducedMotion();
  const [policyData, setPolicyData] = useState(FALLBACK_POLICY);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [acknowledged, setAcknowledged] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // FETCH: Published privacy policy and version
  useEffect(() => {
    let active = true;
    fetch("/api/v1/legal/privacy")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (active && data?.policy) {
          setPolicyData(data.policy);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  // INPUT: Scroll progress tracking
  const handleScroll = (e) => {
    const el = e.currentTarget;
    const progress = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100;
    setScrollProgress(Math.min(100, Math.round(progress || 0)));
  };

  return (
    <div className="min-h-[100svh] bg-background text-foreground flex flex-col justify-between">
      {/* Top Header */}
      <header className="border-b border-border px-5 py-4 sm:px-10 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <BrandMark size={28} />
          <span className="font-display text-lg font-medium tracking-tight">Hastivo</span>
        </Link>
        <div className="flex items-center gap-4">
          {/* INPUT: Language Selection */}
          <div className="flex items-center gap-1.5 border border-border px-2.5 py-1 text-xs font-mono">
            <Globe size={14} className="text-blue" />
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="bg-transparent text-foreground outline-none cursor-pointer text-xs"
              aria-label="Select policy language"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code} className="bg-background text-foreground">
                  {l.label}
                </option>
              ))}
            </select>
          </div>
          <ThemeSwitch />
          <Link to="/" className="link-action text-sm text-text-2">
            <ArrowLeft size={16} /> Back
          </Link>
        </div>
      </header>

      {/* Main Policy Content Container */}
      <main className="mx-auto w-full max-w-4xl px-5 py-10 sm:px-10 flex-1 flex flex-col">
        {/* DISPLAY: Header & Version Dates */}
        <div className="border-b border-border pb-6 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-coral font-semibold uppercase tracking-wider">
            <Shield size={16} />
            <span>Official Policy Document</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-medium tracking-tight">
            Privacy Policy
          </h1>
          <div className="flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs text-text-3 pt-1">
            <span>VERSION: {policyData.version}</span>
            <span>EFFECTIVE: {policyData.effectiveDate}</span>
            <span>LAST REVISED: {policyData.revisionDate}</span>
          </div>
        </div>

        {/* Reading Progress Indicator */}
        <div className="w-full mt-4">
          <ScrollProgress variant="bar" />
        </div>

        {/* INPUT & DISPLAY: Scrollable Policy Text */}
        <div
          onScroll={handleScroll}
          className="mt-6 max-h-[55vh] overflow-y-auto pr-3 space-y-6 text-text-2 font-sans text-base leading-relaxed border border-border/60 p-6 bg-surface/50"
        >
          {policyData.sections.map((section) => (
            <section key={section.id} className="space-y-2">
              <h2 className="font-display text-xl font-medium text-foreground tracking-tight">
                {section.title}
              </h2>
              <p>{section.content}</p>
            </section>
          ))}
        </div>

        {/* INPUT: Acknowledgement checkbox */}
        {policyData.requiresAcknowledgement && (
          <div className="mt-8 border-t border-border pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={acknowledged}
                onChange={(e) => setAcknowledged(e.target.checked)}
                className="h-4 w-4 rounded border-border text-coral focus:ring-coral cursor-pointer"
              />
              <span className="text-sm text-foreground">
                I have read and understand the Hastivo Privacy Policy (v{policyData.version})
              </span>
            </label>

            <button
              disabled={!acknowledged}
              onClick={() => window.history.back()}
              className={`px-5 py-2 text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                acknowledged
                  ? "bg-foreground text-background hover:opacity-90 font-semibold"
                  : "bg-border text-text-3 cursor-not-allowed"
              }`}
            >
              <span>Acknowledge & Continue</span>
              <Check size={14} />
            </button>
          </div>
        )}
      </main>

      {/* Footer Meta */}
      <footer className="border-t border-border px-5 py-4 text-center font-mono text-xs text-text-3">
        Hastivo Spatial Linguistics &bull; Privacy By Design Architecture
      </footer>
    </div>
  );
}

