import React, { useState, useRef, useEffect } from 'react';
import { SignAvatarScene, GestureType } from '../three/SignAvatarScene';
import {
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Volume2,
  Play,
  Pause,
  RotateCcw,
  Square,
  CheckCircle2,
  BookmarkCheck,
  Send,
  Users,
  Sparkles,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'Participant A (Speech)' | 'Participant B (Signer)';
  senderType: 'A' | 'B';
  timestamp: string;
  text: string;
  tokens?: string[];
}

export const RealTimeConversationPage: React.FC = () => {
  // Session Controls
  const [sessionActive, setSessionActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_1',
      sender: 'Participant A (Speech)',
      senderType: 'A',
      timestamp: '10:02:15 AM',
      text: 'Good morning! It is wonderful to meet you today.',
      tokens: ['MORNING', 'GOOD', 'MEET', 'YOU', 'TODAY'],
    },
    {
      id: 'msg_2',
      sender: 'Participant B (Signer)',
      senderType: 'B',
      timestamp: '10:02:40 AM',
      text: 'Hello, I am glad we can communicate so clearly.',
      tokens: ['HELLO', 'COMMUNICATE', 'HAPPY', 'GOOD'],
    },
  ]);
  const [savedNotification, setSavedNotification] = useState(false);

  // Participant A: Speech to Sign States
  const [speechTranscript, setSpeechTranscript] = useState('');
  const [isMicActive, setIsMicActive] = useState(false);
  const [currentAvatarGesture, setCurrentAvatarGesture] = useState<GestureType>('WELCOME');
  const [avatarSubtitle, setAvatarSubtitle] = useState('PARTICIPANT A / LISTENING');
  const speechRecognitionRef = useRef<any>(null);

  // Participant B: Sign to Text States
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [recognizedTokens, setRecognizedTokens] = useState<string[]>(['READY', 'TALK']);
  const [synthesizedSpeech, setSynthesizedSpeech] = useState<string>('Ready to talk.');

  // Initialize Speech Recognition for Participant A
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;

      rec.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((r: any) => r[0].transcript)
          .join('');
        setSpeechTranscript(transcript);
      };

      speechRecognitionRef.current = rec;
    }
  }, []);

  // Camera Management for Participant B
  const toggleCamera = async () => {
    if (isCameraActive) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
      if (videoRef.current) videoRef.current.srcObject = null;
      setIsCameraActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 360, facingMode: 'user' },
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setIsCameraActive(true);
      } catch (e) {
        console.warn('Camera error:', e);
      }
    }
  };

  const toggleMic = () => {
    if (!speechRecognitionRef.current) {
      alert('Speech recognition not available. Please type speech manually.');
      return;
    }
    if (isMicActive) {
      speechRecognitionRef.current.stop();
      setIsMicActive(false);
    } else {
      try {
        speechRecognitionRef.current.start();
        setIsMicActive(true);
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Participant A: Finalize Turn ("Continue" / Send)
  const handleFinalizeParticipantA = async () => {
    if (!speechTranscript.trim()) return;

    const textToSend = speechTranscript;
    setSpeechTranscript('');

    try {
      // Call Gemini for authentic gloss
      const res = await fetch('/api/gemini/text-to-gloss', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToSend }),
      });
      const data = await res.json();
      const tokens = (data.glosses || []).map((g: any) => g.token);
      const topGesture = data.glosses?.[0]?.gesture || 'COMMUNICATE';

      setCurrentAvatarGesture(topGesture as GestureType);
      setAvatarSubtitle(`GLOSS: ${tokens.join(' ')}`);

      setMessages(prev => [
        ...prev,
        {
          id: 'msg_' + Date.now(),
          sender: 'Participant A (Speech)',
          senderType: 'A',
          timestamp: new Date().toLocaleTimeString(),
          text: textToSend,
          tokens,
        },
      ]);
    } catch (e) {
      console.error(e);
    }
  };

  // Participant B: Finalize Turn ("Continue" / Send)
  const handleFinalizeParticipantB = async (tokensOverride?: string[]) => {
    const tokens = tokensOverride || recognizedTokens;
    if (tokens.length === 0) return;

    try {
      const res = await fetch('/api/gemini/gloss-to-sentence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawTokens: tokens }),
      });
      const data = await res.json();
      const sentence = data.reconstructedSentence || tokens.join(' ');

      setMessages(prev => [
        ...prev,
        {
          id: 'msg_' + Date.now(),
          sender: 'Participant B (Signer)',
          senderType: 'B',
          timestamp: new Date().toLocaleTimeString(),
          text: sentence,
          tokens,
        },
      ]);

      // Vocalize automatically for Participant A
      if ('speechSynthesis' in window) {
        const u = new SpeechSynthesisUtterance(sentence);
        window.speechSynthesis.speak(u);
      }

      setRecognizedTokens([]);
    } catch (e) {
      console.error(e);
    }
  };

  // Clean unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      if (speechRecognitionRef.current && isMicActive) speechRecognitionRef.current.stop();
    };
  }, [isMicActive]);

  // Session History Save
  const handleSaveSession = () => {
    try {
      const existing = JSON.parse(localStorage.getItem('signa_conversation_records') || '[]');
      const newRecord = {
        id: 'rec_session_' + Date.now(),
        category: 'Real-Time',
        timestamp: new Date().toISOString(),
        summary: `Dialogue with ${messages.length} exchanges between Hearing and Deaf participants.`,
        messages,
      };
      existing.unshift(newRecord);
      localStorage.setItem('signa_conversation_records', JSON.stringify(existing));
      setSavedNotification(true);
      setTimeout(() => setSavedNotification(false), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 z-10 flex flex-col justify-between space-y-8">
      {/* Top Header & Session Controls Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 hairline-border-b pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-[var(--brand-yellow)] inline-block" />
            <span className="font-mono text-xs uppercase tracking-widest text-[var(--text-tertiary)]">
              WORKSPACE / TWO-WAY SYNCHRONOUS COMMUNICATION
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
            Synchronous Dialogue Console
          </h1>
        </div>

        {/* Global Session Transport Actions */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          {!sessionActive ? (
            <button
              onClick={() => {
                setSessionActive(true);
                setIsPaused(false);
              }}
              className="px-4 py-2 bg-[var(--brand-coral)] text-white hover:opacity-90 flex items-center gap-1.5 font-semibold cursor-pointer shadow-sm"
            >
              <Play className="w-3.5 h-3.5" />
              <span>START SESSION</span>
            </button>
          ) : (
            <>
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="px-3 py-1.5 border border-[var(--border)] text-[var(--text-primary)] hover:border-[var(--brand-yellow)] cursor-pointer"
              >
                {isPaused ? 'RESUME' : 'PAUSE'}
              </button>
              <button
                onClick={() => setSessionActive(false)}
                className="px-3 py-1.5 bg-[var(--surface)] text-[var(--brand-coral)] border border-[var(--border)] hover:border-[var(--brand-coral)] cursor-pointer"
              >
                STOP
              </button>
            </>
          )}

          <button
            onClick={handleSaveSession}
            className="px-3 py-1.5 bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)] hover:border-[var(--brand-coral)] cursor-pointer flex items-center gap-1"
          >
            <BookmarkCheck className="w-3.5 h-3.5 text-[var(--brand-coral)]" />
            <span>{savedNotification ? 'Saved to Archive' : 'Save Session'}</span>
          </button>
        </div>
      </div>

      {/* Main Two-Participant Split View (Side-by-side Desktop, Stacked Mobile) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* PARTICIPANT A: SPEECH TO SIGN WORKSPACE */}
        <div className="p-6 bg-[var(--surface)] hairline-border space-y-5">
          <div className="flex items-center justify-between hairline-border-b pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--brand-coral)]" />
              <span className="font-mono text-xs font-bold text-[var(--brand-coral)] uppercase">
                PARTICIPANT A &bull; HEARING
              </span>
            </div>
            <span className="font-mono text-[10px] text-[var(--text-tertiary)]">
              SPEECH INPUT ONLY
            </span>
          </div>

          {/* 3D Sign Avatar Performing for Participant B */}
          <div className="h-[320px] relative hairline-border bg-[var(--background)]">
            <SignAvatarScene
              currentGesture={currentAvatarGesture}
              subtitle={avatarSubtitle}
              className="w-full h-full"
            />
          </div>

          {/* Speech Microphone & Transcript */}
          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-secondary)]">Live Speech Transcript:</span>
              <button
                onClick={toggleMic}
                className={`px-3 py-1 flex items-center gap-1.5 border cursor-pointer transition-colors ${
                  isMicActive
                    ? 'bg-[var(--brand-coral)] text-white border-[var(--brand-coral)] animate-pulse'
                    : 'bg-[var(--background)] text-[var(--text-primary)] border-[var(--border)]'
                }`}
              >
                {isMicActive ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                <span>{isMicActive ? 'RECORDING' : 'MIC ON'}</span>
              </button>
            </div>

            <textarea
              rows={2}
              value={speechTranscript}
              onChange={e => setSpeechTranscript(e.target.value)}
              placeholder="Speak via microphone or type spoken sentence..."
              className="w-full bg-[var(--background)] text-[var(--text-primary)] border border-[var(--border)] p-3 text-xs font-sans focus:outline-none focus:border-[var(--brand-coral)]"
            />

            {/* Turn Finalization ("Continue") */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-[var(--text-tertiary)]">
                Press [Continue Turn] to render sign glosses
              </span>
              <button
                onClick={handleFinalizeParticipantA}
                disabled={!speechTranscript.trim()}
                className="px-4 py-2 bg-[var(--brand-coral)] text-white hover:opacity-90 font-semibold cursor-pointer disabled:opacity-40"
              >
                CONTINUE TURN &rarr;
              </button>
            </div>
          </div>
        </div>

        {/* PARTICIPANT B: SIGN TO TEXT WORKSPACE */}
        <div className="p-6 bg-[var(--surface)] hairline-border space-y-5">
          <div className="flex items-center justify-between hairline-border-b pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--brand-blue)]" />
              <span className="font-mono text-xs font-bold text-[var(--brand-blue)] uppercase">
                PARTICIPANT B &bull; SIGNER
              </span>
            </div>
            <span className="font-mono text-[10px] text-[var(--text-tertiary)]">
              WEBCAM VISION
            </span>
          </div>

          {/* Camera Viewport */}
          <div className="h-[320px] relative hairline-border bg-[#17191E] overflow-hidden flex items-center justify-center">
            <video
              ref={videoRef}
              playsInline
              muted
              className={`w-full h-full object-cover transform -scale-x-100 ${
                isCameraActive ? 'block' : 'hidden'
              }`}
            />
            {!isCameraActive && (
              <div className="text-center p-6 space-y-3 text-white">
                <Camera className="w-10 h-10 text-[#6FA3EF] mx-auto opacity-70" />
                <p className="text-xs text-[#A0A4AB]">Webcam preview for live sign landmark tracking</p>
                <button
                  onClick={toggleCamera}
                  className="px-4 py-2 bg-[var(--brand-blue)] text-white font-mono text-xs uppercase cursor-pointer"
                >
                  Enable Camera
                </button>
              </div>
            )}
            {isCameraActive && (
              <div className="absolute top-2 left-2 bg-black/60 px-2 py-0.5 font-mono text-[9px] text-white">
                TRACKING ACTIVE
              </div>
            )}
          </div>

          {/* Detected Tokens & Manual Sign Injection */}
          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-secondary)]">Recognized Sign Buffer:</span>
              <div className="flex items-center gap-1">
                {['HELLO', 'YES', 'THANKS', 'HELP'].map(s => (
                  <button
                    key={s}
                    onClick={() => setRecognizedTokens(prev => [...prev, s])}
                    className="px-1.5 py-0.5 border border-[var(--border)] text-[10px] hover:border-[var(--brand-blue)] cursor-pointer text-[var(--text-primary)]"
                  >
                    +{s}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-2.5 bg-[var(--background)] border border-[var(--border)] min-h-[44px] flex flex-wrap gap-1.5 items-center">
              {recognizedTokens.length === 0 ? (
                <span className="text-[10px] text-[var(--text-tertiary)] italic">Awaiting signs...</span>
              ) : (
                recognizedTokens.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-[var(--brand-blue)]/10 text-[var(--brand-blue)] border border-[var(--brand-blue)] font-bold text-[11px]"
                  >
                    [{t}]
                  </span>
                ))
              )}
            </div>

            {/* Turn Finalization ("Continue") */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-[var(--text-tertiary)]">
                Press [Continue Turn] to synthesize spoken output
              </span>
              <button
                onClick={() => handleFinalizeParticipantB()}
                disabled={recognizedTokens.length === 0}
                className="px-4 py-2 bg-[var(--brand-blue)] text-white hover:opacity-90 font-semibold cursor-pointer disabled:opacity-40"
              >
                CONTINUE TURN &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Synchronous Chronological Conversation Timeline */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between hairline-border-b pb-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[var(--text-primary)]" />
            <h3 className="font-display text-lg font-bold text-[var(--text-primary)]">
              Chronological Dialogue Log
            </h3>
          </div>
          <span className="font-mono text-xs text-[var(--text-tertiary)]">
            {messages.length} TURNS RECORDED
          </span>
        </div>

        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`p-4 hairline-border ${
                msg.senderType === 'A'
                  ? 'bg-[var(--surface)] border-l-4 border-l-[var(--brand-coral)]'
                  : 'bg-[var(--surface)] border-l-4 border-l-[var(--brand-blue)]'
              }`}
            >
              <div className="flex items-center justify-between font-mono text-[11px] mb-1.5">
                <span
                  className={
                    msg.senderType === 'A' ? 'text-[var(--brand-coral)] font-bold' : 'text-[var(--brand-blue)] font-bold'
                  }
                >
                  {msg.sender}
                </span>
                <span className="text-[var(--text-tertiary)]">{msg.timestamp}</span>
              </div>
              <p className="text-sm font-sans text-[var(--text-primary)] leading-relaxed">
                "{msg.text}"
              </p>
              {msg.tokens && msg.tokens.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1 font-mono text-[10px]">
                  {msg.tokens.map((t, idx) => (
                    <span key={idx} className="bg-[var(--background)] px-1.5 py-0.5 border border-[var(--border)] text-[var(--text-secondary)]">
                      [{t}]
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
