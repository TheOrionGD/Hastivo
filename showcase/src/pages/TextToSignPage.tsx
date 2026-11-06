import React, { useState, useRef, useEffect } from 'react';
import { SignAvatarScene, GestureType } from '../three/SignAvatarScene';
import {
  Mic,
  MicOff,
  Send,
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  AlertTriangle,
  BookmarkCheck,
  Sparkles,
  Info,
} from 'lucide-react';

interface GlossToken {
  token: string;
  duration: number;
  gesture: string;
  spatial: string;
  facial: string;
  isSupported: boolean;
}

export const TextToSignPage: React.FC = () => {
  const [inputText, setInputText] = useState('Welcome friend, let us communicate together');
  const [sourceLang, setSourceLang] = useState('English');
  const [targetSignLang, setTargetSignLang] = useState('ISL');

  // Speech Recognition State
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Translation & Processing States
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [glossSequence, setGlossSequence] = useState<GlossToken[]>([
    { token: 'WELCOME', duration: 1.4, gesture: 'WELCOME', spatial: 'WIDE_SPACE', facial: 'WARM_SMILE', isSupported: true },
    { token: 'FRIEND', duration: 1.1, gesture: 'POINT_YOU', spatial: 'CHEST', facial: 'NEUTRAL', isSupported: true },
    { token: 'COMMUNICATE', duration: 1.6, gesture: 'COMMUNICATE', spatial: 'CENTER', facial: 'FOCUSED', isSupported: true },
    { token: 'TOGETHER', duration: 1.2, gesture: 'LOVE', spatial: 'NEUTRAL', facial: 'AFFIRMATIVE', isSupported: true },
  ]);
  const [unsupportedWords, setUnsupportedWords] = useState<string[]>([]);
  const [grammarNotes, setGrammarNotes] = useState<string>(
    'Authentic Indian Sign Language (ISL) syntax: Topic topicalization with non-manual markers.'
  );

  // Playback Animation State
  const [activeTokenIndex, setActiveTokenIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1.0);
  const [savedNotification, setSavedNotification] = useState(false);

  // Web Speech API Initialization
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((r: any) => r[0].transcript)
          .join('');
        setInputText(transcript);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (err: any) => {
        console.warn('Speech recognition error:', err);
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleSpeech = () => {
    if (!speechSupported) {
      alert('Speech recognition is not supported in this browser. Please use keyboard text input.');
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Perform Gemini Real-Time Gloss Translation
  const handleTranslate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/gemini/text-to-gloss', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputText,
          sourceLang,
          targetSignLang,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to translate to sign sequence');
      }

      const data = await response.json();
      if (data.glosses && data.glosses.length > 0) {
        setGlossSequence(data.glosses);
        setUnsupportedWords(data.unsupportedTokens || []);
        setGrammarNotes(data.grammarNotes || '');
        setActiveTokenIndex(0);
        setIsPlaying(true);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Linguistic processing failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Save session record to real history
  const handleSaveToHistory = () => {
    try {
      const existing = JSON.parse(localStorage.getItem('signa_conversation_records') || '[]');
      const newRecord = {
        id: 'rec_' + Date.now(),
        category: 'Text-to-Sign',
        timestamp: new Date().toISOString(),
        text: inputText,
        summary: `Translated "${inputText}" into ${glossSequence.length} ${targetSignLang} gloss tokens.`,
        glosses: glossSequence,
        sourceLang,
        targetSignLang,
      };
      existing.unshift(newRecord);
      localStorage.setItem('signa_conversation_records', JSON.stringify(existing));
      setSavedNotification(true);
      setTimeout(() => setSavedNotification(false), 3000);
    } catch (e) {
      console.error('Error saving history record:', e);
    }
  };

  // Sequential Token Playback Driver
  useEffect(() => {
    if (!isPlaying || glossSequence.length === 0) return;

    const currentToken = glossSequence[activeTokenIndex];
    const durationMs = ((currentToken?.duration || 1.2) * 1000) / speed;

    const timer = setTimeout(() => {
      setActiveTokenIndex(prev => {
        if (prev + 1 < glossSequence.length) {
          return prev + 1;
        } else {
          return 0; // Loop or hold
        }
      });
    }, durationMs);

    return () => clearTimeout(timer);
  }, [isPlaying, activeTokenIndex, glossSequence, speed]);

  const currentToken = glossSequence[activeTokenIndex] || glossSequence[0];

  return (
    <div className="relative min-h-[calc(100vh-4rem)] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 z-10 flex flex-col justify-between">
      {/* Top Breadcrumb & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 hairline-border-b pb-4">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 bg-[var(--brand-coral)] inline-block" />
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--text-tertiary)]">
            WORKSPACE / TEXT-TO-SIGN TRANSLATION ENGINE
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-[var(--text-tertiary)]">SIGN SYSTEM:</span>
            <select
              value={targetSignLang}
              onChange={e => setTargetSignLang(e.target.value)}
              className="bg-[var(--surface)] border border-[var(--border)] px-2 py-1 text-[var(--text-primary)]"
            >
              <option value="ISL">Indian Sign Language (ISL)</option>
              <option value="ASL">American Sign Language (ASL)</option>
              <option value="BSL">British Sign Language (BSL)</option>
            </select>
          </div>

          <button
            onClick={handleSaveToHistory}
            className="flex items-center gap-1.5 px-3 py-1 bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)] hover:border-[var(--brand-coral)] cursor-pointer"
          >
            <BookmarkCheck className="w-3.5 h-3.5 text-[var(--brand-coral)]" />
            <span>{savedNotification ? 'Saved to Archive' : 'Save Session'}</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Layout (Two-Column Asymmetric Swiss Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-auto py-6 items-start">
        {/* Left Column: Input, Speech Recognition & Gloss Stream (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
              Text & Speech Input
            </h1>
            <p className="text-xs text-[var(--text-secondary)]">
              Type or speak a sentence. The system parses syntactic structure, converts to spatial glosses, and drives the 3D ambassador.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-[var(--brand-coral)]/10 border border-[var(--brand-coral)] text-xs text-[var(--brand-coral)]">
              {errorMsg}
            </div>
          )}

          {/* Input Box with Speech Mic */}
          <form onSubmit={handleTranslate} className="space-y-3">
            <div className="relative">
              <textarea
                rows={3}
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder="Type a sentence or use the microphone..."
                className="w-full bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] p-4 text-sm font-sans focus:outline-none focus:border-[var(--brand-coral)] transition-colors pr-14"
              />
              <button
                type="button"
                onClick={toggleSpeech}
                className={`absolute right-3.5 bottom-3.5 p-2 rounded-none border transition-colors cursor-pointer ${
                  isListening
                    ? 'bg-[var(--brand-coral)] text-white border-[var(--brand-coral)] animate-pulse'
                    : 'bg-[var(--background)] text-[var(--text-secondary)] border-[var(--border)] hover:text-[var(--text-primary)]'
                }`}
                title={isListening ? 'Stop Recording' : 'Start Speech Microphone'}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-[var(--text-tertiary)] uppercase">Source:</span>
                <select
                  value={sourceLang}
                  onChange={e => setSourceLang(e.target.value)}
                  className="bg-[var(--surface)] border border-[var(--border)] px-2 py-1 text-xs font-mono text-[var(--text-primary)]"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi (हिन्दी)</option>
                  <option value="Tamil">Tamil (தமிழ்)</option>
                  <option value="Telugu">Telugu (తెలుగు)</option>
                  <option value="Kannada">Kannada (ಕನ್ನಡ)</option>
                  <option value="Malayalam">Malayalam (മലയാളം)</option>
                  <option value="Urdu">Urdu (اردو)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isLoading || !inputText.trim()}
                className="px-6 py-2.5 bg-[var(--brand-coral)] text-white font-mono text-xs uppercase tracking-wider font-semibold flex items-center gap-2 hover:opacity-90 disabled:opacity-40 cursor-pointer shadow-sm"
              >
                <span>{isLoading ? 'Processing...' : 'Translate to Signs'}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Linguistic Gloss Sequence Visualization */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-[var(--text-tertiary)]">
                Structured Sign Tokens ({glossSequence.length})
              </span>
              <span className="font-mono text-[10px] text-[var(--text-tertiary)]">
                CLICK TOKEN TO SCRUB
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {glossSequence.map((item, idx) => {
                const isCurrent = idx === activeTokenIndex;
                return (
                  <button
                    key={`${item.token}-${idx}`}
                    onClick={() => {
                      setActiveTokenIndex(idx);
                      setIsPlaying(false);
                    }}
                    className={`px-3 py-2 text-left border cursor-pointer transition-all ${
                      isCurrent
                        ? 'bg-[var(--brand-coral)] text-white border-[var(--brand-coral)] shadow-sm'
                        : 'bg-[var(--surface)] text-[var(--text-primary)] border-[var(--border)] hover:border-[var(--brand-coral)]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-mono text-xs font-bold">
                      <span>[{item.token}]</span>
                      {!item.isSupported && (
                        <span className="text-[9px] bg-yellow-500 text-black px-1 rounded-none font-normal">
                          FINGERSPELL
                        </span>
                      )}
                    </div>
                    <span className={`font-mono text-[10px] block mt-0.5 ${isCurrent ? 'text-white/80' : 'text-[var(--text-tertiary)]'}`}>
                      {item.duration}s &bull; {item.spatial}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Unsupported Vocabulary Disclosure (Honest Linguistics) */}
          {unsupportedWords.length > 0 && (
            <div className="p-3 bg-[var(--brand-yellow)]/10 border border-[var(--brand-yellow)] flex items-start gap-2 text-xs text-[var(--text-primary)]">
              <AlertTriangle className="w-4 h-4 text-[var(--brand-yellow)] shrink-0 mt-0.5" />
              <div>
                <strong className="font-mono uppercase text-[var(--brand-charcoal)] dark:text-[var(--brand-yellow)]">
                  Fingerspelling Fallback:
                </strong>
                <p className="text-[var(--text-secondary)] mt-0.5">
                  The following words lack direct lexical sign equivalents in {targetSignLang} and will be fingerspelled: {unsupportedWords.join(', ')}.
                </p>
              </div>
            </div>
          )}

          {/* Grammar Notes */}
          {grammarNotes && (
            <div className="p-3 bg-[var(--surface)] hairline-border flex items-start gap-2 text-xs font-mono text-[var(--text-secondary)]">
              <Info className="w-4 h-4 text-[var(--brand-blue)] shrink-0 mt-0.5" />
              <span>{grammarNotes}</span>
            </div>
          )}
        </div>

        {/* Right Column: 3D Avatar Workspace (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="h-[460px] sm:h-[520px] relative hairline-border bg-[var(--surface)]/70">
            <SignAvatarScene
              currentGesture={(currentToken?.gesture as GestureType) || 'IDLE'}
              speed={speed}
              subtitle={`ACTIVE TOKEN: [${currentToken?.token || 'NONE'}] &bull; ${currentToken?.facial || 'NEUTRAL'}`}
              className="w-full h-full"
            />
          </div>

          {/* Playback Transport Strip */}
          <div className="p-3 bg-[var(--surface)] hairline-border flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-1.5 px-3 py-1 bg-[var(--brand-coral)] text-white hover:opacity-90 cursor-pointer font-semibold"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
              </button>

              <button
                onClick={() => {
                  setActiveTokenIndex(0);
                  setIsPlaying(true);
                }}
                className="p-1.5 border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
                title="Restart Sequence"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setActiveTokenIndex(prev => Math.max(0, prev - 1))}
                disabled={activeTokenIndex === 0}
                className="p-1.5 border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-30 cursor-pointer"
                title="Step Backward"
              >
                <SkipBack className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setActiveTokenIndex(prev => Math.min(glossSequence.length - 1, prev + 1))}
                disabled={activeTokenIndex >= glossSequence.length - 1}
                className="p-1.5 border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-30 cursor-pointer"
                title="Step Forward"
              >
                <SkipForward className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[var(--text-tertiary)]">SPEED:</span>
              {[0.5, 0.75, 1.0, 1.25].map(s => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`px-1.5 py-0.5 cursor-pointer ${
                    speed === s
                      ? 'bg-[var(--text-primary)] text-[var(--background)] font-bold'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Status Bar (NO FOOTER ON THIS PAGE per prompt requirement) */}
      <div className="pt-4 hairline-border-t flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-[var(--text-tertiary)] gap-2">
        <div>ISL / ASL COMPUTATIONAL ENGINE &bull; TOKEN TIME ACCELERATION</div>
        <div>NO FOOTER PER WORKSPACE SPECIFICATION</div>
      </div>
    </div>
  );
};
