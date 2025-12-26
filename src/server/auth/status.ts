import { createServerFn } from "@tanstack/react-start";
import { db } from "../db/client";
import { UserTable } from "../db/schema";
import { getCurrentSession } from "./session";

export type AuthError = { type: "DatabaseError"; message: string } | { type: "SessionError"; message: string };

export type AuthStatus = {
  isSetupComplete: boolean;
  session: { isAuthenticated: false } | { isAuthenticated: true; id: string; expiresAt: Date };
};

export type AuthResult = { ok: true; data: AuthStatus } | { ok: false; error: AuthError };

async function getAuthStatusInternal(): Promise<AuthResult> {
  try {
    const users = await db.select({ id: UserTable.id }).from(UserTable).limit(1);
    const isSetupComplete = users.length > 0;

    const session = await getCurrentSession();
    const isAuthenticated = session !== null;

    return {
      ok: true,
      data: {
        isSetupComplete,
        session: isAuthenticated
          ? { isAuthenticated: true as const, ...session }
          : { isAuthenticated: false as const },
      },
    };
  } catch (error) {
    console.error("[Auth:getAuthStatus] Database/session error", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return {
      ok: false,
      error: { type: "DatabaseError", message: error instanceof Error ? error.message : String(error) },
    };
  }
}

export const getAuthStatus = createServerFn({ method: "GET" }).handler(async () => {
  return getAuthStatusInternal();
});
