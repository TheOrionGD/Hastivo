import { createFileRoute } from "@tanstack/react-router";
import CommunityHubPage from "@/pages/hastivo/CommunityHubPage.jsx";

export const Route = createFileRoute("/hastivo/community")({
  head: () => ({
    meta: [
      { title: "Community Hub — Hastivo" },
      { name: "description", content: "Community feed with anonymity protection." },
    ],
  }),
  component: CommunityHubPage,
});
