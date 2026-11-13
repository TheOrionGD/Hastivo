import { SwitchboardCard, ScaleDownFade } from "@/components/ui/smoothui";
import React, { useState } from "react";
import { Sliders, Shield, Globe, HardDrive } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { GlassPanel } from "@/components/glass/GlassPanel";
import { GlassButton } from "@/components/glass/GlassControls";

export default function SystemSettingsPage() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [guestLimits, setGuestLimits] = useState(10);
  const [bilstmThreshold, setBilstmThreshold] = useState(0.85);

  return (
    <AdminLayout
      title="Global System Settings"
      subtitle="Feature Flags, Global Limits & Security Parameters"
    >
      <div className="max-w-3xl mx-auto space-y-6">
        <GlassPanel elevation="z2" className="p-6 divide-y divide-border/60">
          <div className="py-4 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-sm text-foreground">Maintenance Mode</h4>
              <p className="text-xs text-text-3">Suspend user logins and display an administrative maintenance page.</p>
            </div>
            <input
              type="checkbox"
              checked={maintenanceMode}
              onChange={(e) => setMaintenanceMode(e.target.checked)}
              className="accent-coral"
            />
          </div>

          <div className="py-4 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-sm text-foreground">Guest Session Daily Limit</h4>
              <p className="text-xs text-text-3">Maximum free sign-to-text inferences permitted before upgrade prompt.</p>
            </div>
            <span className="font-mono text-sm font-bold text-coral">{guestLimits} conversions</span>
          </div>

          <div className="py-4 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-sm text-foreground">BiLSTM Gesture Confidence Cutoff</h4>
              <p className="text-xs text-text-3">Signs below this confidence threshold trigger uncertainty warnings.</p>
            </div>
            <span className="font-mono text-sm font-bold text-blue">{Math.round(bilstmThreshold * 100)}%</span>
          </div>
        </GlassPanel>
      </div>
    </AdminLayout>
  );
}

