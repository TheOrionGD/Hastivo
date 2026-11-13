import { createFileRoute } from "@tanstack/react-router";
import NotificationCentrePage from "@/pages/hastivo/NotificationCentrePage.jsx";

export const Route = createFileRoute("/hastivo/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — Hastivo" },
      { name: "description", content: "Notifications and system alerts." },
    ],
  }),
  component: NotificationCentrePage,
});
