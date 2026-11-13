import { createFileRoute } from "@tanstack/react-router";
import GuestTextToSignPage from "@/pages/guest/GuestTextToSignPage.jsx";

export const Route = createFileRoute("/guest/text-to-sign")({
  head: () => ({
    meta: [
      { title: "Guest Text-to-Sign 3D Studio — Hastivo" },
      { name: "description", content: "3D avatar signing animation with spatial visual design." },
    ],
  }),
  component: GuestTextToSignPage,
});
