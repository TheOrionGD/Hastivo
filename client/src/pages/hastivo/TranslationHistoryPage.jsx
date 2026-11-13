import { KineticTypeScroll, ScrollProgress, ButtonCopy } from "@/components/ui/smoothui";
import React, { useState, useEffect } from "react";
import { History, Trash2, Calendar, FileText, Search } from "lucide-react";
import { HastivoUserLayout } from "@/components/layout/HastivoUserLayout";
import { GlassPanel } from "@/components/glass/GlassPanel";
import { GlassInput, GlassButton } from "@/components/glass/GlassControls";

export default function TranslationHistoryPage() {
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/v1/conversations/history")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.history) setHistory(data.history);
      })
      .catch(() => {});
  }, []);

  const filteredHistory = history.filter((item) =>
    (item.title || item.originalText || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <HastivoUserLayout
      title="History"
      subtitle="Past Translations & Conversations"
    >
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">
          Translation & Activity History
        </h1>
          <p className="font-sans text-sm text-text-2 mt-1">
            Access previous video conversions, sign recognitions, and text translations stored with end-to-end security.
          </p>
        </div>

        <GlassInput
          placeholder="Search history..."
          icon={Search}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
      </div>

      <GlassPanel elevation="z2" className="p-6">
        {filteredHistory.length === 0 ? (
          <div className="text-center py-12 text-text-3 font-sans text-sm">
            <History className="w-10 h-10 mx-auto mb-2 opacity-40 text-coral" />
            No history records found.
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {filteredHistory.map((item, idx) => (
              <div key={item.id || idx} className="py-4 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-sm text-foreground">
                    {item.title || item.originalText || "Translation Record"}
                  </h4>
                  <span className="text-xs text-text-3">
                    {item.timestamp ? new Date(item.timestamp).toLocaleString() : "Recent"}
                  </span>
                </div>
                <span className="text-xs font-mono text-text-3 bg-surface px-2.5 py-1 rounded-xl border border-border">
                  {item.type || "Text/Sign"}
                </span>
              </div>
            ))}
          </div>
        )}
      </GlassPanel>
    </HastivoUserLayout>
  );
}

