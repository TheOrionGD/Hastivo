import { AiDiff, SwapPanel, CountBadge, GlowHoverCard } from "@/components/ui/smoothui";
import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  Check,
  X,
  Eye,
  ShieldAlert,
  Search,
} from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { GlassPanel } from "@/components/glass/GlassPanel";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassButton } from "@/components/glass/GlassControls";

export default function ModerationQueuePage() {
  const [queue, setQueue] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchQueue = () => {
    fetch("/api/v1/admin/moderation/queue")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.queue && data.queue.length > 0) {
          setQueue(data.queue);
        } else {
          setQueue([
            {
              id: "flag_101",
              type: "Community Post",
              reason: "Suspected inappropriate language or policy conflict",
              severity: "Medium",
              contentPreview: "Looking for verified medical signs...",
              reportedAt: "10 mins ago",
              status: "pending",
            },
            {
              id: "flag_102",
              type: "AI Response Flag",
              reason: "Grammar accuracy discrepancy in Tamil fingerspelling",
              severity: "Low",
              contentPreview: "Regional sign dialect question",
              reportedAt: "1 hour ago",
              status: "pending",
            },
          ]);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleAction = async (flagId, decision) => {
    try {
      await fetch("/api/v1/admin/moderation/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ flagId, action: decision }),
      });
      setQueue((prev) => prev.filter((item) => item.id !== flagId));
    } catch {
      setQueue((prev) => prev.filter((item) => item.id !== flagId));
    }
  };

  return (
    <AdminLayout
      title="Community Moderation Queue"
      subtitle="Reported Content, Safety Filters & Administrative Approvals"
    >
      <div className="space-y-4">
        {queue.length === 0 ? (
          <GlassPanel elevation="z1" className="p-12 text-center text-text-3 font-sans text-sm">
            <Check className="w-10 h-10 mx-auto mb-2 text-emerald-400" />
            Moderation queue is clean. No pending flags require review.
          </GlassPanel>
        ) : (
          queue.map((item) => (
            <GlassCard key={item.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-full bg-coral/15 text-coral text-[10px] font-bold uppercase tracking-wider border border-coral/30">
                    {item.type}
                  </span>
                  <span className="text-xs font-semibold text-yellow">
                    Severity: {item.severity}
                  </span>
                  <span className="text-xs text-text-3">• {item.reportedAt}</span>
                </div>

                <h4 className="font-bold text-sm text-foreground mt-1">
                  Reason: {item.reason}
                </h4>
                <p className="font-sans text-xs text-text-2 mt-1 italic">
                  "{item.contentPreview}"
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <GlassButton
                  variant="primary"
                  size="sm"
                  icon={Check}
                  onClick={() => handleAction(item.id, "approve")}
                >
                  Approve
                </GlassButton>
                <GlassButton
                  variant="danger"
                  size="sm"
                  icon={X}
                  onClick={() => handleAction(item.id, "dismiss")}
                >
                  Dismiss / Remove
                </GlassButton>
              </div>
            </GlassCard>
          ))
        )}
      </div>
    </AdminLayout>
  );
}

