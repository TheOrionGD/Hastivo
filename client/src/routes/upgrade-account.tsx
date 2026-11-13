import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/auth/UpgradeAccountPage.jsx";

export const Route = createFileRoute("/upgrade-account")({
  head: () => ({
    meta: [
      { title: "Save Your Guest Account — Hastivo" },
      {
        name: "description",
        content:
          "Upgrade a Hastivo guest session to a permanent account while preserving its identity, session, and saved data.",
      },
      { property: "og:title", content: "Save Your Guest Account — Hastivo" },
      {
        property: "og:description",
        content:
          "Add email and password access to your existing guest account without starting over.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});
