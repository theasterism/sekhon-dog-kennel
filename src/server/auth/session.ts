import { env } from "cloudflare:workers";
import { deleteCookie, getCookie, setCookie } from "@tanstack/react-start/server";
import { eq } from "drizzle-orm";
import { db } from "../db/client";
import { SessionTable } from "../db/schema";
import { computeShaHash } from "../hash/sha";
import { generateRandomString } from "../utils";

export const SESSION_COOKIE_NAME = "__session";

const SESSION_EXPIRES_IN = 60 * 60 * 24 * 30; // Default to 30 days

export async function createSession(userId: number) {
  const now = new Date();

  const sessionId = generateRandomString(64);
  const sessionIdHash = await computeShaHash("SHA-256", sessionId);

  // Calculate expiration date (sessionExpiresIn is in seconds, so multiply by 1000 for ms)
  const expiresAt = new Date(now.getTime() + SESSION_EXPIRES_IN * 1000);

  await db.insert(SessionTable).values({
    expiresAt,
    id: sessionIdHash,
    userId,
  });


  return {
    id: sessionId,
    expiresAt,
  };
}

export function setSessionCookie(sessionToken: string) {
  return setCookie(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
    maxAge: SESSION_EXPIRES_IN,
  });
}

export async function getCurrentSession() {
  const sessionId = getCookie(SESSION_COOKIE_NAME);
  if (!sessionId) return null;

  const sessionIdHash = await computeShaHash("SHA-256", sessionId);

  const [session] = await db
    .select({
      id: SessionTable.id,
      expiresAt: SessionTable.expiresAt,
    })
    .from(SessionTable)
    .where(eq(SessionTable.id, sessionIdHash));

  if (!session) {
    return null;
  }

  if (Date.now() >= session.expiresAt.getTime()) {
    await deleteSession(session.id);
    return null;
  }

  // Refresh session if more than halfway through its lifetime
  const halfwayPoint = session.expiresAt.getTime() - (SESSION_EXPIRES_IN * 1000) / 2;
  if (Date.now() >= halfwayPoint) {
    try {
      const newExpiresAt = new Date(Date.now() + SESSION_EXPIRES_IN * 1000);
      await db.update(SessionTable).set({ expiresAt: newExpiresAt }).where(eq(SessionTable.id, session.id));
      setSessionCookie(sessionId);
    } catch {
      // Silently fail - session is still valid, just not refreshed
    }
  }

  return session;
}


export async function deleteSession(rawSessionId: string) {
  const sessionIdHash = await computeShaHash("SHA-256", rawSessionId);
  await db.delete(SessionTable).where(eq(SessionTable.id, sessionIdHash));
}

export function deleteSessionCookie() {
  deleteCookie(SESSION_COOKIE_NAME, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
    maxAge: 0,
  });
}
