import { eq } from "drizzle-orm";
import * as z from "zod";
import { protectedProcedure } from "@/server/api/trpc";
import { ApplicationTable } from "@/server/db/schema";
import { Result } from "@/utils/result";

const ListApplicationsSchema = z.object({
  status: z.enum(["pending", "approved", "rejected"]).optional(),
  dogId: z.string().optional(),
});

export const list = protectedProcedure.input(ListApplicationsSchema).query(async ({ ctx, input }) => {
  const { db } = ctx;

  const result = await Result.tryCatchAsync(
    async () => {
      let query = db.select().from(ApplicationTable).$dynamic();

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

  return result;
});
