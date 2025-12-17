import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { QueryCache, QueryClient } from "@tanstack/react-query";
import Superjson from "superjson";
import { orpcClient } from "@/server/api/orpc";

export const orpc = createTanstackQueryUtils(orpcClient);

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 60 * 1000,
      gcTime: 5 * 60 * 1000, // 5 minutes - explicit gc time for memory management
    },
    dehydrate: { serializeData: Superjson.serialize },
    hydrate: { deserializeData: Superjson.deserialize },
  },
  queryCache: new QueryCache(),
});
