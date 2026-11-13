import { GlassCard, SmoothButton, ShineText } from "@/components/ui/smoothui";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AnonymousSignInForm } from "@/components/auth/AnonymousSignInForm";

export default function AnonymousSignInPage() {
  return (
    <AuthLayout
      contained
      headline="A Conversation Can Start Without an Account."
      support="Step into Hastivo as a guest, with no email address or password standing in the way."
    >
      <AnonymousSignInForm />
    </AuthLayout>
  );
}
