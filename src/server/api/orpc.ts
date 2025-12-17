import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { RouterClient } from "@orpc/server";
import { createRouterClient } from "@orpc/server";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";

import { appRouter } from "@/server/api/router";

const getORPCClient = createIsomorphicFn()
  .server(() =>
    createRouterClient(appRouter, {
      context: () => ({
        headers: getRequestHeaders(),
      }),
    }),
  )
  .client((): RouterClient<typeof appRouter> => {
    const link = new RPCLink({
      url: `${window.location.origin}/api/rpc`,
    });
    return createORPCClient(link);
  });

export type AppRouter = typeof appRouter;

export const orpcClient: RouterClient<AppRouter> = getORPCClient();
