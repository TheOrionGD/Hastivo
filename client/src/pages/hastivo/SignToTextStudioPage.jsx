import { RollingText, TypewriterText, BorderBeam, Meter, SmoothButton } from "@/components/ui/smoothui";
import React, { useState, useEffect, useRef } from "react";
import {
  Camera,
  Play,
  Square,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Sliders,
  Copy,
  Volume2,
} from "lucide-react";
import { HastivoUserLayout } from "@/components/layout/HastivoUserLayout";
import { GlassPanel } from "@/components/glass/GlassPanel";
import { GlassButton } from "@/components/glass/GlassControls";
import { useLanguage } from "@/hooks/useLanguage";

export default function SignToTextStudioPage() {
  const { currentLang, t, meta, supportedLanguages, changeLanguage } = useLanguage();
  const [recognizing, setRecognizing] = useState(false);
  const [recognizedSentence, setRecognizedSentence] = useState("");
  const [confidence, setConfidence] = useState(0.96);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [copied, setCopied] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(null);

  const startCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
      setRecognizing(true);
      // Simulated recognized sentence localized to user's language
      setTimeout(() => {
        setRecognizedSentence(
          currentLang === "hi"
            ? "मैं हस्तिवो के माध्यम से भारतीय सांकेतिक भाषा समझता हूँ।"
            : currentLang === "ta"
            ? "நான் ஹஸ்டிவோ மூலம் இந்திய சைகை மொழியைப் புரிந்துகொள்கிறேன்."
            : currentLang === "te"
            ? "నేను హస్తివో ద్వారా భారతీయ సంకేత భాషను అర్థం చేసుకున్నాను."
            : currentLang === "kn"
            ? "ನಾನು ಹಸ್ತಿವೋ ಮೂಲಕ ಭಾರತೀಯ ಸಂಕೇತ ಭಾಷೆಯನ್ನು ಅರ್ಥಮಾಡಿಕೊಂಡಿದ್ದೇನೆ."
            : currentLang === "ml"
            ? "ഹസ്റ്റിവോ വഴി ഞാൻ ഇന്ത്യൻ ആംഗ്യഭാഷ മനസ്സിലാക്കുന്നു."
            : currentLang === "ur"
            ? "میں ہستیوو کے ذریعے ہندوستانی اشاروں کی زبان سمجھتا ہوں۔"
            : "I understand Indian Sign Language through Hastivo."
        );
      }, 2500);
    } catch (err) {
      setCameraError("Camera permission denied or camera device unavailable.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setRecognizing(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <HastivoUserLayout
      title={t.signToTextTitle}
      subtitle={t.signToTextSubtitle}
    >
      <div className="mb-6">
        <h1 className="font-heading text-3xl font-bold text-foreground">
          {t.signToTextTitle}
        </h1>
        <p className="font-sans text-sm text-text-2 mt-1">
          {t.signToTextDesc}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Camera Feed & Tracking Canvas (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <GlassPanel elevation="z2" className="p-4 sm:p-6 overflow-hidden">
            <div className="relative rounded-2xl overflow-hidden bg-charcoal aspect-video border border-border/80 flex items-center justify-center">
              <video
                ref={videoRef}
                playsInline
                muted
                className={`w-full h-full object-cover ${cameraActive ? "block" : "hidden"}`}
              />
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
              />

              {!cameraActive && (
                <div className="text-center p-6 text-text-3">
                  <Camera className="w-12 h-12 mx-auto mb-2 opacity-50 text-coral" />
                  <p className="font-sans text-sm">
                    Camera preview is inactive. Click "{t.startCamera}" to begin gesture recognition.
                  </p>
                </div>
              )}

              {/* Status Badge */}
              {cameraActive && (
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-charcoal/80 backdrop-blur-md text-xs text-white border border-white/10 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-coral animate-pulse" />
                  ISL Tracking Active ({meta.name})
                </div>
              )}
            </div>

            {/* Error Message */}
            {cameraError && (
              <div className="mt-3 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {cameraError}
              </div>
            )}

            {/* Controls Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
              <div className="flex gap-2">
                {!cameraActive ? (
                  <GlassButton variant="primary" icon={Play} onClick={startCamera}>
                    {t.startCamera}
                  </GlassButton>
                ) : (
                  <GlassButton variant="danger" icon={Square} onClick={stopCamera}>
                    {t.stopCamera}
                  </GlassButton>
                )}
                <GlassButton
                  variant="glass"
                  icon={RotateCcw}
                  onClick={() => setRecognizedSentence("")}
                >
                  {t.clearOutput}
                </GlassButton>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-text-3">{t.targetLanguage}:</span>
                <select
                  value={currentLang}
                  onChange={(e) => changeLanguage(e.target.value)}
                  className="rounded-xl bg-surface border border-border px-3 py-1.5 text-xs text-foreground outline-none"
                >
                  {supportedLanguages.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.nativeName} ({l.name})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </GlassPanel>
        </div>

        {/* Right Column: Transcription & Confidence Metrics (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <GlassPanel elevation="z2" className="p-6">
            <h3 className="font-heading text-xl font-bold text-foreground mb-3 flex items-center justify-between">
              <span>{t.signToText}</span>
              <span className="text-xs font-mono text-emerald-400 font-normal">
                {t.confidence}: {Math.round(confidence * 100)}%
              </span>
            </h3>

            <div
              dir={meta.dir}
              className="min-h-[160px] p-4 rounded-2xl bg-surface/60 border border-border/70 font-sans text-base text-foreground mb-4"
            >
              {recognizedSentence || (
                <span className="text-text-3 italic">
                  Recognized ISL sentence will stream here as you sign in {meta.name}...
                </span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <GlassButton
                variant="glass"
                size="sm"
                icon={Copy}
                onClick={() => {
                  if (recognizedSentence) {
                    navigator.clipboard.writeText(recognizedSentence);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }
                }}
              >
                {copied ? t.copied : t.copy}
              </GlassButton>

              <GlassButton
                variant="secondary"
                size="sm"
                icon={Volume2}
                onClick={() => {
                  if (recognizedSentence && window.speechSynthesis) {
                    const utter = new SpeechSynthesisUtterance(recognizedSentence);
                    window.speechSynthesis.speak(utter);
                  }
                }}
              >
                {t.speakText}
              </GlassButton>
            </div>
          </GlassPanel>
        </div>
      </div>
    </HastivoUserLayout>
  );
}
