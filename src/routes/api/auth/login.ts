import { createFileRoute } from "@tanstack/react-router";
import { eq } from "drizzle-orm";
import { checkPassword } from "@/server/auth/hash";
import { authRatelimitMiddleware } from "@/server/auth/middleware";
import { createSession, setSessionCookie } from "@/server/auth/session";
import { db } from "@/server/db/client";
import { UserTable } from "@/server/db/schema";
import { apiErrorResponse, ERROR_CODES } from "@/server/errors";
import { AuthLoginSchema } from "@/utils/validations/auth";

export const Route = createFileRoute("/api/auth/login")({
  server: {
    middleware: [authRatelimitMiddleware],
    handlers: {
      POST: async ({ request }) => {
        const body = await request.json();

        const credentials = AuthLoginSchema.safeParse(body);

        if (credentials.success) {
          const [user] = await db
            .select({ id: UserTable.id, passwordHash: UserTable.passwordHash })
            .from(UserTable)
            .where(eq(UserTable.username, credentials.data.username));

          // Always perform password comparison to prevent timing attacks
          const dummyHash = "$2a$10$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
          const hashToCheck = user?.passwordHash ?? dummyHash;
          const isValid = await checkPassword(credentials.data.password, hashToCheck);

          if (!user || !isValid) {
            return apiErrorResponse(ERROR_CODES.INVALID_CREDENTIALS, 401);
          }

          const session = await createSession(user.id);
          setSessionCookie(session.id);

          return Response.json({ ok: true });
        }

        return apiErrorResponse(ERROR_CODES.BAD_REQUEST, 400, `Invalid request payload: ${credentials.error?.message}`);
      },
    },
  },
});
