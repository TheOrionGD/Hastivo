import { createFileRoute } from "@tanstack/react-router";
import VideoProcessingStudioPage from "@/pages/hastivo/VideoProcessingStudioPage.jsx";

export const Route = createFileRoute("/hastivo/video-studio")({
  head: () => ({
    meta: [
      { title: "Video Processing Studio — Hastivo" },
      {
        name: "description",
        content: "Prerecorded video conversion: Speech-to-Sign & Sign-to-Speech.",
      },
    ],
  }),
  component: VideoProcessingStudioPage,
});
