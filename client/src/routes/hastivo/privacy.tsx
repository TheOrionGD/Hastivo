import { createFileRoute } from "@tanstack/react-router";
import PrivacySettingsPage from "@/pages/hastivo/PrivacySettingsPage.jsx";

export const Route = createFileRoute("/hastivo/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Settings — Hastivo" },
      { name: "description", content: "Privacy, consent, and anonymous publishing options." },
    ],
  }),
  component: PrivacySettingsPage,
});
