import { eq } from "drizzle-orm";
import * as z from "zod";
import { protectedProcedure } from "@/server/api/trpc";
import { ApplicationTable, DogTable } from "@/server/db/schema";
import { Result } from "@/utils/result";

export const get = protectedProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
  const { db } = ctx;

  const result = await Result.tryCatchAsync(
    async () => {
      const [application] = await db
        .select({
          id: ApplicationTable.id,
          dogId: ApplicationTable.dogId,
          applicantName: ApplicationTable.applicantName,
          email: ApplicationTable.email,
          phone: ApplicationTable.phone,
          address: ApplicationTable.address,
          status: ApplicationTable.status,
          createdAt: ApplicationTable.createdAt,
          dogName: DogTable.name,
        })
        .from(ApplicationTable)
        .leftJoin(DogTable, eq(ApplicationTable.dogId, DogTable.id))
        .where(eq(ApplicationTable.id, input.id));

      if (!application) {
        return null;
      }

      return application;
    },
    (e) => ({ code: "DB_ERROR" as const, message: "Failed to get application", cause: e }),
  );

  if (result.isOk() && result.value === null) {
    return Result.err({ code: "NOT_FOUND" as const, message: "Application not found" });
  }

  return result;
});
