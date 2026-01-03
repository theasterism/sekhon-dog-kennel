import { env } from "cloudflare:workers";
import * as z from "zod";
import { protectedProcedure } from "@/server/api/trpc";

export const listMedia = protectedProcedure
  .input(
    z.object({
      cursor: z.string().nullish(),
      limit: z.number().min(1).max(1000).default(500),
      prefix: z.string().nullish(),
    }),
  )
  .query(async ({ input }) => {
    const { limit } = input;
    const cursor = input.cursor ?? undefined;
    const prefix = input.prefix ?? undefined;

    const result = await env.BUCKET.list({
      cursor,
      limit,
      prefix,
      include: ["httpMetadata", "customMetadata"],
    });

    const items = result.objects.map((obj) => ({
      key: obj.key,
      size: obj.size,
      etag: obj.etag,
      uploaded: obj.uploaded,
      httpMetadata: obj.httpMetadata,
      customMetadata: obj.customMetadata,
    }));

    return {
      items,
      nextCursor: result.truncated ? result.cursor : undefined,
    };
  });
