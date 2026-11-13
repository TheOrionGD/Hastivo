import { createFileRoute } from "@tanstack/react-router";
import SignToTextStudioPage from "@/pages/hastivo/SignToTextStudioPage.jsx";

export const Route = createFileRoute("/hastivo/sign-to-text")({
  head: () => ({
    meta: [
      { title: "Sign-to-Text Studio — Hastivo" },
      {
        name: "description",
        content: "MediaPipe hand tracking and real-time ISL gesture recognition.",
      },
    ],
  }),
  component: SignToTextStudioPage,
});
