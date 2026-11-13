import { createFileRoute } from "@tanstack/react-router";
import GuestDashboardPage from "@/pages/guest/GuestDashboardPage.jsx";

export const Route = createFileRoute("/guest/dashboard")({
  head: () => ({
    meta: [
      { title: "Guest Citizen Dashboard — Hastivo" },
      {
        name: "description",
        content: "Guest Citizen module access, usage limits, and public announcements.",
      },
    ],
  }),
  component: GuestDashboardPage,
});
