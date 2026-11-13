import { useState, useEffect } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import {
  Accessibility,
  Eye,
  Keyboard,
  Globe,
  ShieldCheck,
  Check,
  Volume2,
  Sliders,
  Type,
  SunMoon,
  ArrowLeft,
  Sparkles,
  Info,
} from "lucide-react";
import { BrandMark } from "@/components/common/BrandMark";
import { ThemeSwitch } from "@/components/navigation/Nav";
import Kbd from "@/components/ui/smoothui/kbd";
import ScrollProgress from "@/components/ui/smoothui/scroll-progress";

const EASE = [0.22, 1, 0.36, 1];

const FALLBACK_ACCESSIBILITY = {
  version: "2026.1.0",
  complianceLevel: "WCAG 2.2 Level AAA (targeted)",
  guidelines: [
    {
      id: "wcag_perceivable",
      title: "Perceivable Information & UI",
      description:
        "Text alternatives for non-text content, adaptable layout structure, and distinct color contrasts ensuring complete clarity across light and dark modes.",
    },
    {
      id: "wcag_operable",
      title: "Full Operable Control & Navigation",
      description:
        "100% keyboard accessibility across all interactive controls, visible focal indicators, clear skip links, and no traps or timing limits during communication.",
    },
    {
      id: "wcag_understandable",
      title: "Understandable Dialog & Predictable UI",
      description:
        "Predictable spatial interactions, intuitive feedback upon glossing and audio processing, and comprehensive error prevention.",
    },
    {
      id: "wcag_robust",
      title: "Robust Compatibility & Assistive Tech",
      description:
        "ARIA landmark semantics, screen reader announcements for live video/spatial translations, and interoperability across modern browsers and screen magnifiers.",
    },
  ],
  features: [
    {
      id: "high_contrast",
      title: "High Contrast Mode",
      description:
        "Enhances font weights, borders, and contrast ratios up to 7:1 against dark and light canvases.",
    },
    {
      id: "reduced_motion",
      title: "Reduced Motion Adaptation",
      description:
        "Honors system prefers-reduced-motion, silencing heavy physics and ambient particle animations while keeping avatar signing intact.",
    },
    {
      id: "text_sizing",
      title: "Dynamic Text Scaling",
      description:
        "Scales user captions, gloss bubbles, and navigation typography up to 150% without truncating UI components.",
    },
    {
      id: "live_captions",
      title: "Live Real-Time Captions & Glossing",
      description:
        "Subtitles for spoken input, phoneme hints, and explicit ISL/ASL gloss tags displayed side-by-side with avatar animation.",
    },
    {
      id: "avatar_speed_control",
      title: "Adaptive Avatar Playback Speed",
      description:
        "Permits slow-motion avatar signing (0.5x, 0.75x) for learner comprehension or accelerated pace (1.25x, 1.5x).",
    },
    {
      id: "screen_reader_live_regions",
      title: "Live ARIA Telemetry Regions",
      description:
        "Spoken translation transcripts and gesture recognition results are broadcasted dynamically via aria-live assertive and polite channels.",
    },
  ],
  keyboardShortcuts: [
    { key: "Tab / Shift+Tab", action: "Navigate sequentially across focusable controls" },
    { key: "Enter / Space", action: "Activate buttons, links, and modal toggles" },
    { key: "Escape", action: "Dismiss modals, skip splash intro, or close open menus" },
    { key: "Alt + A", action: "Toggle accessibility settings panel" },
    { key: "Alt + M", action: "Toggle mute / microphone input in translation studios" },
    { key: "Alt + C", action: "Toggle live camera feed for gesture recognition" },
    { key: "Alt + S", action: "Adjust avatar playback speed step (0.75x -> 1.0x -> 1.25x)" },
  ],
  supportedLanguages: [
    { code: "en", name: "English", native: "English", region: "Global" },
    { code: "hi", name: "Hindi", native: "हिन्दी", region: "India" },
    { code: "ta", name: "Tamil", native: "தமிழ்", region: "Tamil Nadu & Puducherry" },
    { code: "te", name: "Telugu", native: "తెలుగు", region: "Andhra Pradesh & Telangana" },
    { code: "ur", name: "Urdu", native: "اردو", region: "South Asia" },
    { code: "bn", name: "Bengali", native: "বাংলা", region: "West Bengal & South Asia" },
    { code: "mr", name: "Marathi", native: "मराठी", region: "Maharashtra" },
    { code: "gu", name: "Gujarati", native: "ગુજરાતી", region: "Gujarat" },
    { code: "kn", name: "Kannada", native: "ಕನ್ನಡ", region: "Karnataka" },
    { code: "ml", name: "Malayalam", native: "മലയാളം", region: "Kerala" },
    { code: "isl", name: "Indian Sign Language Gloss", native: "भारतीय सांकेतिक भाषा", region: "India (Spatial)" },
  ],
  privacyExplanations: [
    {
      title: "Volatile In-Memory Landmark Extraction",
      detail:
        "When the camera is active, your video stream is analyzed locally or in transient volatile memory strictly for 3D hand and pose coordinate extraction. Video frames are discarded immediately after landmark synthesis.",
    },
    {
      title: "Zero Biometric Facial Profiling",
      detail:
        "Facial landmarks are mapped purely for sign language emotional markers (e.g., eyebrows, mouth shapes) and never cross-referenced with biometric identity registries.",
    },
    {
      title: "Encrypted Audio Phonetic Processing",
      detail:
        "Microphone speech recognition converts your words into acoustic phonetic tokens for sign generation and is never harvested for advertising or model retention without consent.",
    },
  ],
};

const SECTIONS = [
  { id: "guidelines", label: "Guidelines & Standards", icon: Accessibility },
  { id: "features", label: "Assistive Features", icon: Sliders },
  { id: "keyboard", label: "Keyboard Controls", icon: Keyboard },
  { id: "languages", label: "Supported Languages", icon: Globe },
  { id: "privacy", label: "Privacy Explanations", icon: ShieldCheck },
];

/**
 * 11. ACCESSIBILITY INFORMATION
 * - FETCH: Accessibility guidelines and supported accessibility features.
 * - DISPLAY: Accessibility information, keyboard controls, supported languages, privacy explanations.
 * - INPUT: Language selection and accessibility preference navigation.
 */
export default function AccessibilityPage() {
  const router = useRouter();
  const prefersReduced = useReducedMotion();
  const [data, setData] = useState(FALLBACK_ACCESSIBILITY);
  const [activeSection, setActiveSection] = useState("guidelines");
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  // Local state for user interactive accessibility toggles
  const [highContrast, setHighContrast] = useState(() => {
    try {
      return localStorage.getItem("hastivo_high_contrast") === "true";
    } catch {
      return false;
    }
  });
  const [textSize, setTextSize] = useState(() => {
    try {
      return localStorage.getItem("hastivo_text_size") || "100";
    } catch {
      return "100";
    }
  });
  const [avatarSpeed, setAvatarSpeed] = useState(() => {
    try {
      return localStorage.getItem("hastivo_avatar_speed") || "1.0";
    } catch {
      return "1.0";
    }
  });
  const [liveSubtitles, setLiveSubtitles] = useState(() => {
    try {
      return localStorage.getItem("hastivo_live_subtitles") !== "false";
    } catch {
      return true;
    }
  });
  const [savedNotification, setSavedNotification] = useState(false);

  // FETCH: Accessibility guidelines and supported accessibility features
  useEffect(() => {
    let active = true;
    fetch("/api/v1/accessibility")
      .then((r) => (r.ok ? r.json() : null))
      .then((res) => {
        if (active && res?.accessibility) {
          setData(res.accessibility);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  // Update contrast root class
  useEffect(() => {
    try {
      if (highContrast) {
        document.documentElement.classList.add("high-contrast");
        localStorage.setItem("hastivo_high_contrast", "true");
      } else {
        document.documentElement.classList.remove("high-contrast");
        localStorage.setItem("hastivo_high_contrast", "false");
      }
    } catch {}
  }, [highContrast]);

  // Update text sizing
  useEffect(() => {
    try {
      localStorage.setItem("hastivo_text_size", textSize);
    } catch {}
  }, [textSize]);

  // Update avatar speed
  useEffect(() => {
    try {
      localStorage.setItem("hastivo_avatar_speed", avatarSpeed);
    } catch {}
  }, [avatarSpeed]);

  // Update live subtitles
  useEffect(() => {
    try {
      localStorage.setItem("hastivo_live_subtitles", String(liveSubtitles));
    } catch {}
  }, [liveSubtitles]);

  // Trigger feedback banner upon saving preferences
  const savePreferences = async () => {
    try {
      await fetch("/api/v1/user/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          highContrast,
          textSize: Number(textSize),
          avatarSpeed: Number(avatarSpeed),
          subtitlesEnabled: liveSubtitles,
          language: selectedLanguage,
        }),
      });
    } catch {}
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 3000);
  };

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth" });
    }
  };

  return (
    <div className="min-h-[100svh] bg-background text-foreground flex flex-col justify-between selection:bg-coral selection:text-charcoal">
      {/* Top Header */}
      <header className="border-b border-border/80 px-5 py-4 sm:px-10 flex items-center justify-between sticky top-0 bg-background/85 backdrop-blur-md z-30">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors mr-2"
            aria-label="Back to home"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Back</span>
          </Link>
          <Link to="/" className="flex items-center gap-3">
            <BrandMark size={28} />
            <span className="font-display text-lg font-medium tracking-tight">Hastivo</span>
          </Link>
          <span className="hidden md:inline-flex items-center px-2 py-0.5 text-[11px] font-mono border border-blue/40 text-blue rounded-full bg-blue/5">
            Accessibility Hub
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* INPUT: Language Selection in Header */}
          <div className="flex items-center gap-1.5 border border-border px-2.5 py-1 text-xs font-mono rounded-md bg-background/50">
            <Globe size={14} className="text-blue" />
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              aria-label="Select display language"
              className="bg-transparent focus:outline-none cursor-pointer text-foreground"
            >
              {data.supportedLanguages?.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-background text-foreground">
                  {lang.name} ({lang.native})
                </option>
              ))}
            </select>
          </div>
          <ThemeSwitch />
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-5 py-8 sm:px-10">
        {/* Title & Metadata Banner */}
        <div className="border-b border-border pb-8 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 text-xs font-mono bg-coral/15 text-coral rounded-full border border-coral/30">
                  {data.complianceLevel}
                </span>
                <span className="text-xs font-mono text-muted-foreground">Version {data.version}</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight">
                Accessibility, Controls & Privacy
              </h1>
              <p className="mt-2 text-text-2 max-w-2xl text-sm sm:text-base leading-relaxed">
                Hastivo is dedicated to barrier-free communication between Deaf, hard-of-hearing, and hearing
                communities through WCAG 2.2 AAA adherence, granular sensory controls, and robust privacy safeguards.
              </p>
            </div>

            {/* Quick action button to save live preferences */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={savePreferences}
                className="px-4 py-2 rounded-md bg-coral text-charcoal font-medium text-xs sm:text-sm shadow-sm hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <Check size={16} />
                Save My Preferences
              </button>
            </div>
          </div>

          {savedNotification && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 rounded-md bg-blue/10 border border-blue/30 text-xs font-mono text-blue flex items-center gap-2"
            >
              <Info size={16} />
              Accessibility preferences successfully saved to your browser and profile profile.
            </motion.div>
          )}
        </div>

        {/* Layout Grid: Sticky Sidebar Nav + Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10">
          {/* INPUT: Accessibility Preference Navigation */}
          <aside className="space-y-6">
            <nav aria-label="Accessibility Sections" className="space-y-1 sticky top-24">
              <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3 px-3">
                Navigation
              </p>
              {SECTIONS.map((sec) => {
                const Icon = sec.icon;
                const isActive = activeSection === sec.id;
                return (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => scrollToSection(sec.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
                      isActive
                        ? "bg-foreground text-background shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                    }`}
                  >
                    <Icon size={16} className={isActive ? "text-background" : "text-blue"} />
                    <span>{sec.label}</span>
                  </button>
                );
              })}

              {/* Interactive Quick Accessibility Control Box */}
              <div className="mt-8 pt-6 border-t border-border space-y-4">
                <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground px-1">
                  Live Sensory Tuning
                </p>

                {/* High Contrast Toggle */}
                <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-foreground/5">
                  <div className="text-xs">
                    <span className="font-semibold block">High Contrast</span>
                    <span className="text-muted-foreground text-[11px]">Boost edges & contrast</span>
                  </div>
                  <input
                    type="checkbox"
                    id="highContrastToggle"
                    checked={highContrast}
                    onChange={(e) => setHighContrast(e.target.checked)}
                    aria-label="Toggle High Contrast Mode"
                    className="h-4 w-4 rounded border-border accent-coral cursor-pointer"
                  />
                </div>

                {/* Text Scaling */}
                <div className="p-3 rounded-lg border border-border bg-foreground/5 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold">Text Scale</span>
                    <span className="font-mono text-blue">{textSize}%</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="150"
                    step="10"
                    value={textSize}
                    onChange={(e) => setTextSize(e.target.value)}
                    aria-label="Text Size Slider"
                    className="w-full accent-coral cursor-pointer"
                  />
                </div>

                {/* Avatar Speed */}
                <div className="p-3 rounded-lg border border-border bg-foreground/5 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold">Avatar Pace</span>
                    <span className="font-mono text-blue">{avatarSpeed}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="1.5"
                    step="0.25"
                    value={avatarSpeed}
                    onChange={(e) => setAvatarSpeed(e.target.value)}
                    aria-label="Avatar Signing Speed Slider"
                    className="w-full accent-coral cursor-pointer"
                  />
                </div>

                {/* Live Captions Toggle */}
                <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-foreground/5">
                  <div className="text-xs">
                    <span className="font-semibold block">Live Subtitles</span>
                    <span className="text-muted-foreground text-[11px]">Auto-caption translation</span>
                  </div>
                  <input
                    type="checkbox"
                    id="subtitlesToggle"
                    checked={liveSubtitles}
                    onChange={(e) => setLiveSubtitles(e.target.checked)}
                    aria-label="Toggle Live Subtitles"
                    className="h-4 w-4 rounded border-border accent-coral cursor-pointer"
                  />
                </div>
              </div>
            </nav>
          </aside>

          {/* DISPLAY: Accessibility Content Sections */}
          <div className="space-y-16">
            {/* 1. Guidelines & Standards */}
            <section id="guidelines" className="scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <Accessibility className="text-coral" size={24} />
                <h2 className="font-display text-2xl font-medium">1. WCAG 2.2 AAA Guidelines</h2>
              </div>
              <p className="text-sm text-text-2 mb-6">
                Our interface is built in accordance with the World Wide Web Consortium (W3C) Web Content Accessibility
                Guidelines 2.2, targeting full compliance across all four core pillars:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.guidelines?.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 rounded-xl border border-border bg-foreground/[0.02] hover:border-blue/50 transition-colors"
                  >
                    <h3 className="text-base font-semibold text-foreground mb-2 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-blue" />
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 2. Assistive Features */}
            <section id="features" className="scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <Sliders className="text-blue" size={24} />
                <h2 className="font-display text-2xl font-medium">2. Assistive Features</h2>
              </div>
              <p className="text-sm text-text-2 mb-6">
                Specialized assistive capabilities built into every Hastivo screen, conversation room, and 3D signing
                canvas:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.features?.map((feat) => (
                  <div
                    key={feat.id}
                    className="p-5 rounded-xl border border-border bg-foreground/[0.02] hover:border-coral/50 transition-colors"
                  >
                    <h3 className="text-base font-semibold text-foreground mb-2 flex items-center gap-2">
                      <Sparkles size={16} className="text-yellow" />
                      {feat.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feat.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 3. Keyboard Controls */}
            <section id="keyboard" className="scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <Keyboard className="text-coral" size={24} />
                <h2 className="font-display text-2xl font-medium">3. Full Keyboard Controls & Shortcuts</h2>
              </div>
              <p className="text-sm text-text-2 mb-6">
                You can operate Hastivo completely without a mouse or pointer device. Use these standard keystrokes:
              </p>

              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-left text-sm">
                  <thead className="bg-foreground/5 border-b border-border text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th scope="col" className="px-5 py-3 font-semibold">
                        Keystroke / Shortcut
                      </th>
                      <th scope="col" className="px-5 py-3 font-semibold">
                        Action Executed
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {data.keyboardShortcuts?.map((sc, idx) => (
                      <tr key={idx} className="hover:bg-foreground/[0.02] transition-colors">
                        <td className="px-5 py-3.5 font-mono text-xs">
                          <Kbd className="h-6 px-2.5 text-xs text-foreground font-semibold shadow-xs">
                            {sc.key}
                          </Kbd>
                        </td>
                        <td className="px-5 py-3.5 text-muted-foreground">{sc.action}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* 4. Supported Languages */}
            <section id="languages" className="scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <Globe className="text-blue" size={24} />
                <h2 className="font-display text-2xl font-medium">4. Supported Languages & Dialects</h2>
              </div>
              <p className="text-sm text-text-2 mb-6">
                Hastivo supports bi-directional multi-lingual synthesis between Indian Sign Language (ISL) gloss and 10+
                regional and global spoken languages:
              </p>

              {/* INPUT: Language Selection Table */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {data.supportedLanguages?.map((lang) => {
                  const isSelected = selectedLanguage === lang.code;
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => setSelectedLanguage(lang.code)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        isSelected
                          ? "border-blue bg-blue/10 ring-1 ring-blue"
                          : "border-border bg-foreground/[0.02] hover:border-border/80 hover:bg-foreground/[0.04]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-xs uppercase px-2 py-0.5 rounded bg-foreground/10 font-medium">
                          {lang.code}
                        </span>
                        {isSelected && <Check size={16} className="text-blue" />}
                      </div>
                      <div className="font-semibold text-foreground text-sm">{lang.name}</div>
                      <div className="font-mono text-xs text-coral mt-0.5">{lang.native}</div>
                      <div className="text-[11px] text-muted-foreground mt-2">{lang.region}</div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* 5. Privacy Explanations */}
            <section id="privacy" className="scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="text-coral" size={24} />
                <h2 className="font-display text-2xl font-medium">5. Privacy Explanations & Camera Safety</h2>
              </div>
              <p className="text-sm text-text-2 mb-6">
                Assistive technologies must honor personal privacy. Hastivo employs zero-cloud camera retention and
                client-side skeletal isolation:
              </p>

              <div className="space-y-4">
                {data.privacyExplanations?.map((item, idx) => (
                  <div key={idx} className="p-5 rounded-xl border border-border bg-foreground/[0.02]">
                    <h3 className="text-base font-semibold text-foreground mb-2 flex items-center gap-2">
                      <ShieldCheck size={18} className="text-coral" />
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.detail}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 rounded-xl border border-border/80 bg-foreground/5 flex flex-wrap items-center justify-between gap-4">
                <div className="text-xs text-muted-foreground">
                  Read our full contractual legal policies:
                </div>
                <div className="flex items-center gap-4 text-xs font-mono">
                  <Link to="/privacy" className="text-blue hover:underline">
                    Privacy Policy &rarr;
                  </Link>
                  <Link to="/terms" className="text-blue hover:underline">
                    Terms & Conditions &rarr;
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

