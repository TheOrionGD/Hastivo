import { RevealText, ScrollRevealParagraph, Kbd } from "@/components/ui/smoothui";
import { createFileRoute } from "@tanstack/react-router";
import { ResearchLayout } from "@/components/research/ResearchLayout.jsx";

export const Route = createFileRoute("/research/accessibility")({
  head: () => ({
    meta: [
      { title: "Accessibility & Privacy — Hastivo Research" },
      { name: "description", content: "Hastivo academic research: Accessibility & Privacy." },
      { property: "og:title", content: "Accessibility & Privacy — Hastivo Research" },
      {
        property: "og:description",
        content: "Hastivo academic research: Accessibility & Privacy.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <ResearchLayout slug="accessibility" />,
});
