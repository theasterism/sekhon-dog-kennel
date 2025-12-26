import { env } from "cloudflare:workers";
import { createFileRoute } from "@tanstack/react-router";
import { apiErrorResponse, ERROR_CODES } from "@/server/errors";

export const Route = createFileRoute("/api/images/$key")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const key = params.key;

        if (!key) {
          return apiErrorResponse(ERROR_CODES.NOT_FOUND, 404, "Image key is required.");
        }

        const object = await env.BUCKET.get(key);

        if (!object) {
          return apiErrorResponse(ERROR_CODES.NOT_FOUND, 404, "Image not found.");
        }

        const headers = new Headers();

        const contentType = object.httpMetadata?.contentType || getContentType(key);
        headers.set("Content-Type", contentType);
        headers.set("Cache-Control", "public, max-age=86400, s-maxage=31536000, immutable");
        headers.set("ETag", object.etag);
        headers.set("Content-Length", object.size.toString());

        return new Response(object.body, { headers });
      },
    },
  },
});

function getContentType(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase();
  const types: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    svg: "image/svg+xml",
    avif: "image/avif",
  };
  return types[ext || ""] || "application/octet-stream";
}
