import { createFileRoute } from "@tanstack/react-router";
import ModerationQueuePage from "@/pages/admin/ModerationQueuePage.jsx";

export const Route = createFileRoute("/admin/moderation-queue")({
  head: () => ({
    meta: [
      { title: "Moderation Queue — Hastivo Admin" },
      { name: "description", content: "Community reports and moderation tasks." },
    ],
  }),
  component: ModerationQueuePage,
});
