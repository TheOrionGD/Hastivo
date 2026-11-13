import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/AccessibilityPage.jsx";

export const Route = createFileRoute("/accessibility")({
  head: () => ({
    meta: [
      { title: "Accessibility Guidelines & Information — Hastivo" },
      {
        name: "description",
        content:
          "Accessibility guidelines, keyboard controls, supported languages, and privacy explanations for the Hastivo platform.",
      },
      { property: "og:title", content: "Accessibility Guidelines & Information — Hastivo" },
      {
        property: "og:description",
        content:
          "Accessibility guidelines, keyboard controls, supported languages, and privacy explanations for the Hastivo platform.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});
