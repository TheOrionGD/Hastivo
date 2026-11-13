import { PerspectiveText3D, GravityLetters, TiltCard, Squircle } from "@/components/ui/smoothui";
import React, { useState, useEffect } from "react";
import { BookOpen, Search, Bookmark, BookmarkCheck } from "lucide-react";
import { HastivoUserLayout } from "@/components/layout/HastivoUserLayout";
import { GlassPanel } from "@/components/glass/GlassPanel";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassInput, GlassButton } from "@/components/glass/GlassControls";
import { GlassModal } from "@/components/glass/GlassModal";
import AvatarScene from "@/components/three/AvatarScene";
import { useLanguage } from "@/hooks/useLanguage";

export default function ISLExplorerPage() {
  const { currentLang, t, meta } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [signs, setSigns] = useState([]);
  const [selectedSign, setSelectedSign] = useState(null);
  const [savedSigns, setSavedSigns] = useState([]);

  useEffect(() => {
    fetch("/api/v1/avatar/signs")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.signs) {
          setSigns(data.signs);
        } else {
          // Multilingual ISL common baseline
          setSigns([
            {
              id: "namaste",
              name: meta.greeting,
              category: "Greetings",
              meaning: "Traditional respectful greeting gesture with palms together.",
            },
            {
              id: "thank_you",
              name: currentLang === "ta" ? "நன்றி (Nandri)" : currentLang === "te" ? "ధన్యవాదాలు (Dhanyavadalu)" : currentLang === "hi" ? "धन्यवाद (Dhanyawad)" : currentLang === "kn" ? "ಧನ್ಯವಾದಗಳು (Dhanyavadagalu)" : currentLang === "ml" ? "നന്ദി (Nandi)" : currentLang === "ur" ? "شکریہ (Shukriya)" : "Thank You",
              category: "Greetings",
              meaning: "Expressing gratitude with palms moving forward from chin.",
            },
            {
              id: "help",
              name: currentLang === "hi" ? "मदद (Madad / Help)" : currentLang === "ta" ? "உதவி (Udhavi)" : currentLang === "te" ? "సహాయం (Sahayam)" : currentLang === "kn" ? "ಸಹಾಯ (Sahaya)" : currentLang === "ml" ? "സഹായം (Sahayam)" : currentLang === "ur" ? "مدد (Madad)" : "Help",
              category: "Essential",
              meaning: "Assistance request gesture with supportive palm lifting closed fist.",
            },
            {
              id: "hospital",
              name: "Hospital / Medical",
              category: "Emergency",
              meaning: "Cross sign on upper arm indicating hospital or emergency clinic.",
            },
            {
              id: "water",
              name: currentLang === "hi" ? "पानी (Paani / Water)" : currentLang === "ta" ? "தண்ணீர் (Thanneer)" : currentLang === "te" ? "నీరు (Neeru)" : currentLang === "kn" ? "ನೀರು (Neeru)" : currentLang === "ml" ? "വെള്ളം (Vellam)" : currentLang === "ur" ? "پانی (Paani)" : "Water",
              category: "Essential",
              meaning: "W-handshape tapped gently near the lower lip/chin.",
            },
            {
              id: "learn",
              name: "Learn / Education",
              category: "Education",
              meaning: "Taking information from open palm to forehead.",
            },
          ]);
        }
      })
      .catch(() => {});
  }, [currentLang, meta.greeting]);

  const categories = ["all", "Greetings", "Essential", "Emergency", "Education"];

  const filteredSigns = signs.filter((s) => {
    const matchesCat = selectedCategory === "all" || s.category === selectedCategory;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const toggleSave = (signId) => {
    if (savedSigns.includes(signId)) {
      setSavedSigns(savedSigns.filter((id) => id !== signId));
    } else {
      setSavedSigns([...savedSigns, signId]);
    }
  };

  return (
    <HastivoUserLayout
      title={t.islExplorerTitle}
      subtitle={t.islExplorerSubtitle}
    >
      <div className="mb-6">
        <h1 className="font-heading text-3xl font-bold text-foreground">
          {t.islExplorerTitle}
        </h1>
        <p className="font-sans text-sm text-text-2 mt-1">
          Explore certified Indian Sign Language vocabulary signs, definitions, and 3D avatar gesture demonstrations in {meta.name}.
        </p>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <GlassInput
          placeholder={t.searchSignsPlaceholder}
          icon={Search}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />

        <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap border transition-colors ${
                selectedCategory === cat
                  ? "bg-coral text-charcoal border-coral font-bold"
                  : "bg-surface/50 border-border text-text-2 hover:bg-surface"
              }`}
            >
              {cat === "all" ? t.allCategories : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Vocabulary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSigns.map((sign) => {
          const isSaved = savedSigns.includes(sign.id);
          return (
            <GlassCard
              key={sign.id}
              className="flex flex-col justify-between group hover:border-coral transition-colors"
              onClick={() => setSelectedSign(sign)}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-coral/15 text-coral text-[11px] font-bold">
                    {sign.category || "General"}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSave(sign.id);
                    }}
                    className="p-1 rounded-lg text-text-3 hover:text-coral"
                  >
                    {isSaved ? (
                      <BookmarkCheck className="w-4 h-4 text-coral" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <h3 className="font-heading text-xl font-bold text-foreground mb-1">
                  {sign.name}
                </h3>
                <p className="font-sans text-xs text-text-2 line-clamp-2">
                  {sign.meaning}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-border/60 flex justify-end">
                <span className="text-xs text-blue group-hover:underline font-medium">
                  {t.watchDemo}
                </span>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Sign Demonstration Modal */}
      <GlassModal
        isOpen={Boolean(selectedSign)}
        onClose={() => setSelectedSign(null)}
        title={selectedSign?.name}
        description={selectedSign?.meaning}
        size="lg"
      >
        <div className="h-72 rounded-2xl overflow-hidden bg-charcoal/90 border border-border/80 my-4">
          <AvatarScene stage={1} />
        </div>
      </GlassModal>
    </HastivoUserLayout>
  );
}
