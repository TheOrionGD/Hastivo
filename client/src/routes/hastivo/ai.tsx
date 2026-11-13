import { createFileRoute } from "@tanstack/react-router";
import HastivoAIChatPage from "@/pages/hastivo/HastivoAIChatPage.jsx";

export const Route = createFileRoute("/hastivo/ai")({
  head: () => ({
    meta: [
      { title: "Hastivo AI — Assistive Intelligence" },
      {
        name: "description",
        content: "Multimodal AI assistant supporting text, sign, and speech.",
      },
    ],
  }),
  component: HastivoAIChatPage,
});
