import { createFileRoute } from "@tanstack/react-router";
import SavedContentPage from "@/pages/hastivo/SavedContentPage.jsx";

export const Route = createFileRoute("/hastivo/saved")({
  head: () => ({
    meta: [
      { title: "Saved Content — Hastivo" },
      { name: "description", content: "Bookmarked signs and saved translations." },
    ],
  }),
  component: SavedContentPage,
});
