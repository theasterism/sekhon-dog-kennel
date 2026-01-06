import { QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { useEffect } from "react";
import superjson from "superjson";
import { ErrorComponent } from "./components/error-component";
import { NotFoundComponent } from "./components/not-found";
import { initBroadcastListener } from "./lib/broadcast";
import { makeTRPCClient } from "./lib/trpc";
import { routeTree } from "./routeTree.gen";
import { AppRouter } from "./server/api/_app";

export function getRouter() {
  const queryClient = new QueryClient({
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

  const api = createTRPCOptionsProxy<AppRouter>({
    client: trpcClient,
    queryClient,
  });

  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    context: { queryClient, api },
    defaultPreload: "intent",
    defaultNotFoundComponent: NotFoundComponent,
    defaultErrorComponent: ({ error, reset }) => <ErrorComponent error={error} reset={reset} />,
    Wrap: ({ children }: { children: React.ReactNode }) => {
      useEffect(() => {
        initBroadcastListener(queryClient);
      }, []);

      return <>{children}</>;
    },
  });

  setupRouterSsrQueryIntegration({
    router,
    queryClient: queryClient,
  });

  return router;
}
