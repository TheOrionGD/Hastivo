import { createFileRoute } from "@tanstack/react-router";
import TranslationWorkspacePage from "@/pages/hastivo/TranslationWorkspacePage.jsx";

export const Route = createFileRoute("/hastivo/translation")({
  head: () => ({
    meta: [
      { title: "Universal Translation — Hastivo" },
      { name: "description", content: "Assistive multilingual translation workspace." },
    ],
  }),
  component: TranslationWorkspacePage,
});
