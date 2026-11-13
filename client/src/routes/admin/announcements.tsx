import { createFileRoute } from "@tanstack/react-router";
import AnnouncementManagementPage from "@/pages/admin/AnnouncementManagementPage.jsx";

export const Route = createFileRoute("/admin/announcements")({
  head: () => ({
    meta: [
      { title: "Announcement Management — Hastivo Admin" },
      { name: "description", content: "Broadcast platform news and system updates." },
    ],
  }),
  component: AnnouncementManagementPage,
});
