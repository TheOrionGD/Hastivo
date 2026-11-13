import { createFileRoute } from "@tanstack/react-router";
import ProfilePage from "@/pages/hastivo/ProfilePage.jsx";

export const Route = createFileRoute("/hastivo/profile")({
  head: () => ({
    meta: [
      { title: "Profile — Hastivo" },
      { name: "description", content: "User account identity and credentials." },
    ],
  }),
  component: ProfilePage,
});
