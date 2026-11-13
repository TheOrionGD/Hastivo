import { createFileRoute } from "@tanstack/react-router";
import AvatarSettingsPage from "@/pages/hastivo/AvatarSettingsPage.jsx";

export const Route = createFileRoute("/hastivo/avatar")({
  head: () => ({
    meta: [
      { title: "Avatar Settings — Hastivo" },
      { name: "description", content: "3D avatar rig and appearance settings." },
    ],
  }),
  component: AvatarSettingsPage,
});
