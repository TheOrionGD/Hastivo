import { AuthForm, FloatInput, BorderBeam, SmoothButton } from "@/components/ui/smoothui";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { SignInForm } from "@/components/auth/SignInForm";

export default function SignInPage() {
  return (
    <AuthLayout contained headline="Every Voice Deserves to Be Understood." support="Connect through intelligent sign-language technology that brings people and languages closer.">
      <SignInForm />
    </AuthLayout>
  );
}
