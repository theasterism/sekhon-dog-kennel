import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { useEffect } from "react";
import { ErrorComponent } from "./components/error-component";
import { NotFoundComponent } from "./components/not-found";
import { initBroadcastListener } from "./lib/broadcast";
import { api, queryClient } from "./lib/trpc";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
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
