import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { createFileRoute } from "@tanstack/react-router";
import { createContext } from "@/server/api/trpc";
import { appRouter } from "@/server/api/root";
import { logger } from "@/server/logger";

export const Route = createFileRoute("/api/rpc/$")({
  server: {
    handlers: {
      ANY: async ({ request }) => {
        const startTime = Date.now();

        return fetchRequestHandler({
          endpoint: "/api/rpc",
          req: request,
          router: appRouter,
          createContext: () => createContext({ headers: request.headers }),
          onError: ({ error, path, input, type }) => {
            const cause = error.cause;
            const causeError = cause instanceof Error ? cause : null;

            // Don't log full input - it may contain PII
            // Only log input shape for debugging (keys only, no values)
            const inputShape =
              input && typeof input === "object" ? Object.keys(input as Record<string, unknown>) : typeof input;

            logger.error("trpc.error", {
              method: request.method,
              path,
              type,
              duration_ms: Date.now() - startTime,
              input_shape: inputShape,
              error_code: error.code,
              error_message: error.message,
              error_stack: error.stack,
              cause_name: causeError?.name,
              cause_message: causeError?.message ?? (cause ? String(cause) : undefined),
              cause_stack: causeError?.stack,
            });
          },
        });
      },
    },
  },
});
