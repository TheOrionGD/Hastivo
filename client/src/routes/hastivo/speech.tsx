import { createFileRoute } from "@tanstack/react-router";
import SpeechStudioPage from "@/pages/hastivo/SpeechStudioPage.jsx";

export const Route = createFileRoute("/hastivo/speech")({
  head: () => ({
    meta: [
      { title: "Speech Studio — Hastivo" },
      { name: "description", content: "Speech-to-Text and voice synthesis." },
    ],
  }),
  component: SpeechStudioPage,
});
