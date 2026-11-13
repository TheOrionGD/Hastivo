import { MaskRevealUp, LineByLineSlide, SpringScaleIn } from "@/components/ui/smoothui";
import React, { useState } from "react";
import { Languages, ArrowLeftRight, Copy, Check } from "lucide-react";
import { HastivoUserLayout } from "@/components/layout/HastivoUserLayout";
import { GlassPanel } from "@/components/glass/GlassPanel";
import { GlassButton } from "@/components/glass/GlassControls";
import { useLanguage } from "@/hooks/useLanguage";

export default function TranslationWorkspacePage() {
  const { currentLang, t, supportedLanguages, meta } = useLanguage();
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState(() => (currentLang === "en" ? "hi" : currentLang));
  const [isTranslating, setIsTranslating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    setIsTranslating(true);
    try {
      const res = await fetch("/api/v1/translation/universal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: sourceText,
          sourceLanguage: sourceLang,
          targetLanguage: targetLang,
        }),
      });
      const data = await res.json();
      if (data?.translatedText) {
        setTranslatedText(data.translatedText);
      } else {
        setTranslatedText(sourceText);
      }
    } catch {
      setTranslatedText("Translation unavailable.");
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSwap = () => {
    const temp = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(temp);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  return (
    <HastivoUserLayout
      title={t.translationTitle}
      subtitle={t.translationSubtitle}
    >
      <div className="mb-6">
        <h1 className="font-heading text-3xl font-bold text-foreground">
          {t.translationTitle}
        </h1>
        <p className="font-sans text-sm text-text-2 mt-1">
          Translate between English, Hindi, Tamil, Telugu, Kannada, Malayalam, and Urdu with sign-semantic and grammar alignment.
        </p>
      </div>

      <GlassPanel elevation="z2" className="p-6">
        <div className="flex items-center justify-between gap-4 mb-4 pb-4 border-b border-border/60">
          <select
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            className="rounded-xl bg-surface border border-border px-4 py-2 text-sm text-foreground outline-none"
          >
            {supportedLanguages.map((l) => (
              <option key={l.code} value={l.code}>
                {l.nativeName} ({l.name})
              </option>
            ))}
          </select>

          <button
            onClick={handleSwap}
            className="p-2 rounded-xl bg-surface hover:bg-surface/80 border border-border text-text-2 hover:text-foreground"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>

          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="rounded-xl bg-surface border border-border px-4 py-2 text-sm text-foreground outline-none"
          >
            {supportedLanguages.map((l) => (
              <option key={l.code} value={l.code}>
                {l.nativeName} ({l.name})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <textarea
              rows={8}
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder="Enter text here..."
              className="w-full rounded-2xl bg-surface/50 border border-border p-4 text-sm font-sans text-foreground outline-none focus:border-blue"
            />
          </div>

          <div className="relative">
            <div className="w-full h-full min-h-[200px] rounded-2xl bg-surface/30 border border-border/80 p-4 text-sm font-sans text-foreground">
              {translatedText || <span className="text-text-3 italic">Translation output will appear here...</span>}
            </div>

            {translatedText && (
              <button
                onClick={() => {
                  navigator.clipboard.writeText(translatedText);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="absolute bottom-4 right-4 p-2 rounded-xl bg-surface border border-border text-xs text-text-2 hover:text-foreground flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? t.copied : t.copy}
              </button>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <GlassButton
            variant="primary"
            loading={isTranslating}
            onClick={handleTranslate}
          >
            {t.translateText}
          </GlassButton>
        </div>
      </GlassPanel>
    </HastivoUserLayout>
  );
}
