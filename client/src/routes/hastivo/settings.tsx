import { createFileRoute } from "@tanstack/react-router";
import SettingsPage from "@/pages/hastivo/SettingsPage.jsx";

export const Route = createFileRoute("/hastivo/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Hastivo" },
      { name: "description", content: "Preferences, appearance, and accessibility." },
    ],
  }),
  component: SettingsPage,
});
