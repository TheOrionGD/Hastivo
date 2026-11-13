import { createFileRoute } from "@tanstack/react-router";
import GetStartedPlaceholder from "@/pages/GetStartedPlaceholder.jsx";

export const Route = createFileRoute("/get-started")({
  head: () => ({
    meta: [
      { title: "Get Started — Hastivo" },
      { name: "description", content: "Onboarding for Hastivo is coming in a later phase." },
      { property: "og:title", content: "Get Started — Hastivo" },
      { property: "og:description", content: "Onboarding for Hastivo is coming soon." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GetStartedPlaceholder,
});
