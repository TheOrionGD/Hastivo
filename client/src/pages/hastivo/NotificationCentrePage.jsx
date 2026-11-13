import { ShortSlideDown, PinnedList, CountBadge } from "@/components/ui/smoothui";
import React, { useState } from "react";
import { Bell, CheckCheck, Trash2 } from "lucide-react";
import { HastivoUserLayout } from "@/components/layout/HastivoUserLayout";
import { GlassPanel } from "@/components/glass/GlassPanel";
import { GlassButton } from "@/components/glass/GlassControls";

export default function NotificationCentrePage() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Video Processing Completed",
      message: "Your prerecorded ISL video conversion job #vid_982 has finished processing.",
      time: "10 mins ago",
      read: false,
    },
    {
      id: 2,
      title: "Community Post Reply",
      message: "An answer was posted on your ISL grammar question.",
      time: "2 hours ago",
      read: true,
    },
  ]);

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  return (
    <HastivoUserLayout title="Notifications" subtitle="Alerts & System Messages">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-heading text-3xl font-bold text-foreground">
          Notification Centre
        </h1>
          <GlassButton variant="glass" size="sm" icon={CheckCheck} onClick={markAllRead}>
            Mark All as Read
          </GlassButton>
        </div>

        <GlassPanel elevation="z2" className="p-6 divide-y divide-border/60">
          {notifications.map((n) => (
            <div key={n.id} className="py-4 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div
                  className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                    n.read ? "bg-transparent" : "bg-coral"
                  }`}
                />
                <div>
                  <h4 className="font-bold text-sm text-foreground">{n.title}</h4>
                  <p className="text-xs text-text-2 mt-0.5">{n.message}</p>
                  <span className="text-[10px] text-text-3 font-mono mt-1 block">
                    {n.time}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </GlassPanel>
      </div>
    </HastivoUserLayout>
  );
}

