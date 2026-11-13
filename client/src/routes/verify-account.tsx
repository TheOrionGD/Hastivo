import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/auth/AccountVerificationPage.jsx";

export const Route = createFileRoute("/verify-account")({
  head: () => ({
    meta: [
      { title: "Account Verification — Hastivo" },
      { name: "description", content: "Verify your Hastivo account." },
      { property: "og:title", content: "Account Verification — Hastivo" },
      { property: "og:description", content: "Verify your Hastivo account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});
