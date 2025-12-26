import { env } from "cloudflare:workers";
import { createMiddleware } from "@tanstack/react-start";

export const authRatelimitMiddleware = createMiddleware().server(async ({ request, next }) => {
  const isDev = env.NODE_ENV !== "production";

  // CSRF protection: Verify Origin header for state-changing requests
  if (request.method === "POST") {
    const origin = request.headers.get("Origin");
    const host = request.headers.get("Host");

    if (!isDev && origin) {
      const originHost = new URL(origin).host;
      if (originHost !== host) {
        return new Response(
          JSON.stringify({
            error: {
              code: "FORBIDDEN",
              message: "Invalid request origin.",
            },
          }),
          { status: 403 },
        );
      }
    }
  }

  if (isDev) {
    return await next();
  }

  const clientIP =
    request.headers.get("X-Real-Ip") ||
    request.headers.get("Cf-Connecting-Ip") ||
    request.headers.get("X-Forwarded-For");

  if (!clientIP) {
    return new Response(
      JSON.stringify({
        error: {
          code: "BAD_REQUEST",
          message: "Unable to determine client identity.",
        },
      }),
      {
        status: 400,
      },
    );
  }

  const { success } = await env.AUTH_RATELIMIT.limit({
    key: `ip:${clientIP}`,
  });

  if (!success) {
    return new Response(
      JSON.stringify({
        error: {
          code: "TOO_MANY_REQUESTS",
          message: "Rate limit exceeded. Please retry later.",
        },
      }),
      {
        status: 429,
      },
    );
  }

  return await next();
});
