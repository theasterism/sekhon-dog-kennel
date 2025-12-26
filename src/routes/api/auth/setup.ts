import { createFileRoute } from "@tanstack/react-router";
import { hashPassword } from "@/server/auth/hash";
import { authRatelimitMiddleware } from "@/server/auth/middleware";
import { createSession, setSessionCookie } from "@/server/auth/session";
import { db } from "@/server/db/client";
import { UserTable } from "@/server/db/schema";
import { apiError, apiErrorResponse, ERROR_CODES } from "@/server/errors";
import { Result } from "@/utils/result";
import { AuthSetupSchema } from "@/utils/validations/auth";

export const Route = createFileRoute("/api/auth/setup")({
  server: {
    middleware: [authRatelimitMiddleware],
    handlers: {
      POST: async ({ request }) => {
        const body = await request.json();
        const credentials = AuthSetupSchema.safeParse(body);

        if (!credentials.success) {
          return apiErrorResponse(apiError(ERROR_CODES.BAD_REQUEST, 400, `Invalid request payload: ${credentials.error?.message}`));
        }

        const existingResult = await Result.tryCatchAsync(
          () => db.select({ id: UserTable.id }).from(UserTable).limit(1),
          () => apiError(ERROR_CODES.DATABASE_ERROR, 500),
        );

        if (existingResult.isErr()) {
          return apiErrorResponse(existingResult.error);
        }

        if (existingResult.value.length > 0) {
          return apiErrorResponse(apiError(ERROR_CODES.SETUP_COMPLETE, 409));
        }

        const passwordHash = await hashPassword(credentials.data.password);

        const insertResult = await Result.tryCatchAsync(
          () => db.insert(UserTable).values({ username: credentials.data.username, passwordHash }).returning(),
          () => apiError(ERROR_CODES.DATABASE_ERROR, 500),
        );

        if (insertResult.isErr()) {
          return apiErrorResponse(insertResult.error);
        }

        const user = insertResult.value[0];
        const sessionResult = await Result.tryCatchAsync(
          () => createSession(user.id),
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
