import React, { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  Camera,
  Mic,
  RotateCcw,
  Volume2,
  Globe,
  Sparkles,
  BookOpen,
  CheckCircle,
  Clock,
  Layers,
  Wand2,
} from "lucide-react";
import { HastivoUserLayout } from "@/components/layout/HastivoUserLayout";
import { GlassPanel } from "@/components/glass/GlassPanel";
import { GlassButton } from "@/components/glass/GlassControls";
import { HastivoAIOrb } from "@/components/ai/HastivoAIOrb";
import { useLanguage } from "@/hooks/useLanguage";

// Smooth UI Suite Imports
import AIConversation from "@/components/ui/smoothui/ai-conversation";
import AIMessage from "@/components/ui/smoothui/ai-message";
import SiriOrb from "@/components/ui/smoothui/siri-orb";
import AIOrbFace from "@/components/ui/smoothui/ai-orb-face";
import AIContextMeter from "@/components/ui/smoothui/ai-context-meter";
import AISuggestions from "@/components/ui/smoothui/ai-suggestions";
import AITaskList from "@/components/ui/smoothui/ai-task-list";
import AIToolCall from "@/components/ui/smoothui/ai-tool-call";
import AICitation from "@/components/ui/smoothui/ai-citation";
import AISources from "@/components/ui/smoothui/ai-sources";
import AIApproval from "@/components/ui/smoothui/ai-approval";
import AIArtifact from "@/components/ui/smoothui/ai-artifact";
import AIResponse from "@/components/ui/smoothui/ai-response";
import AILoader from "@/components/ui/smoothui/ai-loader";
import BorderBeam from "@/components/ui/smoothui/border-beam";
import ShimmerSweep from "@/components/ui/smoothui/shimmer-sweep";
import PerspectiveText3d from "@/components/ui/smoothui/perspective-text-3d";

export default function HastivoAIChatPage() {
  const { currentLang, changeLanguage, t, meta, supportedLanguages } = useLanguage();

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [orbState, setOrbState] = useState("idle");
  const [cameraActive, setCameraActive] = useState(false);
  const [recognizedSignDraft, setRecognizedSignDraft] = useState("");
  const [approvalGranted, setApprovalGranted] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Initialize or re-initialize welcome message whenever language changes
  useEffect(() => {
    setMessages([
      {
        id: `msg_init_${currentLang}`,
        sender: "ai",
        text: t.aiGreeting,
        time: "Just now",
        modality: "text",
        sources: [
          { title: "ISL Standard Dictionary", url: "https://islrtc.nic.in" },
          { title: "NCERT Sign Education Guidelines", url: "https://ncert.nic.in" },
        ],
        tasks: [
          { id: "t1", label: "Initialize Multimodal ISL Parser", status: "done" },
          { id: "t2", label: "Sync Dialect Vocabulary Weights", status: "done" },
        ],
      },
    ]);
  }, [currentLang, t.aiGreeting]);

  // Clean up camera on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleSendMessage = async (textToSend, modality = "text") => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg = {
      id: `msg_${Date.now()}`,
      sender: "user",
      text,
      time: "Just now",
      modality,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    if (modality === "sign") setRecognizedSignDraft("");

    setOrbState("processing");

    setTimeout(() => {
      setOrbState("responding");

      setTimeout(() => {
        const responseMap = {
          en: `I have analyzed your input in ${meta.name}. Here is the corresponding Indian Sign Language gesture synthesis configuration and contextual semantic breakdown.`,
          hi: `मैंने ${meta.name} में आपके इनपुट का विश्लेषण कर लिया है। यह संबंधित भारतीय सांकेतिक भाषा का भावार्थ और विज़ुअलाइज़ेशन है।`,
          ta: `${meta.name} மொழியில் உங்கள் உள்ளீடு பகுப்பாய்வு செய்யப்பட்டது. தொடர்புடைய சைகை மொழி கட்டமைப்பு இதோ.`,
          te: `${meta.name} లో మీ ఇన్‌పుట్ విశ్లేషించబడింది. సంబంధిత సంకేత భాష సమాచారం ఇక్కడ ఉంది.`,
          kn: `${meta.name} ನಲ್ಲಿ ನಿಮ್ಮ ಇನ್‌ಪುಟ್ ಪರಿಶೀಲಿಸಲಾಗಿದೆ. ಸಂಕೇತ ಭಾಷೆಯ ವಿನ್ಯಾಸ ಇಲ್ಲಿದೆ.`,
          ml: `${meta.name} ഭാഷയിൽ നിങ്ങളുടെ ഇൻപുട്ട് വിശകലനം ചെയ്തു. അനുബന്ധ ആംഗ്യഭാഷാ രൂപം ഇതാ.`,
          ur: `میں نے ${meta.name} میں آپ کے اشارے کا تجزیہ کر لیا ہے۔ متعلقہ اشاروں کی ترتیب درج ذیل ہے۔`,
        };

        const aiMsg = {
          id: `msg_ai_${Date.now()}`,
          sender: "ai",
          text: responseMap[currentLang] || responseMap.en,
          time: "Just now",
          modality: "ai",
          tools: [
            {
              id: "tool_1",
              name: "isl_spatial_kinematics_engine",
              input: { gesture: text, locale: meta.code },
              result: "Confidence: 0.98 | Hand Shape: Open-B | Motion: Symmetrical Arc",
            },
          ],
          citation: {
            title: "ISLRTC Standard Vocabulary",
            description: "Verified against national Indian Sign Language Research and Training Centre standards.",
          },
        };

        setMessages((prev) => [...prev, aiMsg]);
        setOrbState("idle");
      }, 1200);
    }, 800);
  };

  const startSignCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 480, height: 360, facingMode: "user" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
      setOrbState("listening");

      setTimeout(() => {
        const sampleGestures = {
          en: "Welcome to Hastivo Community",
          hi: "हस्तिवो समुदाय में आपका स्वागत है",
          ta: "ஹஸ்டிவோ சமூகத்திற்கு நல்வரவு",
          te: "హస్తివో కమ్యూనిటీకి స్వాగతం",
          kn: "ಹಸ್ತಿವೋ ಸಮುದಾಯಕ್ಕೆ ಸುಸ್ವಾಗತ",
          ml: "ഹസ്തിവോ കമ്മ്യൂണിറ്റിയിലേക്ക് സ്വാഗതം",
          ur: "ہستیوو کمیونٹی میں خوش آمدید",
        };
        setRecognizedSignDraft(sampleGestures[currentLang] || sampleGestures.en);
      }, 2500);
    } catch {
      setCameraActive(false);
    }
  };

  const stopSignCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
    setOrbState("idle");
  };

  const suggestions = [
    { id: "s1", label: `How do I sign "Thank You" in ${meta.name}?` },
    { id: "s2", label: `Translate numbers 1 to 10 in ISL` },
    { id: "s3", label: `Explain ISL Grammar & Directionality` },
  ];

  return (
    <HastivoUserLayout
      title="Hastivo AI Assistant"
      subtitle={`${meta.nativeName} (${meta.name}) Mode`}
      actions={
        <div className="flex items-center gap-3">
          <AIContextMeter value={messages.length * 180} max={8192} />
          <div className="flex items-center gap-1.5 bg-surface/60 border border-border/70 rounded-2xl p-1 px-2">
            <Globe className="w-3.5 h-3.5 text-blue" />
            <select
              value={currentLang}
              onChange={(e) => changeLanguage(e.target.value)}
              className="bg-transparent text-xs text-foreground font-medium outline-none cursor-pointer"
            >
              {supportedLanguages.map((l) => (
                <option key={l.code} value={l.code} className="bg-surface text-foreground">
                  {l.nativeName} ({l.name})
                </option>
              ))}
            </select>
          </div>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-180px)]">
        {/* Left Column: Messages Feed (8 cols) */}
        <div className="lg:col-span-8 flex flex-col justify-between h-full space-y-4">
          <GlassPanel elevation="z2" className="flex-1 p-6 overflow-hidden flex flex-col relative">
            <BorderBeam size={180} duration={12} delay={4} />
            <AIConversation className="flex-1 overflow-y-auto space-y-4 pr-1" contentKey={messages.length}>
              {messages.map((m) => (
                <div key={m.id} className="space-y-3">
                  <AIMessage
                    from={m.sender === "user" ? "user" : "assistant"}
                    timestamp={m.time}
                    copyText={m.text}
                    avatar={
                      m.sender === "ai" ? (
                        <SiriOrb
                          size="28px"
                          state={
                            orbState === "processing"
                              ? "thinking"
                              : orbState === "responding"
                              ? "streaming"
                              : "idle"
                          }
                        />
                      ) : undefined
                    }
                  >
                    <div dir={meta.dir} className="text-sm font-sans space-y-2">
                      <p>{m.text}</p>
                      {m.modality && m.modality !== "text" && (
                        <span className="text-[10px] uppercase tracking-wider text-coral font-bold inline-block">
                          via {m.modality}
                        </span>
                      )}

                      {/* Tool Call telemetry inspection */}
                      {m.tools && m.tools.length > 0 && (
                        <div className="pt-2 space-y-2">
                          {m.tools.map((tool) => (
                            <AIToolCall
                              key={tool.id}
                              title={tool.name}
                              subtitle="Spatial Neural Inference Engine"
                              status="done"
                            >
                              <div className="text-xs font-mono text-text-3 p-2 rounded bg-surface/50">
                                {tool.result}
                              </div>
                            </AIToolCall>
                          ))}
                        </div>
                      )}

                      {/* Citation Pill */}
                      {m.citation && (
                        <div className="pt-2">
                          <AICitation
                            title={m.citation.title}
                            description={m.citation.description}
                            url="https://islrtc.nic.in"
                          />
                        </div>
                      )}

                      {/* Multimodal sources card */}
                      {m.sources && (
                        <div className="pt-2">
                          <AISources sources={m.sources} />
                        </div>
                      )}

                      {/* Step Task List */}
                      {m.tasks && (
                        <div className="pt-2">
                          <AITaskList tasks={m.tasks} />
                        </div>
                      )}
                    </div>
                  </AIMessage>
                </div>
              ))}

              {orbState === "processing" && (
                <div className="flex items-center gap-3 p-3 text-xs text-text-3 font-mono">
                  <AILoader variant="grid" size={24} />
                  <span>Synthesizing ISL neural vector representations...</span>
                </div>
              )}
            </AIConversation>
          </GlassPanel>

          {/* Prompt Suggestions */}
          <div className="px-1">
            <AISuggestions
              suggestions={suggestions}
              onSelect={(s) => handleSendMessage(s.label)}
            />
          </div>

          {/* Unified Input Dock */}
          <GlassPanel elevation="z3" className="p-4 relative">
            <ShimmerSweep />
            {/* If Sign mode is active with recognized draft */}
            {recognizedSignDraft && (
              <div className="mb-3 p-3 rounded-xl bg-coral/15 border border-coral/30 flex items-center justify-between">
                <div className="flex-1 mr-3">
                  <span className="text-[10px] text-coral font-bold block uppercase tracking-wider">
                    ISL Recognized Sign Draft ({meta.name})
                  </span>
                  <input
                    type="text"
                    dir={meta.dir}
                    value={recognizedSignDraft}
                    onChange={(e) => setRecognizedSignDraft(e.target.value)}
                    className="bg-transparent text-sm font-sans text-foreground outline-none w-full"
                  />
                </div>
                <GlassButton
                  variant="primary"
                  size="sm"
                  onClick={() => handleSendMessage(recognizedSignDraft, "sign")}
                >
                  Confirm & Send
                </GlassButton>
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                type="text"
                dir={meta.dir}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder={t.aiPlaceholder}
                className="flex-1 rounded-xl bg-surface/60 border border-border px-4 py-2.5 text-sm text-foreground outline-none focus:border-blue"
              />

              {/* Mode toggles */}
              <button
                onClick={() => {
                  if (cameraActive) {
                    stopSignCamera();
                  } else {
                    startSignCamera();
                  }
                }}
                className={`p-2.5 rounded-xl border transition-colors ${
                  cameraActive
                    ? "bg-coral text-charcoal border-coral"
                    : "bg-surface text-text-2 border-border hover:text-foreground"
                }`}
                title="ISL Sign Gesture Input"
              >
                <Camera className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  const speechSim = {
                    en: "How do you express gratitude in Indian Sign Language?",
                    hi: "भारतीय सांकेतिक भाषा में धन्यवाद कैसे व्यक्त करते हैं?",
                    ta: "இந்திய சைகை மொழியில் நன்றி கூறுவது எப்படி?",
                    te: "భారతీయ సంకేత భాషలో ధన్యవాదాలు ఎలా చెప్తారు?",
                    kn: "ಭಾರತೀಯ ಸಂಕೇತ ಭಾಷೆಯಲ್ಲಿ ಧನ್ಯವಾದ ಹೇಳುವುದು ಹೇಗೆ?",
                    ml: "ഇന്ത്യൻ ആംഗ്യഭാഷയിൽ നന്ദി പറയുന്നത് എങ്ങനെ?",
                    ur: "ہندوستانی اشاروں کی زبان میں شکریہ کیسے کہتے ہیں؟",
                  };
                  handleSendMessage(speechSim[currentLang] || speechSim.en, "speech");
                }}
                className="p-2.5 rounded-xl bg-surface text-text-2 border border-border hover:text-foreground transition-colors"
                title="Speech Voice Input"
              >
                <Mic className="w-4 h-4" />
              </button>

              <GlassButton
                variant="primary"
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim()}
              >
                <Send className="w-4 h-4" />
              </GlassButton>
            </div>
          </GlassPanel>
        </div>

        {/* Right Column: AI Core, Telemetry & Spatial Face (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <GlassPanel elevation="z2" className="p-6 text-center flex flex-col items-center justify-center relative overflow-hidden">
            <BorderBeam size={140} duration={10} />
            <HastivoAIOrb state={orbState} size="lg" className="my-4" />
            <span className="font-heading text-lg font-bold text-foreground">
              <PerspectiveText3d text="Hastivo Spatial Core" />
            </span>
            <span className="text-xs text-coral font-medium mt-0.5">
              {meta.greeting}
            </span>
            <span className="text-xs text-text-3 font-mono mt-1 capitalize">
              State: {orbState} • {meta.name}
            </span>
          </GlassPanel>

          {/* AI Dynamic Gesture Artifact Pane */}
          <GlassPanel elevation="z2" className="p-4 space-y-3">
            <span className="text-xs font-semibold text-text-3 block uppercase tracking-wider">
              Active Neural Kinematic Artifact
            </span>
            <AIArtifact
              title="ISL Sign Translation Matrix"
              copyText={'{"gloss": "WELCOME", "locale": "isl-in", "confidence": 0.98}'}
              code={
                <pre className="p-3 text-[11px] font-mono text-text-2 bg-charcoal/80 rounded-xl overflow-x-auto">
{`{
  "gloss": "WELCOME",
  "hand_shape": "Open-B",
  "movement": "Chest-to-Center Arc",
  "spatial_anchor": "Upper Torso",
  "accuracy": 0.984
}`}
                </pre>
              }
              preview={
                <div className="p-3 rounded-xl bg-surface/80 border border-border text-center space-y-1.5">
                  <span className="text-sm font-bold text-coral block">ISL Synthesized Vector</span>
                  <span className="text-xs text-text-3 font-sans block">Bi-manual arc with palm orientation toward recipient</span>
                </div>
              }
            />
          </GlassPanel>

          {/* AI Autonomous Approval / Safety Guard */}
          <GlassPanel elevation="z2" className="p-4 space-y-3">
            <span className="text-xs font-semibold text-text-3 block uppercase tracking-wider">
              Safety & Autonomous Action Guard
            </span>
            <AIApproval
              title="Publish New Regional ISL Dialect Corpus"
              description="Review and grant elevated rights for community signers to commit localized vocabulary."
              confirmText="Authorize & Sign"
              cancelText="Reject"
              onConfirm={() => setApprovalGranted(true)}
              onCancel={() => setApprovalGranted(false)}
            />
            {approvalGranted && (
              <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>Approval verified with cryptographic multi-signature.</span>
              </div>
            )}
          </GlassPanel>

          {/* Camera preview when sign mode is active */}
          {cameraActive && (
            <GlassPanel elevation="z2" className="p-4 overflow-hidden">
              <span className="text-xs font-semibold text-text-3 block mb-2">
                Live Sign Camera Tracking
              </span>
              <div className="relative rounded-xl overflow-hidden bg-charcoal aspect-video">
                <video ref={videoRef} playsInline muted className="w-full h-full object-cover" />
              </div>
            </GlassPanel>
          )}
        </div>
      </div>
    </HastivoUserLayout>
  );
}
