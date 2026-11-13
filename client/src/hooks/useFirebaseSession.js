import { useEffect, useState } from "react";
import { observeFirebaseSession } from "@/services/auth/authService";

/** Current Firebase guest or permanent session, resolved after hydration. */
export function useFirebaseSession() {
  const [state, setState] = useState({ user: null, loading: true });

  useEffect(() => observeFirebaseSession((user) => setState({ user, loading: false })), []);

  return state;
}
