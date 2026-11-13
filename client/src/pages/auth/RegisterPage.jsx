import { AuthForm, FloatInput, BorderBeam, SmoothButton } from "@/components/ui/smoothui";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthLayout contained headline="Begin a New Way to Connect." support="Create your account and experience communication without boundaries.">
      <RegisterForm />
    </AuthLayout>
  );
}
