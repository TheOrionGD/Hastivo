import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/auth/AnonymousSignInPage.jsx";

export const Route = createFileRoute("/anonymous")({
  head: () => ({
    meta: [
      { title: "Anonymous Sign In — Hastivo" },
      {
        name: "description",
        content:
          "Continue to Hastivo anonymously with a Firebase guest session, without an email address or password.",
      },
      { property: "og:title", content: "Anonymous Sign In — Hastivo" },
      {
        property: "og:description",
        content: "Start a guest session and explore communication without boundaries.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});
