import { MicroScaleFade, EmbossSurface, MorphSurface } from "@/components/ui/smoothui";
import React, { useState } from "react";
import { Layers, Sliders, Check, User, Sparkles } from "lucide-react";
import { HastivoUserLayout } from "@/components/layout/HastivoUserLayout";
import { GlassPanel } from "@/components/glass/GlassPanel";
import { GlassButton } from "@/components/glass/GlassControls";
import AvatarScene, { AVATAR_MODELS } from "@/components/three/AvatarScene";

export default function AvatarSettingsPage() {
  const [selectedVariant, setSelectedVariant] = useState("x-bot");

  const avatarOptions = [
    {
      id: "x-bot",
      name: "X-Bot (Mixamo Female Rig)",
      description: "Optimized 21-joint female humanoid rig with fluid fingers and expressive signing arcs.",
      badge: "Mixamo FBX (Active)",
    },
    {
      id: "y-bot",
      name: "Y-Bot (Mixamo Male Rig)",
      description: "High-precision athletic male rig calibrated for spatial Indian Sign Language gesturing.",
      badge: "Mixamo FBX",
    },
    {
      id: "default",
      name: "Standard Procedural Rig",
      description: "Ultra-lightweight procedural GLTF rig with stylized ceramic shell and cyber visor.",
      badge: "Procedural GLTF",
    },
  ];

  return (
    <HastivoUserLayout title="Avatar Customizer" subtitle="3D Sign Model & Rig">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">
              3D Avatar Rig Settings
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Select and configure the 3D humanoid avatar used for real-time text-to-sign generation and gesture feedback.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-coral/15 text-coral border border-coral/30">
            <Sparkles className="w-3.5 h-3.5" />
            Active Rig: {AVATAR_MODELS[selectedVariant]?.name || selectedVariant}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-[420px] rounded-3xl overflow-hidden bg-charcoal/90 border border-border/80 relative shadow-2xl">
            <AvatarScene className="h-full w-full" modelType={selectedVariant} />
            <div className="absolute bottom-4 left-4 right-4 bg-background/80 backdrop-blur-md p-3 rounded-2xl border border-border/60 text-xs text-text-2 flex items-center justify-between">
              <span className="font-medium text-foreground">
                Model: <code className="text-coral font-mono">{selectedVariant}</code>
              </span>
              <span className="text-[11px] text-muted-foreground">Interactive Kinematic Orbit</span>
            </div>
          </div>

          <GlassPanel elevation="z2" className="p-6 space-y-5">
            <h3 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
              <User className="w-5 h-5 text-coral" />
              Humanoid Rig Selection
            </h3>
            <p className="font-sans text-xs text-text-2 leading-relaxed">
              Hastivo supports authentic 3D signing avatars equipped with 21 articulation joints per hand, anatomical wrist mobility, and facial expression tracks for authentic ISL communication.
            </p>

            <div className="space-y-3 pt-1">
              {avatarOptions.map((opt) => {
                const isSelected = selectedVariant === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setSelectedVariant(opt.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? "bg-coral/15 border-coral shadow-sm shadow-coral/10 text-foreground"
                        : "bg-surface/50 border-border hover:border-coral/40 text-text-2"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-foreground">{opt.name}</span>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-surface-2 border border-border/80 text-muted-foreground">
                          {opt.badge}
                        </span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-coral shrink-0" />}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {opt.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </GlassPanel>
        </div>
      </div>
    </HastivoUserLayout>
  );
}
