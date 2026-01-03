import { TRPCError } from "@trpc/server";
import { and, count, eq, isNotNull, or } from "drizzle-orm";
import { ApplicationTable, DogTable } from "@/server/db/schema";
import { protectedProcedure } from "../trpc";

export const stats = protectedProcedure.query(async ({ ctx }) => {
  const { db } = ctx;

  try {
    const [applicationCount] = await db
      .select({
        count: count(),
      })
      .from(ApplicationTable)
      .where(eq(ApplicationTable.status, "pending"));

    const [dogCount] = await db
      .select({
        count: count(),
      })
      .from(DogTable)
      .where(
        and(isNotNull(DogTable.publishedAt), or(eq(DogTable.status, "available"), eq(DogTable.status, "reserved"))),
      );

    return {
      applications: applicationCount.count,
      dogs: dogCount.count,
    };
  } catch (e) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to get stats",
      cause: e,
    });
  }
});
