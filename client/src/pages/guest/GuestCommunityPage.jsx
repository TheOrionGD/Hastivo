import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Users,
  Search,
  Heart,
  MessageCircle,
  Tag,
  Lock,
  Sparkles,
  ArrowRight,
  Filter,
} from "lucide-react";
import { GuestLayout } from "@/components/guest/GuestLayout";
import TiltCard from "@/components/ui/smoothui/tilt-card";

/**
 * 7. GUEST COMMUNITY VIEW
 * - FETCH: Published public community posts, categories, engagement counts and pagination.
 * - DISPLAY: Public posts, author display names or Anonymous labels, comments where public.
 * - INPUT: Search, category filters, sorting and navigation. Posting and commenting are unavailable.
 */
export default function GuestCommunityPage() {
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("recent");
  const [loading, setLoading] = useState(true);

  // FETCH: Public posts from backend
  useEffect(() => {
    let active = true;
    setLoading(true);
    const params = new URLSearchParams();
    if (category !== "All") params.append("category", category);
    if (search.trim()) params.append("search", search.trim());
    if (sort) params.append("sort", sort);

    fetch(`/api/v1/guest/community?${params.toString()}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (active && data?.posts) {
          setPosts(data.posts);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [category, search, sort]);

  return (
    <GuestLayout
      activeId="community"
      title="Guest Community Showcase"
      subtitle="Read public discussions, educational insights, and research benchmarks from the community"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Guest Read-Only Notice Pill */}
        <div className="p-4 rounded-2xl border border-blue/30 bg-blue/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-2 text-blue">
            <Lock size={15} />
            <span>Guest Mode: Read-Only Browsing. Posting and commenting require a Citizen account.</span>
          </div>
          <Link
            to="/upgrade-account"
            className="px-3 py-1.5 rounded-lg bg-coral text-charcoal font-semibold text-xs flex items-center justify-center gap-1.5 shrink-0"
          >
            <Sparkles size={13} /> Upgrade to Post
          </Link>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border border-border/80 bg-foreground/[0.02]">
          <div className="flex flex-wrap items-center gap-2">
            {["All", "Learning ISL", "Accessibility", "Feedback & Capstone"].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  category === cat
                    ? "bg-foreground text-background font-bold shadow-xs"
                    : "bg-foreground/5 hover:bg-foreground/10 text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter topics..."
              className="px-3 py-1.5 rounded-lg border border-border bg-background text-xs focus:outline-none focus:border-coral"
            />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-border bg-background text-xs font-mono focus:outline-none"
            >
              <option value="recent">Most Recent</option>
              <option value="popular">Most Liked</option>
            </select>
          </div>
        </div>

        {/* Public Posts Stream */}
        <div className="space-y-4">
          {posts.map((post) => (
            <TiltCard
              key={post.id}
              className="p-6 rounded-2xl border border-border bg-foreground/[0.01] hover:border-border/80 transition-all space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-foreground">{post.author}</span>
                  <span className="text-muted-foreground">&bull;</span>
                  <span className="text-xs font-mono text-coral">{post.category}</span>
                </div>
                <span className="text-xs font-mono text-muted-foreground">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div>
                <h3 className="font-display text-xl font-bold text-foreground mb-1.5">{post.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{post.content}</p>
              </div>

              {/* Engagement counts */}
              <div className="flex items-center gap-6 pt-3 border-t border-border/50 text-xs font-mono text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Heart size={14} className="text-coral" />
                  <span>{post.likes} likes</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <MessageCircle size={14} className="text-blue" />
                  <span>{post.commentsCount} comments</span>
                </span>
              </div>

              {/* Public comments preview */}
              {post.comments?.length > 0 && (
                <div className="mt-3 pl-4 border-l-2 border-border/60 space-y-2 pt-1">
                  {post.comments.map((c) => (
                    <div key={c.id} className="text-xs">
                      <strong className="text-foreground font-mono">{c.author}: </strong>
                      <span className="text-muted-foreground">{c.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </TiltCard>
          ))}
        </div>
      </div>
    </GuestLayout>
  );
}

