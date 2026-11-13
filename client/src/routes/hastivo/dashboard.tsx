import { createFileRoute } from "@tanstack/react-router";
import HastivoDashboardPage from "@/pages/hastivo/HastivoDashboardPage.jsx";

export const Route = createFileRoute("/hastivo/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Hastivo Workspace" },
      { name: "description", content: "Hastivo User spatial dashboard and feature suite." },
    ],
  }),
  component: HastivoDashboardPage,
});
