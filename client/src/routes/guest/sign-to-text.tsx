import { createFileRoute } from "@tanstack/react-router";
import GuestSignToTextPage from "@/pages/guest/GuestSignToTextPage.jsx";

export const Route = createFileRoute("/guest/sign-to-text")({
  head: () => ({
    meta: [
      { title: "Guest Sign-to-Text Studio — Hastivo" },
      {
        name: "description",
        content: "Real-time hand landmark extraction and ISL sentence recognition.",
      },
    ],
  }),
  component: GuestSignToTextPage,
});
