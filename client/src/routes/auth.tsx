import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/auth/SignInPage.jsx";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign In — Hastivo" },
      {
        name: "description",
        content: "Sign in to Hastivo to continue your communication experience.",
      },
      { property: "og:title", content: "Sign In — Hastivo" },
      {
        property: "og:description",
        content: "Sign in to Hastivo to continue your communication experience.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});
