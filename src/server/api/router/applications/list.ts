import { desc, eq } from "drizzle-orm";
import * as z from "zod";
import { protectedProcedure } from "@/server/api/trpc";
import { ApplicationTable, DogTable } from "@/server/db/schema";
import { Result } from "@/utils/result";

const ListApplicationsSchema = z.object({
  status: z.enum(["pending", "approved", "rejected"]).nullish(),
  dogId: z.string().nullish(),
});

export const list = protectedProcedure.input(ListApplicationsSchema).query(async ({ ctx, input }) => {
  const { db } = ctx;

  const result = await Result.tryCatchAsync(
    async () => {
      let query = db
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
        .orderBy(desc(ApplicationTable.createdAt))
        .$dynamic();

      if (input.status) {
        query = query.where(eq(ApplicationTable.status, input.status));
      }

      if (input.dogId) {
        query = query.where(eq(ApplicationTable.dogId, input.dogId));
      }

      return await query;
    },
    (e) => ({ code: "DB_ERROR" as const, message: "Failed to list applications", cause: e }),
  );

  if (result.isErr()) throw result.error;

  return result.value;
});
