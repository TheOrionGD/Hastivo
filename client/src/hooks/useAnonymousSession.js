import { useEffect, useState } from "react";
import { observeAnonymousSession } from "@/services/auth/authService";

/** Current Firebase guest session, resolved on the client after hydration. */
export function useAnonymousSession() {
  const [state, setState] = useState({ user: null, loading: true });

  useEffect(() => observeAnonymousSession((user) => setState({ user, loading: false })), []);

  return state;
}
