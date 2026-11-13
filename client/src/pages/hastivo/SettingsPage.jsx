import { ScaleDownFade, SwitchboardCard, FloatingNavbar } from "@/components/ui/smoothui";
import React from "react";
import { Settings, Moon, Sun, Globe, Eye, Volume2 } from "lucide-react";
import { HastivoUserLayout } from "@/components/layout/HastivoUserLayout";
import { GlassPanel } from "@/components/glass/GlassPanel";
import { useTheme } from "@/context/ThemeContext";

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <HastivoUserLayout title="Settings" subtitle="Preferences & Accessibility">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="font-heading text-3xl font-bold text-foreground">
          System Preferences
        </h1>

        <GlassPanel elevation="z2" className="p-6 divide-y divide-border/60">
          {/* Appearance */}
          <div className="py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center text-coral">
                {theme === "dark" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="font-bold text-sm text-foreground">Appearance Theme</h3>
                <p className="text-xs text-text-3">Switch between Dark and Light spatial visual modes.</p>
              </div>
            </div>

            <button
              onClick={toggleTheme}
              className="px-4 py-2 rounded-xl bg-surface hover:bg-surface/80 border border-border text-xs font-semibold"
            >
              Toggle {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </button>
          </div>

          {/* Regional Dialect */}
          <div className="py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center text-blue">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-foreground">Default Translation Language</h3>
                <p className="text-xs text-text-3">Primary output language for ISL signs and transcripts.</p>
              </div>
            </div>

            <select className="rounded-xl bg-surface border border-border px-3 py-1.5 text-xs text-foreground outline-none">
              <option value="en">English</option>
              <option value="hi">Hindi (हिंदी)</option>
              <option value="mr">Marathi (मराठी)</option>
            </select>
          </div>
        </GlassPanel>
      </div>
    </HastivoUserLayout>
  );
}

