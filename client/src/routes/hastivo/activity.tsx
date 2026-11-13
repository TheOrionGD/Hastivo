import { createFileRoute } from "@tanstack/react-router";
import CommunityActivityPage from "@/pages/hastivo/CommunityActivityPage.jsx";

export const Route = createFileRoute("/hastivo/activity")({
  head: () => ({
    meta: [
      { title: "My Activity — Hastivo" },
      { name: "description", content: "User community activity and feedback." },
    ],
  }),
  component: CommunityActivityPage,
});
