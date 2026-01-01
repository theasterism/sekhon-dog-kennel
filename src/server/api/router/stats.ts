import { and, count, eq, isNotNull, or } from "drizzle-orm";
import { ApplicationTable, DogTable } from "@/server/db/schema";
import { Result } from "@/utils/result";
import { protectedProcedure } from "../trpc";

export const stats = protectedProcedure.query(async ({ ctx }) => {
  const { db } = ctx;

  const result = await Result.tryCatchAsync(
    async () => {
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
    },
    (e) => ({ code: "DB_ERROR" as const, message: "Failed to get count", cause: e }),
  );

  if (result.isErr()) throw result.error;

  return result.value;
});
