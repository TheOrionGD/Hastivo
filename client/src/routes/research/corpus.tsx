import {
  DepthParallaxWords,
  ScrollRevealParagraph,
  SvgDrawOnScroll,
} from "@/components/ui/smoothui";
import { createFileRoute } from "@tanstack/react-router";
import { ResearchLayout } from "@/components/research/ResearchLayout.jsx";

export const Route = createFileRoute("/research/corpus")({
  head: () => ({
    meta: [
      { title: "Corpus: INCLUDE-50 & ISL-CSLTR — Hastivo Research" },
      {
        name: "description",
        content: "Hastivo academic research: Corpus: INCLUDE-50 & ISL-CSLTR.",
      },
      { property: "og:title", content: "Corpus: INCLUDE-50 & ISL-CSLTR — Hastivo Research" },
      {
        property: "og:description",
        content: "Hastivo academic research: Corpus: INCLUDE-50 & ISL-CSLTR.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <ResearchLayout slug="corpus" />,
});
