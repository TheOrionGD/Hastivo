import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/auth/RegisterPage.jsx";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create Account — Hastivo" },
      { name: "description", content: "Create your Hastivo account." },
      { property: "og:title", content: "Create Account — Hastivo" },
      { property: "og:description", content: "Create your Hastivo account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});
