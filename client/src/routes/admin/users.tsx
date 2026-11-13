import { createFileRoute } from "@tanstack/react-router";
import UserManagementPage from "@/pages/admin/UserManagementPage.jsx";

export const Route = createFileRoute("/admin/users")({
  head: () => ({
    meta: [
      { title: "User Management — Hastivo Admin" },
      { name: "description", content: "Account records and administrative restrictions." },
    ],
  }),
  component: UserManagementPage,
});
