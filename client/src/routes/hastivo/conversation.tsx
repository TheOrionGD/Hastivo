import { createFileRoute } from "@tanstack/react-router";
import RealTimeConversationPage from "@/pages/hastivo/RealTimeConversationPage.jsx";

export const Route = createFileRoute("/hastivo/conversation")({
  head: () => ({
    meta: [
      { title: "Conversation Room — Hastivo" },
      {
        name: "description",
        content: "Two-way live communication for Deaf and hearing participants.",
      },
    ],
  }),
  component: RealTimeConversationPage,
});
