import { SoftBlurIn, ReviewsCarousel, CoverflowCarousel, InlineTestimonials, AiDiff } from "@/components/ui/smoothui";
import React, { useState, useEffect } from "react";
import { MessageSquare, Bug, Lightbulb, Star, Send } from "lucide-react";
import { HastivoUserLayout } from "@/components/layout/HastivoUserLayout";
import { GlassPanel } from "@/components/glass/GlassPanel";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassInput, GlassButton } from "@/components/glass/GlassControls";

export default function ReviewCollaborationPage() {
  const [reviews, setReviews] = useState([]);
  const [category, setCategory] = useState("feature"); // "bug" | "feature" | "review"
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");

  useEffect(() => {
    fetch("/api/v1/guest/reviews")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.reviews) setReviews(data.reviews);
      })
      .catch(() => {});
  }, []);

  const handleSubmit = () => {
    if (!comment.trim()) return;
    const newReview = {
      id: `rev_${Date.now()}`,
      title: title || "User Feedback",
      comment: comment,
      category: category,
      status: "Submitted",
      createdAt: new Date().toISOString(),
    };
    setReviews([newReview, ...reviews]);
    setTitle("");
    setComment("");
  };

  return (
    <HastivoUserLayout
      title="Review & Collaboration"
      subtitle="Feedback, Bug Reports & Feature Requests"
    >
      <div className="mb-6">
        <h1 className="font-heading text-3xl font-bold text-foreground">
          Review & Collaboration
        </h1>
        <p className="font-sans text-sm text-text-2 mt-1">
          Submit bug reports, propose new feature enhancements, and track team response statuses.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Panel (5 cols) */}
        <div className="lg:col-span-5">
          <GlassPanel elevation="z2" className="p-6 space-y-4">
            <h3 className="font-heading text-xl font-bold text-foreground">
              Submit Feedback
            </h3>

            <div className="flex gap-2">
              {[
                { id: "feature", label: "Feature", icon: Lightbulb },
                { id: "bug", label: "Bug Report", icon: Bug },
                { id: "review", label: "Review", icon: Star },
              ].map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`flex-1 py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-semibold transition-colors ${
                      category === cat.id
                        ? "bg-coral text-charcoal border-coral font-bold"
                        : "bg-surface/50 border-border text-text-2 hover:bg-surface"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {cat.label}
                  </button>
                );
              })}
            </div>

            <GlassInput
              placeholder="Feedback Title (optional)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Describe your suggestion or issue in detail..."
              className="w-full rounded-2xl bg-surface/50 border border-border/80 p-4 text-sm font-sans text-foreground outline-none focus:border-blue"
            />

            <GlassButton
              variant="primary"
              className="w-full"
              icon={Send}
              onClick={handleSubmit}
            >
              Submit Feedback
            </GlassButton>
          </GlassPanel>
        </div>

        {/* Existing Feedback Stream (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="font-heading text-xl font-bold text-foreground">
            Community Feedback & Status
          </h3>

          {reviews.map((rev) => (
            <GlassCard key={rev.id} className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-foreground">
                  {rev.title || "Feedback Submission"}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-blue/15 text-blue text-xs font-medium border border-blue/30">
                  {rev.status || "Under Review"}
                </span>
              </div>
              <p className="font-sans text-sm text-text-2 mb-3">
                {rev.comment}
              </p>
              <span className="text-[10px] text-text-3 font-mono">
                {new Date(rev.createdAt || Date.now()).toLocaleDateString()}
              </span>
            </GlassCard>
          ))}
        </div>
      </div>
    </HastivoUserLayout>
  );
}

