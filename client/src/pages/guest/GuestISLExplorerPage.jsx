import { PerspectiveText3D, GlowHoverCard, Squircle } from "@/components/ui/smoothui";
import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  BookOpen,
  Search,
  Sparkles,
  Play,
  RotateCcw,
  Tag,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { GuestLayout } from "@/components/guest/GuestLayout";
import { AvatarStage } from "@/components/three/AvatarStage";

const CATEGORIES = ["All", "Greetings", "Everyday", "Courtesy", "Academic", "Emergency"];

const PUBLIC_VOCABULARY = [
  {
    id: "vocab_1",
    gloss: "HELLO",
    label: "Hello / Namaste",
    category: "Greetings",
    description: "Open right hand waved near the temple with a warm, friendly facial expression.",
    hand: "Right (Single)",
    difficulty: "Beginner",
  },
  {
    id: "vocab_2",
    gloss: "THANK_YOU",
    label: "Thank You / धन्यवाद",
    category: "Courtesy",
    description: "Fingertips of flat hand placed lightly on chin and moved forward towards the observer.",
    hand: "Right (Single)",
    difficulty: "Beginner",
  },
  {
    id: "vocab_3",
    gloss: "WELCOME",
    label: "Welcome / स्वागत",
    category: "Greetings",
    description: "Both hands open palms facing upwards, drawn gently inward in a sweeping motion.",
    hand: "Both (Dual)",
    difficulty: "Intermediate",
  },
  {
    id: "vocab_4",
    gloss: "UNDERSTAND",
    label: "I Understand Everything",
    category: "Everyday",
    description: "Index finger raised adjacent to temple with an affirmative head nod.",
    hand: "Right (Single)",
    difficulty: "Intermediate",
  },
  {
    id: "vocab_5",
    gloss: "PLEASE",
    label: "Please / कृपया",
    category: "Courtesy",
    description: "Flat hand placed flat on the upper chest with small circular rubbing motion.",
    hand: "Right (Single)",
    difficulty: "Beginner",
  },
  {
    id: "vocab_6",
    gloss: "HELP",
    label: "Help / सहायता",
    category: "Emergency",
    description: "Left flat palm supporting right thumbs-up fist and moving vertically upwards.",
    hand: "Both (Dual)",
    difficulty: "Intermediate",
  },
  {
    id: "vocab_7",
    gloss: "SIGN_LANGUAGE",
    label: "Sign Language / सांकेतिक भाषा",
    category: "Academic",
    description: "Both hands with index fingers circling alternatingly in forward rotational motion.",
    hand: "Both (Dual)",
    difficulty: "Intermediate",
  },
  {
    id: "vocab_8",
    gloss: "FAMILY",
    label: "Family / परिवार",
    category: "Everyday",
    description: "Both hands forming 'F' or circular shapes touching at index fingers and drawing out.",
    hand: "Both (Dual)",
    difficulty: "Advanced",
  },
];

/**
 * 5. GUEST ISL EXPLORER
 * - FETCH: Public ISL vocabulary, categories, sign media, descriptions and search index.
 * - DISPLAY: Sign cards, vocabulary descriptions, categories, video or avatar demonstrations.
 * - INPUT: Search term, category filter, selected sign.
 */
export default function GuestISLExplorerPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSign, setSelectedSign] = useState(PUBLIC_VOCABULARY[3]); // Default to "UNDERSTAND" matching reference
  const [isPlaying, setIsPlaying] = useState(true);

  const filteredSigns = PUBLIC_VOCABULARY.filter((sign) => {
    const matchesCategory = selectedCategory === "All" || sign.category === selectedCategory;
    const matchesSearch =
      sign.gloss.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sign.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sign.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <GuestLayout
      activeId="explorer"
      title="Guest ISL Vocabulary Explorer"
      subtitle="Browse verified Indian Sign Language dictionary entries and watch 3D avatar spatial demonstrations"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8">
        {/* Left Column: Search, Category Filters, and Sign Cards Grid */}
        <div className="space-y-6">
          {/* Search bar & Category filters */}
          <div className="space-y-3">
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search ISL vocabulary (e.g. Namaste, Thank You, Family)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-foreground/[0.02] text-sm focus:outline-none focus:border-coral"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-foreground text-background font-bold shadow-xs"
                      : "bg-foreground/5 hover:bg-foreground/10 text-muted-foreground hover:text-foreground border border-border/80"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredSigns.map((item) => {
              const isSelected = selectedSign?.id === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setSelectedSign(item);
                    setIsPlaying(true);
                  }}
                  className={`p-5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "border-coral bg-coral/10 ring-1 ring-coral shadow-sm"
                      : "border-border/80 bg-foreground/[0.01] hover:border-border hover:bg-foreground/[0.03]"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs uppercase px-2 py-0.5 rounded bg-foreground/10 font-bold text-coral">
                        {item.gloss}
                      </span>
                      <span className="text-[11px] font-mono text-muted-foreground">{item.difficulty}</span>
                    </div>
                    <h4 className="font-display text-lg font-semibold text-foreground">{item.label}</h4>
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                    <span>{item.hand}</span>
                    <span className="text-blue font-semibold">View 3D &rarr;</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Sign 3D Demonstration Loop & Detailed Specs */}
        <div className="space-y-6">
          <div className="p-5 rounded-2xl border border-border bg-foreground/[0.02] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-coral font-bold">
                  {selectedSign.gloss}
                </span>
                <h3 className="font-display text-xl font-bold mt-0.5">{selectedSign.label}</h3>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue/10 text-blue border border-blue/20">
                {selectedSign.category}
              </span>
            </div>

            {/* 3D WebGL Avatar Demonstration Stage */}
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-border/80 bg-neutral-900 shadow-inner flex items-center justify-center">
              <AvatarStage className="w-full h-full" />

              {/* Floating Gloss Overlay */}
              <div className="absolute top-3 left-3 z-10">
                <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-mono border border-white/10 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-coral animate-ping" />
                  Kinematic Sign Loop
                </span>
              </div>
            </div>

            {/* Description & Kinematic Details */}
            <div className="space-y-3 text-xs leading-relaxed">
              <div>
                <span className="font-semibold text-foreground block mb-1">Spatial Execution:</span>
                <p className="text-muted-foreground">{selectedSign.description}</p>
              </div>

              <div className="p-3 rounded-xl border border-border/60 bg-foreground/5 space-y-1 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Hand Configuration:</span>
                  <span className="text-foreground">{selectedSign.hand}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Corpus Standard:</span>
                  <span className="text-blue">INCLUDE-50 / ISL-CSLTR</span>
                </div>
              </div>
            </div>

            {/* Upgrade Banner */}
            <div className="pt-2">
              <Link
                to="/upgrade-account"
                className="w-full py-2 px-3 rounded-xl bg-coral/15 border border-coral/30 hover:bg-coral/25 text-coral text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Sparkles size={14} /> Bookmark Sign to Permanent Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </GuestLayout>
  );
}

