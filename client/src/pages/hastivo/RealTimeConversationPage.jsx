import { DepthParallaxWords, ScrambleHover, SharedAxisX, AgentAvatar } from "@/components/ui/smoothui";
import React, { useState } from "react";
import {
  Users,
  Video,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  PhoneOff,
  Volume2,
} from "lucide-react";
import { HastivoUserLayout } from "@/components/layout/HastivoUserLayout";
import { GlassPanel } from "@/components/glass/GlassPanel";
import { GlassButton } from "@/components/glass/GlassControls";
import { useLanguage } from "@/hooks/useLanguage";

export default function RealTimeConversationPage() {
  const { currentLang, t, meta } = useLanguage();
  const [inCall, setInCall] = useState(false);
  const [micActive, setMicActive] = useState(true);
  const [cameraActive, setCameraActive] = useState(true);

  const localizedPrompts = {
    en: {
      speech: "Hello! Can you understand my voice?",
      sign: "Yes, I am signing back through Hastivo.",
    },
    hi: {
      speech: "नमस्ते! क्या आप मेरी आवाज़ समझ पा रहे हैं?",
      sign: "हाँ, मैं हस्तिवो के माध्यम से वापस संकेत कर रहा हूँ।",
    },
    ta: {
      speech: "வணக்கம்! எனது குரல் உங்களுக்குப் புரிகிறதா?",
      sign: "ஆம், நான் ஹஸ்டிவோ மூலம் மீண்டும் சைகை செய்கிறேன்.",
    },
    te: {
      speech: "నమస్కారం! మీరు నా స్వరాన్ని అర్థం చేసుకోగలరా?",
      sign: "అవును, నేను హస్తివో ద్వారా సంకేతాలు పంపుతున్నాను.",
    },
    kn: {
      speech: "ನಮಸ್ಕಾರ! ನನ್ನ ಧ್ವನಿ ನಿಮಗೆ ಅರ್ಥವಾಗುತ್ತಿದೆಯೇ?",
      sign: "ಹೌದು, ನಾನು ಹಸ್ತಿವೋ ಮೂಲಕ ಮರಳಿ ಸಂಕೇತಿಸುತ್ತಿದ್ದೇನೆ.",
    },
    ml: {
      speech: "നമസ്കാരം! നിങ്ങൾക്ക് എന്റെ ശബ്ദം മനസ്സിലാകുന്നുണ്ടോ?",
      sign: "അതെ, ഞാൻ ഹസ്റ്റിവോ വഴി തിരികെ ആംഗ്യം കാണിക്കുന്നു.",
    },
    ur: {
      speech: "السلام علیکم! کیا آپ میری آواز سمجھ سکتے ہیں؟",
      sign: "جی ہاں، میں ہستیوو کے ذریعے واپس اشارہ کر رہا ہوں۔",
    },
  };

  const currentPair = localizedPrompts[currentLang] || localizedPrompts.en;

  const [messages, setMessages] = useState([
    { id: 1, sender: `Hearing Participant (${meta.name} Speech)`, text: currentPair.speech, time: "12:04 PM" },
    { id: 2, sender: `Deaf Participant (ISL Sign)`, text: currentPair.sign, time: "12:04 PM" },
  ]);

  return (
    <HastivoUserLayout
      title={t.conversationTitle}
      subtitle={t.conversationSubtitle}
    >
      <div className="mb-6">
        <h1 className="font-heading text-3xl font-bold text-foreground">
          {t.conversationTitle}
        </h1>
        <p className="font-sans text-sm text-text-2 mt-1">
          Bridge Deaf signing and hearing speech simultaneously in {meta.name}. Sign gestures and speech audio are transcribed into real-time shared captions for both participants.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Video Feeds (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Local Stream (Signing Participant) */}
            <GlassPanel elevation="z2" className="p-4 flex flex-col justify-between">
              <div className="relative rounded-2xl bg-charcoal aspect-video overflow-hidden flex items-center justify-center border border-border/80">
                <span className="text-xs text-text-3">Local Camera (Sign Tracking)</span>
                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-lg bg-charcoal/80 text-[10px] text-white">
                  You (ISL Signer)
                </span>
              </div>
            </GlassPanel>

            {/* Remote Stream (Hearing Participant) */}
            <GlassPanel elevation="z2" className="p-4 flex flex-col justify-between">
              <div className="relative rounded-2xl bg-charcoal aspect-video overflow-hidden flex items-center justify-center border border-border/80">
                <span className="text-xs text-text-3">Remote Video ({meta.name} Speech STT)</span>
                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-lg bg-charcoal/80 text-[10px] text-white">
                  Remote (Hearing)
                </span>
              </div>
            </GlassPanel>
          </div>

          {/* Call Controls */}
          <GlassPanel elevation="z3" className="p-4 flex items-center justify-center gap-4">
            <GlassButton
              variant={micActive ? "glass" : "danger"}
              size="icon"
              onClick={() => setMicActive(!micActive)}
            >
              {micActive ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </GlassButton>

            <GlassButton
              variant={cameraActive ? "glass" : "danger"}
              size="icon"
              onClick={() => setCameraActive(!cameraActive)}
            >
              {cameraActive ? <Camera className="w-5 h-5" /> : <CameraOff className="w-5 h-5" />}
            </GlassButton>

            <GlassButton
              variant="danger"
              size="md"
              icon={PhoneOff}
              onClick={() => setInCall(false)}
            >
              {t.leaveRoom}
            </GlassButton>
          </GlassPanel>
        </div>

        {/* Right Column: Live Transcript & Captions (4 cols) */}
        <div className="lg:col-span-4">
          <GlassPanel elevation="z2" className="p-6 h-full flex flex-col justify-between">
            <div>
              <h3 className="font-heading text-xl font-bold text-foreground mb-4">
                {t.liveCaptions}
              </h3>
              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                {messages.map((m) => (
                  <div key={m.id} className="p-3 rounded-2xl bg-surface/50 border border-border/60">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-coral">{m.sender}</span>
                      <span className="text-[10px] text-text-3">{m.time}</span>
                    </div>
                    <p dir={meta.dir} className="font-sans text-sm text-foreground">
                      {m.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </GlassPanel>
        </div>
      </div>
    </HastivoUserLayout>
  );
}
