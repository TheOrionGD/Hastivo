import { StaggerFromCenter, CountBadge, TiltCard } from "@/components/ui/smoothui";
import React from "react";
import { Activity, MessageSquare, ThumbsUp } from "lucide-react";
import { HastivoUserLayout } from "@/components/layout/HastivoUserLayout";
import { GlassPanel } from "@/components/glass/GlassPanel";

export default function CommunityActivityPage() {
  return (
    <HastivoUserLayout title="My Activity" subtitle="Posts, Reviews & Interactions">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="font-heading text-3xl font-bold text-foreground">
          My Community Activity
        </h1>

        <GlassPanel elevation="z2" className="p-6">
          <div className="text-center py-12 text-text-3 font-sans text-sm">
            <Activity className="w-10 h-10 mx-auto mb-2 opacity-40 text-blue" />
            Your published posts, comments, and submitted feedback will appear here.
          </div>
        </GlassPanel>
      </div>
    </HastivoUserLayout>
  );
}

