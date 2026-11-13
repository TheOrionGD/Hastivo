import { MaskRevealUp, LineByLineSlide, SmoothButton } from "@/components/ui/smoothui";
import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Languages,
  ArrowRightLeft,
  ArrowRight,
  Sparkles,
  RotateCcw,
  AlertTriangle,
  Copy,
  Check,
} from "lucide-react";
import { GuestLayout } from "@/components/guest/GuestLayout";

const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English" },
  { code: "hi", name: "Hindi (हिन्दी)" },
  { code: "ta", name: "Tamil (தமிழ்)" },
  { code: "te", name: "Telugu (తెలుగు)" },
  { code: "isl", name: "ISL Gloss (Sign)" },
];

/**
 * 4. GUEST TRANSLATION
 * - FETCH: Supported languages, translation service configuration, guest usage limits.
 * - DISPLAY: Translation result, source and target language, processing status.
 * - INPUT: Source text, source language, target language, translate action.
 */
export default function GuestTranslationPage() {
  const [sourceText, setSourceText] = useState("Good morning. Welcome to our sign language research platform.");
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("isl");
  const [translationResult, setTranslationResult] = useState("GOOD MORNING WELCOME HASTIVO SIGN PLATFORM");
  const [processing, setProcessing] = useState(false);
  const [usageRemaining, setUsageRemaining] = useState(15);
  const [limitReached, setLimitReached] = useState(false);
  const [copied, setCopied] = useState(false);

  // FETCH: Guest limits
  useEffect(() => {
    let active = true;
    fetch("/api/v1/guest/dashboard")
      .then((r) => (r.ok ? r.json() : null))
      .then((res) => {
        if (active && res?.usageLimits?.translation) {
          setUsageRemaining(res.usageLimits.translation.remaining);
          if (res.usageLimits.translation.remaining <= 0) {
            setLimitReached(true);
          }
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const handleTranslate = async (e) => {
    e?.preventDefault();
    if (!sourceText.trim()) return;

    if (usageRemaining <= 0) {
      setLimitReached(true);
      return;
    }

    setProcessing(true);
    try {
      const res = await fetch("/api/v1/translation/universal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceText,
          sourceLanguage: sourceLang,
          targetLanguage: targetLang,
        }),
      });

      if (res.status === 429) {
        setLimitReached(true);
        return;
      }

      if (res.ok) {
        const data = await res.json();
        setTranslationResult(data.translatedResult || sourceText.toUpperCase());
        setUsageRemaining((prev) => Math.max(0, prev - 1));
      }
    } catch {
      setTranslationResult(sourceText.toUpperCase().split(/\s+/).join(" "));
    } finally {
      setProcessing(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(translationResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <GuestLayout
      activeId="translate"
      title="Guest Universal Translation"
      subtitle="Synthesize English, Hindi, and regional phrases into ISL SOV grammatical structures"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Language Selection Header Bar */}
        <div className="p-4 rounded-2xl border border-border/80 bg-foreground/[0.02] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <select
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-border bg-background text-xs font-mono focus:outline-none"
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.name}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => {
                const tmp = sourceLang;
                setSourceLang(targetLang);
                setTargetLang(tmp);
              }}
              className="p-1.5 rounded-lg hover:bg-foreground/10 text-muted-foreground hover:text-foreground transition-colors"
              title="Swap languages"
            >
              <ArrowRightLeft size={16} />
            </button>

            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-border bg-background text-xs font-mono focus:outline-none"
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground">
            <span>Quota Remaining:</span>
            <span className="font-bold text-coral">{usageRemaining} / 15</span>
          </div>
        </div>

        {/* Translation Split Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Source Input */}
          <div className="p-5 rounded-2xl border border-border bg-foreground/[0.01] space-y-3 flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground block mb-2">
                Source Input Text
              </span>
              <textarea
                rows={6}
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                placeholder="Type or paste sentences here..."
                className="w-full bg-transparent border-0 focus:outline-none text-base resize-none text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-border/50 text-xs font-mono text-muted-foreground">
              <span>{sourceText.length} characters</span>
              <button
                type="button"
                onClick={handleTranslate}
                disabled={processing || limitReached}
                className="px-4 py-2 rounded-xl bg-coral text-charcoal font-medium hover:opacity-90 transition-opacity flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-sm"
              >
                <span>{processing ? "Translating..." : "Translate"}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Target Output */}
          <div className="p-5 rounded-2xl border border-blue/40 bg-blue/5 space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono uppercase tracking-wider text-blue font-semibold">
                  ISL Grammatical Translation
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="p-1 rounded hover:bg-blue/10 text-muted-foreground hover:text-foreground transition-colors"
                  title="Copy result"
                >
                  {copied ? <Check size={15} className="text-emerald-400" /> : <Copy size={15} />}
                </button>
              </div>
              <div className="font-display text-xl sm:text-2xl font-bold tracking-tight text-foreground leading-relaxed">
                {translationResult || "Translation will appear here."}
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-border/50 text-xs font-mono text-muted-foreground">
              <span>Syntax: Subject-Object-Verb (SOV)</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <Sparkles size={13} /> Synthesized
              </span>
            </div>
          </div>
        </div>

        {/* Quota reached notice */}
        {limitReached && (
          <div className="p-4 rounded-xl border border-coral/40 bg-coral/10 text-xs space-y-2">
            <div className="flex items-center gap-1.5 font-semibold text-coral">
              <AlertTriangle size={15} /> Guest Translation Limit Reached
            </div>
            <p className="text-[11px] text-muted-foreground">
              You have exhausted your 15 guest translations. Upgrading with your Google account takes seconds and
              preserves all previous session records.
            </p>
            <Link
              to="/upgrade-account"
              className="inline-flex py-2 px-4 rounded-lg bg-coral text-charcoal font-semibold text-xs items-center gap-1.5"
            >
              <Sparkles size={14} /> Upgrade to Permanent Citizen Account
            </Link>
          </div>
        )}
      </div>
    </GuestLayout>
  );
}

