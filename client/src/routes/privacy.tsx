import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/PrivacyPolicyPage.jsx";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Hastivo" },
      { name: "description", content: "Hastivo Privacy Policy and Data Sovereignty Guidelines." },
      { property: "og:title", content: "Privacy Policy — Hastivo" },
      {
        property: "og:description",
        content: "Hastivo Privacy Policy and Data Sovereignty Guidelines.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});
