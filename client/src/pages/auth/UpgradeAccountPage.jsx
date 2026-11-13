import { UnlockFaceId, BorderBeam, SmoothButton, CountBadge } from "@/components/ui/smoothui";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { UpgradeAccountForm } from "@/components/auth/UpgradeAccountForm";

export default function UpgradeAccountPage() {
  return (
    <AuthLayout
      contained
      headline="Keep Every Connection You Make."
      support="Turn your guest session into a permanent account without starting over or losing its saved data."
    >
      <UpgradeAccountForm />
    </AuthLayout>
  );
}
