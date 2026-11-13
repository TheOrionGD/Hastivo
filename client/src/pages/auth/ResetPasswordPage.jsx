import { FloatInput, SmoothButton, SoftBlurIn } from "@/components/ui/smoothui";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { ResetPasswordForm } from "@/components/auth/RecoveryForms";

export default function ResetPasswordPage() {
  return (
    <AuthLayout headline="Every Voice Deserves to Be Understood." support="Choose a new password to secure your account.">
      <ResetPasswordForm />
    </AuthLayout>
  );
}
