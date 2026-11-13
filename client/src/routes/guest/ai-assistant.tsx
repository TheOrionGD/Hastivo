import { createFileRoute } from "@tanstack/react-router";
import GuestAIPage from "@/pages/guest/GuestAIPage.jsx";

export const Route = createFileRoute("/guest/ai-assistant")({
  head: () => ({
    meta: [
      { title: "Guest Hastivo AI Companion — Hastivo" },
      {
        name: "description",
        content: "Linguistics and accessibility assistant for ISL grammar questions.",
      },
    ],
  }),
  component: GuestAIPage,
});
