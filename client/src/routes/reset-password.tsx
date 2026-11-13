import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/auth/ResetPasswordPage.jsx";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset Password — Hastivo" },
      { name: "description", content: "Set a new Hastivo password." },
      { property: "og:title", content: "Reset Password — Hastivo" },
      { property: "og:description", content: "Set a new Hastivo password." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});
