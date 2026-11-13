import { createFileRoute } from "@tanstack/react-router";
import AuditLogsPage from "@/pages/admin/AuditLogsPage.jsx";

export const Route = createFileRoute("/admin/audit")({
  head: () => ({
    meta: [
      { title: "Audit Trail Records — Hastivo Admin" },
      { name: "description", content: "Immutable administrative audit logs." },
    ],
  }),
  component: AuditLogsPage,
});
