import { createFileRoute } from "@tanstack/react-router";
import AnonymousIdentityLookupPage from "@/pages/admin/AnonymousIdentityLookupPage.jsx";

export const Route = createFileRoute("/admin/anonymous-lookup")({
  head: () => ({
    meta: [
      { title: "Anonymous Identity Lookup — Hastivo Admin" },
      {
        name: "description",
        content: "Privileged author identity resolution with audit compliance.",
      },
    ],
  }),
  component: AnonymousIdentityLookupPage,
});
