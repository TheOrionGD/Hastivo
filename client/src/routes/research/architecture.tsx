import { PerspectiveText3D, SvgDrawOnScroll, FolderReveal } from "@/components/ui/smoothui";
import { createFileRoute } from "@tanstack/react-router";
import { ResearchLayout } from "@/components/research/ResearchLayout.jsx";

export const Route = createFileRoute("/research/architecture")({
  head: () => ({
    meta: [
      { title: "Architecture & ER Specs — Hastivo Research" },
      { name: "description", content: "Hastivo academic research: Architecture & ER Specs." },
      { property: "og:title", content: "Architecture & ER Specs — Hastivo Research" },
      {
        property: "og:description",
        content: "Hastivo academic research: Architecture & ER Specs.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <ResearchLayout slug="architecture" />,
});
