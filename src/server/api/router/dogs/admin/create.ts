import { protectedProcedure } from "@/server/api/trpc";
import { DogTable } from "@/server/db/schema";
import { createId } from "@/server/utils";
import { Result } from "@/utils/result";

export const create = protectedProcedure.mutation(async ({ ctx }) => {
  const { db } = ctx;
  const id = createId();

  const result = await Result.tryCatchAsync(
    async () => {
      await db.insert(DogTable).values({ id });
      return { id };
    },
    (e) => ({ code: "DB_ERROR" as const, message: "Failed to create dog", cause: e }),
  );

  return result;
});
