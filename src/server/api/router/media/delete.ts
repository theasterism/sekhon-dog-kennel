import { env } from "cloudflare:workers";
import { eq } from "drizzle-orm";
import * as z from "zod";
import { protectedProcedure } from "@/server/api/trpc";
import { DogImageTable } from "@/server/db/schema";

export const deleteMedia = protectedProcedure
  .input(
    z.object({
      key: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const { db } = ctx;
    const { key } = input;

    // Delete from R2
    await env.BUCKET.delete(key);

    // Also delete related size variants if this is a base image
    if (key.endsWith(".webp") && !key.includes("_md") && !key.includes("_sm")) {
      const baseKey = key.replace(".webp", "");
      await Promise.all([env.BUCKET.delete(`${baseKey}_md.webp`), env.BUCKET.delete(`${baseKey}_sm.webp`)]);
    }

    // Delete from database if it exists
    await db.delete(DogImageTable).where(eq(DogImageTable.r2Key, key));

    return { success: true };
  });
