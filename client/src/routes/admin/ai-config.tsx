import { createFileRoute } from "@tanstack/react-router";
import AIConfigurationPage from "@/pages/admin/AIConfigurationPage.jsx";

export const Route = createFileRoute("/admin/ai-config")({
  head: () => ({
    meta: [
      { title: "AI Model Configuration — Hastivo Admin" },
      { name: "description", content: "LLM models and inference hyperparameters." },
    ],
  }),
  component: AIConfigurationPage,
});
