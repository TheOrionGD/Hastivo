/**
 * Hastivo Local System Error Reporting & Logging Service
 * Native error reporting for Hastivo client.
 */

type SystemErrorOptions = {
  mechanism?: "manual" | "onerror" | "unhandledrejection" | "react_error_boundary";
  handled?: boolean;
  severity?: "error" | "warning" | "info";
};

export function reportSystemError(
  error: unknown,
  context: Record<string, unknown> = {},
  options: SystemErrorOptions = {},
) {
  if (typeof window === "undefined") return;

  const stack = error instanceof Error ? error.stack : undefined;
  const message = error instanceof Error ? error.message : String(error);

  // Local console telemetry
  const level = options.severity || "error";
  if (level === "warning") {
    console.warn(`[Hastivo Error Handler]`, { message, context, stack });
  } else if (level === "info") {
    console.info(`[Hastivo Info Log]`, { message, context });
  } else {
    console.error(`[Hastivo System Error]`, { message, context, stack });
  }

  // Dispatch to local backend telemetry endpoint if active
  try {
    if (navigator.onLine) {
      fetch("/api/v1/system/client-errors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          stack,
          route: window.location.pathname,
          timestamp: new Date().toISOString(),
          context,
          options,
        }),
      }).catch(() => {
        // Silently ignore if local backend error endpoint is inactive
      });
    }
  } catch {
    // Avoid re-throwing inside error reporter
  }
}

export const reportHastivoError = reportSystemError;
