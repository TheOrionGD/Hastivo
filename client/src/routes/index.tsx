import { createFileRoute } from "@tanstack/react-router";
import LandingPage from "@/pages/LandingPage.jsx";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hastivo — Communication Without Boundaries" },
      {
        name: "description",
        content:
          "Hastivo brings spoken language and sign language closer through intelligent, expressive technology.",
      },
      { property: "og:title", content: "Hastivo — Communication Without Boundaries" },
      {
        property: "og:description",
        content: "Bridging sign language and spoken language with an expressive 3D avatar.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LandingPage,
});
