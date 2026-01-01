import { eq } from "drizzle-orm";
import * as z from "zod";
import { protectedProcedure } from "@/server/api/trpc";
import { DogTable } from "@/server/db/schema";
import { Result } from "@/utils/result";

export const delete_ = protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
  const { db, bucket } = ctx;
  const { id } = input;

  const [dog] = await db.select({ id: DogTable.id }).from(DogTable).where(eq(DogTable.id, id));

  if (!dog) {
    throw { code: "NOT_FOUND" as const, message: "Dog not found" };
  }

  const result = await Result.tryCatchAsync(
    async () => {
      const prefix = `dogs/${id}/`;
      for await (const [key] of bucket.scan(prefix)) {
        await bucket.remove(key);
      }

      await db.delete(DogTable).where(eq(DogTable.id, id));

      return { success: true as const };
    },
    (e) => ({ code: "DELETE_ERROR" as const, message: "Failed to delete dog", cause: e }),
  );

  if (result.isErr()) throw result.error;

  return result.value;
});
