import { createFileRoute } from "@tanstack/react-router";
import CategoryManagementPage from "@/pages/admin/CategoryManagementPage.jsx";

export const Route = createFileRoute("/admin/categories")({
  head: () => ({
    meta: [
      { title: "Category Management — Hastivo Admin" },
      { name: "description", content: "Organize community topics and sign vocabulary." },
    ],
  }),
  component: CategoryManagementPage,
});
