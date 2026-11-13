import { WaveText, BottomUpLetters, SiriOrb, SmoothButton } from "@/components/ui/smoothui";
import React, { useState } from "react";
import { Mic, MicOff, Volume2, Play, Square, RotateCcw } from "lucide-react";
import { HastivoUserLayout } from "@/components/layout/HastivoUserLayout";
import { GlassPanel } from "@/components/glass/GlassPanel";
import { GlassButton } from "@/components/glass/GlassControls";
import { useLanguage } from "@/hooks/useLanguage";

export default function SpeechStudioPage() {
  const { currentLang, t, meta } = useLanguage();
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");

  const sampleVoiceTexts = {
    en: "Hello, welcome to Hastivo Speech Synthesis Studio.",
    hi: "नमस्ते, हस्तिवो वाक् संश्लेषण स्टूडियो में आपका स्वागत है।",
    ta: "வணக்கம், ஹஸ்டிவோ பேச்சு தொகுப்பு ஸ்டுடியோவிற்கு வரவேற்கிறோம்.",
    te: "నమస్కారం, హస్తివో స్పీచ్ సింథసిస్ స్టూడియోకు స్వాగతం.",
    kn: "ನಮಸ್ಕಾರ, ಹಸ್ತಿವೋ ವಾಕ್ ಸಂಶ್ಲೇಷಣಾ ಸ್ಟುಡಿಯೋಗೆ ಸುಸ್ವಾಗತ.",
    ml: "നമസ്കാരം, ഹസ്റ്റിവോ സ്പീച്ച് സിന്തസിസ് സ്റ്റുഡിയോയിലേക്ക് സ്വാഗതം.",
    ur: "السلام علیکم، ہستیوو اسپیچ سنتھیسس اسٹوڈیو میں خوش آمدید۔",
  };

  const [synthText, setSynthText] = useState(() => sampleVoiceTexts[currentLang] || sampleVoiceTexts.en);

  const toggleRecording = () => {
    if (!recording) {
      setRecording(true);
      // Fallback demonstration transcription localized
      setTimeout(() => {
        setTranscript(
          currentLang === "hi"
            ? "भारतीय सांकेतिक भाषा सभी समुदायों में प्राकृतिक पहुंच प्रदान करती है।"
            : currentLang === "ta"
            ? "இந்திய சைகை மொழி சமூகங்கள் முழுவதும் இயற்கையான அணுகலை வழங்குகிறது."
            : currentLang === "te"
            ? "భారతీయ సంకేత భాష సమాజాల అంతటా సహజ ప్రాప్యతను అందిస్తుంది."
            : currentLang === "kn"
            ? "ಭಾರತೀಯ ಸಂಕೇತ ಭಾಷೆಯು ಸಮುದಾಯಗಳಾದ್ಯಂತ ನೈಸರ್ಗಿಕ ಪ್ರವೇಶವನ್ನು ಒದಗಿಸುತ್ತದೆ."
            : currentLang === "ml"
            ? "ഇന്ത്യൻ ആംഗ്യഭാഷ കമ്മ്യൂണിറ്റികളിൽ ഉടനീളം സ്വാഭാവിക പ്രവേശനക്ഷമത നൽകുന്നു."
            : currentLang === "ur"
            ? "ہندوستانی اشاروں کی زبان تمام برادریوں میں قدرتی رسائی فراہم کرتی ہے۔"
            : "Indian Sign Language provides natural accessibility across communities."
        );
        setRecording(false);
      }, 3000);
    } else {
      setRecording(false);
    }
  };

  const speakText = () => {
    if (!synthText.trim() || !window.speechSynthesis) return;
    const utter = new SpeechSynthesisUtterance(synthText);
    utter.lang = currentLang;
    window.speechSynthesis.speak(utter);
  };

  return (
    <HastivoUserLayout
      title={t.speechTitle}
      subtitle={t.speechSubtitle}
    >
      <div className="mb-6">
        <h1 className="font-heading text-3xl font-bold text-foreground">
          {t.speechTitle}
        </h1>
        <p className="font-sans text-sm text-text-2 mt-1">
          Convert speech audio into accessible text transcripts, or synthesize written sentences into expressive natural speech voices in {meta.name}.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Speech-to-Text */}
        <GlassPanel elevation="z2" className="p-6">
          <h2 className="font-heading text-xl font-bold text-foreground mb-4">
            Speech-to-Text (STT) — {meta.nativeName}
          </h2>

          <div
            dir={meta.dir}
            className="min-h-[140px] p-4 rounded-2xl bg-surface/50 border border-border/70 text-sm font-sans text-foreground mb-4"
          >
            {transcript || <span className="text-text-3 italic">Click record and speak into your microphone in {meta.name}...</span>}
          </div>

          <GlassButton
            variant={recording ? "danger" : "primary"}
            icon={recording ? Square : Mic}
            onClick={toggleRecording}
          >
            {recording ? t.stopRecording : t.startRecording}
          </GlassButton>
        </GlassPanel>

        {/* Right: Text-to-Speech */}
        <GlassPanel elevation="z2" className="p-6">
          <h2 className="font-heading text-xl font-bold text-foreground mb-4">
            Text-to-Speech (TTS) — {meta.name} Voice
          </h2>

          <textarea
            dir={meta.dir}
            rows={4}
            value={synthText}
            onChange={(e) => setSynthText(e.target.value)}
            className="w-full rounded-2xl bg-surface/50 border border-border/70 p-4 text-sm font-sans text-foreground outline-none focus:border-blue mb-4"
          />

          <GlassButton
            variant="secondary"
            icon={Volume2}
            onClick={speakText}
          >
            {t.synthesizeVoice}
          </GlassButton>
        </GlassPanel>
      </div>
    </HastivoUserLayout>
  );
}
