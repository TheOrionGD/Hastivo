import { createFileRoute } from "@tanstack/react-router";
import GuestReviewsPage from "@/pages/guest/GuestReviewsPage.jsx";

export const Route = createFileRoute("/guest/reviews")({
  head: () => ({
    meta: [
      { title: "Guest Review & Collaboration — Hastivo" },
      {
        name: "description",
        content: "Public reviews, bug reports, and official capstone evaluation responses.",
      },
    ],
  }),
  component: GuestReviewsPage,
});
