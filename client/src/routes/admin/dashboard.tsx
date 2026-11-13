import { createFileRoute } from "@tanstack/react-router";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage.jsx";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({
    meta: [
      { title: "Admin Overview — Hastivo Privileged Console" },
      { name: "description", content: "System metrics, moderation alerts, and health." },
    ],
  }),
  component: AdminDashboardPage,
});
