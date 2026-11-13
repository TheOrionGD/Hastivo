import { useEffect, useState } from "react";
import { sessionManager } from "@/services/auth/sessionManager";

/** Current auth session (client only). `loading` is true until the first check finishes. */
export function useSession() {
  const [state, setState] = useState(() => ({
    session: sessionManager.getUser(),
    loading: typeof window === "undefined",
  }));

  useEffect(() => {
    // Initial check
    const user = sessionManager.getUser();
    setState({ session: user, loading: false });

    // Subscribe to session changes
    const unsubscribe = sessionManager.subscribe((newUser) => {
      setState({ session: newUser, loading: false });
    });

    return unsubscribe;
  }, []);

  return state;
}
