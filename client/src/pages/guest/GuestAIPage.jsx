import { AIConversation, AIMessage, SiriOrb, AIPromptInput } from "@/components/ui/smoothui";
import { useState, useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Bot,
  Send,
  Sparkles,
  AlertTriangle,
  RotateCcw,
  User,
  Clock,
  Mic,
  MicOff,
} from "lucide-react";
import { GuestLayout } from "@/components/guest/GuestLayout";

/**
 * 6. GUEST HASTIVO AI
 * - FETCH: AI availability, public knowledge configuration, guest request limits.
 * - DISPLAY: AI messages, suggested prompts, response status and usage limit.
 * - INPUT: Text prompt, voice input if supported, send message.
 */
export default function GuestAIPage() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Namaste! I am the Hastivo AI language and accessibility companion. You can ask me questions about Indian Sign Language (ISL) grammar, non-manual facial markers, or zero-cloud camera privacy.",
    },
  ]);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [usageRemaining, setUsageRemaining] = useState(8);
  const [limitReached, setLimitReached] = useState(false);
  const [suggestedPrompts, setSuggestedPrompts] = useState([
    "Explain the difference between SVO and SOV in sign language.",
    "How does Hastivo guarantee zero-cloud camera privacy?",
    "How does ISL handle question words like 'Where' and 'Who'?",
  ]);
  const [isListening, setIsListening] = useState(false);
  const chatEndRef = useRef(null);

  // FETCH: Guest AI status & limits
  useEffect(() => {
    let active = true;
    fetch("/api/v1/guest/dashboard")
      .then((r) => (r.ok ? r.json() : null))
      .then((res) => {
        if (active && res?.usageLimits?.aiChat) {
          setUsageRemaining(res.usageLimits.aiChat.remaining);
          if (res.usageLimits.aiChat.remaining <= 0) {
            setLimitReached(true);
          }
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (userText) => {
    const textToSend = userText || prompt;
    if (!textToSend.trim() || loading) return;

    if (usageRemaining <= 0) {
      setLimitReached(true);
      return;
    }

    const nextMessages = [...messages, { role: "user", content: textToSend }];
    setMessages(nextMessages);
    setPrompt("");
    setLoading(true);

    try {
      const res = await fetch("/api/v1/guest/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: textToSend }),
      });

      if (res.status === 429) {
        setLimitReached(true);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "⚠️ Guest request limit reached. Please upgrade your guest session with Google to enjoy unlimited AI chats.",
          },
        ]);
        return;
      }

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
        if (data.suggestedPrompts) setSuggestedPrompts(data.suggestedPrompts);
        setUsageRemaining((prev) => Math.max(0, prev - 1));
      } else {
        throw new Error();
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Hastivo AI processes spatial language queries with SOV grammatical rules. As a guest user, upgrading keeps all dialogue threads permanently.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";

    if (!isListening) {
      setIsListening(true);
      recognition.start();
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setPrompt(transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
    } else {
      recognition.stop();
      setIsListening(false);
    }
  };

  return (
    <GuestLayout
      activeId="ai-assistant"
      title="Guest Hastivo AI Companion"
      subtitle="Intelligent linguistics and accessibility assistant for ISL grammar questions"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Chat Stream Window */}
        <div className="h-[480px] rounded-2xl border border-border bg-foreground/[0.01] p-5 overflow-y-auto space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-3 ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {m.role === "assistant" && (
                  <div className="h-8 w-8 rounded-full bg-blue/15 text-blue flex items-center justify-center shrink-0 mt-0.5 border border-blue/30">
                    <Bot size={18} />
                  </div>
                )}

                <div
                  className={`max-w-xl p-4 rounded-2xl text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-coral text-charcoal font-medium rounded-tr-xs"
                      : "bg-foreground/5 border border-border/80 text-foreground rounded-tl-xs"
                  }`}
                >
                  {m.content}
                </div>

                {m.role === "user" && (
                  <div className="h-8 w-8 rounded-full bg-foreground/10 text-foreground flex items-center justify-center shrink-0 mt-0.5">
                    <User size={16} />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-blue animate-ping" />
                <span>Hastivo AI is reasoning over ISL grammatical syntax...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Suggested Prompts Pills */}
          <div className="pt-4 border-t border-border/50">
            <span className="text-[11px] font-mono uppercase text-muted-foreground block mb-2">
              Suggested Questions
            </span>
            <div className="flex flex-wrap gap-2">
              {suggestedPrompts.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSend(p)}
                  disabled={loading || limitReached}
                  className="px-3 py-1 rounded-full border border-border bg-foreground/[0.02] hover:bg-foreground/[0.06] text-xs text-muted-foreground hover:text-foreground transition-all cursor-pointer text-left truncate max-w-md disabled:opacity-50"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Prompt Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 rounded-2xl border border-border/80 bg-foreground/[0.02] flex items-center gap-2"
        >
          <button
            type="button"
            onClick={toggleVoiceInput}
            className={`p-2.5 rounded-xl border transition-colors ${
              isListening
                ? "bg-coral text-charcoal border-coral"
                : "border-border text-muted-foreground hover:text-foreground hover:bg-foreground/5"
            }`}
            title="Voice input"
          >
            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>

          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask anything about ISL grammar or accessibility..."
            disabled={loading || limitReached}
            className="flex-1 bg-transparent px-3 py-2 text-sm focus:outline-none text-foreground placeholder:text-muted-foreground disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={!prompt.trim() || loading || limitReached}
            className="px-4 py-2 rounded-xl bg-coral text-charcoal font-medium text-xs sm:text-sm hover:opacity-90 transition-opacity flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-sm"
          >
            <Send size={15} />
            <span>Send</span>
          </button>
        </form>

        {/* Quota notification banner */}
        <div className="flex items-center justify-between text-xs font-mono px-2 text-muted-foreground">
          <span>
            Guest AI Quota: <strong className="text-coral">{usageRemaining} / 8 messages remaining</strong>
          </span>
          <Link to="/upgrade-account" className="text-blue hover:underline">
            Upgrade with Google for unlimited history &rarr;
          </Link>
        </div>
      </div>
    </GuestLayout>
  );
}

