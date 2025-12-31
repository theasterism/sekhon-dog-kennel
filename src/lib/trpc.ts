import type { AppRouter } from "@/server/api/root";
import { appRouter } from "@/server/api/root";
import { createContext } from "@/server/api/trpc";
import { QueryCache, QueryClient } from "@tanstack/react-query";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { createTRPCClient, httpBatchLink, loggerLink, unstable_localLink } from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import superjson from "superjson";

const getBaseUrl = () => {
  if (typeof window !== "undefined") return window.location.origin;
  return "http://localhost:5173";
};

export const makeTRPCClient = createIsomorphicFn()
  .server(() => {
    return createTRPCClient<AppRouter>({
      links: [
        unstable_localLink({
          router: appRouter,
          transformer: superjson,
          createContext: () => {
            const headers = new Headers(getRequestHeaders());
            headers.set("x-trpc-source", "tanstack-start-server");
            return createContext({ headers });
          },
        }),
      ],
    });
  })
  .client(() => {
    return createTRPCClient<AppRouter>({
      links: [
        loggerLink({
          enabled: (op) => op.direction === "down" && op.result instanceof Error,
        }),
        httpBatchLink({
          transformer: superjson,
          url: `${getBaseUrl()}/api/rpc`,
          headers() {
            return { "x-trpc-source": "tanstack-start-client" };
          },
        }),
      ],
    });
  });

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 60 * 1000,
      gcTime: 5 * 60 * 1000,
    },
    dehydrate: { serializeData: superjson.serialize },
    hydrate: { deserializeData: superjson.deserialize },
  },
  queryCache: new QueryCache(),
});

const trpcClient = makeTRPCClient();

export const api = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient,
});
