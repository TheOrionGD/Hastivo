import { KineticCenterBuild, UserAccountAvatar, WalletCard } from "@/components/ui/smoothui";
import React, { useState, useEffect } from "react";
import { User, Shield, Mail, Calendar, CheckCircle2 } from "lucide-react";
import { HastivoUserLayout } from "@/components/layout/HastivoUserLayout";
import { GlassPanel } from "@/components/glass/GlassPanel";
import { GlassInput, GlassButton } from "@/components/glass/GlassControls";
import { sessionManager } from "@/services/auth/sessionManager";

export default function ProfilePage() {
  const [profile, setProfile] = useState(() => sessionManager.getUser());
  const [displayName, setDisplayName] = useState(profile?.displayName || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/v1/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.user) {
          setProfile(data.user);
          setDisplayName(data.user.displayName || "");
          setPhone(data.user.phone || "");
        }
      })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/v1/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName, phone }),
      });
      const data = await res.json();
      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch {} finally {
      setSaving(false);
    }
  };

  return (
    <HastivoUserLayout title="Profile" subtitle="Personal Identity & Account">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="font-heading text-3xl font-bold text-foreground">
          User Profile
        </h1>

        <GlassPanel elevation="z2" className="p-8 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-coral to-blue flex items-center justify-center text-2xl font-bold text-white uppercase shadow-lg">
              {profile?.displayName?.[0] || profile?.username?.[0] || "U"}
            </div>
            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground">
                {profile?.displayName || profile?.username || "Hastivo User"}
              </h2>
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 mt-0.5">
                <CheckCircle2 className="w-4 h-4" /> Verified Hastivo Account
              </span>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-border/60">
            <div>
              <label className="text-xs font-semibold text-text-2 uppercase tracking-wider block mb-1.5">
                Email Address
              </label>
              <GlassInput
                disabled
                value={profile?.email || "user@example.com"}
                icon={Mail}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-text-2 uppercase tracking-wider block mb-1.5">
                Display Name
              </label>
              <GlassInput
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                icon={User}
              />
            </div>

            <div className="flex items-center justify-between pt-4">
              {savedSuccess && (
                <span className="text-xs text-emerald-400 font-semibold">
                  Changes saved successfully!
                </span>
              )}
              <GlassButton
                variant="primary"
                loading={saving}
                onClick={handleSave}
                className="ml-auto"
              >
                Save Changes
              </GlassButton>
            </div>
          </div>
        </GlassPanel>
      </div>
    </HastivoUserLayout>
  );
}

