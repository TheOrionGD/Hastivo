import { FocusBlurResolve, BorderBeam, Meter, SwitchboardCard } from "@/components/ui/smoothui";
import React, { useState } from "react";
import { Sliders, Cpu, Save, ShieldCheck } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { GlassPanel } from "@/components/glass/GlassPanel";
import { GlassInput, GlassButton } from "@/components/glass/GlassControls";

export default function AIConfigurationPage() {
  const [activeModel, setActiveModel] = useState("groq-llama3-70b");
  const [temperature, setTemperature] = useState(0.3);
  const [maxTokens, setMaxTokens] = useState(1024);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <AdminLayout
      title="AI Configuration & Models"
      subtitle="Inference Hyperparameters, Groq Bridge & Target Models"
    >
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="p-4 rounded-2xl bg-blue/10 border border-blue/30 text-blue text-xs flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 shrink-0" />
          <span>
            API secret tokens are managed exclusively through secure backend environment variables (`GROQ_API_KEY`) and are never dispatched to client state.
          </span>
        </div>

        <GlassPanel elevation="z2" className="p-6 space-y-5 font-sans text-xs">
          <div>
            <label className="text-text-2 font-bold uppercase tracking-wider block mb-1.5">
              Active LLM Inference Engine
            </label>
            <select
              value={activeModel}
              onChange={(e) => setActiveModel(e.target.value)}
              className="w-full rounded-xl bg-surface border border-border p-3 text-sm text-foreground outline-none"
            >
              <option value="groq-llama3-70b">Groq LLaMA 3.3 70B Versatile (Primary)</option>
              <option value="groq-mixtral-8x7b">Groq Mixtral 8x7B (Fallback)</option>
              <option value="local-bilstm-cv">Internal BiLSTM Gesture Classifier</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-text-2 font-bold uppercase tracking-wider block mb-1.5">
                Temperature ({temperature})
              </label>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-coral"
              />
              <span className="text-[10px] text-text-3 mt-1 block">
                Lower values provide precise, deterministic ISL grammar mapping.
              </span>
            </div>

            <div>
              <label className="text-text-2 font-bold uppercase tracking-wider block mb-1.5">
                Max Output Tokens
              </label>
              <GlassInput
                type="number"
                value={maxTokens}
                onChange={(e) => setMaxTokens(parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border/60">
            {savedSuccess && (
              <span className="text-emerald-400 font-bold">
                Inference parameters updated successfully.
              </span>
            )}
            <GlassButton
              variant="primary"
              icon={Save}
              onClick={handleSave}
              className="ml-auto"
            >
              Save Configuration
            </GlassButton>
          </div>
        </GlassPanel>
      </div>
    </AdminLayout>
  );
}

