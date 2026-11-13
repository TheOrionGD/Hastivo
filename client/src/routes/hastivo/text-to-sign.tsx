import { createFileRoute } from "@tanstack/react-router";
import TextToSignStudioPage from "@/pages/hastivo/TextToSignStudioPage.jsx";

export const Route = createFileRoute("/hastivo/text-to-sign")({
  head: () => ({
    meta: [
      { title: "Text-to-Sign Studio — Hastivo" },
      { name: "description", content: "3D avatar ISL animation sequence synthesis." },
    ],
  }),
  component: TextToSignStudioPage,
});
