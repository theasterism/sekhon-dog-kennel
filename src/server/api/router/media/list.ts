import { env } from "cloudflare:workers";
import * as z from "zod";
import { protectedProcedure } from "@/server/api/trpc";

export const listMedia = protectedProcedure
  .input(
    z.object({
      cursor: z.string().optional(),
      limit: z.number().min(1).max(1000).default(500),
      prefix: z.string().optional(),
    }),
  )
  .query(async ({ input }) => {
    const { cursor, limit, prefix } = input;

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
