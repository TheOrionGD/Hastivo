import { OtpSlots, SmoothButton, BorderBeam } from "@/components/ui/smoothui";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AccountVerificationForm } from "@/components/auth/RecoveryForms";

export default function AccountVerificationPage() {
  return (
    <AuthLayout
      headline="Confirm Your Identity."
      support="Verification protects your privacy and ensures your sign transcripts remain exclusively yours."
    >
      <AccountVerificationForm />
    </AuthLayout>
  );
}

