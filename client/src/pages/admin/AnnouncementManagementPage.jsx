import { LineByLineSlide, CountBadge, SmoothButton } from "@/components/ui/smoothui";
import React, { useState } from "react";
import { Megaphone, Plus, Calendar, CheckCircle } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { GlassPanel } from "@/components/glass/GlassPanel";
import { GlassButton, GlassInput } from "@/components/glass/GlassControls";

export default function AnnouncementManagementPage() {
  const [announcements, setAnnouncements] = useState([
    { id: 1, title: "Zero-Cloud Camera Privacy Verified", date: "Nov 10, 2026", status: "Published", audience: "All Users" },
    { id: 2, title: "Tamil & Telugu Multilingual Sign Expansion", date: "Nov 12, 2026", status: "Published", audience: "All Users" },
  ]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handlePublish = () => {
    if (!title.trim()) return;
    setAnnouncements([
      { id: Date.now(), title: title.trim(), date: "Today", status: "Published", audience: "All Users" },
      ...announcements,
    ]);
    setTitle("");
    setContent("");
  };

  return (
    <AdminLayout
      title="Community Announcement Management"
      subtitle="Broadcast Platform News, Feature Releases & Service Updates"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <GlassPanel elevation="z2" className="p-6 space-y-4">
          <h3 className="font-heading text-lg font-bold text-foreground">
            Publish New Announcement
          </h3>

          <GlassInput
            placeholder="Announcement Title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            rows={3}
            placeholder="Announcement description and details..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full rounded-xl bg-surface/50 border border-border p-3 text-xs font-sans text-foreground outline-none"
          />

          <div className="flex justify-end">
            <GlassButton variant="primary" icon={Megaphone} onClick={handlePublish}>
              Broadcast Announcement
            </GlassButton>
          </div>
        </GlassPanel>

        <div className="space-y-3">
          {announcements.map((ann) => (
            <GlassPanel key={ann.id} elevation="z1" className="p-4 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-foreground">{ann.title}</h4>
                <span className="text-xs text-text-3 font-sans">
                  Published on {ann.date} • Audience: {ann.audience}
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-400/15 text-emerald-400 text-xs font-bold border border-emerald-400/30">
                {ann.status}
              </span>
            </GlassPanel>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

