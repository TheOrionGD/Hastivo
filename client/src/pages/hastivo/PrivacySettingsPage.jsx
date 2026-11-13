import { ShortSlideRight, GlassCard, BorderBeam } from "@/components/ui/smoothui";
import React, { useState } from "react";
import { ShieldCheck, EyeOff, Trash2, Download } from "lucide-react";
import { HastivoUserLayout } from "@/components/layout/HastivoUserLayout";
import { GlassPanel } from "@/components/glass/GlassPanel";
import { GlassButton } from "@/components/glass/GlassControls";

export default function PrivacySettingsPage() {
  const [defaultAnonymous, setDefaultAnonymous] = useState(false);

  return (
    <HastivoUserLayout title="Privacy Controls" subtitle="Anonymity & Consent Management">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="font-heading text-3xl font-bold text-foreground">
          Privacy & Data Protection
        </h1>

        <GlassPanel elevation="z2" className="p-6 divide-y divide-border/60">
          <div className="py-4 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-foreground">Default Community Anonymity</h3>
              <p className="text-xs text-text-3">Automatically publish community questions and reviews anonymously.</p>
            </div>
            <input
              type="checkbox"
              checked={defaultAnonymous}
              onChange={(e) => setDefaultAnonymous(e.target.checked)}
              className="rounded border-border accent-coral"
            />
          </div>

          <div className="py-4 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-foreground">Camera & Frame Privacy</h3>
              <p className="text-xs text-text-3">Live camera feeds are processed in transient memory and never saved to cloud storage.</p>
            </div>
            <span className="text-xs font-semibold text-emerald-400">Strictly Local</span>
          </div>

          <div className="py-4 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-foreground">Export Account Data</h3>
              <p className="text-xs text-text-3">Download a copy of your personal translations and saved signs in JSON format.</p>
            </div>
            <GlassButton variant="glass" size="sm" icon={Download}>
              Export
            </GlassButton>
          </div>
        </GlassPanel>
      </div>
    </HastivoUserLayout>
  );
}

