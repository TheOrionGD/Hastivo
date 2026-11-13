import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Moon, Sun, Check, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/common/BrandMark";
import { AvatarStage } from "@/components/three/AvatarStage";
import { useTheme } from "@/context/ThemeContext";
import { onboardingChapters, nextChapter } from "./onboardingContent";
import {
  SUPPORTED_LANGUAGES,
  getStoredLanguage,
  setStoredLanguage,
} from "@/lib/multilingual";

const accents = { coral: "text-coral", blue: "text-blue", yellow: "text-yellow" };
const progressColors = { coral: "bg-coral", blue: "bg-blue", yellow: "bg-yellow" };

function ChapterArtwork({ motif, accent, selectedLanguage, onSelectLanguage }) {
  if (motif === "language_selection") {
    return (
      <div className="w-full max-w-md p-4 rounded-3xl bg-surface/85 backdrop-blur-xl border border-border/80 shadow-2xl space-y-2 z-10">
        <div className="flex items-center gap-2 mb-3 px-2">
          <Globe className="w-4 h-4 text-blue" />
          <span className="text-xs font-semibold text-text-2 uppercase tracking-wider">
            Available Languages & Scripts
          </span>
        </div>
        <div className="grid grid-cols-1 gap-1.5 max-h-[280px] overflow-y-auto pr-1">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = selectedLanguage === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => onSelectLanguage(lang.code)}
                className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  isSelected
                    ? "bg-blue/15 border-blue text-foreground font-semibold shadow-sm"
                    : "bg-surface/50 border-border/70 text-text-2 hover:bg-surface hover:text-foreground"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{lang.nativeName}</span>
                    <span className="text-xs text-text-3">({lang.name})</span>
                  </div>
                  <span className="text-[11px] text-text-3 block mt-0.5">
                    {lang.greeting} • {lang.script} script
                  </span>
                </div>
                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-blue text-charcoal flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={`onboarding-art ${accents[accent]}`} aria-hidden="true">
      {motif === "connection" && <div className="onboarding-equation">You <span>↔</span> Me</div>}
      {motif === "words" && <div className="onboarding-equation">Hello<span className="text-foreground">.</span></div>}
      {motif === "meaning" && <div className="onboarding-equation">movement <span>→</span> meaning</div>}
      {motif === "conversation" && <div className="onboarding-equation">Speak <span>↔</span> Sign</div>}
      {motif === "expression" && <div className="onboarding-equation">Hands / Face / Space</div>}
      {motif === "accessibility" && <div className="onboarding-equation">For you. <span>For everyone.</span></div>}
      {motif === "welcome" && <div className="onboarding-equation">Hastivo<span className="text-foreground">.</span></div>}
    </div>
  );
}

/** Eight user-paced editorial chapters including stage 8 Multilingual Selection */
export function Onboarding({ onDone }) {
  const [index, setIndex] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState(() => getStoredLanguage());
  const dialog = useRef(null);
  const heading = useRef(null);
  const { theme, toggle } = useTheme();
  const current = onboardingChapters[index];

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const footer = document.querySelector(".site-footer");
    const wasInert = footer?.inert;
    if (footer) footer.inert = true;
    return () => {
      document.body.style.overflow = previousOverflow;
      if (footer) footer.inert = wasInert ?? false;
    };
  }, []);

  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
    dialog.current?.scrollTo({ top: 0, behavior: "instant" });
  }, [index]);

  function handleLanguageSelect(code) {
    setSelectedLanguage(code);
    setStoredLanguage(code);
  }

  function advance() {
    const next = nextChapter(index);
    if (next === null) {
      setStoredLanguage(selectedLanguage);
      onDone();
    } else {
      setIndex(next);
    }
  }

  function handleKeys(event) {
    if (event.key !== "Tab") return;
    const controls = dialog.current?.querySelectorAll('button:not([disabled]), [href], [tabindex="0"]');
    if (!controls?.length) return;
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && (document.activeElement === first || document.activeElement === heading.current)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <section ref={dialog} role="dialog" aria-modal="true" aria-labelledby="onboarding-heading" aria-describedby="onboarding-description" onKeyDown={handleKeys} className="onboarding-shell" data-onboarding-step={index + 1}>
      <header className="onboarding-header">
        <div className="flex items-center gap-3"><BrandMark size={32} /><span className="font-display text-xl font-medium">Hastivo</span></div>
        <div className="flex items-center gap-2 sm:gap-6">
          <Button variant="ghost" size="icon" className="h-11 w-11" onClick={toggle} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`} title="Change theme">{theme === "dark" ? <Sun /> : <Moon />}</Button>
          <Button variant="ghost" className="h-11 text-text-2" onClick={onDone}>Skip introduction <ArrowRight /></Button>
        </div>
      </header>

      <div className="onboarding-body">
        <div className="onboarding-copy" key={index}>
          <p className="mb-6 flex items-center gap-3 text-sm text-text-2 md:mb-10"><span className={`h-2 w-2 rounded-full ${progressColors[current.accent]}`} /><span>{current.chapter}</span></p>
          <h1 ref={heading} id="onboarding-heading" tabIndex={-1} className="onboarding-heading font-display font-medium">
            {current.title.map((line, i) => <span key={line} className={`block ${i === current.title.length - 1 ? accents[current.accent] : ""}`}>{line}</span>)}
          </h1>
          <p id="onboarding-description" className="mt-7 max-w-lg text-lg leading-relaxed text-text-2 md:mt-9 md:text-xl">{current.body}</p>
        </div>
        <div className="onboarding-visual">
          <span className="onboarding-folio font-display text-text-3" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
          {index !== 7 && <AvatarStage className="onboarding-avatar" />}
          <ChapterArtwork
            motif={current.motif}
            accent={current.accent}
            selectedLanguage={selectedLanguage}
            onSelectLanguage={handleLanguageSelect}
          />
          <p className="onboarding-caption text-xs text-text-2">
            {index === 7
              ? "Languages update greetings, sign grammar, and AI prompts across all screens"
              : index === 4
              ? "Decorative gestures · not sign-language translation"
              : "A platform in development. A future worth sharing."}
          </p>
        </div>
      </div>

      <footer className="onboarding-controls">
        <div className="onboarding-progress">
          <span className="text-xs text-text-2" aria-live="polite">{current.note}</span>
          <nav aria-label="Introduction chapters" className="mt-3 flex gap-1">
            {onboardingChapters.map((chapter, i) => <Button key={chapter.note} variant="ghost" aria-label={`Go to chapter ${i + 1}`} aria-current={i === index ? "step" : undefined} onClick={() => setIndex(i)} className="h-11 flex-1 rounded-none px-1 hover:bg-transparent"><span className={`h-0.5 w-full ${i <= index ? progressColors[current.accent] : "bg-border"}`} /></Button>)}
          </nav>
        </div>
        <div className="flex items-center justify-end gap-3 sm:gap-5">
          <Button variant="ghost" size="icon" className="h-12 w-12" aria-label="Previous chapter" title="Previous chapter" disabled={index === 0} onClick={() => setIndex((value) => Math.max(0, value - 1))}><ArrowLeft /></Button>
          <Button className="h-12 min-w-36 rounded-md px-6 shadow-none" onClick={advance}>{index === 7 ? "Explore Hastivo" : "Continue"}<ArrowRight /></Button>
        </div>
      </footer>
    </section>
  );
}
