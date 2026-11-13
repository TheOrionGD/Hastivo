import { createFileRoute } from "@tanstack/react-router";
import SystemSettingsPage from "@/pages/admin/SystemSettingsPage.jsx";

export const Route = createFileRoute("/admin/system-settings")({
  head: () => ({
    meta: [
      { title: "System Settings — Hastivo Admin" },
      { name: "description", content: "Global configurations, feature flags, and thresholds." },
    ],
  }),
  component: SystemSettingsPage,
});
