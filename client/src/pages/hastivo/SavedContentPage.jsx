import { StaggerFromEdges, PreviewCard, ProductCard } from "@/components/ui/smoothui";
import React, { useState } from "react";
import { Bookmark, Trash2, ExternalLink } from "lucide-react";
import { HastivoUserLayout } from "@/components/layout/HastivoUserLayout";
import { GlassPanel } from "@/components/glass/GlassPanel";
import { GlassCard } from "@/components/glass/GlassCard";

export default function SavedContentPage() {
  const [savedItems, setSavedItems] = useState([
    { id: 1, title: "Namaste — ISL Sign", type: "Vocabulary", date: "Yesterday" },
    { id: 2, title: "Hospital Emergency Signs", type: "Category", date: "3 days ago" },
  ]);

  return (
    <HastivoUserLayout title="Saved Content" subtitle="Bookmarked Signs & Translations">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="font-heading text-3xl font-bold text-foreground">
          Saved Content
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {savedItems.map((item) => (
            <GlassCard key={item.id} className="p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-coral block mb-1">
                  {item.type}
                </span>
                <h4 className="font-bold text-sm text-foreground">{item.title}</h4>
                <span className="text-[10px] text-text-3">{item.date}</span>
              </div>

              <button
                onClick={() => setSavedItems(savedItems.filter((i) => i.id !== item.id))}
                className="p-2 text-text-3 hover:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </GlassCard>
          ))}
        </div>
      </div>
    </HastivoUserLayout>
  );
}

