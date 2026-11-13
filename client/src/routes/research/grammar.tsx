import { WaveText, ScrollRevealParagraph } from "@/components/ui/smoothui";
import { createFileRoute } from "@tanstack/react-router";
import { ResearchLayout } from "@/components/research/ResearchLayout.jsx";

export const Route = createFileRoute("/research/grammar")({
  head: () => ({
    meta: [
      { title: "Grammar: SOV Topic-Comment — Hastivo Research" },
      { name: "description", content: "Hastivo academic research: Grammar: SOV Topic-Comment." },
      { property: "og:title", content: "Grammar: SOV Topic-Comment — Hastivo Research" },
      {
        property: "og:description",
        content: "Hastivo academic research: Grammar: SOV Topic-Comment.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <ResearchLayout slug="grammar" />,
});
