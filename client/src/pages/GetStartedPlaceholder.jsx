import { KineticCenterBuild, BorderBeam, MagneticButton } from "@/components/ui/smoothui";
import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { BrandMark } from "@/components/common/BrandMark";
import { useSession } from "@/hooks/useSession";
import { useFirebaseSession } from "@/hooks/useFirebaseSession";
import { friendlyError, signOut, signOutFirebase } from "@/services/auth/authService";

export default function GetStartedPlaceholder() {
  const { session, loading } = useSession();
  const { user: firebaseUser, loading: firebaseLoading } = useFirebaseSession();
  const [signOutError, setSignOutError] = useState("");
  const navigate = useNavigate();
  const email = session?.user?.email || firebaseUser?.email;
  const signedIn = Boolean(session || firebaseUser);
  const guest = firebaseUser?.isAnonymous;
  const checkingSession = loading || firebaseLoading;

  const handleSignOut = async () => {
    setSignOutError("");
    const accountType = firebaseUser ? (guest ? "firebase_guest" : "firebase_permanent") : "cloud";
    try {
      if (firebaseUser) await signOutFirebase();
      else await signOut();
      navigate({ to: "/auth", replace: true });
    } catch (error) {
      setSignOutError(friendlyError(error));
    }
  };

  return (
    <main className="mx-auto flex min-h-[100svh] max-w-[1440px] flex-col justify-center px-5 md:px-10">
      <BrandMark size={44} />
      <p className="eyebrow mt-10 text-coral">Hastivo Platform</p>
      {signedIn ? (
        <>
          <h1 className="font-display text-giant mt-6 max-w-[16ch] font-medium">
          {guest ? "You're signed in as a guest." : "You're signed in."}
        </h1>
          <p className="mt-8 max-w-xl text-lead text-text-2">
            {guest ? (
              "Your Firebase guest session is active on this device. Save this account with an email and password to keep the same session and anything saved to it."
            ) : (
              <>Signed in as <span className="text-foreground">{email || "your Hastivo account"}</span>. The communication tools haven't been built yet — this screen marks where your dashboard will live.</>
            )}
          </p>
          <div className="mt-12 flex flex-wrap items-center gap-8">
            {guest && <Link to="/upgrade-account" className="pill-action">Save My Account <ArrowRight size={18} /></Link>}
            <button type="button" className={guest ? "link-action text-lg" : "pill-action"} onClick={handleSignOut}>
              Sign Out
            </button>
            <Link to="/" className="link-action text-lg"><ArrowLeft size={18} /> Back to Hastivo</Link>
          </div>
          {signOutError && <p className="mt-6 text-coral" role="alert">{signOutError}</p>}
        </>
      ) : (
        <>
          <h1 className="font-display text-giant mt-6 max-w-[16ch] font-medium">Getting started is on its way.</h1>
          <p className="mt-8 max-w-xl text-lead text-text-2">
            Create an account, sign in, or continue as a guest. The communication tools themselves arrive in a later phase.
          </p>
          <div className={`mt-12 flex flex-wrap items-center gap-8 ${checkingSession ? "opacity-0" : ""}`}>
            <Link to="/register" className="pill-action">Create Account <ArrowRight size={18} /></Link>
            <Link to="/auth" className="link-action text-lg">Sign In</Link>
            <Link to="/anonymous" className="link-action text-lg">Continue as Guest</Link>
          </div>
        </>
      )}
    </main>
  );
}
