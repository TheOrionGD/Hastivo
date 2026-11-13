import { createFileRoute } from "@tanstack/react-router";
import BackendHealthMonitorPage from "@/pages/admin/BackendHealthMonitorPage.jsx";

export const Route = createFileRoute("/admin/backend-health")({
  head: () => ({
    meta: [
      { title: "Backend Health Monitor — Hastivo Admin" },
      { name: "description", content: "Service health, latency, and socket status." },
    ],
  }),
  component: BackendHealthMonitorPage,
});
