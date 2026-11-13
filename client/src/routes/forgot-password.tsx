import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/auth/ForgotPasswordPage.jsx";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Forgot Password — Hastivo" },
      { name: "description", content: "Reset your Hastivo password." },
      { property: "og:title", content: "Forgot Password — Hastivo" },
      { property: "og:description", content: "Reset your Hastivo password." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});
