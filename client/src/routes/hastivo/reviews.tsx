import { createFileRoute } from "@tanstack/react-router";
import ReviewCollaborationPage from "@/pages/hastivo/ReviewCollaborationPage.jsx";

export const Route = createFileRoute("/hastivo/reviews")({
  head: () => ({
    meta: [
      { title: "Review & Feedback — Hastivo" },
      { name: "description", content: "Feedback, bug reports, and suggestions." },
    ],
  }),
  component: ReviewCollaborationPage,
});
