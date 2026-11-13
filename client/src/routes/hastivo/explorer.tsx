import { createFileRoute } from "@tanstack/react-router";
import ISLExplorerPage from "@/pages/hastivo/ISLExplorerPage.jsx";

export const Route = createFileRoute("/hastivo/explorer")({
  head: () => ({
    meta: [
      { title: "ISL Explorer — Hastivo" },
      { name: "description", content: "Indian Sign Language vocabulary explorer." },
    ],
  }),
  component: ISLExplorerPage,
});
