import { env } from "cloudflare:workers";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { getCurrentSession } from "../auth/session";
import { db } from "../db/client";
import { R2Storage } from "../storage/r2";

export async function createContext({ headers }: { headers: Headers }) {
  const bucket = R2Storage({
    bucket: env.BUCKET,
  });

  const session = await getCurrentSession();

  return {
    bucket,
    db,
    headers,
    images: env.IMAGE,
    session: session !== null ? { isAuthenticated: true as const } : { isAuthenticated: false as const },
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.session.isAuthenticated) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be signed in to access this resource.",
    });
  }

  return next();
});
