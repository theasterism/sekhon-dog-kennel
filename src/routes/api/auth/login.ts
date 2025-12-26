import { createFileRoute } from "@tanstack/react-router";
import { eq } from "drizzle-orm";
import { checkPassword } from "@/server/auth/hash";
import { authRatelimitMiddleware } from "@/server/auth/middleware";
import { createSession, setSessionCookie } from "@/server/auth/session";
import { db } from "@/server/db/client";
import { UserTable } from "@/server/db/schema";
import { apiError, apiErrorResponse, ERROR_CODES } from "@/server/errors";
import { Result } from "@/utils/result";
import { AuthLoginSchema } from "@/utils/validations/auth";

export const Route = createFileRoute("/api/auth/login")({
  server: {
    middleware: [authRatelimitMiddleware],
    handlers: {
      POST: async ({ request }) => {
        const body = await request.json();
        const credentials = AuthLoginSchema.safeParse(body);

        if (!credentials.success) {
          return apiErrorResponse(apiError(ERROR_CODES.BAD_REQUEST, 400, `Invalid request payload: ${credentials.error?.message}`));
        }

        const userResult = await Result.tryCatchAsync(
          () => db.select({ id: UserTable.id, passwordHash: UserTable.passwordHash })
            .from(UserTable)
            .where(eq(UserTable.username, credentials.data.username))
            .then(users => users[0]),
          () => apiError(ERROR_CODES.DATABASE_ERROR, 500),
        );

        if (userResult.isErr()) {
          return apiErrorResponse(userResult.error);
        }

        // Always perform password comparison to prevent timing attacks
        const dummyHash = "$2a$10$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
        const hashToCheck = userResult.value?.passwordHash ?? dummyHash;
        const isValid = await checkPassword(credentials.data.password, hashToCheck);

        if (!userResult.value || !isValid) {
          return apiErrorResponse(apiError(ERROR_CODES.INVALID_CREDENTIALS, 401));
        }

        const sessionResult = await Result.tryCatchAsync(
          () => createSession(userResult.value.id),
          () => apiError(ERROR_CODES.SERVER_ERROR, 500),
        );

        if (sessionResult.isErr()) {
          return apiErrorResponse(sessionResult.error);
        }

        setSessionCookie(sessionResult.value.id);
        return Response.json({ ok: true });
      },
    },
  },
});
