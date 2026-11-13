import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { FileText, ArrowLeft, Check, History } from "lucide-react";
import { BrandMark } from "@/components/common/BrandMark";
import { ThemeSwitch } from "@/components/navigation/Nav";
import ScrollProgress from "@/components/ui/smoothui/scroll-progress";

const FALLBACK_TERMS = {
  version: "2026.2.1",
  effectiveDate: "January 1, 2026",
  revisionDate: "October 28, 2026",
  acceptanceRequired: true,
  history: [
    { version: "2026.2.1", date: "Oct 28, 2026", summary: "Added Indian Sign Language (ISL) dialect specifications." },
    { version: "2026.1.0", date: "Jan 01, 2026", summary: "Initial platform charter and assistive scope definitions." },
  ],
  sections: [
    {
      id: "service_purpose",
      title: "1. Platform Mission & Assistive Scope",
      content:
        "Hastivo is engineered to facilitate natural linguistic communication between Deaf, hard-of-hearing, and hearing individuals using Indian Sign Language (ISL), ASL, and BSL syntactic structures.",
    },
    {
      id: "user_conduct",
      title: "2. Community Conduct & Content Moderation",
      content:
        "Users agree to engage respectfully. Any harassment, discriminatory conduct, or malicious abuse of translation feeds will trigger automated safety flags and potential access restrictions.",
    },
    {
      id: "availability",
      title: "3. Availability & Emergency Limitation",
      content:
        "While Hastivo delivers high-accuracy spatial translation, it is an assistive communication bridge and should not be relied upon as the sole critical communication medium in life-threatening emergency situations.",
    },
    {
      id: "intellectual_property",
      title: "4. Intellectual Property & User Content",
      content:
        "You retain full ownership of the conversations, personal notes, and transcripts created on your account. Hastivo retains rights to the 3D kinematic avatar models, neural glossing algorithms, and interface design.",
    },
  ],
};

/**
 * 10. TERMS & CONDITIONS
 * - FETCH: Published terms and current version.
 * - DISPLAY: Terms text, effective date, and revision history.
 * - INPUT: Acceptance where required.
 */
export default function TermsAndConditionsPage() {
  const [termsData, setTermsData] = useState(FALLBACK_TERMS);
  const [accepted, setAccepted] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // FETCH: Published terms and current version
  useEffect(() => {
    let active = true;
    fetch("/api/v1/legal/terms")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (active && data?.terms) {
          setTermsData(data.terms);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-[100svh] bg-background text-foreground flex flex-col justify-between">
      {/* Top Header */}
      <header className="border-b border-border px-5 py-4 sm:px-10 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <BrandMark size={28} />
          <span className="font-display text-lg font-medium tracking-tight">Hastivo</span>
        </Link>
        <div className="flex items-center gap-4">
          <ThemeSwitch />
          <Link to="/" className="link-action text-sm text-text-2">
            <ArrowLeft size={16} /> Back
          </Link>
        </div>
      </header>

      {/* Main Terms Container */}
      <main className="mx-auto w-full max-w-4xl px-5 py-10 sm:px-10 flex-1 flex flex-col">
        {/* DISPLAY: Header & Dates */}
        <div className="border-b border-border pb-6 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-blue font-semibold uppercase tracking-wider">
              <FileText size={16} />
              <span>User Agreement</span>
            </div>
            {/* Toggle revision history */}
            <button
              onClick={() => setShowHistory((prev) => !prev)}
              className="flex items-center gap-1.5 text-xs font-mono text-text-2 hover:text-foreground cursor-pointer"
            >
              <History size={14} />
              <span>{showHistory ? "Hide Revision History" : "View Revision History"}</span>
            </button>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-medium tracking-tight">
            Terms & Conditions
          </h1>
          <div className="flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs text-text-3 pt-1">
            <span>VERSION: {termsData.version}</span>
            <span>EFFECTIVE: {termsData.effectiveDate}</span>
            <span>LAST REVISED: {termsData.revisionDate}</span>
          </div>
          <div className="pt-2">
            <ScrollProgress variant="bar" />
          </div>
        </div>

        {/* DISPLAY: Revision History Drawer */}
        {showHistory && termsData.history && (
          <div className="mt-4 p-4 border border-border bg-surface-elevated text-xs font-mono space-y-2">
            <span className="font-bold text-foreground uppercase tracking-wider">Revision Archive:</span>
            {termsData.history.map((h, i) => (
              <div key={i} className="flex justify-between border-b border-border/50 pb-1">
                <span className="text-foreground">v{h.version} ({h.date}):</span>
                <span className="text-text-2">{h.summary}</span>
              </div>
            ))}
          </div>
        )}

        {/* DISPLAY: Terms Text */}
        <div className="mt-6 max-h-[55vh] overflow-y-auto pr-3 space-y-6 text-text-2 font-sans text-base leading-relaxed border border-border/60 p-6 bg-surface/50">
          {termsData.sections.map((section) => (
            <section key={section.id} className="space-y-2">
              <h2 className="font-display text-xl font-medium text-foreground tracking-tight">
                {section.title}
              </h2>
              <p>{section.content}</p>
            </section>
          ))}
        </div>

        {/* INPUT: Acceptance where required */}
        {termsData.acceptanceRequired && (
          <div className="mt-8 border-t border-border pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="h-4 w-4 rounded border-border text-coral focus:ring-coral cursor-pointer"
              />
              <span className="text-sm text-foreground">
                I agree to the Hastivo Terms & Conditions (v{termsData.version})
              </span>
            </label>

            <button
              disabled={!accepted}
              onClick={() => window.history.back()}
              className={`px-5 py-2 text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                accepted
                  ? "bg-coral text-white hover:opacity-90 font-semibold shadow-sm"
                  : "bg-border text-text-3 cursor-not-allowed"
              }`}
            >
              <span>Accept Terms & Proceed</span>
              <Check size={14} />
            </button>
          </div>
        )}
      </main>

      {/* Footer Meta */}
      <footer className="border-t border-border px-5 py-4 text-center font-mono text-xs text-text-3">
        Hastivo Spatial Linguistics &bull; Accessible Terms & Conditions
      </footer>
    </div>
  );
}

