import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { createFileRoute } from "@tanstack/react-router";
import { createContext } from "@/server/api/trpc";
import { appRouter } from "@/server/api/root";

export const Route = createFileRoute("/api/rpc/$")({
  server: {
    handlers: {
      ANY: async ({ request }) => {
        return fetchRequestHandler({
          endpoint: "/api/rpc",
          req: request,
          router: appRouter,
          createContext: () => createContext({ headers: request.headers }),
          onError: ({ error }) => {
            console.error("tRPC error:", error);
          },
        });
      },
    },
  },
});
