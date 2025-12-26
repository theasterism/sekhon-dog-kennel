import { createFileRoute } from "@tanstack/react-router";
import { getCookie } from "@tanstack/react-start/server";
import { authRatelimitMiddleware } from "@/server/auth/middleware";
import { deleteSession, deleteSessionCookie, SESSION_COOKIE_NAME } from "@/server/auth/session";

export const Route = createFileRoute("/api/auth/logout")({
  server: {
    middleware: [authRatelimitMiddleware],
    handlers: {
      POST: async () => {
        const sessionId = getCookie(SESSION_COOKIE_NAME);

        if (sessionId) {
          await deleteSession(sessionId);
        }

        deleteSessionCookie();

        return Response.json({ ok: true });
      },
    },
  },
});
