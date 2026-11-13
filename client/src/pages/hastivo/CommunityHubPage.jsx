import { TopDownLetters, TweetCard, PhotoStack, TimeMachineStack, AnimatedAvatarGroup } from "@/components/ui/smoothui";
import React, { useState, useEffect } from "react";
import { Users, MessageSquare, ThumbsUp, Send, ShieldCheck, EyeOff } from "lucide-react";
import { HastivoUserLayout } from "@/components/layout/HastivoUserLayout";
import { GlassPanel } from "@/components/glass/GlassPanel";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassButton } from "@/components/glass/GlassControls";

export default function CommunityHubPage() {
  const [posts, setPosts] = useState([]);
  const [newPostText, setNewPostText] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  useEffect(() => {
    fetch("/api/v1/guest/community")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.posts) setPosts(data.posts);
      })
      .catch(() => {});
  }, []);

  const handleCreatePost = () => {
    if (!newPostText.trim()) return;
    const newPost = {
      id: `post_${Date.now()}`,
      displayName: isAnonymous ? "Anonymous User" : "You",
      displayMode: isAnonymous ? "anonymous" : "named",
      content: newPostText,
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: 0,
    };
    setPosts([newPost, ...posts]);
    setNewPostText("");
  };

  return (
    <HastivoUserLayout
      title="Community Hub"
      subtitle="Accessible Discussions & Anonymity Protected Feed"
    >
      <div className="mb-6">
        <h1 className="font-heading text-3xl font-bold text-foreground">
          Community Hub
        </h1>
        <p className="font-sans text-sm text-text-2 mt-1">
          Share experiences, suggest sign vocabulary additions, and engage with the community. Anonymous posting strictly protects your identity from public payloads.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Feed Posts (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Create Post Card */}
          <GlassPanel elevation="z2" className="p-6">
            <h3 className="font-heading text-xl font-bold text-foreground mb-3">
              Share with Community
            </h3>

            <textarea
              rows={3}
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              placeholder="What would you like to discuss or share?..."
              className="w-full rounded-2xl bg-surface/50 border border-border/80 p-4 text-sm font-sans text-foreground outline-none focus:border-blue mb-4"
            />

            <div className="flex flex-wrap items-center justify-between gap-3">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-text-2">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded border-border accent-coral"
                />
                <EyeOff className="w-3.5 h-3.5 text-text-3" />
                <span>Publish as Anonymous</span>
              </label>

              <GlassButton
                variant="primary"
                icon={Send}
                onClick={handleCreatePost}
              >
                Publish Post
              </GlassButton>
            </div>
          </GlassPanel>

          {/* Posts List */}
          <div className="space-y-4">
            {posts.map((post) => (
              <GlassCard key={post.id} className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-coral to-yellow flex items-center justify-center text-xs font-bold text-charcoal">
                      {post.displayMode === "anonymous" ? "?" : post.displayName?.[0] || "U"}
                    </div>
                    <div>
                      <span className="font-bold text-sm text-foreground block">
                        {post.displayMode === "anonymous" ? "Anonymous" : post.displayName}
                      </span>
                      <span className="text-[10px] text-text-3">
                        {new Date(post.createdAt || Date.now()).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {post.displayMode === "anonymous" && (
                    <span className="px-2 py-0.5 rounded-full bg-surface text-text-3 text-[10px] border border-border">
                      Anonymous
                    </span>
                  )}
                </div>

                <p className="font-sans text-sm text-foreground mb-4">
                  {post.content}
                </p>

                <div className="flex items-center gap-4 pt-3 border-t border-border/60 text-xs text-text-3">
                  <button className="flex items-center gap-1.5 hover:text-coral transition-colors">
                    <ThumbsUp className="w-3.5 h-3.5" /> {post.likes || 0} Likes
                  </button>
                  <button className="flex items-center gap-1.5 hover:text-blue transition-colors">
                    <MessageSquare className="w-3.5 h-3.5" /> {post.comments || 0} Comments
                  </button>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Community Guidelines Sidebar (4 cols) */}
        <div className="lg:col-span-4">
          <GlassPanel elevation="z1" className="p-6">
            <h3 className="font-heading text-lg font-bold text-foreground mb-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-coral" /> Privacy & Moderation
            </h3>
            <p className="font-sans text-xs text-text-2 leading-relaxed mb-3">
              When publishing anonymously, public responses only contain the presentation identity. Private author links are retained securely strictly for moderation and compliance.
            </p>
          </GlassPanel>
        </div>
      </div>
    </HastivoUserLayout>
  );
}

