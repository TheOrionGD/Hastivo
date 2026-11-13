import { FloatInput, SmoothButton, ShortSlideDown } from "@/components/ui/smoothui";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { ForgotPasswordForm } from "@/components/auth/RecoveryForms";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout headline="Every Voice Deserves to Be Understood." support="We'll help you get back into your account securely.">
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
