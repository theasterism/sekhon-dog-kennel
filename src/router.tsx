import { QueryClientProvider } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { ErrorComponent } from "./components/error-component";
import { NotFoundComponent } from "./components/not-found";
import { routeTree } from "./routeTree.gen";
import { api, queryClient } from "./lib/trpc";

export function getRouter() {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    context: { queryClient, api },
    defaultPreload: "intent",
    defaultNotFoundComponent: NotFoundComponent,
    defaultErrorComponent: ({ error, reset }) => <ErrorComponent error={error} reset={reset} />,
    Wrap: ({ children }) => {
      return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    },
  });

  setupRouterSsrQueryIntegration({
    router,
    queryClient: queryClient,
  });

  return router;
}
