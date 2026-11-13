import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/TermsAndConditionsPage.jsx";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — Hastivo" },
      { name: "description", content: "Hastivo Terms and Conditions of Service." },
      { property: "og:title", content: "Terms & Conditions — Hastivo" },
      { property: "og:description", content: "Hastivo Terms and Conditions of Service." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});
