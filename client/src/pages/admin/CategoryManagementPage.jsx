import { StaggerFromCenter, Squircle, SmoothButton } from "@/components/ui/smoothui";
import React, { useState } from "react";
import { FolderTree, Plus, Trash2, Edit2 } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { GlassPanel } from "@/components/glass/GlassPanel";
import { GlassButton, GlassInput } from "@/components/glass/GlassControls";

export default function CategoryManagementPage() {
  const [categories, setCategories] = useState([
    { id: 1, name: "Greetings & Politeness", count: 28, status: "Active" },
    { id: 2, name: "Essential Daily Needs", count: 45, status: "Active" },
    { id: 3, name: "Emergency & Medical", count: 18, status: "Active" },
    { id: 4, name: "Education & Literacy", count: 32, status: "Active" },
  ]);
  const [newCatName, setNewCatName] = useState("");

  const handleAdd = () => {
    if (!newCatName.trim()) return;
    setCategories([
      ...categories,
      { id: Date.now(), name: newCatName.trim(), count: 0, status: "Active" },
    ]);
    setNewCatName("");
  };

  return (
    <AdminLayout
      title="Community Category Management"
      subtitle="Organize Discussions, ISL Signs & Knowledge Topics"
    >
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex gap-3">
          <GlassInput
            placeholder="New Category Name..."
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
          />
          <GlassButton variant="primary" icon={Plus} onClick={handleAdd}>
            Add Category
          </GlassButton>
        </div>

        <GlassPanel elevation="z2" className="divide-y divide-border/60">
          {categories.map((cat) => (
            <div key={cat.id} className="p-4 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-foreground">{cat.name}</h4>
                <span className="text-xs text-text-3">{cat.count} signs cataloged</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/15 text-emerald-400 text-xs font-semibold border border-emerald-400/30">
                {cat.status}
              </span>
            </div>
          ))}
        </GlassPanel>
      </div>
    </AdminLayout>
  );
}

