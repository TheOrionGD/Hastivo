import { createFileRoute } from "@tanstack/react-router";
import TranslationHistoryPage from "@/pages/hastivo/TranslationHistoryPage.jsx";

export const Route = createFileRoute("/hastivo/history")({
  head: () => ({
    meta: [
      { title: "History — Hastivo" },
      { name: "description", content: "Translation and conversation history." },
    ],
  }),
  component: TranslationHistoryPage,
});
