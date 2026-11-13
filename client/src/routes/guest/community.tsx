import { createFileRoute } from "@tanstack/react-router";
import GuestCommunityPage from "@/pages/guest/GuestCommunityPage.jsx";

export const Route = createFileRoute("/guest/community")({
  head: () => ({
    meta: [
      { title: "Guest Community Showcase — Hastivo" },
      { name: "description", content: "Public community discussions and academic benchmarks." },
    ],
  }),
  component: GuestCommunityPage,
});
