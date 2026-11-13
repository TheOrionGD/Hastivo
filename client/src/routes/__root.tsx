import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportSystemError } from "../lib/hastivo-error-reporting";
import { ThemeProvider } from "@/context/ThemeContext.jsx";
import { BackgroundVideo } from "@/components/common/BackgroundVideo.jsx";
import { ParticleField } from "@/components/visual/ParticleField.jsx";
import { GlobalFooter } from "@/components/layout/GlobalFooter.jsx";

import ErrorPage from "@/pages/ErrorPage";

function NotFoundComponent() {
  const currentPath = typeof window !== "undefined" ? window.location.pathname : "";
  return <ErrorPage code="404" routeInfo={currentPath} />;
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportSystemError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  const currentPath = typeof window !== "undefined" ? window.location.pathname : "";
  const errorMessage = error instanceof Error ? error.message : String(error);

  return (
    <ErrorPage
      code="500"
      routeInfo={currentPath}
      errorDetails={errorMessage}
      onRetry={() => {
        router.invalidate();
        reset();
      }}
    />
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Hastivo" },
      { name: "description", content: "Hastivo — sign language communication platform." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [
      {
        children: `try{var t=localStorage.getItem("hastivo-theme");if(t!=="light")document.documentElement.classList.add("dark")}catch(e){document.documentElement.classList.add("dark")}`,
      },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Lato:ital,wght@0,300;0,400;0,700;1,300;1,400&family=Bricolage+Grotesque:opsz,wght@12..96,300..600&family=Geist:wght@300..600&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <ThemeProvider>
        <BackgroundVideo />
        <ParticleField />
        <Outlet />
        <GlobalFooter />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
