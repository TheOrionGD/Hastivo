import { createFileRoute } from "@tanstack/react-router";
import GuestISLExplorerPage from "@/pages/guest/GuestISLExplorerPage.jsx";

export const Route = createFileRoute("/guest/explorer")({
  head: () => ({
    meta: [
      { title: "Guest ISL Vocabulary Explorer — Hastivo" },
      {
        name: "description",
        content: "Explore certified Indian Sign Language dictionary entries with 3D avatar loops.",
      },
    ],
  }),
  component: GuestISLExplorerPage,
});
