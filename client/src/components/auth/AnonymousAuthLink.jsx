import { Link } from "@tanstack/react-router";
import { UserRound } from "lucide-react";

export function AnonymousAuthLink() {
  return (
    <Link to="/anonymous" className="auth-secondary mt-3 w-full" aria-label="Continue anonymously with a guest session">
      <UserRound size={18} aria-hidden="true" />
      Continue anonymously
    </Link>
  );
}
