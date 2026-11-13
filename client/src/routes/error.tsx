import { createFileRoute } from "@tanstack/react-router";
import ErrorPage from "@/pages/ErrorPage";

interface ErrorSearchParams {
  code?: string;
  route?: string;
  message?: string;
}

export const Route = createFileRoute("/error")({
  validateSearch: (search: Record<string, unknown>): ErrorSearchParams => {
    return {
      code: typeof search["code"] === "string" ? search["code"] : "500",
      route: typeof search["route"] === "string" ? search["route"] : "",
      message: typeof search["message"] === "string" ? search["message"] : "",
    };
  },
  head: () => {
    return {
      meta: [
        { title: "System Error — Hastivo" },
        { name: "description", content: "Hastivo System Error Page" },
      ],
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const search = Route.useSearch();
  return (
    <ErrorPage
      code={search.code || "500"}
      routeInfo={search.route || ""}
      errorDetails={search.message || null}
    />
  );
}
