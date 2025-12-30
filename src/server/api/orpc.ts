import { env } from "cloudflare:workers";
import { createORPCClient, ORPCError } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { RouterClient } from "@orpc/server";
import { createRouterClient, os } from "@orpc/server";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { appRouter } from "@/server/api/router";
import { getCurrentSession } from "../auth/session";
import { db } from "../db/client";
import { R2Storage } from "../storage/r2";

export async function createContext({ req }: { req: Request }) {
  const bucket = R2Storage({
    bucket: env.BUCKET,
  });

  const session = await getCurrentSession();

  return {
    bucket,
    db,
    images: env.IMAGE,
    req,
    session: session !== null ? { isAuthenticated: true as const } : { isAuthenticated: false as const },
  };
}

type Context = Awaited<ReturnType<typeof createContext>>;

export const o = os.$context<Context>();

export type AppRouter = typeof appRouter;

const getORPCClient = createIsomorphicFn()
  .server(() =>
    createRouterClient(appRouter, {
      context: async () =>
        createContext({
          req: getRequest(),
        }),
    }),
  )
  .client((): RouterClient<typeof appRouter> => {
    const link = new RPCLink({
      url: `${window.location.origin}/api/rpc`,
    });
    return createORPCClient(link);
  });

export const requireAuth = o.middleware(async ({ context, next }) => {
  if (!context.session.isAuthenticated) {
    throw new ORPCError("UNAUTHORIZED", {
      message: "You must be signed in to access this resource.",
    });
  }

  return next();
});

export const orpcClient: RouterClient<AppRouter> = getORPCClient();
