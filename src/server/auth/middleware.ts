import { env } from "cloudflare:workers";
import { createMiddleware } from "@tanstack/react-start";
import { apiError, apiErrorResponse, ERROR_CODES } from "@/server/errors";

export const authRatelimitMiddleware = createMiddleware().server(async ({ request, next }) => {
  const isDev = env.NODE_ENV !== "production";

  // CSRF protection: Verify Origin header for state-changing requests
  if (request.method === "POST") {
    const origin = request.headers.get("Origin");
    const host = request.headers.get("Host");

    if (!isDev && origin) {
      const originHost = new URL(origin).host;
      if (originHost !== host) {
        return apiErrorResponse(apiError(ERROR_CODES.FORBIDDEN, 403));
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
    return apiErrorResponse(apiError(ERROR_CODES.IDENTITY_REQUIRED, 400));
  }

  const { success } = await env.AUTH_RATELIMIT.limit({
    key: `ip:${clientIP}`,
  });

  if (!success) {
    return apiErrorResponse(apiError(ERROR_CODES.RATE_LIMIT, 429));
  }

  return await next();
});
