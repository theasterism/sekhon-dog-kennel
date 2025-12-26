import { createFileRoute } from "@tanstack/react-router";
import { hashPassword } from "@/server/auth/hash";
import { authRatelimitMiddleware } from "@/server/auth/middleware";
import { createSession, setSessionCookie } from "@/server/auth/session";
import { db } from "@/server/db/client";
import { UserTable } from "@/server/db/schema";
import { AuthSetupSchema } from "@/utils/validations/auth";

export const Route = createFileRoute("/api/auth/setup")({
  server: {
    middleware: [authRatelimitMiddleware],
    handlers: {
      POST: async ({ request }) => {
        const body = await request.json();

        const credentials = AuthSetupSchema.safeParse(body);

        if (credentials.success) {
          // Check if setup is already complete
          const existingUsers = await db.select({ id: UserTable.id }).from(UserTable).limit(1);
          if (existingUsers.length > 0) {
            return new Response(
              JSON.stringify({
                error: {
                  code: "CONFLICT",
                  message: "Setup has already been completed.",
                },
              }),
              { status: 409 },
            );
          }

          const passwordHash = await hashPassword(credentials.data.password);

          const [user] = await db
            .insert(UserTable)
            .values({
              username: credentials.data.username,
              passwordHash,
            })
            .returning();

          const session = await createSession(user.id);

          setSessionCookie(session.id);

          return Response.json({
            ok: true,
          });
        }

        return new Response(
          JSON.stringify({
            error: {
              code: "BAD_REQUEST",
              message: `Invalid request payload: ${credentials.error?.message}`,
            },
          }),
          {
            status: 400,
          },
        );
      },
    },
  },
});
