import { RevealText, PerWordCrossfade, FloatInput, AnimatedStepper, BorderBeam } from "@/components/ui/smoothui";
import React, { useState } from "react";
import {
  Layers,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Sliders,
  CheckCircle2,
} from "lucide-react";
import { HastivoUserLayout } from "@/components/layout/HastivoUserLayout";
import { GlassPanel } from "@/components/glass/GlassPanel";
import { GlassButton } from "@/components/glass/GlassControls";
import AvatarScene from "@/components/three/AvatarScene";
import { useLanguage } from "@/hooks/useLanguage";

export default function TextToSignStudioPage() {
  const { currentLang, t, meta } = useLanguage();

  const defaultSample = {
    en: "Welcome to Hastivo assistive sign language communication.",
    hi: "हस्तिवो सहायक सांकेतिक भाषा संचार में आपका स्वागत है।",
    ta: "ஹஸ்டிவோ உதவி சைகை மொழி தகவல்தொடர்புக்கு வரவேற்கிறோம்.",
    te: "హస్తివో సహాయక సంకేత భాషా కమ్యూనికేషన్‌కు స్వాగతం.",
    kn: "ಹಸ್ತಿವೋ ಸಹಾಯಕ ಸಂಕೇತ ಭಾಷಾ ಸಂವಹನಕ್ಕೆ ಸುಸ್ವಾಗತ.",
    ml: "ഹസ്റ്റിവോ സഹായക ആംഗ്യഭാഷാ ആശയവിനിമയത്തിലേക്ക് സ്വാഗതം.",
    ur: "ہستیوو معاون اشاروں کی زبان کے مواصلات میں خوش آمدید۔",
  };

  const [inputText, setInputText] = useState(() => defaultSample[currentLang] || defaultSample.en);
  const [tokens, setTokens] = useState(["Welcome", "Hastivo", "assistive", "sign", "language"]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [selectedAvatar, setSelectedAvatar] = useState("x-bot");

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    try {
      const res = await fetch("/api/v1/translation/text-to-sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText, language: currentLang }),
      });
      const data = await res.json();
      if (data?.signs) {
        setTokens(data.signs.map((s) => s.word || s.signId || s));
      } else {
        setTokens(inputText.trim().split(/\s+/));
      }
      setIsPlaying(true);
      setCurrentWordIndex(0);
    } catch {
      setTokens(inputText.trim().split(/\s+/));
      setIsPlaying(true);
      setCurrentWordIndex(0);
    }
  };

  return (
    <HastivoUserLayout
      title={t.textToSignTitle}
      subtitle={t.textToSignSubtitle}
    >
      <div className="mb-6">
        <h1 className="font-heading text-3xl font-bold text-foreground">
          {t.textToSignTitle}
        </h1>
        <p className="font-sans text-sm text-text-2 mt-1">
          {t.textToSignDesc}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: 3D Avatar Workspace (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <GlassPanel elevation="z2" className="p-4 sm:p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/40">
              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-coral" />
                Active Avatar Rig
              </span>
              <div className="flex items-center gap-1.5 bg-surface/80 p-1 rounded-xl border border-border/60">
                {[
                  { id: "x-bot", label: "X-Bot (F)" },
                  { id: "y-bot", label: "Y-Bot (M)" },
                  { id: "default", label: "Procedural" },
                ].map((av) => (
                  <button
                    key={av.id}
                    onClick={() => setSelectedAvatar(av.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                      selectedAvatar === av.id
                        ? "bg-coral text-white shadow-sm font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {av.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden bg-charcoal/90 aspect-square sm:aspect-video border border-border/80">
              <AvatarScene className="h-full w-full" modelType={selectedAvatar} />

              {/* Active Word Highlight Overlay */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between p-3 rounded-2xl bg-charcoal/80 backdrop-blur-md border border-white/10">
                <div className="flex items-center gap-2 overflow-x-auto py-1">
                  {tokens.map((token, idx) => (
                    <span
                      key={idx}
                      className={`px-2.5 py-1 rounded-xl text-xs font-sans transition-all whitespace-nowrap ${
                        idx === currentWordIndex
                          ? "bg-yellow text-charcoal font-bold shadow-md scale-105"
                          : "text-text-3 bg-white/5"
                      }`}
                    >
                      {token}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex gap-2">
                <GlassButton
                  variant="primary"
                  icon={isPlaying ? Pause : Play}
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? t.pauseSequence : t.playSequence}
                </GlassButton>
                <GlassButton
                  variant="glass"
                  icon={RotateCcw}
                  onClick={() => setCurrentWordIndex(0)}
                >
                  {t.replay}
                </GlassButton>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-text-3">Speed:</span>
                {[0.75, 1, 1.25].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => setPlaybackSpeed(speed)}
                    className={`px-2 py-1 rounded-lg text-xs font-semibold border ${
                      playbackSpeed === speed
                        ? "bg-coral text-charcoal border-coral"
                        : "bg-surface/50 border-border text-text-2"
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>
          </GlassPanel>
        </div>

        {/* Right Column: Text Input & Translation Options (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <GlassPanel elevation="z2" className="p-6">
            <h3 className="font-heading text-xl font-bold text-foreground mb-3">
              Input Text ({meta.nativeName})
            </h3>

            <textarea
              dir={meta.dir}
              rows={5}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Enter sentence in ${meta.name} to translate to sign language...`}
              className="w-full rounded-2xl bg-surface/50 border border-border/80 p-4 text-sm font-sans text-foreground outline-none focus:border-blue mb-4"
            />

            <GlassButton
              variant="primary"
              className="w-full"
              onClick={handleTranslate}
            >
              {t.synthesizeSequence}
            </GlassButton>
          </GlassPanel>
        </div>
      </div>
    </HastivoUserLayout>
  );
}
