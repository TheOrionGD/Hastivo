import { SoftBlurIn, ReviewsCarousel, TiltCard } from "@/components/ui/smoothui";
import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Search,
  Star,
  CheckCircle2,
  Lock,
  Sparkles,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { GuestLayout } from "@/components/guest/GuestLayout";

/**
 * 8. GUEST REVIEW & COLLABORATION
 * - FETCH: Published reviews, public bug reports, feature requests and status information.
 * - DISPLAY: Public feedback cards, status labels, comments and official responses.
 * - INPUT: Search, sorting, filtering. Submission requires registration.
 */
export default function GuestReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [type, setType] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // FETCH: Published reviews and feedback from backend
  useEffect(() => {
    let active = true;
    setLoading(true);
    const params = new URLSearchParams();
    if (type !== "All") params.append("type", type);
    if (search.trim()) params.append("search", search.trim());

    fetch(`/api/v1/guest/reviews?${params.toString()}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (active && data?.reviews) {
          setReviews(data.reviews);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [type, search]);

  return (
    <GuestLayout
      activeId="reviews"
      title="Guest Review & Collaboration"
      subtitle="Public academic reviews, capstone evaluations, and feature request tracking"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Read-only Submission Notice */}
        <div className="p-4 rounded-2xl border border-coral/30 bg-coral/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-2 text-coral">
            <Lock size={15} />
            <span>Submitting official feedback and feature requests requires a registered Citizen account.</span>
          </div>
          <Link
            to="/upgrade-account"
            className="px-3 py-1.5 rounded-lg bg-coral text-charcoal font-semibold text-xs flex items-center justify-center gap-1.5 shrink-0"
          >
            <Sparkles size={13} /> Upgrade to Review
          </Link>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border border-border/80 bg-foreground/[0.02]">
          <div className="flex flex-wrap items-center gap-2">
            {["All", "Review", "Feature Request", "Bug Report"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  type === t
                    ? "bg-foreground text-background font-bold shadow-xs"
                    : "bg-foreground/5 hover:bg-foreground/10 text-muted-foreground hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search feedback..."
            className="px-3 py-1.5 rounded-lg border border-border bg-background text-xs focus:outline-none focus:border-coral"
          />
        </div>

        {/* Feedback Cards Stream */}
        <div className="space-y-4">
          {reviews.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-2xl border border-border bg-foreground/[0.01] hover:border-border/80 transition-all space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="font-semibold text-sm text-foreground">{item.author}</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-foreground/10 text-muted-foreground">
                    {item.role}
                  </span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-blue/10 text-blue font-bold">
                    {item.type}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded-full border border-border text-emerald-400">
                    {item.status}
                  </span>
                  <div className="flex items-center text-yellow">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" />
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-display text-xl font-bold text-foreground mb-1.5">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.content}</p>
              </div>

              {/* Official response */}
              {item.officialResponse && (
                <div className="p-3.5 rounded-xl border border-blue/20 bg-blue/5 text-xs space-y-1">
                  <div className="font-semibold font-mono text-blue flex items-center gap-1.5">
                    <CheckCircle2 size={14} /> Official Hastivo Response:
                  </div>
                  <p className="text-muted-foreground leading-snug">{item.officialResponse}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </GuestLayout>
  );
}

