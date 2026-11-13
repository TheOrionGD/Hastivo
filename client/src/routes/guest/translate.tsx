import { createFileRoute } from "@tanstack/react-router";
import GuestTranslationPage from "@/pages/guest/GuestTranslationPage.jsx";

export const Route = createFileRoute("/guest/translate")({
  head: () => ({
    meta: [
      { title: "Guest Universal Translation — Hastivo" },
      {
        name: "description",
        content: "Multi-lingual translation bridging English, Hindi, and ISL SOV syntax.",
      },
    ],
  }),
  component: GuestTranslationPage,
});
